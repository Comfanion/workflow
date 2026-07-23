# Standards Candidates — template

Path: `{DOCS_ROOT}/standards/candidates.md`. Not a standards document — a proposal ledger awaiting ratification.

```markdown
---
type: standards-candidates
title: {{repo}} — de-facto convention candidates
description: Inferred conventions awaiting human ratification; NOT consumable as standards
domain: {{project/domain}}
status: draft
provenance: inferred
timestamp: {{ISO 8601}}
related:
  - /docs/architecture/survey.md
---

# Convention Candidates — {{repo}}

> Ratification: human review → `standards-<topic>` authors the rule via
> `authoring-standards` → entry removed with a pointer. `using-standards`
> must not consume this file as rules.

## Sampling note

{{What was sampled: which dirs/files, why (recent + high-traffic), date.}}

## Candidates

### C-01 — {{one-line rule, do/don't phrasing}}

- **Evidence:** {{n}} occurrences · {{file:line}}, {{file:line}}
- **Exceptions:** {{cited, or "none found"}}
- **Confidence:** {{candidate | contested — variant split}}
- **Target artifact:** standards/{{topic}}.md

### C-02 — …

## Contested — needs a human decision

{{Entries at 50–80% consistency: both variants, split, drift direction if the
newest files lean one way.}}

## Dropped as accidents

{{One line each — <50% or <3 occurrences. Kept for the reviewer's context.}}
```
