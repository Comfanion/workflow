---
name: code-review
description: Review implemented code for security, correctness, test coverage, and quality before it merges, and return a clear PASS/CHANGES/BLOCKED verdict with prioritized action items. Use this whenever the user says "review this code", "code review", "review the diff", "review the PR", "security review of this change", or asks you to check whether an implementation is safe to merge. This skill reviews finished code against an approved plan and a security/quality gate — it does not write the feature, gather requirements, or design architecture.
---

# Code Review

A code review answers one question: is this change safe and correct to merge? You verify the implementation against the plan it was built from, then run it through a security and quality gate. The output is a short, actionable verdict — not a rewrite, and not a list of nitpicks dressed up as blockers.

The most common failure in review is treating every observation as equally urgent. A hardcoded secret and a slightly long function are not the same severity, and burying the first under ten of the second gets the dangerous one merged. Prioritize ruthlessly: security and correctness first, everything else after.

## Prepare before you read code

Reviewing code without knowing what it was supposed to do produces opinions, not findings. Before reading the diff:

- Read the plan or story the change implements, and list its acceptance criteria — these are what "correct" means for this change.
- Read the project's coding standards (default `{DOCS_ROOT}/coding-standards/`) and the project guide (CLAUDE.md / AGENTS.md) for architecture and convention expectations.
- Identify the changed files (the diff, or the change's file list).
- Look up similar existing patterns in the codebase so your judgments about "this is wrong" or "this duplicates X" are grounded in how the project already does things, not in personal preference.

## What to check, in priority order

Work the gate top to bottom. The earlier categories block a merge; the later ones shape it. The full itemized list lives in `references/checklist.md` — load it when you want to work systematically through every item rather than the high-signal subset below.

### Security (HIGH — always blocks)

Security findings are never "medium". A single one is enough to block a merge.

- No hardcoded secrets, API keys, or passwords.
- All user input validated and sanitized at the boundary.
- Database access uses parameterized queries — no string-built SQL.
- Protected endpoints require authentication; data access checks authorization before returning anything.
- Sensitive data and PII are not written to logs.
- Error messages returned to clients don't leak internal details (stack traces, query text, file paths).

These block because the cost of being wrong is a breach or data loss — irreversible in a way a style issue never is.

### Correctness (HIGH — blocks)

- Every acceptance criterion from the plan is actually satisfied, not just attempted.
- Edge cases and boundary conditions are handled, not assumed away.
- Error and failure paths have real handling, not a swallowed error.
- No obvious logic errors and no race conditions in concurrent paths.

Correctness blocks because shipping a feature that doesn't do what was agreed wastes the whole change.

### Tests (HIGH — blocks on failure)

- New code has unit tests; component interactions have integration tests.
- Tests cover the happy path *and* the error/edge cases — happy-path-only coverage hides exactly the bugs that reach production.
- Test names describe what they assert; tests are independent with no shared-state ordering dependencies.
- Run the suite (e.g. `go test`, `npm test`, `pytest`, `cargo test`). A failing or flaky suite is a HIGH finding — a green build is the floor, not a bonus.

### Quality (MEDIUM — shapes, rarely blocks)

- Matches the project's architecture and separation of concerns; business logic isn't tangled into infrastructure.
- Clear naming, focused functions, no needless duplication.
- Errors are wrapped with context; domain and infrastructure errors are distinguished.
- No N+1 queries or obvious performance bottlenecks; resources and connections are closed.
- No commented-out code; complex logic and public APIs are documented.

Quality issues are "should fix" — they cost maintainability over time, but they don't endanger a release the way the categories above do. Don't inflate them to blockers, and don't ignore them either.

### Style (LOW — optional)

Formatting and minor improvements. Flag them so the author sees them; never let them gate a merge.

## The verdict

Every review ends with one of three verdicts, decided by the highest-severity finding:

- **APPROVE** — all acceptance criteria met, no HIGH findings, tests green. Ready to merge.
- **CHANGES_REQUESTED** — findings exist that must be addressed before merge (any HIGH, or MEDIUM the author should fix). The default outcome of most first reviews.
- **BLOCKED** — a HIGH finding that prevents approval outright (security hole, broken tests, unmet core criterion).

A finding is only useful if the author can act on it. Every action item names the exact location, the problem, and a concrete fix — `path/file.go:42 — DB timeout error swallowed → wrap and return a domain error`. "This could be cleaner" is not an action item.

## How to report

Keep the returned summary short and actionable — the caller acts on your output directly, so it carries the verdict and the action items, nothing else:

```
**VERDICT: {APPROVE | CHANGES_REQUESTED | BLOCKED}**

Tests: {PASS (n/n) | FAIL — detail}
Lint:  {PASS | FAIL — detail}

Action items (omit if APPROVE):
- [HIGH] `path/file.go:42` — {issue} → {fix}
- [MED]  `path/file.go:100` — {issue} → {fix}
- [LOW]  `path/file.go:15` — {issue}
```

On APPROVE, state that plainly and note what was done well — confirming the strengths tells the author the review was real, not rubber-stamped.

If the project keeps review history on the plan/story file, append each round as a new dated block (Review #1, #2, …) rather than overwriting prior rounds — the history is what lets anyone see how the change converged.

## Roles

This skill serves the reviewer role (on a team, the reviewer; solo, you). It reviews the developer's output against the approved plan and a security/quality gate — the reviewer does not approve their own code. On APPROVE the change is ready to merge; on CHANGES_REQUESTED or BLOCKED it returns to the developer with the action items above.
