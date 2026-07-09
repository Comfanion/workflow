---
name: test-execution
description: Run the test plan or scenarios, record results, report defects with clear repro steps and expected-vs-actual, and own the QA gate — a PASS/FAIL verdict backed by evidence (what ran, what passed, what is still open) before work can ship. Use whenever the user wants to "run the tests", "execute the test plan", asks about the "qa gate", a "test report", whether something "is ready to ship", or to "verify the build". This executes and gates; it does not author the cases (that is test-scenarios) and does not write fixes.
---

# Test Execution

This skill answers one question: **did the feature actually pass, and what is the evidence?** It takes the authored scenarios, runs them, records what happened, files clear defects for what broke, and issues a PASS/FAIL verdict for the QA gate. Until that verdict exists with evidence behind it, the work is not shippable — "the code compiles" and "the tests pass on my machine" are not gates.

The failure mode this skill exists to prevent is the soft yes: "looks good, ship it" with no record of what ran, what was skipped, or what is still open. A gate that cannot be audited is not a gate. Every verdict here must point at the cases that ran and the results they produced.

## Where this sits

- **test-scenarios** authored the concrete cases. You execute them — you do not invent new ones here (if you discover a missing case, note it and route it back to scenarios; do not silently patch it in).
- **You do not write fixes.** When a case fails, you file a defect with enough detail for someone else to reproduce and fix it. Fixing is the dev role's job; re-running after the fix is yours.
- The verdict you produce is the gate that downstream release/merge depends on.

## Run the plan, record every result

Execute the cases from the scenarios document and the test plan. For each case, record one of:

- **Pass** — ran, matched the expected result.
- **Fail** — ran, did not match. File a defect (below).
- **Blocked** — could not run (environment down, dependency missing, prerequisite case failed). Record why; a blocked case is not a pass.
- **Skipped** — deliberately not run this cycle. Record the reason; an unexplained skip reads as a hidden gap.

Record results against the same case ids the scenarios use, so the report ties straight back to the coverage matrix and "what is unproven" stays answerable.

## Report defects so they can be fixed without you

A defect report that the fixer has to come back and ask about has failed at its one job. Each defect carries:

- **Repro steps** — the exact sequence, with the concrete input data, that triggers it. A defect nobody can reproduce cannot be fixed or verified.
- **Expected vs actual** — what the case said should happen, and what actually happened, side by side. The gap is the bug.
- **Severity** — how much it hurts, so triage can prioritize:
  - **Critical** — data loss/corruption, security hole, or a core flow completely broken; blocks the gate outright.
  - **Major** — a key feature broken or wrong, with no acceptable workaround.
  - **Minor** — a non-core feature wrong, or a clumsy but survivable workaround exists.
  - **Trivial** — cosmetic; does not affect behavior.
- **Environment** — where it happened (build/commit, OS, config), since some defects are environment-specific.
- **Evidence** — the failing output, log line, screenshot, or stack trace. Quote it; do not paraphrase.

Severity drives the gate: an open Critical or Major is a FAIL by default. State the rule you are applying so the verdict is not a judgement call.

## The QA gate: PASS / FAIL with evidence

The gate is the deliverable. It is a binary verdict — the work either ships or it does not — backed by an auditable record:

- **What ran** — the cases executed, with their pass/fail/blocked/skipped counts.
- **What passed** — and therefore which acceptance criteria are now proven.
- **What is open** — failing cases and their defects, with severity; blocked and skipped cases with reasons.
- **Coverage** — which acceptance criteria remain unproven (any criterion with no passing case is a gap).
- **Verdict** — PASS or FAIL, with the rule that produced it (e.g. "FAIL: 1 open Critical defect; 2 ACs unproven").

PASS means: every in-scope case ran, no open Critical/Major defects, and every acceptance criterion traces to a passing case. Anything less is FAIL with the specific blockers named and the concrete next action for each. A PASS with caveats is a FAIL wearing a disguise — do not issue one.

## Output

Write the report to `{DOCS_ROOT}/validation/test-report-<date>.md` (`{DOCS_ROOT}` defaults to `docs/` at the project root; honor the project's configured docs location if one is set). Use the structure in `references/template.md` (load when writing the report): it carries the run summary, the per-case result table, the defect entries, the coverage view, and the verdict block.

## Integration gate — the build-and-suite check before review

Before a story can move to `review`, two checks must produce green output, observed in the current turn:

1. **Build command exits 0** — the codebase compiles and links as a unit (typically `make build`, or the project's equivalent). A build that succeeds for individual files but fails when wired together is a FAIL — "the code is not connected" is the failure mode this gate exists to catch.
2. **Full test suite exits 0** — no failures, and no skips without a stated reason.

Quote the actual command output in the test report. "It should build now" and "tests probably pass" are not evidence — they are the same rationalizations `verification-before-completion` exists to stop. The orchestrator reads this evidence before transitioning the story; without it, the story stays in `in_progress`.

This gate is **upstream of the QA PASS/FAIL verdict** — it answers "is the code wired and green?" before the QA verdict answers "does it meet the acceptance criteria?". A story can clear the integration gate and still FAIL the QA verdict (a passing suite that does not yet cover a criterion); it cannot clear the QA verdict without first clearing the integration gate.

## Quality bar

Before issuing the verdict:

- Every in-scope case has a recorded result (pass/fail/blocked/skipped) — no silent gaps.
- Every fail has a defect with repro steps, expected-vs-actual, severity, and quoted evidence.
- Blocked and skipped cases carry a stated reason.
- The coverage view shows which acceptance criteria are proven and which are not.
- The verdict is PASS or FAIL — not "mostly" — with the deciding rule stated.
- The evidence is quoted output you observed, not a claim that it passed.

## Roles

This skill serves the tester / QA role (on a team, the QA engineer; solo, you wearing that hat) and owns the QA gate. It consumes the cases authored by test-scenarios and runs against the build the dev role produced. The verdict gates release — but the gate-holder does not fix the defects they find, and does not sign off their own gate without the evidence record behind it.
