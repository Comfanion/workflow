# Capability → Tool Map

Skills in this toolkit describe **capabilities** in prose ("search the codebase", "spawn a subagent", "track tasks") rather than naming a specific harness's tool. This keeps the skill bodies portable. This table maps each capability to the concrete tool on each harness, so an agent (or a human setting one up) knows what the prose actually resolves to.

If a capability has no equivalent on a harness, the agent falls back to the nearest option in that row — the skill still works, just with a coarser tool.

| Capability (as written in skills) | Claude Code | opencode | Codex | Hermes |
|-----------------------------------|-------------|----------|-------|--------|
| **Search the codebase/docs (semantic)** | Grep/Glob; an MCP search server if configured | `search()` / `codeindex()` plugins | built-in search / grep | semantic search if configured, else grep |
| **Read files** | Read | `read` | read | read |
| **Edit / write files** | Edit / Write | `edit` / `write` | apply_patch / write | edit / write |
| **Run commands / tests / git** | Bash | `bash` | shell | shell |
| **Spawn an ephemeral subagent (agent-call)** | Agent tool (`subagent_type`) | subagent invocation | subagent / task | ephemeral task (prefer the board for standing work) |
| **Run independent work in parallel** | multiple Agent calls in one turn | parallel subagents | parallel tasks | kanban items with no dependency edge |
| **Coordinate a standing role-team (board)** | tracked task list + per-item subagents | tracked task list + subagents | tracked task list | kanban dispatcher + profiles (`--parent` for deps) |
| **Track tasks / todos** | TodoWrite | `todowrite` / `todoread` | todo list | kanban board |
| **Web research** | WebSearch / WebFetch (or an MCP) | web tooling / browser | web tooling | web backend if configured, else browser |
| **Build & deploy a release (CI/CD + deploy)** | Bash (CI scripts / `gh` / deploy CLI) | `bash` (CI scripts / deploy CLI) | shell (CI scripts / deploy CLI) | shell (CI scripts / deploy CLI) |

## Notes per harness

- **Claude Code** — roles map to subagents (the Agent tool's `subagent_type`, resolved from `agents/`). Parallelism = several Agent calls in one message. There is no long-lived dispatcher, so "team mode" is simulated with a tracked task list (see `orchestration-team`).
- **opencode** — the native origin of these skills; `search()`/`codeindex()`/`todowrite()` come from the workflow's own plugins. If those plugins aren't installed, the agent falls back to grep/glob and a plain todo.
- **Codex** — skills are portable Markdown; tool names differ but every capability above has a near-equivalent.
- **Hermes** — standing work belongs on the kanban board routed to profiles; ephemeral subagent calls exist but the board is the idiomatic path (see `orchestration-team`). Profiles are created host-side (see `templates/hermes/setup-team.sh`).

The **build & deploy** capability resolves to whatever shell/CI tooling the harness exposes; it is driven by the `release-engineering` skill. The `devops` role owns the deploy gate — shipping requires explicit confirmation plus green checks (see the `deploy` phase in `FLOW.yaml`).

This map is reference, not configuration — the skills do not read it. It exists so a human or agent can translate the prose to whatever the current harness provides.
