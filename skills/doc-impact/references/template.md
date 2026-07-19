# Doc-Impact Declaration — template + worked examples

Path: co-located with the work item — `{DOCS_ROOT}/bugs/<id>/doc-impact.md`, `{DOCS_ROOT}/changes/<id>/doc-impact.md`, or `{DOCS_ROOT}/refactors/<id>/doc-impact.md`.

## Skeleton

```markdown
---
type: doc-impact
title: {{one line — what fix this closes}}
domain: {{domain of the fixed code}}
status: declared          # declared | executed
timestamp: {{ISO 8601}}
trigger:
  kind: {{bugfix | hotfix | refactor}}
  ref: {{commit sha | story id | bug report path}}
verdict: {{none | amendments}}
impacts: {{[] iff verdict: none}}
  - artifact: {{repo-relative path}}
    reason: {{one sentence — what the root cause invalidated}}
    action: {{amend | td-entry | standards-rule | ac-update | adr-supersede}}
    status: {{pending | done}}
---

{{One paragraph per impact — or, for verdict: none, one paragraph on why nothing was invalidated.}}
```

## Worked example — `verdict: amendments`

```markdown
---
type: doc-impact
title: Orders 500 on partial refund — stale ownership assumption
domain: orders
status: declared
timestamp: 2026-07-19T14:00:00Z
trigger:
  kind: bugfix
  ref: docs/bugs/2026-07-19-orders-500/report.md
verdict: amendments
impacts:
  - artifact: docs/architecture.md
    reason: States the orders module owns refund state; it moved to billing two releases ago.
    action: amend
    status: pending
  - artifact: docs/standards/temporary-decisions.md
    reason: The fix keeps a hardcoded refund cap to ship today — conscious shortcut, unrecorded.
    action: td-entry
    status: pending
---

The root cause was code reading refund state from `orders` while `billing` owns it since
release 1.4 — `docs/architecture.md` §Data ownership still shows the old owner and misled
the fix's first hypothesis. Amend that section. The fix also hardcodes a 50% refund cap
until the config service ships; that is a TD entry with a trigger, not a silent constant.
```

## Worked example — `verdict: none`

```markdown
---
type: doc-impact
title: Off-by-one in CSV export pagination
domain: reporting
status: executed
timestamp: 2026-07-19T15:00:00Z
trigger:
  kind: bugfix
  ref: a1b2c3d
verdict: none
impacts: []
---

Pure implementation slip: the loop bound used `<=` where the unit doc and the AC both
correctly specify exclusive upper bound. No document asserted anything the root cause
contradicts; the regression test maps to the already-declared AC-12.
```
