/**
 * Semantic Code Search Tool
 * 
 * Allows the AI model to search the codebase using semantic similarity.
 * Uses local embeddings (all-MiniLM-L6-v2) and LanceDB vector store.
 * Supports multiple indexes: code, docs, config, or search all.
 * 
 * Usage by model:
 *   codesearch({ query: "authentication middleware", limit: 5 })
 *   codesearch({ query: "how to deploy", index: "docs" })
 *   codesearch({ query: "database config", index: "config" })
 *   codesearch({ query: "error handling", searchAll: true })
 * 
 * Prerequisites:
 *   npx @comfanion/workflow vectorizer install
 *   npx @comfanion/workflow index --index code
 *   npx @comfanion/workflow index --index docs
 */

import { tool } from "@opencode-ai/plugin"
import path from "path"
import fs from "fs/promises"

export default tool({
  description: `Search the codebase semantically. Use this to find relevant code snippets, functions, or files based on meaning, not just text matching.

Available indexes:
- "code" (default) - Source code files (*.js, *.ts, *.py, *.go, etc.)
- "docs" - Documentation files (*.md, *.txt, etc.)
- "config" - Configuration files (*.yaml, *.json, etc.)
- searchAll: true - Search across all indexes

Examples:
- "authentication logic" → finds auth-related code
- "database connection handling" → finds DB setup code  
- "how to deploy" with index: "docs" → finds deployment docs
- "API keys" with index: "config" → finds config with API settings

Prerequisites: Run 'npx @comfanion/workflow index --index <name>' first.`,

  args: {
    query: tool.schema.string().describe("Semantic search query describing what you're looking for"),
    index: tool.schema.string().optional().default("code").describe("Index to search: code, docs, config, or custom name"),
    limit: tool.schema.number().optional().default(5).describe("Number of results to return (default: 5)"),
    searchAll: tool.schema.boolean().optional().default(false).describe("Search all indexes instead of just one"),
  },

  async execute(args, context) {
    const projectRoot = process.cwd()
    const vectorizerDir = path.join(projectRoot, ".opencode", "vectorizer")
    const vectorizerModule = path.join(vectorizerDir, "index.js")

    // Check if vectorizer is installed
    try {
      await fs.access(path.join(vectorizerDir, "node_modules"))
    } catch {
      return `❌ Vectorizer not installed. Run: npx @comfanion/workflow vectorizer install`
    }

    try {
      // Dynamic import of the vectorizer
      const { CodebaseIndexer } = await import(`file://${vectorizerModule}`)
      
      let allResults: any[] = []
      const limit = args.limit || 5
      const indexName = args.index || "code"

      if (args.searchAll) {
        // Search all indexes
        const tempIndexer = await new CodebaseIndexer(projectRoot, "code").init()
        const indexes = await tempIndexer.listIndexes()

        if (indexes.length === 0) {
          return `❌ No indexes found. Run: npx @comfanion/workflow index --index code`
        }

        for (const idx of indexes) {
          const indexer = await new CodebaseIndexer(projectRoot, idx).init()
          const results = await indexer.search(args.query, limit)
          allResults.push(...results.map((r: any) => ({ ...r, _index: idx })))
        }

        // Sort by distance and take top N
        allResults.sort((a, b) => (a._distance || 0) - (b._distance || 0))
        allResults = allResults.slice(0, limit)

      } else {
        // Search specific index
        const hashesFile = path.join(projectRoot, ".opencode", "vectors", indexName, "hashes.json")
        try {
          await fs.access(hashesFile)
        } catch {
          return `❌ Index "${indexName}" not found. Run: npx @comfanion/workflow index --index ${indexName}`
        }

        const indexer = await new CodebaseIndexer(projectRoot, indexName).init()
        const results = await indexer.search(args.query, limit)
        allResults = results.map((r: any) => ({ ...r, _index: indexName }))
      }

      if (allResults.length === 0) {
        const scope = args.searchAll ? "any index" : `index "${indexName}"`
        return `No results found in ${scope} for: "${args.query}"\n\nTry:\n- Different keywords\n- Re-index with: npx @comfanion/workflow index --index ${indexName} --force`
      }

      // Format results for the model
      const scope = args.searchAll ? "all indexes" : `index "${indexName}"`
      let output = `## Search Results for: "${args.query}" (${scope})\n\n`
      
      for (let i = 0; i < allResults.length; i++) {
        const r = allResults[i]
        const score = r._distance ? (1 - r._distance).toFixed(3) : "N/A"
        const indexLabel = args.searchAll ? ` [${r._index}]` : ""
        
        output += `### ${i + 1}. ${r.file}${indexLabel}\n`
        output += `**Relevance:** ${score}\n\n`
        output += "```\n"
        // Truncate long content
        const content = r.content.length > 500 
          ? r.content.substring(0, 500) + "\n... (truncated)"
          : r.content
        output += content
        output += "\n```\n\n"
      }

      output += `---\n*Found ${allResults.length} results. Use Read tool to see full files.*`

      return output

    } catch (error: any) {
      return `❌ Search failed: ${error.message}\n\nTry re-indexing: npx @comfanion/workflow index --index ${args.index || "code"} --force`
    }
  },
})
