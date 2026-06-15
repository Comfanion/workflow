---
name: code-review
description: Review implemented code before it merges and return a clear PASS/CHANGES/BLOCKED verdict — the umbrella that runs the focused review dimensions (security, correctness, tests, performance, complexity) and aggregates their findings. Use whenever the user says "review this code", "code review", "review the diff", "review the PR", or asks whether an implementation is safe to merge. It reviews finished code against an approved plan and a security/quality gate by dispatching each dimension as its own pass — it does not write the feature, gather requirements, or design architecture.
---

# Code Review (umbrella)

A code review answers one question: is this change safe and correct to merge? This skill is the **router and aggregator** — it does not hold one big checklist. It runs each review dimension as its own focused pass, then combines their verdicts. Splitting the review into dimensions is deliberate: a single monolithic checklist gets skimmed and rubber-stamped ("looks good") — the exact failure that lets AI slop and a hardcoded secret merge together. Each dimension forces a real, evidence-backed pass.

## Prepare before you read code

Reviewing code without knowing what it was supposed to do produces opinions, not findings. Before dispatching dimensions:

- Read the plan/story the change implements and list its acceptance criteria — these are what "correct" means.
- Load the project's standards via `using-standards` (default `{DOCS_ROOT}/standards/`) — each dimension reads its own source of truth: `coding.md` (correctness/style), `security.md` (security), `performance.md` (performance), `testing.md` (tests), `api.md` / `database.md` (surface-specific correctness).
- Identify the changed files (the diff / file list).
- Look up similar existing patterns so "this is wrong" is grounded in the project, not personal preference.

## Run the dimensions

Dispatch each applicable dimension as its own focused review. Each returns a dimension verdict and evidence-backed findings (`path/file:line` → issue → fix). A dimension that does not apply to this change returns PASS explicitly — it is never silently skipped.

| Dimension | Skill | Blocks? |
|---|---|---|
| Security | `review-security` | HIGH — always blocks on a real finding |
| Correctness | `review-correctness` | HIGH — unmet criterion / logic / race blocks |
| Tests | `review-tests` | HIGH — failing suite / untested core path blocks |
| Performance | `review-performance` | MED — blocks when impact is user-visible or cost grows unbounded (hot-path rule defined in `review-performance`) |
| Complexity / maintainability | `review-complexity` | LOW/MED — shapes, rarely blocks |

On a team each dimension can run as a separate reviewer pass (parallel); solo, work them in the order above. Do not let one dimension's findings excuse skipping another — run all that apply.

## Aggregate the verdict

The overall verdict is decided by the highest-severity finding across all dimensions:

- **APPROVE** — every dimension PASS, no HIGH findings, tests green. Ready to merge.
- **CHANGES_REQUESTED** — findings exist that must be addressed (any HIGH, or MEDIUM the author should fix). The default outcome of most first reviews.
- **BLOCKED** — a HIGH finding that prevents approval outright (security hole, broken tests, unmet core criterion).

A finding is only useful if the author can act on it. Every action item names the exact location, the problem, and a concrete fix — `path/file.go:42 — DB timeout error swallowed → wrap and return a domain error`. "This could be cleaner" is not an action item. Prioritize ruthlessly: a hardcoded secret and a long function are not the same severity, and burying the first under ten of the second gets the dangerous one merged.

## How to report

Aggregate the dimension outputs into one short, actionable verdict — the caller acts on it directly:

```
**VERDICT: {APPROVE | CHANGES_REQUESTED | BLOCKED}**

Security:    {PASS | n findings}
Correctness: {PASS | n findings}
Tests:       {PASS (n/n) | FAIL — detail}
Performance: {PASS | n findings}
Complexity:  {PASS | n findings}

Action items (omit if APPROVE):
- [HIGH] `path/file.go:42` — {issue} → {fix}
- [MED]  `path/file.go:100` — {issue} → {fix}
- [LOW]  `path/file.go:15` — {issue}
```

On APPROVE, state it plainly and note what was done well — confirming the strengths tells the author the review was real, not rubber-stamped. If the project keeps review history on the plan/story file, append each round as a dated block (Review #1, #2, …) rather than overwriting.

## Roles

Serves the reviewer role (on a team, the reviewer; solo, you). It reviews the developer's output against the approved plan and the security/quality gate by running the dimensions above — the reviewer does not approve their own code. On APPROVE the change is ready to merge; on CHANGES_REQUESTED or BLOCKED it returns to the developer with the action items.

## Related

Code review is the code-level security/quality gate. Security also has earlier lenses: `security-requirements` (requirements-time abuse cases + security NFRs) and `threat-modeling` (design-time STRIDE). The `review-security` dimension verifies in code what those defined upstream.
