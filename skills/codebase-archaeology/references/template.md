# Codebase Survey — template

Path: `{DOCS_ROOT}/architecture/survey.md`.

```markdown
---
type: codebase-survey
title: {{repo name}} — codebase survey
description: Inferred structure of the existing codebase; input to AS-IS architecture and unit docs
domain: {{project/domain}}
status: draft
provenance: inferred
timestamp: {{ISO 8601}}
related: []
---

# {{Repo}} — Codebase Survey

> Every claim cites a path or file:line. Unverifiable → Open questions.

## Inventory

- **Languages:** {{lang: share, e.g. Go 85%, SQL 10% — cite the dirs}}
- **Build/manifests:** {{go.mod, Makefile, Dockerfile… with paths}}
- **Entry points:** {{binary/server/CLI/worker → path of main}}
- **Key external deps:** {{framework/driver → manifest line}}
- **Config surface:** {{env vars / files / flags → where read}}

## Structure

- **Module hypothesis:** {{dir → candidate module, one line of evidence each}}
- **Dependency direction:** {{who imports whom; consistent layers observed; tangles flagged}}
- **Data ownership signals:** {{store/table/topic → writer(s); shared writers flagged as findings}}

## Test layout

- **Frameworks:** {{...}}
- **Location convention:** {{...}}
- **Coverage map (rough):** {{covered zones / bare zones}}

## Proposed units

| Candidate | Owns | Uses | Provides | Evidence |
|-----------|------|------|----------|----------|
| {{name}} | {{data/capability}} | {{deps}} | {{API/events}} | {{paths}} |

## Findings

{{Divergences and risks noticed in passing — recorded, not fixed.}}

## Open questions

- [ ] {{question}} — owner: {{who}}
```
