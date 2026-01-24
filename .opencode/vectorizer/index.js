// OpenCode Vectorizer - Semantic Code Search with Multi-Index Support
// Part of @comfanion/workflow

import { pipeline, env } from '@xenova/transformers';
import * as lancedb from 'vectordb';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// Suppress transformers.js logs unless DEBUG is set
const DEBUG = process.env.DEBUG?.includes('vectorizer') || process.env.DEBUG === '*';
if (!DEBUG) {
  env.allowLocalModels = true;
  env.useBrowserCache = false;
  // Disable progress callbacks and logs
  env.logLevel = 'error';
}

/**
 * Index presets for different content types
 */
const INDEX_PRESETS = {
  code: {
    pattern: '**/*.{js,ts,jsx,tsx,mjs,cjs,py,go,rs,java,kt,swift,c,cpp,h,hpp,cs,rb,php,scala,clj}',
    ignore: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/build/**', '**/.opencode/**', '**/docs/**', '**/vendor/**', '**/__pycache__/**'],
    description: 'Source code files (excludes docs, vendor, node_modules)'
  },
  docs: {
    pattern: 'docs/**/*.{md,mdx,txt,rst,adoc}',
    ignore: [],
    description: 'Documentation in docs/ folder'
  },
  config: {
    pattern: '**/*.{yaml,yml,json,toml,ini,env,xml}',
    ignore: ['**/node_modules/**', '**/.git/**', '**/.opencode/**'],
    description: 'Configuration files'
  },
  all: {
    pattern: '**/*.{js,ts,jsx,tsx,mjs,cjs,py,go,rs,java,kt,swift,c,cpp,h,hpp,cs,rb,php,scala,clj,md,mdx,txt,rst,adoc,yaml,yml,json,toml}',
    ignore: ['**/node_modules/**', '**/.git/**', '**/.opencode/**'],
    description: 'All supported files'
  }
};

class CodebaseIndexer {
  /**
   * @param {string} projectRoot - Project root directory
   * @param {string} indexName - Name of the index (e.g., 'code', 'docs', 'config')
   */
  constructor(projectRoot, indexName = 'code') {
    this.root = projectRoot;
    this.indexName = indexName;
    this.baseDir = path.join(projectRoot, '.opencode', 'vectors');
    this.cacheDir = path.join(this.baseDir, indexName);
    this.model = null;
    this.db = null;
    this.hashes = {};
  }

  async init() {
    await fs.mkdir(this.cacheDir, { recursive: true });
    this.db = await lancedb.connect(path.join(this.cacheDir, 'lancedb'));
    await this.loadHashes();
    return this;
  }

  async loadModel() {
    if (!this.model) {
      if (DEBUG) console.log('[vectorizer] Loading embedding model...');
      this.model = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
        progress_callback: DEBUG ? undefined : null  // Suppress progress bar unless DEBUG
      });
      if (DEBUG) console.log('[vectorizer] Model loaded');
    }
    return this.model;
  }

  async unloadModel() {
    this.model = null;
    if (global.gc) global.gc();
  }

  async loadHashes() {
    try {
      const hashFile = path.join(this.cacheDir, 'hashes.json');
      const data = await fs.readFile(hashFile, 'utf8');
      this.hashes = JSON.parse(data);
    } catch {
      this.hashes = {};
    }
  }

  async saveHashes() {
    const hashFile = path.join(this.cacheDir, 'hashes.json');
    await fs.writeFile(hashFile, JSON.stringify(this.hashes, null, 2));
  }

  fileHash(content) {
    return crypto.createHash('md5').update(content).digest('hex');
  }

  async embed(text) {
    const model = await this.loadModel();
    const result = await model(text, { pooling: 'mean', normalize: true });
    return Array.from(result.data);
  }

  /**
   * Chunk code into smaller pieces for embedding
   * Tries to split on function/class boundaries when possible
   */
  chunkCode(content, maxChars = 1500) {
    const chunks = [];
    const lines = content.split('\n');
    let current = [];
    let currentLen = 0;

    for (const line of lines) {
      if (currentLen + line.length > maxChars && current.length > 0) {
        chunks.push(current.join('\n'));
        current = [];
        currentLen = 0;
      }
      current.push(line);
      currentLen += line.length + 1;
    }
    
    if (current.length > 0) {
      chunks.push(current.join('\n'));
    }
    
    return chunks;
  }

  /**
   * Check if file needs re-indexing based on content hash
   */
  needsIndex(filePath, content) {
    const relPath = path.relative(this.root, filePath);
    const currentHash = this.fileHash(content);
    return this.hashes[relPath] !== currentHash;
  }

  /**
   * Index a single file
   * Returns true if file was indexed, false if skipped (unchanged)
   */
  async indexFile(filePath) {
    const relPath = path.relative(this.root, filePath);
    
    let content;
    try {
      content = await fs.readFile(filePath, 'utf8');
    } catch (e) {
      console.warn(`Cannot read ${relPath}: ${e.message}`);
      return false;
    }

    const hash = this.fileHash(content);

    // Skip if unchanged
    if (this.hashes[relPath] === hash) {
      return false;
    }

    const chunks = this.chunkCode(content);
    const data = [];

    for (let i = 0; i < chunks.length; i++) {
      const embedding = await this.embed(chunks[i]);
      data.push({
        file: relPath,
        chunk_index: i,
        content: chunks[i],
        vector: embedding
      });
    }

    // Add to database
    const tableName = 'chunks';
    const tables = await this.db.tableNames();
    if (tables.includes(tableName)) {
      const table = await this.db.openTable(tableName);
      // Note: LanceDB doesn't support delete by filter in all versions
      // So we just add new chunks (may have duplicates until reindex --force)
      await table.add(data);
    } else {
      await this.db.createTable(tableName, data);
    }

    // Update hash cache
    this.hashes[relPath] = hash;
    await this.saveHashes();
    
    return true;
  }

  /**
   * Semantic search across indexed codebase
   */
  async search(query, limit = 5) {
    const tableName = 'chunks';
    const tables = await this.db.tableNames();
    if (!tables.includes(tableName)) {
      return [];
    }

    const queryEmbedding = await this.embed(query);
    const table = await this.db.openTable(tableName);
    const results = await table.search(queryEmbedding).limit(limit).execute();
    
    return results;
  }

  /**
   * Check if index needs full reindex (files don't match current patterns)
   * @param {string[]} extraIgnore - Additional patterns to ignore
   * Returns { needsReindex, reason, currentCount, expectedCount }
   */
  async checkHealth(extraIgnore = []) {
    const { glob } = await import('glob');
    const preset = INDEX_PRESETS[this.indexName] || INDEX_PRESETS.code;
    
    // Combine preset ignore with extra ignore patterns
    const ignore = [...(preset.ignore || []), ...extraIgnore.map(p => `**/${p}/**`)];
    
    const expectedFiles = await glob(preset.pattern, { 
      cwd: this.root, 
      nodir: true,
      ignore
    });
    
    const indexedFiles = Object.keys(this.hashes);
    const currentCount = indexedFiles.length;
    const expectedCount = expectedFiles.length;
    
    // Check if counts differ significantly (>20% difference or index is empty)
    const diff = Math.abs(currentCount - expectedCount);
    const threshold = Math.max(5, expectedCount * 0.2); // 20% or at least 5 files
    
    if (currentCount === 0 && expectedCount > 0) {
      return { needsReindex: true, reason: 'empty', currentCount, expectedCount };
    }
    
    if (diff > threshold) {
      return { needsReindex: true, reason: 'mismatch', currentCount, expectedCount };
    }
    
    return { needsReindex: false, reason: 'ok', currentCount, expectedCount };
  }

  /**
   * Freshen index - check for stale files and reindex only changed ones
   * Returns { checked, updated, deleted } counts
   */
  async freshen() {
    let checked = 0;
    let updated = 0;
    let deleted = 0;

    const indexedFiles = Object.keys(this.hashes);
    
    for (const relPath of indexedFiles) {
      checked++;
      const filePath = path.join(this.root, relPath);
      
      try {
        const content = await fs.readFile(filePath, 'utf8');
        const currentHash = this.fileHash(content);
        
        if (this.hashes[relPath] !== currentHash) {
          // File changed - reindex it
          await this.indexFile(filePath);
          updated++;
        }
      } catch (e) {
        // File deleted or unreadable - remove from index
        delete this.hashes[relPath];
        deleted++;
      }
    }
    
    if (deleted > 0) {
      await this.saveHashes();
    }
    
    return { checked, updated, deleted };
  }

  /**
   * Index all files matching the preset pattern
   * @param {function} onProgress - Optional callback(indexed, total, currentFile)
   * @param {string[]} extraIgnore - Additional patterns to ignore
   * Returns { indexed, skipped } counts
   */
  async indexAll(onProgress = null, extraIgnore = []) {
    const { glob } = await import('glob');
    const preset = INDEX_PRESETS[this.indexName] || INDEX_PRESETS.code;
    
    // Combine preset ignore with extra ignore patterns
    const ignore = [...(preset.ignore || []), ...extraIgnore.map(p => `**/${p}/**`)];
    
    const files = await glob(preset.pattern, { 
      cwd: this.root, 
      nodir: true,
      ignore
    });
    
    let indexed = 0;
    let skipped = 0;
    
    for (const relPath of files) {
      const filePath = path.join(this.root, relPath);
      try {
        const wasIndexed = await this.indexFile(filePath);
        if (wasIndexed) {
          indexed++;
          if (onProgress) onProgress(indexed, files.length, relPath);
        } else {
          skipped++;
        }
      } catch (e) {
        skipped++;
      }
    }
    
    return { indexed, skipped, total: files.length };
  }

  /**
   * Index a single file by path (convenience method)
   */
  async indexSingleFile(filePath) {
    const absPath = path.isAbsolute(filePath) 
      ? filePath 
      : path.join(this.root, filePath);
    return await this.indexFile(absPath);
  }

  /**
   * Get indexing statistics for this index
   */
  async getStats() {
    const fileCount = Object.keys(this.hashes).length;
    let chunkCount = 0;
    
    try {
      const tables = await this.db.tableNames();
      if (tables.includes('chunks')) {
        const table = await this.db.openTable('chunks');
        chunkCount = await table.countRows();
      }
    } catch {}

    const preset = INDEX_PRESETS[this.indexName];
    
    return { 
      indexName: this.indexName,
      description: preset?.description || 'Custom index',
      fileCount, 
      chunkCount 
    };
  }

  /**
   * Get statistics for all indexes
   */
  async getAllStats() {
    const stats = [];
    
    try {
      const entries = await fs.readdir(this.baseDir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isDirectory() && entry.name !== 'lancedb') {
          try {
            const indexer = await new CodebaseIndexer(this.root, entry.name).init();
            const stat = await indexer.getStats();
            if (stat.fileCount > 0 || stat.chunkCount > 0) {
              stats.push(stat);
            }
          } catch {}
        }
      }
    } catch {}
    
    return stats;
  }

  /**
   * Clear this index's data
   */
  async clear() {
    await fs.rm(this.cacheDir, { recursive: true, force: true });
    this.hashes = {};
    await this.init();
  }

  /**
   * Clear all indexes
   */
  async clearAll() {
    await fs.rm(this.baseDir, { recursive: true, force: true });
    this.hashes = {};
    await this.init();
  }

  /**
   * List all available index names
   */
  async listIndexes() {
    const indexes = [];
    
    try {
      const entries = await fs.readdir(this.baseDir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isDirectory() && entry.name !== 'lancedb') {
          indexes.push(entry.name);
        }
      }
    } catch {}
    
    return indexes;
  }
}

export { CodebaseIndexer, INDEX_PRESETS };
