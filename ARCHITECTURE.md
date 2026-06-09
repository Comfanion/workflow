# Workflow Architecture

A harness-neutral toolkit for AI-assisted software delivery, from research through
implementation and review. It packages two kinds of building blocks — **Agents** and
**Skills** — that together produce a chain of documentation and code artifacts.

The toolkit is harness-neutral: the same agents and skills are designed to run across
Claude Code, opencode, Codex, and Hermes. Packaging and invocation (how an agent or skill
is surfaced to the user) are handled per-harness elsewhere; this document describes only
the portable model.

---

## Two-Layer Model: Agents + Skills

### Agents (WHO — roles / personas)

**Purpose:** Specialized roles with a defined domain of expertise.
**Location:** `agents/<name>.md`

An agent is a **persona**, not a procedure. Each agent:

1. Owns one area of expertise (analysis, product, architecture, development, review…).
2. Knows *which* skills apply to its work and *when* to reach for them.
3. Maintains a consistent working style and judgment.
4. Does **not** embed step-by-step how-to content — that lives in skills.

```
# Agent = WHO (role)
analyst:
  expertise: Requirements engineering
  style: Methodical, asks clarifying questions, uncovers hidden needs
  uses: requirements-gathering, acceptance-criteria
```

### Skills (HOW — knowledge modules)

**Purpose:** Reusable, role-agnostic knowledge: how to do a specific thing, with the
templates and checklists needed to do it well.
**Location:** `skills/<name>/SKILL.md`, with supporting files under
`skills/<name>/references/`.

Each skill:

1. Describes HOW to produce a specific artifact or perform a specific task.
2. Ships its templates and checklists under `references/`.
3. Is agent-agnostic — any agent may load any skill.
4. Is loaded on demand, not always-on.

```
# Skill = HOW (knowledge)
prd-writing:
  what: How to write and validate a PRD
  references: references/template.md, references/checklist.md
  used-by: pm, analyst
```

---

## Agents (7)

| Agent | Expertise | Typical skills |
|-------|-----------|----------------|
| `analyst` | Requirements engineering | requirements-gathering, acceptance-criteria |
| `pm` | Product management | prd-writing, decomposition |
| `architect` | System design | architecture-design, adr-writing, unit-writing, coding-standards, api-design, database-design, diagram-creation |
| `dev` | Implementation | dev, code-review, test-design |
| `reviewer` | Quality / code review | code-review |
| `researcher` | Investigation | research-methodology |
| `change-manager` | Change & release hygiene | doc-todo, archiving |

Skill ownership above is taken verbatim from each agent's `Skills:` frontmatter line —
the single source of truth. Two skills are **cross-cutting utilities** owned by no single
role: `changelog` and `translation`. Any role (or the main agent) may invoke them as the
work demands.

---

## Skills (22)

### Requirements & Product
| Skill | Purpose |
|-------|---------|
| `requirements-gathering` | Elicit FR/NFR; also covers requirements validation (SMART, no conflicts) |
| `prd-writing` | Write the PRD; also covers PRD validation / completeness |
| `acceptance-criteria` | Write testable acceptance criteria (Given/When/Then) |

### Architecture & Design
| Skill | Purpose |
|-------|---------|
| `architecture-design` | Design system architecture; also covers architecture validation |
| `adr-writing` | Write Architecture Decision Records |
| `api-design` | Design APIs |
| `database-design` | Design data models / schemas |
| `diagram-creation` | Produce architecture and flow diagrams |
| `coding-standards` | Define coding patterns, style, git, security, and testing conventions |

### Planning & Implementation
| Skill | Purpose |
|-------|---------|
| `decomposition` | Break work into epics → stories → sprints (merges the old epic/story/sprint-planning skills) |
| `dev` | Implementation loop: single story, plus epic/sprint batch modes, with TDD (merges the old dev-story / dev-epic / dev-sprint / methodologies) |
| `test-design` | Specify module and integration tests |
| `unit-writing` | Write unit tests |
| `code-review` | Review code for quality and correctness (checklist embedded) |
| `research-methodology` | Run technical, market, or domain research |

### Documentation & Change
| Skill | Purpose |
|-------|---------|
| `changelog` | Maintain a changelog (cross-cutting) |
| `archiving` | Archive completed artifacts |
| `doc-todo` | Track documentation TODOs |
| `translation` | Translate documents (cross-cutting) |

### Orchestration & Coordination
| Skill | Purpose |
|-------|---------|
| `orchestration` | Router: run work across agents — choose delegation mode and sequencing |
| `orchestration-subagent` | Mechanics for ephemeral subagent calls (sequential review-gated or parallel fan-out) |
| `orchestration-team` | Mechanics for a standing role-team coordinated via a shared board |

The orchestration trio is loaded by the **conducting / main agent** (the one you talk to),
not by any role agent — see [Coordination Layer](#coordination-layer).

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

The conducting agent maps each pipeline phase (see `FLOW.yaml`) to the role that owns it,
dispatches the work via one of the two mechanics, and gates each result before advancing.
The role agents remain personas that know *which* skills to apply; the coordination layer
decides *who* runs *when* and whether the output is good enough.

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
│   ├── change-manager.md
│   ├── dev.md
│   ├── pm.md
│   ├── researcher.md
│   └── reviewer.md
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
- `architecture-design/references/{template.md, checklist.md}`
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
prd               → {DOCS_ROOT}/prd.md               (pm + prd-writing)
architecture      → {DOCS_ROOT}/architecture.md      (architect + architecture-design + adr-writing)
epics/stories     → {DOCS_ROOT}/backlog/...          (pm + decomposition)
sprint plan       → {DOCS_ROOT}/backlog/sprint-status.yaml (pm + decomposition)
implementation    → source code + tests             (dev + dev/unit-writing/test-design)
review            → review notes / follow-ups        (reviewer + code-review)
```

See `FLOW.yaml` for the full pipeline: each phase maps to the agent(s), skill(s), and
artifact(s) involved.

---

## Why This Separation

1. **Reusability** — a skill is written once and used by any agent.
2. **Maintainability** — update a skill in one place; every agent gets the update.
3. **Clarity** — roles say *who*; skills say *how*; artifacts say *what*.
4. **Portability** — the same building blocks run across multiple harnesses; only
   packaging differs.
5. **Composability** — agents compose skills as the work demands.
