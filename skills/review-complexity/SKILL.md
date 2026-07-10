---
name: review-complexity
description: Review an existing code change for maintainability and complexity defects — high cyclomatic complexity, deep nesting, long functions, tight coupling, poor naming (`data2`, `tmp`), needless abstraction, copy-paste duplication, dead code, and AI-slop patterns (restated comments, impossible-case defensiveness, scaffolding that does nothing). Use when the user says "is this over-engineered", "too complex / too nested", "hard to read", "maintainability review", "check complexity", "is there dead code", "name this better", or "is this idiomatic", and when code-review dispatches its complexity/maintainability pass. Review-only lens: it flags findings, it does not rewrite code, author coding standards (`standards-coding`), or run security/performance/correctness checks. Verdicts are typically MEDIUM/LOW — rarely blocks; returns a COMPLEXITY: PASS | FINDINGS verdict with `path/file:line` citations and the simpler shape.
---

# Review — Complexity & Maintainability

The maintainability dimension of a code review. One job: will the next person (or agent) understand and safely change this code. This is the lens that catches AI slop — plausible-looking code that is bloated, over-abstracted, or restates itself.

## Scope
Always applies. Judge against the project's existing conventions and altitude, not personal taste.

## Checklist — work each item
For each: checked → finding, or "checked, clean".

- **Complexity:** functions are focused; no deeply nested conditionals; cyclomatic complexity reasonable; long functions split by responsibility.
- **Coupling:** modules depend on contracts, not internals; business logic separated from infrastructure; no hidden global state.
- **Naming:** names say what the thing is/does; no `data2`, `tmp`, `handler3`; consistent with project vocabulary.
- **Abstraction:** no abstraction introduced for a single use; no premature generalization; three similar lines beat a wrong wrapper.
- **Duplication:** no copy-paste that should be one function — but not deduplicated into a leaky helper either.
- **AI-slop patterns:** no comments restating the code (`// increment i`); no defensive handling for impossible cases; no unused params/flags "for flexibility"; no scaffolding that does nothing.
- **Dead code:** no commented-out blocks; no unreachable branches; no unused exports introduced by this change.

## Evidence discipline (anti-slop)
- Each finding cites `path/file:line`, why it costs maintainability, and the simpler shape.
- Maintainability findings are MEDIUM/LOW — flag, do not inflate to blockers. Distinguish "this is wrong" from "I would have done it differently".

## Output
```
COMPLEXITY: {PASS | FINDINGS}
- [MED] `path/file:line` — {what makes it hard to maintain} → {simpler shape}
```
Rarely blocks. Surfaces should-fix maintainability debt before it compounds.
