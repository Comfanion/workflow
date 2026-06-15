---
name: standards-coding
description: Author and maintain the project's coding standards artifact — naming conventions, project structure, code organization (layering and dependency direction), error handling, dependencies allow/forbid list, and the critical rules whose violation blocks review. Use this whenever the user wants to "write the coding standards", "define naming conventions", "document the layering", "set up project structure", "add forbidden libraries", or mentions "code style", "coding conventions", "naming", "structure", "patterns", or "critical rules". Authors `{DOCS_ROOT}/standards/coding.md` and (optionally) scaffolds the repo skeleton from the bundled template. Specialized testing, security, performance, API, database, and git rules live in their own skills — keep this artifact focused on how production code is written.
---

# Standards — Coding

The coding standards artifact is the contract that makes every file in the codebase look like it came from one author. It is the one document a developer agent reads before writing a single line, so it must be self-contained and lean: project structure, naming, the layering and dependency direction, the error-handling pattern, the critical rules. Specialized concerns (testing, security, performance, APIs, databases, git workflow) live in their own artifacts and authoring skills so this file does not bloat.

The artifact lives at `{DOCS_ROOT}/standards/coding.md`. `{DOCS_ROOT}` defaults to `docs/`; honor the project's configured docs location.

Target size: **8-15 KB**. Past that, an agent spends more context reading the rules than writing the code.

## What this artifact must cover

Six sections. Each is required because skipping it forces every story to re-decide:

1. **Project structure** — directory layout, module organization, where files go. Without this map agents guess at placement and the tree fragments.
2. **Naming conventions** — files, types, functions, variables, constants, tests. Consistent naming is what lets a reader predict where a symbol is defined before opening the file.
3. **Code organization patterns** — the layering (e.g. handler → service → repository → domain), the dependency direction, the module boundaries. Document the direction explicitly because the compiler will not enforce it.
4. **Error handling** — error types, wrapping with context, error codes. Wrapping errors with context is what makes a production stack trace actionable instead of a mystery.
5. **Dependencies** — approved libraries, forbidden libraries **with the approved alternative**, version-pinning rule. A forbidden list without an alternative just gets ignored.
6. **Critical rules** — the short list of violations that fail review on the spot. These are the things most often missed; collecting them in one place makes the review gate predictable.

Anything that is not one of these six belongs in a sibling artifact:
- Tests → `standards-testing`
- Security → `standards-security`
- Performance → `standards-performance`
- API contracts → `standards-api`
- Database schema/migrations → `standards-database`
- Branches/commits/PRs → `standards-git`

Keeping the artifacts orthogonal is what lets each one stay small enough to be loaded by `using-standards` selectively.

## How to write it

1. **Read the architecture first.** Coding standards must match the stack and module boundaries the architecture committed to. Inventing conventions that contradict the architecture creates two sources of truth that will conflict.
2. **Search the existing codebase.** If any code already exists, the standard documents the patterns that already work, not the ones you wish were there. Drift between rule and reality is what makes a standards document ignored.
3. **Draft the six sections.** Use `references/template.md` as the starting structure. Every rule gets one short example — rules without examples get interpreted differently by every reader.
4. **Re-read as if you were the implementer.** If you would have to open another file to know how to name a function, structure a handler, or wrap an error, that rule is in the wrong place — move it up.
5. **Validate against the checklist** in `references/checklist.md`: every section present, every rule has an example, forbidden libraries each have an alternative, the file is within the 8-15 KB budget.

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

## Layering — make the direction explicit

A typical layering and the reason each layer exists:

- **Handler** — HTTP/RPC layer only: parse, validate, call a service, format response. No business logic, so the same logic can be reused outside HTTP and tested without a request.
- **Service** — business logic and orchestration. The layer that holds the rules.
- **Repository** — data access and queries. Isolating data access keeps SQL out of business logic and makes services mockable in tests.
- **Domain** — entities, value objects, invariants.

Document the **dependency direction** (inward toward domain) as a written rule. The compiler will not catch a handler that imports a repository directly; the rule will.

## Critical rules — the short list

The rules that most often fail review, and why each matters:

- **No business logic in handlers** — keeps logic reusable and testable without HTTP.
- **Inject dependencies through interfaces** — lets tests substitute mocks and prevents hidden coupling.
- **Wrap errors with context** — a bare error tells you what failed but not where; wrapping makes production failures diagnosable.
- **No global mutable state** — globals make tests order-dependent and concurrency unsafe.

Keep this list short on purpose. Five items reviewers actually remember beats twenty they skim.

## Dependencies — forbidden needs an alternative

A forbidden-libraries entry without a sanctioned alternative is dead text. Format every entry as `forbidden X — use Y instead, because <one-line reason>`.

## Update protocol

The artifact stays current only if updates land when reality moves:

- A new pattern adopted in two or more PRs without being in the standards → propose an update before adopting it in a third.
- A code-review finding repeats across stories → file the rule here so future stories cannot miss it.
- The architecture introduces a new module type or technology → extend the layering and naming tables.
- A library is added to the forbidden list → never without naming the alternative.

Re-read the whole artifact at least once per quarter against the codebase. Rules that no longer match reality should be either re-asserted in code or removed.

## Repo scaffolding (optional)

For a fresh project, the `repo-structure/` directory bundled with this skill is a ready-to-copy skeleton: a `docs/` tree (PRD, architecture, standards, ADRs, API, sprint artifacts), starter `README.md`, `CONTRIBUTING.md`, `.gitignore`, `.gitattributes`. Copy it into the new project and fill the `{{placeholders}}`. Adapt the layout to the project's stack — the skeleton is a starting point, not a mandate.

## Templates and references

- `references/template.md` — main `coding.md` template with the six sections.
- `references/checklist.md` — validation checklist for the artifact.
- `repo-structure/` — copy-into-a-new-repo scaffold.

## Who reads this artifact

- `dev` — every story implementation (via `using-standards`).
- `service-architecture` and `system-architecture` — when validating that the design and the code conventions agree.
- `review-correctness` — to judge whether the change follows the layering and critical rules.
- `decomposition` — when a story's "Read First" needs to point at a specific section.

## Roles

Authored by whoever owns code quality on the project (tech lead, architect, or solo developer). Reviewed by the project owner before it becomes binding; once binding, every implementer follows it and every reviewer enforces it.

## Related

- `standards` — umbrella router.
- `using-standards` — consumer protocol; how this artifact is loaded during design and implementation.
- `standards-testing`, `standards-security`, `standards-performance`, `standards-api`, `standards-database`, `standards-git` — sibling artifacts.
