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
- Create epics from PRD requirements
- Structure implementation work into manageable chunks
- Define epic-level acceptance criteria
- Track PRD coverage

## Template

Use template at: `@.opencode/templates/epic-template.md`

## Epic Structure

### Header (YAML-like)

```markdown
# Epic N: [Title]

**Epic ID:** [MODULE]-E[NN]
**Status:** TODO | IN_PROGRESS | DONE
**Priority:** P0 | P1 | P2
**Sprint:** sprint-[N]
**Branch:** feature/epic-[NN]-[short-name]
```

### Sections

1. **Overview** - 2-3 sentences on goal and value
2. **Business Value** - Why this epic matters
3. **Dependencies** - What must come before/after
4. **Architecture References** - Links to architecture sections
5. **PRD Coverage** - Which FRs this epic implements
6. **Acceptance Criteria** - MANDATORY, high-level
7. **Stories** - Table of stories in this epic
8. **Technical Notes** - Implementation hints
9. **Risks & Mitigations**

## Naming Conventions

### File Naming

```
epic-[NN]-[module]-[description].md

Examples:
- epic-01-catalog-data-layer.md
- epic-05-catalog-products-service.md
- epic-10-inventory-reservations.md
```

### Epic ID Format

```
[MODULE]-E[NN]

Examples:
- CATALOG-E01
- CATALOG-E05
- INVENTORY-E10
```

### Branch Naming

```
feature/epic-[NN]-[short-name]

Examples:
- feature/epic-01-data-layer
- feature/epic-05-products-service
```

## Acceptance Criteria (MANDATORY)

Every epic MUST have acceptance criteria. Use skill: `acceptance-criteria`

### Epic-level AC Format

```markdown
## Acceptance Criteria

- [ ] All CRUD operations for [entity] implemented
- [ ] API endpoints follow REST conventions
- [ ] Events published for all state changes
- [ ] Unit test coverage > 80%
- [ ] Integration tests passing
- [ ] Documentation updated
- [ ] Code review passed
- [ ] All stories completed
```

### AC Quality Rules

- **Testable** - Each criterion can be verified
- **Feature-complete** - Covers the entire epic scope
- **Not story-level** - Higher level than individual stories

## PRD Coverage Matrix

Track which FRs are covered:

```markdown
### PRD Coverage

| FR ID | Requirement | Covered | Story |
|-------|-------------|---------|-------|
| FR-001 | Product creation | ✅ | S05-01 |
| FR-002 | Product validation | ✅ | S05-02 |
| FR-003 | Product search | ⏳ | S05-05 |
```

## Epic → Story → Task Hierarchy

### Decomposition Rules (MANDATORY)

```
EPIC (1-2 weeks)
  └── STORY (1-3 days)
        └── TASK (1-2 hours)
```

| Level | Duration | Count | Deliverable |
|-------|----------|-------|-------------|
| **Epic** | 1-2 weeks | 1 | Complete feature |
| **Story** | 1-3 days | 3-8 per epic | User-facing capability |
| **Task** | 1-2 hours | 4-10 per story | Atomic code change |

### Story Decomposition Pattern

Break epic into stories by **architectural layer**:

```markdown
## Stories

| # | Layer | Story | Est | Tasks |
|---|-------|-------|-----|-------|
| S01 | Domain | Aggregates & Value Objects | M | 6 |
| S02 | Domain | Repository Interfaces | S | 3 |
| S03 | Application | Use Cases | M | 8 |
| S04 | Infrastructure | Repository Implementations | M | 6 |
| S05 | Infrastructure | HTTP Handlers | S | 5 |
| S06 | Infrastructure | Event Publishers | S | 4 |
| S07 | Testing | Integration Tests | S | 4 |
```

### Story Dependency Graph

Visualize story dependencies:

```
S01 (Domain) ──┬──► S02 (Repo Interface) ──► S04 (Repo Impl)
               │                                    │
               └──► S03 (Use Cases) ──► S05 (HTTP) ─┴──► S06 (Events) ──► S07 (Tests)
```

### Total Effort Calculation

```markdown
### Effort Summary

| Story | Tasks | Hours | Days |
|-------|-------|-------|------|
| S01 | 6 | 8h | 1d |
| S02 | 3 | 4h | 0.5d |
| S03 | 8 | 12h | 1.5d |
| S04 | 6 | 9h | 1d |
| S05 | 5 | 7h | 1d |
| S06 | 4 | 5h | 0.5d |
| S07 | 4 | 6h | 1d |
| **Total** | **36** | **51h** | **6.5d** |

**Parallel Opportunities:** S02+S03, S04+S05
**With Parallelism:** ~5 days
```

## Epic Sizing

### Guidelines

- **Duration:** 1-2 weeks of work
- **Stories:** 3-8 stories per epic
- **Tasks:** 25-60 tasks per epic (total across stories)
- **Scope:** One logical feature/capability

### Too Big? Split it!

Signs an epic is too big:
- More than 10 stories
- More than 80 tasks total
- Spans multiple sprints
- Multiple unrelated features
- Different team members for different parts

### Too Small? Merge it!

Signs an epic is too small:
- Only 1-2 stories
- Less than 15 tasks
- Can be done in 2-3 days
- Part of a larger feature

### Parallel Execution Opportunities

Identify which stories can run in parallel:

```markdown
### Execution Phases

| Phase | Stories (Parallel) | Duration |
|-------|-------------------|----------|
| 1 | S01 | 1d |
| 2 | S02, S03 | 1.5d |
| 3 | S04, S05 | 1d |
| 4 | S06 | 0.5d |
| 5 | S07 | 1d |
| **Total** | | **5d** |

**Sequential would be:** 6.5d
**Savings from parallelism:** 1.5d (23%)
```

## Dependencies

### Documenting Dependencies

```markdown
### Dependencies

**Requires (must complete first):**
- CATALOG-E01: Data layer must exist before domain
- CATALOG-E02: Domain types needed for repository

**Enables (unlocks these):**
- CATALOG-E10: Search requires products to exist
- INVENTORY-E01: Inventory needs product IDs
```

### Dependency Rules

1. Dependencies form a DAG (no cycles!)
2. Sprint planning respects dependencies
3. Blocked epics cannot start

## Directory Structure

```
docs/sprint-artifacts/
├── backlog/
│   └── epic-10-search-integration.md  # Not yet scheduled
├── sprint-0/
│   ├── epic-01-data-layer.md         # Completed
│   └── stories/
├── sprint-1/
│   ├── epic-05-products-service.md   # Current
│   └── stories/
```

## Validation Checklist

Before completing epic:
- [ ] Epic ID is unique
- [ ] Branch name follows convention
- [ ] PRD coverage is documented
- [ ] Dependencies are identified
- [ ] Architecture references included
- [ ] **Acceptance criteria present** (MANDATORY!)
- [ ] Stories table is complete
- [ ] Estimate is reasonable (1-2 weeks)

## Output

Save to: `docs/sprint-artifacts/sprint-[N]/epic-[NN]-[module]-[description].md`

## Related Skills

- `story-writing` - For creating stories within epic
- `acceptance-criteria` - For writing AC
- `sprint-planning` - For organizing epics into sprints
- `jira-integration` - For syncing to Jira
