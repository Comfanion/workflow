---
name: epic-writing
description: Use when creating epics from PRD with acceptance criteria and story breakdown
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

Use template at: `@.opencode/skills/epic-writing/template.md`

## CRITICAL: What is an Epic?

**Epic scope changes with project size!** Read PRD's Project Classification first.

| Project Size | Epic = | Example | Stories |
|--------------|--------|---------|---------|
| **TOY** | Major feature | "Game Logic", "UI Rendering", "Scoring" | 3-8 tasks |
| **SMALL** | Feature area | "User Authentication", "Post Management" | 5-12 tasks |
| **MEDIUM** | **Module/Unit** | "Order Management Module", "Payment Module" | 8-15 features |
| **LARGE** | **Domain** | "Order Domain", "Payment Domain" | 10-20 features |
| **ENTERPRISE** | **Bounded Context** | "Core Banking Context" | 15-30 features |

**For MEDIUM+ projects:**
- Each Epic = One Module from PRD
- Epic should reference Unit documentation: `→ Unit: docs/units/order-management/`
- Stories within epic are features of that module
- Epic owns a set of FRs (e.g., FR-ORD-001 through FR-ORD-015)

**Example - MEDIUM E-commerce:**
```
Epic: Order Management Module
  → Unit: docs/units/order-management/
  → FRs: FR-ORD-001 to FR-ORD-012
  → Stories:
    - Customer can create order
    - System validates inventory
    - Order status workflow
    - Order history view
    ...
```

**Example - TOY Tetris:**
```
Epic: Game Logic
  → Stories:
    - Implement block rotation
    - Add collision detection
    - Clear full lines
    - Increase fall speed
  → No Unit docs needed
  → Simple AC: "Game logic works correctly"
```

**Example - SMALL Blog:**
```
Epic: Post Management
  → Stories:
    - User can create post
    - User can edit post
    - User can delete post
    - User can publish/unpublish
    - Posts show in list
  → No Unit docs (flat structure)
  → AC: "Users can manage posts through full lifecycle"
```

---

## Epic Depth by Project Size

**CRITICAL:** Epic structure changes with project size!

**TOY/SMALL:**
- Simple overview (1-2 paragraphs)
- No Units Affected section (no modules)
- Simple AC checklist
- Stories listed as bullet points
- No Technical Decisions section
- No Risks section

**MEDIUM:**
- Detailed overview with business value
- **Units Affected section** (references Unit docs)
- Comprehensive AC
- Stories in table with dependencies
- Technical Decisions with ADR links
- Risks identified

**LARGE/ENTERPRISE:**
- Complete overview with strategic context
- **Multiple Units Affected** (cross-domain)
- Exhaustive AC with compliance
- Stories with estimates and confidence levels
- All Technical Decisions documented
- Risks with mitigation plans
- Security considerations

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

**Size Guide:** Prefer S→M or M. (S=2-4 tasks, M=4-8 tasks, L=8+ tasks)

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
