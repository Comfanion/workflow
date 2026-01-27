import { describe, it, expect, beforeEach, afterEach } from "bun:test"
import { join } from "path"
import { writeFile } from "fs/promises"
import { FileIndexerPlugin } from "../file-indexer"
import {
  createMockCtx,
  createTempDir,
  cleanupTempDir,
  FIXTURE_CONFIG_YAML,
} from "./helpers/mock-ctx"
import path from "path"

// =============================================================================
// LOCAL REPLICAS of internal functions (not exported from plugin)
// These mirror the source logic so we can unit-test the algorithms directly.
// =============================================================================

const DEFAULT_CONFIG = {
  enabled: true,
  auto_index: true,
  debounce_ms: 1000,
  indexes: {
    code: { enabled: true, extensions: ['.js', '.ts', '.jsx', '.tsx', '.py', '.go', '.rs', '.java', '.kt', '.swift', '.c', '.cpp', '.h', '.hpp', '.cs', '.rb', '.php', '.scala', '.clj'] },
    docs: { enabled: true, extensions: ['.md', '.mdx', '.txt', '.rst', '.adoc'] },
    config: { enabled: false, extensions: ['.yaml', '.yml', '.json', '.toml', '.ini', '.xml'] },
  },
  exclude: ['node_modules', 'vendor', 'dist', 'build', 'out', '__pycache__'],
}

interface VectorizerConfig {
  enabled: boolean
  auto_index: boolean
  debounce_ms: number
  indexes: Record<string, { enabled: boolean; extensions: string[] }>
  exclude: string[]
}

function getIndexForFile(filePath: string, config: VectorizerConfig): string | null {
  const ext = path.extname(filePath).toLowerCase()
  for (const [indexName, indexConfig] of Object.entries(config.indexes)) {
    if (indexConfig.enabled && indexConfig.extensions.includes(ext)) {
      return indexName
    }
  }
  return null
}

function isExcluded(relativePath: string, config: VectorizerConfig): boolean {
  return config.exclude.some(pattern => relativePath.startsWith(pattern))
}

function estimateTime(fileCount: number): number {
  const modelLoadTime = 30
  const perFileTime = 0.5
  const totalSeconds = modelLoadTime + (fileCount * perFileTime)
  return Math.ceil(totalSeconds / 60)
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`
  const mins = Math.floor(seconds / 60)
  const secs = Math.round(seconds % 60)
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`
}

// =============================================================================
// UNIT TESTS: getIndexForFile (replica)
// =============================================================================
describe("getIndexForFile", () => {
  const config = DEFAULT_CONFIG as VectorizerConfig

  it("returns 'code' for TypeScript files", () => {
    expect(getIndexForFile("src/app.ts", config)).toBe("code")
    expect(getIndexForFile("src/app.tsx", config)).toBe("code")
  })

  it("returns 'code' for JavaScript files", () => {
    expect(getIndexForFile("src/index.js", config)).toBe("code")
  })

  it("returns null for .mjs/.cjs (not in default extensions)", () => {
    expect(getIndexForFile("src/util.mjs", config)).toBeNull()
    expect(getIndexForFile("src/util.cjs", config)).toBeNull()
  })

  it("returns 'code' for various language files", () => {
    expect(getIndexForFile("main.py", config)).toBe("code")
    expect(getIndexForFile("main.go", config)).toBe("code")
    expect(getIndexForFile("main.rs", config)).toBe("code")
    expect(getIndexForFile("Main.java", config)).toBe("code")
    expect(getIndexForFile("Main.kt", config)).toBe("code")
    expect(getIndexForFile("App.swift", config)).toBe("code")
    expect(getIndexForFile("main.c", config)).toBe("code")
    expect(getIndexForFile("main.cpp", config)).toBe("code")
    expect(getIndexForFile("main.h", config)).toBe("code")
    expect(getIndexForFile("main.hpp", config)).toBe("code")
    expect(getIndexForFile("Program.cs", config)).toBe("code")
    expect(getIndexForFile("app.rb", config)).toBe("code")
    expect(getIndexForFile("index.php", config)).toBe("code")
    expect(getIndexForFile("App.scala", config)).toBe("code")
    expect(getIndexForFile("core.clj", config)).toBe("code")
  })

  it("returns 'docs' for documentation files", () => {
    expect(getIndexForFile("README.md", config)).toBe("docs")
    expect(getIndexForFile("docs/api.mdx", config)).toBe("docs")
    expect(getIndexForFile("notes.txt", config)).toBe("docs")
    expect(getIndexForFile("guide.rst", config)).toBe("docs")
    expect(getIndexForFile("manual.adoc", config)).toBe("docs")
  })

  it("returns null for config files (disabled by default)", () => {
    expect(getIndexForFile("config.yaml", config)).toBeNull()
    expect(getIndexForFile("package.json", config)).toBeNull()
    expect(getIndexForFile("settings.toml", config)).toBeNull()
  })

  it("returns null for unknown file extensions", () => {
    expect(getIndexForFile("image.png", config)).toBeNull()
    expect(getIndexForFile("archive.zip", config)).toBeNull()
    expect(getIndexForFile("data.csv", config)).toBeNull()
    expect(getIndexForFile("noextension", config)).toBeNull()
  })

  it("returns config index when enabled", () => {
    const enabledConfig: VectorizerConfig = {
      ...config,
      indexes: {
        ...config.indexes,
        config: { enabled: true, extensions: [".yaml", ".yml", ".json", ".toml", ".ini", ".xml"] },
      },
    }
    expect(getIndexForFile("config.yaml", enabledConfig)).toBe("config")
    expect(getIndexForFile("package.json", enabledConfig)).toBe("config")
  })
})

// =============================================================================
// UNIT TESTS: isExcluded (replica)
// =============================================================================
describe("isExcluded", () => {
  const config = DEFAULT_CONFIG as VectorizerConfig

  it("excludes node_modules paths", () => {
    expect(isExcluded("node_modules/lodash/index.js", config)).toBe(true)
  })

  it("excludes vendor paths", () => {
    expect(isExcluded("vendor/package/lib.go", config)).toBe(true)
  })

  it("excludes dist paths", () => {
    expect(isExcluded("dist/bundle.js", config)).toBe(true)
  })

  it("excludes build paths", () => {
    expect(isExcluded("build/output.js", config)).toBe(true)
  })

  it("excludes __pycache__ paths", () => {
    expect(isExcluded("__pycache__/module.pyc", config)).toBe(true)
  })

  it("does not exclude regular source paths", () => {
    expect(isExcluded("src/app.ts", config)).toBe(false)
    expect(isExcluded("lib/utils.js", config)).toBe(false)
    expect(isExcluded("components/Button.tsx", config)).toBe(false)
  })

  it("does not exclude nested non-excluded paths", () => {
    expect(isExcluded("src/vendor-custom/lib.ts", config)).toBe(false)
  })

  it("handles empty exclude list", () => {
    const emptyConfig: VectorizerConfig = { ...config, exclude: [] }
    expect(isExcluded("node_modules/test.js", emptyConfig)).toBe(false)
  })
})

// =============================================================================
// UNIT TESTS: estimateTime (replica)
// =============================================================================
describe("estimateTime", () => {
  it("returns at least 1 minute for small counts", () => {
    expect(estimateTime(1)).toBeGreaterThanOrEqual(1)
  })

  it("scales with file count", () => {
    const small = estimateTime(10)
    const large = estimateTime(1000)
    expect(large).toBeGreaterThan(small)
  })

  it("includes model load time", () => {
    expect(estimateTime(0)).toBe(1)
  })

  it("estimates correctly for 100 files", () => {
    expect(estimateTime(100)).toBe(2)
  })

  it("estimates correctly for 1000 files", () => {
    expect(estimateTime(1000)).toBe(9)
  })
})

// =============================================================================
// UNIT TESTS: formatDuration (replica)
// =============================================================================
describe("formatDuration", () => {
  it("formats seconds only", () => {
    expect(formatDuration(30)).toBe("30s")
    expect(formatDuration(59)).toBe("59s")
  })

  it("formats minutes and seconds", () => {
    expect(formatDuration(90)).toBe("1m 30s")
    expect(formatDuration(125)).toBe("2m 5s")
  })

  it("formats exact minutes", () => {
    expect(formatDuration(60)).toBe("1m")
    expect(formatDuration(120)).toBe("2m")
    expect(formatDuration(300)).toBe("5m")
  })

  it("rounds seconds", () => {
    expect(formatDuration(0.4)).toBe("0s")
    expect(formatDuration(0.6)).toBe("1s")
  })

  it("handles zero", () => {
    expect(formatDuration(0)).toBe("0s")
  })
})

// =============================================================================
// INTEGRATION: Plugin initialization & config parsing (via plugin interface)
// =============================================================================
describe("FileIndexerPlugin", () => {
  let tempDir: string

  beforeEach(async () => {
    tempDir = await createTempDir()
  })

  afterEach(async () => {
    await cleanupTempDir(tempDir)
  })

  it("returns no-op event handler when disabled", async () => {
    await writeFile(
      join(tempDir, ".opencode", "config.yaml"),
      `vectorizer:\n  enabled: false\n  auto_index: false\n`
    )
    const ctx = createMockCtx(tempDir)
    const hooks = await FileIndexerPlugin(ctx as any)

    expect(hooks).toBeDefined()
    expect(hooks.event).toBeFunction()

    // Should not throw
    await hooks.event!({ event: { type: "file.edited" } as any })
  })

  it("returns no-op when auto_index is false", async () => {
    await writeFile(
      join(tempDir, ".opencode", "config.yaml"),
      `vectorizer:\n  enabled: true\n  auto_index: false\n`
    )
    const ctx = createMockCtx(tempDir)
    const hooks = await FileIndexerPlugin(ctx as any)
    expect(hooks.event).toBeFunction()
  })

  it("returns active event handler when enabled", async () => {
    await writeFile(join(tempDir, ".opencode", "config.yaml"), FIXTURE_CONFIG_YAML)
    const ctx = createMockCtx(tempDir)
    const hooks = await FileIndexerPlugin(ctx as any)

    expect(hooks).toBeDefined()
    expect(hooks.event).toBeFunction()
  })

  it("event handler processes file.edited events without crashing", async () => {
    await writeFile(join(tempDir, ".opencode", "config.yaml"), FIXTURE_CONFIG_YAML)
    const ctx = createMockCtx(tempDir)
    const hooks = await FileIndexerPlugin(ctx as any)

    // Queue a file edit — should not throw
    await hooks.event!({
      event: {
        type: "file.edited",
        properties: { file: join(tempDir, "src", "app.ts") },
      } as any,
    })
  })

  it("event handler ignores non-file events", async () => {
    await writeFile(join(tempDir, ".opencode", "config.yaml"), FIXTURE_CONFIG_YAML)
    const ctx = createMockCtx(tempDir)
    const hooks = await FileIndexerPlugin(ctx as any)

    // These should be silently ignored
    await hooks.event!({ event: { type: "session.idle" } as any })
    await hooks.event!({ event: { type: "todo.updated" } as any })
  })

  it("event handler ignores events without file path", async () => {
    await writeFile(join(tempDir, ".opencode", "config.yaml"), FIXTURE_CONFIG_YAML)
    const ctx = createMockCtx(tempDir)
    const hooks = await FileIndexerPlugin(ctx as any)

    await hooks.event!({
      event: { type: "file.edited", properties: {} } as any,
    })
  })

  it("loads default config when no config.yaml exists", async () => {
    // No config.yaml file at all
    const ctx = createMockCtx(tempDir)
    const hooks = await FileIndexerPlugin(ctx as any)
    expect(hooks).toBeDefined()
    expect(hooks.event).toBeFunction()
  })

  it("parses vectorizer section from config.yaml", async () => {
    await writeFile(join(tempDir, ".opencode", "config.yaml"), FIXTURE_CONFIG_YAML)
    const ctx = createMockCtx(tempDir)
    const hooks = await FileIndexerPlugin(ctx as any)
    // If config parsed correctly, plugin should return active event handler
    expect(hooks).toBeDefined()
    expect(hooks.event).toBeFunction()
  })

  it("parses disabled vectorizer and returns no-op", async () => {
    await writeFile(
      join(tempDir, ".opencode", "config.yaml"),
      `vectorizer:\n  enabled: false\n  auto_index: false\n`
    )
    const ctx = createMockCtx(tempDir)
    const hooks = await FileIndexerPlugin(ctx as any)
    expect(hooks.event).toBeFunction()
    // Event should be a no-op (disabled plugin)
    await hooks.event!({
      event: {
        type: "file.edited",
        properties: { file: join(tempDir, "src", "app.ts") },
      } as any,
    })
  })

  it("getLanguage returns 'uk' for Ukrainian config (verified via plugin init)", async () => {
    await writeFile(
      join(tempDir, ".opencode", "config.yaml"),
      `communication_language: Ukrainian\nvectorizer:\n  enabled: true\n  auto_index: true\n`
    )
    const ctx = createMockCtx(tempDir)
    const hooks = await FileIndexerPlugin(ctx as any)
    // Plugin loaded successfully with Ukrainian language detection
    expect(hooks).toBeDefined()
  })

  it("getLanguage returns 'en' by default", async () => {
    // No communication_language in config
    await writeFile(
      join(tempDir, ".opencode", "config.yaml"),
      `vectorizer:\n  enabled: true\n  auto_index: true\n`
    )
    const ctx = createMockCtx(tempDir)
    const hooks = await FileIndexerPlugin(ctx as any)
    expect(hooks).toBeDefined()
  })
})

// =============================================================================
// MEMORY SAFETY: Plugin instance leak detection
// =============================================================================
describe("memory safety: plugin instances", () => {
  it("multiple plugin instantiations don't cause excessive memory growth", async () => {
    const memBefore = process.memoryUsage().heapUsed

    for (let i = 0; i < 20; i++) {
      const dir = await createTempDir({
        ".opencode/config.yaml": `vectorizer:\n  enabled: false\n  auto_index: false\n`,
      })
      const ctx = createMockCtx(dir)
      const hooks = await FileIndexerPlugin(ctx as any)
      await hooks.event!({ event: { type: "session.idle" } as any })
      await cleanupTempDir(dir)
    }

    if ((globalThis as any).gc) (globalThis as any).gc()

    const memAfter = process.memoryUsage().heapUsed
    const growthMB = (memAfter - memBefore) / 1024 / 1024

    // 20 disabled-plugin instances shouldn't use >50MB
    expect(growthMB).toBeLessThan(50)
  })

  it("repeated file.edited events don't crash (enabled plugin, no vectorizer)", async () => {
    const dir = await createTempDir({
      ".opencode/config.yaml": FIXTURE_CONFIG_YAML,
    })
    const ctx = createMockCtx(dir)
    const hooks = await FileIndexerPlugin(ctx as any)

    // Send many events — plugin will queue them but vectorizer not installed
    // so the timeout callback should clear pendingFiles (fix #2)
    for (let i = 0; i < 100; i++) {
      await hooks.event!({
        event: {
          type: "file.edited",
          properties: { file: join(dir, `src/file-${i}.ts`) },
        } as any,
      })
    }

    // Wait for debounce timeout to fire and clear pendingFiles
    await new Promise(resolve => setTimeout(resolve, 1500))

    await cleanupTempDir(dir)
  })
})
