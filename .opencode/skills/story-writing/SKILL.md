---
name: story-writing
description: How to write user stories with proper format, acceptance criteria in Given/When/Then, and technical tasks
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

## MANDATORY: Load Technical Standards First

**Before writing ANY story with tasks, you MUST read and understand:**

### 1. Coding Standards (REQUIRED)
```
Search and read in order:
1. CLAUDE.md (root) - Project patterns, code style, conventions
2. docs/coding-standards/ - Detailed coding standards
3. docs/coding-standards/testing-standards.md - Test patterns
```

### 2. Module Architecture (REQUIRED)
```
For the specific module this story covers:
1. docs/architecture/[module]/architecture.md - Module design
2. docs/architecture/[module]/data-model.md - Database schema
3. Existing code in src/services/[module]/ - Current patterns
```

### 3. Parent Epic (REQUIRED)
```
1. The epic this story belongs to - for context and dependencies
2. Other stories in the epic - for coordination
```

### Pre-Story Checklist

Before writing story tasks, confirm you have read:
- [ ] CLAUDE.md - coding patterns and file structure
- [ ] Coding standards - naming, error handling, testing
- [ ] Module architecture - component boundaries
- [ ] Parent epic - scope and dependencies

**⚠️ DO NOT write technical tasks without reading coding standards!**
**Tasks MUST follow project conventions and patterns from CLAUDE.md.**

### Task File Paths

When defining tasks, use EXACT paths following project structure:
```
src/services/[module]/
├── cmd/api/main.go
├── modules/[submodule]/
│   ├── domain/
│   │   ├── aggregate/[entity].go      ← Domain entities
│   │   ├── valueobject/[vo].go        ← Value objects
│   │   └── repository/[repo].go       ← Repository interfaces
│   ├── application/
│   │   └── usecase/[UseCase]/         ← Use case (4 files)
│   │       ├── inport.go
│   │       ├── dto.go
│   │       ├── handler.go
│   │       └── mappers.go
│   └── infrastructure/
│       ├── repo/[entity]_postgres.go  ← Repository impl
│       └── http/[handler].go          ← HTTP handlers
```

---

## Template

Use template at: `@.opencode/templates/story-template.md`

## Story Structure

### Header

```markdown
# Story N.M: [Title]

**Story ID:** [MODULE]-S[EPIC]-[NN]
**Epic:** [MODULE]-E[EPIC] - [Epic Title]
**Status:** TODO | IN_PROGRESS | REVIEW | DONE
**Priority:** P0 | P1 | P2
**Estimate:** XS | S | M | L | XL
```

### User Story Format (MANDATORY)

```markdown
## User Story

**As a** [user type],
**I want** [capability/action],
**So that** [benefit/value].
```

### Sections

1. **User Story** - As a... I want... So that...
2. **Acceptance Criteria** - Given/When/Then (MANDATORY)
3. **Technical Tasks** - Implementation checklist
4. **Definition of Done** - Quality gates
5. **Technical Context** - Related files, patterns
6. **Test Scenarios** - Unit and integration tests
7. **Notes** - Additional context

## Naming Conventions

### File Naming

```
story-[EPIC]-[NN]-[description].md

Examples:
- story-05-01-product-aggregate.md
- story-05-02-product-repository.md
- story-05-03-product-http-endpoints.md
```

### Story ID Format

```
[MODULE]-S[EPIC]-[NN]

Examples:
- CATALOG-S05-01
- CATALOG-S05-02
- INVENTORY-S10-01
```

## Acceptance Criteria (MANDATORY)

Use skill: `acceptance-criteria`

### Format: Given/When/Then

```markdown
## Acceptance Criteria

### AC1: Create product with valid data

**Given** authenticated merchant with "product:create" permission
**When** POST /api/v1/products with:
  - name: "Test Product"
  - price: 100.00
  - currency: "UAH"
**Then** 201 Created returned
**And** response contains product with generated UUID
**And** product status is "pending"
**And** "product.created" event published to Kafka

### AC2: Reject invalid product data

**Given** authenticated merchant
**When** POST /api/v1/products with missing required field "name"
**Then** 400 Bad Request returned
**And** error response contains:
  - field: "name"
  - message: "name is required"
**And** no product is created in database

### AC3: Unauthorized access rejected

**Given** user without "product:create" permission
**When** POST /api/v1/products
**Then** 403 Forbidden returned
```

### AC Coverage

Each story should have:
- **Happy path** - At least 1 success scenario
- **Validation errors** - Invalid input handling
- **Authorization** - Permission checks
- **Edge cases** - Boundary conditions

## Atomic Tasks (4-6 hours each)

### Task Decomposition Rules

**MANDATORY**: Every story MUST be broken into atomic tasks:

| Rule | Description |
|------|-------------|
| **4-6 hours** | Each task should be 4-6 hours of focused work |
| **Single responsibility** | One clear deliverable per task |
| **Explicit dependencies** | Every task declares what it depends on |
| **Parallel opportunities** | Independent tasks can run in parallel |
| **Red-Green-Refactor** | Follow TDD cycle in task types |

## Development Methodologies

**Set in config.yaml:** `development.methodology: tdd | stub`

### TDD (Test-Driven Development)

```
Interface → Test (RED) → Implementation (GREEN) → Refactor
```

| Step | Action | Validation |
|------|--------|------------|
| 1 | Define interface/contract | Compiles |
| 2 | Write failing test | Test FAILS (RED) |
| 3 | Implement minimal code | Test PASSES (GREEN) |
| 4 | Refactor | Tests still PASS |

**Best for:** New features, complex logic, when requirements are clear

### STUB (Stub-First Development)

```
Interface → Stub Implementation → Tests → Real Implementation
```

| Step | Action | Validation |
|------|--------|------------|
| 1 | Define interface/contract | Compiles |
| 2 | Write stub (mock data) | Returns expected shape |
| 3 | Write tests against stub | Tests PASS |
| 4 | Replace stub with real impl | Tests still PASS |

**Best for:** Exploratory work, unclear requirements, rapid prototyping

### Task Structure by Methodology

**TDD Task:**
```markdown
### T2: Implement {{Entity}} Aggregate + Tests
- **Estimate:** 5h
- **Depends on:** T1
- **Methodology:** TDD
- **Deliverables:**
  - [ ] Aggregate: `domain/aggregate/entity.go`
  - [ ] Value objects: `domain/valueobject/*.go`
- **Validation Test:** `domain/aggregate/entity_test.go`
  - [ ] Test creation happy path
  - [ ] Test validation errors
  - [ ] Test business rules
  - [ ] **⚠️ ALL TESTS MUST PASS**
```

**STUB Task:**
```markdown
### T2: Implement Repository (Stub → Real) + Tests
- **Estimate:** 6h
- **Depends on:** T1
- **Methodology:** STUB
- **Deliverables:**
  - [ ] Stub: `infrastructure/repo/entity_memory_repo.go`
  - [ ] Real: `infrastructure/repo/entity_postgres_repo.go`
- **Validation Test:** `infrastructure/repo/entity_repo_test.go`
  - [ ] Test Save, FindByID, List
  - [ ] Test with stub first
  - [ ] Replace stub with real
  - [ ] **⚠️ ALL TESTS MUST PASS**
```

---

### Task Types

| Type | Icon | Description |
|------|------|-------------|
| INTERFACE | 📐 | Define interface/contract |
| RED | 🔴 | Write failing test first (TDD) |
| GREEN | 🟢 | Implement to pass tests |
| STUB | 🧪 | Stub implementation (STUB methodology) |
| REFACTOR | 🔵 | Clean up, no new functionality |
| INTEGRATION | 🔗 | E2E integration test |
| DOCS | 📝 | Documentation only |

### Task Structure

```markdown
### T{N}: {Task Name}
- **Estimate:** 4h | 5h | 6h
- **Depends on:** T1, T2 | - (none)
- **Blocks:** T5, T6 | - (none)
- **Type:** 🔴 RED | 🟢 GREEN | 🔵 REFACTOR | 📝 DOCS
- **Files:** `path/to/file.go`
- **Definition of Done:**
  - [ ] Specific deliverable 1
  - [ ] Specific deliverable 2
- **Notes:** Implementation hints
```

### Dependency Graph (ASCII)

Visualize task dependencies:

```
T1 ──┬──► T2 ──► T4
     │           │
     └──► T3 ────┴──► T5 ──► T6
```

- `──►` = depends on (must complete before)
- `┬` = fork (parallel branches)
- `┴` = join (waits for all)

### Summary Table (MANDATORY)

```markdown
| ID | Task | Est | Depends On | Status |
|----|------|-----|------------|--------|
| T1 | Domain layer (aggregates, value objects, tests) | 6h | - | ⬜ |
| T2 | Repository interface + use case tests | 5h | T1 | ⬜ |
| T3 | Use case implementation | 5h | T2 | ⬜ |
| T4 | Repository implementation (PostgreSQL) | 6h | T2 | ⬜ |
| T5 | HTTP handlers + tests | 5h | T3 | ⬜ |
| T6 | Integration tests + refactor | 5h | T4, T5 | ⬜ |
```

**Status:** ⬜ TODO | 🔄 IN_PROGRESS | ✅ DONE | ⏸️ BLOCKED

### Execution Phases

Group tasks by parallel execution opportunity:

```markdown
### Execution Order

Phase 1: T1 (no deps)
Phase 2: T2, T3 (parallel - both depend only on T1)
Phase 3: T4, T6 (parallel - independent branches)
Phase 4: T5 (waits for T3, T4)
Phase 5: T7 (waits for T5)
Phase 6: T8, T6-continued (parallel)
Phase 7: T9 (waits for T6, T8)
Phase 8: T10 (final)

**Critical Path:** T1 → T2 → T4 → T5 → T7 → T8 → T9 → T10
**Total Estimate:** 32h (4 days)
**Parallel Savings:** ~3h (25%)
```

### Example: CreateProduct Story Tasks

```markdown
| ID | Task | Est | Depends On | Type |
|----|------|-----|------------|------|
| T1 | Domain layer: Product aggregate + value objects + tests | 6h | - | 🔴🟢 |
| T2 | Repository interface + CreateProduct use case tests | 5h | T1 | 🔴 |
| T3 | CreateProduct use case implementation | 5h | T2 | 🟢 |
| T4 | PostgreSQL repository implementation + tests | 6h | T2 | 🟢 |
| T5 | HTTP handler + tests | 5h | T3 | 🔴🟢 |
| T6 | Integration tests + refactor + documentation | 5h | T4, T5 | 🔵 |

**Graph:**
T1 ──► T2 ──┬──► T4 ──► T5 ──► T7 ──► T8 ──┬──► T9 ──► T10
            │                               │
T3 ─────────┴───────────► T6 ───────────────┘
```

### Splitting Large Tasks

If a task exceeds 6h, consider splitting it. **Each task MUST have validation test.**

| Original (8h+) | Split Into (with tests) |
|----------------|------------------------|
| "Full domain layer" (10h) | **T1:** Value objects + tests (4h)<br>**T2:** Aggregate + business rules + tests (6h) |
| "Full repository" (10h) | **T1:** Interface + Save/FindByID + tests (5h)<br>**T2:** List/Search + advanced queries + tests (5h) |

### Task Template with Validation

```markdown
### T{N}: {Task Name}
- **Estimate:** 5h
- **Depends on:** T{N-1}
- **Methodology:** TDD | STUB
- **Deliverables:**
  - [ ] File: `path/to/implementation.go`
  - [ ] File: `path/to/implementation2.go`
- **Validation Test:** `path/to/implementation_test.go`
  - [ ] Test case 1: happy path
  - [ ] Test case 2: error handling
  - [ ] Test case 3: edge case
  - [ ] **⚠️ ALL TESTS MUST PASS** ← MANDATORY
- **Notes:** Implementation hints
```

### Validation Test Requirements

**Every task MUST have:**

| Test Type | Required | Description |
|-----------|----------|-------------|
| Happy path | ✅ Yes | Normal success case |
| Error handling | ✅ Yes | Expected failures |
| Edge cases | Recommended | Boundary conditions |
| **Pass gate** | ✅ MANDATORY | `⚠️ ALL TESTS MUST PASS` |

### TDD vs STUB Task Examples

**TDD Example:**
```markdown
### T2: Implement Product Aggregate
- **Methodology:** TDD
- **Deliverables:**
  - [ ] `domain/aggregate/product.go`
- **Validation Test:** `domain/aggregate/product_test.go`
  - [ ] 🔴 Write test first (should FAIL)
  - [ ] 🟢 Implement until test PASSES
  - [ ] 🔵 Refactor, tests still PASS
  - [ ] **⚠️ ALL TESTS MUST PASS**
```

**STUB Example:**
```markdown
### T4: Implement Repository
- **Methodology:** STUB
- **Deliverables:**
  - [ ] Stub: `infrastructure/repo/product_memory_repo.go`
  - [ ] Real: `infrastructure/repo/product_postgres_repo.go`
- **Validation Test:** `infrastructure/repo/product_repo_test.go`
  - [ ] 🧪 Write stub (mock data)
  - [ ] ✅ Write tests against stub
  - [ ] 🟢 Replace with real impl
  - [ ] **⚠️ ALL TESTS MUST PASS**
```

## Definition of Done

Standard DoD checklist:

```markdown
## Definition of Done

- [ ] All acceptance criteria implemented and verified
- [ ] Unit tests written and passing (>80% coverage)
- [ ] Integration tests written and passing
- [ ] Code follows CLAUDE.md patterns
- [ ] Code reviewed and approved
- [ ] No linting errors
- [ ] Documentation updated
- [ ] PR merged to epic branch
```

## Story Sizing

### Size Guide

| Size | Duration | Complexity |
|------|----------|------------|
| XS | 2-4 hours | Trivial change |
| S | 0.5-1 day | Simple feature |
| M | 1-2 days | Standard feature |
| L | 2-3 days | Complex feature |
| XL | 3-5 days | Very complex, consider splitting |

### Too Big? Split!

If story is XL or larger:
1. Split by layer (domain, application, infrastructure)
2. Split by operation (create, read, update, delete)
3. Split by scenario (happy path, error handling)

## Story Order Within Epic

Recommended order:
1. Domain layer (aggregates, value objects)
2. Repository interfaces
3. Use cases
4. Repository implementations
5. HTTP handlers
6. Event publishers
7. Integration tests

## Test Scenarios

```markdown
## Test Scenarios

### Unit Tests
1. Product aggregate creation with valid data
2. Product aggregate validation rules
3. Price value object constraints
4. Use case handler happy path
5. Use case handler validation errors

### Integration Tests
1. Create product via HTTP API
2. Retrieve product via HTTP API
3. Product persisted in PostgreSQL
4. Event published to Kafka
```

---

## TODO Comments for Future Work

### When to Add TODO

| Situation | TODO Type | Example |
|-----------|-----------|---------|
| Interface for next task | `TASK` | `TODO(TASK:T3): Implement this method` |
| Basic impl, enhanced later | `STORY` | `TODO(STORY:S05-04): Add pagination` |
| Sync now, async later | `EPIC` | `TODO(EPIC:E06): Make event-driven` |
| Performance fix planned | `SPRINT` | `TODO(SPRINT:SP3): Optimize to O(n)` |
| Nice to have, not planned | `BACKLOG` | `TODO(BACKLOG): Add retry logic` |
| Known shortcut/hack | `TECH_DEBT` | `TODO(TECH_DEBT): Extract common logic` |

### TODO Format (IDE-compatible)

```go
// TODO({TYPE}:{ID}): {Short description}
//   Context: {Why this TODO exists}
//   Blocked by: {What must happen first}
//   See: {Link to story/epic if applicable}
```

**IDE Detection:**
- GoLand: Settings → Editor → TODO → Pattern: `\bTODO\b.*`
- VS Code: Highlight extension or built-in
- Pattern matches: `TODO`, `FIXME`, `HACK`

### Examples

```
// Interface for next task
interface ProductRepository {
    save(product: Product): void
    
    // TODO(TASK:T4): Add findById method
    //   Implemented in task T4
}

// Use case - pagination in next story  
function list(): Product[] {
    // TODO(STORY:CATALOG-S05-04): Add pagination support
    //   Current: returns all products (OK for MVP)
    //   Next story adds: limit, offset, cursor-based pagination
    return repo.findAll()
}

// Repository - batch operations in future epic
function save(product: Product): void {
    // TODO(EPIC:CATALOG-E08): Add batch save for bulk imports
    //   Current: single insert
    //   Epic 8 adds bulk operations
}

// API handler - rate limiting not planned yet
function createProduct(request): Response {
    // TODO(BACKLOG): Add rate limiting per merchant
    //   Not planned, but would prevent abuse
}

// Known tech debt
function calculateDiscount(items: Item[]): number {
    // TODO(TECH_DEBT): Extract discount rules to domain service
    //   Currently hardcoded, should be configurable
}

// Bug to fix
function findById(id: string): Product {
    // FIXME(BUG:GH-234): Race condition when concurrent updates
    //   Needs optimistic locking with version field
    //   Ticket: https://github.com/org/repo/issues/234
}

// Temporary workaround
function authenticate(request): void {
    // HACK: Bypass auth for internal services
    //   Temporary until service mesh is implemented
    //   Remove in: EPIC:INFRA-E02
}
```
```

### Story Template Section

Add to each story:

```markdown
## TODO Placeholders

| Location | TODO | Type | Reference |
|----------|------|------|-----------|
| `src/domain/repository/` | Add Update method | TASK | T5 |
| `src/application/usecase/` | Add caching | STORY | S05-06 |
| `src/api/` | Add rate limiting | BACKLOG | - |

## Related Future Work

| ID | Type | Description | When |
|----|------|-------------|------|
| T5 | Task | Update method | This story |
| S05-06 | Story | Caching layer | Sprint 2 |
| E08 | Epic | Bulk operations | Sprint 4 |
```

---

## Validation Checklist

Before completing story:
- [ ] Story ID is unique
- [ ] User story follows format
- [ ] **Acceptance criteria in Given/When/Then** (MANDATORY!)
- [ ] At least 3 AC (happy path, error, edge case)
- [ ] Technical tasks are specific
- [ ] **TODO placeholders defined for future work**
- [ ] Definition of Done is complete
- [ ] Estimate is reasonable
- [ ] Links to epic are correct

## Output

Save to: `docs/sprint-artifacts/sprint-[N]/stories/story-[EPIC]-[NN]-[description].md`

## Related Skills

- `acceptance-criteria` - For detailed AC writing
- `epic-writing` - For parent epic structure
- `jira-integration` - For syncing to Jira
