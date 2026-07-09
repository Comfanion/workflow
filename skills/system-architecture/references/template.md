---
type: system-architecture                     # controlled vocab — primary filter for agents
title: {{system}} — System Architecture
description: {{one line — the system landscape this doc maps}}
domain: {{system/platform name}}              # dedup axis: one system-architecture per system
status: draft                                 # draft | approved | deprecated | superseded
tags: [{{tag}}, {{tag}}]                       # free-form filter labels
id: SYS-ARCH-001
version: 1.0
timestamp: {{YYYY-MM-DDThh:mmZ}}                 # OKF timestamp — last meaningful change
related: [docs/prd.md]                        # cross-links; prevents orphan duplicates
---

# {{system}} — System Architecture

> Landscape only. Each service's internals live in `{DOCS_ROOT}/architecture/<service-name>.md` (service-architecture).

---

## 1. Overview

One paragraph: what the system does, the chosen topology, and why.

**Topology:** monolith | modular monolith | microservices | event-driven (justified in ADR-{{N}})

## 2. Context (C4 — Level 1)

```
[External users / systems] ──▶ [ {{system}} ] ──▶ [external dependencies]
```

Who/what uses the system and what it depends on. (See diagram-creation for the diagram file.)

## 3. Service Inventory

| Service | Owns (one capability) | Why a separate service | Stack |
|---------|----------------------|------------------------|-------|
| {{service}} | {{capability}} | {{driver: scaling / autonomy / isolation}} | {{stack}} |

> One capability per service. No service owns two; no capability spans two.

## 4. Data Ownership

| Data / Entity | Owning service | Read by | How others access |
|---------------|----------------|---------|-------------------|
| {{entity}} | {{service}} | {{services}} | {{service}}'s API / events — never its DB |

> Exactly one owner per datum. No shared database across services.

## 5. Inter-Service Communication (C4 — Level 2, Container)

| From → To | Sync/Async | Protocol / contract | Failure handling |
|-----------|-----------|---------------------|------------------|
| {{A}} → {{B}} | sync | REST/gRPC ({{contract}}) | timeout + retry / circuit breaker |
| {{A}} → {{C}} | async | event `{{EventName}}` | at-least-once; idempotent consumer |

Cross-service transactions: {{Saga choreography/orchestration, or "none — no cross-service transaction"}}.

## 6. Deployment Topology

Where services run, scaling units, network boundaries. (Deployment diagram for LARGE+.)

## 7. System-wide Cross-Cutting Concerns

- **AuthN/AuthZ across services:** {{approach}}
- **Observability:** {{tracing/log correlation}}
- **Consistency:** {{where eventual consistency is accepted and why}}

## 8. System NFR Compliance

| NFR | System-level support |
|-----|----------------------|
| {{scaling}} | {{which service scales independently, how}} |
| {{availability}} | {{HA/failover topology}} |
| {{fault isolation}} | {{bulkheads / boundaries}} |

## 9. Decision Summary

| Category | Decision | Rationale | ADR |
|----------|----------|-----------|-----|
| Topology | {{monolith/microservices}} | {{driver}} | → ADR-{{N}} |
| Messaging | {{sync/async/broker}} | {{driver}} | → ADR-{{N}} |

## 10. References

→ PRD: `{DOCS_ROOT}/prds/<slug>/PRD.md`
→ Requirements: `{DOCS_ROOT}/requirements/requirements.md`
→ Per-service: `{DOCS_ROOT}/architecture/<service-name>.md`
