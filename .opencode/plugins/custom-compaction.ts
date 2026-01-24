import type { Plugin } from "@opencode-ai/plugin"
import { readFile, access } from "fs/promises"
import { join } from "path"

interface TaskStatus {
  id: string
  content: string
  status: "pending" | "in_progress" | "completed" | "cancelled"
  priority: string
}

interface StoryContext {
  path: string
  title: string
  status: string
  currentTask: string | null
  completedTasks: string[]
  pendingTasks: string[]
}

interface SessionContext {
  todos: TaskStatus[]
  story: StoryContext | null
  relevantFiles: string[]
  activeAgent: string | null
}

/**
 * Custom Compaction Plugin
 * 
 * Intelligent context preservation during session compaction:
 * - Tracks task/story completion status
 * - Preserves relevant documentation files
 * - Generates continuation prompts for seamless resumption
 */
export const CustomCompactionPlugin: Plugin = async (ctx) => {
  const { directory } = ctx

  async function getTodoList(): Promise<TaskStatus[]> {
    try {
      const todoPath = join(directory, ".opencode", "state", "todos.json")
      const content = await readFile(todoPath, "utf-8")
      return JSON.parse(content)
    } catch {
      return []
    }
  }

  async function getActiveStory(): Promise<StoryContext | null> {
    try {
      const sprintStatusPath = join(directory, "docs", "sprint-artifacts", "sprint-status.yaml")
      const content = await readFile(sprintStatusPath, "utf-8")
      
      const inProgressMatch = content.match(/status:\s*in-progress[\s\S]*?path:\s*["']?([^"'\n]+)["']?/i)
      if (!inProgressMatch) return null

      const storyPath = inProgressMatch[1]
      const storyContent = await readFile(join(directory, storyPath), "utf-8")
      
      const titleMatch = storyContent.match(/^#\s+(.+)/m)
      const statusMatch = storyContent.match(/\*\*Status:\*\*\s*(\w+)/i)
      
      const completedTasks: string[] = []
      const pendingTasks: string[] = []
      let currentTask: string | null = null
      
      const taskRegex = /- \[([ x])\]\s+\*\*T(\d+)\*\*[:\s]+(.+)/g
      let match
      while ((match = taskRegex.exec(storyContent)) !== null) {
        const [, checked, taskId, taskName] = match
        if (checked === "x") {
          completedTasks.push(`T${taskId}: ${taskName}`)
        } else {
          if (!currentTask) currentTask = `T${taskId}: ${taskName}`
          pendingTasks.push(`T${taskId}: ${taskName}`)
        }
      }

      return {
        path: storyPath,
        title: titleMatch?.[1] || "Unknown Story",
        status: statusMatch?.[1] || "unknown",
        currentTask,
        completedTasks,
        pendingTasks
      }
    } catch {
      return null
    }
  }

  async function getRelevantFiles(): Promise<string[]> {
    const relevantPaths: string[] = []
    
    const criticalFiles = [
      "CLAUDE.md",
      "AGENTS.md", 
      "project-context.md",
      ".opencode/config.yaml",
      "docs/prd.md",
      "docs/architecture.md",
      "docs/coding-standards/README.md",
      "docs/coding-standards/patterns.md"
    ]

    for (const filePath of criticalFiles) {
      try {
        await access(join(directory, filePath))
        relevantPaths.push(filePath)
      } catch {
        // File doesn't exist, skip
      }
    }

    const story = await getActiveStory()
    if (story) {
      relevantPaths.push(story.path)
    }

    return relevantPaths
  }

  async function buildContext(): Promise<SessionContext> {
    const [todos, story, relevantFiles] = await Promise.all([
      getTodoList(),
      getActiveStory(),
      getRelevantFiles()
    ])

    return { todos, story, relevantFiles, activeAgent: null }
  }

  function formatContext(ctx: SessionContext): string {
    const sections: string[] = []

    if (ctx.todos.length > 0) {
      const inProgress = ctx.todos.filter(t => t.status === "in_progress")
      const completed = ctx.todos.filter(t => t.status === "completed")
      const pending = ctx.todos.filter(t => t.status === "pending")

      sections.push(`## Task Status

**In Progress:** ${inProgress.length > 0 ? inProgress.map(t => t.content).join(", ") : "None"}
**Completed:** ${completed.length > 0 ? completed.map(t => `✅ ${t.content}`).join("\n") : "None"}
**Pending:** ${pending.length > 0 ? pending.map(t => `⬜ ${t.content}`).join("\n") : "None"}`)
    }

    if (ctx.story) {
      const s = ctx.story
      const total = s.completedTasks.length + s.pendingTasks.length
      const progress = total > 0 ? (s.completedTasks.length / total * 100).toFixed(0) : 0

      sections.push(`## Active Story

**Story:** ${s.title}
**Path:** ${s.path}
**Status:** ${s.status}
**Progress:** ${progress}% (${s.completedTasks.length}/${total} tasks)

### Current Task
${s.currentTask || "All tasks complete"}

### Completed
${s.completedTasks.length > 0 ? s.completedTasks.map(t => `✅ ${t}`).join("\n") : "None"}

### Remaining
${s.pendingTasks.length > 0 ? s.pendingTasks.map(t => `⬜ ${t}`).join("\n") : "All done!"}`)
    }

    if (ctx.relevantFiles.length > 0) {
      sections.push(`## Critical Files (MUST re-read)

${ctx.relevantFiles.map(f => `- \`${f}\``).join("\n")}`)
    }

    return sections.join("\n\n---\n\n")
  }

  function formatInstructions(ctx: SessionContext): string {
    const hasInProgressTasks = ctx.todos.some(t => t.status === "in_progress")
    const hasInProgressStory = ctx.story?.status === "in-progress"

    if (!hasInProgressTasks && !hasInProgressStory) {
      return `## Status: COMPLETED

Previous task was completed successfully.

**Next:**
1. Review completed work
2. Run validation/tests if applicable
3. Ask user for next task`
    }

    const instructions = [`## Status: INTERRUPTED

Session compacted while work in progress.

**Resume:**`]

    if (ctx.story?.currentTask) {
      instructions.push(`
1. Read story: \`${ctx.story.path}\`
2. Current task: ${ctx.story.currentTask}
3. Load skill: \`.opencode/skills/dev-story/SKILL.md\`
4. Continue red-green-refactor
5. Run tests first`)
    }

    if (hasInProgressTasks) {
      const task = ctx.todos.find(t => t.status === "in_progress")
      instructions.push(`
1. Resume: ${task?.content}
2. Check previous messages
3. Continue from last action
4. Update todo when complete`)
    }

    return instructions.join("\n")
  }

  return {
    "experimental.session.compacting": async (input, output) => {
      const ctx = await buildContext()
      const context = formatContext(ctx)
      const instructions = formatInstructions(ctx)

      output.context.push(`# Session Continuation

${context}

---

${instructions}

---

## On Resume

1. **Read critical files** listed above
2. **Check task/story status**
3. **Continue from last point** - never start over
4. **Run tests first** if implementing code`)
    },

    event: async ({ event }) => {
      if (event.type === "session.idle") {
        const story = await getActiveStory()
        if (story && story.pendingTasks.length === 0) {
          console.log(`[compaction] Story complete: ${story.title}`)
        }
      }
    }
  }
}

export default CustomCompactionPlugin
