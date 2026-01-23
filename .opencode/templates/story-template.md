---
stepsCompleted: []
inputDocuments: []
workflowType: 'story'
---

# Story {{epic_number}}.{{story_number}}: {{story_title}}

**Story ID:** {{module}}-S{{epic_number}}-{{story_number}}
**Epic:** {{module}}-E{{epic_number}} - {{epic_title}}
**Status:** draft | ready-for-dev | in-progress | review | done | blocked
**Priority:** P0 | P1 | P2
**Size:** XS | S | M | L | XL
**Created:** {{date}}
**Last Updated:** {{date}}

---

## User Story

**As a** {{user_type}},
**I want** {{capability}},
**So that** {{benefit}}.

---

## Acceptance Criteria

### AC1: {{criterion_name}}

**Given** {{precondition}}
**When** {{action}}
**Then** {{expected_result}}
**And** {{additional_check}}

### AC2: {{criterion_name}}

**Given** {{precondition}}
**When** {{action}}
**Then** {{expected_result}}

### AC3: {{criterion_name}}

**Given** {{precondition}}
**When** {{action}}
**Then** {{expected_result}}

---

## Self-Contained Tasks

<!-- 
Each task MUST be self-contained:
- Agent can execute WITHOUT asking questions
- All documentation links provided
- Clear input/output/acceptance criteria
-->

### Tasks Summary

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

## TODO Placeholders

<!-- 
When implementing, leave TODO comments for:
- Next tasks in this story
- Future stories/epics
- Technical debt
- Planned improvements

Format: TODO({TYPE}:{ID}): {description}
-->

### TODOs to Create During Implementation

| Location | TODO | Type | Reference |
|----------|------|------|-----------|
| `src/domain/{{entity}}` | Add validation for X | TASK | T3 |
| `src/application/{{usecase}}` | Add caching | STORY | S{{epic}}-04 |
| `src/infrastructure/repo/` | Add batch operations | EPIC | E{{next_epic}} |
| `src/api/` | Add rate limiting | BACKLOG | - |

### TODO Format Reference (IDE-compatible)

```go
// TODO(TASK:T3): Implement validation logic here
//   Called from: T2 implementation
//   Blocked until: T3 starts

// TODO(STORY:{{module}}-S05-04): Add pagination support
//   This story implements basic list, pagination in next story
//   See: docs/sprint-artifacts/sprint-1/stories/story-05-04.md

// TODO(EPIC:{{module}}-E06): Replace with event-driven approach
//   Current sync implementation, async in Epic 6
//   See: docs/sprint-artifacts/backlog/epic-06.md

// TODO(SPRINT:SP3): Performance optimization needed
//   Current O(n²), optimize in Sprint 3

// TODO(BACKLOG): Consider adding retry logic
//   Not planned yet, but would improve reliability

// TODO(TECH_DEBT): Refactor this duplication
//   Copy-pasted from X, extract common logic

// FIXME(BUG:GH-123): Fix null pointer exception
//   Occurs when input is empty
//   Ticket: https://github.com/org/repo/issues/123

// HACK: Temporary workaround for API limitation
//   Remove when: STORY:{{module}}-S05-08 implemented
```

**GoLand/IntelliJ Setup:**
```
Settings → Editor → TODO → Add Pattern:
  \bTODO\(.*\):.*
  \bFIXME\(.*\):.*
  \bHACK:.*
```

### Related Future Work

| ID | Type | Description | Blocks This? |
|----|------|-------------|--------------|
| T3 | Task | Validation logic | No |
| S{{epic}}-04 | Story | Pagination | No |
| E{{next_epic}} | Epic | Event-driven | No |

---

## Dev Notes

<!-- Context for the developer implementing this story -->

### Coding Standards Applied (MANDATORY)

**Standards documents used for this story:**
- [ ] `CLAUDE.md` - Project patterns, file structure, conventions
- [ ] `docs/coding-standards/` - Detailed coding standards
  - [ ] Naming conventions
  - [ ] Error handling patterns
  - [ ] Testing patterns
- [ ] `docs/architecture/{{module}}/architecture.md` - Module-specific patterns

**Key patterns from CLAUDE.md:**
- File naming: `{{file_naming_pattern}}`
- Package structure: `{{package_structure}}`
- Error handling: `{{error_handling_pattern}}`
- Test file naming: `{{test_naming_pattern}}`

### Architecture Requirements
- Follow hexagonal architecture patterns
- Domain layer must not import infrastructure
- Use value objects for domain concepts

### Technical Specifications
- {{technical_specs}}

### Dependencies
- Depends on: {{dependencies}}
- Blocked by: {{blockers}}

### Previous Learnings
- {{learnings_from_similar_work}}

### Reference Files
- `src/path/to/related/file` - [why relevant]
- `docs/architecture.md#section` - [architecture guidance]
- `CLAUDE.md#section` - [coding patterns]

### Patterns to Follow
- **MANDATORY:** Follow patterns from `CLAUDE.md`
- **MANDATORY:** Follow `docs/coding-standards/`
- Match existing code style in module

### API/Interface
```
// Expected interface or function signature
// (language-specific syntax)
```

---

## Test Scenarios

### Unit Tests
1. {{test_scenario_1}}
2. {{test_scenario_2}}
3. {{edge_case_1}}

### Integration Tests
1. {{integration_scenario_1}}
2. {{integration_scenario_2}}

---

## Dev Agent Record

<!-- Automatically updated by Dev agent during implementation -->

### Implementation Plan
<!-- Dev agent documents approach here -->

### Debug Log
<!-- Dev agent logs debugging notes here -->

### Completion Notes
<!-- Dev agent summarizes what was implemented -->

---

## File List

<!-- Dev agent updates with all changed files -->

### Created Files
- 

### Modified Files
- 

### Deleted Files
- 

---

## Changelog

<!-- UPDATE AT END OF SESSION -->

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | {{date}} | @sm | Story created |

<!-- 
Changelog Guidelines:
- Update at END of work session
- Dev: summarize what was implemented
- Version: 0.x=draft, 1.0=ready-for-dev, 1.x=in-progress, 2.0=done

Example session entries:
| 2.0 | 2024-01-25 | @dev | Complete: T1-T7 done; All tests pass; Ready for review |
| 1.1 | 2024-01-23 | @dev | Progress: T1-T4 complete; T5 blocked by API issue |
| 1.0 | 2024-01-20 | @sm | Ready for dev: 7 tasks defined; AC reviewed |
-->

---

## Definition of Done

- [ ] All acceptance criteria implemented and verified
- [ ] All tasks/subtasks marked complete [x]
- [ ] Unit tests written and passing (>80% coverage)
- [ ] Integration tests written and passing
- [ ] Code follows CLAUDE.md patterns
- [ ] Code reviewed and approved
- [ ] No linting errors
- [ ] No failing tests (full suite)
- [ ] File List complete
- [ ] Change Log updated
- [ ] PR merged to epic branch

---

## Senior Developer Review (AI)

<!-- Added after code-review workflow runs -->

### Review Date
<!-- Date of review -->

### Review Outcome
<!-- Approve | Changes Requested | Blocked -->

### Action Items
- [ ] {{action_item_1}}
- [ ] {{action_item_2}}

### Review Follow-ups (AI)
<!-- Tasks added based on review findings -->

---

## Jira Metadata

```yaml
# Added after /jira-sync
jira_id: 
jira_url: 
last_sync: 
```
