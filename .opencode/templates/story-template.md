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
**Estimate:** XS | S | M | L | XL
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

## Atomic Tasks

<!-- 
METHODOLOGY: {{methodology}} (tdd | stub)
- TDD:  Interface → Test (failing) → Implementation → Refactor
- STUB: Interface → Stub → Test → Full Implementation

RULES:
- Each task is 4-6 hours of focused work
- Each task includes TEST as validation gate
- Tasks have explicit dependencies
- Dev agent respects dependency order
-->

### Development Methodology: **{{methodology}}**

```
{{#if methodology == "tdd"}}
TDD Flow per Task:
  1. Define Interface/Contract
  2. Write Failing Test (RED)
  3. Implement Minimal Code (GREEN)
  4. Refactor
  5. Validate: Test MUST pass
{{/if}}
{{#if methodology == "stub"}}
STUB Flow per Task:
  1. Define Interface/Contract
  2. Write Stub Implementation (returns mock data)
  3. Write Tests against Stub
  4. Replace Stub with Real Implementation
  5. Validate: Test MUST pass
{{/if}}
```

---

### Task Dependency Graph

```
T1 ──┬──► T2 ──► T3
     │
     └──► T4 ──► T5
                  │
T3 ───────────────┴──► T6
```

### Tasks Summary

| ID | Task | Est | Deps | Test | Status |
|----|------|-----|------|------|--------|
| T1 | {{task_1}} | 5h | - | unit | ⬜ |
| T2 | {{task_2}} | 6h | T1 | unit | ⬜ |
| T3 | {{task_3}} | 5h | T2 | unit | ⬜ |
| T4 | {{task_4}} | 5h | T1 | unit | ⬜ |
| T5 | {{task_5}} | 5h | T3,T4 | integration | ⬜ |

**Status:** ⬜ TODO | 🔄 IN_PROGRESS | ✅ DONE | ⏸️ BLOCKED | ❌ FAILED

---

### T1: Domain Layer (Aggregates, Value Objects)
- **Estimate:** 6h
- **Depends on:** -
- **Blocks:** T2
- **Deliverables:**
  - [ ] Interface/contract defined
  - [ ] Value objects with validation
  - [ ] Aggregate with business rules
  - [ ] Factory methods
- **Validation Test:** 
  - [ ] Value object tests (validation, equality)
  - [ ] Aggregate creation tests
  - [ ] Business rules tests
  - [ ] **⚠️ ALL TESTS MUST PASS**
- **Notes:** {{implementation_hint}}

---

### T2: Repository Interface + Use Case Tests
- **Estimate:** 5h
- **Depends on:** T1
- **Blocks:** T3, T4
- **Deliverables:**
  - [ ] Repository interface (ports)
  - [ ] Use case interface
  - [ ] Use case DTOs (input/output)
  - [ ] Use case tests (with mock repository)
- **Validation Test:**
  - [ ] Use case happy path test
  - [ ] Use case error handling tests
  - [ ] **⚠️ ALL TESTS MUST PASS**
- **Notes:** {{implementation_hint}}

---

### T3: Use Case Implementation
- **Estimate:** 5h
- **Depends on:** T2
- **Blocks:** T5
- **Deliverables:**
  - [ ] Use case handler implementation
  - [ ] Mappers (entity ↔ DTO)
  - [ ] Error handling
- **Validation Test:**
  - [ ] All use case tests pass
  - [ ] Edge cases covered
  - [ ] **⚠️ ALL TESTS MUST PASS**
- **Notes:** {{implementation_hint}}

---

### T4: Repository Implementation
- **Estimate:** 6h
- **Depends on:** T2
- **Blocks:** T5
- **Deliverables (TDD):**
  - [ ] Write repository tests first
  - [ ] PostgreSQL repository implementation
- **Deliverables (STUB):**
  - [ ] In-memory stub first
  - [ ] PostgreSQL implementation
- **Validation Test:**
  - [ ] Test Save
  - [ ] Test FindByID (found/not found)
  - [ ] Test List with filters
  - [ ] **⚠️ ALL TESTS MUST PASS**
- **Notes:** {{implementation_hint}}

---

### T5: HTTP Handlers + Integration Tests
- **Estimate:** 5h
- **Depends on:** T3, T4
- **Blocks:** -
- **Deliverables:**
  - [ ] HTTP handler/controller
  - [ ] Routes registered
  - [ ] Request/response validation
  - [ ] Integration tests
  - [ ] Documentation updated
- **Validation Test:**
  - [ ] Test 201 Created
  - [ ] Test 400 Bad Request (validation)
  - [ ] Test 404 Not Found
  - [ ] E2E: API → Service → Repo → DB
  - [ ] **⚠️ ALL TESTS MUST PASS**
  - [ ] **⚠️ NO REGRESSIONS**
- **Notes:** {{implementation_hint}}

---

### Execution Phases

| Phase | Tasks (Parallel) | Duration | Tests Required |
|-------|-----------------|----------|----------------|
| 1 | T1 | 6h | Domain layer tests |
| 2 | T2 | 5h | Use case tests |
| 3 | T3, T4 | 6h | Implementation tests |
| 4 | T5 | 5h | Integration tests |
| **Total** | | **22h** | **All green** |

**Critical Path:** T1 → T2 → T3 → T5 = 21h (~3 days)
**With Parallelism (T3 || T4):** ~2.5 days

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
