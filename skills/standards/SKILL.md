---
name: standards
description: The umbrella router for a project's standards artifacts — decide which of the eight standards documents (coding, testing, security, performance, api, database, git, temporary-decisions) a project actually needs and route to the matching authoring skill. Use this whenever the user wants to "set up project standards", "write the standards", "what standards do we need", "scaffold the standards folder", or mentions "standards", "conventions document", or "rules of the project" without naming which one. Routes to `standards-coding`, `standards-testing`, `standards-security`, `standards-performance`, `standards-api`, `standards-database`, `standards-git`, and `standards-temporary-decisions`; pair with `using-standards` when the goal is to consume already-written standards during design or implementation.
---

# Standards (umbrella)

A project's standards are the explicit contract every implementer follows and every reviewer enforces. Without them, each new contributor — human or agent — drifts further from the last, reviews devolve into style arguments, and security or performance choices get re-invented per task instead of decided once.

This skill is the **router**, not an author. It decides which standards artifacts a given project actually needs, and points to the focused authoring skill for each one. Each artifact is small, single-purpose, and consumable on its own — agents implementing a story load only the ones the story touches, not the whole pile.

`{DOCS_ROOT}` below defaults to `docs/` at the project root; honor the project's configured docs location if one is set. All standards artifacts live under `{DOCS_ROOT}/standards/`.

## The eight artifacts and when each is needed

| Artifact | File | Authoring skill | Needed when |
|----------|------|-----------------|-------------|
| Coding | `standards/coding.md` | `standards-coding` | Always — naming, layering, error handling, critical rules |
| Testing | `standards/testing.md` | `standards-testing` | Always — coverage targets per layer, structure, types |
| Security | `standards/security.md` | `standards-security` | Any project handling user input, auth, data, secrets, or third-party deps (i.e. almost always) |
| Performance | `standards/performance.md` | `standards-performance` | Any project with latency or throughput requirements, hot paths, or scale concerns |
| API | `standards/api.md` | `standards-api` | The project exposes an HTTP/RPC/GraphQL API to clients it does not own |
| Database | `standards/database.md` | `standards-database` | The project owns persistent storage (SQL, NoSQL, search index) |
| Git | `standards/git.md` | `standards-git` | Always — branch naming, commit format, PR process |
| Temporary decisions | `standards/temporary-decisions.md` | `standards-temporary-decisions` | Always — a living backlog of conscious shortcuts, kept honest |

A project of any size keeps **coding, testing, git, temporary-decisions** at minimum. The other four are added when their trigger applies. Adding an artifact you do not need wastes context every time it loads; skipping one you do need pushes the missing decisions back into every story.

## How to decide for a fresh project

1. Read the PRD's project classification (TOY / SMALL / MEDIUM / LARGE / ENTERPRISE) and the architecture document.
2. Walk the table above and decide per artifact: needed yes/no, with a one-line reason.
3. Write the decisions into `{DOCS_ROOT}/standards/README.md` as an index — what exists, what was intentionally skipped, and the trigger that would reopen the question.
4. For each "needed" artifact, invoke the matching `standards-<topic>` authoring skill. Do not author content here; this skill only routes.

## Index file format

The `{DOCS_ROOT}/standards/README.md` is what `using-standards` reads first to discover which artifacts exist. Keep it short:

```markdown
# Project Standards

| Artifact | Status | Notes |
|----------|--------|-------|
| coding.md | active | — |
| testing.md | active | — |
| security.md | active | OWASP-aligned, scoped to web + DB |
| performance.md | active | latency budgets only; no throughput targets yet |
| api.md | active | REST v1; gRPC may join later |
| database.md | active | PostgreSQL; no NoSQL surface |
| git.md | active | trunk-based with epic branches |
| temporary-decisions.md | active | review every sprint |

Skipped: none.
```

When an artifact is intentionally absent, write a one-line "Skipped: <artifact> — <reason, and what would change to reopen it>" entry. The honesty of that line is what stops the next contributor from quietly re-deciding.

## Update protocol

Standards rot fastest when no one is responsible for re-reading them. Each authoring skill carries its own update rules, but the umbrella rule is: **whenever a code-review finds a recurring pattern that should have been a standard, file an update against the matching artifact, not against the reviewer's brain.** A repeated finding is the cheapest signal that a standard is missing or out of date.

## What this skill does not do

- It does not write the standards themselves — that is each `standards-<topic>` skill's job.
- It does not read the standards during design or implementation — that is `using-standards`'s job.
- It does not review code against the standards — the `review-*` skills do that, each pointed at its source-of-truth artifact.

## Roles

This skill is for whoever owns code quality on the project (tech lead, architect, or solo developer). The first invocation typically happens right after `service-architecture` lands — the architecture decides the stack, then standards bind every implementer to the conventions of that stack.

## Related

- `using-standards` — the consumer skill that loads relevant artifacts during design and implementation.
- `coding-standards` (deprecated) — the previous single-skill version; superseded by this group.
- `FLOW.yaml` — the pipeline phase where standards plug in (after architecture, before decomposition).
