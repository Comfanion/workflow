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

## MANDATORY: Read Before Writing Epic

**⚠️ STOP! Before writing ANY epic, execute these steps:**

### Step 1: Find and Read Project Standards

```bash
# Execute these Glob searches:
Glob "**/AGENTS.md" OR "**/CLAUDE.md"       # → Read the file found
Glob "**/docs/architecture.md"              # → Read system architecture
Glob "**/coding-standards/**/*.md"          # → Read ALL coding standards
```

**You MUST read these files before writing epic!**

### Step 2: Find and Read Module Documentation

```bash
# For the module this epic covers (e.g., "catalog"):
Glob "**/docs/**/catalog/**/*.md"           # → Read ALL module docs
Glob "**/catalog-data-model*.md"            # → Read data model
Glob "**/catalog-architecture*.md"          # → Read module architecture
```

### Step 3: Find and Read PRD

```bash
Glob "**/prd.md"                            # → Read PRD for FR-XXX references
Glob "**/requirements/*.md"                 # → Read detailed requirements if exist
```

### Step 4: Find Existing Code Patterns (for technical notes)

```bash
# Find existing code to reference in Technical Notes:
Glob "**/src/services/[module]/modules/*/domain/**/*.go"       # → Domain patterns
Glob "**/src/services/[module]/modules/*/application/**/*.go"  # → Use case patterns
```

### Pre-Epic Checklist

Before writing epic, confirm you executed:
- [ ] **Glob + Read** AGENTS.md/CLAUDE.md
- [ ] **Glob + Read** docs/architecture.md
- [ ] **Glob + Read** coding-standards/*.md (ALL files)
- [ ] **Glob + Read** module documentation (architecture, data-model)
- [ ] **Glob + Read** PRD for requirements
- [ ] **Glob** existing code patterns (for Technical Notes section)

**⛔ DO NOT WRITE EPIC WITHOUT COMPLETING ALL STEPS ABOVE!**
**Epic without proper architecture references = REJECTED.**

---

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
  └── STORY (2-5 days)
        └── TASK (4-6 hours)
```

| Level | Duration | Count | Deliverable |
|-------|----------|-------|-------------|
| **Epic** | 1-2 weeks | 1 | Complete feature |
| **Story** | 2-5 days | 3-8 per epic | User-facing capability |
| **Task** | 4-6 hours | 3-6 per story | Atomic code change with tests |

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

### Story Breakdown

```markdown
### Stories Summary

| Story | Tasks | Size | Deps |
|-------|-------|------|------|
| S01 | 4 | M | - |
| S02 | 3 | S | S01 |
| S03 | 5 | L | S01 |
| S04 | 4 | M | S02 |
| S05 | 3 | S | S03 |
| S06 | 3 | S | S04 |
| S07 | 3 | S | S05,S06 |
| **Total** | **25** | | |

**Parallel Opportunities:** S02+S03, S04+S05
```

**Note:** No hour estimates. Use T-shirt sizes (XS/S/M/L/XL) for relative complexity.

## Epic Sizing

### Guidelines

- **Duration:** 1-2 weeks of work
- **Stories:** 3-8 stories per epic
- **Tasks:** 15-35 tasks per epic (total across stories)
- **Scope:** One logical feature/capability

### Too Big? Split it!

Signs an epic is too big:
- More than 10 stories
- More than 40 tasks total
- Spans multiple sprints
- Multiple unrelated features
- Different team members for different parts

### Too Small? Merge it!

Signs an epic is too small:
- Only 1-2 stories
- Less than 8 tasks
- Can be done in 3-4 days
- Part of a larger feature

### Parallel Execution Opportunities

Identify which stories can run in parallel:

```markdown
### Execution Phases

| Phase | Stories (Parallel) | Duration |
|-------|-------------------|----------|
| 1 | S01 | 2.5d |
| 2 | S02, S03 | 3d |
| 3 | S04, S05 | 3d |
| 4 | S06 | 2d |
| 5 | S07 | 2d |
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
