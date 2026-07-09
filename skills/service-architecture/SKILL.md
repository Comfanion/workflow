---
name: service-architecture
description: Use when designing, describing, reviewing, or validating the INTERNAL architecture of ONE service or application — the SERVICE altitude. Fire when the user wants to define internal module boundaries, pick the internal style (Layered, Hexagonal, Clean, Vertical Slices), record technology/stack decisions, decide whether DDD/CQRS/Event Sourcing applies, or check the design against the PRD and NFRs. Trigger phrases: "service architecture", "internal design", "service internals", "module boundaries within X", "high-level design / HLD", "architect the X service", "layered / hexagonal / clean architecture", "vertical slices", "technology stack", "validate service architecture". NOT for the system landscape (which services exist, how they interact, inter-service contracts, topology, Saga across services) — that is one altitude up, use `system-architecture`. NOT for one module's detailed data model, API, or event contract — that is one altitude down, use `unit-writing`.
---

# Service Architecture

This document answers one question at one altitude: **how is a single service (or application) built inside** so it satisfies its requirements and NFRs. It sits below the system landscape and above the per-module contracts:

- **System architecture** (separate skill) decides what services exist and how they talk — don't make those decisions here.
- **This skill** designs the internals of one service: its style, modules, data ownership, and stack.
- **Unit docs** (`unit-writing`) zoom into one module's data model, API, and events.

Keep the altitudes apart. The most common mess is a single "architecture" document that mixes "we'll have an orders service and a catalog service talking over events" (system) with "the orders service uses hexagonal layering" (service). Those are different decisions, made at different times, often re-litigated for different reasons — designing them in one pile makes both worse. If the work is about services-and-how-they-interact, stop and use `system-architecture`.

The other common failure is designing in a vacuum — picking a fashionable pattern that traces to no real requirement. Every decision here must point back to something in the requirements or PRD; if it doesn't, it's speculation, and speculation is what makes architecture documents rot.

## Prerequisite: PRD and requirements first

Architecture satisfies requirements, so confirm a validated PRD (default `{DOCS_ROOT}/prds/<feature-slug>/PRD.md`) and requirements (default `{DOCS_ROOT}/requirements/requirements.md`) exist, and read them. The PRD's project classification sets how deep to go; the NFRs are what every decision must trace to. If this service is one of several, read the `system-architecture` document first — its inter-service contracts and data ownership are constraints you design within. Search the codebase and existing docs before re-designing something already settled.

`{DOCS_ROOT}` defaults to `docs/`. Write a single service's design to `{DOCS_ROOT}/architecture.md`; in a multi-service system, write one per service at `{DOCS_ROOT}/architecture/<service-name>.md`.

## Depth scales with project size

| Size | Document depth | Diagrams | ADRs | Internal modules |
|------|----------------|----------|------|------------------|
| **TOY** | Core components only | C4 Component | None | Flat — no modules |
| **SMALL** | Clear module boundaries | + sequences | 2-3 | Flat services |
| **MEDIUM** | Complete internal design | + ER | 5-10 | 3-5 modules, one unit doc per module |
| **LARGE** | Multiple files OK | + state | 10-20 | 5-10 modules/domains |
| **ENTERPRISE** | Per-domain files | All | 20+ | 10+ bounded contexts |

For MEDIUM and above, each internal module/domain gets a unit document under `{DOCS_ROOT}/units/<module-name>/` (see `unit-writing`). Reference it rather than inlining: `→ Unit: <module-name>`.

## Choosing the internal style

Pick the simplest internal style that meets the constraints — driven by team size and domain complexity, not novelty. Justify it with an ADR (`adr-writing`); an unjustified style is the first thing validation flags. These are all *intra-service* structures — the decision of whether to split into multiple services at all belongs to `system-architecture`.

| Style | Best for | Team | Complexity |
|-------|----------|------|------------|
| **Layered** | Simple CRUD, MVPs | 1-3 | Low |
| **Hexagonal** | Testable logic, many integrations | 3-10 | Medium |
| **Clean** | Complex domain, long-term | 5+ | Medium-High |
| **Vertical Slices** | Feature teams, rapid iteration | Any | Medium |

Patterns layer on top only when a requirement demands them — each adds cost, so adopt none speculatively:

- **CQRS** — when the read/write ratio exceeds ~10:1 or queries are complex. Avoid for simple CRUD; it doubles the model for no gain.
- **Event Sourcing** — when you need an audit trail or temporal queries. Avoid when current state is all you need.
- **Resilience patterns** (Circuit Breaker, Retry, Bulkhead, Timeout, Fallback) — when a call crosses a network boundary that can fail.

(If a requirement is pushing you toward splitting into multiple deployable services, a Saga across them, or a service mesh — that's a system-altitude decision. Capture it and take it to `system-architecture`.)

## Defining internal module boundaries

Module boundaries inside the service are the highest-leverage decision, because they decide what can be built and changed independently. Four rules, each preventing a concrete failure:

- **Single responsibility** — one module owns one business capability. A module owning two becomes a merge battleground.
- **Clear data ownership** — exactly one module owns each entity and its tables. Shared ownership means no one can change a schema safely.
- **Explicit interfaces** — modules talk through internal contracts, not each other's internals. Otherwise a refactor in one silently breaks another.
- **Deliberate communication** — direct call or internal events; avoid a shared data store between modules, which couples their schemas and defeats the boundary.

Verify the internal dependency graph is a DAG. A cycle (`A → B → C → A`) means the modules can't be built, tested, or deployed independently — break it before the document is done.

## Document discipline

How the document is written matters as much as what it decides:

- **No code in an architecture doc.** Prose, tables, and diagrams only — no struct/field dumps, function signatures, SQL, or locking mechanics. Depth comes from module boundaries, responsibilities, and data ownership, not pasted code; the detail lives in `unit-writing` and the code itself.
- **Name the pattern, link its ADR — don't re-decide it here.** When the design adopts a style or pattern, name it and link the `adr-writing` record that justifies it; the ADR holds the *why*. Restating the rationale inline lets the two drift.
- **Reference, don't restate.** The system landscape, inter-service contracts, and the project standards are owned elsewhere (`system-architecture`, `standards`) — link them, don't copy them in, or this document rots the moment they change.
- **Mark realized vs planned.** Where the design describes a target state not yet built, label it (MVP vs target). A planned thing shown as real is the costliest error at this altitude.

## How to write it

1. Read the PRD and requirements (and the system architecture, if this is one of several services); confirm they're validated.
2. Load `references/template.md` when you start — it carries the section structure, the ASCII C4 Component skeleton, and a worked MEDIUM example.
3. Fill every `{{placeholder}}`; remove sections that don't apply rather than leaving them empty.
4. Write a Decision Summary table (Category | Decision | Rationale) and an ADR per major decision — the rationale stops the next person relitigating it.
5. Map every NFR this service must meet to concrete architectural support in the NFR Compliance section. An NFR with no support is a requirement you're silently dropping.
6. Write to `{DOCS_ROOT}/architecture.md` (or `{DOCS_ROOT}/architecture/<service-name>.md` in a multi-service system).
7. After the design settles, fill the Module and Arch § columns back in the requirements document so each requirement traces to where it's satisfied.

## Validating service architecture

Validation is the same skill from the other side — run it before epics are created, or when asked to review a service's architecture. The PRD must be validated first. Work through `references/checklist.md` and produce a **PASS / WARN / FAIL** verdict saved to `{DOCS_ROOT}/validation/service-architecture-validation-<date>.md`. The checks that catch the most real problems:

- **PRD coverage** — every functional area this service owns has an internal home; every P0/P1 it's responsible for maps to a module.
- **NFR compliance** — every NFR has concrete, documented support (caching for latency, HA for uptime). "We'll handle performance" is a FAIL; name the mechanism.
- **Module quality** — each internal module has a single responsibility, owns specific entities, documents its events, and defines its interface.
- **No circular dependencies** — the internal module graph is a DAG. A cycle is a hard FAIL.
- **Style compliance** — the chosen style is justified by an ADR, dependency direction follows it, business logic is isolated from infrastructure; aligns with `{DOCS_ROOT}/standards/coding.md` (and `database.md` / `api.md` where the service exposes those surfaces).
- **ADR quality** — major decisions each have Context, Decision, Alternatives, Consequences, status.
- **Altitude check** — the document is about THIS service's internals, not the service landscape. If it's deciding which services exist or how they interconnect, that content belongs in `system-architecture`.

Name each failing check with a concrete fix ("NFR-005: no caching strategy for the < 200ms target — add one"; "Orders → Catalog → Orders cycle — invert the dependency"). On PASS, the service is ready for epic creation; on WARN/FAIL, fix and re-check.

## Roles

Written for whoever holds the architecture role (on a team, the architect; solo, you). Reviewed and approved by the project owner — the author does not approve their own design. Upstream it consumes the PRD, requirements, and (for multi-service systems) the system architecture; downstream the planning role turns it into epics and the developer codes against its module contracts.
