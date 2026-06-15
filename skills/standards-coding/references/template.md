# Coding Standards

**Project:** {{project_name}}
**Stack:** {{stack}}
**Last updated:** {{date}}

> This document is the contract every implementer follows and every reviewer enforces. It covers only how production code is written. Tests, security, performance, API contracts, database schema, and git workflow live in sibling artifacts under `docs/standards/`.

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

## 5. Dependencies

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

## 6. Critical Rules

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
