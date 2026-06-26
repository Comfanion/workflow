---
type: standard                                # controlled vocab — primary filter for agents
title: Coding Standards
description: How production code is written in this project.
domain: coding                                # dedup axis: one standard per subject
status: draft                                 # draft | approved | deprecated | superseded
tags: [coding, conventions]                   # free-form filter labels
updated: {{YYYY-MM-DDThh:mmZ}}                 # OKF timestamp — last meaningful change
related: []                                    # cross-links; sibling standards under docs/standards/
---

# Coding Standards

**Stack:** {{stack}}

> This document is the contract every implementer follows and every reviewer enforces. It covers only how production code is written. Tests, security, performance, API contracts, database schema, and git workflow live in sibling artifacts under `docs/standards/`.

## Reading guide

Section-addressable — read only the sections your task needs; the whole doc is the source of truth when in doubt.

| If you are… | Read |
|-------------|------|
| **Designing** (architect / planner) | §1 Project structure · §3 Code organization (layering, dependency direction) · §5 Language idioms |
| **Implementing** (dev) | §2 Naming · §4 Error handling · §6 Dependencies · §7 Formatting · §8 Logging · §9 Critical rules |
| **Reviewing** (reviewer) | §9 Critical rules, plus the sections for the code under review |

## 1. Project Structure

```
project/
├── internal/
│   ├── domain/        # Entities, value objects, invariants
│   ├── service/       # Business logic, orchestration
│   ├── repository/    # Data access
│   └── handler/       # HTTP / RPC layer
├── pkg/               # Public libraries (importable from outside)
├── cmd/               # One subfolder per binary
├── docs/              # Documentation (this lives here)
└── tests/             # Integration / E2E tests
```

**Rules:**
- `internal/` is private code; never imported from outside the module.
- `pkg/` is for reusable libraries with stable APIs.
- `cmd/<name>/main.go` is the only acceptable entry point.

## 2. Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Files | snake_case | `user_service.go` |
| Types | PascalCase | `UserService` |
| Exported functions | PascalCase | `CreateUser` |
| Unexported functions | camelCase | `validateEmail` |
| Variables | camelCase | `userID` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES` |
| Booleans | is/has/can prefix | `isValid`, `hasPermission` |
| Tests | `*_test.go` | `user_service_test.go` |

## 3. Code Organization Patterns

### Layering

```
Handler → Service → Repository → Database
   ↓        ↓           ↓
  HTTP   Business     Data
  layer  logic        access
```

### Dependency direction

Dependencies point **inward** toward the domain. The domain depends on nothing; infrastructure depends on the domain (not the reverse).

**Rules:**
- Handlers: parse / validate / call a service / format response. No business logic.
- Services: orchestration and business rules.
- Repositories: queries only. No business logic.
- Domain: pure entities and invariants. No framework imports.

## 4. Error Handling

### Error types

```go
type ValidationError struct {
    Field   string
    Message string
}

type NotFoundError struct {
    Resource string
    ID       string
}
```

### Wrapping

```go
if err != nil {
    return fmt.Errorf("create user: %w", err)
}
```

A bare error tells you what failed but not where; wrapping every cross-layer return is what makes a production stack trace actionable.

> Rules that trace to a recorded decision cite it: **Governing ADR:** {{ADR-NNN link}}. The ADR holds the *why*; if a rule here conflicts with its ADR, the ADR wins.

## 5. Language Idioms

The stack-specific conventions this project commits to. One short rule each. Omit this section if the stack adds nothing beyond the defaults above.

- Concurrency: {{rule — e.g. cancellation via context, bounded workers, no unbounded fan-out}}.
- Immutability / state: {{rule}}.
- Explicit over clever: {{rule — e.g. explicit mapping over reflection-based copying}}.

## 6. Dependencies

### Approved

| Purpose | Library | Version |
|---------|---------|---------|
| HTTP router | {{router}} | {{version}} |
| Database driver | {{db}} | {{version}} |
| Validation | {{validator}} | {{version}} |

### Forbidden (each names the sanctioned alternative)

- ❌ `{{forbidden_lib}}` — use `{{alternative}}` instead. Reason: {{reason}}.

### Versioning

- Semantic versioning, major versions pinned.

## 7. Formatting

| Rule | Value |
|------|-------|
| Formatter | {{tool}} |
| Import order | {{rule / tool}} |
| Line length | {{soft / hard limit}} |

Manual formatting is not allowed — tools only. The runnable config and the pre-commit hook live in the boilerplate (`{{path/in/boilerplate}}`); this table is the rule they implement.

## 8. Logging

| Aspect | Convention |
|--------|------------|
| Style | {{structured (JSON) / builder-style — no printf}} |
| Levels | {{DEBUG / INFO / WARN / ERROR meanings}} |
| Forbidden | {{e.g. global logger, unstructured messages}} |

Logger wiring and base config live in the boilerplate (`{{path/in/boilerplate}}`). For how a log line carries trace/correlation IDs and which signals are emitted, see `docs/standards/observability.md` — don't duplicate it here.

## 9. Critical Rules

The short list. Violations fail review on the spot.

1. **No business logic in handlers.**
2. **Inject dependencies through interfaces.**
3. **Wrap errors with context at every cross-layer return.**
4. **No global mutable state.**
5. **{{project-specific rule, if any}}.**

---

→ Tests: `docs/standards/testing.md`
→ Security: `docs/standards/security.md`
→ Performance: `docs/standards/performance.md`
→ API: `docs/standards/api.md`
→ Database: `docs/standards/database.md`
→ Git workflow: `docs/standards/git.md`
→ Temporary decisions / backlog: `docs/standards/temporary-decisions.md`
