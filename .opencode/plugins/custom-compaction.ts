import type { Plugin } from "@opencode-ai/plugin"
import { readFile, access, readdir } from "fs/promises"
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
  acceptanceCriteria: string[]
  fullContent: string
}

interface SessionContext {
  todos: TaskStatus[]
  story: StoryContext | null
  relevantFiles: string[]
  activeAgent: string | null
}

// Base files ALL agents need after compaction (to remember who they are)
const BASE_FILES = [
  "CLAUDE.md",      // Project rules, coding standards
  "AGENTS.md",      // Agent personas and how they work
]

// Agent-specific file priorities (added to BASE_FILES)
const AGENT_FILES: Record<string, string[]> = {
  dev: [
    ...BASE_FILES,
    "docs/coding-standards/README.md",
    "docs/coding-standards/patterns.md",
    "docs/coding-standards/testing.md",
    "docs/prd.md",
    "docs/architecture.md",
    // story path added dynamically
  ],
  coder: [
    ...BASE_FILES,
    "docs/coding-standards/patterns.md",
    "docs/coding-standards/testing.md",
  ],
  architect: [
    ...BASE_FILES,
    "docs/architecture.md",
    "docs/prd.md",
    "docs/coding-standards/README.md",
    "docs/architecture/adr",  // directory
  ],
  pm: [
    ...BASE_FILES,
    "docs/prd.md",
    "docs/architecture.md",
    "docs/sprint-artifacts/sprint-status.yaml",
    "docs/sprint-artifacts/backlog",  // directory
  ],
  analyst: [
    ...BASE_FILES,
    "docs/requirements/requirements.md",
    "docs/prd.md",
  ],
  researcher: [
    ...BASE_FILES,
    "docs/prd.md",
    "docs/research",  // directory
  ],
  crawler: [
    ...BASE_FILES,
  ],
  "change-manager": [
    ...BASE_FILES,
    "docs/prd.md",
    "docs/architecture.md",
  ],
}

// Default files for unknown agents
const DEFAULT_FILES = [
  ...BASE_FILES,
  "docs/prd.md",
  "docs/architecture.md",
]

// Files agent MUST Read after compaction (commands generated)
const MUST_READ_FILES: Record<string, string[]> = {
  dev: [
    "AGENTS.md",
    "CLAUDE.md",
    "docs/prd.md",
    "docs/architecture.md",
    // story path added dynamically
  ],
  coder: [
    "AGENTS.md",
    "CLAUDE.md",
    "docs/prd.md",
    "docs/architecture.md",
  ],
  architect: [
    "AGENTS.md",
    "CLAUDE.md",
    "docs/prd.md",
    "docs/architecture.md",
  ],
  pm: [
    "AGENTS.md",
    "CLAUDE.md",
    "docs/prd.md",
    "docs/architecture.md",
  ],
  analyst: [
    "AGENTS.md",
    "CLAUDE.md",
    "docs/prd.md",
  ],
  researcher: [
    "AGENTS.md",
    "CLAUDE.md",
  ],
  default: [
    "AGENTS.md",
    "CLAUDE.md",
    "docs/prd.md",
    "docs/architecture.md",
  ],
}

/**
 * Custom Compaction Plugin
 * 
 * Agent-aware context preservation during session compaction:
 * - Tracks active agent via chat.message hook
 * - Generates MANDATORY Read commands for critical files
 * - Preserves agent-specific documentation files
 * - Provides detailed story/task info for dev agent
 * - Generates targeted continuation prompts
 */
export const CustomCompactionPlugin: Plugin = async (ctx) => {
  const { directory } = ctx
  
  // Track the last active agent
  let lastActiveAgent: string | null = null
  let lastSessionId: string | null = null

  /**
   * Generate Read commands that agent MUST execute after compaction
   */
  function generateReadCommands(agent: string | null, story: StoryContext | null): string {
    const agentKey = agent?.toLowerCase() || "default"
    const filesToRead = [...(MUST_READ_FILES[agentKey] || MUST_READ_FILES.default)]
    
    // For dev/coder: add story file if active
    if ((agentKey === "dev" || agentKey === "coder") && story) {
      filesToRead.unshift(story.path)  // Story first!
    }
    
    const commands = filesToRead.map((f, i) => `${i + 1}. Read("${f}")`).join("\n")
    
    return `## ⚠️ MANDATORY: Execute these Read commands FIRST

Before doing ANYTHING else, you MUST read these files to restore context:

${commands}

DO NOT skip this step. DO NOT ask user what to do. Just read these files first.`
  }

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
      
      // Parse tasks with more detail
      const taskRegex = /- \[([ x])\]\s+\*\*T(\d+)\*\*[:\s]+(.+?)(?=\n|$)/g
      let match
      while ((match = taskRegex.exec(storyContent)) !== null) {
        const [, checked, taskId, taskName] = match
        const taskInfo = `T${taskId}: ${taskName.trim()}`
        if (checked === "x") {
          completedTasks.push(taskInfo)
        } else {
          if (!currentTask) currentTask = taskInfo
          pendingTasks.push(taskInfo)
        }
      }
      
      // Parse acceptance criteria
      const acceptanceCriteria: string[] = []
      const acSection = storyContent.match(/## Acceptance Criteria[\s\S]*?(?=##|$)/i)
      if (acSection) {
        const acRegex = /- \[([ x])\]\s+(.+?)(?=\n|$)/g
        while ((match = acRegex.exec(acSection[0])) !== null) {
          const [, checked, criteria] = match
          acceptanceCriteria.push(`${checked === "x" ? "✅" : "⬜"} ${criteria.trim()}`)
        }
      }

      return {
        path: storyPath,
        title: titleMatch?.[1] || "Unknown Story",
        status: statusMatch?.[1] || "unknown",
        currentTask,
        completedTasks,
        pendingTasks,
        acceptanceCriteria,
        fullContent: storyContent
      }
    } catch {
      return null
    }
  }

  async function getRelevantFiles(agent: string | null, story: StoryContext | null): Promise<string[]> {
    const relevantPaths: string[] = []
    const agentKey = agent?.toLowerCase() || "default"
    const filesToCheck = AGENT_FILES[agentKey] || DEFAULT_FILES
    
    for (const filePath of filesToCheck) {
      try {
        const fullPath = join(directory, filePath)
        const stat = await access(fullPath).then(() => true).catch(() => false)
        if (stat) {
          // Check if it's a directory
          try {
            const entries = await readdir(fullPath)
            // Add first 5 files from directory
            for (const entry of entries.slice(0, 5)) {
              if (entry.endsWith('.md') || entry.endsWith('.yaml')) {
                relevantPaths.push(join(filePath, entry))
              }
            }
          } catch {
            // It's a file, add it
            relevantPaths.push(filePath)
          }
        }
      } catch {
        // File/dir doesn't exist, skip
      }
    }

    // Always add story path for dev/coder
    if (story && (agentKey === "dev" || agentKey === "coder")) {
      if (!relevantPaths.includes(story.path)) {
        relevantPaths.unshift(story.path)  // Add at beginning
      }
    }

    return relevantPaths
  }

  async function buildContext(agent: string | null): Promise<SessionContext> {
    const [todos, story] = await Promise.all([
      getTodoList(),
      getActiveStory()
    ])
    
    const relevantFiles = await getRelevantFiles(agent, story)

    return { todos, story, relevantFiles, activeAgent: agent }
  }

  function formatDevContext(ctx: SessionContext): string {
    const sections: string[] = []
    
    if (ctx.story) {
      const s = ctx.story
      const total = s.completedTasks.length + s.pendingTasks.length
      const progress = total > 0 ? (s.completedTasks.length / total * 100).toFixed(0) : 0

      sections.push(`## 🎯 Active Story: ${s.title}

**Path:** \`${s.path}\` ← READ THIS FIRST
**Status:** ${s.status}
**Progress:** ${progress}% (${s.completedTasks.length}/${total} tasks)

### Current Task (DO THIS NOW)
\`\`\`
${s.currentTask || "All tasks complete - run final tests"}
\`\`\`

### Task Breakdown
**Completed:**
${s.completedTasks.length > 0 ? s.completedTasks.map(t => `✅ ${t}`).join("\n") : "None yet"}

**Remaining:**
${s.pendingTasks.length > 0 ? s.pendingTasks.map(t => `⬜ ${t}`).join("\n") : "All done!"}

### Acceptance Criteria
${s.acceptanceCriteria.length > 0 ? s.acceptanceCriteria.join("\n") : "Check story file"}`)
    }

    if (ctx.todos.length > 0) {
      const inProgress = ctx.todos.filter(t => t.status === "in_progress")
      const pending = ctx.todos.filter(t => t.status === "pending")

      if (inProgress.length > 0 || pending.length > 0) {
        sections.push(`## 📋 Session Tasks
**In Progress:** ${inProgress.map(t => t.content).join(", ") || "None"}
**Pending:** ${pending.map(t => t.content).join(", ") || "None"}`)
      }
    }

    return sections.join("\n\n---\n\n")
  }

  function formatArchitectContext(ctx: SessionContext): string {
    return `## 🏗️ Architecture Session

**Focus:** System design, ADRs, technical decisions

### Critical Files (MUST re-read)
${ctx.relevantFiles.map(f => `- \`${f}\``).join("\n")}

### Resume Actions
1. Review docs/architecture.md for current state
2. Check docs/architecture/adr/ for recent decisions
3. Continue from last architectural discussion`
  }

  function formatPmContext(ctx: SessionContext): string {
    return `## 📋 PM Session

**Focus:** PRD, epics, stories, sprint planning

### Critical Files (MUST re-read)
${ctx.relevantFiles.map(f => `- \`${f}\``).join("\n")}

### Resume Actions
1. Check docs/sprint-artifacts/sprint-status.yaml
2. Review current sprint progress
3. Continue from last planning activity`
  }

  function formatAnalystContext(ctx: SessionContext): string {
    return `## 📊 Analyst Session

**Focus:** Requirements gathering, validation

### Critical Files (MUST re-read)
${ctx.relevantFiles.map(f => `- \`${f}\``).join("\n")}

### Resume Actions
1. Review docs/requirements/requirements.md
2. Check for pending stakeholder questions
3. Continue requirements elicitation`
  }

  function formatResearcherContext(ctx: SessionContext): string {
    return `## 🔍 Research Session

**Focus:** Technical, market, or domain research

### Critical Files (MUST re-read)
${ctx.relevantFiles.map(f => `- \`${f}\``).join("\n")}

### Resume Actions
1. Review docs/research/ folder
2. Check research objectives
3. Continue investigation`
  }

  function formatGenericContext(ctx: SessionContext): string {
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

    if (ctx.relevantFiles.length > 0) {
      sections.push(`## Critical Files (MUST re-read)
${ctx.relevantFiles.map(f => `- \`${f}\``).join("\n")}`)
    }

    return sections.join("\n\n---\n\n")
  }

  function formatContext(ctx: SessionContext): string {
    const agent = ctx.activeAgent?.toLowerCase()
    
    switch (agent) {
      case "dev":
      case "coder":
        return formatDevContext(ctx)
      case "architect":
        return formatArchitectContext(ctx)
      case "pm":
        return formatPmContext(ctx)
      case "analyst":
        return formatAnalystContext(ctx)
      case "researcher":
        return formatResearcherContext(ctx)
      default:
        return formatGenericContext(ctx)
    }
  }

  function formatInstructions(ctx: SessionContext): string {
    const agent = ctx.activeAgent?.toLowerCase()
    const hasInProgressTasks = ctx.todos.some(t => t.status === "in_progress")
    const hasInProgressStory = ctx.story?.status === "in-progress"

    if (!hasInProgressTasks && !hasInProgressStory) {
      return `## Status: COMPLETED ✅

Previous task was completed successfully.

**Next:**
1. Review completed work
2. Run validation/tests if applicable
3. Ask user for next task`
    }

    // Dev-specific instructions
    if ((agent === "dev" || agent === "coder") && ctx.story) {
      return `## Status: IN PROGRESS 🔄

**Active Agent:** @${agent}
**Story:** ${ctx.story.title}
**Current Task:** ${ctx.story.currentTask}

### Resume Protocol
1. **Read story file:** \`${ctx.story.path}\`
2. **Load skill:** \`.opencode/skills/dev-story/SKILL.md\`
3. **Run tests first** to see current state
4. **Continue task:** ${ctx.story.currentTask}
5. **Follow TDD:** Red → Green → Refactor

### DO NOT
- Start over from scratch
- Skip reading the story file
- Ignore existing tests`
    }

    // Generic instructions
    return `## Status: IN PROGRESS 🔄

**Active Agent:** @${ctx.activeAgent || "unknown"}

### Resume Protocol
1. Read critical files listed above
2. Check previous messages for context
3. Continue from last action
4. Update todo/story when task complete`
  }

  return {
    // Track active agent from chat messages
    "chat.message": async (input, output) => {
      if (input.agent) {
        lastActiveAgent = input.agent
        lastSessionId = input.sessionID
      }
    },

    // Also track from chat params (backup)
    "chat.params": async (input, output) => {
      if (input.agent) {
        lastActiveAgent = input.agent
      }
    },

    "experimental.session.compacting": async (input, output) => {
      // Use tracked agent or try to detect from session
      const agent = lastActiveAgent
      const ctx = await buildContext(agent)
      ctx.activeAgent = agent
      
      const context = formatContext(ctx)
      const instructions = formatInstructions(ctx)
      const readCommands = generateReadCommands(agent, ctx.story)

      output.context.push(`# Session Continuation
${agent ? `**Last Active Agent:** @${agent}` : ""}

${readCommands}

---

${context}

---

${instructions}`)
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
