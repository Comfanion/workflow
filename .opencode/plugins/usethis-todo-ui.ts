import type { Plugin } from "@opencode-ai/plugin"

/**
 * UseThis TODO UI Plugin — zero-state
 * 
 * ONLY sets output.title for usethis_todo_* tools in TUI.
 * No caching, no env vars, no before hook, no HTTP calls.
 * Parses tool output string directly in after hook.
 */

export const UsethisTodoUIPlugin: Plugin = async () => {
  return {
    "tool.execute.after": async (input, output) => {
      if (!input.tool.startsWith("usethis_todo_")) return

      const out = output.output || ""

      if (input.tool === "usethis_todo_write") {
        const match = out.match(/\[(\d+)\/(\d+) done/)
        output.title = match ? `📋 TODO: ${match[2]} tasks` : "📋 TODO updated"

      } else if (input.tool === "usethis_todo_update") {
        const match = out.match(/^✅ (.+)$/m)
        output.title = match ? `📝 ${match[1]}` : "📝 Task updated"

      } else if (input.tool === "usethis_todo_read") {
        const match = out.match(/\[(\d+)\/(\d+) done, (\d+) in progress\]/)
        output.title = match ? `📋 TODO [${match[1]}/${match[2]} done]` : "📋 TODO list"

      } else if (input.tool === "usethis_todo_read_next_five") {
        output.title = "📋 Next 5 tasks"
      }
    }
  }
}

export default UsethisTodoUIPlugin
