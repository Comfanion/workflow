---
description: Use when planning sprints, organizing epics into sprints, or tracking sprint progress. REQUIRES epics to exist first
agent: pm
---

# Sprint Planning

## Arguments
$ARGUMENTS

- `status` or empty: Show current sprint status
- `new`: Create new sprint
- `assign`: Assign epics to sprint

## Task

### Status Mode

1. Load: @docs/sprint-artifacts/sprint-status.yaml
2. Show current sprint progress
3. List blockers if any
4. Suggest next actions

### New Sprint Mode

1. Load skill: `sprint-planning`
2. Analyze backlog: `docs/sprint-artifacts/backlog/`
3. Check dependencies
4. Select epics for sprint
5. Update sprint-status.yaml
6. Create sprint folder structure

### Assign Mode

1. Load skill: `sprint-planning`
2. Show available epics in backlog
3. Ask which epics to assign
4. Check dependencies (blocked epics can't be assigned)
5. Move epic files to sprint folder
6. Update sprint-status.yaml

## Sprint Folder Structure

```
docs/sprint-artifacts/sprint-N/
├── README.md          # Sprint goal, dates, team
├── epic-NN-xxx.md     # Epics in this sprint
└── stories/
    └── story-NN-NN-xxx.md
```

## Output

Update: `docs/sprint-artifacts/sprint-status.yaml`

## Next Step

After sprint planned: `/jira-sync` to sync to Jira
