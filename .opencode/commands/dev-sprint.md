---
description: Execute full sprint - implement all epics sequentially with auto-compaction between epics
agent: dev
---

# /dev-sprint Command

Implement entire sprint by executing all epics with automatic compaction.

## Process

### Phase 1: Sprint Setup
1. Find sprint (from number or sprint-status.yaml)
2. Read `sprint-status.yaml`
3. Parse all epics in sprint
4. Load project context (CLAUDE.md, docs/prd.md, docs/architecture.md)
5. **Create TODO list from sprint** (critical for compaction!):
   - Parse sprint-status.yaml, extract all epics
   - For each epic: read epic file, count stories and tasks
   - Add epics to TODO with story/task counts
   - Add sprint-level tasks (integration tests, acceptance criteria, metrics)
   ```
   [ ] Epic 1: User Authentication (3 stories, 26 tasks)
   [ ] Epic 2: Product Catalog (5 stories, 42 tasks)
   [ ] Epic 3: Shopping Cart (4 stories, 31 tasks)
   [ ] Run sprint integration tests
   [ ] Verify sprint acceptance criteria
   [ ] Generate sprint metrics
   ```
6. Mark sprint as `in-progress` in sprint-status.yaml

### Phase 2: Epic Execution Loop (for each epic)

7. **Mark epic as `in_progress` in TODO** (e.g., "Epic 1: User Authentication")
8. Execute epic via `/dev-epic` workflow:
   - Epic creates its own TODO for stories
   - Epic executes all stories
   - Auto-compacts between stories
   - Auto-fixes code review issues
9. **Mark epic as `completed` in TODO** (✓ Epic 1: User Authentication)
10. **Update sprint-status.yaml**:
    - Mark epic as `done`
    - Update `stories_completed` count
    - Find next epic
11. **Trigger compaction** (if `epic_workflow.auto_compact: true`)
12. **After compaction:** 
    - Plugin reads TODO → sees next pending epic
    - Plugin reads sprint-status.yaml → gets epic path
    - Agent continues next epic automatically

### Phase 3: Sprint Completion

13. All epics done → **mark integration test TODO as `in_progress`**
14. Run sprint integration tests (if configured)
15. **Mark integration test TODO as `completed`**
16. **Mark acceptance criteria TODO as `in_progress`**
17. Verify sprint acceptance criteria
18. **Mark acceptance criteria TODO as `completed`**
19. **Mark metrics TODO as `in_progress`**
20. Generate sprint metrics (velocity, completion rate, etc.)
21. **Mark metrics TODO as `completed`**
22. Update sprint-status.yaml: `status: "done"`
23. **Clear TODO** (all tasks done)
24. Generate sprint summary

## TODO List

**Create at sprint start:**
```
[ ] Epic 1: User Authentication (3 stories)
[ ] Epic 2: Product Catalog (5 stories)
[ ] Epic 3: Shopping Cart (4 stories)
[ ] Run sprint integration tests
[ ] Verify sprint acceptance criteria
[ ] Generate sprint metrics
```

**Update after each epic:**
- Mark epic `completed` in TODO
- Mark next epic `in_progress` in TODO
- TODO survives compaction - plugin shows it to agent

**Note:** Each epic creates its own TODO for stories, clears it when done

## Sprint State Tracking

**Location:** `docs/sprint-artifacts/sprint-status.yaml`

```yaml
sprints:
  - id: sprint-1
    name: "Sprint 1 - Core Features"
    status: in-progress
    start_date: "2026-01-20"
    end_date: "2026-02-03"
    
    epics:
      - id: PROJ-E01
        title: "User Authentication"
        path: "docs/sprint-artifacts/backlog/epic-01-user-auth.md"
        status: done
        stories_completed: 3
        stories_total: 3
        
      - id: PROJ-E02
        title: "Product Catalog"
        path: "docs/sprint-artifacts/backlog/epic-02-catalog.md"
        status: in-progress  # ← Current epic
        stories_completed: 2
        stories_total: 5
        
      - id: PROJ-E03
        title: "Shopping Cart"
        path: "docs/sprint-artifacts/backlog/epic-03-cart.md"
        status: ready-for-dev
        stories_total: 4
```

Each epic also has state file in `.sprint-state/epic-XX-state.yaml`

## Compaction Strategy

**After compaction, agent reads:**
1. sprint-status.yaml (knows which epic is next)
2. Next epic file
3. Next epic state file (if exists)
4. CLAUDE.md, docs/prd.md, docs/architecture.md

**Agent does NOT re-read:**
- ❌ Completed epic files
- ❌ Completed story files
- ❌ Previous epic states

## Configuration

From `config.yaml → epic_workflow`:

```yaml
epic_workflow:
  auto_compact: true              # Compact between epics
  auto_fix: true                  # Auto-fix review issues
  pause_between_stories: false    # Continue automatically
```

## IMPORTANT SKILLS TO LOAD

- `dev-story` - Story implementation workflow
- `test-design` - Test writing patterns
- `code-review` - Review and validation

## Output

- All epic implementations (code + tests)
- Updated sprint-status.yaml
- Sprint summary report
- Sprint metrics (velocity, completion rate)

## HALT Conditions

The workflow will HALT and ask for input when:
- Epic fails repeatedly (3+ failed stories)
- Multiple stories rejected by @reviewer
- Sprint deadline approaching (< 20% time, > 50% work)
- Missing dependencies
- Sprint integration tests fail

## Sprint Status Flow

```
planned → in-progress → [epic 1] → compact → [epic 2] → compact → ... → done
```

## Next Steps After Completion

- Sprint marked `done` in sprint-status.yaml
- All epics and stories marked `done`
- Ready for sprint review/retrospective
- Run `/retrospective` to capture learnings
