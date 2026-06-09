# Workflow Architecture

A harness-neutral toolkit for AI-assisted software delivery, from research through
implementation and review. It packages two kinds of building blocks — **Agents** and
**Skills** — that together produce a chain of documentation and code artifacts.

The toolkit is harness-neutral: the same agents and skills are designed to run across
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

## Roles (12)

Roles are viewpoints, not skill bundles. Any role selects whatever skills the task needs;
none of the entries below imply ownership of a skill set.

| Role | Mission / viewpoint |
|------|---------------------|
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
| `change-manager` | Release-hygiene lens — keeps artifacts, history, and follow-ups in order |
| `devops` | Delivery lens — owns CI/CD and the deploy gate (ship on green + confirmation) |

---

## Skills (29)

A single shared library. Any role draws from it; skills surface by task match (each skill's
own description), **not** by role assignment. The grouping below is by purpose only — it
does not bind any skill to a role.

### Planning & Requirements
| Skill | Purpose |
|-------|---------|
| `requirements-gathering` | Elicit FR/NFR; also covers requirements validation (SMART, no conflicts) |
| `prd-writing` | Write the PRD; also covers PRD validation / completeness |
| `acceptance-criteria` | Write testable acceptance criteria (Given/When/Then) |

### Design
| Skill | Purpose |
|-------|---------|
| `system-architecture` | Design the system landscape: services, boundaries, inter-service contracts, topology (multi-service only); covers system-arch validation |
| `service-architecture` | Design one service's internals: style, modules, data ownership, stack; covers service-arch validation |
| `adr-writing` | Write Architecture Decision Records |
| `api-design` | Design APIs |
| `database-design` | Design data models / schemas |
| `diagram-creation` | Produce architecture and flow diagrams |
| `coding-standards` | Define coding patterns, style, git, security, and testing conventions |
| `ux-design` | Design UX flows, interaction patterns, and interface layouts |
| `design-system` | Define and maintain the design system (tokens, components, guidelines) |

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
| `code-review` | Review code for quality and correctness (checklist embedded) |

### Delivery / Ops
| Skill | Purpose |
|-------|---------|
| `release-engineering` | CI/CD and release: build, deploy, and the deploy gate |

### Research (cross-cutting)
| Skill | Purpose |
|-------|---------|
| `research-methodology` | Run technical, market, or domain research |
| `research-planning` | Plan a research effort — scope questions, pick sources and methods |

### Orchestration
| Skill | Purpose |
|-------|---------|
| `orchestration` | Router: run work across roles — choose delegation mode and sequencing |
| `orchestration-subagent` | Mechanics for ephemeral subagent calls (sequential review-gated or parallel fan-out) |
| `orchestration-team` | Mechanics for a standing role-team coordinated via a shared board |

### Utilities
| Skill | Purpose |
|-------|---------|
| `changelog` | Maintain a changelog |
| `archiving` | Archive completed artifacts |
| `doc-todo` | Track documentation TODOs |
| `translation` | Translate documents |

The orchestration trio is loaded by the **conducting / main agent** (the one you talk to),
not by any role — see [Coordination Layer](#coordination-layer).

---

## Coordination Layer

Above the roles sits a thin **coordination layer**: the conducting agent — the main agent
you talk to — that holds the goal and the plan and runs the work *through* the role agents
rather than doing every step itself. It does not own a domain of expertise; it owns
sequencing, delegation, and quality gates.

This layer is driven by the orchestration trio:

- **`orchestration`** — the router. Establishes the principles that apply to any
  delegation (construct context deliberately, review gates, model selection, continuous
  execution) and points to the right mechanics skill.
- **`orchestration-subagent`** — mechanics for spawning ephemeral, isolated subagents:
  one crafted task per agent, either sequentially with a review gate after each, or in
  parallel across independent problem domains.
- **`orchestration-team`** — mechanics for a standing, role-specialized team coordinated
  through a shared board/dispatcher (e.g. a kanban dispatcher routing tasks to profiles),
  with declared dependencies and hand-offs.

The conducting agent maps each pipeline phase (see `FLOW.yaml`) to the role that typically
drives it, dispatches the work via one of the two mechanics, and gates each result before
advancing. Each role is a viewpoint that selects whatever skills the task needs; the
coordination layer decides *who* runs *when* and whether the output is good enough.

---

## Directory Structure

The repo is **flat**: skills live at `skills/<name>/`, agents at `agents/<name>.md`. There
is no harness-specific prefix — packaging for a given harness is layered on elsewhere.

```
.
├── FLOW.yaml                    # Workflow pipeline definition
├── ARCHITECTURE.md              # This file
│
├── agents/                      # Roles (WHO)
│   ├── analyst.md
│   ├── architect.md
│   ├── backend-developer.md
│   ├── change-manager.md
│   ├── designer.md
│   ├── devops.md
│   ├── frontend-developer.md
│   ├── fullstack-developer.md
│   ├── pm.md
│   ├── researcher.md
│   ├── reviewer.md
│   └── tester.md
│
└── skills/                      # Knowledge (HOW)
    ├── <skill-name>/
    │   ├── SKILL.md             # The how-to
    │   └── references/          # Templates, checklists, examples
    │       ├── template.md
    │       └── checklist.md
    └── ...
```

Examples of `references/` payloads:

- `prd-writing/references/{template.md, checklist.md}`
- `system-architecture/references/{template.md, checklist.md}`
- `service-architecture/references/{template.md, checklist.md}`
- `requirements-gathering/references/{template.md, checklist.md}`
- `decomposition/references/{epic-template.md, story-template.md, sprint-template.yaml, story-checklist.md}`
- `acceptance-criteria/references/template.md`
- `test-design/references/{template-integration.md, template-module.md}`
- `coding-standards/references/{template-git.md, template-security.md, template-testing.md, what-to-document.md}`
- `code-review/references/checklist.md`
- `adr-writing/references/template.md`

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
design            → {DOCS_ROOT}/design/...            (designer + ux-design/design-system)
epics/stories     → {DOCS_ROOT}/backlog/...          (pm + decomposition)
sprint plan       → {DOCS_ROOT}/backlog/sprint-status.yaml (pm + decomposition)
implementation    → source code + tests             (fullstack/backend/frontend-developer + dev/unit-writing/test-design)
testing           → {DOCS_ROOT}/test/... + {DOCS_ROOT}/validation/test-report-*.md (tester + test-scenarios/test-execution)
review            → review notes / follow-ups        (reviewer + code-review)
deploy            → {DOCS_ROOT}/ops/release-*.md      (devops + release-engineering, deploy gate)
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
