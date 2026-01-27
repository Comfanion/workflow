# Story {{E}}.{{N}}: {{title}}

```yaml
id: {{PREFIX}}-S{{E}}-{{N}}
epic: {{PREFIX}}-E{{E}}
status: draft | ready | in_progress | review | done
size: S | M | L
```

---

## Goal

{{one_sentence_describing_what_user_or_system_can_do_after_this}}

**Context:** This story is part of Epic {{E}} ({{epic_title}}). It focuses on {{specific_aspect}}.

**Out of Scope:**
- {{what_this_story_does_NOT_do}}

<!-- e.g.
Implement CRUD operations for Task entity following project architecture.

**Context:** This story is part of Epic 1 (Task Management Core). It focuses on the domain layer and repository.

**Out of Scope:**
- HTTP handlers (separate story)
- Notifications (separate epic)
-->

---

## Units Affected

| Unit | Action | Description |
|------|--------|-------------|
| → Unit: `{{unit}}` | Create | {{what_is_created}} |
| → Unit: `{{unit}}` | Modify | {{what_changes}} |

---

## Required Reading

**Before starting, read these documents:**

| Document | Section | Why |
|----------|---------|-----|
| → `CLAUDE.md` | All | Project patterns, conventions |
| → `docs/coding-standards/` | All | **MANDATORY** — code style, patterns |
| → Unit: `{{unit}}` | Data Model | Field definitions, constraints |
| → `docs/architecture.md` | {{module}} Module | Service structure, events |
| → Epic: `{{epic_path}}` | Technical Decisions | ADRs for this epic |

<!-- e.g.
| → `AGENTS.md` | All | Project patterns, naming |
| → `docs/coding-standards/` | All | **MANDATORY** — architecture, error handling |
| → Unit: `Task` | Data Model, Operations | Fields, validation rules |
| → `docs/architecture.md` | Task Module | Internal services, events |
| → `docs/architecture.md#error-handling` | Error Handling | Error codes format |
-->

---

## Acceptance Criteria

Story is complete when:
- [ ] {{user_can_or_system_does}}
- [ ] {{edge_case_handled}}
- [ ] {{error_case_handled}}
- [ ] Tests pass (unit + integration)
- [ ] Follows coding-standards
- [ ] No lint errors

<!-- e.g.
- [ ] User can create task with title and description
- [ ] Empty title returns validation error (400, TASK_001)
- [ ] Task ID is UUID format
- [ ] Tests cover: create, validation, duplicate handling
- [ ] Code follows architecture patterns from coding-standards
-->

---

## Tasks

| # | Task | Output | Status |
|---|------|--------|--------|
| T1 | {{task}} | `{{file_path}}` | ⬜ |
| T2 | {{task}} | `{{file_path}}` | ⬜ |
| T3 | {{task}} | `{{file_path}}` | ⬜ |

---

### T1: {{task_name}}

**Goal:** {{what_this_achieves}}

**Read First:**
| Document | Section | What to Look For |
|----------|---------|------------------|
| → `docs/coding-standards/` | Naming | Struct/method naming |
| → `docs/coding-standards/` | Validation | Validation patterns |
| → Unit: `{{unit}}` | Data Model | All fields and types |
| → `{{existing_code_path}}` | Example | Similar implementation |

**Output Files:**
- `{{path/to/file}}`
- `{{path/to/file}}_test.go`

**Approach:**
1. {{step}}
2. {{step}}
3. Write tests: {{test_cases}}

**Done when:**
- [ ] {{specific_criterion}}
- [ ] Follows patterns from coding-standards
- [ ] Tests pass

<!-- e.g.
### T1: Domain Model

**Goal:** Define Task entity with validation logic

**Read First:**
| Document | Section | What to Look For |
|----------|---------|------------------|
| → `docs/coding-standards/` | Domain Layer | Entity patterns |
| → `docs/coding-standards/` | Validation | How to validate |
| → `docs/coding-standards/` | Errors | Error types, codes |
| → Unit: `Task` | Data Model | All fields |
| → `internal/user/domain/user.go` | Example | Similar entity |

**Output Files:**
- `internal/task/domain/task.go`
- `internal/task/domain/task_test.go`

**Approach:**
1. Create Task struct with fields from Unit doc
2. Add NewTask() constructor with validation
3. Add Validate() method
4. Write tests: valid task, empty title, invalid status

**Done when:**
- [ ] Task struct matches Unit data model
- [ ] Validation follows coding-standards patterns
- [ ] Error codes match architecture.md#error-handling
- [ ] Tests cover happy path + all error cases
-->

---

### T2: {{task_name}}

**Goal:** {{what_this_achieves}}

**Depends on:** T1

**Read First:**
| Document | Section | What to Look For |
|----------|---------|------------------|
| → `docs/coding-standards/` | Repository | Interface patterns |
| → `docs/coding-standards/` | Database | SQLC usage |
| → `{{similar_repo_path}}` | Example | Query patterns |

**Output Files:**
- `{{path}}`

**Approach:**
1. {{step}}
2. {{step}}

**Done when:**
- [ ] {{criterion}}
- [ ] Uses SQLC per coding-standards

---

### T3: {{task_name}}

**Goal:** {{what_this_achieves}}

**Depends on:** T1, T2

**Read First:**
| Document | Section | What to Look For |
|----------|---------|------------------|
| → `docs/coding-standards/` | Use Cases | Handler patterns |
| → `docs/coding-standards/` | Testing | Test structure |

**Output Files:**
- `{{path}}`

**Done when:**
- [ ] {{criterion}}
- [ ] Integration tests pass

---

## Notes

- {{important_implementation_detail}}
- {{gotcha_or_warning}}

---

## Security Checklist

Before marking story as done, verify:

- [ ] **Input Validation**: All user inputs validated/sanitized
- [ ] **Authentication**: Protected endpoints require auth
- [ ] **Authorization**: User can only access their own data
- [ ] **Secrets**: No hardcoded passwords, tokens, API keys
- [ ] **SQL Injection**: Using parameterized queries / ORM
- [ ] **XSS**: Output properly escaped (if frontend)
- [ ] **Sensitive Data**: PII/secrets not logged
- [ ] **Error Messages**: No sensitive info in error responses

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] All tasks completed
- [ ] Security checklist passed
- [ ] Code follows `docs/coding-standards/`
- [ ] Tests pass
- [ ] Code reviewed
- [ ] No lint errors

---

## Review

<!-- Reviewer (@reviewer) appends review rounds here. DO NOT edit manually.
     Each review is appended as ### Review #N with verdict and action items.
     History is preserved for analytics. -->
