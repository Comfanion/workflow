---
name: using-standards
description: Consume the project's already-written standards during design, implementation, and review — find the index, load only the artifacts the task touches, apply the rules, and write back when the work introduces or removes a temporary decision. Use this whenever a developer agent, architect, or reviewer is about to act on a story or change; specifically when `dev` starts a story, `decomposition` writes a story's "Required Reading", `system-architecture` or `service-architecture` makes a stack decision, or any `review-*` skill needs the project's checklist. Mentions that trigger it: "what are the project standards", "follow project conventions", "apply our patterns", "use the coding standards", or any work where `{DOCS_ROOT}/standards/` exists. Distinct from `standards` (which decides which artifacts to author) — this skill is about consumption, not authoring.
---

# Using Standards

A standards library only pays off if it is actually loaded — and only the relevant parts. Loading all of `{DOCS_ROOT}/standards/` for every task wastes context; loading none silently re-decides the rules per story. This skill is the consumption protocol: **find the index, pick the artifacts the task touches, load only those, apply, write back if the work changed the ledger.**

`{DOCS_ROOT}` defaults to `docs/`. The standards live at `{DOCS_ROOT}/standards/`.

## The rule

```
Before designing, implementing, or reviewing — read the standards index, load
the artifacts that match this task's surface, then keep them in context until
the task is done.
```

"Match the task's surface" is the whole game. A pure handler change does not need `database.md`. A read-only DB query does not need `security.md`. A frontend story does not need `api.md` (it uses it; it does not author it). Selective loading is the whole point.

## Discovery — the index first

Read `{DOCS_ROOT}/standards/README.md`. It enumerates the artifacts that exist and the ones intentionally skipped. If the index is missing or stale, stop and invoke the `standards` umbrella skill to repair it before continuing — guessing what exists wastes more time than fixing the index.

## Selective load — match artifact to task surface

| The task touches… | Load |
|--------------------|------|
| Any production code | `coding.md` (always) |
| Tests | `coding.md`, `testing.md` |
| HTTP / RPC / GraphQL handler or client | `coding.md`, `api.md` (+ `security.md` for protected routes) |
| Database read or write | `coding.md`, `database.md` |
| Auth, input validation, secrets, crypto, serialization, deps | `coding.md`, `security.md` |
| Hot path (per-request, ingestion, search, sync) | `coding.md`, `performance.md` |
| New PR / commit | `git.md` (the format check is cheap) |
| Any story that takes a shortcut | `temporary-decisions.md` (write) |
| Architecture / stack decision | `coding.md` (for layering vocabulary), plus whichever sibling the decision is about |

If two or three artifacts apply, load them all — they are small on purpose. If you think more than four apply to a single story, the story is probably too big; flag it to `decomposition` before loading everything.

## Apply — the rules drive the work

- For `dev`: the loaded artifacts shape the interface, the test, the error wrapping, the query, the response. The artifact is the answer when a question comes up; you do not re-decide from scratch.
- For `system-architecture` / `service-architecture`: the artifacts already contain the project's vocabulary and constraints. New decisions must not contradict them, or you are creating two sources of truth.
- For `review-*`: each review dimension has its source-of-truth artifact (security → `security.md`, performance → `performance.md`, tests → `testing.md`, correctness → `coding.md` + `api.md`/`database.md`). Cite the rule when you raise a finding — "violates `security.md#authorization`" beats "this looks unsafe".

## Write back — the only path that updates standards mid-work

There is exactly one write-during-work path: **introducing or removing a shortcut goes into `temporary-decisions.md`.** Any other "the standard should be different" thought becomes a follow-up against the matching `standards-<topic>` authoring skill, not an in-flight edit.

When a story introduces a shortcut:

1. Open `{DOCS_ROOT}/standards/temporary-decisions.md`.
2. Add a `TD-NN` entry with the six fields (decision / why / cost / trigger / deadline / owner).
3. Reference the entry id from the code (`// TD-12`).
4. The reviewer enforces this. A PR with a shortcut but no entry is sent back.

When a story removes a shortcut:

1. Mark the matching `TD-NN` entry `resolved` with the PR / commit reference.
2. Remove the `// TD-NN` comment from the code.

## When the index says "skipped"

The umbrella's index marks artifacts intentionally absent. If a task touches a skipped surface (e.g. the project skipped `performance.md` but you are about to write a hot path), **stop**: this is a signal to revisit the skip via `standards` (umbrella) before continuing. Re-deciding the rules silently inside a story is exactly what this skill exists to prevent.

## Anti-patterns this skill prevents

- Loading the entire `docs/standards/` directory because "it's all relevant." Selective load.
- Re-deciding a rule in code review because no one read the artifact. Cite the rule.
- Carrying a shortcut to production without an entry. Write back.
- Editing a standards artifact in a feature PR. Standards edits are their own PRs.

## Integration with other consumer skills

- **`dev`** invokes this at the start of every story (replacing the old "read `coding-standards/`" step).
- **`decomposition`** invokes this when assembling a story's "Required Reading" — the story names the specific artifacts the developer must load.
- **`system-architecture` / `service-architecture`** invoke this when the design needs to stay consistent with the project's vocabulary and rules.
- **`review-*`** invoke this for the dimension-specific artifact (security / performance / tests).
- **`verification-before-completion`** invokes this to confirm the standards were followed and the temporary-decisions ledger is current.

## Roles

This skill is for every implementing or reviewing role. It does not author standards; if an artifact needs to be created or revised, hand off to the matching `standards-<topic>` skill.

## Related

- `standards` — umbrella router (which artifacts to author).
- `standards-coding`, `standards-testing`, `standards-security`, `standards-performance`, `standards-api`, `standards-database`, `standards-git`, `standards-temporary-decisions` — authoring siblings.
- `dev`, `decomposition`, `review-*`, `system-architecture`, `service-architecture` — the consumer skills that invoke this.
