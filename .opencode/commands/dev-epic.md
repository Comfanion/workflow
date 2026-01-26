---
description: Execute full epic - implement all stories sequentially with auto-compaction between stories
agent: dev
---

# /dev-epic Command

Implement entire epic by executing all stories with automatic compaction and context preservation.

## Process

### Phase 1: Epic Setup
1. Find or load epic file (from path or sprint-status.yaml)
2. Parse all story references from epic
3. Load project context (CLAUDE.md, docs/prd.md, docs/architecture.md)
4. **Create TODO list from epic** (critical for compaction!):
   - Parse epic file, extract all stories
   - For each story: read story file, count tasks
   - Add stories to TODO with task counts
   - Add epic-level tasks (integration tests, acceptance criteria)
   ```
   [ ] Story 1: User Registration (12 tasks)
   [ ] Story 2: Login Flow (8 tasks)
   [ ] Story 3: Password Reset (6 tasks)
   [ ] Run epic integration tests
   [ ] Verify all acceptance criteria
   ```
5. **Create epic state file:** `docs/sprint-artifacts/sprint-N/.sprint-state/epic-XX-state.yaml`
6. Mark epic as `in-progress`

### Phase 2: Story Execution Loop (for each story)

7. **Mark story as `in_progress` in TODO** (e.g., "Story 1: User Registration")
8. Execute story via `/dev-story` workflow:
   - RED → GREEN → REFACTOR
   - @coder implements tasks
   - @reviewer validates (if auto_review: true)
9. **Mark story as `completed` in TODO** (✓ Story 1: User Registration)
10. **Update epic state file**:
   - Move story from `pending_stories` → `completed_stories`
   - Add metadata (tasks_completed, tests_added, review_status)
   - Increment `current_story_index`
   - Set `next_action: "Execute story-XX-XX.md"` (next story filename)
   - Update `last_compaction` timestamp
11. **Trigger compaction** (if `epic_workflow.auto_compact: true`)
12. **After compaction:** 
    - Plugin reads TODO → sees next pending story
    - Plugin reads epic state → gets story path
    - Agent continues next story automatically

### Phase 3: Epic Completion

13. All stories done → **mark integration test TODO as `in_progress`**
14. Run epic integration tests (if configured)
15. **Mark integration test TODO as `completed`**
16. Update epic state: `status: "done"`
17. **Clear TODO** (all tasks done)
18. Generate epic summary

## TODO List

**Create at epic start:**
```
[ ] Story 1: User Registration
[ ] Story 2: Login Flow  
[ ] Story 3: Password Reset
[ ] Run epic integration tests
[ ] Verify acceptance criteria
```

**Update after each story:**
- Mark story `completed` in TODO
- Mark next story `in_progress` in TODO
- TODO survives compaction - plugin shows it to agent

## Epic State File Format

**Location:** `docs/sprint-artifacts/sprint-N/.sprint-state/epic-XX-state.yaml`

```yaml
epic_id: "PROJ-E01"
epic_title: "User Authentication"
epic_path: "docs/sprint-artifacts/backlog/epic-01-user-auth.md"
sprint: "sprint-1"
status: "in-progress"

current_story_index: 1
total_stories: 3

completed_stories:
  - path: "docs/sprint-artifacts/sprint-1/stories/story-01-01-registration.md"
    title: "User Registration"
    tasks_completed: 12
    tests_added: 45
    review_status: "approved"
    completed_at: "2026-01-27T10:15:00Z"

pending_stories:
  - path: "docs/sprint-artifacts/sprint-1/stories/story-01-02-login.md"
    title: "Login Flow"
  - path: "docs/sprint-artifacts/sprint-1/stories/story-01-03-password-reset.md"
    title: "Password Reset"

next_action: "Execute story-01-02-login.md"
last_compaction: "2026-01-27T10:15:00Z"
```

## Compaction Strategy

**After compaction, agent reads (minimal context):**
1. Epic state file (progress + next action)
2. Next story file (from `next_action`)
3. CLAUDE.md, docs/prd.md, docs/architecture.md

**Agent does NOT re-read:**
- ❌ Epic file (info in state)
- ❌ Completed stories
- ❌ Previous tasks

**Context savings: ~68% less than reading all files**

## Configuration

From `config.yaml → epic_workflow`:

```yaml
epic_workflow:
  auto_compact: true              # Compact between stories
  auto_fix: true                  # Auto-fix review issues
  max_fix_attempts: 3             # Max fix attempts before HALT
  pause_between_stories: false    # Continue automatically
  test_after_each_story: false    # Skip per-story integration tests
  test_after_epic: true           # Run epic integration tests at end
```

## IMPORTANT SKILLS TO LOAD

- `dev-story` - Story implementation workflow
- `test-design` - Test writing patterns
- `code-review` - Review and validation

## Output

- All story implementations (code + tests)
- Epic state file (updated)
- Updated epic file (stories marked `[x]`)
- Epic summary report

## HALT Conditions

The workflow will HALT and ask for input when:
- Story fails 3 times (implementation/tests)
- Code review fails after max_fix_attempts
- Missing dependencies
- Ambiguous requirements
- Integration tests fail

## Epic Status Flow

```
ready-for-dev → in-progress → [story 1] → compact → [story 2] → compact → ... → done
```

## Next Steps After Completion

- Epic marked `done` in epic state file
- All stories marked `done`
- If part of `/dev-sprint`: continue to next epic automatically
- If standalone: ready for sprint review
