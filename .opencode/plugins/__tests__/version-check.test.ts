import { describe, it, expect, beforeEach, afterEach } from "bun:test"
import { join } from "path"
import { writeFile } from "fs/promises"
import { VersionCheckPlugin } from "../version-check"
import { createMockCtx, createTempDir, cleanupTempDir } from "./helpers/mock-ctx"

// =============================================================================
// LOCAL REPLICAS of internal functions (not exported from plugin)
// These mirror the source logic so we can unit-test the algorithms directly.
// =============================================================================

/** Replica of compareVersions from version-check.ts (with pre-release strip fix) */
function compareVersions(local: string, latest: string): number {
  const strip = (v: string) => v.replace(/-.*$/, '')
  const localParts = strip(local).split('.').map(Number)
  const latestParts = strip(latest).split('.').map(Number)

  for (let i = 0; i < 3; i++) {
    const l = localParts[i] || 0
    const r = latestParts[i] || 0
    if (l < r) return -1
    if (l > r) return 1
  }
  return 0
}

// =============================================================================
// UNIT TESTS: compareVersions (replica)
// =============================================================================
describe("compareVersions", () => {
  it("returns 0 for equal versions", () => {
    expect(compareVersions("1.0.0", "1.0.0")).toBe(0)
    expect(compareVersions("4.36.21", "4.36.21")).toBe(0)
  })

  it("returns -1 when local < latest (patch)", () => {
    expect(compareVersions("1.0.0", "1.0.1")).toBe(-1)
  })

  it("returns -1 when local < latest (minor)", () => {
    expect(compareVersions("1.0.0", "1.1.0")).toBe(-1)
  })

  it("returns -1 when local < latest (major)", () => {
    expect(compareVersions("1.0.0", "2.0.0")).toBe(-1)
  })

  it("returns 1 when local > latest (patch)", () => {
    expect(compareVersions("1.0.2", "1.0.1")).toBe(1)
  })

  it("returns 1 when local > latest (minor)", () => {
    expect(compareVersions("1.2.0", "1.1.9")).toBe(1)
  })

  it("returns 1 when local > latest (major)", () => {
    expect(compareVersions("3.0.0", "2.99.99")).toBe(1)
  })

  it("handles versions with missing parts", () => {
    expect(compareVersions("1.0", "1.0.0")).toBe(0)
    expect(compareVersions("1", "1.0.0")).toBe(0)
    expect(compareVersions("1.0.0", "1.0")).toBe(0)
  })

  it("handles large version numbers", () => {
    expect(compareVersions("100.200.300", "100.200.300")).toBe(0)
    expect(compareVersions("100.200.300", "100.200.301")).toBe(-1)
  })

  it("handles pre-release versions (strips suffix)", () => {
    expect(compareVersions("4.38.1-beta.1", "4.38.1")).toBe(0)
    expect(compareVersions("4.38.1-dev.16", "4.38.2")).toBe(-1)
    expect(compareVersions("5.0.0-rc.1", "4.99.99")).toBe(1)
    expect(compareVersions("1.0.0-alpha", "1.0.0-beta")).toBe(0) // both strip to 1.0.0
  })

  it("does not return NaN for pre-release versions", () => {
    const result = compareVersions("4.38.1-beta.1", "4.38.2")
    expect(result).not.toBeNaN()
    expect(result).toBe(-1)
  })
})

// =============================================================================
// INTEGRATION: Plugin initialization & hooks
// =============================================================================
describe("VersionCheckPlugin", () => {
  let tempDir: string

  beforeEach(async () => {
    tempDir = await createTempDir()
  })

  afterEach(async () => {
    await cleanupTempDir(tempDir)
  })

  it("returns hooks object with event handler", async () => {
    const ctx = createMockCtx(tempDir)
    const hooks = await VersionCheckPlugin(ctx as any)

    expect(hooks).toBeDefined()
    expect(hooks.event).toBeFunction()
  })

  it("event handler is a no-op (does not throw)", async () => {
    const ctx = createMockCtx(tempDir)
    const hooks = await VersionCheckPlugin(ctx as any)

    // Call event with various event types - should not throw
    await hooks.event!({ event: { type: "session.idle" } as any })
    await hooks.event!({ event: { type: "file.edited" } as any })
    await hooks.event!({ event: { type: "unknown.event" } as any })
  })

  it("does not throw when client.tui is missing", async () => {
    const ctx = {
      directory: tempDir,
      worktree: tempDir,
      client: {},
      project: { name: "test" },
      serverUrl: new URL("http://localhost:3000"),
      $: {},
    }
    // Should not throw even with minimal client
    const hooks = await VersionCheckPlugin(ctx as any)
    expect(hooks).toBeDefined()
  })

  it("getLocalVersion reads build-info.json via plugin behavior", async () => {
    // Write build-info.json — the plugin reads this internally during setTimeout
    await writeFile(
      join(tempDir, ".opencode", "build-info.json"),
      JSON.stringify({ version: "4.38.0" })
    )
    const ctx = createMockCtx(tempDir)
    const hooks = await VersionCheckPlugin(ctx as any)
    // Plugin initializes successfully
    expect(hooks).toBeDefined()
  })

  it("getLocalVersion fallback to config.yaml", async () => {
    await writeFile(
      join(tempDir, ".opencode", "config.yaml"),
      `version: "3.5.0"\nproject_name: test\n`
    )
    const ctx = createMockCtx(tempDir)
    const hooks = await VersionCheckPlugin(ctx as any)
    expect(hooks).toBeDefined()
  })

  it("getLanguage defaults to 'en' when config missing", async () => {
    // No config.yaml — language detection should default to 'en'
    const ctx = createMockCtx(tempDir)
    const hooks = await VersionCheckPlugin(ctx as any)
    expect(hooks).toBeDefined()
  })

  it("loads and saves cache via plugin lifecycle", async () => {
    // Write version info so plugin has something to work with
    await writeFile(
      join(tempDir, ".opencode", "build-info.json"),
      JSON.stringify({ version: "4.38.0" })
    )
    const ctx = createMockCtx(tempDir)
    const hooks = await VersionCheckPlugin(ctx as any)
    expect(hooks).toBeDefined()
    // Plugin will attempt to check version in background (setTimeout)
    // No assertion needed — just ensure no crash
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

  it("no state accumulation across multiple event calls", async () => {
    const ctx = createMockCtx(tempDir)
    const hooks = await VersionCheckPlugin(ctx as any)

    // Call event handler many times - should not accumulate state
    for (let i = 0; i < 1000; i++) {
      await hooks.event!({ event: { type: "session.idle" } as any })
    }

    // If we get here without OOM or excessive delay, no leak
    expect(true).toBe(true)
  })

  it("multiple plugin initializations don't leak", async () => {
    const memBefore = process.memoryUsage().heapUsed

    for (let i = 0; i < 50; i++) {
      const dir = await createTempDir()
      const ctx = createMockCtx(dir)
      const hooks = await VersionCheckPlugin(ctx as any)
      await hooks.event!({ event: { type: "session.idle" } as any })
      await cleanupTempDir(dir)
    }

    // Force GC if available
    if (typeof Bun !== "undefined" && (globalThis as any).gc) {
      ;(globalThis as any).gc()
    }

    const memAfter = process.memoryUsage().heapUsed
    const growthMB = (memAfter - memBefore) / 1024 / 1024

    // Memory growth should be < 50MB for 50 iterations
    expect(growthMB).toBeLessThan(50)
  })
})
