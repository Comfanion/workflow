/**
 * Code Index Status & Management Tool
 * 
 * Check indexing status and trigger re-indexing.
 * Uses LOCAL vectorizer - no npm calls needed.
 * 
 * Usage by model:
 *   codeindex({ action: "status" })
 *   codeindex({ action: "status", index: "docs" })
 *   codeindex({ action: "reindex", index: "code" })
 *   codeindex({ action: "list" })
 */

import { tool } from "@opencode-ai/plugin"
import path from "path"
import fs from "fs/promises"

// File extensions for each index type
const INDEX_EXTENSIONS: Record<string, string[]> = {
  code: ['.js', '.ts', '.jsx', '.tsx', '.go', '.py', '.rs', '.java', '.kt', '.swift', '.c', '.cpp', '.h', '.cs', '.rb', '.php'],
  docs: ['.md', '.mdx', '.txt', '.rst', '.adoc'],
  config: ['.yaml', '.yml', '.json', '.toml', '.ini', '.xml'],
}

const INDEX_DESCRIPTIONS: Record<string, string> = {
  code: 'Source code files',
  docs: 'Documentation files',
  config: 'Configuration files',
}

// Simple recursive file walker (no external deps)
async function walkDir(dir: string, extensions: string[], ignore: string[] = []): Promise<string[]> {
  const files: string[] = []
  
  async function walk(currentDir: string) {
    try {
      const entries = await fs.readdir(currentDir, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name)
        const relativePath = path.relative(dir, fullPath)
        
        // Skip ignored directories
        if (ignore.some(ig => relativePath.startsWith(ig) || entry.name === ig)) {
          continue
        }
        
        if (entry.isDirectory()) {
          await walk(fullPath)
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase()
          if (extensions.includes(ext)) {
            files.push(fullPath)
          }
        }
      }
    } catch {}
  }
  
  await walk(dir)
  return files
}

export default tool({
  description: `Check codebase index status or trigger re-indexing for semantic search.

Actions:
- "status" → Show index statistics
- "list" → List all available indexes with stats
- "reindex" → Re-index files using LOCAL vectorizer (no npm needed)

Available indexes:
- "code" - Source code files (.js, .ts, .go, .py, etc.)
- "docs" - Documentation files (.md, .txt, etc.)
- "config" - Configuration files (.yaml, .json, etc.)

Note: First indexing takes ~30s to load embedding model.`,

  args: {
    action: tool.schema.enum(["status", "list", "reindex"]).describe("Action to perform"),
    index: tool.schema.string().optional().default("code").describe("Index name: code, docs, config"),
    dir: tool.schema.string().optional().describe("Directory to index (default: project root)"),
  },

  async execute(args, context) {
    const projectRoot = process.cwd()
    const vectorizerDir = path.join(projectRoot, ".opencode", "vectorizer")
    const vectorizerModule = path.join(vectorizerDir, "index.js")
    const vectorsDir = path.join(projectRoot, ".opencode", "vectors")

    // Check if vectorizer is installed
    const isInstalled = await fs.access(path.join(vectorizerDir, "node_modules"))
      .then(() => true)
      .catch(() => false)

    if (!isInstalled) {
      return `❌ Vectorizer not installed.

To install, run in terminal:
\`\`\`bash
npx @comfanion/workflow vectorizer install
\`\`\`

This downloads the embedding model (~100MB).`
    }

    const indexName = args.index || "code"

    // LIST: Show all indexes
    if (args.action === "list") {
      let output = `## Codebase Index Overview\n\n`
      output += `✅ **Vectorizer installed**\n\n`
      
      const indexes: string[] = []
      try {
        const entries = await fs.readdir(vectorsDir, { withFileTypes: true })
        for (const entry of entries) {
          if (entry.isDirectory()) {
            indexes.push(entry.name)
          }
        }
      } catch {}
      
      if (indexes.length === 0) {
        output += `⚠️ **No indexes created yet**\n\n`
        output += `Create indexes:\n`
        output += `\`\`\`\n`
        output += `codeindex({ action: "reindex", index: "code" })\n`
        output += `codeindex({ action: "reindex", index: "docs", dir: "docs/" })\n`
        output += `\`\`\`\n`
      } else {
        output += `### Active Indexes\n\n`
        for (const idx of indexes) {
          try {
            const hashesPath = path.join(vectorsDir, idx, "hashes.json")
            const hashes = JSON.parse(await fs.readFile(hashesPath, "utf8"))
            const fileCount = Object.keys(hashes).length
            const desc = INDEX_DESCRIPTIONS[idx] || "Custom index"
            output += `**📁 ${idx}** - ${desc}\n`
            output += `   Files: ${fileCount}\n\n`
          } catch {}
        }
      }
      
      output += `### Usage\n`
      output += `\`\`\`\n`
      output += `codesearch({ query: "your query", index: "code" })\n`
      output += `codesearch({ query: "how to deploy", index: "docs" })\n`
      output += `\`\`\``
      
      return output
    }

    // STATUS: Show specific index status
    if (args.action === "status") {
      const hashesFile = path.join(vectorsDir, indexName, "hashes.json")
      
      try {
        const hashesContent = await fs.readFile(hashesFile, "utf8")
        const hashes = JSON.parse(hashesContent)
        const fileCount = Object.keys(hashes).length
        const sampleFiles = Object.keys(hashes).slice(0, 5)
        const desc = INDEX_DESCRIPTIONS[indexName] || "Custom index"

        return `## Index Status: "${indexName}"

✅ **Vectorizer installed**
✅ **Index active**

**Description:** ${desc}
**Files indexed:** ${fileCount}

**Sample indexed files:**
${sampleFiles.map(f => `- ${f}`).join("\n")}
${fileCount > 5 ? `- ... and ${fileCount - 5} more` : ""}

**Usage:**
\`\`\`
codesearch({ query: "your search query", index: "${indexName}" })
\`\`\`

To re-index:
\`\`\`
codeindex({ action: "reindex", index: "${indexName}" })
\`\`\``

      } catch {
        return `## Index Status: "${indexName}"

✅ **Vectorizer installed**
⚠️ **Index "${indexName}" not created yet**

To create this index:
\`\`\`
codeindex({ action: "reindex", index: "${indexName}" })
\`\`\`

Or with specific directory:
\`\`\`
codeindex({ action: "reindex", index: "${indexName}", dir: "src/" })
\`\`\``
      }
    }

    // REINDEX: Re-index using LOCAL vectorizer (no npm!)
    if (args.action === "reindex") {
      try {
        // Import local vectorizer
        const { CodebaseIndexer } = await import(`file://${vectorizerModule}`)
        const indexer = await new CodebaseIndexer(projectRoot, indexName).init()
        
        // Determine directory and extensions
        const baseDir = args.dir 
          ? path.resolve(projectRoot, args.dir)
          : projectRoot
        const extensions = INDEX_EXTENSIONS[indexName] || INDEX_EXTENSIONS.code
        
        // Find files using simple walker
        const ignoreList = ['node_modules', '.git', 'dist', 'build', '.opencode', 'vendor', '__pycache__']
        const files = await walkDir(baseDir, extensions, ignoreList)
        
        let indexed = 0
        let skipped = 0
        
        for (const filePath of files) {
          try {
            const wasIndexed = await indexer.indexFile(filePath)
            if (wasIndexed) indexed++
            else skipped++
          } catch {}
        }
        
        // Unload model to free memory
        await indexer.unloadModel()
        
        const stats = await indexer.getStats()

        return `## Re-indexing Complete ✅

**Index:** ${indexName}
**Directory:** ${args.dir || "(project root)"}
**Files found:** ${files.length}
**Files indexed:** ${indexed}
**Files unchanged:** ${skipped}
**Total chunks:** ${stats.chunkCount}

You can now use semantic search:
\`\`\`
codesearch({ query: "your search query", index: "${indexName}" })
\`\`\``

      } catch (error: any) {
        return `❌ Re-indexing failed: ${error.message}

Make sure vectorizer is installed:
\`\`\`bash
npx @comfanion/workflow vectorizer install
\`\`\``
      }
    }

    return `Unknown action: ${args.action}. Use: status, list, or reindex`
  },
})
