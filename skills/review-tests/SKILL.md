---
name: review-tests
description: Review the test side of a code change only — and distinguish this from running tests, planning a strategy, or writing cases. Use when the user says "review the tests", "review the test suite", "are the tests any good", "is this actually tested", "check test coverage", "are the edge/error paths tested", "are these assertions real", or when code-review dispatches its test dimension. It judges: happy vs error/edge coverage, missing cases for new behavior, fake/tautological assertions, shared-state and ordering bugs, and whether the suite actually runs green (it runs the suite as evidence, not as the deliverable). Do NOT use for running tests as a QA gate (that is `test-execution`); planning test strategy/levels (that is `test-design`); authoring concrete test cases (that is `test-scenarios`); or judging production logic, security, or style. One focused lens within a multi-dimension review — returns test findings with a TESTS verdict.
---

# Review — Tests

The test dimension of a code review. One job: do the tests actually prove this change works — or do they just exist to make coverage look green. Happy-path-only and fake-assert tests hide exactly the bugs that reach production.

## Scope
Applies to any change that adds or alters behavior. Pure formatting/docs → PASS. If behavior changed but no test changed, that itself is a finding.

## Source of truth: `{DOCS_ROOT}/standards/testing.md`
The project's `standards-testing` artifact owns the coverage targets per layer, the test types and locations, the naming, and the quality gates — load it via `using-standards` before reviewing. The checklist below is the **baseline** when no artifact exists; if `testing.md` exists, its per-layer floors and gate rules win over these defaults.

## Checklist — work each item
For each: checked → finding, or "checked, clean".

- **Coverage of paths:** new code has unit tests; the error and edge paths are tested, not only the happy path. Name untested branches.
- **Integration:** cross-component interactions have integration tests, not just isolated units.
- **Assertion quality:** assertions check the actual outcome — no tautologies (`assert x == x`), no asserting a mock was called instead of a result, no missing assertion.
- **Independence:** tests don't depend on order or shared mutable state; no hidden coupling via globals/fixtures.
- **Naming:** test names state what they assert.
- **It runs:** run the suite (`go test` / `npm test` / `pytest` / `cargo test`). A failing or flaky suite is HIGH — a green build is the floor, not a bonus.

## Evidence discipline (anti-slop)
- Each finding cites the test file:line (or the untested production `path/file:line`), the gap, and the case to add.
- Quote the suite result you observed — do not claim "tests pass" without running them.

## Output
```
TESTS: {PASS (n/n) | FINDINGS | FAIL — detail}
- [HIGH] `path/file:line` — {untested path or fake assert} → {test to add}
```
A failing suite or an untested error path on core logic is HIGH. PASS only after the suite was actually run green.
