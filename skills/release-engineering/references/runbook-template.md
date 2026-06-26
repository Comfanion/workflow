---
type: runbook                                 # controlled vocab — primary filter for agents
title: Release Runbook — {{service}} {{version}}
description: {{one line — what ships in this release and how}}
domain: {{service/domain}}                     # dedup axis: group runbooks by service
status: draft                                 # draft | approved | deprecated | superseded
tags: [release, ops]                          # free-form filter labels
version: {{version}}
updated: {{YYYY-MM-DDThh:mmZ}}                 # OKF timestamp — last meaningful change
related: []                                    # cross-links; e.g. the deployment doc, changelog
---

# Release Runbook — `{{service}}` `{{version}}`

> Write to `{DOCS_ROOT}/ops/release-<version>.md`. Fill every `{{placeholder}}`. Remove sections that genuinely don't apply rather than leaving them blank.

## Summary

- **Version:** `{{version}}` (previous: `{{previous-version}}`)
- **Bump:** {{MAJOR|MINOR|PATCH}} — because {{reason tied to the diff}}
- **What ships:** {{one or two sentences — what changes for users}}
- **Date / window:** {{when}}
- **Driver / on-call:** {{who}}

## Pipeline status

| Stage | Status | Evidence |
|-------|--------|----------|
| Build | {{green}} | {{build id / artifact ref}} |
| Test (unit + integration) | {{green}} | {{run link / output}} |
| Scan (CVE / license) | {{green}} | {{scan link}} |
| Publish | {{done}} | {{registry tag}} |
| Staging verify | {{green}} | {{smoke result}} |

Artifact promoted (not rebuilt) from staging: `{{artifact ref}}`.

## Environment promotion

- dev: {{status}}
- staging: {{status — what was verified}}
- prod: {{pending gate}}

Config differences prod vs staging: {{name them, or "none"}}.

## Deploy strategy

- **Strategy:** {{rolling | blue-green | canary}}
- **Why:** {{blast radius / rollback-speed reasoning}}
- **Steps:** {{ordered actions}}
- **Backward compatibility across overlap window:** {{how old+new coexist safely}}

## Rollback plan

- **Trigger:** {{observable condition that aborts/reverts — e.g. error rate > X, p99 > Y, smoke fails}}
- **Mechanism:** {{exact revert action — flip traffic / halt canary / redeploy N-1}}
- **Migration safety:** {{reversible? expand-contract? or IRREVERSIBLE — state the risk}}
- **Who can call it:** {{name/role}}

## Deploy gate

- [ ] All pipeline gates green (above).
- [ ] Strategy + rollback written (above).
- [ ] Observability ready.
- [ ] **Explicit confirmation to ship `{{version}}` to prod obtained.** Confirmed by: {{who}}, {{when}}.

## Post-deploy verification

- **Smoke checks:** {{what was run}} → {{result, quoted}}
- **Metrics watched:** {{error rate / latency / saturation / business metric}} → {{holding | degraded}}
- **Outcome:** {{healthy — release closed | degraded — rollback executed}}

## Sign-off

- Released by: {{who}}
- Confirmed healthy at: {{time}}
