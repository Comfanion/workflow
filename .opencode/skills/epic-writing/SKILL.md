---
name: epic-writing
description: How to write epics with proper structure, acceptance criteria, and PRD traceability
license: MIT
compatibility: opencode
metadata:
  domain: agile
  artifacts: docs/sprint-artifacts/*/epic-*.md
---

# Epic Writing Skill

## When to Use

Use this skill when you need to:
- Create epics from PRD
- Define epic scope and acceptance criteria
- Plan stories within an epic
- Track PRD requirement coverage

## Template

Use template at: `@.opencode/templates/epic-template.md`

## Epic Structure (v2)

### 1. Header

```yaml
id: {{PREFIX}}-E{{N}}
status: backlog | ready | in_progress | done
priority: P0 | P1
sprint: {{sprint}}
```

### 2. Overview

Prose section with:
- What epic delivers (bold the outcome)
- Business value
- Scope (included)
- Not included

```markdown
## Overview

This epic delivers **complete task management** for team members. When complete, users will be able to create, assign, and track tasks.

**Business Value:** Core functionality for MVP launch

**Scope:**
- Task CRUD
- Assignments
- Status workflow

**Not Included:**
- Recurring tasks (Growth)
```

### 3. Units Affected

| Unit | Changes | Impact |
|------|---------|--------|
| → Unit: `Task` | Create | New entity |
| → Unit: `User` | Modify | Add relation |

### 4. Dependencies

| Type | Item | Why |
|------|------|-----|
| **Requires** | Auth system | Users must exist |
| **Enables** | Notifications epic | Triggers on assignment |

### 5. PRD Coverage

| FR | Requirement | Notes |
|----|-------------|-------|
| → FR: `FR-001` | Create task | Core feature |
| → FR: `FR-002` | Assign task | |

### 6. Acceptance Criteria

Checklist format:
- [ ] User can create task
- [ ] User can assign task
- [ ] All stories completed
- [ ] Tests pass (>80%)
- [ ] Documentation updated

### 7. Stories

Table + dependency diagram:

| ID | Title | Size | Focus | Status |
|----|-------|------|-------|--------|
| S01-01 | Task Domain | M | → Unit: `Task` | ⬜ |
| S01-02 | Task Repository | M | → Unit: `Task` | ⬜ |

```
S01 ──► S02 ──► S03
```

### 8. Technical Decisions

| Decision | Rationale | ADR |
|----------|-----------|-----|
| UUID for IDs | Distributed generation | → ADR: `ADR-001` |

### 9. Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Complex validation | M | Start simple, iterate |

### 10. References

```
→ PRD: `docs/prd.md`
→ Architecture: `docs/architecture.md`
→ Unit: `Task`
```

## Reference Format

Always use `→` prefix:

```markdown
→ Unit: `Task`
→ FR: `FR-001`
→ ADR: `ADR-001`
→ PRD: `docs/prd.md`
```

## Story Planning

### Story Order

Recommended order within epic:
1. Domain layer (entities, value objects)
2. Repository interfaces
3. Use cases
4. Repository implementations
5. HTTP handlers
6. Integration tests

### Story Focus

Each story should focus on one unit:

| ID | Title | Focus |
|----|-------|-------|
| S01-01 | Task Domain | → Unit: `Task` |
| S01-02 | Task Repository | → Unit: `Task` |

## Naming Conventions

### File Names

```
epic-[NN]-[description].md

Examples:
- epic-01-task-management.md
- epic-02-user-auth.md
```

### Epic IDs

```
[PREFIX]-E[NN]

Examples:
- TASK-E01
- AUTH-E02
```

## Validation Checklist

- [ ] Overview explains what and why
- [ ] Units affected listed with `→ Unit:` format
- [ ] All FRs from scope are listed with `→ FR:` format
- [ ] Acceptance criteria are measurable
- [ ] Stories have dependency order
- [ ] Technical decisions link to ADRs
- [ ] Uses `→` reference format throughout

## Output

Save to: `docs/sprint-artifacts/sprint-[N]/epic-[NN]-[description].md`

Or backlog: `docs/sprint-artifacts/backlog/epic-[NN]-[description].md`

## Related Skills

- `story-writing` - For creating stories
- `prd-writing` - Source of requirements
- `unit-writing` - For documenting affected units
- `sprint-planning` - For organizing epics
