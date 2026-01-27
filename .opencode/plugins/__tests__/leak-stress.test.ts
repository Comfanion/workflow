/**
 * Memory Leak Stress Tests
 *
 * Goal: prove the 3 plugins are NOT the source of a memory leak.
 *
 * Strategy:
 * 1. Run each plugin's hot path N times in a tight loop
 * 2. Measure heap snapshots at intervals
 * 3. Assert heap growth is sub-linear (flat / bounded)
 * 4. Specifically test known risk areas:
 *    - custom-compaction: closure variables (lastActiveAgent, lastSessionId)
 *    - file-indexer: module-level pendingFiles Map
 *    - version-check: stateless (baseline)
 *
 * NOTE: Tests use only the public plugin interface (no internal imports).
 *
 * Run only leak tests:
 *   bun test plugins/__tests__/leak-stress.test.ts
 */
import { describe, it, expect, beforeEach, afterEach } from "bun:test"
import { join } from "path"
import {
  createMockCtx,
  createTempDir,
  cleanupTempDir,
  FIXTURE_SESSION_STATE,
  FIXTURE_STORY_MD,
  FIXTURE_EPIC_STATE,
  FIXTURE_TODOS,
  FIXTURE_CONFIG_YAML,
} from "./helpers/mock-ctx"
import { CustomCompactionPlugin } from "../custom-compaction"
import { FileIndexerPlugin } from "../file-indexer"
import { VersionCheckPlugin } from "../version-check"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function heapMB(): number {
  return process.memoryUsage().heapUsed / 1024 / 1024
}

function tryGC(): void {
  if (typeof globalThis.gc === "function") {
    globalThis.gc()
  }
}

/** Take N heap snapshots at equal intervals during a callback. */
async function profile(
  iterations: number,
  snapshots: number,
  fn: (i: number) => Promise<void>,
): Promise<number[]> {
  const interval = Math.floor(iterations / snapshots)
  const heaps: number[] = []

  tryGC()
  heaps.push(heapMB())

  for (let i = 0; i < iterations; i++) {
    await fn(i)
    if ((i + 1) % interval === 0) {
      tryGC()
      heaps.push(heapMB())
    }
  }

  return heaps
}

/**
 * Check that heap growth is bounded:
 * last snapshot - first snapshot < maxGrowthMB.
 */
function assertBoundedGrowth(
  heaps: number[],
  maxGrowthMB: number,
  label: string,
): void {
  const growth = heaps[heaps.length - 1] - heaps[0]
  const peak = Math.max(...heaps)
  const valley = Math.min(...heaps)

  console.log(
    `  [${label}] heap snapshots (MB): ${heaps.map((h) => h.toFixed(1)).join(" -> ")}`,
  )
  console.log(
    `  [${label}] growth: ${growth.toFixed(1)} MB, peak: ${peak.toFixed(1)} MB, valley: ${valley.toFixed(1)} MB`,
  )

  expect(growth).toBeLessThan(maxGrowthMB)
}

// =============================================================================
// 1. CUSTOM COMPACTION -- hot path: chat.message + compaction
// =============================================================================
describe("leak: custom-compaction", () => {
  const ITERATIONS = 500
  const SNAPSHOTS = 5
  const MAX_GROWTH_MB = 30

  it("chat.message + compaction cycle doesn't leak", async () => {
    const dir = await createTempDir({
      ".opencode/session-state.yaml": FIXTURE_SESSION_STATE,
      ".opencode/state/todos.json": FIXTURE_TODOS,
      "docs/sprint-artifacts/sprint-1/stories/story-01-03-jwt-refresh.md":
        FIXTURE_STORY_MD,
    })
    const ctx = createMockCtx(dir)
    const hooks = await CustomCompactionPlugin(ctx as any)

    const heaps = await profile(ITERATIONS, SNAPSHOTS, async (i) => {
      await hooks["chat.message"]!(
        { agent: "dev", sessionID: `s-${i}` } as any,
        { message: {}, parts: [] } as any,
      )
      const output = { context: [] as string[], prompt: undefined }
      await hooks["experimental.session.compacting"]!(
        { sessionID: `s-${i}` } as any,
        output as any,
      )
    })

    assertBoundedGrowth(heaps, MAX_GROWTH_MB, "compaction-cycle")
    await cleanupTempDir(dir)
  })

  it("chat.message rapid-fire doesn't accumulate strings", async () => {
    const dir = await createTempDir()
    const ctx = createMockCtx(dir)
    const hooks = await CustomCompactionPlugin(ctx as any)

    const heaps = await profile(2000, SNAPSHOTS, async (i) => {
      await hooks["chat.message"]!(
        { agent: `agent-${i % 50}`, sessionID: `s-${i}` } as any,
        { message: {}, parts: [] } as any,
      )
    })

    assertBoundedGrowth(heaps, MAX_GROWTH_MB, "chat.message-rapid")
    await cleanupTempDir(dir)
  })

  it("event hook doesn't leak on repeated session.idle", async () => {
    const dir = await createTempDir()
    const ctx = createMockCtx(dir)
    const hooks = await CustomCompactionPlugin(ctx as any)

    const heaps = await profile(1000, SNAPSHOTS, async () => {
      await hooks.event!({ event: { type: "session.idle" } as any })
    })

    assertBoundedGrowth(heaps, MAX_GROWTH_MB, "event-idle")
    await cleanupTempDir(dir)
  })

  it("plugin factory doesn't leak across many instances", async () => {
    const heaps = await profile(100, SNAPSHOTS, async (i) => {
      const dir = await createTempDir()
      const ctx = createMockCtx(dir)
      const hooks = await CustomCompactionPlugin(ctx as any)
      await hooks["chat.message"]!(
        { agent: "dev", sessionID: `s-${i}` } as any,
        { message: {}, parts: [] } as any,
      )
      const output = { context: [] as string[], prompt: undefined }
      await hooks["experimental.session.compacting"]!(
        { sessionID: `s-${i}` } as any,
        output as any,
      )
      await cleanupTempDir(dir)
    })

    assertBoundedGrowth(heaps, 50, "compaction-instances")
  })
})

// =============================================================================
// 2. FILE INDEXER -- hot path: event handler (file.edited queueing)
// =============================================================================
describe("leak: file-indexer", () => {
  const ITERATIONS = 1000
  const SNAPSHOTS = 5
  const MAX_GROWTH_MB = 30

  it("file.edited event handler doesn't leak (cycling file names)", async () => {
    const dir = await createTempDir({
      ".opencode/config.yaml": FIXTURE_CONFIG_YAML,
    })
    const ctx = createMockCtx(dir)
    const hooks = await FileIndexerPlugin(ctx as any)

    const heaps = await profile(ITERATIONS, SNAPSHOTS, async (i) => {
      await hooks.event!({
        event: {
          type: "file.edited",
          properties: { file: join(dir, `src/file-${i % 50}.ts`) },
        } as any,
      })
    })

    assertBoundedGrowth(heaps, MAX_GROWTH_MB, "file-edited-events")
    await cleanupTempDir(dir)
  })

  it("disabled plugin doesn't accumulate anything", async () => {
    const dir = await createTempDir({
      ".opencode/config.yaml": `vectorizer:\n  enabled: false\n  auto_index: false\n`,
    })
    const ctx = createMockCtx(dir)
    const hooks = await FileIndexerPlugin(ctx as any)

    const heaps = await profile(2000, SNAPSHOTS, async () => {
      await hooks.event!({
        event: {
          type: "file.edited",
          properties: { file: join(dir, "src/app.ts") },
        } as any,
      })
    })

    assertBoundedGrowth(heaps, 10, "disabled-plugin")
    await cleanupTempDir(dir)
  })
})

// =============================================================================
// 3. VERSION CHECK -- hot path: event handler (no-op)
// =============================================================================
describe("leak: version-check", () => {
  const ITERATIONS = 2000
  const SNAPSHOTS = 5
  const MAX_GROWTH_MB = 10

  it("no-op event handler doesn't leak", async () => {
    const dir = await createTempDir()
    const ctx = createMockCtx(dir)
    const hooks = await VersionCheckPlugin(ctx as any)

    const heaps = await profile(ITERATIONS, SNAPSHOTS, async () => {
      await hooks.event!({ event: { type: "session.idle" } as any })
    })

    assertBoundedGrowth(heaps, MAX_GROWTH_MB, "version-noop")
    await cleanupTempDir(dir)
  })

  it("multiple plugin instances don't leak", async () => {
    const heaps = await profile(100, SNAPSHOTS, async () => {
      const dir = await createTempDir()
      const ctx = createMockCtx(dir)
      const hooks = await VersionCheckPlugin(ctx as any)
      await hooks.event!({ event: { type: "session.idle" } as any })
      await cleanupTempDir(dir)
    })

    assertBoundedGrowth(heaps, 30, "version-instances")
  })
})

// =============================================================================
// 4. COMBINED -- simulate a realistic session with all 3 plugins
// =============================================================================
describe("leak: combined realistic session", () => {
  it("all 3 plugins running together don't leak", async () => {
    const dir = await createTempDir({
      ".opencode/session-state.yaml": FIXTURE_SESSION_STATE,
      ".opencode/state/todos.json": FIXTURE_TODOS,
      ".opencode/config.yaml": FIXTURE_CONFIG_YAML,
      "docs/sprint-artifacts/sprint-1/stories/story-01-03-jwt-refresh.md":
        FIXTURE_STORY_MD,
    })
    const ctx = createMockCtx(dir)

    const [compaction, indexer, versionCheck] = await Promise.all([
      CustomCompactionPlugin(ctx as any),
      FileIndexerPlugin(ctx as any),
      VersionCheckPlugin(ctx as any),
    ])

    const heaps = await profile(300, 5, async (i) => {
      // Simulate realistic session cycle:
      // 1. Agent sends message
      await compaction["chat.message"]!(
        { agent: "dev", sessionID: `s-${i}` } as any,
        { message: {}, parts: [] } as any,
      )

      // 2. File gets edited
      await indexer.event!({
        event: {
          type: "file.edited",
          properties: { file: join(dir, `src/module-${i % 20}.ts`) },
        } as any,
      })

      // 3. Session idle
      await compaction.event!({ event: { type: "session.idle" } as any })
      await versionCheck.event!({ event: { type: "session.idle" } as any })

      // 4. Every 50 iterations, simulate compaction
      if (i % 50 === 0) {
        const output = { context: [] as string[], prompt: undefined }
        await compaction["experimental.session.compacting"]!(
          { sessionID: `s-${i}` } as any,
          output as any,
        )
      }
    })

    assertBoundedGrowth(heaps, 40, "combined-session")
    await cleanupTempDir(dir)
  })
})
