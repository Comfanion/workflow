import { describe, it, expect, beforeEach, afterEach } from "bun:test"
import { join } from "path"
import { writeFile } from "fs/promises"
import { CustomCompactionPlugin } from "../custom-compaction"
import {
  createMockCtx,
  createTempDir,
  cleanupTempDir,
  FIXTURE_SESSION_STATE,
  FIXTURE_STORY_MD,
  FIXTURE_EPIC_STATE,
  FIXTURE_TODOS,
} from "./helpers/mock-ctx"

// =============================================================================
// LOCAL REPLICAS of internal functions (not exported from plugin)
// These mirror the source logic so we can unit-test the algorithms directly.
// =============================================================================

const SERVICE_AGENTS = ["title", "compaction", "summary", "system"]

function isRealAgent(agent: string | null): boolean {
  if (!agent) return false
  return !SERVICE_AGENTS.includes(agent.toLowerCase())
}

const BASE_FILES = ["CLAUDE.md", "AGENTS.md"]

const AGENT_FILES: Record<string, string[]> = {
  dev: [...BASE_FILES, "docs/coding-standards/README.md", "docs/coding-standards/patterns.md"],
  coder: [...BASE_FILES, "docs/coding-standards/patterns.md"],
  architect: [...BASE_FILES, "docs/architecture.md", "docs/prd.md", "docs/coding-standards/README.md", "docs/architecture/adr"],
  pm: [...BASE_FILES, "docs/prd.md", "docs/architecture.md", "docs/sprint-artifacts/sprint-status.yaml", "docs/sprint-artifacts/backlog"],
  analyst: [...BASE_FILES, "docs/requirements/requirements.md", "docs/prd.md"],
  researcher: [...BASE_FILES, "docs/prd.md", "docs/research"],
  crawler: [...BASE_FILES],
  "change-manager": [...BASE_FILES, "docs/prd.md", "docs/architecture.md"],
}

const DEFAULT_FILES = [...BASE_FILES, "docs/prd.md", "docs/architecture.md"]

const MUST_READ_FILES: Record<string, string[]> = {
  dev: ["AGENTS.md", "CLAUDE.md", "docs/coding-standards/README.md"],
  coder: ["AGENTS.md", "CLAUDE.md", "docs/coding-standards/README.md"],
  architect: ["AGENTS.md", "CLAUDE.md", "docs/prd.md", "docs/architecture.md"],
  pm: ["AGENTS.md", "CLAUDE.md", "docs/prd.md"],
  analyst: ["AGENTS.md", "CLAUDE.md", "docs/prd.md"],
  researcher: ["AGENTS.md", "CLAUDE.md"],
  default: ["AGENTS.md", "CLAUDE.md"],
}

// =============================================================================
// UNIT TESTS: isRealAgent (replica)
// =============================================================================
describe("isRealAgent", () => {
  it("returns false for null", () => {
    expect(isRealAgent(null)).toBe(false)
  })

  it("returns false for service agents", () => {
    for (const agent of SERVICE_AGENTS) {
      expect(isRealAgent(agent)).toBe(false)
    }
  })

  it("returns false for service agents (case-insensitive)", () => {
    expect(isRealAgent("Title")).toBe(false)
    expect(isRealAgent("COMPACTION")).toBe(false)
    expect(isRealAgent("Summary")).toBe(false)
    expect(isRealAgent("SYSTEM")).toBe(false)
  })

  it("returns true for real agents", () => {
    expect(isRealAgent("dev")).toBe(true)
    expect(isRealAgent("pm")).toBe(true)
    expect(isRealAgent("architect")).toBe(true)
    expect(isRealAgent("analyst")).toBe(true)
    expect(isRealAgent("researcher")).toBe(true)
    expect(isRealAgent("coder")).toBe(true)
    expect(isRealAgent("reviewer")).toBe(true)
  })

  it("returns true for unknown non-service agents", () => {
    expect(isRealAgent("custom-agent")).toBe(true)
    expect(isRealAgent("myagent")).toBe(true)
  })
})

// =============================================================================
// UNIT TESTS: Constants validation (replicas)
// =============================================================================
describe("constants", () => {
  it("SERVICE_AGENTS contains expected entries", () => {
    expect(SERVICE_AGENTS).toContain("title")
    expect(SERVICE_AGENTS).toContain("compaction")
    expect(SERVICE_AGENTS).toContain("summary")
    expect(SERVICE_AGENTS).toContain("system")
    expect(SERVICE_AGENTS.length).toBe(4)
  })

  it("BASE_FILES contains CLAUDE.md and AGENTS.md", () => {
    expect(BASE_FILES).toContain("CLAUDE.md")
    expect(BASE_FILES).toContain("AGENTS.md")
  })

  it("AGENT_FILES covers all known agent types", () => {
    const expectedAgents = [
      "dev", "coder", "architect", "pm", "analyst", "researcher", "crawler", "change-manager",
    ]
    for (const agent of expectedAgents) {
      expect(AGENT_FILES[agent]).toBeDefined()
      expect(AGENT_FILES[agent].length).toBeGreaterThan(0)
    }
  })

  it("all AGENT_FILES include BASE_FILES", () => {
    for (const [_agent, files] of Object.entries(AGENT_FILES)) {
      for (const baseFile of BASE_FILES) {
        expect(files).toContain(baseFile)
      }
    }
  })

  it("DEFAULT_FILES includes BASE_FILES + prd + architecture", () => {
    expect(DEFAULT_FILES).toContain("CLAUDE.md")
    expect(DEFAULT_FILES).toContain("AGENTS.md")
    expect(DEFAULT_FILES).toContain("docs/prd.md")
    expect(DEFAULT_FILES).toContain("docs/architecture.md")
  })

  it("MUST_READ_FILES has 'default' key", () => {
    expect(MUST_READ_FILES.default).toBeDefined()
    expect(MUST_READ_FILES.default.length).toBeGreaterThan(0)
  })

  it("MUST_READ_FILES dev includes AGENTS.md and CLAUDE.md", () => {
    expect(MUST_READ_FILES.dev).toContain("AGENTS.md")
    expect(MUST_READ_FILES.dev).toContain("CLAUDE.md")
  })

  it("MUST_READ_FILES dev includes coding-standards", () => {
    expect(MUST_READ_FILES.dev).toContain("docs/coding-standards/README.md")
  })
})

// =============================================================================
// INTEGRATION: Plugin hook structure
// =============================================================================
describe("CustomCompactionPlugin: hook structure", () => {
  let tempDir: string

  beforeEach(async () => {
    tempDir = await createTempDir()
  })

  afterEach(async () => {
    await cleanupTempDir(tempDir)
  })

  it("returns all required hooks", async () => {
    const ctx = createMockCtx(tempDir)
    const hooks = await CustomCompactionPlugin(ctx as any)

    expect(hooks["chat.message"]).toBeFunction()
    expect(hooks["chat.params"]).toBeFunction()
    expect(hooks["experimental.session.compacting"]).toBeFunction()
    expect(hooks.event).toBeFunction()
  })
})

// =============================================================================
// INTEGRATION: chat.message hook (agent tracking)
// =============================================================================
describe("chat.message hook", () => {
  let tempDir: string

  beforeEach(async () => {
    tempDir = await createTempDir()
  })

  afterEach(async () => {
    await cleanupTempDir(tempDir)
  })

  it("tracks string agent name", async () => {
    const ctx = createMockCtx(tempDir)
    const hooks = await CustomCompactionPlugin(ctx as any)

    await hooks["chat.message"]!(
      { agent: "dev", sessionID: "sess-1" } as any,
      { message: {}, parts: [] } as any
    )

    const output = { context: [] as string[], prompt: undefined }
    await hooks["experimental.session.compacting"]!(
      { sessionID: "sess-1" } as any,
      output as any
    )

    expect(output.context.length).toBeGreaterThan(0)
    const briefing = output.context.join("\n")
    expect(briefing).toContain("@dev")
  })

  it("tracks object agent with name property", async () => {
    const ctx = createMockCtx(tempDir)
    const hooks = await CustomCompactionPlugin(ctx as any)

    await hooks["chat.message"]!(
      { agent: { name: "architect" }, sessionID: "sess-1" } as any,
      { message: {}, parts: [] } as any
    )

    const output = { context: [] as string[], prompt: undefined }
    await hooks["experimental.session.compacting"]!(
      { sessionID: "sess-1" } as any,
      output as any
    )

    const briefing = output.context.join("\n")
    expect(briefing).toContain("@architect")
  })

  it("ignores service agents", async () => {
    const ctx = createMockCtx(tempDir)
    const hooks = await CustomCompactionPlugin(ctx as any)

    // First set a real agent
    await hooks["chat.message"]!(
      { agent: "dev", sessionID: "sess-1" } as any,
      { message: {}, parts: [] } as any
    )

    // Then send service agent - should NOT override
    await hooks["chat.message"]!(
      { agent: "compaction", sessionID: "sess-1" } as any,
      { message: {}, parts: [] } as any
    )

    const output = { context: [] as string[], prompt: undefined }
    await hooks["experimental.session.compacting"]!(
      { sessionID: "sess-1" } as any,
      output as any
    )

    const briefing = output.context.join("\n")
    expect(briefing).toContain("@dev")
    expect(briefing).not.toContain("@compaction")
  })

  it("handles null agent without crashing", async () => {
    const ctx = createMockCtx(tempDir)
    const hooks = await CustomCompactionPlugin(ctx as any)

    await hooks["chat.message"]!(
      { agent: null, sessionID: "sess-1" } as any,
      { message: {}, parts: [] } as any
    )
    // Should not throw
  })

  it("handles missing agent field", async () => {
    const ctx = createMockCtx(tempDir)
    const hooks = await CustomCompactionPlugin(ctx as any)

    await hooks["chat.message"]!(
      { sessionID: "sess-1" } as any,
      { message: {}, parts: [] } as any
    )
    // Should not throw
  })
})

// =============================================================================
// INTEGRATION: chat.params hook (agent tracking backup)
// =============================================================================
describe("chat.params hook", () => {
  let tempDir: string

  beforeEach(async () => {
    tempDir = await createTempDir()
  })

  afterEach(async () => {
    await cleanupTempDir(tempDir)
  })

  it("tracks agent from params as backup", async () => {
    const ctx = createMockCtx(tempDir)
    const hooks = await CustomCompactionPlugin(ctx as any)

    await hooks["chat.params"]!(
      { agent: "pm", sessionID: "sess-1", model: {}, provider: {}, message: {} } as any,
      { temperature: 0.3, topP: 1, topK: 0, options: {} } as any
    )

    const output = { context: [] as string[], prompt: undefined }
    await hooks["experimental.session.compacting"]!(
      { sessionID: "sess-1" } as any,
      output as any
    )

    const briefing = output.context.join("\n")
    expect(briefing).toContain("@pm")
  })

  it("ignores service agents in params", async () => {
    const ctx = createMockCtx(tempDir)
    const hooks = await CustomCompactionPlugin(ctx as any)

    await hooks["chat.params"]!(
      { agent: "title", sessionID: "sess-1", model: {}, provider: {}, message: {} } as any,
      { temperature: 0.3, topP: 1, topK: 0, options: {} } as any
    )

    const output = { context: [] as string[], prompt: undefined }
    await hooks["experimental.session.compacting"]!(
      { sessionID: "sess-1" } as any,
      output as any
    )

    expect(output.context.length).toBeGreaterThan(0)
    const briefing = output.context.join("\n")
    expect(briefing).not.toContain("@title")
  })
})

// =============================================================================
// INTEGRATION: experimental.session.compacting hook
// =============================================================================
describe("compaction hook", () => {
  let tempDir: string

  beforeEach(async () => {
    tempDir = await createTempDir()
  })

  afterEach(async () => {
    await cleanupTempDir(tempDir)
  })

  it("pushes context to output.context array", async () => {
    const ctx = createMockCtx(tempDir)
    const hooks = await CustomCompactionPlugin(ctx as any)

    const output = { context: [] as string[], prompt: undefined }
    await hooks["experimental.session.compacting"]!(
      { sessionID: "sess-1" } as any,
      output as any
    )

    expect(output.context.length).toBeGreaterThan(0)
    expect(typeof output.context[0]).toBe("string")
  })

  it("includes read commands in output", async () => {
    const ctx = createMockCtx(tempDir)
    const hooks = await CustomCompactionPlugin(ctx as any)

    const output = { context: [] as string[], prompt: undefined }
    await hooks["experimental.session.compacting"]!(
      { sessionID: "sess-1" } as any,
      output as any
    )

    const fullContext = output.context.join("\n")
    expect(fullContext).toContain("Read")
    expect(fullContext).toContain("AGENTS.md")
  })

  it("includes DO NOT ask instruction", async () => {
    const ctx = createMockCtx(tempDir)
    const hooks = await CustomCompactionPlugin(ctx as any)

    const output = { context: [] as string[], prompt: undefined }
    await hooks["experimental.session.compacting"]!(
      { sessionID: "sess-1" } as any,
      output as any
    )

    const fullContext = output.context.join("\n")
    expect(fullContext).toContain("DO NOT ask user")
  })

  it("includes session state when available", async () => {
    const dir = await createTempDir({
      ".opencode/session-state.yaml": FIXTURE_SESSION_STATE,
      ".opencode/state/todos.json": FIXTURE_TODOS,
    })

    const ctx = createMockCtx(dir)
    const hooks = await CustomCompactionPlugin(ctx as any)

    await hooks["chat.message"]!(
      { agent: "dev", sessionID: "sess-1" } as any,
      { message: {}, parts: [] } as any
    )

    const output = { context: [] as string[], prompt: undefined }
    await hooks["experimental.session.compacting"]!(
      { sessionID: "sess-1" } as any,
      output as any
    )

    const briefing = output.context.join("\n")
    expect(briefing).toContain("AUTH-E01")
    expect(briefing).toContain("AUTH-S01-03")
    expect(briefing).toContain("/dev-epic")

    await cleanupTempDir(dir)
  })

  it("formats dev context with story info from session state", async () => {
    const storyPath = "docs/sprint-artifacts/sprint-1/stories/story-01-03-jwt-refresh.md"
    const dir = await createTempDir({
      ".opencode/session-state.yaml": FIXTURE_SESSION_STATE,
      ".opencode/state/todos.json": FIXTURE_TODOS,
      [storyPath]: FIXTURE_STORY_MD,
    })

    const ctx = createMockCtx(dir)
    const hooks = await CustomCompactionPlugin(ctx as any)

    await hooks["chat.message"]!(
      { agent: "dev", sessionID: "sess-1" } as any,
      { message: {}, parts: [] } as any
    )

    const output = { context: [] as string[], prompt: undefined }
    await hooks["experimental.session.compacting"]!(
      { sessionID: "sess-1" } as any,
      output as any
    )

    const briefing = output.context.join("\n")
    expect(briefing).toContain("T2")
    expect(briefing).toContain("T1")
    expect(briefing).toContain("session-state.yaml")

    await cleanupTempDir(dir)
  })

  it("pushes context AND instructions (fix #5 verification)", async () => {
    const dir = await createTempDir({
      ".opencode/session-state.yaml": FIXTURE_SESSION_STATE,
      ".opencode/state/todos.json": FIXTURE_TODOS,
    })

    const ctx = createMockCtx(dir)
    const hooks = await CustomCompactionPlugin(ctx as any)

    await hooks["chat.message"]!(
      { agent: "dev", sessionID: "sess-1" } as any,
      { message: {}, parts: [] } as any
    )

    const output = { context: [] as string[], prompt: undefined }
    await hooks["experimental.session.compacting"]!(
      { sessionID: "sess-1" } as any,
      output as any
    )

    // After fix #5: should have briefing + context + instructions = 3 items
    expect(output.context.length).toBeGreaterThanOrEqual(2)
    // The full output should contain both agent-specific context and resume instructions
    const fullContext = output.context.join("\n")
    // Context should have session state info
    expect(fullContext).toContain("Session State")
    // Instructions should have resume protocol
    expect(fullContext).toContain("IN PROGRESS")

    await cleanupTempDir(dir)
  })

  it("falls back gracefully when no session state exists", async () => {
    const ctx = createMockCtx(tempDir)
    const hooks = await CustomCompactionPlugin(ctx as any)

    await hooks["chat.message"]!(
      { agent: "dev", sessionID: "sess-1" } as any,
      { message: {}, parts: [] } as any
    )

    const output = { context: [] as string[], prompt: undefined }
    await hooks["experimental.session.compacting"]!(
      { sessionID: "sess-1" } as any,
      output as any
    )

    expect(output.context.length).toBeGreaterThan(0)
    const briefing = output.context.join("\n")
    expect(briefing).toContain("@dev")
    expect(briefing).toContain("Read")
  })

  it("formats architect-specific context", async () => {
    const ctx = createMockCtx(tempDir)
    const hooks = await CustomCompactionPlugin(ctx as any)

    await hooks["chat.message"]!(
      { agent: "architect", sessionID: "sess-1" } as any,
      { message: {}, parts: [] } as any
    )

    const output = { context: [] as string[], prompt: undefined }
    await hooks["experimental.session.compacting"]!(
      { sessionID: "sess-1" } as any,
      output as any
    )

    const briefing = output.context.join("\n")
    expect(briefing).toContain("@architect")
  })

  it("formats PM-specific context", async () => {
    const ctx = createMockCtx(tempDir)
    const hooks = await CustomCompactionPlugin(ctx as any)

    await hooks["chat.message"]!(
      { agent: "pm", sessionID: "sess-1" } as any,
      { message: {}, parts: [] } as any
    )

    const output = { context: [] as string[], prompt: undefined }
    await hooks["experimental.session.compacting"]!(
      { sessionID: "sess-1" } as any,
      output as any
    )

    const briefing = output.context.join("\n")
    expect(briefing).toContain("@pm")
  })

  it("handles unknown agent with default context", async () => {
    const ctx = createMockCtx(tempDir)
    const hooks = await CustomCompactionPlugin(ctx as any)

    await hooks["chat.message"]!(
      { agent: "custom-agent", sessionID: "sess-1" } as any,
      { message: {}, parts: [] } as any
    )

    const output = { context: [] as string[], prompt: undefined }
    await hooks["experimental.session.compacting"]!(
      { sessionID: "sess-1" } as any,
      output as any
    )

    expect(output.context.length).toBeGreaterThan(0)
  })
})

// =============================================================================
// INTEGRATION: event hook
// =============================================================================
describe("event hook", () => {
  let tempDir: string

  beforeEach(async () => {
    tempDir = await createTempDir()
  })

  afterEach(async () => {
    await cleanupTempDir(tempDir)
  })

  it("handles session.idle event without error", async () => {
    const ctx = createMockCtx(tempDir)
    const hooks = await CustomCompactionPlugin(ctx as any)

    await hooks.event!({ event: { type: "session.idle" } as any })
  })

  it("handles unknown event types gracefully", async () => {
    const ctx = createMockCtx(tempDir)
    const hooks = await CustomCompactionPlugin(ctx as any)

    await hooks.event!({ event: { type: "unknown.event" } as any })
    await hooks.event!({ event: { type: "todo.updated" } as any })
    await hooks.event!({ event: { type: "file.edited" } as any })
  })
})

// =============================================================================
// INTEGRATION: Epic state parsing (via compaction hook)
// =============================================================================
describe("epic state parsing", () => {
  it("parses active epic state from sprint directory", async () => {
    const dir = await createTempDir({
      "docs/sprint-artifacts/sprint-1/.sprint-state/epic-01-state.yaml": FIXTURE_EPIC_STATE,
      ".opencode/state/todos.json": "[]",
    })

    const ctx = createMockCtx(dir)
    const hooks = await CustomCompactionPlugin(ctx as any)

    await hooks["chat.message"]!(
      { agent: "dev", sessionID: "sess-1" } as any,
      { message: {}, parts: [] } as any
    )

    const output = { context: [] as string[], prompt: undefined }
    await hooks["experimental.session.compacting"]!(
      { sessionID: "sess-1" } as any,
      output as any
    )

    const briefing = output.context.join("\n")
    expect(briefing).toContain("epic-01-state.yaml")
    expect(briefing).toContain("@dev")

    await cleanupTempDir(dir)
  })

  it("prefers session-state.yaml over epic state file", async () => {
    const dir = await createTempDir({
      ".opencode/session-state.yaml": FIXTURE_SESSION_STATE,
      "docs/sprint-artifacts/sprint-1/.sprint-state/epic-01-state.yaml": FIXTURE_EPIC_STATE,
      ".opencode/state/todos.json": FIXTURE_TODOS,
    })

    const ctx = createMockCtx(dir)
    const hooks = await CustomCompactionPlugin(ctx as any)

    await hooks["chat.message"]!(
      { agent: "dev", sessionID: "sess-1" } as any,
      { message: {}, parts: [] } as any
    )

    const output = { context: [] as string[], prompt: undefined }
    await hooks["experimental.session.compacting"]!(
      { sessionID: "sess-1" } as any,
      output as any
    )

    const briefing = output.context.join("\n")
    expect(briefing).toContain("/dev-epic")
    expect(briefing).toContain("AUTH-S01-03")

    await cleanupTempDir(dir)
  })
})

// =============================================================================
// INTEGRATION: TODO list in compaction
// =============================================================================
describe("TODO list integration", () => {
  let tempDir: string

  beforeEach(async () => {
    tempDir = await createTempDir()
  })

  afterEach(async () => {
    await cleanupTempDir(tempDir)
  })

  it("includes TODO status in compaction output", async () => {
    const dir = await createTempDir({
      ".opencode/state/todos.json": FIXTURE_TODOS,
    })

    const ctx = createMockCtx(dir)
    const hooks = await CustomCompactionPlugin(ctx as any)

    await hooks["chat.message"]!(
      { agent: "dev", sessionID: "sess-1" } as any,
      { message: {}, parts: [] } as any
    )

    const output = { context: [] as string[], prompt: undefined }
    await hooks["experimental.session.compacting"]!(
      { sessionID: "sess-1" } as any,
      output as any
    )

    const briefing = output.context.join("\n")
    expect(briefing).toContain("TODO")
    expect(briefing).toMatch(/\d+ done/)
    expect(briefing).toMatch(/\d+ in progress/)

    await cleanupTempDir(dir)
  })

  it("handles empty TODO list gracefully", async () => {
    const dir = await createTempDir({
      ".opencode/state/todos.json": "[]",
    })

    const ctx = createMockCtx(dir)
    const hooks = await CustomCompactionPlugin(ctx as any)

    const output = { context: [] as string[], prompt: undefined }
    await hooks["experimental.session.compacting"]!(
      { sessionID: "sess-1" } as any,
      output as any
    )

    expect(output.context.length).toBeGreaterThan(0)

    await cleanupTempDir(dir)
  })

  it("handles missing TODO file gracefully", async () => {
    const ctx = createMockCtx(tempDir)
    const hooks = await CustomCompactionPlugin(ctx as any)

    const output = { context: [] as string[], prompt: undefined }
    await hooks["experimental.session.compacting"]!(
      { sessionID: "sess-1" } as any,
      output as any
    )

    expect(output.context.length).toBeGreaterThan(0)
  })
})

// =============================================================================
// MEMORY SAFETY
// =============================================================================
describe("memory safety", () => {
  let tempDir: string

  beforeEach(async () => {
    tempDir = await createTempDir()
  })

  afterEach(async () => {
    await cleanupTempDir(tempDir)
  })

  it("agent tracking overwrites, doesn't accumulate", async () => {
    const ctx = createMockCtx(tempDir)
    const hooks = await CustomCompactionPlugin(ctx as any)

    // Send 1000 different agents - should only track the latest
    for (let i = 0; i < 1000; i++) {
      await hooks["chat.message"]!(
        { agent: `agent-${i}`, sessionID: "sess-1" } as any,
        { message: {}, parts: [] } as any
      )
    }

    const output = { context: [] as string[], prompt: undefined }
    await hooks["experimental.session.compacting"]!(
      { sessionID: "sess-1" } as any,
      output as any
    )

    const briefing = output.context.join("\n")
    expect(briefing).toContain("@agent-999")
    expect(briefing).not.toContain("@agent-0")
    expect(briefing).not.toContain("@agent-500")
  })

  it("repeated compaction doesn't leak context", async () => {
    const ctx = createMockCtx(tempDir)
    const hooks = await CustomCompactionPlugin(ctx as any)

    await hooks["chat.message"]!(
      { agent: "dev", sessionID: "sess-1" } as any,
      { message: {}, parts: [] } as any
    )

    // Run compaction 100 times with FRESH output each time
    for (let i = 0; i < 100; i++) {
      const output = { context: [] as string[], prompt: undefined }
      await hooks["experimental.session.compacting"]!(
        { sessionID: "sess-1" } as any,
        output as any
      )

      // Each compaction should produce a bounded number of context entries
      // (briefing + context + instructions = up to 3)
      expect(output.context.length).toBeGreaterThanOrEqual(1)
      expect(output.context.length).toBeLessThanOrEqual(3)
    }
  })

  it("compaction doesn't grow output.context with repeated calls", async () => {
    const ctx = createMockCtx(tempDir)
    const hooks = await CustomCompactionPlugin(ctx as any)

    const output = { context: [] as string[], prompt: undefined }

    const CALLS = 10
    for (let i = 0; i < CALLS; i++) {
      await hooks["experimental.session.compacting"]!(
        { sessionID: "sess-1" } as any,
        output as any
      )
    }

    // The plugin pushes up to 3 items per call (briefing + context + instructions)
    const itemsPerCall = output.context.length / CALLS
    expect(itemsPerCall).toBeGreaterThanOrEqual(1)
    expect(itemsPerCall).toBeLessThanOrEqual(3)
  })

  it("multiple plugin instances don't leak memory", async () => {
    const memBefore = process.memoryUsage().heapUsed

    for (let i = 0; i < 50; i++) {
      const dir = await createTempDir()
      const ctx = createMockCtx(dir)
      const hooks = await CustomCompactionPlugin(ctx as any)

      await hooks["chat.message"]!(
        { agent: "dev", sessionID: `sess-${i}` } as any,
        { message: {}, parts: [] } as any
      )
      const output = { context: [] as string[], prompt: undefined }
      await hooks["experimental.session.compacting"]!(
        { sessionID: `sess-${i}` } as any,
        output as any
      )
      await hooks.event!({ event: { type: "session.idle" } as any })

      await cleanupTempDir(dir)
    }

    if ((globalThis as any).gc) (globalThis as any).gc()

    const memAfter = process.memoryUsage().heapUsed
    const growthMB = (memAfter - memBefore) / 1024 / 1024

    expect(growthMB).toBeLessThan(100)
  })
})
