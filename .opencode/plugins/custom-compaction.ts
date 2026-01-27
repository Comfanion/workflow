import type { Plugin } from "@opencode-ai/plugin"
import { readFile, access, readdir, appendFile } from "fs/promises"
import { join } from "path"

// Debug logging to file
async function log(directory: string, message: string): Promise<void> {
  const logPath = join(directory, ".opencode", "compaction.log")
  const timestamp = new Date().toISOString()
  try {
    await appendFile(logPath, `[${timestamp}] ${message}\n`)
  } catch {
    // ignore logging errors
  }
}

// Service agents that should be ignored
const SERVICE_AGENTS = ["title", "compaction", "summary", "system"]

function isRealAgent(agent: string | null): boolean {
  if (!agent) return false
  return !SERVICE_AGENTS.includes(agent.toLowerCase())
}

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

interface SessionState {
  command: string | null       // /dev-sprint, /dev-epic, /dev-story
  agent: string | null
  sprint: { number: number; status: string } | null
  epic: { id: string; title: string; file: string; progress: string } | null
  story: { id: string; title: string; file: string; current_task: string | null; completed_tasks: string[]; pending_tasks: string[] } | null
  next_action: string | null
  key_decisions: string[]
}

interface SessionContext {
  todos: TaskStatus[]
  story: StoryContext | null
  sessionState: SessionState | null
  relevantFiles: string[]
  activeAgent: string | null
  activeCommand: string | null  // /dev-story, /dev-epic, /dev-sprint
}

// Base files ALL agents need after compaction (to remember who they are)
const BASE_FILES = [
  "CLAUDE.md",      // Project rules, coding standards
  "AGENTS.md",      // Agent personas and how they work
]

// Agent-specific file priorities (added to BASE_FILES)
// These are OPTIONAL files for context, not mandatory
const AGENT_FILES: Record<string, string[]> = {
  dev: [
    ...BASE_FILES,
    "docs/coding-standards/README.md",
    "docs/coding-standards/patterns.md",
    // NO prd.md, NO architecture.md - too large, story has context
    // story path added dynamically
  ],
  coder: [
    ...BASE_FILES,
    "docs/coding-standards/patterns.md",
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
// MINIMAL CONTEXT: ~70KB for dev, not 200KB+
// Note: coding-standards/README.md is standard path created by /coding-standards command
const MUST_READ_FILES: Record<string, string[]> = {
  dev: [
    "AGENTS.md",
    "CLAUDE.md",
    "docs/coding-standards/README.md",  // if exists
    // story/epic state path added dynamically
  ],
  coder: [
    "AGENTS.md",
    "CLAUDE.md",
    "docs/coding-standards/README.md",
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
  async function generateReadCommands(agent: string | null, story: StoryContext | null, activeCommand: string | null, sessionState: SessionState | null): Promise<string> {
    const agentKey = (typeof agent === 'string' ? agent.toLowerCase() : null) || "default"
    const filesToRead = [...(MUST_READ_FILES[agentKey] || MUST_READ_FILES.default)]
    
    // For dev/coder: add command file first
    if ((agentKey === "dev" || agentKey === "coder") && activeCommand) {
      const commandFile = activeCommand.replace("/", "") + ".md"
      filesToRead.unshift(`.opencode/commands/${commandFile}`)
    }
    
    // For dev/coder: add session-state.yaml as priority read
    if ((agentKey === "dev" || agentKey === "coder")) {
      // Session state is most important — has everything
      filesToRead.unshift(".opencode/session-state.yaml")
      
      // Then story file (from session state or StoryContext)
      const storyFile = sessionState?.story?.file || story?.path
      if (storyFile) {
        filesToRead.unshift(storyFile)  // Story first!
      }

      // Epic state as backup (only if no session state)
      if (!sessionState) {
        const epicState = await getActiveEpicState()
        if (epicState) {
          filesToRead.unshift(epicState.statePath.replace(directory + "/", ""))
        }
      }
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

  interface EpicState {
    statePath: string
    epicId: string
    epicTitle: string
    status: string
    currentStoryIndex: number
    totalStories: number
    nextAction: string | null
    nextStoryPath: string | null
    completedCount: number
    pendingCount: number
  }

  async function getActiveEpicState(): Promise<EpicState | null> {
    try {
      // Search for epic state files in all sprint folders
      const sprintArtifactsPath = join(directory, "docs", "sprint-artifacts")
      const entries = await readdir(sprintArtifactsPath)
      
      for (const entry of entries) {
        if (entry.startsWith("sprint-")) {
          const statePath = join(sprintArtifactsPath, entry, ".sprint-state")
          try {
            const stateFiles = await readdir(statePath)
            for (const stateFile of stateFiles) {
              if (stateFile.endsWith("-state.yaml")) {
                const fullPath = join(statePath, stateFile)
                const content = await readFile(fullPath, "utf-8")
                
                // Check if this epic is in-progress
                if (content.includes("status: \"in-progress\"") || content.includes("status: in-progress")) {
                  // Parse epic state
                  const epicIdMatch = content.match(/epic_id:\s*["']?([^"'\n]+)["']?/i)
                  const epicTitleMatch = content.match(/epic_title:\s*["']?([^"'\n]+)["']?/i)
                  const statusMatch = content.match(/status:\s*["']?([^"'\n]+)["']?/i)
                  const currentIndexMatch = content.match(/current_story_index:\s*(\d+)/i)
                  const totalStoriesMatch = content.match(/total_stories:\s*(\d+)/i)
                  const nextActionMatch = content.match(/next_action:\s*["']?([^"'\n]+)["']?/i)
                  
                  // Count completed/pending stories
                  const completedSection = content.match(/completed_stories:([\s\S]*?)(?=pending_stories:|$)/i)
                  const pendingSection = content.match(/pending_stories:([\s\S]*?)(?=\n\w+:|$)/i)
                  
                  const completedCount = completedSection 
                    ? (completedSection[1].match(/- path:/g) || []).length 
                    : 0
                  const pendingCount = pendingSection 
                    ? (pendingSection[1].match(/- path:/g) || []).length 
                    : 0
                  
                  // Extract next story path from next_action
                  let nextStoryPath: string | null = null
                  if (nextActionMatch) {
                    const actionText = nextActionMatch[1]
                    const storyFileMatch = actionText.match(/story-[\w-]+\.md/i)
                    if (storyFileMatch) {
                      // Find full path in pending_stories
                      const pathMatch = content.match(new RegExp(`path:\\s*["']?([^"'\\n]*${storyFileMatch[0]}[^"'\\n]*)["']?`, 'i'))
                      if (pathMatch) {
                        nextStoryPath = pathMatch[1]
                      }
                    }
                  }
                  
                  return {
                    statePath: fullPath.replace(directory + "/", ""),
                    epicId: epicIdMatch?.[1] || "unknown",
                    epicTitle: epicTitleMatch?.[1] || "Unknown Epic",
                    status: statusMatch?.[1] || "in-progress",
                    currentStoryIndex: currentIndexMatch ? parseInt(currentIndexMatch[1]) : 0,
                    totalStories: totalStoriesMatch ? parseInt(totalStoriesMatch[1]) : 0,
                    nextAction: nextActionMatch?.[1] || null,
                    nextStoryPath,
                    completedCount,
                    pendingCount
                  }
                }
              }
            }
          } catch {
            // No .sprint-state folder in this sprint
          }
        }
      }
      return null
    } catch {
      return null
    }
  }

  /**
   * PRIMARY source: session-state.yaml written by AI agent.
   * Falls back to getActiveEpicState() + getActiveStory() if missing.
   */
  async function getSessionState(): Promise<SessionState | null> {
    try {
      const statePath = join(directory, ".opencode", "session-state.yaml")
      const content = await readFile(statePath, "utf-8")
      await log(directory, `  session-state.yaml found, parsing...`)

      // Simple regex YAML parser for flat/nested fields
      const str = (key: string): string | null => {
        const m = content.match(new RegExp(`^${key}:\\s*["']?(.+?)["']?\\s*$`, 'm'))
        return m ? m[1].trim() : null
      }
      const nested = (parent: string, key: string): string | null => {
        const section = content.match(new RegExp(`^${parent}:\\s*\\n((?:  .+\\n?)*)`, 'm'))
        if (!section) return null
        const m = section[1].match(new RegExp(`^\\s+${key}:\\s*["']?(.+?)["']?\\s*$`, 'm'))
        return m ? m[1].trim() : null
      }
      const list = (parent: string, key: string): string[] => {
        const val = nested(parent, key)
        if (!val) return []
        // Handle [T1, T2] or T1, T2
        const clean = val.replace(/^\[/, '').replace(/\]$/, '')
        return clean.split(',').map(s => s.trim()).filter(Boolean)
      }

      // Parse key_decisions as list
      const decisions: string[] = []
      const decMatch = content.match(/^key_decisions:\s*\n((?:\s+-\s*.+\n?)*)/m)
      if (decMatch) {
        const items = decMatch[1].matchAll(/^\s+-\s*["']?(.+?)["']?\s*$/gm)
        for (const item of items) {
          decisions.push(item[1])
        }
      }

      const state: SessionState = {
        command: str('command'),
        agent: str('agent'),
        sprint: nested('sprint', 'number') ? {
          number: parseInt(nested('sprint', 'number') || '0'),
          status: nested('sprint', 'status') || 'unknown'
        } : null,
        epic: nested('epic', 'id') ? {
          id: nested('epic', 'id') || '',
          title: nested('epic', 'title') || '',
          file: nested('epic', 'file') || '',
          progress: nested('epic', 'progress') || ''
        } : null,
        story: nested('story', 'id') ? {
          id: nested('story', 'id') || '',
          title: nested('story', 'title') || '',
          file: nested('story', 'file') || '',
          current_task: nested('story', 'current_task'),
          completed_tasks: list('story', 'completed_tasks'),
          pending_tasks: list('story', 'pending_tasks')
        } : null,
        next_action: str('next_action'),
        key_decisions: decisions
      }

      await log(directory, `  parsed: command=${state.command}, epic=${state.epic?.id}, story=${state.story?.id}`)
      return state
    } catch {
      await log(directory, `  session-state.yaml not found, using fallback`)
      return null
    }
  }

  async function getActiveStory(): Promise<StoryContext | null> {
    try {
      let storyPath: string | null = null

      // First, try epic state file for story path
      const epicState = await getActiveEpicState()
      if (epicState?.nextStoryPath) {
        storyPath = epicState.nextStoryPath
      }

      // Fallback: try sprint-status.yaml
      if (!storyPath) {
        try {
          const sprintStatusPath = join(directory, "docs", "sprint-artifacts", "sprint-status.yaml")
          const content = await readFile(sprintStatusPath, "utf-8")
          const inProgressMatch = content.match(/status:\s*in-progress[\s\S]*?path:\s*["']?([^"'\n]+)["']?/i)
          if (inProgressMatch) {
            storyPath = inProgressMatch[1]
          }
        } catch {
          // No sprint-status.yaml
        }
      }

      if (!storyPath) return null

      // Parse story file
      const storyContent = await readFile(join(directory, storyPath), "utf-8")
      const titleMatch = storyContent.match(/^#\s+(.+)/m)
      const statusMatch = storyContent.match(/\*\*Status:\*\*\s*(\w+)/i)

      const completedTasks: string[] = []
      const pendingTasks: string[] = []
      let currentTask: string | null = null

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
    const agentKey = (typeof agent === 'string' ? agent.toLowerCase() : null) || "default"
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

  async function detectActiveCommand(todos: TaskStatus[], epicState: EpicState | null): Promise<string | null> {
    // Detect command from TODO structure
    if (todos.length === 0) return null
    
    // Check if TODOs are epics (sprint mode)
    const hasEpicTodos = todos.some(t => t.content.toLowerCase().includes("epic"))
    if (hasEpicTodos) return "/dev-sprint"
    
    // Check if TODOs are stories (epic mode)
    const hasStoryTodos = todos.some(t => t.content.toLowerCase().includes("story"))
    if (hasStoryTodos || epicState) return "/dev-epic"
    
    // Regular story mode
    return "/dev-story"
  }

  async function buildContext(agent: string | null): Promise<SessionContext> {
    // PRIMARY: try session-state.yaml (written by AI agent)
    const sessionState = await getSessionState()
    
    const [todos, story] = await Promise.all([
      getTodoList(),
      // If session state has story path, use it; otherwise parse files
      sessionState?.story?.file 
        ? readStoryFromPath(sessionState.story.file)
        : getActiveStory()
    ])
    
    const epicState = await getActiveEpicState()
    const relevantFiles = await getRelevantFiles(agent, story)
    
    // Command: from session state or detected from TODOs
    const activeCommand = sessionState?.command || await detectActiveCommand(todos, epicState)

    return { todos, story, sessionState, relevantFiles, activeAgent: agent, activeCommand }
  }

  /** Read and parse a story file by path */
  async function readStoryFromPath(storyPath: string): Promise<StoryContext | null> {
    try {
      const storyContent = await readFile(join(directory, storyPath), "utf-8")
      const titleMatch = storyContent.match(/^#\s+(.+)/m)
      const statusMatch = storyContent.match(/\*\*Status:\*\*\s*(\w+)/i)

      const completedTasks: string[] = []
      const pendingTasks: string[] = []
      let currentTask: string | null = null

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

  async function formatDevContext(ctx: SessionContext): Promise<string> {
    const sections: string[] = []
    const ss = ctx.sessionState

    // SESSION STATE available — use it (primary source)
    if (ss) {
      let header = `## 🎯 Session State (from session-state.yaml)\n`
      header += `**Command:** ${ss.command || "unknown"}\n`
      
      if (ss.sprint) {
        header += `**Sprint:** #${ss.sprint.number} (${ss.sprint.status})\n`
      }
      if (ss.epic) {
        header += `**Epic:** ${ss.epic.id} — ${ss.epic.title}\n`
        header += `**Epic File:** \`${ss.epic.file}\`\n`
        header += `**Epic Progress:** ${ss.epic.progress}\n`
      }
      if (ss.story) {
        header += `\n**Story:** ${ss.story.id} — ${ss.story.title}\n`
        header += `**Story File:** \`${ss.story.file}\` ← READ THIS FIRST\n`
        header += `**Current Task:** ${ss.story.current_task || "all done"}\n`
        header += `**Completed:** ${ss.story.completed_tasks.join(", ") || "none"}\n`
        header += `**Pending:** ${ss.story.pending_tasks.join(", ") || "none"}\n`
      }
      
      header += `\n### Next Action (DO THIS NOW)\n\`\`\`\n${ss.next_action || "Check TODO list"}\n\`\`\`\n`
      
      if (ss.key_decisions.length > 0) {
        header += `\n### Key Technical Decisions\n`
        header += ss.key_decisions.map(d => `- ${d}`).join("\n")
      }
      
      sections.push(header)
    }
    // FALLBACK: parse epic state file
    else {
      const epicState = await getActiveEpicState()
      if (epicState) {
        const progress = epicState.totalStories > 0 
          ? ((epicState.completedCount / epicState.totalStories) * 100).toFixed(0) 
          : 0

        sections.push(`## 🎯 Epic Workflow: ${epicState.epicTitle}

**Epic ID:** ${epicState.epicId}
**Epic State:** \`${epicState.statePath}\` ← READ THIS FIRST
**Progress:** ${progress}% (${epicState.completedCount}/${epicState.totalStories} stories)

### Next Action (DO THIS NOW)
\`\`\`
${epicState.nextAction || "All stories complete - run epic integration tests"}
\`\`\`

${epicState.nextStoryPath ? `**Next Story:** \`${epicState.nextStoryPath}\` ← READ THIS SECOND` : ""}

### Epic Progress
**Completed Stories:** ${epicState.completedCount}
**Pending Stories:** ${epicState.pendingCount}
**Current Index:** ${epicState.currentStoryIndex}

---

💡 **Note:** If this is part of /dev-sprint, after epic completes:
1. Update sprint-status.yaml (mark epic done)
2. Continue to next epic automatically`)
      }
    }
    
    if (!ss && ctx.story) {
      // Regular story mode
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

  async function formatContext(ctx: SessionContext): Promise<string> {
    const agent = ctx.activeAgent?.toLowerCase()
    
    switch (agent) {
      case "dev":
      case "coder":
        return await formatDevContext(ctx)
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

  async function formatInstructions(ctx: SessionContext): Promise<string> {
    const agent = ctx.activeAgent?.toLowerCase()
    const hasInProgressTasks = ctx.todos.some(t => t.status === "in_progress")
    const hasInProgressStory = ctx.story?.status === "in-progress"
    
    // Check if we're in epic workflow
    const epicState = await getActiveEpicState()

    if (!hasInProgressTasks && !hasInProgressStory && !epicState) {
      return `## Status: COMPLETED ✅

Previous task was completed successfully.

**Next:**
1. Review completed work
2. Run validation/tests if applicable
3. Ask user for next task`
    }

    // Sprint workflow instructions
    if (ctx.activeCommand === "/dev-sprint" && (agent === "dev" || agent === "coder")) {
      const nextEpicTodo = ctx.todos.find(t => t.status === "in_progress" && t.content.toLowerCase().includes("epic"))
      return `## Status: SPRINT IN PROGRESS 🔄

**Active Command:** ${ctx.activeCommand}
**Active Agent:** @${agent}
**Next Epic:** ${nextEpicTodo?.content || "check TODO"}

### Resume Protocol (AUTOMATIC - DO NOT ASK USER)
1. **Read command:** \`.opencode/commands/dev-sprint.md\`
2. **Read sprint-status.yaml**
3. **Find next epic** from TODO or sprint-status.yaml
4. **Execute epic** via /dev-epic workflow
5. **After epic done:**
   - Update sprint-status.yaml (mark epic done)
   - Update TODO (mark epic completed, next epic in_progress)
   - Continue next epic automatically

### DO NOT
- Ask user what to do (TODO + sprint-status.yaml tell you)
- Re-read completed epics
- Wait for confirmation between epics (auto-continue)

### IMPORTANT
This is /dev-sprint autopilot mode. Execute epics sequentially until sprint done.`
    }

    // Epic workflow instructions
    if ((ctx.activeCommand === "/dev-epic" || epicState) && (agent === "dev" || agent === "coder")) {
      return `## Status: EPIC IN PROGRESS 🔄

**Active Command:** ${ctx.activeCommand || "/dev-epic"}
**Active Agent:** @${agent}
**Epic:** ${epicState?.epicTitle || "check epic state"}
**Next Action:** ${epicState?.nextAction || "check TODO"}

### Resume Protocol (AUTOMATIC - DO NOT ASK USER)
1. **Read command:** \`.opencode/commands/dev-epic.md\`
2. **Read epic state:** \`${epicState?.statePath || "find in .sprint-state/"}\`
3. **Read next story:** \`${epicState?.nextStoryPath || "check epic state"}\`
4. **Load skill:** \`.opencode/skills/dev-story/SKILL.md\`
5. **Execute story** following /dev-story workflow
6. **After story done:**
   - Update epic state file (move story to completed)
   - Update TODO (mark story completed, next story in_progress)
   - Increment current_story_index
   - Set next_action to next story
   - Continue next story automatically

### DO NOT
- Ask user what to do (epic state + TODO tell you)
- Re-read completed stories
- Re-read epic file (info in state)
- Wait for confirmation between stories (auto-continue)

### IMPORTANT
This is /dev-epic autopilot mode. Execute stories sequentially until epic done.`
    }

    // Dev-specific instructions (regular story)
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

  function buildBriefing(agent: string | null, ss: SessionState | null, ctx: SessionContext, readCommands: string): string {
    const lines: string[] = []

    // 1. WHO you are
    if (agent) {
      lines.push(`You are @${agent} (→ .opencode/agents/${agent}.md).`)
    }

    // 2. WHAT you are doing
    if (ss) {
      const cmd = ss.command || "unknown command"
      if (ss.epic) {
        lines.push(`You are executing ${cmd} ${ss.epic.id}: ${ss.epic.title}.`)
      } else if (ss.story) {
        lines.push(`You are executing ${cmd} ${ss.story.id}: ${ss.story.title}.`)
      } else {
        lines.push(`You are executing ${cmd}.`)
      }
    } else if (ctx.activeCommand) {
      lines.push(`You are executing ${ctx.activeCommand}.`)
    }

    // 3. WHERE you stopped
    if (ss?.story) {
      const task = ss.story.current_task || "review"
      lines.push(`You were on story ${ss.story.id}: ${ss.story.title}, task ${task}.`)
      if (ss.story.completed_tasks.length > 0) {
        lines.push(`Completed: ${ss.story.completed_tasks.join(", ")}.`)
      }
      if (ss.story.pending_tasks.length > 0) {
        lines.push(`Remaining: ${ss.story.pending_tasks.join(", ")}.`)
      }
    } else if (ss?.epic) {
      lines.push(`Epic progress: ${ss.epic.progress}.`)
    } else if (ctx.story) {
      lines.push(`You were on story: ${ctx.story.title}, task ${ctx.story.currentTask || "review"}.`)
    }

    // 4. WHAT to do next
    if (ss?.next_action) {
      lines.push(`\nNext action: ${ss.next_action}`)
    }

    // 5. READ these files
    lines.push(`\n${readCommands}`)

    // 6. KEY DECISIONS (if any)
    if (ss?.key_decisions && ss.key_decisions.length > 0) {
      lines.push(`\nKey decisions from your session:`)
      for (const d of ss.key_decisions) {
        lines.push(`- ${d}`)
      }
    }

    // 7. TODO status (brief)
    if (ctx.todos.length > 0) {
      const inProgress = ctx.todos.filter(t => t.status === "in_progress")
      const pending = ctx.todos.filter(t => t.status === "pending")
      const completed = ctx.todos.filter(t => t.status === "completed")
      lines.push(`\nTODO: ${completed.length} done, ${inProgress.length} in progress, ${pending.length} pending.`)
    }

    // 8. RULES
    lines.push(`\nDO NOT ask user what to do. Read files above, then resume automatically.`)

    return lines.join("\n")
  }

  return {
    // Track active agent from chat messages
    "chat.message": async (input, output) => {
      await log(directory, `chat.message: agent=${input.agent}, sessionID=${input.sessionID}`)
      if (input.agent) {
        // Handle both string and object agent (e.g., { name: "dev" })
        const agent = typeof input.agent === 'string' 
          ? input.agent 
          : (input.agent as any)?.name || null
        
        // Only track real agents, not service agents
        if (isRealAgent(agent)) {
          lastActiveAgent = agent
          lastSessionId = input.sessionID
          await log(directory, `  -> tracked agent: ${lastActiveAgent}`)
        } else {
          await log(directory, `  -> ignored service agent: ${agent}`)
        }
      }
    },

    // Also track from chat params (backup)
    "chat.params": async (input, output) => {
      await log(directory, `chat.params: agent=${input.agent}`)
      if (input.agent) {
        const agent = typeof input.agent === 'string' 
          ? input.agent 
          : (input.agent as any)?.name || null
        
        // Only track real agents, not service agents
        if (isRealAgent(agent)) {
          lastActiveAgent = agent
          await log(directory, `  -> tracked agent: ${lastActiveAgent}`)
        } else {
          await log(directory, `  -> ignored service agent: ${agent}`)
        }
      }
    },

    "experimental.session.compacting": async (input, output) => {
      await log(directory, `=== COMPACTION STARTED ===`)
      await log(directory, `  lastActiveAgent: ${lastActiveAgent}`)
      
      // Use tracked agent or try to detect from session
      const agent = lastActiveAgent
      const ctx = await buildContext(agent)
      ctx.activeAgent = agent
      
      await log(directory, `  story: ${ctx.story?.path || 'none'}`)
      await log(directory, `  todos: ${ctx.todos.length}`)
      await log(directory, `  relevantFiles: ${ctx.relevantFiles.length}`)
      
      const context = await formatContext(ctx)
      const instructions = await formatInstructions(ctx)
      const readCommands = await generateReadCommands(agent, ctx.story, ctx.activeCommand, ctx.sessionState)

      // Build agentic briefing
      const ss = ctx.sessionState
      const briefing = buildBriefing(agent, ss, ctx, readCommands)
      output.context.push(briefing)
      
      await log(directory, `  -> output.context pushed (${output.context.length} items)`)
      await log(directory, `=== COMPACTION DONE ===`)
    },

    event: async ({ event }) => {
      await log(directory, `event: ${event.type}`)
      if (event.type === "session.idle") {
        const story = await getActiveStory()
        if (story && story.pendingTasks.length === 0) {
          await log(directory, `  -> Story complete: ${story.title}`)
          console.log(`[compaction] Story complete: ${story.title}`)
        }
      }
    }
  }
}

export default CustomCompactionPlugin
