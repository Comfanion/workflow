# Refactoring — gate checklist

## Pre-flight

- [ ] Driver named (TD entry / 3-fix rule / measured hot spot / blocking boundary) — no driver, no refactor.
- [ ] Scope map written: what moves AND what is explicitly untouched.
- [ ] Coverage verdict: bare zones identified; characterization tests written and green *before* any structure moves (known bugs pinned, logged separately).
- [ ] Batch plan: small, ordered, each independently shippable.

## Per batch

- [ ] Full suite run and green BEFORE the batch (output read this turn, not remembered).
- [ ] Batch contains structure change ONLY — no behavior change, no drive-by bug fix, no test rewritten to pass.
- [ ] Full suite green AFTER — same tests.
- [ ] Batch committed. Won't go green → reverted, not debugged forward; uncovered bug → `systematic-debugging` on top of the last green commit.

## Close-out

- [ ] Paid-down `temporary-decisions.md` entries marked `resolved` with commit ref.
- [ ] `doc-impact` verdict declared (unit docs / architecture updated or explicit `none`).
- [ ] Changelog entry under Changed.
- [ ] Characterization suite still green at the end — identical behavior, restructured code.
