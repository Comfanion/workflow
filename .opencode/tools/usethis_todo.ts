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
  releases?: string[]     // Release identifiers (optional)
  status: string          // todo | in_progress | ready | done
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
    todo: "pending",
    in_progress: "in_progress",
    ready: "in_progress",       // native has no "ready"
    finished: "in_progress",    // back-compat
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
  const rel = todo.releases?.length ? ` [rel: ${todo.releases.join(", ")}]` : ""

  return {
    id: todo.id,
    content: `${todo.content}${desc}${rel}${deps}`,
    status: statusMap[todo.status] || "pending",
    priority: prioMap[todo.priority] || "medium",
  }
}

async function readTodos(sid: string, directory?: string): Promise<Todo[]> {
  try {
    const raw = JSON.parse(await fs.readFile(getEnhancedPath(sid, directory), "utf-8"))
    if (!Array.isArray(raw)) return []
    return raw.map((t: any) => normalizeTodo(t))
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
    if (normalizeStatus(todo.status) !== "todo") continue
    const activeBlockers = (todo.blockedBy || []).filter(id => {
      const b = todos.find(t => t.id === id)
      const bs = normalizeStatus(b?.status)
      return b && bs !== "done" && bs !== "cancelled"
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
const SI = (s: string) => s === "done" ? "✓" : s === "in_progress" ? "⚙" : s === "ready" ? "⏳" : s === "cancelled" ? "✗" : s === "todo" ? "○" : "·"

function normalizeStatus(input: unknown): string {
  const s = String(input || "").trim()

  // New canonical set
  if (s === "todo" || s === "in_progress" || s === "ready" || s === "done") return s

  // Back-compat (older versions)
  if (s === "pending") return "todo"
  if (s === "waiting_review" || s === "finished") return "ready"
  if (s === "completed") return "done"

  // Keep cancelled if it appears (native supports it)
  if (s === "cancelled") return "cancelled"

  // Default
  return "todo"
}

function normalizeReleases(input: unknown): string[] | undefined {
  if (!Array.isArray(input)) return undefined
  const values = input
    .map((x) => String(x || "").trim())
    .filter(Boolean)
  return values.length ? values : undefined
}

function normalizeTodo(input: any): Todo {
  const status = normalizeStatus(input?.status)
  const releases = normalizeReleases(input?.releases)

  // Auto transition: ready -> done when releases exist
  const promotedStatus = status === "ready" && releases?.length ? "done" : status

  return {
    ...input,
    status: promotedStatus,
    releases,
  }
}

function prioRank(p?: string): number {
  return p === "CRIT" ? 0 : p === "HIGH" ? 1 : p === "MED" ? 2 : 3
}

function sortTodosForList(todos: Todo[]): Todo[] {
  return todos
    .slice()
    .sort((a, b) => (prioRank(a.priority) - prioRank(b.priority)) || a.id.localeCompare(b.id))
}

function isBlocked(todo: Todo, byId: Map<string, Todo>): boolean {
  const s = normalizeStatus(todo.status)
  if (s !== "todo") return false
  if (!todo.blockedBy?.length) return false
  for (const id of todo.blockedBy) {
    const b = byId.get(id)
    const bs = normalizeStatus(b?.status)
    if (!b) return true
    if (bs !== "done" && bs !== "cancelled") return true
  }
  return false
}

function todoLine(todo: Todo, byId: Map<string, Todo>): string {
  const desc = todo.description?.trim() ? ` — ${todo.description.trim()}` : ""
  const rel = todo.releases?.length ? ` [rel: ${todo.releases.join(", ")}]` : ""
  const deps = todo.blockedBy?.length ? ` ← ${todo.blockedBy.join(", ")}` : ""
  const ns = normalizeStatus(todo.status)
  const icon = isBlocked(todo, byId) ? "⊗" : SI(ns)
  return `${icon} ${PE(todo.priority)} ${todo.id}: ${todo.content}${desc}${rel}${deps}`
}

function renderNestedTodoList(todos: Todo[], allTodos?: Todo[]): string {
  const byId = new Map((allTodos || todos).map(t => [t.id, t]))

  // Group by id pattern: E01-S01-T01 → 3 nested levels (E01 → S01 → tasks)
  const groups = new Map<string, Map<string, Todo[]>>()
  const flat: Todo[] = []

  for (const t of todos) {
    const parts = t.id.split("-")
    if (parts.length >= 3) {
      const epic = parts[0]
      const story = parts[1]
      if (!groups.has(epic)) groups.set(epic, new Map())
      const storyMap = groups.get(epic)!
      if (!storyMap.has(story)) storyMap.set(story, [])
      storyMap.get(story)!.push(t)
    } else {
      flat.push(t)
    }
  }

  const lines: string[] = []
  const epicKeys = [...groups.keys()].sort()
  for (const epic of epicKeys) {
    lines.push(`- ${epic}`)
    const storyMap = groups.get(epic)!
    const storyKeys = [...storyMap.keys()].sort()
    for (const story of storyKeys) {
      lines.push(`  - ${epic}-${story}`)
      const tasks = storyMap.get(story)!
        .slice()
        .sort((a, b) => a.id.localeCompare(b.id))
      for (const t of tasks) {
        lines.push(`    - ${todoLine(t, byId)}`)
      }
    }
  }

  const flatSorted = flat.slice().sort((a, b) => a.id.localeCompare(b.id))
  for (const t of flatSorted) {
    lines.push(`- ${todoLine(t, byId)}`)
  }

  return lines.length ? lines.join("\n") : "- (empty)"
}

function resolveBlockers(todos: Todo[], rootIds: string[]): { blockers: Todo[]; missing: string[] } {
  const byId = new Map(todos.map(t => [t.id, t]))
  const blockers: Todo[] = []
  const missing: string[] = []
  const seen = new Set<string>()
  const stack: string[] = []

  for (const id of rootIds) {
    const t = byId.get(id)
    if (!t?.blockedBy?.length) continue
    stack.push(...t.blockedBy)
  }

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

  blockers.sort((a, b) => a.id.localeCompare(b.id))
  missing.sort((a, b) => a.localeCompare(b))
  return { blockers, missing }
}

function formatGraph(graph: TodoGraph): string {
  const { todos } = graph
  const total = todos.length
  const done = todos.filter(t => normalizeStatus(t.status) === "done").length
  const wip = todos.filter(t => normalizeStatus(t.status) === "in_progress").length

  const availableTodos = graph.available
    .map((id) => todos.find((t) => t.id === id))
    .filter(Boolean) as Todo[]

  const blockedTodos = Object.keys(graph.blocked)
    .map((id) => todos.find((t) => t.id === id))
    .filter(Boolean) as Todo[]

  const lines: string[] = []
  lines.push(`TODO Graph [${done}/${total} done, ${wip} in progress]`)
  lines.push("")
  lines.push("All Tasks:")
  lines.push(renderNestedTodoList(sortTodosForList(todos), todos))
  lines.push("")
  lines.push("Available Now:")
  lines.push(availableTodos.length ? renderNestedTodoList(availableTodos, todos) : "- (none)")
  lines.push("")
  lines.push("Blocked:")
  lines.push(blockedTodos.length ? renderNestedTodoList(blockedTodos, todos) : "- (none)")
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
          releases: tool.schema.array(tool.schema.string()).optional().describe("Release identifiers"),
          status: tool.schema.string().describe("todo | in_progress | ready | done"),
          priority: tool.schema.string().describe("CRIT | HIGH | MED | LOW"),
          blockedBy: tool.schema.array(tool.schema.string()).optional().describe("IDs of blocking tasks"),
        })
    ).describe("Array of todos"),
  },
  async execute(args, context) {
    const now = Date.now()
    const todos = args.todos.map((t: any) => normalizeTodo({ ...t, createdAt: t.createdAt || now, updatedAt: now }))
    await writeTodos(todos, context.sessionID, context.directory)
    return formatGraph(analyzeGraph(todos))
  },
})

export const read_five = tool({
  description: "Read current TODO list. Shows Next 5 tasks.",
  args: {},
  async execute(_args, context) {
    const todos = await readTodos(context.sessionID, context.directory)
    const ready = sortTodosForList(todos.filter(t => normalizeStatus(t.status) === "todo"))
    if (ready.length === 0) return "No tasks in todo."

    const items = ready.slice(0, 5)

    const rootIds = items.map(t => t.id)
    const rootSet = new Set(rootIds)
    const resolved = resolveBlockers(todos, rootIds)
    const blockers = resolved.blockers.filter(t => !rootSet.has(t.id))
    const missing = resolved.missing

    const more = ready.length > 5 ? `+${ready.length - 5} more` : ""

    const lines: string[] = []
    lines.push("Next 5:")
    lines.push(renderNestedTodoList(items, todos))
    if (more) lines.push(more)

    lines.push("")
    lines.push(`Blocked By (resolved) [${blockers.length}]:`)
    lines.push(blockers.length ? renderNestedTodoList(blockers, todos) : "- (none)")
    if (missing.length) {
      lines.push("")
      lines.push(`Blocked By missing: ${missing.join(", ")}`)
    }

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

    const { blockers, missing } = resolveBlockers(todos, [todo.id])

    const lines: string[] = []
    lines.push("Task:")
    lines.push(`- ${todoLine(todo, new Map(todos.map(t => [t.id, t])) )}`)

    lines.push("")
    lines.push("Blocked By (resolved):")
    lines.push(blockers.length ? renderNestedTodoList(blockers, todos) : "- (none)")

    if (missing.length) {
      lines.push("")
      lines.push(`Blocked By missing: ${missing.join(", ")}`)
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
          releases: tool.schema.array(tool.schema.string()).optional().describe("Release identifiers(from ready -> done)"),
          status: tool.schema.string().describe("todo | in_progress | ready | done"),
          priority: tool.schema.string().describe("CRIT | HIGH | MED | LOW"),
          blockedBy: tool.schema.array(tool.schema.string()).optional().describe("IDs of blocking tasks(from todo -> blocked)"),
        })
    ).describe("Array of todos to update"),
  },
  async execute(args, context) {
    const todos = await readTodos(context.sessionID, context.directory)
    const now = Date.now()
    const byId = new Map(todos.map(t => [t.id, t]))

    for (const incoming of args.todos) {
      const normalizedIncoming: any = normalizeTodo(incoming)
      const existing = byId.get(normalizedIncoming.id)
      if (existing) {
        Object.assign(existing, normalizedIncoming)
        existing.updatedAt = now
        // Ensure auto transition is applied after merge
        existing.status = normalizeTodo(existing).status
        existing.releases = normalizeTodo(existing).releases
      } else {
        byId.set(normalizedIncoming.id, normalizeTodo({ ...normalizedIncoming, createdAt: now, updatedAt: now }))
      }
    }

    const merged = [...byId.values()]
    await writeTodos(merged, context.sessionID, context.directory)
    return `✅ Updated ${args.todos.length} task(s)\n\n${formatGraph(analyzeGraph(merged))}`
  },
})
