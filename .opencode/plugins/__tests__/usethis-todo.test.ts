import { describe, it, expect, beforeEach, afterEach } from "bun:test"
import { readFile } from "fs/promises"
import { join } from "path"
import { createTempDir, cleanupTempDir } from "./helpers/mock-ctx"
import { write, update, read, read_by_id, read_five } from "../../tools/usethis_todo"

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
          { id: "A1", content: "First task", description: "Longer details", status: "todo", priority: "HIGH" },
          { id: "A2", content: "Second task", status: "todo", priority: "LOW" },
        ],
      },
      ctx
    )

    expect(output).toContain("TODO Graph")

    const enhancedPath = join(tempDir, ".opencode", "session-todos", "sess-test.json")
    const enhanced = JSON.parse(await readFile(enhancedPath, "utf-8"))
    expect(enhanced.length).toBe(2)
    expect(enhanced[0].content).toBe("First task")
    expect(enhanced[0].description).toBe("Longer details")

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
    expect(native[0].content).toContain("Longer details")
  })

  it("update merges by id and can add new tasks", async () => {
    const ctx = { sessionID: "sess-merge", directory: tempDir } as any

    await write.execute(
      {
        todos: [
          { id: "A1", content: "First task", description: "v1", status: "todo", priority: "MED" },
        ],
      },
      ctx
    )

    const result = await update.execute(
      {
        todos: [
          { id: "A1", content: "First task", description: "v2", status: "done", priority: "MED" },
          { id: "A2", content: "Second task", status: "todo", priority: "LOW" },
        ],
      },
      ctx
    )

    expect(result).toContain("Updated 2 task(s)")

    const enhancedPath = join(tempDir, ".opencode", "session-todos", "sess-merge.json")
    const enhanced = JSON.parse(await readFile(enhancedPath, "utf-8"))
    expect(enhanced.length).toBe(2)
    expect(enhanced.find((t: any) => t.id === "A1")?.status).toBe("done")
    expect(enhanced.find((t: any) => t.id === "A1")?.description).toBe("v2")
  })

  it("auto-promotes ready -> done when releases exist", async () => {
    const ctx = { sessionID: "sess-rel", directory: tempDir } as any

    await write.execute(
      {
        todos: [
          {
            id: "A1",
            content: "Ship it",
            status: "ready",
            priority: "HIGH",
            releases: ["4.38.4"],
          },
        ],
      },
      ctx
    )

    const enhancedPath = join(tempDir, ".opencode", "session-todos", "sess-rel.json")
    const enhanced = JSON.parse(await readFile(enhancedPath, "utf-8"))
    expect(enhanced.find((t: any) => t.id === "A1")?.status).toBe("done")
  })

  it("read returns graph with content", async () => {
    const ctx = { sessionID: "sess-read", directory: tempDir } as any
    await write.execute(
      {
        todos: [
          { id: "A1", content: "Task content", status: "todo", priority: "HIGH" },
        ],
      },
      ctx
    )

    const output = await read.execute({}, ctx)
    expect(output).toContain("Task content")
    expect(output).toContain("Available Now")
  })

  it("read_five returns up to 5 available tasks with description", async () => {
    const ctx = { sessionID: "sess-five", directory: tempDir } as any
    await write.execute(
      {
        todos: [
          { id: "A1", content: "T1", description: "D1", status: "todo", priority: "HIGH", blockedBy: ["B1"] },
          { id: "A2", content: "T2", status: "todo", priority: "MED" },
          { id: "A3", content: "T3", status: "todo", priority: "LOW" },
          { id: "A4", content: "T4", status: "todo", priority: "LOW" },
          { id: "A5", content: "T5", status: "todo", priority: "LOW" },
          { id: "A6", content: "T6", status: "todo", priority: "LOW" },
          { id: "B1", content: "B", status: "in_progress", priority: "LOW", blockedBy: ["C1"] },
          { id: "C1", content: "C", status: "in_progress", priority: "MED" },
        ],
      },
      ctx
    )

    const out = await read_five.execute({}, ctx)
    expect(out).toContain("Next 5")
    expect(out).toContain("A1")
    expect(out).toContain("T1")
    expect(out).toContain("D1")
    expect(out).toContain("+1 more")
    expect(out).toContain("Blocked By (resolved)")
    expect(out).toContain("B1")
    expect(out).toContain("C1")
  })

  it("read_by_id returns task with resolved blockers", async () => {
    const ctx = { sessionID: "sess-get", directory: tempDir } as any
    await write.execute(
      {
        todos: [
          {
            id: "A1",
            content: "Task content",
            description: "More details",
            status: "todo",
            priority: "HIGH",
            blockedBy: ["B1"],
          },
          {
            id: "B1",
            content: "Blocker task",
            status: "done",
            priority: "LOW",
            blockedBy: ["C1"],
          },
          {
            id: "C1",
            content: "Root blocker",
            status: "todo",
            priority: "MED",
          },
        ],
      },
      ctx
    )

    const out = await read_by_id.execute({ id: "A1" }, ctx)
    expect(out).toContain("Task:")
    expect(out).toContain("A1")
    expect(out).toContain("Task content")
    expect(out).toContain("More details")

    expect(out).toContain("Blocked By (resolved):")
    expect(out).toContain("B1")
    expect(out).toContain("C1")
  })

  it("read_by_id returns not found", async () => {
    const ctx = { sessionID: "sess-miss", directory: tempDir } as any
    const out = await read_by_id.execute({ id: "NOPE" }, ctx)
    expect(out).toContain("not found")
  })
})
