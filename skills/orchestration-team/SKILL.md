---
name: orchestration-team
description: Route here when work is large, ongoing, or naturally splits across **persistent role-specialized agents coordinated via a shared board or dispatcher** — i.e. a standing named team (Hermes profiles under a kanban dispatcher, or a defined roster of role agents) where items get created, assigned by role, dependency-linked, and gated rather than spawned and collected one-shot. Positive triggers: "the agent team", "the team", "kanban", "the board", "assign to the team", "route to profiles", "Hermes profiles", "standing team", hand-offs across roles, or multi-story work with dependencies between roles. This is the mechanics skill the `orchestration` router hands off to once it has decided team-mode applies — you do not arrive here by keyword "orchestrate" alone. **Not** this: for ephemeral one-shot agent calls whose results you collect directly in the same session, use `orchestration-subagent` instead; for merely deciding *which* orchestration style fits, that's the `orchestration` router. Reach for team mode only when a tracked board earns its keep — genuinely large or ongoing work — not for bounded tasks a subagent round can close.
---

# Orchestration via a Standing Agent-Team

Here the agents are not ephemeral calls you collect from — they are a persistent, role-specialized team that picks work off a shared board. Your job shifts from "spawn and collect" to "stage the work, set dependencies, then monitor and enforce gates." The dispatcher (or you) routes each item to the role that owns it; agents may run longer and hand off to each other. Read `orchestration` first for the shared principles.

This model fits large or ongoing work that naturally splits across roles with dependencies — and it's the native model on Hermes, where a kanban dispatcher routes tasks to profiles.

## The board is the abstraction

Write and think against a **conceptual kanban board**: items (epics → stories → tasks), lanes/status, parent-links for dependencies, and assignment by role. Every rule below speaks board, never a specific command. Each harness binds it:

| Harness | The board is… |
|---------|---------------|
| Hermes | the native kanban dispatcher (a real board); the agent maps board verbs to its own CLI |
| Claude Code / opencode | a simulated board — a tracked task list (e.g. TodoWrite); the main session conducts it |

The board metaphor is the contract; the harness supplies the mechanics. You never need a specific kanban CLI to follow these rules.

## The loop

On a standing team the board has two conductors across the phase-domain split: `secretary` runs planning — gathers requirements, conducts the planning roles, and lays **approved** epics/stories on the board — then hands off to `orchestrator`, which runs execution. The loop below is the execution conductor's; the secretary's planning loop has the same shape one phase earlier — stage, assign, gate, monitor — run over the planning roles (analyst → pm → architect → designer) instead of the build roles (see the `secretary` role's Workflow).

1. **Stage the work on the board.** Take the tasks/stories from `decomposition` and create a board item per unit. Each item must carry what its assignee needs to start cold — the required reading and acceptance criteria the decomposition already produced. Don't make an agent reconstruct context from chat.
2. **Assign by role, and validate what each item names.** Route each item to the role that owns it (see the roster below). Never assign to a role that doesn't exist — check the available agents first. Likewise check every **skill** an item's body names against the catalog before staging it (on Hermes, `hermes skills list`); an item that names a skill that doesn't exist crashes its worker on pickup. A non-existent role or skill is a staging-time failure to fix now, not a runtime surprise.
3. **Declare dependencies — mind the direction.** Link items so dependent work waits for its prerequisites. The direction is fixed: the **prerequisite is the parent (it finishes first), the dependent is the child (it waits)** — on Hermes, the prerequisite is the `--parent`. So `implement` is the parent of `verify`, never the reverse; a `ship` item is a child of what it ships. The links must form a **DAG** — no cycles (a cycle deadlocks the whole chain under `parents_not_done`), no inverted edges (a later-phase item is never the parent of an earlier one), no self-parent. Leave genuinely independent items unlinked so they can be claimed immediately — a spurious parent blocks as hard as a wrong one. If `decomposition` handed you the graph, it already validated this; if you are linking by hand, validate it yourself before letting the board run.
4. **Let the team run; monitor, don't micromanage.** The dispatcher decomposes and runs; you watch the board, unblock, and keep the goal coherent. Resist doing the work yourself — that defeats the team.
5. **Enforce the gates.** No item is done until it passes review (`code-review`) and its tests (the acceptance criteria from `decomposition`). Failed gate → back to the owning role. Don't let "done on the board" substitute for "passed the gate."
6. **Report with proof.** When the goal is met, report what shipped and the evidence (tests/review verdicts), not just "complete."

## Dispatch granularity — don't breed tasks

A story is the default unit of dispatch. Per story, pick the coarsest granularity that works:

```
epic → stories → per story:
   ├─ story-as-unit : one developer profile takes the whole story, makes its own
   │                  agent-calls internally, and builds + closes it.    (smaller / simple)
   └─ task-per-story: the story explodes into tasks on the board; each task is
                      dispatched and closed by an agent.                 (larger / complex)
```

**Don't breed tasks.** Default to story-as-unit. Explode a story into tasks only when it genuinely needs several independent agents (parallel, non-overlapping work). Project size from the PRD classification is the first signal: TOY/small → story-as-unit; MEDIUM/LARGE → tasks where real independence exists. Every extra item is coordination cost — create it only when it earns its keep.

**Never breed a review/test/QA item into board children.** A verify, review, test, QA, or audit item stays **one** board task, assigned to its owning role (reviewer or tester). That worker fans the dimensions out *internally* as ephemeral sub-agents via `orchestration-subagent` — the review dimensions (`review-security`, `review-correctness`, …), the test levels — collecting the results itself. Putting those dimensions on the board as children produces a swarm of items the workers don't know how to coordinate and a verdict no single agent owns. The board sees one verify task; the fan-out happens under it.

## Lean handoff

Each board item already carries its required reading and AC (from `decomposition`). Hand it off **by reference** — point the assignee at the story file and the sections it needs — never re-paste or re-author the brief. The story is the brief. This is the difference between an orchestration that moves and one that spends its wall-clock describing tasks.

## Role roster

Assign by what each role owns (these are the agents in `agents/`):

- **analyst** — requirements gathering & validation, acceptance criteria.
- **pm** — PRD, decomposition into epics/stories, sprint planning, prioritization.
- **architect** — system/service architecture, ADRs, API/DB/unit docs, coding standards.
- **designer** — UX flows, interface design, design system.
- **fullstack/backend/frontend-developer** — implementing stories (the `dev` loop); the main executors.
- **tester** — test cases/scenarios and the QA gate.
- **reviewer** — code/security review gate.
- **researcher** — technical/market/domain research, pulled in on demand.
- **devops** — CI/CD, release, and the deploy gate.

Keep the assignment map honest: if a role for some work doesn't exist on your team, either add it deliberately or fold the work into an existing role — don't route into the void.

## Per-harness reality

- **Hermes** — the native fit. Profiles are the standing team; the kanban CLI creates items, assigns to profiles, and `--parent` sets dependencies; the dispatcher runs them. You create the epic and monitor — you don't run agents by hand. (Profiles are host-side objects, created once during setup, not shipped with the toolkit.)
- **Claude Code / opencode** — there's no built-in long-lived dispatcher, so simulate the board with a tracked task list: stage items, spawn the owning role agent per item (via the Agent tool / subagent), record status, and gate. When the work is bounded and you collect results directly, `orchestration-subagent` is the simpler choice — reach for team mode when the work is large enough that a tracked board earns its keep.

## How it connects

Board items come from `decomposition`. Each assigned dev item runs the `dev` skill. The gate is `code-review`. Roles are the `agents/`.

## Roles

For the conducting agent. On Claude Code that's your main session; on a standing team it's the `secretary` (planning) and `orchestrator` (execution) profiles. The conductor stages and monitors the board and owns the gates; the standing team does the work. The conductor never takes on substantial implementation — only trivial, direct, no-test edits.
