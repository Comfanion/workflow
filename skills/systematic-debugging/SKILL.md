---
name: systematic-debugging
description: Find the root cause of a bug before changing any code — read the error, reproduce it, trace the bad value back to its source, form one hypothesis, test it minimally, then fix the source and prove it. Use this whenever you hit a bug, a test failure, a crash, a build break, or any unexpected behavior, and especially when a previous fix did not hold or you are tempted by a quick patch. This decides how to diagnose a failure — it does not design features, write the test suite, or review finished code.
---

# Systematic Debugging

Random fixes waste time and breed new bugs. A patch applied to a symptom you do not understand either does nothing or moves the failure somewhere you will not think to look. The slow-feeling, disciplined path is the fast one: in practice a systematic pass fixes in minutes what guess-and-check thrashes at for hours, and it fixes it once.

This skill is rigid. The phases are ordered and gated — you do not get to skip ahead because the bug "looks simple". Simple bugs have root causes too, and the process is cheap when the bug really is simple.

## The Iron Law

```
NO FIX WITHOUT ROOT-CAUSE INVESTIGATION FIRST
```

If you have not completed Phase 1, you may not propose a fix. "I see the problem, let me just change this" is the exact thought this law exists to stop — seeing a symptom is not understanding a cause.

This connects directly to the root-cause discipline in the project conventions: map every place the bad state could originate *before* touching one of them. The "obvious" site is where the second source hides.

## The four phases

Complete each before the next. No shortcuts between them.

### Phase 1 — Root-cause investigation

Before attempting any fix:

1. **Read the error completely.** The full message, the full stack trace, line numbers, codes. The answer is often already written there; skipping past it is how people debug the wrong thing.
2. **Reproduce it reliably.** What exact steps trigger it? Every time, or intermittently? If you cannot reproduce it, you cannot know you fixed it — gather more data, do not guess.
3. **Check what changed.** Recent commits, new dependencies, config or environment differences. `git diff` is faster than speculation.
4. **Instrument the boundaries (multi-component systems).** When the failure crosses layers (API → service → DB, CI → build → sign), log what enters and exits each boundary, run once, and read *where* the data first goes wrong. This turns "something is broken" into "it breaks between layer 2 and layer 3" before you theorize.
5. **Trace the bad value backward.** Where does the wrong value originate? What passed it in? Keep walking up the call chain until you reach the source. You fix at the source, not where the symptom surfaced.

### Phase 2 — Pattern analysis

1. **Find working examples** of similar code in the same codebase. What works that resembles what is broken?
2. **Read the reference completely** if you are following a pattern — every line, not a skim. Partial understanding guarantees a subtly wrong copy.
3. **List every difference** between the working case and the broken one, however small. "That can't matter" is where the bug usually is.

### Phase 3 — Hypothesis and minimal test

1. **State one hypothesis, specifically:** "I think X is the root cause because Y." Write it down.
2. **Test it with the smallest possible change.** One variable. Do not fix three things at once — you will not know which mattered, and you may add two new bugs.
3. **If it was wrong, form a new hypothesis** — do not pile another fix on top of the failed one.

### Phase 4 — Fix and prove

1. **Write a failing test that reproduces the bug first** (red), in the codebase's test style. This is the same test-first discipline as `dev` — a fix with no test does not stick and invites the bug straight back.
2. **Fix the root cause, one change.** No bundled refactor, no "while I'm here" extras.
3. **Prove it** through the `verification-before-completion` gate: the new test passes (green), the original symptom is gone, and no other test broke. Run the commands; read the output.

## The 3-fix rule — when to stop and question the architecture

Count your fix attempts. If three have failed, **stop** — do not attempt a fourth.

Three failures, each revealing a new problem in a different place, or each requiring "massive refactoring", is not a run of bad luck. It is the signal that the architecture is wrong: the pattern is fundamentally unsound and you are sticking with it through inertia. This is not a failed hypothesis to retry — it is a design to reconsider. Raise it with the user before any further fix. (This mirrors the conventions' "a fix that returns was not a fix" — re-map the sources of truth from scratch, do not patch the symptom in a new place.)

## Red flags — stop and return to Phase 1

If you catch any of these thoughts, you have left the process:

- "Quick fix now, investigate later"
- "Just try changing X and see if it works"
- "Change several things at once, then run the tests"
- "Skip the test, I'll check it by hand"
- "It's probably X" — proposing a fix before tracing the data flow
- "I don't fully understand this, but this might work"
- "One more fix attempt" — when two have already failed
- Each fix surfacing a new problem somewhere else

All of them mean: **stop, go back to Phase 1.** Three failed fixes means: question the architecture.

## Common rationalizations

| Excuse | Reality |
|--------|---------|
| "The issue is simple, skip the process" | Simple bugs have root causes too. The process is fast for simple bugs. |
| "Emergency — no time for process" | Systematic is *faster* than guess-and-check thrashing. The clock is why you do it. |
| "Try this first, investigate if it fails" | The first fix sets the pattern. Do it right from the start. |
| "I'll write the test after I confirm the fix" | An untested fix does not stick. The failing test first is what proves the fix. |
| "Reference is long, I'll adapt the gist" | Partial understanding produces a subtly broken copy. Read it fully. |
| "I see the problem" | Seeing the symptom is not understanding the cause. Trace it. |

## When investigation finds no root cause

Occasionally a thorough pass shows the issue is genuinely external — timing, environment, a flaky upstream. Then: document what you investigated, implement appropriate handling (retry, timeout, a clear error), and add logging for next time. But assume incomplete investigation first — most "no root cause" verdicts are a Phase 1 that stopped early.

## Roles

Cross-cutting — any role hits bugs and runs this when it does, most often the developer mid-implementation and the tester when a case fails. It sits inside the `dev` loop (when a test won't pass, debug systematically rather than mutating code at random) and feeds the reviewer, who should distrust a fix that arrived with no reproduction and no root cause named.

## Related

- `verification-before-completion` — Phase 4's proof step is that gate applied to a fix.
- `dev` — shares the test-first discipline; debugging is what you do when the loop hits an unexpected failure.
- `test-execution` — surfaces the failures this skill diagnoses.
- `review-correctness` — a reviewer judging whether a fix addresses the cause or just the symptom.
