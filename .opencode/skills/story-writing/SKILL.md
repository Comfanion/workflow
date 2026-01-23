---
name: story-writing
description: How to write stories as execution plans with self-contained tasks
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

**Philosophy:** Story = execution plan. Tasks are the main content, not ceremony.

### Header (Minimal)

```markdown
# Story N.M: [Title]

**Story ID:** [MODULE]-S[EPIC]-[NN]
**Epic:** [MODULE]-E[EPIC] - [Epic Title]
**Status:** draft | ready-for-dev | in-progress | review | done
**Size:** XS | S | M | L | XL
```

### Goal (1-2 sentences)

```markdown
## Goal

Implement CRUD use cases for merchant products with validation and event publishing.
```

**NOT** the verbose "As a... I want... So that..." format. Just state what the story achieves.

### Acceptance Criteria (Brief List)

```markdown
## Acceptance Criteria

- [ ] Products can be created with EAN validation
- [ ] Products can be retrieved by ID
- [ ] Products can be updated with optimistic locking
- [ ] Products can be listed with filters and pagination
- [ ] All operations publish domain events
```

**NOT** detailed Given/When/Then for each. Just a checklist of what "done" looks like.

### Tasks (MAIN CONTENT - 80% of file)

Self-contained tasks with documentation links. See Task Structure below.

### Sections (Simplified)

1. **Header** - Minimal metadata
2. **Goal** - 1-2 sentences
3. **Acceptance Criteria** - Brief checklist
4. **Tasks** - MAIN CONTENT (80% of file)
5. **Notes** - Optional additional context

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

## Self-Contained Tasks (NO ESTIMATES)

### Task Philosophy

**CRITICAL:** Tasks must be **SELF-CONTAINED** - an AI agent or developer can take ANY task and execute it independently without asking questions.

**NO ESTIMATES** - Don't estimate time. Focus on clear scope and outcomes.

### Task Decomposition Rules

| Rule | Description |
|------|-------------|
| **Self-contained** | Task has ALL information needed to execute |
| **Documentation links** | Every task links to relevant docs, schemas, examples |
| **Clear input/output** | What exists before, what must exist after |
| **Testable outcome** | How to verify task is complete |
| **Independent execution** | Can be picked up without context from other tasks |

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

### Task Structure (MANDATORY FORMAT)

Each task MUST have this structure to be self-contained:

```markdown
### T{N}: {Clear Task Name}

**Goal:** One sentence describing what this task achieves.

**Documentation:**
- [AGENTS.md#section](../../../AGENTS.md#section) - Relevant coding patterns
- [data-model.md#table](../docs/data-model.md#table) - Database schema
- [example.go](../src/path/example.go) - Pattern to follow

**Input (Prerequisites):**
- T{N-1} completed (if dependent)
- Existing file: `path/to/existing.go` - what it provides
- Repository interface defined in: `path/to/interface.go`

**Output (Deliverables):**
- `path/to/new_file.go` - Description of what this file does
- `path/to/new_file_test.go` - Tests covering X, Y, Z

**Implementation Steps:**
1. Read documentation links above
2. Create file structure following pattern from [example.go]
3. Implement X following AGENTS.md conventions
4. Write tests covering: happy path, validation errors, edge cases
5. Run tests, ensure all pass

**Acceptance Criteria:**
- [ ] File created at correct path
- [ ] Follows naming conventions from AGENTS.md
- [ ] All tests pass: `go test ./path/to/...`
- [ ] No linting errors: `golangci-lint run`

**Notes:** Additional hints, gotchas, or context
```

### Why This Structure?

| Section | Purpose |
|---------|---------|
| **Goal** | Agent knows the "why" |
| **Documentation** | Agent can read all needed context |
| **Input** | Agent knows what must exist before starting |
| **Output** | Agent knows exactly what to create |
| **Implementation Steps** | Agent has step-by-step guidance |
| **Acceptance Criteria** | Agent can verify completion |

### Tasks Summary Table

```markdown
| ID | Task | Deps | Status |
|----|------|------|--------|
| T1 | MerchantProduct Aggregate + Value Objects | - | ⬜ |
| T2 | Repository Interface | T1 | ⬜ |
| T3 | CreateProduct Use Case | T2 | ⬜ |
| T4 | PostgreSQL Repository Implementation | T2 | ⬜ |
| T5 | HTTP Handler + Routes | T3, T4 | ⬜ |
```

**Status:** ⬜ TODO | 🔄 IN_PROGRESS | ✅ DONE | ⏸️ BLOCKED

### Dependency Graph (Optional)

```
T1 ──► T2 ──┬──► T3 ──┬──► T5
            │         │
            └──► T4 ──┘
```

---

## Full Task Example

Here's a complete example of a self-contained task:

```markdown
### T1: MerchantProduct Aggregate + Value Objects

**Goal:** Create the MerchantProduct aggregate with all value objects and domain validation.

**Documentation:**
- [AGENTS.md#type-safety](../../../AGENTS.md#type-safety) - Value object patterns
- [AGENTS.md#naming-conventions](../../../AGENTS.md#naming-conventions) - File/package naming
- [catalog-data-model.md#merchant_products](../docs/catalog-data-model.md#31-merchant-products) - Database schema
- [modules/catalog/domain/entity/marketplace_category.go](../src/services/catalog/modules/catalog/domain/entity/marketplace_category.go) - Example entity pattern

**Input (Prerequisites):**
- None (first task in story)
- Existing patterns in `modules/catalog/domain/` to follow

**Output (Deliverables):**
- `modules/catalog/domain/valueobject/merchant_id.go` - UUID wrapper with validation
- `modules/catalog/domain/valueobject/product_id.go` - UUID wrapper
- `modules/catalog/domain/valueobject/merchant_sku.go` - String with max length validation
- `modules/catalog/domain/valueobject/ean.go` - GTIN-13 checksum validation
- `modules/catalog/domain/valueobject/product_status.go` - Enum (pending, active, etc.)
- `modules/catalog/domain/entity/merchant_product.go` - Aggregate with private fields + getters
- `modules/catalog/domain/entity/merchant_product_test.go` - All tests

**Implementation Steps:**
1. Read AGENTS.md sections on value objects and naming
2. Look at existing `marketplace_category.go` for entity pattern
3. Create value objects with `New*()` factory functions that validate
4. Create aggregate with private fields, public getters, factory method
5. Write tests: creation happy path, validation errors, status transitions
6. Run `go test ./modules/catalog/domain/...`

**Acceptance Criteria:**
- [ ] All files created at correct paths
- [ ] Value objects validate on construction (not setters)
- [ ] EAN validates GTIN-13 checksum
- [ ] Aggregate uses private fields with getters
- [ ] Tests cover: valid creation, invalid data rejection, status transitions
- [ ] `go test ./modules/catalog/domain/...` passes
- [ ] `golangci-lint run ./modules/catalog/domain/...` passes

**Notes:** 
- EAN checksum algorithm: sum odd positions × 1, even × 3, check digit makes sum divisible by 10
- Status enum values from PRD: pending, pending_category, pending_dedup, pending_pim, active, declined
```

### What Makes This Task Self-Contained?

1. **Agent can start immediately** - all documentation links provided
2. **No guessing** - exact file paths specified  
3. **Pattern to follow** - links to existing code examples
4. **Clear verification** - specific test commands and criteria
5. **Context included** - notes explain non-obvious details (EAN algorithm)

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
- [ ] Goal is clear (1-2 sentences)
- [ ] Acceptance criteria as checklist (what "done" looks like)
- [ ] Tasks are self-contained with documentation links
- [ ] Each task has: Goal, Documentation, Input, Output, Steps, AC
- [ ] Definition of Done is complete
- [ ] Links to epic are correct

## Output

Save to: `docs/sprint-artifacts/sprint-[N]/stories/story-[EPIC]-[NN]-[description].md`

## Related Skills

- `acceptance-criteria` - For detailed AC writing
- `epic-writing` - For parent epic structure
- `jira-integration` - For syncing to Jira
