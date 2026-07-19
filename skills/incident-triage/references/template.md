# Bug Report — template

Path: `{DOCS_ROOT}/bugs/<id>/report.md`. `<id>` is a short slug (`2026-07-19-orders-500`). Fill every field; "unknown" is a valid value, a missing field is not.

```markdown
---
type: bug-report
title: {{one-line symptom}}
description: {{what deviates from expected/documented behavior}}
domain: {{module/domain of the affected code}}
status: open        # open | in-progress | fixed | closed
timestamp: {{ISO 8601}}
related: []
---

# {{Bug id}} — {{one-line symptom}}

## Symptom

- **Observed:** {{what actually happens, with the exact error/output quoted}}
- **Expected:** {{what should happen, with the doc/spec reference if one exists}}
- **Reproduction:** {{exact steps; "not yet reproduced" is a valid, honest value}}
- **Environment:** {{where it happens — prod/local, version/commit}}
- **Started:** {{when first observed; what shipped around then}}

## Triage

- **Severity:** S{{1-4}} — criterion hit: {{quote the ladder criterion that is true}}
- **Blast radius:** data: {{none|recoverable|corrupting}} · who: {{one path|some|all}} · spreading: {{yes|no}}
- **Rollback-first:** {{yes → executed, symptom gone | no — which of the 3 preconditions failed}}
- **Fork:** {{incident (mitigate now) | bug (queued)}}
- **Hotfix criteria:** 1: {{y/n}} · 2: {{y/n}} · 3: {{y/n}} → path: {{hotfix | story}}

## Root cause

{{Filled by systematic-debugging — one sentence naming the cause, plus the trace evidence.}}

## Resolution

- **Fix:** {{commit / PR}}
- **Regression test:** {{path of the test that was red before the fix, green after}}
- **Doc impact:** → `./doc-impact.md` (mandatory — `none` verdict included)
```
