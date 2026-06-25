---
name: platform-infrastructure
description: Write or review the platform-level infrastructure document — the shared substrate every service runs on: compute and servers, networks and boundaries, the clusters (message broker / database / cache), environments and their promotion gates, shared infra services (secrets, observability, gateway), the build and CI/CD conventions every repo follows, the deploy strategy, and the common platform-wide rules. Use whenever the user wants to document the shared/platform infrastructure, the cluster topology, environments, CI/CD conventions, the deploy strategy, or the platform-wide ops rules, or mentions "platform infra", "shared infrastructure", "clusters", "environments", "CI/CD conventions", or "deploy strategy". This is the SYSTEM-level infra (shared, standing reference) — for one service's place in it use `service-deployment`; for the act of shipping a specific version use `release-engineering`.
---

# Platform Infrastructure

Document the infrastructure every service shares — the standing reference for the substrate decided once: compute, network, clusters, environments, the CI/CD conventions, the deploy strategy, and the common rules. A service's own deployment doc (`service-deployment`) references this instead of restating it.

This is **operations at the platform altitude**, and it is the physical counterpart to `system-architecture`: that skill designs the logical service landscape; this one documents the physical substrate it runs on. It is not the language/framework stack — that is a service's internal concern (its README / `service-architecture`). It is also not the per-release shipping runbook — versioning, the deploy gate, and rollback for a specific version belong to `release-engineering`, which *uses* the conventions this document standardizes.

`{DOCS_ROOT}` defaults to `docs/`. Write the document to `{DOCS_ROOT}/architecture/platform-infrastructure.md`. Load `references/template.md` when you start.

## What it covers

- **Compute & servers** — where things run (cloud / on-prem nodes, counts, capacity). Mark current vs planned.
- **Network & boundaries** — segments/zones, ingress (gateway), egress, security boundaries (where secrets cross).
- **Clusters** — message broker, database, cache, etc.: topology and key config (replication factor, quorum/ack settings).
- **Environments** — dev / staging / prod and the promotion gate between them.
- **Shared infra services** — broker, secret store, observability stack: purpose, where they run, owner.
- **Build & CI/CD conventions** — the pipeline stages and gates every repo follows, and the image/artifact registry.
- **Deploy strategy** — rolling / canary / blue-green / per-module, and the standard rollback approach.
- **Common rules** — numbered, platform-wide infra/deploy rules (e.g. own-database-per-service, secrets via the secret store, a tested rollback required). These are what service docs point to.

## Document discipline

- **Never invent — operational facts are acted on during incidents, and a wrong one is dangerous.** Server counts, cluster sizes, network boundaries, pipeline gates, and deploy/rollback steps go in only if verified against config or owner-confirmed; otherwise mark `TBD`.
- **Mark current vs planned** per item. A planned cluster shown as real is a deploy-time trap.
- **Reference, don't restate.** The logical landscape is `system-architecture`'s; the per-version shipping process is `release-engineering`'s; the vendor-specific runnable config lives in the infra repo. Link them.
- **Name the decision, link its ADR.** Cluster topology, deploy strategy, and the common rules are load-bearing decisions — name them and link the governing `adr-writing` record, don't re-argue them here.

## Process

1. **Read the source first** — the infra repo, CI/CD templates, deploy manifests, cluster config. Don't invent topology.
2. **Load `references/template.md`** and fill it.
3. Document compute, network, clusters, environments — where things run and how they're isolated.
4. State the build/CI-CD conventions, deploy strategy, and rollback.
5. Number the **common rules** — these are the platform-wide invariants service docs reference.

## Related

- `service-deployment` — one service's position in this infra; references these common rules instead of restating them.
- `system-architecture` — the logical landscape this substrate supports (its physical counterpart).
- `release-engineering` — the per-release shipping runbook and deploy gate that *use* these CI/CD and deploy conventions.
- `adr-writing` — load-bearing infra decisions (cluster topology, deploy strategy) are recorded as ADRs this document links.
- `standards-observability` / `standards-performance` — the conventions docs that defer their runnable collector/dashboard/alert topology to this document.
