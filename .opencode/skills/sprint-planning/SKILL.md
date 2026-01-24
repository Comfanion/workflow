---
name: sprint-planning
description: Use when organizing epics into sprints, creating sprint-status.yaml, or tracking sprint progress. REQUIRES epics to exist first - run /epics if none
license: MIT
compatibility: opencode
metadata:
  domain: agile
  artifacts: docs/sprint-artifacts/sprint-status.yaml
---

# Sprint Planning Skill

## When to Use

Use this skill when you need to:
- Organize epics into sprints
- Create sprint-status.yaml
- Track sprint progress
- Plan new sprints

## Prerequisites

**CRITICAL: Epics must exist before sprint planning!**

```
Check: ls docs/sprint-artifacts/backlog/epic-*.md 2>/dev/null || ls docs/sprint-artifacts/sprint-*/epic-*.md 2>/dev/null
```

| Check | Action if Missing |
|-------|-------------------|
| No epics in backlog or sprints | **STOP** → Run `/epics` first to create epics from PRD |
| Epics exist but no stories | Epics can be planned, stories created later with `/stories` |
| PRD missing | **STOP** → Run `/prd` first |

### Dependency Chain

```
/prd → /architecture → /epics → /sprint-plan
                          ↑
                    YOU ARE HERE
                    (need epics first!)
```

If user asks for sprint planning without epics:
1. Inform them epics are required
2. Offer to create epics first with `/epics`
3. Only proceed with sprint planning after epics exist

## Sprint Duration

- **Recommended:** 2 weeks
- **Range:** 1-4 weeks depending on team
- **Sprint 0:** Foundation/setup work

## Sprint Planning Process

### Step 1: Analyze Backlog

1. List all epics from `docs/sprint-artifacts/backlog/`
2. Check dependencies between epics
3. Identify P0 (must-have) epics

### Step 2: Calculate Velocity

If historical data exists:
- Average story points per sprint
- Team availability

If new project:
- Estimate conservatively
- Plan 60-70% capacity for first sprint

### Step 3: Create Sprint

1. Select epics that fit capacity
2. Respect dependencies (blocked epics can't start)
3. Balance workload across team
4. Define sprint goal

### Step 4: Move Epics

```bash
# Move epic from backlog to sprint
mv docs/sprint-artifacts/backlog/epic-10-*.md docs/sprint-artifacts/sprint-2/
```

### Step 5: Update sprint-status.yaml

## Sprint Status YAML Format

```yaml
# docs/sprint-artifacts/sprint-status.yaml
project: marketplace
current_sprint: sprint-1
updated: 2026-01-23

sprints:
  sprint-0:
    status: completed
    goal: "Foundation and data layer"
    start_date: 2026-01-06
    end_date: 2026-01-17
    velocity: 34  # story points completed
    epics:
      - id: CATALOG-E01
        title: "Catalog Data Layer"
        status: done
        stories_done: 6
        stories_total: 6

  sprint-1:
    status: in_progress
    goal: "Core domain implementation"
    start_date: 2026-01-20
    end_date: 2026-02-03
    capacity: 40  # planned story points
    epics:
      - id: CATALOG-E05
        title: "Products Service"
        status: in_progress
        branch: feature/epic-05-products-service
        assignee: team-catalog
        stories:
          - id: CATALOG-S05-01
            title: "Product aggregate"
            status: in_progress
            estimate: M
            assignee: developer-1
          - id: CATALOG-S05-02
            title: "Product repository"
            status: todo
            estimate: M
            assignee: developer-1
          - id: CATALOG-S05-03
            title: "Product HTTP endpoints"
            status: todo
            estimate: L
            assignee: developer-2

  sprint-2:
    status: planned
    goal: "Search and filtering"
    start_date: 2026-02-03
    end_date: 2026-02-17
    epics: []  # To be planned

backlog:
  - id: CATALOG-E10
    title: "Search Integration"
    priority: P1
    estimate: L
    depends_on: [CATALOG-E05]
  
  - id: INVENTORY-E01
    title: "Inventory Management"
    priority: P0
    estimate: XL
    depends_on: [CATALOG-E05]
```

## Status Values

### Sprint Status
- `planned` - Sprint defined but not started
- `in_progress` - Current sprint
- `completed` - Sprint finished

### Epic Status
- `todo` - Not started
- `in_progress` - Work ongoing
- `review` - All stories done, under review
- `done` - Completed and merged

### Story Status
- `todo` - Not started
- `in_progress` - Being worked on
- `review` - PR submitted
- `done` - Merged

## Sprint Actions

### Start New Sprint

```yaml
# Add new sprint
sprint-2:
  status: in_progress
  goal: "[Sprint goal]"
  start_date: YYYY-MM-DD
  end_date: YYYY-MM-DD
  epics: []

# Update current_sprint
current_sprint: sprint-2
```

### Complete Sprint

```yaml
# Update sprint status
sprint-1:
  status: completed
  velocity: 38  # actual points completed

# Move incomplete work to backlog or next sprint
```

### Update Progress

```yaml
# Update story status
- id: CATALOG-S05-01
  status: done  # was: in_progress

# Update epic progress
- id: CATALOG-E05
  stories_done: 3  # was: 2
```

## Sprint Planning Rules

1. **Respect dependencies** - Blocked epics wait
2. **Don't overcommit** - Plan 70-80% capacity
3. **Balance skills** - Distribute work by expertise
4. **Include buffer** - Leave room for issues
5. **Clear goals** - Each sprint has measurable goal

## Sprint Review Checklist

At end of sprint:
- [ ] All stories marked done or moved
- [ ] Velocity calculated
- [ ] Retrospective notes added
- [ ] Blockers documented
- [ ] Next sprint planned

## Output

Update: `docs/sprint-artifacts/sprint-status.yaml`

## Related Skills

- `epic-writing` - For creating epics
- `story-writing` - For creating stories
- `jira-integration` - For syncing to Jira
