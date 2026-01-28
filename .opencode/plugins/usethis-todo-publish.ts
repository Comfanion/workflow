import type { Plugin } from "@opencode-ai/plugin"

/**
 * Publishes a TODO snapshot into the session chat.
 *
 * Why: the TODO sidebar may not live-refresh when we write native todo files
 * (no todo.updated Bus event). This makes changes visible in the main dialog.
 */
export const UsethisTodoPublish: Plugin = async ({ client }) => {
  return {
    "tool.execute.after": async (input, output) => {
      const publishTools = new Set([
        "usethis_todo_write",
        "usethis_todo_update",
        "usethis_todo_read",
        "usethis_todo_read_five",
        "usethis_todo_read_by_id",
      ])

      if (!publishTools.has(input.tool)) return

      const text = [
        `## TODO`,
        // `session: ${input.sessionID}`,
        "",
        output.output
      ].join("\n")

      try {
        await client.session.prompt({
          path: { id: input.sessionID },
          body: {
            noReply: true,
            parts: [{ type: "text", text }],
          },
        })
      } catch {}

      // Debug toasts removed
    },
  }
}

export default UsethisTodoPublish
