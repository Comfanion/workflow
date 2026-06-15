---
name: standards-testing
description: Author and maintain the project's testing standards artifact — testing pyramid, coverage targets per layer, test types and where they live, naming, Arrange-Act-Assert structure, mocking guidelines, and the quality gates. Use this whenever the user wants to "write the testing standards", "set coverage targets", "define test naming", "document the test pyramid", or mentions "testing standards", "coverage policy", "test types", or "mocking rules". Authors `{DOCS_ROOT}/standards/testing.md`. The source of truth for `review-tests`, `test-design`, and `dev`'s red-green-refactor loop; keep production code conventions in `standards-coding`.
---

# Standards — Testing

The testing standards artifact answers four questions every developer agent needs before writing a test: **what to test, where it lives, how to name it, and when it is enough.** Without a written answer, every story re-decides — and the cheap habit (assert the happy path only) wins every time.

The artifact lives at `{DOCS_ROOT}/standards/testing.md`. `{DOCS_ROOT}` defaults to `docs/`. Target size: **8-15 KB**.

This artifact is the source of truth for `review-tests`. If a test review repeatedly flags the same gap (e.g. error-path coverage missing), the fix is to update this artifact, not to keep flagging it.

## What this artifact must cover

1. **Testing philosophy** — one sentence on what the project optimizes for (e.g. "domain coverage first, integration second"), plus the pyramid (unit / integration / E2E / load) tuned to the stack.
2. **Coverage targets per layer** — a table (domain / application / interfaces / infrastructure). Blanket "80% coverage" pushes effort to the cheap-but-low-value tests; per-layer targets land effort where bugs are most expensive.
3. **Test types and locations** — for each type (unit, integration, HTTP handler, E2E, load): location, dependencies, speed budget, what to test, the canonical pattern.
4. **Naming** — file pattern and test-name pattern. Test names should state the scenario and the expected outcome.
5. **Structure** — Arrange-Act-Assert (or Given-When-Then) as the default; table-driven where the stack supports it.
6. **Mocking guidelines** — when to mock (repos, external APIs, time, randomness) and when not (domain logic — never).
7. **Test data** — builders / factories / golden-file rules. Inline literal data does not scale past two tests.
8. **Quality gates** — what blocks merge (overall coverage floor, domain coverage floor, race detector, any failure, flake). The gate is what makes the targets real.

## How to write it

1. **Read the architecture and `standards-coding`.** Layer names in the coverage table must match the layering in `coding.md`. If they diverge, the rules will be interpreted inconsistently.
2. **Anchor targets to the architecture, not to fashion.** A domain-rich service deserves a 90%+ domain target; a thin CRUD shell does not. Pick targets the project can defend in review.
3. **Draft from `references/template.md`.** Replace every placeholder; do not ship a template with `{{...}}` still in it.
4. **Validate via `references/checklist.md`.**

## Coverage targets — sensible baselines

Adjust to the project; document the reason for any deviation in the artifact.

| Layer | Minimum | Target | Why |
|-------|---------|--------|-----|
| Domain | 90% | 100% | Pure code, no mocks; this is where the rules live |
| Application / use cases | 70% | 80% | Orchestration; mock the ports |
| Interfaces (HTTP handlers, RPC) | 60% | 70% | Parse / validate / format — thin |
| Infrastructure (repos, clients) | 50% | 60% | Integration-tested, not unit-tested |
| Overall | 75% | 85% | Aggregate, not a primary target |

## Test types — what to capture per type

For each type the artifact must list, capture: **location**, **dependencies**, **speed budget**, **what to test**, **canonical pattern**. The reference template has slots for each.

- **Unit (domain):** no I/O, pure code, < 1 ms per test, table-driven.
- **Application / use case:** mock the ports, test orchestration, < 10 ms per test.
- **Integration:** real DB or message broker via testcontainers, 100 ms – 1 s, only for repositories and external contracts.
- **HTTP / RPC handler:** mock the service, test request parsing and response shape, < 50 ms.
- **E2E:** the critical user flow only, 1–10 s, kept small on purpose.
- **Load:** k6 / Locust / artillery; throughput, p50/p95/p99, error rate, resource use.

## Quality gates

A coverage number that does not block merge is decoration. The gate must include:

- Overall coverage below the floor → block merge.
- Domain coverage below the floor → block merge (this is where bugs hurt most).
- Any test failure → block merge.
- Race detector failure → block merge.
- A new behaviour without a new test → block merge.

The `review-tests` skill enforces these by reading this artifact.

## Update protocol

- A flake escapes → file the rule that makes flakes block merge.
- A class of bug repeatedly slips past tests → add the failure pattern to the "what to test" list for the relevant type.
- Coverage drifts down for a quarter → either raise the floor again or write down why the lower number is now acceptable.
- A new test type appears (contract tests, mutation tests) → add a new "Test types" subsection with location and pattern.

## Templates and references

- `references/template.md` — full `testing.md` template.
- `references/checklist.md` — validation checklist for the artifact.

## Who reads this artifact

- `dev` — every red-green-refactor cycle (via `using-standards`).
- `test-design` — when planning the test plan for a story or epic.
- `test-execution` — when running the suite and reporting results.
- `review-tests` — to judge coverage and quality of new tests.

## Roles

Authored by the tech lead or QA lead; reviewed by the project owner. Updated by anyone who finds a recurring gap.

## Related

- `standards` — umbrella router.
- `standards-coding` — production-code conventions sibling.
- `using-standards` — consumer protocol.
- `review-tests`, `test-design`, `test-execution`, `test-scenarios` — downstream consumers.
