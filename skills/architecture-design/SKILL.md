---
name: architecture-design
description: Design and document system architecture — choose an architectural style (Layered, Hexagonal, Clean, Microservices, Vertical Slices) and patterns (DDD, CQRS, Event Sourcing, Saga), define module boundaries and data ownership, record technology decisions, and check a finished architecture against the PRD and NFRs. Use this whenever the user wants to design a system, define modules or bounded contexts, pick a pattern or stack, or review/validate an architecture document, or mentions "architecture", "system design", "module boundaries", "DDD", "CQRS", "hexagonal", "technology stack", or "validate architecture". The architecture answers HOW the system is built to satisfy the requirements — keep product vision (PRD) and task breakdown (epics) out of it.
---

# Architecture Design

The architecture document answers one question: **how** is the system built so it satisfies the requirements and NFRs. It sits between the PRD (why/what) and the epics (the build plan), and it is the contract every developer codes against. Get the module boundaries and data ownership right here and parallel implementation stays sane; get them wrong and every downstream artifact inherits the mistake.

The most common failure is designing in a vacuum — picking a fashionable pattern, then discovering it doesn't trace to any real requirement or NFR. Every architectural decision in this document must point back to something in the requirements or PRD. If it doesn't, it's speculation, and speculation is what makes architecture documents rot.

`{DOCS_ROOT}` below defaults to `docs/` at the project root; honor the project's configured docs location if one is set. The architecture is written to `{DOCS_ROOT}/architecture.md`.

## Prerequisite: PRD and requirements first

Architecture satisfies requirements, so it can't be designed before they exist. Before starting, confirm a validated PRD (default `{DOCS_ROOT}/prds/<feature-slug>/PRD.md`) and requirements document (default `{DOCS_ROOT}/requirements/requirements.md`) exist and read them. The PRD's project classification sets how deep this document goes; the requirements (especially NFRs) are what every decision must trace to. Search the codebase and existing docs first if you're unsure what's already designed — don't re-architect something that's already settled.

## Depth scales with project size

The PRD's size classification decides how much architecture is warranted. Over-designing a small project wastes effort and freezes premature decisions; under-designing a large one leaves developers without boundaries to code against.

| Size | Document depth | Diagrams | ADRs | Modules |
|------|----------------|----------|------|---------|
| **TOY** | Core components only | C4 Context + Container | None | Flat — no modules |
| **SMALL** | Clear module boundaries | + C4 Component | 2-3 | Flat services |
| **MEDIUM** | Complete system design | + Sequences + ER | 5-10 | 3-5 modules, one unit doc per module |
| **LARGE** | Multiple files OK | + Deployment + State | 10-20 | 5-10 domains |
| **ENTERPRISE** | Per-domain files | All | 20+ | 10+ bounded contexts |

For MEDIUM and above, each module/domain gets its own unit document under `{DOCS_ROOT}/units/<module-name>/` (see the `unit-writing` skill). Reference it from the architecture rather than inlining the detail: `→ Unit: <module-name>`.

## Choosing an architectural style

Pick the simplest style that meets the constraints. The driver is team size, domain complexity, and scaling needs — not novelty. Justify the choice with an ADR (see the `adr-writing` skill); an unjustified style is the first thing validation will flag.

| Style | Best for | Team | Complexity |
|-------|----------|------|------------|
| **Layered** | Simple CRUD, MVPs | 1-3 | Low |
| **Hexagonal** | Testable logic, many integrations | 3-10 | Medium |
| **Clean** | Complex domain, long-term | 5+ | Medium-High |
| **Microservices** | Independent scaling, multiple teams | 10+ | High |
| **Vertical Slices** | Feature teams, rapid iteration | Any | Medium |

Patterns layer on top of the style only when a requirement demands them — each adds cost, so adopt none speculatively:

- **CQRS** — when the read/write ratio exceeds ~10:1 or queries are complex. Avoid for simple CRUD; it doubles the model for no gain there.
- **Event Sourcing** — when you need an audit trail or temporal queries. Avoid when you only need current state; rebuilding state from events is overhead you don't want otherwise.
- **Saga** — when a transaction spans services (choreography or orchestration). It exists because distributed transactions can't use a single DB commit.
- **Resilience patterns** (Circuit Breaker, Retry, Bulkhead, Timeout, Fallback) — when calls cross a network boundary that can fail.

## Defining module boundaries

Module boundaries are the highest-leverage decision in the document, because they decide what can be built and changed independently. Four rules, each preventing a concrete failure:

- **Single responsibility** — one module owns one business capability. A module that owns two will be edited by two teams for unrelated reasons and become a merge battleground.
- **Clear data ownership** — exactly one module owns each entity and its tables. Shared ownership means no one can change a schema safely.
- **Explicit interfaces** — modules talk through API contracts, not each other's internals. Without this, a refactor in one module silently breaks another.
- **Deliberate communication** — direct call, REST/gRPC, or events; avoid a shared database between modules, because it couples their schemas and defeats the boundary.

Verify the dependency graph is a DAG. A cycle (`A → B → C → A`) means the modules can't be built, tested, or deployed independently — break it before the document is done.

## How to write it

1. Read the PRD and requirements; confirm both are validated.
2. Load the template (see below). It carries the full section structure and worked examples.
3. Fill every `{{placeholder}}`. Remove sections that genuinely don't apply rather than leaving them empty.
4. Write a Decision Summary table (Category | Decision | Rationale) and an ADR for each major decision — the rationale is what stops the next person from relitigating it.
5. Map every NFR to concrete architectural support in the NFR Compliance section. An NFR with no support is a requirement you're silently dropping.
6. Write the architecture to `{DOCS_ROOT}/architecture.md`.
7. After the design settles, fill the Module and Arch § columns back in the requirements document so each requirement traces to where it's satisfied.

**Template** — load `references/template.md` when you start writing; it has the section layout, ASCII C4 diagram skeleton, and a worked MEDIUM example.

## Validating architecture

Validation is the same skill from the other side: confirm a finished architecture holds up before epics are created. Run it when asked to review/validate an architecture, or as your own final pass after writing one.

Prerequisite: the PRD must be validated first — the architecture's coverage claims are only as good as the PRD they trace to.

Work through `references/checklist.md` (load it when validating) and produce a verdict. The checks that catch the most real problems:

- **PRD coverage** — every functional area from the PRD has an architectural home, and every P0/P1 requirement maps to a module. An orphaned requirement means the system as designed can't do something it was asked to do.
- **NFR compliance** — every NFR has concrete, documented architectural support (caching for latency, HA for uptime, horizontal scaling for throughput). "We'll handle performance" is a FAIL; name the mechanism.
- **Module quality** — each module has a single responsibility, owns specific entities, documents the events it produces/consumes, and defines its API. No module is a grab-bag.
- **No circular dependencies** — build the dependency graph and confirm it's a DAG. A cycle blocks independent development and is a hard FAIL.
- **Pattern compliance** — the chosen style is justified by an ADR, dependency direction follows it, and business logic is isolated from infrastructure. Aligns with the project's coding-standards document.
- **ADR quality** — major decisions each have an ADR with Context, Decision, Alternatives, Consequences, and a status (Accepted/Superseded/Deprecated).
- **QA artifact** — if the workflow requires integration tests, confirm `{DOCS_ROOT}/architecture-integration-tests.md` exists and covers module contracts, event/API boundaries, and NFR verification (see the `test-design` skill). Treat a missing one as a FAIL when your workflow requires it.

Write the verdict as **PASS / WARN / FAIL** with each failing check named and a concrete fix action ("NFR-005: no caching strategy for the < 200ms target — add one"; "Orders → Catalog → Orders cycle — invert the Catalog dependency"). Save it to `{DOCS_ROOT}/validation/architecture-validation-<date>.md`. On PASS, the architecture is ready for epic creation; on WARN/FAIL, return to the relevant section above, fix, then re-check.

## Roles

Written for whoever holds the architecture role (on a team, the architect; solo, you). The architecture is reviewed and approved by the project owner — the author does not approve their own design. Upstream it consumes the PRD and requirements; downstream the planning role turns it into epics and the developer codes against its module contracts.
