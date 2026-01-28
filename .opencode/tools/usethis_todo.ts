/**
 * TODO Tool with Dependencies & Priority — v3 (dual storage)
 *
 * 4 commands:
 *   usethis_todo_write({ todos: [...] })    - create/update TODO list
 *   usethis_todo_read()                     - read TODO with graph analysis
 *   usethis_todo_read_five()           - get next 5 available tasks
 *   usethis_todo_read_by_id()           - get next 5 available tasks
 *   usethis_todo_update(id, field, value)   - update any task field
 *
 * Storage:
 *   Enhanced: .opencode/session-todos/{sid}.json  (title, blockedBy, graph)
 *   Native:  ~/.local/share/opencode/storage/todo/{sid}.json  (TUI display)
 *
 * Features:
 * - Hierarchical IDs: E01-S01-T01
 * - Dependencies: blockedBy field
 * - Priority: CRIT | HIGH | MED | LOW (auto-sorted)
 * - Graph: shows available, blocked, parallel tasks
 * - Dual write: native OpenCode storage for TUI integration
 */

import { tool } from "@opencode-ai/plugin"
import path from "path"
import os from "os"
import fs from "fs/promises"

// ============================================================================
// Types
// ============================================================================

interface Todo {
  id: string              // E01-S01-T01
  content: string         // Short task summary
  description?: string    // Full task description (optional)
  status: string          // pending | ready | in_progress | waiting_review | done | cancelled
  priority: string        // CRIT | HIGH | MED | LOW
  blockedBy?: string[]    // IDs of blocking tasks
  createdAt?: number
  updatedAt?: number
}

interface NativeTodo {
  id: string
  content: string         // "title: content" combined
  status: string          // pending | in_progress | completed | cancelled
  priority: string        // high | medium | low
}

interface TodoGraph {
  todos: Todo[]
  available: string[]
  parallel: string[][]
  blocked: Record<string, string[]>
}

// ============================================================================
// Storage — dual write
// ============================================================================

// Resolve project directory (context.directory may be undefined via MCP)
function dir(directory?: string): string {
  return directory || process.env.OPENCODE_PROJECT_DIR || process.cwd()
}

// Enhanced storage path (project-local)
function getEnhancedPath(sid: string, directory?: string): string {
  return path.join(dir(directory), ".opencode", "session-todos", `${sid || "current"}.json`)
}

async function getNativeDataDirs(): Promise<string[]> {
  const dirs = new Set<string>()

  // 1) xdg-basedir (what OpenCode itself uses)
  try {
    const mod: any = await import("xdg-basedir")
    if (mod?.xdgData && typeof mod.xdgData === "string") {
      dirs.add(mod.xdgData)
    }
  } catch {
    // ignore
  }

  // 2) explicit XDG override
  if (process.env.XDG_DATA_HOME) {
    dirs.add(process.env.XDG_DATA_HOME)
  }

  // 3) common fallbacks
  dirs.add(path.join(os.homedir(), ".local", "share"))
  dirs.add(path.join(os.homedir(), "Library", "Application Support"))

  return [...dirs]
}

async function getNativePaths(sid: string): Promise<string[]> {
  const baseDirs = await getNativeDataDirs()
  const file = `${sid || "current"}.json`
  return baseDirs.map((base) => path.join(base, "opencode", "storage", "todo", file))
}

// Map our format → native format
function toNative(todo: Todo): NativeTodo {
  // Status mapping: our → native
  const statusMap: Record<string, string> = {
    pending: "pending",
    ready: "pending",           // native has no "ready"
    in_progress: "in_progress",
    waiting_review: "in_progress",  // native has no "waiting_review"
    done: "completed",          // native uses "completed" not "done"
    cancelled: "cancelled",
  }
  // Priority mapping: CRIT/HIGH/MED/LOW → high/medium/low
  const prioMap: Record<string, string> = {
    CRIT: "high",
    HIGH: "high",
    MED: "medium",
    LOW: "low",
  }

  const deps = todo.blockedBy?.length ? ` [← ${todo.blockedBy.join(", ")}]` : ""
  const desc = todo.description?.trim() ? ` — ${todo.description.trim()}` : ""

  return {
    id: todo.id,
    content: `${todo.content}${desc}${deps}`,
    status: statusMap[todo.status] || "pending",
    priority: prioMap[todo.priority] || "medium",
  }
}

async function readTodos(sid: string, directory?: string): Promise<Todo[]> {
  try {
    return JSON.parse(await fs.readFile(getEnhancedPath(sid, directory), "utf-8"))
  } catch {
    return []
  }
}

async function writeTodos(todos: Todo[], sid: string, directory?: string): Promise<void> {
  // 1. Enhanced storage (our full format)
  const enhancedPath = getEnhancedPath(sid, directory)
  await fs.mkdir(path.dirname(enhancedPath), { recursive: true })
  await fs.writeFile(enhancedPath, JSON.stringify(todos, null, 2), "utf-8")

  // 2. Native storage (for TUI display)
  const nativeTodos = todos.map(toNative)
  try {
    const nativePaths = await getNativePaths(sid)
    await Promise.allSettled(
        nativePaths.map(async (nativePath) => {
          await fs.mkdir(path.dirname(nativePath), { recursive: true })
          await fs.writeFile(nativePath, JSON.stringify(nativeTodos, null, 2), "utf-8")
        }),
    )
  } catch {
    // Native write failure is non-fatal
  }
}

// ============================================================================
// Graph analysis
// ============================================================================

function analyzeGraph(todos: Todo[]): TodoGraph {
  const blocked: Record<string, string[]> = {}
  const availableTodos: Todo[] = []

  for (const todo of todos) {
    if (todo.status !== "ready") continue
    const activeBlockers = (todo.blockedBy || []).filter(id => {
      const b = todos.find(t => t.id === id)
      return b && b.status !== "done"
    })
    if (activeBlockers.length === 0) {
      availableTodos.push(todo)
    } else {
      blocked[todo.id] = activeBlockers
    }
  }

  const P: Record<string, number> = { CRIT: 0, HIGH: 1, MED: 2, LOW: 3 }
  availableTodos.sort((a, b) => (P[a.priority] ?? 2) - (P[b.priority] ?? 2))
  const available = availableTodos.map(t => t.id)

  // Parallel groups
  const parallel: string[][] = []
  const seen = new Set<string>()
  for (const id of available) {
    if (seen.has(id)) continue
    const group = [id]
    seen.add(id)
    for (const other of available) {
      if (seen.has(other)) continue
      const a = todos.find(t => t.id === id)
      const b = todos.find(t => t.id === other)
      if (!b?.blockedBy?.includes(id) && !a?.blockedBy?.includes(other)) {
        group.push(other)
        seen.add(other)
      }
    }
    if (group.length > 0) parallel.push(group)
  }

  return { todos, available, parallel, blocked }
}

// ============================================================================
// Formatting
// ============================================================================

const PE = (p?: string) => p === "CRIT" ? "🔴" : p === "HIGH" ? "🟠" : p === "LOW" ? "🟢" : "🟡"
const SI = (s: string) => s === "done" ? "✓" : s === "in_progress" ? "⚙" : s === "ready" ? "○" : s === "cancelled" ? "✗" : s === "waiting_review" ? "⏳" : "·"

function formatGraph(graph: TodoGraph): string {
  const { todos } = graph
  const total = todos.length
  const done = todos.filter(t => t.status === "done").length
  const wip = todos.filter(t => t.status === "in_progress").length

  const lines: string[] = [`═══ TODO Graph [${done}/${total} done, ${wip} in progress] ═══`, ""]

  lines.push("All Tasks:")
  for (const t of todos) {
    const deps = t.blockedBy?.length ? ` ← ${t.blockedBy.join(", ")}` : ""
    const desc = t.description?.trim() ? ` — ${t.description.trim()}` : ""
    lines.push(`  ${SI(t.status)} ${PE(t.priority)} ${t.id}: ${t.content}${desc}${deps}`)
  }
  lines.push("")

  if (graph.available.length > 0) {
    lines.push("Available Now:")
    for (const id of graph.available) {
      const t = todos.find(x => x.id === id)
      const desc = t?.description?.trim() ? ` — ${t.description.trim()}` : ""
      lines.push(`  → ${PE(t?.priority)} ${id}: ${t?.content}${desc}`)
    }
  } else {
    lines.push("Available Now: none")
  }
  lines.push("")

  const multi = graph.parallel.filter(g => g.length > 1)
  if (multi.length > 0) {
    lines.push("Parallel Groups:")
    multi.forEach((g, i) => lines.push(`  Group ${i + 1}: ${g.join(", ")}`))
    lines.push("")
  }

  if (Object.keys(graph.blocked).length > 0) {
    lines.push("Blocked:")
    for (const [id, blockers] of Object.entries(graph.blocked)) {
      const t = todos.find(x => x.id === id)
      const desc = t?.description?.trim() ? ` — ${t.description.trim()}` : ""
      lines.push(`  ⊗ ${id}: ${t?.content}${desc} ← waiting: ${blockers.join(", ")}`)
    }
  }

  return lines.join("\n")
}

// ============================================================================
// Tools
// ============================================================================

export const write = tool({
  description: "Create or update TODO list. TODOv2 (Prefer this instead of TODO)",
  args: {
    todos: tool.schema.array(
        tool.schema.object({
          id: tool.schema.string().describe("Task ID in concat format: E01-S01-T01"),
          content: tool.schema.string().describe("Short task summary"),
          description: tool.schema.string().optional().describe("Full task description"),
          status: tool.schema.string().describe("pending | ready | in_progress | waiting_review | done | cancelled"),
          priority: tool.schema.string().describe("CRIT | HIGH | MED | LOW"),
          blockedBy: tool.schema.array(tool.schema.string()).optional().describe("IDs of blocking tasks"),
        })
    ).describe("Array of todos"),
  },
  async execute(args, context) {
    const now = Date.now()
    const todos = args.todos.map((t: any) => ({ ...t, createdAt: t.createdAt || now, updatedAt: now }))
    await writeTodos(todos, context.sessionID, context.directory)
    return formatGraph(analyzeGraph(todos))
  },
})

export const read_five = tool({
  description: "Read current TODO list. Shows Next 5 tasks.",
  args: {},
  async execute(_args, context) {
    const todos = await readTodos(context.sessionID, context.directory)
    const graph = analyzeGraph(todos)
    if (graph.available.length === 0) return "No tasks available. All blocked or not ready."
    const next5 = graph.available.slice(0, 5)
    const lines: string[] = ["Next 5 available tasks:", ""]
    for (const id of next5) {
      const t = graph.todos.find(x => x.id === id)
      if (t) {
        const desc = t.description?.trim() ? `\n   ${t.description.trim()}` : ""
        lines.push(`${PE(t.priority)} ${id}: ${t.content}${desc}`)
        lines.push("")
      }
    }
    if (graph.available.length > 5) lines.push(`... +${graph.available.length - 5} more`)
    return lines.join("\n")
  },
})

export const read = tool({
  description: "Read current TODO list. Shows all tasks.",
  args: {},
  async execute(_args, context) {
    const todos = await readTodos(context.sessionID, context.directory)
    if (todos.length === 0) return "No todos. Use usethis_todo_write to create."
    return formatGraph(analyzeGraph(todos))
  },
})

export const read_by_id = tool({
  description: "Read task by id.",
  args: {
    id: tool.schema.string().describe("Task ID"),
  },
  async execute(args, context) {
    const todos = await readTodos(context.sessionID, context.directory)
    const todo = todos.find(t => t.id === args.id)
    if (!todo) return `❌ Task ${args.id} not found`

    const byId = new Map(todos.map(t => [t.id, t]))

    // Resolve blockers transitively (task -> blockedBy -> blockedBy ...)
    const blockers: Todo[] = []
    const missing: string[] = []
    const seen = new Set<string>()
    const stack = [...(todo.blockedBy || [])]

    while (stack.length > 0) {
      const id = stack.shift()!
      if (seen.has(id)) continue
      seen.add(id)

      const t = byId.get(id)
      if (!t) {
        missing.push(id)
        continue
      }

      blockers.push(t)
      if (t.blockedBy?.length) stack.push(...t.blockedBy)
    }

    const lines: string[] = []
    lines.push(`id: ${todo.id}`)
    lines.push(`priority: ${todo.priority}`)
    lines.push(`status: ${todo.status}`)

    if (todo.blockedBy?.length) {
      lines.push(`blockedBy: ${todo.blockedBy.join(", ")}`)
    }

    lines.push("")
    lines.push("content:")
    lines.push(todo.content)

    if (todo.description?.trim()) {
      lines.push("")
      lines.push("description:")
      lines.push(todo.description.trim())
    }

    if (blockers.length) {
      lines.push("")
      lines.push("blockedBy (resolved):")
      for (const b of blockers) {
        const d = b.description?.trim() ? ` — ${b.description.trim()}` : ""
        lines.push(`- ${b.id} [${b.status}] ${b.priority}: ${b.content}${d}`)
      }
    }

    if (missing.length) {
      lines.push("")
      lines.push(`blockedBy missing: ${missing.join(", ")}`)
    }

    return lines.join("\n")
  },
})

export const update = tool({
  description: "Update task(s). Send 1 or many for update",
  args: {
    todos: tool.schema.array(
        tool.schema.object({
          id: tool.schema.string().describe("Task ID in concat format: E01-S01-T01"),
          content: tool.schema.string().describe("Short task summary"),
          description: tool.schema.string().optional().describe("Full task description"),
          status: tool.schema.string().describe("pending | ready | in_progress | waiting_review | done | cancelled"),
          priority: tool.schema.string().describe("CRIT | HIGH | MED | LOW"),
          blockedBy: tool.schema.array(tool.schema.string()).optional().describe("IDs of blocking tasks"),
        })
    ).describe("Array of todos to update"),
  },
  async execute(args, context) {
    const todos = await readTodos(context.sessionID, context.directory)
    const now = Date.now()
    const byId = new Map(todos.map(t => [t.id, t]))

    for (const incoming of args.todos) {
      const existing = byId.get(incoming.id)
      if (existing) {
        Object.assign(existing, incoming)
        existing.updatedAt = now
      } else {
        byId.set(incoming.id, { ...incoming, createdAt: now, updatedAt: now })
      }
    }

    const merged = [...byId.values()]
    await writeTodos(merged, context.sessionID, context.directory)
    return `✅ Updated ${args.todos.length} task(s)\n\n${formatGraph(analyzeGraph(merged))}`
  },
})
