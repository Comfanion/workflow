# Refactoring Scope — template

Path: `{DOCS_ROOT}/refactors/<id>/scope.md` (MEDIUM+ or multi-batch; a small single-batch refactor plans inside the TD entry it pays down).

```markdown
---
type: refactoring-plan
title: {{one-line goal}}
description: {{what structure changes and why}}
domain: {{module/domain}}
status: draft        # draft | in-progress | done
timestamp: {{ISO 8601}}
related:
  - {{TD entry / bug report / ADR that drives this}}
---

# {{Refactor id}} — {{one-line goal}}

## Motivation — the driver

{{Named driver: TD-NN | 3-fix rule on <bug> | measured hot spot | boundary blocking <feature>. No nameable driver → stop, this is churn.}}

## Scope map

- **Moves/changes:** {{modules, files, boundaries affected}}
- **Explicitly untouched:** {{the fence — what "while I'm here" must not cross}}

## Coverage verdict

- **Observed by existing tests:** {{zones}}
- **Bare → characterization tests needed:** {{zones; pinned behavior incl. known bugs, bugs logged separately as {{refs}}}}

## Batches

| # | Structure change | Proof (suite run before / after) | Commit |
|---|------------------|----------------------------------|--------|
| 1 | {{...}} | {{green → green}} | {{sha}} |
| 2 | {{...}} | | |

## Close-out

- **TD entries resolved:** {{TD-NN → commit}}
- **Doc impact:** → `./doc-impact.md`
- **Changelog:** {{entry under Changed}}
```
