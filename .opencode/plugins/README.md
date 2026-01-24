# Plugins

Plugins that extend OpenCode with hooks, events, and custom tools.

## Available Plugins

### custom-compaction.ts

Intelligent session compaction that preserves flow context.

**Features:**
- Tracks todo list and story task status
- Identifies critical documentation files for context
- Generates smart continuation prompts
- Differentiates between completed and interrupted tasks

**Hook:** `experimental.session.compacting`

**What it does:**

| Scenario | Compaction Output |
|----------|-------------------|
| **Task Completed** | Summary of completed work, next steps, validation reminders |
| **Task Interrupted** | Current task, what was done, resume instructions, file list |

**Critical Files Passed to Context:**
- `CLAUDE.md` - Project coding standards
- `AGENTS.md` - Agent definitions
- `project-context.md` - Project overview
- `.opencode/config.yaml` - Flow config
- `docs/prd.md` - Product requirements
- `docs/architecture.md` - System architecture
- `docs/coding-standards/*.md` - Coding patterns
- Active story file (if in progress)

## Installation

Plugins in `.opencode/plugins/` are automatically loaded by OpenCode.

```bash
# No installation needed - just place files in .opencode/plugins/
```

## Creating Custom Plugins

### Hook Types

```typescript
// Compaction - customize context preservation
"experimental.session.compacting": async (input, output) => {
  output.context.push("Custom context...")
  // or replace entirely:
  output.prompt = "Custom prompt..."
}

// Events - react to flow changes
event: async ({ event }) => {
  if (event.type === "session.idle") { /* ... */ }
  if (event.type === "todo.updated") { /* ... */ }
}

// Tool hooks - intercept tool execution
"tool.execute.before": async (input, output) => { /* ... */ }
"tool.execute.after": async (input, output) => { /* ... */ }
```

### Session Events

| Event | When | Use Case |
|-------|------|----------|
| `session.idle` | Agent finished responding | Check task completion, send notifications |
| `todo.updated` | Todo list changed | Track progress, update external systems |
| `file.edited` | File was modified | Track active files for context |
| `session.compacted` | Session was compacted | Log, analytics |

### Example: Story Progress Tracker

```typescript
export const StoryTrackerPlugin: Plugin = async (ctx) => {
  return {
    event: async ({ event }) => {
      if (event.type === "todo.updated") {
        // Sync with Jira, send Slack notification, etc.
      }
    }
  }
}
```

### Example: Auto-Read Documentation

```typescript
export const AutoContextPlugin: Plugin = async (ctx) => {
  return {
    "experimental.session.compacting": async (input, output) => {
      // Always include coding standards in compaction
      output.context.push(`
## Coding Standards (MUST follow)
- Read docs/coding-standards/README.md on resume
- Follow patterns from CLAUDE.md
      `)
    }
  }
}
```
