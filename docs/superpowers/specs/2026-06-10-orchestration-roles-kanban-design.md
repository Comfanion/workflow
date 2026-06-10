# Orchestration Roles & Kanban Flow — Design

Date: 2026-06-10
Status: Draft (awaiting review)

## Problem

The toolkit routes orchestration through `orchestration` → `orchestration-subagent` |
`orchestration-team`, but two gaps surface on a standing team (Hermes):

1. **No explicit conducting roles.** On Claude Code the main session conducts. On
   Hermes there is no "main session" — work flows
   `you → secretary → kanban board → orchestrator → role agents`, but neither
   `secretary` nor `orchestrator` exists as a role. The toolkit currently states
   conducting is "not a separate agent," which is true for CC and false for a
   standing team.

2. **Orchestration is treated as one thing.** In practice it splits by phase-domain:
   orchestrating agents to **plan** a feature is a different job from orchestrating
   agents to **build** it. The skills conflate them.

A third constraint is a competitive edge to preserve, not a gap to fix:

3. **Lean task handoff.** Superpowers spends disproportionate time *describing* each
   task to the dispatched agent (long crafted per-task prompts) — a wall-clock cost.
   This toolkit already produces right-sized stories that carry their own context.
   The conductor must hand work off **by reference**, not re-author a brief.

## Model — orchestration has three orthogonal axes

| Axis | Values | Status before this change |
|------|--------|---------------------------|
| **Phase-domain** | planning (research→decomposition) · execution (implementation→deploy) | NEW |
| **Delegation** | subagent calls · standing team/board | existing |
| **Sequencing** | sequential · parallel | existing |

Any orchestration instance is one value on each axis. Planning orchestration can be
parallel (architect + designer concurrently) or sequential (architecture gates design);
execution likewise. The phase-domain axis is what the two conducting roles map onto.

## Conducting roles

Conducting is a role played differently per harness, not a fixed agent. On
Claude Code / opencode the main session plays both. On a standing team the two
phase-domains are owned by two profiles:

### secretary — planning conductor + intake

- The front door: holds the user dialogue, gathers and frames requirements,
  and runs the **approval gate** (requirements/scope confirmed before any build).
- Conducts planning orchestration: routes work to `analyst → pm → architect →
  designer`, sequential or parallel as the work allows.
- Produces **approved** epics and stories on the board. Does not author the deep
  artifacts itself (the role agents do) and does not implement.
- Lean handoff: hands each planning task by reference to existing artifacts
  (PRD path, requirements path), never re-pastes them.

### orchestrator — execution conductor

- Picks up the approved board and walks the build flow:
  `dev → tester → reviewer → devops`, routing each item by role.
- Owns the execution gates: spec-compliance, then quality (`code-review`), then the
  acceptance criteria from `decomposition`. "Done on the board" ≠ "passed the gate."
- Chooses dispatch granularity per story (below) and reports with proof.
- Does not implement; does not re-plan (planning gaps go back to secretary).

## Granularity model — how the orchestrator dispatches

```
epic → stories → per story, the orchestrator picks granularity by size/need:
   ├─ story-as-unit : one developer profile takes the whole story, makes its
   │                  own agent-calls internally, builds and closes it.    (smaller / simple)
   └─ task-per-story: the story explodes into tasks on the board; each task
                      is dispatched and closed by an agent.                (larger / complex)
```

**Don't breed tasks.** Default to the coarsest granularity that works
(story-as-unit). Explode a story into tasks only when it genuinely needs several
independent agents (parallel, non-overlapping work). Project size from the PRD
classification is the first signal: TOY/small → story-as-unit; MEDIUM/LARGE → tasks
where independence exists.

## Lean task handoff — the rule that protects wall-clock

- Decomposition already produced right-sized stories carrying their required reading
  and AC. The story **is** the brief.
- The conductor constructs context by **pointing to artifacts** (story file path, AC,
  the specific sections to read), not by re-pasting or re-explaining them.
- Minimal-sufficient: exactly what a cold agent needs to start — scope, the reference
  paths, the expected output. No re-derivation of the plan, no reasoning replay.
- Flow and diagrams remain the task representation; they are not replaced by prose
  briefs.
- This is deliberately the opposite of long per-task prompt authoring.

## Skill → profile scope matrix (Hermes)

Profiles do not own skills; each profile installs the skills its job needs.

| Profile | Skills |
|---------|--------|
| secretary | brainstorm, requirements-gathering, acceptance-criteria, orchestration, orchestration-team |
| orchestrator | orchestration, orchestration-team, orchestration-subagent, code-review |
| analyst | requirements-gathering, acceptance-criteria |
| pm | prd-writing, decomposition, acceptance-criteria |
| architect | system-architecture, service-architecture, adr-writing, api-design, database-design, unit-writing, coding-standards, diagram-creation, release-engineering |
| designer | ux-design, design-system |
| devops | release-engineering |
| backend/frontend/fullstack-developer | dev, code-review, test-design, test-scenarios, research-planning |
| tester | test-scenarios, test-execution |
| reviewer | code-review |
| researcher | research-methodology, research-planning |

secretary and orchestrator carry the orchestration skills; the role agents carry the
authoring/execution skills. secretary holds intake/approval skills only — it conducts,
it does not author the PRD or architecture.

## Deliverables

1. `agents/secretary.md` — planning conductor + intake role.
2. `agents/orchestrator.md` — execution conductor role.
3. `skills/orchestration/SKILL.md` — add the phase-domain axis; route
   secretary↔planning, orchestrator↔execution; keep the existing two axes.
4. `skills/orchestration-team/SKILL.md` — add the granularity model and the
   "don't breed tasks" rule; add the secretary→board→orchestrator handoff; rewrite the
   "not a separate agent" stance to "conducting is your session on CC, the
   secretary/orchestrator profiles on a standing team"; sharpen the lean-handoff rule.
5. `templates/hermes/skill-matrix.md` — the matrix above, with the install commands.
6. `templates/hermes/setup-team.sh` — already reads `agents/*.md`, so it picks up the
   two new profiles automatically; add a note pointing to the skill matrix.

## Harness neutrality

All rules are written at the capability level (create item, link parent, assign by
role, transition status) — never specific Hermes commands — consistent with
`FLOW.yaml` and `docs/capability-map.md`. On Claude Code the same roles collapse into
the main session; the secretary/orchestrator files serve as reference for how that
session should behave.

## Open assumptions

- [assumed] Hermes kanban exposes: item create, parent-link, assign-to-profile,
  status-transition. If the real surface differs, the matrix and handoff wording adjust;
  the model does not.
