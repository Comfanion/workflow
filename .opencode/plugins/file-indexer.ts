import type { Plugin } from "@opencode-ai/plugin"
import path from "path"
import fs from "fs/promises"

/**
 * File Indexer Plugin
 * 
 * Automatically reindexes changed files for semantic search.
 * 
 * Configuration in .opencode/config.yaml:
 *   vectorizer:
 *     enabled: true       # Master switch
 *     auto_index: true    # Enable this plugin
 *     debounce_ms: 2000   # Wait time before indexing
 * 
 * Debug mode: set DEBUG=file-indexer or DEBUG=* to see logs
 */

const DEBUG = process.env.DEBUG?.includes('file-indexer') || process.env.DEBUG === '*'

// Default config (used if config.yaml is missing or invalid)
const DEFAULT_CONFIG = {
  enabled: true,
  auto_index: true,
  debounce_ms: 2000,
  indexes: {
    code: { enabled: true, extensions: ['.js', '.ts', '.jsx', '.tsx', '.py', '.go', '.rs', '.java', '.kt', '.swift', '.c', '.cpp', '.h', '.hpp', '.cs', '.rb', '.php', '.scala', '.clj'] },
    docs: { enabled: true, extensions: ['.md', '.mdx', '.txt', '.rst', '.adoc'] },
    config: { enabled: false, extensions: ['.yaml', '.yml', '.json', '.toml', '.ini', '.xml'] },
  },
  exclude: ['node_modules', '.git', 'dist', 'build', '.opencode/vectors', '.opencode/vectorizer', 'vendor', '__pycache__'],
}

interface VectorizerConfig {
  enabled: boolean
  auto_index: boolean
  debounce_ms: number
  indexes: Record<string, { enabled: boolean; extensions: string[] }>
  exclude: string[]
}

const pendingFiles: Map<string, { indexName: string; timestamp: number }> = new Map()

function debug(msg: string): void {
  if (DEBUG) console.log(`[file-indexer] ${msg}`)
}

async function loadConfig(projectRoot: string): Promise<VectorizerConfig> {
  try {
    const configPath = path.join(projectRoot, ".opencode", "config.yaml")
    const content = await fs.readFile(configPath, 'utf8')
    
    // Simple YAML parsing for vectorizer section
    const vectorizerMatch = content.match(/vectorizer:\s*\n([\s\S]*?)(?=\n[a-z_]+:|$)/i)
    if (!vectorizerMatch) {
      debug('No vectorizer section in config.yaml, using defaults')
      return DEFAULT_CONFIG
    }
    
    const section = vectorizerMatch[1]
    
    // Parse enabled
    const enabledMatch = section.match(/^\s+enabled:\s*(true|false)/m)
    const enabled = enabledMatch ? enabledMatch[1] === 'true' : DEFAULT_CONFIG.enabled
    
    // Parse auto_index
    const autoIndexMatch = section.match(/^\s+auto_index:\s*(true|false)/m)
    const auto_index = autoIndexMatch ? autoIndexMatch[1] === 'true' : DEFAULT_CONFIG.auto_index
    
    // Parse debounce_ms
    const debounceMatch = section.match(/^\s+debounce_ms:\s*(\d+)/m)
    const debounce_ms = debounceMatch ? parseInt(debounceMatch[1]) : DEFAULT_CONFIG.debounce_ms
    
    // Parse exclude array
    const excludeMatch = section.match(/exclude:\s*\n((?:\s+-\s+.+\n?)+)/m)
    let exclude = DEFAULT_CONFIG.exclude
    if (excludeMatch) {
      exclude = excludeMatch[1].match(/-\s+(.+)/g)?.map(m => m.replace(/^-\s+/, '').trim()) || DEFAULT_CONFIG.exclude
    }
    
    return { enabled, auto_index, debounce_ms, indexes: DEFAULT_CONFIG.indexes, exclude }
  } catch (e) {
    debug(`Failed to load config: ${(e as Error).message}`)
    return DEFAULT_CONFIG
  }
}

function getIndexForFile(filePath: string, config: VectorizerConfig): string | null {
  const ext = path.extname(filePath).toLowerCase()
  for (const [indexName, indexConfig] of Object.entries(config.indexes)) {
    if (indexConfig.enabled && indexConfig.extensions.includes(ext)) {
      return indexName
    }
  }
  return null
}

function isExcluded(relativePath: string, config: VectorizerConfig): boolean {
  return config.exclude.some(pattern => relativePath.startsWith(pattern))
}

async function isVectorizerInstalled(projectRoot: string): Promise<boolean> {
  try {
    await fs.access(path.join(projectRoot, ".opencode", "vectorizer", "node_modules"))
    return true
  } catch {
    return false
  }
}

async function processPendingFiles(projectRoot: string, config: VectorizerConfig): Promise<void> {
  if (pendingFiles.size === 0) return
  
  const now = Date.now()
  const filesToProcess: Map<string, string[]> = new Map()
  
  for (const [filePath, info] of pendingFiles.entries()) {
    if (now - info.timestamp >= config.debounce_ms) {
      const files = filesToProcess.get(info.indexName) || []
      files.push(filePath)
      filesToProcess.set(info.indexName, files)
      pendingFiles.delete(filePath)
    }
  }
  
  if (filesToProcess.size === 0) return
  
  debug(`Processing ${filesToProcess.size} index(es)...`)
  
  try {
    const vectorizerModule = path.join(projectRoot, ".opencode", "vectorizer", "index.js")
    const { CodebaseIndexer } = await import(`file://${vectorizerModule}`)
    
    for (const [indexName, files] of filesToProcess.entries()) {
      const indexer = await new CodebaseIndexer(projectRoot, indexName).init()
      
      for (const filePath of files) {
        try {
          const wasIndexed = await indexer.indexSingleFile(filePath)
          if (wasIndexed) {
            // Only log in debug mode, successful reindex is silent
            debug(`Reindexed: ${path.relative(projectRoot, filePath)} -> ${indexName}`)
          } else {
            debug(`Skipped (unchanged): ${path.relative(projectRoot, filePath)}`)
          }
        } catch (e) {
          debug(`Error: ${(e as Error).message}`)
        }
      }
      
      await indexer.unloadModel()
    }
  } catch (e) {
    debug(`Fatal: ${(e as Error).message}`)
  }
}

export const FileIndexerPlugin: Plugin = async ({ directory }) => {
  let processingTimeout: NodeJS.Timeout | null = null
  let config = await loadConfig(directory)
  
  // Check if plugin should be active
  if (!config.enabled || !config.auto_index) {
    debug(`Plugin disabled (enabled: ${config.enabled}, auto_index: ${config.auto_index})`)
    return {
      event: async () => {}, // No-op
    }
  }
  
  debug(`Plugin loaded for: ${directory}`)
  debug(`Config: debounce=${config.debounce_ms}ms, exclude=${config.exclude.length} patterns`)
  
  function queueFileForIndexing(filePath: string): void {
    const relativePath = path.relative(directory, filePath)
    
    // Check exclusions from config
    if (isExcluded(relativePath, config)) {
      return
    }
    
    const indexName = getIndexForFile(filePath, config)
    if (!indexName) return
    
    debug(`Queued: ${relativePath} -> ${indexName}`)
    pendingFiles.set(filePath, { indexName, timestamp: Date.now() })
    
    if (processingTimeout) {
      clearTimeout(processingTimeout)
    }
    processingTimeout = setTimeout(async () => {
      if (await isVectorizerInstalled(directory)) {
        await processPendingFiles(directory, config)
      } else {
        debug(`Vectorizer not installed`)
      }
    }, config.debounce_ms + 100)
  }

  return {
    event: async (ctx) => {
      const event = ctx.event
      
      if (event.type === "file.edited") {
        const props = (event as any).properties || {}
        const filePath = props.file || props.path || props.filePath
        if (filePath) {
          debug(`file.edited: ${filePath}`)
          queueFileForIndexing(filePath)
        }
      }
      
      if (event.type === "file.watcher.updated") {
        const props = (event as any).properties || {}
        const filePath = props.file || props.path || props.filePath
        if (filePath) {
          debug(`file.watcher.updated: ${filePath}`)
          queueFileForIndexing(filePath)
        }
      }
    },
  }
}

export default FileIndexerPlugin
