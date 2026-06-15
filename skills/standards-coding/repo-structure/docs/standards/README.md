# Project Standards

The contract every implementer follows and every reviewer enforces. Each file is a single-purpose artifact; agents load only the ones relevant to a task via `using-standards`.

## Files

| Artifact | File | Status | Notes |
|----------|------|--------|-------|
| Coding | `coding.md` | Active | Naming, layering, error handling, critical rules |
| Testing | `testing.md` | Active | Pyramid, coverage targets, quality gates |
| Security | `security.md` | Active | Surface-scoped checklist; source of truth for `review-security` |
| Performance | `performance.md` | Active | Latency/throughput budgets, hot paths, anti-patterns |
| API | `api.md` | Active | URL, envelope, error shape, versioning |
| Database | `database.md` | Active | Naming, migrations, query patterns, indexes |
| Git | `git.md` | Active | Branching, commits, PR/MR process |
| Temporary decisions | `temporary-decisions.md` | Active | Living backlog of conscious shortcuts |

Skipped: none. (When an artifact is intentionally absent, write a one-line "Skipped: <artifact> — <reason and what would reopen it>" here.)

## Process

Authored once by whoever owns code quality on the project; updated whenever a code-review finding repeats or the architecture introduces a new surface.

## Related

- [CONTRIBUTING.md](/CONTRIBUTING.md) — git workflow expansion.
- [Architecture](../architecture/) — system design that these standards align with.
