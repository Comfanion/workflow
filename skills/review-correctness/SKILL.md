---
name: review-correctness
description: Review a code change for logic and correctness defects only — does it satisfy the acceptance criteria, handle edge cases and error paths, and avoid off-by-one, race conditions, and null/nil bugs. Use when running the correctness dimension of a code review, when the user says "is this logic right", "correctness review", "does this match the spec", or when code-review dispatches the correctness pass. The original core of code review — it does not judge security, performance, or style; it returns correctness findings with a dimension verdict.
---

# Review — Correctness

The correctness dimension of a code review. One job: does this change actually do what it was supposed to, on every path — not just the happy one. Shipping a feature that doesn't do what was agreed wastes the whole change.

## Scope
Always applies. The baseline is the acceptance criteria of the plan/story the change implements — read them first; they define "correct".

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
