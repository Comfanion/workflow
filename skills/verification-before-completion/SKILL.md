---
name: verification-before-completion
description: The completion gate. Iron Law: NO COMPLETION CLAIM WITHOUT FRESH VERIFICATION EVIDENCE — run the command that proves the claim *this turn*, read its full output and exit code, and only then state the result. Fire this whenever you are about to say work is done, fixed, passing, ready, green, or "works"; before committing, pushing, opening a PR, merging, deploying, or handing off to another agent/role; and especially when you catch yourself writing "should pass now", "probably fixed", "seems to work", or "the subagent said it succeeded". A previous run does not count (the code changed since) and a dispatched agent's own success report is a claim, not evidence — re-inspect the diff. If the check genuinely cannot run, do not claim done; name the gap and downgrade ("unverified, run `<cmd>` to confirm"). Does NOT decide what to build, review, or test, and does not itself execute or report test suites — `test-execution` produces the output this gate reads, `systematic-debugging` owns the verify step inside its own loop, and `code-review` issues quality verdicts. This skill only decides whether you have earned the right to call something done.
---

# Verification Before Completion

Claiming work is complete without verifying it is not efficiency — it is a false statement that the next person acts on. The whole point of an agentic pipeline is that one role's "done" is another role's input; if "done" is a guess, the error propagates downstream and surfaces far from where it was made, where it is most expensive to trace. This skill is the gate that stops a guess from being reported as a fact.

It is deliberately narrow: one rule, applied without exception. Every other skill produces work; this one decides whether you are allowed to call that work finished.

## The Iron Law

```
NO COMPLETION CLAIM WITHOUT FRESH VERIFICATION EVIDENCE
```

If you have not run the verifying command *in this turn* and read its output, you cannot claim the thing it would verify. A previous run does not count — the code changed since then, which is the whole reason you ran it. "It should pass now" is not evidence; it is a hope wearing the costume of a fact.

## The gate function

Run this before any status claim or expression of satisfaction:

1. **Identify** — what single command proves this claim? (test command, build, linter, curl, the actual repro of the original bug)
2. **Run** — execute the full command, fresh and complete. Not a subset, not a cached result.
3. **Read** — the full output, the exit code, the failure count. Not the last line; the whole thing.
4. **Verify** — does the output actually confirm the claim?
   - If no → state the real status, with the output as evidence.
   - If yes → state the claim, with the output as evidence.
5. **Only then** — make the claim.

Skipping any step is not verifying — it is asserting and hoping. The order is fixed: evidence comes before the claim, never after.

## What each claim actually requires

A claim is only proven by evidence of the right kind. These are the common substitutions that feel like proof but are not:

| Claim | Proven by | NOT proven by |
|-------|-----------|----------------|
| Tests pass | Test command output: 0 failures, exit 0 | A previous run · "should pass" · partial run |
| Linter clean | Linter output: 0 errors | Tests passing · checking one file |
| Build succeeds | Build command: exit 0 | Linter passing · "logs look fine" |
| Bug fixed | The original symptom re-run: gone | Code changed · "this addresses it" |
| Regression test works | Red→green cycle observed (fails before fix, passes after) | Test passes once after the fix |
| Requirement met | Line-by-line check against the criteria | Tests pass · "I covered that" |
| Subagent completed | The diff / output inspected directly | The subagent's own success report |

The last row is the one most easily missed in this toolkit: a dispatched agent reporting "done" is a *claim*, not evidence. The dispatcher verifies the actual change (the diff, the files, the output) before accepting it — see `orchestration-subagent`.

## Red flags — stop before you send it

If you catch any of these in your draft, you are about to claim without proof:

- The words "should", "probably", "seems to", "looks like it works"
- Satisfaction ahead of evidence — "Great!", "Perfect!", "Done!", "Works!" — with no command output above it
- About to commit / push / open a PR without a verification run in this turn
- Trusting a subagent's success report instead of checking the diff
- Leaning on a partial check ("the linter passed, so…")
- "Just this once" / "I'm confident" / "I'm tired and want this finished"
- Any phrasing that *implies* success while sidestepping the rule on a technicality

All of these mean the same thing: **stop, run the command, read the output, then write the claim.**

## Common rationalizations

| Excuse | Reality |
|--------|---------|
| "Should work now" | Then running it costs nothing and proves it. Run it. |
| "I'm confident" | Confidence is not evidence. The command is. |
| "Just this once" | The one time you skip is the time it was broken. No exceptions. |
| "The linter passed" | A linter does not compile or run the code. Different claim, different proof. |
| "The agent said it succeeded" | Agents report intent, not outcome. Verify the diff independently. |
| "I already ran it earlier" | The code changed since — that is why you edited it. Re-run. |
| "Partial check is enough" | A partial check proves the part you ran, nothing more. |
| "Different wording, so the rule doesn't apply" | Spirit over letter. Any implication of success is a claim. |

## When you cannot verify

Sometimes the check genuinely cannot be run — no environment, no access, no credentials. That is a valid state; pretending otherwise is not. Say so explicitly and downgrade the claim: "I changed X; I could not run the suite here, so this is unverified — run `<command>` to confirm." Naming the gap honestly is correct. Reporting "done" over an un-run check is the failure this skill exists to prevent.

## Roles

Cross-cutting — every authoring and executing role passes through this gate before reporting completion, and every conducting role (`secretary`, `orchestrator`) applies it to what its subagents return rather than trusting their reports. It is the shared definition of "done" across the pipeline: the developer before claiming a story is implemented, the tester before claiming the suite is green, the reviewer before claiming a fix landed, the devops role before claiming a deploy succeeded. No role signs off its own work on a claim alone — the gate wants the output.

## Related

- `systematic-debugging` — its final phase (verify the fix) is this gate applied to a bug.
- `doc-impact` — a fix's completion claim includes its declared doc-impact verdict; a closed fix with no verdict file is not done.
- `orchestration-subagent` — the dispatcher verifies a subagent's diff here rather than trusting its report.
- `test-execution` — produces the test output that this gate reads for the "tests pass" claim.
- `code-review` — a review verdict is a claim; it too rests on evidence (`path:line` findings), not impression.
