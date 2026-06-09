---
name: system-architecture
description: Design and document the SYSTEM landscape — what services/applications exist, what each owns, how they communicate (sync vs async, the contracts between them), who owns which data across service boundaries, the deployment topology, and the system-wide cross-cutting concerns (auth, observability, resilience). Use this whenever the user is designing a multi-service or distributed system, deciding service boundaries, choosing between a monolith and microservices, defining inter-service contracts or messaging, planning deployment topology, or mentions "system architecture", "service boundaries", "microservices vs monolith", "service landscape", "inter-service", "messaging", "event-driven", "topology", or "platform architecture". This is the SYSTEM altitude — for the internals of one service use service-architecture; for one module's contract use unit-writing.
---

# System Architecture

This document answers one question at the highest altitude: **what services make up the system and how do they fit together** to satisfy the requirements and NFRs. It is the landscape — the map of services, their boundaries, the contracts between them, and where they run.

Keep this altitude separate from service internals. Deciding "there is an orders service and a catalog service, and orders publishes an OrderPlaced event the catalog consumes" is a *system* decision. Deciding "the orders service uses hexagonal layering with these modules" is a *service* decision (`service-architecture`). Mixing the two in one document makes both worse — the landscape gets buried in internal detail, and each service's design gets entangled with its neighbours. Design the landscape here; design each service separately.

## When this skill applies — and when to skip it

This altitude only exists when there is more than one deployable service. Use the PRD's project classification:

| Size | System architecture? |
|------|----------------------|
| TOY, SMALL | No — it's a single service; go straight to `service-architecture`. |
| MEDIUM | Only if genuinely split into multiple deployables; otherwise it's one service with internal modules → `service-architecture`. |
| LARGE, ENTERPRISE | Yes — the landscape is the first thing to design. |

A monolith with internal modules is **not** a multi-service system — its modules are a `service-architecture` concern. The trigger for this skill is multiple independently deployable units.

## Prerequisite: PRD and requirements first

Confirm a validated PRD (default `{DOCS_ROOT}/prds/<feature-slug>/PRD.md`) and requirements exist, and read them. The system shape is driven by the NFRs above all — independent scaling, team autonomy, fault isolation, and data-sovereignty requirements are what justify splitting into services. If none of those pressures exist, the right system architecture is often a single service, and you should say so rather than inventing distribution.

`{DOCS_ROOT}` defaults to `docs/`. Write the landscape to `{DOCS_ROOT}/architecture/system.md`; each service's internals then live at `{DOCS_ROOT}/architecture/<service-name>.md` (via `service-architecture`).

## Monolith vs services — decide deliberately

The split decision is the most expensive one to reverse, so make it on evidence, not fashion. Each service boundary adds network calls, partial-failure modes, distributed-data problems, and operational overhead — adopt one only when a requirement pays for it.

| Topology | Use when | Cost |
|----------|----------|------|
| **Single service (monolith)** | One team, shared data, no independent-scaling need | Low — default unless a pressure below applies |
| **Modular monolith** | One deployable, but strong internal boundaries wanted | Low-Medium |
| **Microservices** | Independent scaling, multiple autonomous teams, fault isolation | High — distributed data, network failure, ops |
| **Event-driven / messaging** | Async workflows, decoupling producers from consumers, spiky load | Medium-High — eventual consistency, message infra |

Justify the chosen topology with a system-level ADR (`adr-writing`). "We used microservices" with no requirement behind it is the first thing validation flags.

## What the landscape document defines

- **Service inventory** — each service, the one business capability it owns, and its responsibility boundary. One service owns one capability; two capabilities in one service is a split waiting to happen, and one capability spread across two is a distributed monolith.
- **Data ownership across services** — exactly one service owns each piece of data; others read it through that service's contract, never its database. A shared database between services couples their schemas and is the most common distributed-systems mistake.
- **Inter-service communication** — for each interaction: synchronous (REST/gRPC) when the caller needs an answer now, or asynchronous (events/messages) when it doesn't. Name the contract (see `api-design` for the shape) and whether failure is tolerable or needs a resilience pattern (Circuit Breaker, Retry, Saga for cross-service transactions).
- **Deployment topology** — where services run, how they're grouped, scaling units, and the network boundaries between them (these are where resilience patterns are required).
- **System-wide cross-cutting concerns** — authentication/authorization across services, observability (tracing across calls), and how consistency is handled (where you accept eventual consistency and why).

Use C4 Context and Container diagrams (`diagram-creation`) for the landscape; the detailed internals are each service's own document.

## How to write it

1. Read the PRD and requirements; confirm validated.
2. Load `references/template.md` when you start — it has the section layout, the C4 Context/Container skeleton, and a worked example.
3. Decide and justify the topology (monolith → microservices) with an ADR before drawing services.
4. Define the service inventory, data ownership, and inter-service contracts; verify the service dependency graph has no cycle (a cycle across services is a distributed deadlock risk).
5. Map system-level NFRs (scaling, availability, fault isolation) to concrete topology support.
6. Write to `{DOCS_ROOT}/architecture/system.md`. Then design each service's internals with `service-architecture`.

## Validating system architecture

Run before service design or epics, or when asked to review the landscape. Work through `references/checklist.md` and produce a **PASS / WARN / FAIL** verdict at `{DOCS_ROOT}/validation/system-architecture-validation-<date>.md`. Highest-value checks:

- **Split is justified** — every service boundary traces to a real pressure (independent scaling, team autonomy, fault isolation). Splits with no driver → WARN (you're paying distribution cost for nothing).
- **Single data owner** — no two services own the same data; no shared database across services. A violation is a hard FAIL.
- **Contracts defined** — every inter-service interaction names its protocol, contract, and sync/async choice; cross-service transactions have a Saga or an explicit consistency story.
- **No service cycle** — the service dependency graph is a DAG.
- **NFR support** — system NFRs map to topology decisions, not hand-waving.
- **Altitude check** — the document stays at the landscape level; per-service internals belong in `service-architecture`.

Name each failing check with a concrete fix. On PASS, proceed to per-service `service-architecture`; on WARN/FAIL, fix and re-check.

## Roles

Written for whoever holds the architecture role (on a team, the architect; solo, you). Reviewed and approved by the project owner. Upstream it consumes the PRD and requirements; downstream it constrains every `service-architecture` document (its contracts and data-ownership rules are the boundaries each service designs within).
