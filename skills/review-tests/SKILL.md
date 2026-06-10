---
name: review-tests
description: Review the tests of a code change only — coverage of happy and error/edge paths, test quality, missing cases, fake or tautological assertions, shared-state ordering bugs, and whether the suite actually runs green. Use when running the test dimension of a code review, when the user says "review the tests", "is this tested", "check coverage", or when code-review dispatches the test pass. One focused lens — it does not judge production logic, security, or style; it returns test findings with a dimension verdict.
---

# Review — Tests

The test dimension of a code review. One job: do the tests actually prove this change works — or do they just exist to make coverage look green. Happy-path-only and fake-assert tests hide exactly the bugs that reach production.

## Scope
Applies to any change that adds or alters behavior. Pure formatting/docs → PASS. If behavior changed but no test changed, that itself is a finding.

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
