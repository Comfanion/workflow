/**
 * Code Index Status & Management Tool
 * 
 * Check indexing status and trigger re-indexing.
 * Supports multiple indexes: code, docs, config.
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
import { glob } from "glob"
import ignore from "ignore"

// Index presets (duplicated from vectorizer for independence)
const INDEX_PRESETS: Record<string, { pattern: string; description: string }> = {
  code: {
    pattern: '**/*.{js,ts,jsx,tsx,mjs,cjs,py,go,rs,java,kt,swift,c,cpp,h,hpp,cs,rb,php,scala,clj}',
    description: 'Source code files'
  },
  docs: {
    pattern: '**/*.{md,mdx,txt,rst,adoc}',
    description: 'Documentation files'
  },
  config: {
    pattern: '**/*.{yaml,yml,json,toml,ini,env,xml}',
    description: 'Configuration files'
  },
  all: {
    pattern: '**/*.{js,ts,jsx,tsx,mjs,cjs,py,go,rs,java,kt,swift,c,cpp,h,hpp,cs,rb,php,scala,clj,md,mdx,txt,rst,adoc,yaml,yml,json,toml}',
    description: 'All supported files'
  }
}

export default tool({
  description: `Check codebase index status or trigger re-indexing for semantic search.

Actions:
- "status" → Show index statistics (specify index or see all)
- "list" → List all available indexes with stats
- "reindex" → Re-index files (specify which index)

Available indexes:
- "code" - Source code files
- "docs" - Documentation files  
- "config" - Configuration files

Note: Initial indexing takes ~30s to load the embedding model.`,

  args: {
    action: tool.schema.enum(["status", "list", "reindex"]).describe("Action to perform"),
    index: tool.schema.string().optional().default("code").describe("Index name for status/reindex: code, docs, config"),
  },

  async execute(args, context) {
    const projectRoot = process.cwd()
    const vectorizerDir = path.join(projectRoot, ".opencode", "vectorizer")
    const vectorsDir = path.join(projectRoot, ".opencode", "vectors")

    // Check if vectorizer is installed
    const isInstalled = await fs.access(path.join(vectorizerDir, "node_modules"))
      .then(() => true)
      .catch(() => false)

    if (!isInstalled) {
      return `❌ Vectorizer not installed.

To install:
\`\`\`bash
npx opencode-workflow vectorizer install
\`\`\`

This will download the embedding model (~100MB) and set up the vector database.`
    }

    try {
      const vectorizerModule = path.join(vectorizerDir, "index.js")
      const { CodebaseIndexer, INDEX_PRESETS: PRESETS } = await import(`file://${vectorizerModule}`)

      // LIST: Show all indexes
      if (args.action === "list") {
        const tempIndexer = await new CodebaseIndexer(projectRoot, "code").init()
        const allStats = await tempIndexer.getAllStats()

        let output = `## Codebase Index Overview\n\n`
        output += `✅ **Vectorizer installed**\n\n`

        if (allStats.length === 0) {
          output += `⚠️ **No indexes created yet**\n\n`
          output += `Create indexes with:\n`
          output += `\`\`\`bash\n`
          output += `npx opencode-workflow index --index code   # Source code\n`
          output += `npx opencode-workflow index --index docs   # Documentation\n`
          output += `npx opencode-workflow index --index config # Config files\n`
          output += `\`\`\`\n\n`
        } else {
          output += `### Active Indexes\n\n`
          for (const stat of allStats) {
            output += `**📁 ${stat.indexName}** - ${stat.description}\n`
            output += `   Files: ${stat.fileCount}, Chunks: ${stat.chunkCount}\n\n`
          }
        }

        output += `### Available Presets\n\n`
        for (const [name, preset] of Object.entries(PRESETS || INDEX_PRESETS) as [string, any][]) {
          const exists = allStats.find((s: any) => s.indexName === name)
          const status = exists ? "✅" : "⬜"
          output += `${status} **${name}**: ${preset.description}\n`
        }

        output += `\n### Usage\n`
        output += `\`\`\`\n`
        output += `codesearch({ query: "your query", index: "code" })\n`
        output += `codesearch({ query: "deployment guide", index: "docs" })\n`
        output += `codesearch({ query: "api keys", searchAll: true })\n`
        output += `\`\`\``

        return output
      }

      // STATUS: Show specific index status
      if (args.action === "status") {
        const indexName = args.index || "code"
        const hashesFile = path.join(vectorsDir, indexName, "hashes.json")

        try {
          const indexer = await new CodebaseIndexer(projectRoot, indexName).init()
          const stats = await indexer.getStats()

          // Get sample files
          const hashesContent = await fs.readFile(hashesFile, "utf8")
          const hashes = JSON.parse(hashesContent)
          const sampleFiles = Object.keys(hashes).slice(0, 5)

          return `## Index Status: "${indexName}"

✅ **Vectorizer installed**
✅ **Index active**

**Description:** ${stats.description}
**Files indexed:** ${stats.fileCount}
**Chunks:** ${stats.chunkCount}

**Sample indexed files:**
${sampleFiles.map(f => `- ${f}`).join("\n")}
${stats.fileCount > 5 ? `- ... and ${stats.fileCount - 5} more` : ""}

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
\`\`\`bash
npx opencode-workflow index --index ${indexName}
\`\`\`

Or use:
\`\`\`
codeindex({ action: "reindex", index: "${indexName}" })
\`\`\``
        }
      }

      // REINDEX: Re-index specific index (do it directly, no shell)
      if (args.action === "reindex") {
        const indexName = args.index || "code"
        
        try {
          const indexer = await new CodebaseIndexer(projectRoot, indexName).init()
          
          // Get pattern from preset
          const preset = (PRESETS || INDEX_PRESETS)[indexName]
          const pattern = preset?.pattern || '**/*.{js,ts,py,go,md,yaml,json}'
          
          // Load .gitignore
          let ig = ignore()
          try {
            const gitignore = await fs.readFile(path.join(projectRoot, '.gitignore'), 'utf8')
            ig = ig.add(gitignore)
          } catch {}
          ig.add(['node_modules', '.git', 'dist', 'build', '.opencode/vectors', '.opencode/vectorizer'])
          
          // Find files
          const files = await glob(pattern, { cwd: projectRoot, nodir: true })
          const filtered = files.filter((f: string) => !ig.ignores(f))
          
          let indexed = 0
          let skipped = 0
          
          for (const file of filtered) {
            const filePath = path.join(projectRoot, file)
            try {
              const wasIndexed = await indexer.indexFile(filePath)
              if (wasIndexed) {
                indexed++
              } else {
                skipped++
              }
            } catch {
              // Skip files that can't be read
            }
          }
          
          // Unload model to free memory
          await indexer.unloadModel()
          
          const stats = await indexer.getStats()

          return `## Re-indexing Complete ✅

**Index:** ${indexName}
**Description:** ${stats.description}
**Files found:** ${filtered.length}
**Files indexed:** ${indexed}
**Files unchanged:** ${skipped}
**Total chunks:** ${stats.chunkCount}

You can now use semantic search:
\`\`\`
codesearch({ query: "your search query", index: "${indexName}" })
\`\`\``

        } catch (error: any) {
          return `❌ Re-indexing failed: ${error.message}

Try:
1. Check if vectorizer is installed: \`npx opencode-workflow vectorizer status\`
2. Re-install vectorizer: \`npx opencode-workflow vectorizer install\``
        }
      }

      return `Unknown action: ${args.action}. Use: status, list, or reindex`

    } catch (error: any) {
      return `❌ Error: ${error.message}`
    }
  },
})
