/**
 * Mock PluginInput context for testing plugins.
 * Creates a temp directory with optional fixture files.
 */
import { mkdtemp, mkdir, writeFile, rm } from "fs/promises"
import { tmpdir } from "os"
import { join } from "path"

export interface MockCtx {
  directory: string
  worktree: string
  client: {
    tui: {
      showToast: (...args: any[]) => Promise<void>
    }
  }
  project: { name: string }
  serverUrl: URL
  $: any
}

export function createMockCtx(directory: string): MockCtx {
  const calls: any[][] = []
  const showToast = (...args: any[]) => {
    calls.push(args)
    return Promise.resolve()
  }
  // Attach calls for inspection
  ;(showToast as any).calls = calls

  return {
    directory,
    worktree: directory,
    client: {
      tui: { showToast },
    },
    project: { name: "test-project" },
    serverUrl: new URL("http://localhost:3000"),
    $: {},
  } as any
}

/**
 * Create a temp directory with .opencode/ subdirectory
 * and optional fixture files.
 */
export async function createTempDir(
  fixtures?: Record<string, string>
): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), "plugin-test-"))
  await mkdir(join(dir, ".opencode"), { recursive: true })
  await mkdir(join(dir, ".opencode", "state"), { recursive: true })

  if (fixtures) {
    for (const [relativePath, content] of Object.entries(fixtures)) {
      const fullPath = join(dir, relativePath)
      const parentDir = join(fullPath, "..")
      await mkdir(parentDir, { recursive: true })
      await writeFile(fullPath, content, "utf-8")
    }
  }

  return dir
}

/**
 * Remove temp directory
 */
export async function cleanupTempDir(dir: string): Promise<void> {
  try {
    await rm(dir, { recursive: true, force: true })
  } catch {
    // ignore cleanup errors
  }
}

/**
 * Fixture: session-state.yaml for dev agent working on a story
 */
export const FIXTURE_SESSION_STATE = `command: /dev-epic
agent: dev
sprint:
  number: 1
  status: in-progress
epic:
  id: AUTH-E01
  title: Authentication Module
  file: docs/sprint-artifacts/sprint-1/epic-01-auth.md
  progress: 2/5 stories done
story:
  id: AUTH-S01-03
  title: JWT Token Refresh
  file: docs/sprint-artifacts/sprint-1/stories/story-01-03-jwt-refresh.md
  current_task: T2
  completed_tasks: [T1]
  pending_tasks: [T2, T3, T4]
next_action: Implement T2 - token refresh endpoint
key_decisions:
  - Using RS256 for JWT signing
  - Refresh tokens stored in Redis
`

/**
 * Fixture: story markdown file
 */
export const FIXTURE_STORY_MD = `# AUTH-S01-03: JWT Token Refresh

**Status:** in-progress

## Tasks

- [x] **T1**: Define refresh token interface
- [ ] **T2**: Implement refresh endpoint
- [ ] **T3**: Add token rotation logic
- [ ] **T4**: Write integration tests

## Acceptance Criteria

- [x] Refresh tokens are stored securely
- [ ] Token rotation works on refresh
- [ ] Expired tokens are rejected
`

/**
 * Fixture: epic state YAML
 */
export const FIXTURE_EPIC_STATE = `epic_id: "AUTH-E01"
epic_title: "Authentication Module"
status: "in-progress"
current_story_index: 2
total_stories: 5
completed_stories:
  - path: docs/sprint-artifacts/sprint-1/stories/story-01-01-login.md
    status: done
  - path: docs/sprint-artifacts/sprint-1/stories/story-01-02-register.md
    status: done
pending_stories:
  - path: docs/sprint-artifacts/sprint-1/stories/story-01-03-jwt-refresh.md
    status: in-progress
  - path: docs/sprint-artifacts/sprint-1/stories/story-01-04-logout.md
    status: pending
  - path: docs/sprint-artifacts/sprint-1/stories/story-01-05-password-reset.md
    status: pending
next_action: "Continue story-01-03-jwt-refresh.md"
`

/**
 * Fixture: config.yaml
 */
export const FIXTURE_CONFIG_YAML = `project_name: "test-project"
version: "1.0.0"
communication_language: "Ukrainian"

vectorizer:
  enabled: true
  auto_index: true
  debounce_ms: 500
  exclude:
    - node_modules
    - dist
    - build
`

/**
 * Fixture: todo list
 */
export const FIXTURE_TODOS = JSON.stringify([
  { id: "1", content: "Implement T2 - refresh endpoint", status: "in_progress", priority: "high" },
  { id: "2", content: "Write T3 - token rotation", status: "pending", priority: "high" },
  { id: "3", content: "Write T4 - integration tests", status: "pending", priority: "medium" },
])
