---
name: story-writing
description: Use when writing user stories with tasks, subtasks, and acceptance criteria
license: MIT
compatibility: opencode
metadata:
  domain: agile
  artifacts: docs/sprint-artifacts/*/stories/story-*.md
---

# Story Writing Skill

## When to Use

Use this skill when you need to:
- Create stories from epics
- Write detailed acceptance criteria
- Define technical implementation tasks
- Specify test scenarios

## Template

Use template at: `@.opencode/skills/story-writing/template.md`

## CRITICAL: Story Depth by Project Size

**Read PRD's Project Classification to understand appropriate depth!**

| Project Size | Story Depth | AC Detail | Tasks | Example |
|--------------|-------------|-----------|-------|---------|
| **TOY** | Simple | Basic Given/When/Then | 1-3 tasks, no subtasks | "Implement block rotation" |
| **SMALL** | Moderate | Given/When/Then + edge cases | 2-5 tasks, optional subtasks | "User can create post" |
| **MEDIUM** | Detailed | Comprehensive Given/When/Then | 3-8 tasks, subtasks recommended | "Customer can place order" |
| **LARGE** | Comprehensive | All scenarios + edge cases | 5-10 tasks, subtasks required | "Process payment with retry logic" |
| **ENTERPRISE** | Exhaustive | All scenarios + compliance | 8-15 tasks, subtasks + estimates | "Execute trade with audit trail" |

**Key differences:**

**TOY/SMALL:**
- Simple AC: "Given block at top, When user presses rotate, Then block rotates 90°"
- Tasks are straightforward: "Add rotation logic", "Add tests"
- No Required Reading section needed (no coding standards yet)

**MEDIUM:**
- Detailed AC with edge cases: "Given order with out-of-stock item, When customer submits, Then show error"
- Tasks reference coding standards and Unit docs
- Required Reading section mandatory

**LARGE/ENTERPRISE:**
- Exhaustive AC with compliance: "Given payment failure, When retry limit reached, Then log to audit, notify customer, update order status"
- Tasks include security considerations
- Multiple review stages

## MANDATORY: Read Before Writing

**Before writing ANY story, read these documents:**

| Document | Why |
|----------|-----|
| → `CLAUDE.md` | Project patterns, conventions |
| → `docs/coding-standards/` | **MANDATORY** code style |
| → Unit docs for affected units | Data models, operations |
| → Parent epic | Context, decisions |

## Story Structure (v2)

### 1. Header

```yaml
id: {{PREFIX}}-S{{E}}-{{N}}
epic: {{PREFIX}}-E{{E}}
status: draft | ready | in_progress | review | done
size: S | M | L   # Prefer S→M or M. S=2-4 tasks, M=4-8 tasks, L=8+ tasks
```

### 2. Goal

One sentence + context + out of scope:

```markdown
## Goal

Implement CRUD operations for Task entity.

**Context:** Part of Epic 1 (Task Management). Focuses on domain layer.

**Out of Scope:**
- HTTP handlers (separate story)
```

### 3. Units Affected

| Unit | Action | Description |
|------|--------|-------------|
| → Unit: `Task` | Create | New entity |

### 4. Required Reading

**CRITICAL SECTION** - List all docs developer must read:

| Document | Section | Why |
|----------|---------|-----|
| → `CLAUDE.md` | All | Project patterns |
| → `docs/coding-standards/` | All | **MANDATORY** |
| → Unit: `Task` | Data Model | Field definitions |
| → `docs/architecture.md` | Task Module | Structure |

### 5. Acceptance Criteria

Checklist format:
- [ ] User can create task
- [ ] Validation errors return proper codes
- [ ] Tests pass
- [ ] Follows coding-standards

### 6. Tasks

Summary table + detailed tasks.

### 7. Definition of Done

- [ ] All AC met
- [ ] Code follows `docs/coding-standards/`
- [ ] Tests pass
- [ ] Code reviewed

## No Code in Stories

**Stories are specifications, not implementations.**

✅ **Task provides:**
- Goal (what to achieve)
- Read First (where to find patterns)
- Output Files (what to create)
- Approach (high-level steps)
- Done When (how to verify)

❌ **Task does NOT provide:**
- Code Sketch with implementation
- Ready-to-copy code blocks
- Full method bodies

**@coder writes the code.** Story defines WHAT, not HOW.

## Task Structure (MANDATORY)

Each task MUST be self-contained:

```markdown
### T1: {{task_name}}

**Goal:** {{what_this_achieves}}

**Read First:**
| Document | Section | What to Look For |
|----------|---------|------------------|
| → `docs/coding-standards/` | Domain Layer | Entity patterns |
| → Unit: `Task` | Data Model | All fields |
| → `path/to/example.go` | Example | Similar code |

**Output Files:**
- `path/to/file.go`
- `path/to/file_test.go`

**Approach:**
1. Read documentation above
2. Create file following pattern
3. Write tests

**Done when:**
- [ ] Files created
- [ ] Follows coding-standards
- [ ] Tests pass
```

## Reference Format

Always use `→` prefix:

```markdown
→ Unit: `Task`
→ `docs/coding-standards/`
→ `internal/user/domain/user.go`
```

**In Required Reading table:**
```markdown
| → `docs/coding-standards/` | Validation | How to validate |
| → Unit: `Task` | Data Model | All fields |
```

**In task Read First:**
```markdown
| → `docs/coding-standards/` | Domain Layer | Entity patterns |
```

## Why Required Reading?

| Problem | Solution |
|---------|----------|
| Developer doesn't know patterns | → `docs/coding-standards/` |
| Developer doesn't know data model | → Unit: `Entity` |
| Developer doesn't know project conventions | → `CLAUDE.md` |
| AI agent needs context | All docs linked explicitly |

## Task Dependencies

Show in summary table and diagram:

```markdown
| ID | Task | Deps | Status |
|----|------|------|--------|
| T1 | Domain Model | - | ⬜ |
| T2 | Repository | T1 | ⬜ |
| T3 | Use Cases | T1, T2 | ⬜ |
```

```
T1 ──► T2 ──► T3
```

## Validation Checklist

- [ ] Goal is 1-2 sentences
- [ ] Units affected listed with `→ Unit:` format
- [ ] Required Reading includes coding-standards
- [ ] Each task has "Read First" section
- [ ] Each task references coding-standards
- [ ] Tasks are self-contained
- [ ] Definition of Done includes coding-standards check

## Output

Save to: `docs/sprint-artifacts/sprint-[N]/stories/story-[EPIC]-[NN]-[description].md`

## Related Skills

- `acceptance-criteria` - For detailed AC
- `epic-writing` - For parent epic
- `unit-writing` - For unit documentation
- `coding-standards` - Referenced in every story
