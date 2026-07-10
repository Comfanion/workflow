---
name: code-review
description: Use when finished code needs a pre-merge verdict — the reviewer's side, not the author's. Fires on "review this code", "code review", "review the diff / PR", "is this safe to merge?", "should I merge this?", "run the review dimensions on this change", or any request to evaluate an implementation against its approved plan and the project's security/quality gate. This is the **umbrella router and aggregator**: it loads the plan + standards, dispatches each focused dimension as its own pass — `review-security`, `review-correctness`, `review-tests`, `review-performance`, `review-complexity` — then aggregates them into one verdict: `APPROVE`, `CHANGES_REQUESTED`, or `BLOCKED`, decided by the highest-severity finding with every action item pinned to `file:line → issue → fix`. For a single-axis ask ("just check security"), route directly to the matching dimension instead of the umbrella. Do NOT fire when the user is on the **author's** side responding to feedback they already received — use `receiving-code-review`. Do NOT fire for "are you actually done / verify completion" — use `verification-before-completion`. This skill does not write the feature, gather requirements, or design architecture; it only reviews code that already exists.
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
