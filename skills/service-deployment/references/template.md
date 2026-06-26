---
type: infrastructure                          # controlled vocab — primary filter for agents
title: {{Service}} — Infrastructure & Deployment
description: {{one line — this service's position in the platform infra}}
domain: {{service/domain name}}               # dedup axis: one deployment doc per service
status: draft                                 # draft | approved | deprecated | superseded
tags: [{{tag}}, {{tag}}]                       # free-form filter labels
updated: {{YYYY-MM-DDThh:mmZ}}                 # OKF timestamp — last meaningful change
last_reviewed: {{YYYY-MM-DD}}
review_due: {{YYYY-MM-DD + 3 months}}
owner: {{team}}
related: []                                    # cross-links; prevents orphan duplicates
---

# {{Service}} — Infrastructure & Deployment

<!-- The service's POSITION in the platform infra. Shared infra (clusters, envs,
     CI/CD conventions, common rules) is in the platform-infrastructure doc —
     reference it, document only what's specific here. Operations only, not the
     language/framework stack (that's the README). Never invent — TBD instead. -->

**Governing ADR(s):** {{ADR-NNN link, or "—"}}

## Position in the Infra

| Aspect | Value |
| --- | --- |
| Deploys to | {{cluster / namespace / env}} |
| Build artifact | {{container image — registry path}} |
| Scaling unit | {{replicas; what triggers scale}} |

## Infra dependencies

| Dependency | Instance / path | Purpose |
| --- | --- | --- |
| {{database — e.g. PostgreSQL}} | {{db-<service>}} | {{storage}} |
| {{message broker — e.g. Kafka}} | {{shared cluster, topics …}} | {{events}} |
| {{secret store}} | {{secret/<service>/*}} | {{secrets}} |

## Networking

- **Ingress:** {{route, who can reach it}}.
- **Egress:** {{external systems it calls}}.

## Build

- {{Build/image targets specific to this repo. Base image per platform convention.}}

## CI/CD

{{Only what's specific beyond the platform pipeline convention. Pipeline source: {{path to CI config}}. Trigger: {{merge to <branch> → <env>}}.}}

## Deploy & Rollback

- **Strategy:** {{per platform default, or service-specific}}.
- **Rollback:** {{exact steps / command to roll back this service}}.
- **Migrations:** {{how DB migrations run relative to deploy}}.

## Rule deltas

{{Only the platform common-rules this service overrides, and why. If none: "none".}}

## References

- → Platform infrastructure (shared): {{link}}
- → Architecture: [`architecture.md`](architecture.md)
- → Governing ADR(s): {{link, or —}}
