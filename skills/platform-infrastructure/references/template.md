---
type: infrastructure                          # controlled vocab — primary filter for agents
title: {{Platform Name}} — Infrastructure
description: {{one line — the shared substrate this doc covers}}
domain: platform                              # dedup axis: one platform-infrastructure doc per platform
status: draft                                 # draft | approved | deprecated | superseded
tags: [{{tag}}, {{tag}}]                       # free-form filter labels
version: 0.1
timestamp: {{YYYY-MM-DDThh:mmZ}}                 # OKF timestamp — last meaningful change
related: []                                    # cross-links; prevents orphan duplicates
---

# {{Platform Name}} — Infrastructure

**Governing ADR(s):** {{ADR-NNN link, or "—"}}

<!-- PLATFORM infra — the shared substrate every service runs on. Lives where the
     project keeps system docs. Operations only — NOT the language/framework stack.
     Mark current vs planned. Never invent operational facts — TBD instead. -->

> {{One paragraph: what this covers and the source of truth (infra repo, CI/CD config).}}

---

## Compute & Servers

| Resource | Where | Capacity | Notes |
| --- | --- | --- | --- |
| {{nodes / instances}} | {{cloud region / DC}} | {{count, spec}} | {{current / planned}} |

---

## Network & Boundaries

- **Segments / zones:** {{public / internal / data}}.
- **Ingress:** {{API gateway, routes}}.
- **Egress:** {{what reaches external systems, through what}}.
- **Security boundaries:** {{who reaches what; where secrets cross}}.

---

## Clusters

| Cluster | Purpose | Topology | Key config |
| --- | --- | --- | --- |
| {{message broker — e.g. Kafka / NATS}} | {{async messaging}} | {{N brokers}} | {{replication factor, quorum/ack settings}} |
| {{database — e.g. PostgreSQL}} | {{storage}} | {{primary + replicas}} | {{...}} |

---

## Environments

| Environment | Purpose | Promotion gate |
| --- | --- | --- |
| {{dev}} | {{integration}} | {{auto on merge}} |
| {{staging}} | {{pre-prod}} | {{...}} |
| {{prod}} | {{live}} | {{manual approval}} |

---

## Shared Infra Services

| Service | Purpose | Where it runs | Owner |
| --- | --- | --- | --- |
| {{message broker}} | {{events}} | {{...}} | {{platform}} |
| {{secret store}} | {{secrets}} | {{...}} | {{platform}} |
| {{observability stack}} | {{metrics/logs/traces}} | {{...}} | {{platform}} |

---

## Build & CI/CD conventions

- **Build:** {{container/image conventions, base image, artifact registry}}.
- **Pipeline stages / gates** every repo follows:

| Stage | What runs | Gate |
| --- | --- | --- |
| {{build}} | {{compile + image}} | {{must pass}} |
| {{test}} | {{unit + integration}} | {{coverage}} |
| {{scan}} | {{lint + security}} | {{no high severity}} |
| {{deploy}} | {{to env}} | {{approval for prod}} |

---

## Deploy Strategy

- **Strategy:** {{rolling / canary / blue-green; per-module independent deploy}}.
- **Rollback:** {{the standard rollback approach}}.
- **Migrations:** {{how DB migrations run relative to deploy; forward/backward compat rule}}.

---

## Common Rules

1. {{e.g. every service owns its own database — no shared DB across services}}.
2. {{e.g. secrets only via the secret store, never in images or env files}}.
3. {{e.g. every deploy must have a tested rollback}}.

---

## References

- {{infra repo / CI templates}} · → `system-architecture` overview · → governing ADR(s)

---

## Changelog

| Version | Date | Author | Changes |
| --- | --- | --- | --- |
| {{0.1}} | {{YYYY-MM-DD}} | {{author}} | {{first draft}} |
