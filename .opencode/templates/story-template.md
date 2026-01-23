---
stepsCompleted: []
inputDocuments: []
workflowType: 'story'
---

# Story {{epic_number}}.{{story_number}}: {{story_title}}

**Story ID:** {{module}}-S{{epic_number}}-{{story_number}}
**Epic:** {{module}}-E{{epic_number}} - {{epic_title}}
**Status:** draft | ready-for-dev | in-progress | review | done
**Size:** XS | S | M | L | XL

---

## Prerequisites (PM reads before writing tasks)

<!-- ⚠️ MANDATORY: Read these docs before writing tasks! -->

- [ ] `AGENTS.md` / `CLAUDE.md` - coding patterns, naming, error handling
- [ ] `docs/coding-standards/` - detailed coding standards
- [ ] `docs/architecture/{{module}}/` - module architecture, data model
- [ ] Existing code in `src/services/{{module}}/` - patterns to follow

---

## Goal

{{Short description - 1-2 sentences. What this story achieves. Same as in epic's stories table.}}

---

## Acceptance Criteria

- [ ] {{criterion_1}}
- [ ] {{criterion_2}}
- [ ] {{criterion_3}}
- [ ] All tests pass
- [ ] No linting errors

---

## Tasks

| ID | Task | Deps | Status |
|----|------|------|--------|
| T1 | {{task_1_name}} | - | ⬜ |
| T2 | {{task_2_name}} | T1 | ⬜ |
| T3 | {{task_3_name}} | T2 | ⬜ |

**Status:** ⬜ TODO | 🔄 IN_PROGRESS | ✅ DONE | ⏸️ BLOCKED

---

### T1: {{task_1_name}}

**Goal:** {{what_this_task_achieves}}

**Documentation:**
- [AGENTS.md#section](../../../AGENTS.md#section) - {{what_pattern}}
- [data-model.md#table](../../../docs/data-model.md#section) - {{schema_info}}
- [existing_example.go](../path/to/example.go) - Pattern to follow

**Input (Prerequisites):**
- {{what_must_exist_before_starting}}
- Existing file: `path/to/dependency.go` - provides {{what}}

**Output (Deliverables):**
- `path/to/new_file.go` - {{description}}
- `path/to/new_file_test.go` - Tests for {{what}}

**Implementation Steps:**
1. Read documentation links above
2. {{step_2}}
3. {{step_3}}
4. Write tests covering: happy path, errors, edge cases
5. Run: `go test ./path/to/...`

**Acceptance Criteria:**
- [ ] Files created at specified paths
- [ ] Follows patterns from AGENTS.md
- [ ] Tests pass: `go test ./path/to/...`
- [ ] Lint passes: `golangci-lint run`

**Notes:** {{additional_context_or_gotchas}}

---

### T2: {{task_2_name}}

**Goal:** {{what_this_task_achieves}}

**Documentation:**
- [AGENTS.md#section](link) - {{pattern}}
- [T1 output](../path/from/T1) - Uses types from T1

**Input (Prerequisites):**
- T1 completed
- Files from T1: `path/to/aggregate.go`

**Output (Deliverables):**
- `path/to/file.go` - {{description}}
- `path/to/file_test.go` - Tests

**Implementation Steps:**
1. {{step}}
2. {{step}}

**Acceptance Criteria:**
- [ ] {{criterion}}
- [ ] Tests pass

**Notes:** {{notes}}

---

### T3: {{task_3_name}}

**Goal:** {{goal}}

**Documentation:**
- {{links}}

**Input (Prerequisites):**
- T2 completed
- {{dependencies}}

**Output (Deliverables):**
- {{files}}

**Implementation Steps:**
1. {{steps}}

**Acceptance Criteria:**
- [ ] {{criteria}}
- [ ] All tests pass
- [ ] **⚠️ NO REGRESSIONS** (run full test suite)

**Notes:** {{notes}}

---

## Notes

<!-- Optional: additional context, learnings, blockers -->

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] All tasks completed
- [ ] Tests passing (>80% coverage)
- [ ] Code follows AGENTS.md patterns
- [ ] No linting errors
- [ ] PR merged to epic branch

---

## Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | {{date}} | @pm | Story created |

<!-- 
Changelog Guidelines:
- Update at END of work session
- Dev: summarize what was implemented
- Version: 0.x=draft, 1.0=ready-for-dev, 1.x=in-progress, 2.0=done
-->

---

## Jira Metadata

```yaml
# Added after /jira-sync
jira_id: 
jira_url: 
last_sync: 
```
