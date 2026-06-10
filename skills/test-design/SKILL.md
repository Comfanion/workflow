---
name: test-design
description: Design a test strategy and write the test cases that prove a feature works — pick test levels (unit/integration/E2E), cover happy/error/edge/auth paths, and map each acceptance criterion to a concrete test. Use this whenever the user wants to design tests, build a test plan, write test cases, decide a test strategy, or asks "what should I test". This is for deciding what to test and how — not for running an existing suite or debugging a specific failing test.
---

# Test Design

Test design answers one question before any test is written: **what must be true for this feature to be considered correct, and how do we prove each of those things cheaply and reliably?** The output is a plan — which behaviors get tested, at which level, with which inputs — that traces back to the acceptance criteria. Tests written without that plan tend to cluster around the easy happy path and miss the error, edge, and auth cases where real bugs live.

The most common failure is testing implementation instead of behavior: asserting on internal calls and private state so that any refactor breaks the suite even when behavior is unchanged. Test what the code *does* (observable inputs and outputs), not *how* it does it. The second most common failure is chasing a coverage number instead of covering the cases that matter — 100% line coverage with no error-path tests is worse than 70% that exercises every failure mode.

## The Iron Law

```
EVERY ACCEPTANCE CRITERION MAPS TO A TEST; TEST BEHAVIOR, NOT IMPLEMENTATION
```

A criterion with no test is an unproven requirement — that is the gap this skill exists to close, so the mapping is not optional. And a test that asserts on internal calls or private state proves nothing about correctness; it just pins the current implementation and breaks on every refactor. If you cannot test a behavior without reaching into internals, the design is too coupled — that is a finding, not a reason to test the internals.

## Start from acceptance criteria

Tests exist to prove acceptance criteria hold. Before designing, get the acceptance criteria for the feature (default location `{DOCS_ROOT}/acceptance-criteria.md`; honor the project's configured docs location if one is set). If they don't exist, that is a gap — flag it, because untraceable tests are how requirements silently go unverified.

Map every acceptance criterion to at least one test case. The mapping is the deliverable's backbone: it makes coverage auditable (which criterion is unproven?) and prevents both gaps (a criterion with no test) and noise (tests that prove nothing anyone asked for). Each test case names the criterion it covers, the level it runs at, the input, and the expected result.

## Pick the right level for each behavior

Three levels, each with a different cost and a different thing it can prove. Choosing the wrong level wastes time: an E2E test for a calculation is slow and flaky where a unit test is instant and precise; a unit test for a database contract proves nothing because the real database isn't there.

- **Unit** — one component in isolation, no real I/O. Fast (milliseconds), so you can afford many. This is where business logic, calculations, validation rules, state transitions, and error handling belong. Don't test private methods, getters/setters, or framework internals here — you'd be testing implementation, not behavior.
- **Integration** — multiple components together across a real boundary: module contracts, API endpoints, database operations, event publish/consume, external service calls. Medium cost (seconds). This is the only level that proves the wiring between parts actually works. Don't re-test business logic here (unit already did) or UI rendering (E2E does).
- **E2E** — a complete user scenario through the running system. Slow (minutes) and the most brittle, so keep them few: critical user flows, happy paths, smoke tests. Don't push edge cases or error scenarios down here — they belong at lower levels where they run fast and pin failures precisely.

Follow the test pyramid: many unit tests, fewer integration tests, fewest E2E. The shape matters because it keeps the suite fast and stable — an inverted pyramid (mostly E2E) is slow to run and breaks on unrelated changes, so people stop trusting it.

## Cover four case classes for every behavior

For each behavior under test, deliberately walk these four classes. The happy path alone is a false sense of safety — most production incidents come from the other three.

- **Happy path** — valid input, expected output. Proves the feature does its job at all.
- **Error cases** — invalid input, missing fields, failed dependencies. Proves the system fails safely instead of corrupting data or leaking internals. For each error, assert *both* the user-visible result (e.g. 400 with a clear message) and that no side effect happened (nothing saved, no event published).
- **Edge cases** — boundaries and degenerate inputs: empty, null, zero, min, max, just-over-the-limit, duplicates, concurrent access. Bugs hide at boundaries because off-by-one and empty-collection handling are exactly the cases the happy path never exercises.
- **Auth cases** — for anything access-controlled: no credentials (expect 401), valid credentials but wrong role/ownership (expect 403), expired/malformed token (expect 401). Skipping these is how authorization holes ship — a feature that works for the author often silently works for everyone.

## Coverage targets, not coverage worship

Use targets to find under-tested layers, not as a goal in themselves. Critical, hard-to-recover logic (payments, auth, data integrity) earns the most tests regardless of percentage; trivial pass-through code earns the least.

| Layer | Target | Why this level |
|-------|--------|----------------|
| Domain / business logic | 80%+ | Highest bug cost, cheapest to unit-test |
| Application / use cases | 70%+ | Orchestration; integration-tested |
| Infrastructure / adapters | 50%+ | Thin wrappers; test the contract, not the library |
| API endpoints | 60%+ | Request/response + auth boundary |
| UI | 40%+ | Critical flows only; E2E is expensive |

Scale the targets to project size — a throwaway prototype warrants less than a payments platform. The detail guide on strategy carries size-tiered numbers.

## How to write each test

- **Structure: Arrange → Act → Assert.** Set up state, perform the one action under test, then assert. One logical behavior per test — when it fails, the name and the single assertion tell you exactly what broke, with no detective work.
- **Name by intent:** `{Component}_{Method}_{Scenario}_{Expected}`, e.g. `Order_CalculateTotal_EmptyOrder_ReturnsZero`. A failing test name should read as a sentence describing the broken behavior, so a red CI line is self-explaining.
- **Isolate:** each test sets up its own data, shares no state, cleans up after itself, and passes in any order. Order-dependent tests produce failures that only reproduce sometimes — the most expensive kind to debug.
- **Mock the right things:** mock external services, non-determinism (time, random), and slow I/O — things outside the unit's control. Do *not* mock your own domain logic or pure functions; that just asserts the test's own assumptions. Prefer a fake (a working in-memory implementation) over a pile of mocks — fakes are less brittle and survive refactors.

## When to write tests

Write tests first (TDD: red → green → refactor) when requirements are clear and the logic is non-trivial, or when fixing a bug — a failing test that reproduces the bug is the proof the fix works and a guard against regression. Write tests after when prototyping or exploring, where requirements are still moving and a test would just lock in a guess. Either way, the success criterion is the same: the tests run, they fail before the change and pass after, and every acceptance criterion traces to at least one passing test.

## Detail guides and templates

Load these only when the situation calls for them, to keep this skill lean:

- Test strategy depth — pyramid rationale, size-tiered coverage targets, cost/benefit triage, CI staging. Load when planning a suite for a whole project or deciding coverage budgets: `test-strategy.md`.
- Unit test fundamentals — what to test, AAA, naming. Load when writing your first unit tests for a component: `unit-tests.md`.
- Unit test patterns — table-driven tests, state-transition tests, validation, boundary cases. Load when a behavior has many input/output combinations or is a state machine: `unit-tests-patterns.md`.
- Mocking and isolation — dependency injection, test doubles (stub/mock/spy/fake), avoiding mock hell. Load when a component has external dependencies you must isolate: `unit-tests-mocking.md`.
- Module test-case template — domain/use-case/API/event/DB test matrices for one module. Load when documenting a module's full test plan: `references/template-module.md`.
- Integration test template — module contracts, events, DB, API boundary, auth, NFR verification. Load when specifying integration tests against an architecture: `references/template-integration.md`.

## Red flags — stop, this plan won't prove correctness

- An acceptance criterion with no test case mapped to it
- Asserting on private methods, internal calls, or getters/setters instead of observable behavior
- Only happy-path cases — no error, edge, or auth cases for a behavior that has them
- An E2E test doing a unit test's job (a calculation, a validation rule) — slow, flaky, imprecise
- Chasing a coverage percentage as the goal rather than covering the cases that carry risk
- Mocking your own domain logic or pure functions — that asserts the test's own assumptions
- "It worked when I tried it" offered in place of an automated, re-runnable test

## Roles

This skill serves the tester / QA role (on a team, the QA engineer; solo, you wearing that hat). It consumes the acceptance criteria as its source of truth and drives the testing gate: the feature is not done until every criterion traces to a passing test. The test plan is reviewed alongside the code it covers — the author does not sign off their own coverage. For the broader workflow and role definitions, see the project conventions guide.
