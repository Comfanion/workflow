---
name: coding-standards
description: Define and document a project's coding standards — naming conventions, code organization, design patterns, error handling, testing, API/database/security rules, dependencies, and git workflow — in a self-contained standards document agents read while building. Use this whenever the user wants to set up coding standards, enforce code style, document repo conventions, scaffold repo structure, or mentions "coding standards", "code style", "naming conventions", "best practices", "code patterns", "style guide", "project conventions", or "repo structure". This skill produces the standards document and optional repo scaffolding only — it does not review or rewrite existing code (that is a code-review task).
---

# Coding Standards

Coding standards exist so that every contributor — human or agent — writes code that looks like it came from one author. They turn implicit team knowledge into an explicit, readable contract: how to name things, where code lives, which patterns to follow, what to never do. Without them, each new file drifts further from the last, reviews devolve into style arguments, and onboarding takes weeks instead of days.

This skill produces a coding-standards document (and optionally a repo skeleton). It does not audit or rewrite existing code — that is a separate review task.

## The one rule that matters most: the main file is self-contained

Agents implementing a story read the **main standards file and nothing else** during normal development. That is deliberate — it keeps their working context small and fast. So the main file must carry every critical rule on its own: project structure, naming, the common patterns, error handling, the testing bar, the API shape. If a rule is important enough that breaking it fails review, it belongs in the main file, not buried in a deep-dive.

Deep-dive files exist for the long tail — the full git branching model, the exhaustive security checklist, the complete testing playbook. They are read only when a task explicitly points to them ("required reading: testing-standards"). Treat them as reference, not as required reading for every change.

Keep the main file roughly 20-30KB and each deep-dive 10-20KB. Past that, an agent spends more context reading the rules than writing the code.

## Where the document lives

Write standards under `{DOCS_ROOT}/coding-standards/`. `{DOCS_ROOT}` defaults to `docs/` at the project root; honor the project's configured docs location if one is set.

- `{DOCS_ROOT}/coding-standards/README.md` — the self-contained main file
- `{DOCS_ROOT}/coding-standards/<topic>.md` — deep-dives (e.g. `go-standards.md`, `testing-standards.md`)

## How to write it

1. Read the PRD and architecture documents first. Standards must match the actual stack and module boundaries — inventing conventions that contradict the architecture creates two sources of truth that will conflict.
2. Create `{DOCS_ROOT}/coding-standards/` and start with `README.md`. Put every critical rule here.
3. Add deep-dive files only when the main file would otherwise blow past its size budget on one topic.
4. Before finishing, re-read `README.md` as if you were an agent about to implement a story. If you would need to open another file to know how to name a function or structure a handler, that rule is in the wrong place — move it up.

For the full catalog of what to cover and worked examples of each section, see `references/what-to-document.md`. For ready-made deep-dive formats, see `references/template-testing.md`, `references/template-security.md`, and `references/template-git.md`.

## What to document

Cover these ten areas. The first six are almost always critical (main file); the rest are often deep-dives.

1. **Project structure** — directory layout, module organization, what goes where. This is the map; without it, agents guess at placement and the tree fragments.
2. **Naming conventions** — files, types, functions, variables, constants, tests. Consistent naming is what lets a reader predict where a symbol is defined before opening the file.
3. **Code organization patterns** — the layering (handler → service → repository → domain), the dependency direction, the module boundaries. Document the direction explicitly because the compiler won't enforce it.
4. **Error handling** — error types, wrapping with context, error codes, the API error shape. Wrapping errors with context is what makes a production stack trace actionable instead of a mystery.
5. **Testing standards** — test types, coverage targets per layer, naming, structure (Arrange-Act-Assert). State targets per layer because a blanket "80% coverage" pushes effort to the cheap-but-low-value tests.
6. **API standards** — REST/gRPC conventions, URL structure, status codes, request/response envelope. A single response shape means clients write one parser, not one per endpoint.
7. **Database standards** — table/column naming, migrations, query patterns (parameterized queries, transactions).
8. **Security standards** — authentication, authorization, input validation, secrets management. These are the rules whose violation is a vulnerability, not a style nit — call them out explicitly.
9. **Dependencies** — approved libraries, forbidden libraries (with the approved alternative), version constraints. A forbidden list without the alternative just gets ignored.
10. **Git workflow** — branch naming, commit message format, PR process.

## Naming conventions baseline

Use these defaults unless the language or existing codebase dictates otherwise — match the existing codebase over any default:

| Element | Convention | Example |
|---------|-----------|---------|
| Files | snake_case | `user_service.go` |
| Types / classes | PascalCase | `UserService` |
| Functions | camelCase, or PascalCase for exported (Go) | `getUserById`, `Create` |
| Variables | camelCase | `userId`, `isValid` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES` |
| Booleans | is/has/can prefix | `isValid`, `hasPermission` |
| Tests | `*_test.go`, `*.test.ts` | `user_service_test.go` |

## Core patterns and critical rules

Document the layering so each file has one job:

- **Handler** — HTTP/API layer only: parse, validate, call a service, format the response. No business logic, so the same logic can be reused outside HTTP and tested without a request.
- **Service** — business logic and orchestration. The layer that holds the rules.
- **Repository** — data access and queries. Isolating data access keeps SQL out of the business logic and makes the service mockable in tests.
- **Domain** — entities, value objects, invariants.

The critical rules that most often fail review, and why they matter:

- **No business logic in handlers** — keeps logic reusable and testable without HTTP.
- **Inject dependencies through interfaces** — lets tests substitute mocks and prevents hidden coupling.
- **Wrap errors with context** — a bare error tells you what failed but not where; wrapping makes production failures diagnosable.
- **No global mutable state** — globals make tests order-dependent and concurrency unsafe.
- **Coverage targets per layer** — e.g. domain 80%+, application 70%+ — so test effort lands where bugs are most expensive.

## API response envelope

A consistent envelope means every client parses responses the same way:

```json
// Success
{ "data": { }, "meta": { } }

// Error
{ "error": { "code": "VALIDATION_ERROR", "message": "Invalid input", "details": [] } }
```

## Scaffolding a repo from scratch

When the user wants a fresh repo laid out to these standards, the `repo-structure/` directory in this skill is a ready-to-copy skeleton: a `docs/` tree (PRD, architecture, coding-standards, ADRs, API, sprint artifacts), a starter `README.md`, `CONTRIBUTING.md`, `.gitignore`, and `.gitattributes`. Copy it into the new project and fill the `{{placeholders}}`. Adapt the layout to the project's stack — the skeleton is a starting point, not a mandate.

## Example main file

```markdown
# Coding Standards

**Project:** E-commerce Platform
**Tech Stack:** Go, PostgreSQL, React

## Project Structure
project/
├── internal/
│   ├── order/        # Order module: domain / service / handler
│   └── shared/       # Shared utilities
├── docs/
└── tests/

## Naming Conventions
- Files: snake_case (user_service.go)
- Types: PascalCase (UserService)
- Functions: camelCase (getUserById)
- Constants: UPPER_SNAKE_CASE (MAX_RETRIES)

## Common Patterns
### Service Pattern — business logic lives here, data access is injected

## Critical Rules
1. No business logic in handlers
2. Inject dependencies through interfaces
3. Wrap errors with context
4. Coverage: domain 80%+

## Deep Dive
- → testing-standards.md
- → git-standards.md
```

## Roles

This skill is written for whoever owns code quality on the project (on a team, the tech lead or architect; solo, you). The standards document is the contract every implementer follows and every reviewer enforces; you author it, and it is reviewed by the project owner before it becomes binding.
