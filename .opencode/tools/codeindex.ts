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
import { execSync } from "child_process"

// Index presets for documentation
const INDEX_PRESETS: Record<string, { pattern: string; description: string }> = {
  code: { pattern: '**/*.{js,ts,go,py,...}', description: 'Source code files' },
  docs: { pattern: '**/*.{md,txt,...}', description: 'Documentation files' },
  config: { pattern: '**/*.{yaml,json,...}', description: 'Configuration files' },
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
    index: tool.schema.string().optional().default("code").describe("Index name: code, docs, config"),
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
npx @comfanion/workflow vectorizer install
\`\`\`

This will download the embedding model (~100MB) and set up the vector database.`
    }

    const indexName = args.index || "code"

    // LIST: Show all indexes
    if (args.action === "list") {
      try {
        const result = execSync("node .opencode/vectorizer/list-indexes.js 2>/dev/null || echo '{}'", {
          cwd: projectRoot,
          encoding: "utf8",
          timeout: 30000
        })
        
        // Fallback: read hashes files directly
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
          output += `Create indexes with:\n`
          output += `\`\`\`bash\n`
          output += `npx opencode-workflow index --index code\n`
          output += `npx opencode-workflow index --index docs --dir docs/\n`
          output += `\`\`\`\n`
        } else {
          output += `### Active Indexes\n\n`
          for (const idx of indexes) {
            try {
              const hashesPath = path.join(vectorsDir, idx, "hashes.json")
              const hashes = JSON.parse(await fs.readFile(hashesPath, "utf8"))
              const fileCount = Object.keys(hashes).length
              const desc = INDEX_PRESETS[idx]?.description || "Custom index"
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
        
      } catch (error: any) {
        return `❌ Error listing indexes: ${error.message}`
      }
    }

    // STATUS: Show specific index status
    if (args.action === "status") {
      const hashesFile = path.join(vectorsDir, indexName, "hashes.json")
      
      try {
        const hashesContent = await fs.readFile(hashesFile, "utf8")
        const hashes = JSON.parse(hashesContent)
        const fileCount = Object.keys(hashes).length
        const sampleFiles = Object.keys(hashes).slice(0, 5)
        const desc = INDEX_PRESETS[indexName]?.description || "Custom index"

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
\`\`\`bash
npx opencode-workflow index --index ${indexName}
\`\`\``

      } catch {
        return `## Index Status: "${indexName}"

✅ **Vectorizer installed**
⚠️ **Index "${indexName}" not created yet**

To create this index:
\`\`\`bash
npx opencode-workflow index --index ${indexName}
# Or with specific directory:
npx opencode-workflow index --index ${indexName} --dir src/
\`\`\``
      }
    }

    // REINDEX: Re-index using CLI
    if (args.action === "reindex") {
      try {
        execSync(`npx opencode-workflow index --index ${indexName}`, {
          cwd: projectRoot,
          encoding: "utf8",
          timeout: 300000, // 5 min
          stdio: "pipe"
        })

        // Get stats after indexing
        const hashesFile = path.join(vectorsDir, indexName, "hashes.json")
        const hashes = JSON.parse(await fs.readFile(hashesFile, "utf8"))
        const fileCount = Object.keys(hashes).length

        return `## Re-indexing Complete ✅

**Index:** ${indexName}
**Files indexed:** ${fileCount}

You can now use semantic search:
\`\`\`
codesearch({ query: "your search query", index: "${indexName}" })
\`\`\``

      } catch (error: any) {
        return `❌ Re-indexing failed: ${error.message}

Try manually:
\`\`\`bash
npx opencode-workflow index --index ${indexName} --force
\`\`\``
      }
    }

    return `Unknown action: ${args.action}. Use: status, list, or reindex`
  },
})
