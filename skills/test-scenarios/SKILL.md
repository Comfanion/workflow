---
name: test-scenarios
description: Use when the user wants to enumerate the concrete test cases and scenarios for a feature — the actual inputs, expected results, and edge/abuse/boundary cases to run, with real data (not placeholders). Triggers: "test cases", "test scenarios", "edge cases", "boundary cases", "negative tests", "what should I test", "what am I missing", "cover this case", "what inputs do I throw at this", "what else could break", "stress cases". Author cases at any point — before coding (TDD), during, or after a bug — and trace each to an acceptance criterion in a coverage matrix. Do NOT fire for: deciding test strategy/levels or unit-vs-integration (that is `test-design`); writing the upstream Given/When/Then acceptance criteria (that is `acceptance-criteria`); or running/executing the tests and reporting pass-fail or coverage numbers (that is `test-execution`). This skill produces the case list; it neither plans the levels nor runs them.
---

# Test Scenarios

This skill answers one question: **given everything we now know about this feature — including what we learned while building it — what are the concrete cases someone must actually run to trust it?** The output is a list of test cases, each with concrete input data and an expected result, traced back to the acceptance criteria it proves.

The failure mode this skill exists to kill is the test suite that only walks the happy path with round-number inputs. Real bugs hide at boundaries, in invalid input, in the order of state changes, and in combinations nobody pictured. Finding those cases is a skill with named techniques — not inspiration — and this document teaches them.

Cases are cheapest to capture the moment they appear. When you write a branch, a guard, a parse, or a state change, a test case is staring back at you: the input that takes the other branch, the value one past the limit, the field that arrives null. Write it down then, while the context is loud, instead of reconstructing it from memory at the end.

## Where this sits

- **test-design** decides STRATEGY: which levels (unit/integration/E2E), what to mock, coverage targets. It hands you a plan.
- **This skill** fills that plan with CONCRETE CASES: the exact inputs, the exact expected outputs, the edge and abuse cases, the coverage view back to acceptance criteria.
- **acceptance-criteria** writes the Given/When/Then ACs upstream. Your scenarios trace *to* those ACs — they do not restate them, and you do not invent new criteria here.

If you find yourself deciding "should this be a unit or integration test?", that is test-design's call. If you find yourself writing the canonical Given/When/Then for a requirement, that is acceptance-criteria. Stay in your lane: enumerate cases.

## Start from the acceptance criteria

Get the acceptance criteria for the feature first (default `{DOCS_ROOT}/acceptance-criteria/`; honor the project's configured docs location). Each criterion is a promise; your job is to turn it into one or more runnable cases with real data. A criterion with no concrete case behind it is an unproven promise — list it as a gap.

The coverage view back to the criteria is the backbone of the deliverable. It makes "what is still untested?" answerable at a glance and stops the suite from drifting into cases nobody asked for.

## Techniques that find non-obvious cases

Walk these deliberately for each behavior. Each one targets a class of bug the happy path never reaches. Do not pick one — they compound.

### Equivalence partitioning

Group inputs into classes that the code treats the same, then test one representative per class instead of every value. Why: testing 50 valid ages proves no more than testing one; the leverage is in covering *every distinct class* — valid, too-low, too-high, wrong-type, missing — with one case each. Missing a partition, not under-sampling one, is what ships bugs.

### Boundary-value analysis

For every range and limit, test the boundary and its immediate neighbors: min, min−1, min+1, max, max−1, max+1, plus zero and empty. Why: off-by-one and `<` vs `<=` errors live exactly here and nowhere else. A range `1..100` needs `0, 1, 2, 99, 100, 101` — the partition test alone (one mid value) would sail past all six.

### Error guessing

Deliberately feed the inputs experience says break things: null, empty string, whitespace-only, zero, negative, huge numbers, Unicode and emoji, very long strings, leading/trailing spaces, wrong type, duplicate keys, malformed dates, SQL/HTML metacharacters. Why: these are the inputs the author never typed by hand, so they were never exercised once.

### State-transition coverage

When an entity has states (draft → pending → active → archived), enumerate every legal transition *and* every illegal one. Test that legal transitions work and illegal ones are rejected without side effects. Why: code usually guards the transitions the author imagined and silently allows the ones they forgot — e.g. archiving an already-archived record, or paying an order twice.

### Decision tables

When an outcome depends on several conditions, lay them out as a table of condition combinations and derive one case per row. Why: with 3 booleans there are 8 combinations and the happy path tests one of them; the table forces the other 7 into view, including the contradictory ones the code must handle.

### Negative and abuse cases

Beyond invalid input, test active misuse: missing/expired/forged credentials, accessing another user's resource, replaying a request, oversized payloads, concurrent conflicting writes, injection attempts. For each, assert *both* the rejection (right status/error) *and* the absence of side effects (nothing saved, nothing charged, nothing leaked). Why: a feature that works for its author often works for an attacker too until someone checks.

## Make every case concrete

A case with placeholder data is not a test — it is a wish. Each case carries:

- **Concrete input** — the actual values, not "an invalid email" but `"foo@"`, `""`, `"a@b"`, `"name@domain"` (no TLD).
- **Concrete expected result** — the exact status, message, persisted state, or emitted event. "Returns an error" is not enough; "returns 400 with `email: invalid format` and persists nothing" is.
- **The criterion it covers** — the AC id, so coverage stays auditable.
- **Setup/preconditions** — the state the system must be in, written so a stranger can reproduce it.

Vague data hides bugs because the runner unconsciously picks the value that passes. Pin the data and the case starts earning its keep.

## Capture cases as the code is written

This is the part most teams skip. As implementation proceeds, each new branch, validation, integration, or domain rule surfaces specific cases that no upfront plan could predict — the third enum value someone added, the timezone the date parser chokes on, the partial-failure path in a multi-step write. Add these to the scenarios document *as they appear*. Treat the document as living during development, frozen at the QA gate. The domain edge cases that matter most are usually discovered, not designed.

## Output

Write the scenarios to `{DOCS_ROOT}/test/<feature>-scenarios.md` (`{DOCS_ROOT}` defaults to `docs/` at the project root; honor the project's configured docs location if one is set). Use the structure in `references/template.md` (load when authoring the document): it groups cases by behavior, carries the concrete-data columns, and ends with a coverage matrix mapping every acceptance criterion to the cases that prove it, so any uncovered criterion is visible immediately.

## Quality bar

Before calling the scenarios complete:

- Every acceptance criterion maps to at least one concrete case in the coverage matrix.
- Every range/limit has boundary and neighbor cases, not just a mid value.
- Each input partition (valid, each invalid class, missing, wrong-type) has a representative case.
- Stateful behavior lists both legal and illegal transitions.
- Negative/abuse cases assert rejection *and* no side effect.
- Every case has concrete input data and a concrete expected result — no placeholders.
- Cases discovered during development were folded back in, not lost.

## Roles

This skill serves the tester / QA role (on a team, the QA engineer; solo, you wearing that hat) and is the primary authoring step of QA. It consumes acceptance criteria and produces the case list that test-execution later runs and gates on. The author of the cases does not sign off their own coverage — the scenarios are reviewed alongside the code they cover.
