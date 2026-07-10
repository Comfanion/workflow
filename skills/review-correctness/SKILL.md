---
name: review-correctness
description: Review a code change for logic and correctness defects only — does it satisfy the stated acceptance criteria, handle edge cases and error paths, and avoid off-by-one, race conditions, TOCTOU, and null/nil derefs. Invoke on the trigger phrases "is this logic right", "correctness review", "does this match the spec", "check the edge cases / null handling / off-by-one", "is there a race here", or when the code-review umbrella dispatches its correctness pass. This is a single dimension, not an umbrella: for a full-PR review, invoke code-review and let it fan out. Do NOT use for test-suite health, coverage gaps, or flaky tests (`review-tests`); security, injection, auth, or secret leaks (`review-security`); performance, latency, or complexity (`review-performance`); style, naming, or formatting (`review-complexity`); or for confirming the build/tests/lint were actually run (`verification-before-completion`). Output is correctness findings only, each citing path:line with the breaking input and fix, plus a CORRECTNESS: PASS | FINDINGS verdict — never comments on security, performance, or style.
---

# Review — Correctness

The correctness dimension of a code review. One job: does this change actually do what it was supposed to, on every path — not just the happy one. Shipping a feature that doesn't do what was agreed wastes the whole change.

## Scope
Always applies. The baseline is the acceptance criteria of the plan/story the change implements — read them first; they define "correct".

## Source of truth: `{DOCS_ROOT}/standards/coding.md` (and surface siblings)
The project's `standards-coding` artifact owns the layering, naming, error wrapping, and critical rules — load it via `using-standards` before reviewing. If the change touches an API or DB surface, also load `api.md` / `database.md` (response shape, error codes, query patterns). When the artifacts are absent, fall back to the project's conventions guide and the codebase patterns.

## Checklist — work each item
For each: checked → finding, or "checked, clean".

- **Spec adherence:** every acceptance criterion is actually satisfied, not just attempted. Name any that are missing or partial.
- **Edge cases:** empty/null/zero/negative/max inputs handled; boundaries correct (off-by-one in ranges, slices, pagination).
- **Error paths:** every error is handled, wrapped with context, or deliberately propagated — never swallowed. Failure leaves state consistent.
- **Concurrency:** shared state guarded; no data races, no check-then-act TOCTOU, no deadlock ordering.
- **Null/nil:** no dereference of a possibly-absent value; optionals unwrapped safely.
- **Logic:** conditionals and boolean logic match intent; no inverted condition; no dead/unreachable branch.
- **Data integrity:** transactions atomic where needed; no partial writes on failure.

## Evidence discipline (anti-slop)
- Each finding cites `path/file:line`, the input/sequence that breaks it, and the fix.
- For "spec satisfied" claims, map each acceptance criterion to the code that fulfills it — do not assert coverage you did not trace.

## Output
```
CORRECTNESS: {PASS | FINDINGS}
- [HIGH] `path/file:line` — {input/sequence that fails} → {fix}
```
Unmet acceptance criterion or a logic/race bug is HIGH (blocks). PASS only when every criterion is traced to satisfying code.
