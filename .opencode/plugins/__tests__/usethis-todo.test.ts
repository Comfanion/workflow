import { describe, it, expect, beforeEach, afterEach } from "bun:test"
import { readFile } from "fs/promises"
import { join } from "path"
import { createTempDir, cleanupTempDir } from "./helpers/mock-ctx"
import { write, update, read } from "../../tools/usethis_todo"

describe("usethis_todo tool", () => {
  let tempDir: string
  let originalXdg: string | undefined

  beforeEach(async () => {
    tempDir = await createTempDir()
    originalXdg = process.env.XDG_DATA_HOME
    process.env.XDG_DATA_HOME = join(tempDir, "xdg-data")
  })

  afterEach(async () => {
    if (originalXdg === undefined) {
      delete process.env.XDG_DATA_HOME
    } else {
      process.env.XDG_DATA_HOME = originalXdg
    }
    await cleanupTempDir(tempDir)
  })

  it("writes enhanced and native todo files", async () => {
    const ctx = { sessionID: "sess-test", directory: tempDir } as any
    const output = await write.execute(
      {
        todos: [
          { id: "A1", content: "First task", status: "ready", priority: "HIGH" },
          { id: "A2", content: "Second task", status: "pending", priority: "LOW" },
        ],
      },
      ctx
    )

    expect(output).toContain("TODO Graph")

    const enhancedPath = join(tempDir, ".opencode", "session-todos", "sess-test.json")
    const enhanced = JSON.parse(await readFile(enhancedPath, "utf-8"))
    expect(enhanced.length).toBe(2)
    expect(enhanced[0].content).toBe("First task")

    const nativePath = join(
      process.env.XDG_DATA_HOME!,
      "opencode",
      "storage",
      "todo",
      "sess-test.json"
    )
    const native = JSON.parse(await readFile(nativePath, "utf-8"))
    expect(native.length).toBe(2)
    expect(native[0].content).toContain("First task")
  })

  it("update merges by id and can add new tasks", async () => {
    const ctx = { sessionID: "sess-merge", directory: tempDir } as any

    await write.execute(
      {
        todos: [
          { id: "A1", content: "First task", status: "pending", priority: "MED" },
        ],
      },
      ctx
    )

    const result = await update.execute(
      {
        todos: [
          { id: "A1", content: "First task", status: "done", priority: "MED" },
          { id: "A2", content: "Second task", status: "ready", priority: "LOW" },
        ],
      },
      ctx
    )

    expect(result).toContain("Updated 2 task(s)")

    const enhancedPath = join(tempDir, ".opencode", "session-todos", "sess-merge.json")
    const enhanced = JSON.parse(await readFile(enhancedPath, "utf-8"))
    expect(enhanced.length).toBe(2)
    expect(enhanced.find((t: any) => t.id === "A1")?.status).toBe("done")
  })

  it("read returns graph with content", async () => {
    const ctx = { sessionID: "sess-read", directory: tempDir } as any
    await write.execute(
      {
        todos: [
          { id: "A1", content: "Task content", status: "ready", priority: "HIGH" },
        ],
      },
      ctx
    )

    const output = await read.execute({}, ctx)
    expect(output).toContain("Task content")
    expect(output).toContain("Available Now")
  })
})
