---
name: doc-todo
description: Incremental document writing with TODO placeholders
license: MIT
compatibility: opencode
metadata:
  domain: documentation
  agents: [all]
---

# Documentation TODO Skill

> **Purpose**: Incremental document writing with TODO placeholders
> **Used by**: All agents writing documentation

## Why Use Doc TODOs?

- **Think incrementally** - Don't write everything at once
- **Mark unknowns** - Explicitly show what needs work
- **Track progress** - See document completion status
- **Enable collaboration** - Others can fill in TODOs
- **Reduce pressure** - It's OK to leave placeholders

---

## TODO Types for Documentation

| Type | When to Use | Example |
|------|-------------|---------|
| `DRAFT` | Section is rough, needs polish | First pass at requirements |
| `EXPAND` | Section needs more detail | Add edge cases |
| `RESEARCH` | Needs investigation | Check competitor approach |
| `REVIEW` | Needs stakeholder input | Validate with PM |
| `DECISION` | Decision pending | Choose between A or B |
| `DEPENDENCY` | Waiting on other doc | Needs architecture first |
| `EXAMPLE` | Add concrete examples | Add code sample |
| `DIAGRAM` | Add visual diagram | Add sequence diagram |
| `NUMBERS` | Add metrics/data | Add performance targets |
| `LINK` | Add references | Link to ADR |

---

## Format

### Inline TODO (short)

```markdown
<!-- TODO(EXPAND): Add error handling scenarios -->
```

### Block TODO (with context)

```markdown
<!-- TODO(RESEARCH): Investigate payment provider options
- Need to compare: Stripe, Adyen, LiqPay
- Criteria: fees, UA support, API quality
- Ask: @john for vendor contacts
-->
```

### Section Placeholder

```markdown
## API Design

<!-- TODO(DEPENDENCY): Waiting on architecture.md
This section will define API contracts after architecture is finalized.
Blocked by: ARCH-001
Expected: Sprint 2
-->

[Section to be written]
```

### With Status

```markdown
## Feature X

**Status:** 🚧 DRAFT

<!-- TODO(DRAFT): This section needs review
- Written quickly, needs polish
- Missing: edge cases, error scenarios
- Review by: @analyst
-->
```

---

## Document Status Badges

Add at document top:

```markdown
# PRD: Product Catalog

**Status:** 🚧 IN PROGRESS | ✅ COMPLETE | 📝 DRAFT
**TODOs:** 5 remaining
**Last Updated:** 2024-01-15
**Completeness:** 70%

<!-- 
Document TODOs:
- [ ] TODO(EXPAND): FR-003 acceptance criteria
- [ ] TODO(REVIEW): NFR section with architect
- [ ] TODO(NUMBERS): Add performance targets
- [ ] TODO(DIAGRAM): Add data flow diagram
- [ ] TODO(DECISION): Choose sync vs async approach
-->
```

---

## Progressive Document Writing

### Phase 1: Skeleton

```markdown
# Architecture Document

## Overview
<!-- TODO(DRAFT): Write overview after components defined -->

## Components
<!-- TODO(EXPAND): List all components -->

## Data Flow
<!-- TODO(DIAGRAM): Add sequence diagram -->

## Decisions
<!-- TODO(DEPENDENCY): After PRD finalized -->
```

### Phase 2: First Pass

```markdown
# Architecture Document

## Overview
The system consists of 3 main services...
<!-- TODO(REVIEW): Review with team -->

## Components

### Catalog Service
Manages product catalog...
<!-- TODO(EXPAND): Add API endpoints -->

### Order Service
<!-- TODO(DRAFT): Write after catalog complete -->

## Data Flow
<!-- TODO(DIAGRAM): Add sequence diagram -->

## Decisions
<!-- TODO(DEPENDENCY): After PRD finalized -->
```

### Phase 3: Detailed

```markdown
# Architecture Document

## Overview
The system consists of 3 main services... ✅

## Components

### Catalog Service
Manages product catalog...

#### API Endpoints
- `POST /products` - Create product
- `GET /products/{id}` - Get product
<!-- TODO(EXAMPLE): Add request/response examples -->

### Order Service
Handles order processing...
<!-- TODO(EXPAND): Add order states diagram -->

## Data Flow
```mermaid
sequenceDiagram
...
```
✅

## Decisions
- ADR-001: Use PostgreSQL
<!-- TODO(LINK): Link to ADR files -->
```

---

## Templates with TODOs

### PRD Section

```markdown
## Functional Requirements

### FR-001: User Registration

**Priority:** P0
**Status:** 🚧 DRAFT

**Description:**
Users can register with email and password.

<!-- TODO(EXPAND): Add social login options -->

**Acceptance Criteria:**
- [ ] User can register with valid email
- [ ] Password must be 8+ characters
<!-- TODO(EXPAND): Add password complexity rules -->

**Edge Cases:**
<!-- TODO(RESEARCH): Check GDPR requirements for registration -->

**Dependencies:**
<!-- TODO(DEPENDENCY): Needs auth architecture from ARCH-002 -->
```

### Architecture Section

```markdown
## Database Design

### Products Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR | Product name |
<!-- TODO(EXPAND): Add all columns -->

**Indexes:**
<!-- TODO(NUMBERS): Add expected query patterns and index strategy -->

**Migrations:**
<!-- TODO(LINK): Link to migration files when created -->
```

### Story Section

```markdown
## Acceptance Criteria

### AC1: Create product successfully

**Given** authenticated merchant
**When** POST /products with valid data
**Then** 201 Created
<!-- TODO(EXAMPLE): Add sample request/response -->

### AC2: Validation errors
<!-- TODO(DRAFT): Write after AC1 reviewed -->

### AC3: Authorization
<!-- TODO(DECISION): Check if need merchant-level permissions -->
```

---

## Workflow Integration

### When Writing PRD

```
1. Create skeleton with TODOs
2. Fill critical sections first (P0 requirements)
3. Mark DRAFT sections for review
4. Get stakeholder input on DECISION items
5. Expand with details
6. Add DIAGRAM and EXAMPLE items
7. Final REVIEW pass
8. Mark document COMPLETE
```

### When Writing Architecture

```
1. Start with high-level overview
2. Add TODO(DEPENDENCY) for PRD items
3. Make DECISION items explicit
4. Add TODO(DIAGRAM) placeholders
5. Fill in as decisions are made
6. Add TODO(EXAMPLE) for code samples
7. Review and complete
```

---

## Tracking TODOs

### Summary Block

Add at document end:

```markdown
---

## Document TODOs

| Type | Description | Owner | Status |
|------|-------------|-------|--------|
| EXPAND | FR-003 acceptance criteria | @analyst | ⬜ |
| REVIEW | NFR section | @architect | 🔄 |
| DECISION | Sync vs async | @pm | ⬜ |
| DIAGRAM | Data flow | @architect | ⬜ |

**Completion:** 12/17 sections (70%)
```

### Grep for TODOs

```bash
# Find all doc TODOs
grep -r "TODO(" docs/ --include="*.md"

# Count by type
grep -o "TODO([A-Z]*)" docs/*.md | sort | uniq -c
```

---

## Best Practices

1. **Be specific** - "TODO(EXPAND): Add error codes" not "TODO: More details"
2. **Add context** - Why is this TODO here?
3. **Set owner** - Who should address this?
4. **Link dependencies** - What blocks this?
5. **Review regularly** - Don't let TODOs rot
6. **Celebrate completion** - Mark ✅ when done!
