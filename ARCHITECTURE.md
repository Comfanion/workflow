# Workflow Architecture

A multi-harness toolkit for AI-assisted software delivery, from research through
implementation and review. It packages two kinds of building blocks — **Agents** and
**Skills** — that together produce a chain of documentation and code artifacts.

The toolkit is multi-harness: the same agents and skills are designed to run across
Claude Code, opencode, Codex, and Hermes. Packaging and invocation (how an agent or skill
is surfaced to the user) are handled per-harness elsewhere; this document describes only
the portable model.

---

## Two-Layer Model: Roles + Skills

The toolkit separates **who** is looking at the problem from **how** the work gets done.
Roles are viewpoints; skills are a shared library. The two are **not** wired together —
no role owns a fixed set of skills.

### Roles (WHO — viewpoints)

**Purpose:** A role is a **perspective** on the work — a mission, a set of
responsibilities, and a scope. It frames *whose* lens the task is approached from
(the analyst's, the architect's, the reviewer's…).
**Location:** `agents/<name>.md`

Each role:

1. Carries a mission and a defined scope of responsibility.
2. Applies the judgment and priorities of that viewpoint.
3. Does **not** own a skill list and does **not** reference other roles.
4. Selects whatever skills the task at hand needs — drawing freely from the shared library.

### Skills (HOW — shared library)

**Purpose:** A shared pool of reusable, role-agnostic knowledge: how to do a specific
thing, with the templates and checklists needed to do it well.
**Location:** `skills/<name>/SKILL.md`, with supporting files under
`skills/<name>/references/`.

Each skill:

1. Describes HOW to produce a specific artifact or perform a specific task.
2. Ships its templates and checklists under `references/`.
3. Is role-agnostic — **any** role may load **any** skill.
4. **Auto-surfaces by its own description** when a task matches it; it is not bound to a
   role and is loaded on demand, not always-on.

---

## Flows (5)

`FLOW.yaml` maps a request class to a phase sequence; selection rules live in
`using-comfanion` §Choose the flow. Hard gates (`integration`, `deploy`,
`provenance`) are defined once and shared by every flow.

| Flow | Request class | Shape |
|------|---------------|-------|
| `greenfield` | New system, no existing docs chain | research → … → deploy (the full pipeline) |
| `bugfix` | Observed behavior deviates from documented/expected | intake → triage → diagnose → fix → verify → review → doc-impact → ship |
| `small-change` | Bounded behavior change on a documented system | intake → impact (escalation rule) → amend → implement → verify → review → doc-impact → ship |
| `onboarding` | Existing repo, missing/untrusted docs | adopt → archaeology → document → extract-standards → review → seed (all `provenance: inferred` until reviewed) |
| `refactor` | Structure change, no behavior change | scope → characterize → execute → verify → review → doc-impact → ship |

Every maintenance flow ends with a mandatory `doc-impact` verdict — the
anti-rot mechanism that keeps months of fixes from silently invalidating the
docs the greenfield flow wrote.

---

## Roles (13)

Roles are viewpoints, not skill bundles. Any role selects whatever skills the task needs;
none of the entries below imply ownership of a skill set. The first two are **conducting**
roles — they run the work rather than author an artifact (see [Coordination Layer](#coordination-layer)).

| Role | Mission / viewpoint |
|------|---------------------|
| `secretary` | Planning-conductor + intake lens — receives the request, frames the plan, and acts directly on trivial work instead of dispatching it |
| `orchestrator` | Execution-conductor lens — routes work across roles and enforces review gates; authors nothing |
| `analyst` | Requirements lens — uncovers real needs, surfaces hidden constraints and conflicts |
| `architect` | System-design lens — shapes structure, boundaries, and the key technical decisions |
| `pm` | Product lens — frames value, scope, and priorities; turns needs into a delivery plan |
| `designer` | Experience lens — shapes UX flows, interface design, and the design system |
| `fullstack-developer` | Implementation lens (general/cross-cutting) — turns specs into working, tested code across the stack |
| `backend-developer` | Implementation lens (server/data/API) — services, data models, and API internals |
| `frontend-developer` | Implementation lens (UI/UX-fidelity) — interface code true to the design |
| `tester` | Validation lens — authors test scenarios and runs the QA gate |
| `reviewer` | Quality lens — judges correctness, risk, and adherence to standards |
| `researcher` | Investigation lens — gathers and weighs evidence before commitments are made |
| `devops` | Delivery lens — plans how it ships early (delivery-design) and owns the deploy gate late (ship on green + confirmation) |

---

## Skills (62)

A single shared library. Any role draws from it; skills surface by task match (each skill's
own description), **not** by role assignment. The grouping below is by purpose only — it
does not bind any skill to a role.

### Toolkit entry point
| Skill | Purpose |
|-------|---------|
| `using-comfanion` | The router: at the start of a task, check whether a skill applies and invoke it before improvising; user instructions outrank skills. The one skill surfaced automatically (others load on demand) — on Claude Code via an optional SessionStart hook |
| `using-standards` | The consumer of already-written standards — at the start of design / dev / review, find the project's standards index and load only the artifacts the task touches |

### Planning & Requirements
| Skill | Purpose |
|-------|---------|
| `requirements-gathering` | Elicit FR/NFR; also covers requirements validation (SMART, no conflicts) |
| `prd-writing` | Write the PRD; also covers PRD validation / completeness |
| `acceptance-criteria` | Write testable acceptance criteria (Given/When/Then) |
| `security-requirements` | Abuse cases + security NFRs — security at requirements time; feeds threat-modeling |

### Design
| Skill | Purpose |
|-------|---------|
| `system-architecture` | Design the system landscape: services, boundaries, inter-service contracts, topology (multi-service only); covers system-arch validation |
| `service-architecture` | Design one service's internals: style, modules, data ownership, stack; covers service-arch validation |
| `adr-writing` | Write Architecture Decision Records |
| `api-design` | Design APIs |
| `database-design` | Design data models / schemas |
| `diagram-creation` | Produce architecture and flow diagrams |
| `ux-design` | Design UX flows, interaction patterns, and interface layouts |
| `design-system` | Define and maintain the design system (tokens, components, guidelines) |
| `threat-modeling` | Design-time STRIDE / attack-surface analysis; feeds review-security |

### Project Standards (authoring group)
| Skill | Purpose |
|-------|---------|
| `standards` | Umbrella router — decide which standards artifacts the project needs; route to the matching authoring skill |
| `authoring-standards` | Cross-cutting discipline every topic author obeys — single source, rules-only (no runnable artifacts), cite the governing ADR, review before propagation |
| `standards-coding` | Authors `docs/standards/coding.md` — naming, layering, error handling, idioms, formatting, logging, critical rules |
| `standards-testing` | Authors `docs/standards/testing.md` — pyramid, coverage targets, types, quality gates |
| `standards-security` | Authors `docs/standards/security.md` — surface-scoped checklist; source of truth for `review-security` |
| `standards-performance` | Authors `docs/standards/performance.md` — what to measure, budgets, hot paths, anti-patterns |
| `standards-api` | Authors `docs/standards/api.md` — URL, envelope, error shape, versioning |
| `standards-database` | Authors `docs/standards/database.md` — naming, migrations, query patterns, indexes |
| `standards-git` | Authors `docs/standards/git.md` — branching, commits, PR/MR process |
| `standards-temporary-decisions` | Authors `docs/standards/temporary-decisions.md` — living backlog of conscious shortcuts with cost / trigger / deadline / owner |
| `standards-events` | Authors `docs/standards/events.md` — transport-neutral eventing: envelope, schema evolution, delivery semantics + idempotency, ordering, DLQ, shared-schema-package rule |
| `standards-observability` | Authors `docs/standards/observability.md` — metrics (RED/USE) + tracing + structured logging conventions, cardinality budget, the correlation id, never-log list |

### Decomposition
| Skill | Purpose |
|-------|---------|
| `decomposition` | Break work into epics → stories → sprints |

### Implementation & Quality
| Skill | Purpose |
|-------|---------|
| `dev` | Implementation loop: single story, plus epic/sprint batch modes, with TDD |
| `test-design` | Specify module and integration tests |
| `test-scenarios` | Author concrete test cases / scenarios (also done during implementation) |
| `test-execution` | Run tests and apply the QA gate |
| `unit-writing` | Write per-module/domain unit docs (data model, API surface, event schemas) |
| `code-review` | Umbrella router: runs the review dimensions below and aggregates one PASS/CHANGES/BLOCKED verdict |
| `review-security` | Review dimension — code-level security (secrets, injection, authz); always blocks on a real finding |
| `review-correctness` | Review dimension — logic, unmet acceptance criteria, races |
| `review-tests` | Review dimension — suite health and coverage of core paths |
| `review-performance` | Review dimension — hot-path cost, N+1, allocation |
| `review-complexity` | Review dimension — maintainability and complexity shape |
| `receiving-code-review` | Act on review feedback with rigor — verify each comment before implementing or pushing back; the author's side of the review loop |
| `systematic-debugging` | Find root cause before fixing — read/reproduce/trace, one hypothesis, fix the source; rigid (Iron Law, 3-fix architecture rule) |
| `verification-before-completion` | The completion gate — no "done/fixed/passing" claim without fresh command output proving it; cross-cutting, rigid |

### Maintenance & Adoption
| Skill | Purpose |
|-------|---------|
| `incident-triage` | Entry of the bugfix flow — severity/blast-radius classification, rollback-first rule, incident-vs-bug and hotfix-vs-story forks; never diagnoses |
| `doc-impact` | Rigid close-out of every fix/refactor: declare which docs the root cause invalidated (typed verdict; explicit `none` allowed, silence is not) |
| `amending-artifacts` | Amend an existing doc surgically — locate the section, minimal diff, changelog row, never silently contradict an ADR; owns provenance promotion |
| `refactoring` | Rigid macro-refactoring: motivation + scope map, characterization tests, green-to-green batches, no behavior change mixed in |
| `codebase-archaeology` | Brownfield evidence-gathering: infer structure, boundaries, dependency direction from source; every claim cited; `provenance: inferred` |
| `standards-extraction` | Infer de-facto conventions with a frequency threshold; emits candidate rules for ratification, never asserted standards |

### Delivery / Ops
| Skill | Purpose |
|-------|---------|
| `platform-infrastructure` | System-level shared-infra reference — compute, network, clusters, environments, CI/CD conventions, deploy strategy, common rules (the substrate `system-architecture` runs on) |
| `service-deployment` | Service-level deployment doc — one service's position in the infra: where it runs, infra deps, networking, scaling, rollback, rule deltas |
| `release-engineering` | CI/CD and release: build, deploy, and the deploy gate (the per-version shipping runbook that uses the conventions above) |

### Research & Ideation (cross-cutting)
| Skill | Purpose |
|-------|---------|
| `research-methodology` | Run technical, market, or domain research |
| `research-planning` | Plan a research effort — scope questions, pick sources and methods |
| `brainstorm` | Facilitate structured ideation/problem-analysis (Five Whys, HMW, SCAMPER, empathy/journey maps); produces ranked ideas + action items |

### Orchestration
| Skill | Purpose |
|-------|---------|
| `orchestration` | Router: run work across roles — choose delegation mode and sequencing |
| `orchestration-subagent` | Mechanics for ephemeral subagent calls (sequential review-gated or parallel fan-out), all inside one session |
| `orchestration-team` | Mechanics for a standing role-team coordinated via a shared board |
| `planning-squad` | Squad composition for planning fan-out: who to spawn (PO/architect/analyst/devops), what each returns, how to synthesize |
| `implementation-squad` | Squad composition for execution: lanes of implementer + reviewers, the independence test for parallelism |

### Utilities
| Skill | Purpose |
|-------|---------|
| `changelog` | Maintain a changelog |
| `archiving` | Archive completed artifacts |
| `doc-todo` | Track documentation TODOs |

The orchestration skills are loaded by the **conducting / main agent** (the one you talk to),
not by any role — see [Coordination Layer](#coordination-layer).

---

## Coordination Layer

Above the roles sits a thin **coordination layer**: the conducting agent — the main agent
you talk to — that holds the goal and the plan and runs the work *through* the role agents
rather than doing every step itself. It does not own a domain of expertise; it owns
sequencing, delegation, and quality gates.

Two roles formalize this layer. The **`secretary`** conducts *planning* — it takes the
intake, frames the plan, and handles trivial work inline. The **`orchestrator`** conducts
*execution* — it dispatches the planned work across the authoring roles and enforces the
review gates. Both author nothing themselves; they drive the orchestration trio below.

This layer is driven by the orchestration skills:

- **`orchestration`** — the router. Establishes the principles that apply to any
  delegation (construct context deliberately, review gates, model selection, continuous
  execution) and points to the right mechanics skill.
- **`orchestration-subagent`** — mechanics for spawning ephemeral, isolated subagents:
  one crafted task per agent, either sequentially with a review gate after each, or in
  parallel across independent problem domains — all inside the conductor's current
  session, never as new sessions or board items.
- **`orchestration-team`** — mechanics for a standing, role-specialized team coordinated
  through a shared board/dispatcher (e.g. a kanban dispatcher routing tasks to profiles),
  with declared dependencies and hand-offs.
- **`planning-squad`** / **`implementation-squad`** — squad compositions over the
  subagent mechanics: who to spawn and what to parallelize for the planning and
  execution phase-domains respectively, so the conductor never derives a squad from
  scratch.

The conducting agent first classifies the request into a flow (via `using-comfanion`
§Choose the flow), then maps each phase of that flow (see `FLOW.yaml`) to the role that
typically drives it, dispatches the work via one of the two mechanics, and gates each
result before advancing. Each role is a viewpoint that selects whatever skills the task needs; the
coordination layer decides *who* runs *when* and whether the output is good enough.

The conducting agent enters through **`using-comfanion`** — the router that, at the start of
a task, checks whether a skill applies and invokes it before improvising. On Claude Code an
optional `SessionStart` hook (the toolkit's one harness-specific addition, under `hooks/`)
surfaces that skill automatically; remove `hooks/` to run purely multi-harness. Two craft
gates apply across every phase regardless of role: **`verification-before-completion`** (no
completion claim without fresh evidence) and **`systematic-debugging`** (root cause before
any fix). **`receiving-code-review`** governs the author's side of the review gate.

---

## Directory Structure

The repo is **flat**: skills live at `skills/<name>/`, agents at `agents/<name>.md`. There
is no harness-specific prefix — packaging for a given harness is layered on elsewhere.

```
.
├── FLOW.yaml                    # Flow definitions (5 flows + shared hard gates)
├── ARCHITECTURE.md              # This file
│
├── agents/                      # Roles (WHO)
│   ├── analyst.md
│   ├── architect.md
│   ├── backend-developer.md
│   ├── designer.md
│   ├── devops.md
│   ├── frontend-developer.md
│   ├── fullstack-developer.md
│   ├── orchestrator.md
│   ├── pm.md
│   ├── researcher.md
│   ├── reviewer.md
│   ├── secretary.md
│   └── tester.md
│
├── skills/                      # Knowledge (HOW)
│   ├── <skill-name>/
│   │   ├── SKILL.md             # The how-to
│   │   └── references/          # Templates, checklists, examples
│   │       ├── template.md
│   │       └── checklist.md
│   └── ...
│
└── hooks/                       # OPTIONAL, Claude Code only — the one
    ├── hooks.json               # harness-specific layer: a SessionStart
    ├── run-hook.cmd             # hook that surfaces `using-comfanion`.
    └── session-start            # Delete this dir to stay fully neutral.
```

The skill/role library is multi-harness Markdown. The only harness-specific piece is the
optional `hooks/` directory: on Claude Code it injects the `using-comfanion` router at
session start so the library is actually used rather than skipped. It is opt-in by presence —
removing `hooks/` changes nothing about the skills themselves.

Examples of `references/` payloads:

- `prd-writing/references/{template.md, checklist.md}`
- `system-architecture/references/{template.md, checklist.md}`
- `service-architecture/references/{template.md, checklist.md}`
- `requirements-gathering/references/{template.md, checklist.md}`
- `decomposition/references/{epic-template.md, story-template.md, sprint-template.yaml, story-checklist.md}`
- `acceptance-criteria/references/template.md`
- `test-design/references/{template-integration.md, template-module.md}`
- `standards-coding/references/{template.md, checklist.md}` (+ `repo-structure/` scaffold)
- `standards-testing/references/{template.md, checklist.md}`
- `standards-security/references/{template.md, checklist.md}`
- `standards-performance/references/{template.md, checklist.md}`
- `standards-api/references/{template.md, checklist.md}`
- `standards-database/references/{template.md, checklist.md}`
- `standards-git/references/{template.md, checklist.md}`
- `standards-temporary-decisions/references/{template.md, checklist.md}`
- `standards-events/references/template.md`
- `standards-observability/references/template.md`
- `code-review/references/checklist.md`
- `adr-writing/references/template.md`
- `platform-infrastructure/references/template.md`
- `service-deployment/references/template.md`

---

## Artifacts Produced

The agents and skills above produce a chain of artifacts under `{DOCS_ROOT}` (default
`docs/`):

```
research          → {DOCS_ROOT}/research/...        (researcher + research-methodology)
requirements      → {DOCS_ROOT}/requirements/...    (analyst + requirements-gathering)
prd               → {DOCS_ROOT}/prds/<slug>/PRD.md    (pm + prd-writing)
system arch       → {DOCS_ROOT}/architecture/system.md (architect + system-architecture, multi-service only)
service arch      → {DOCS_ROOT}/architecture.md or architecture/<service>.md (architect + service-architecture + adr-writing)
delivery design   → {DOCS_ROOT}/ops/ci-cd|environments|runbooks/*.md (devops + release-engineering, optional — plan how it ships)
design            → {DOCS_ROOT}/design/...            (designer + ux-design/design-system)
epics/stories     → {DOCS_ROOT}/backlog/...          (pm + decomposition)
sprint plan       → {DOCS_ROOT}/backlog/sprint-status.yaml (pm + decomposition)
implementation    → source code + tests             (fullstack/backend/frontend-developer + dev/unit-writing/test-design)
testing           → {DOCS_ROOT}/test/... + {DOCS_ROOT}/validation/test-report-*.md (tester + test-scenarios/test-execution)
review            → review notes / follow-ups        (reviewer + code-review)
deploy            → {DOCS_ROOT}/ops/release-*.md      (devops + release-engineering, deploy gate)

bugfix            → {DOCS_ROOT}/bugs/<id>/{report.md, doc-impact.md}       (incident-triage → systematic-debugging → doc-impact)
small change      → {DOCS_ROOT}/changes/<id>/{change.md, doc-impact.md}    (amend via amending-artifacts; escalation rule)
refactor          → {DOCS_ROOT}/refactors/<id>/{scope.md, doc-impact.md}   (refactoring, green-to-green batches)
onboarding        → {DOCS_ROOT}/architecture/survey.md + AS-IS docs + standards/candidates.md  (codebase-archaeology + standards-extraction; provenance: inferred)
```

See `FLOW.yaml` for the full pipeline: each phase maps to the agent(s), skill(s), and
artifact(s) involved.

---

## Why This Separation

1. **Reusability** — a skill is written once and drawn on by any role.
2. **Maintainability** — update a skill in one place; every role gets the update.
3. **Clarity** — roles say *who*; skills say *how*; artifacts say *what*.
4. **Portability** — the same building blocks run across multiple harnesses; only
   packaging differs.
5. **Composability** — any role selects whatever skills the task needs; nothing is bound
   in advance.
