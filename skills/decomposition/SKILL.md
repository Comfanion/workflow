---
name: decomposition
description: Break approved scope into work units at the right granularity — epics, stories, and sprints — and validate them. Use this whenever the user wants to decompose a PRD into epics, break an epic into stories, organize stories into sprints, or mentions "epics", "stories", "user stories", "backlog", "sprint planning", "break this down", or "decompose". The job is to cut at each level so a unit delivers real value and carries enough information that the next level — and ultimately a developer agent — can act without asking questions.
---

# Decomposition

Decomposition turns approved scope into work units across three levels of granularity: **epics → stories → sprints**. (The next level down — stories into tasks and code — is the developer's job; see the `dev` skill.)

Two things make decomposition good, and both matter equally:

1. **Cut at the right size.** Each unit must deliver a coherent slice of value, not a layer or a fragment.
2. **Carry the right information forward.** Each unit must hold exactly what the next level needs to act — a story that says "implement auth" forces whoever picks it up to come back and ask. A well-formed story points at the exact docs, fields, and acceptance criteria so an agent can build it cold.

## The granularity ladder

| Level | Unit of value | Size signal | Output |
|-------|---------------|-------------|--------|
| **Epic** | One complete user capability (a module/domain) | 3-30 stories, scaled by project size | `{DOCS_ROOT}/sprint-artifacts/backlog/epic-<NN>-<slug>.md` |
| **Story** | One thin vertical slice of working behavior | XS-XL tasks, prefer M (4-8) | `{DOCS_ROOT}/sprint-artifacts/<sprint>/stories/story-<E>-<NN>-<slug>.md` |
| **Sprint** | Scope to *complete* one or more epics, demo-ready | by project size | `{DOCS_ROOT}/sprint-artifacts/sprint-status.yaml` |

`{DOCS_ROOT}` defaults to `docs/`. Epic count follows the project size set in the PRD classification — don't over-decompose a small feature into many tiny epics, and don't cram a large platform into a handful.

## Cutting epics

An epic groups related capabilities that together deliver a major piece of product value. The test: at the end of the epic, can someone *see it working*?

- ✅ "User Order Management" — users can create, view, cancel orders
- ❌ "Database layer for orders" — a layer, not a capability
- ❌ "Backend services" — a technology, not a value

Order epics for incremental delivery: walking skeleton first (proves the architecture, gives an early demo), happy path before edge cases, core before enhancements. Mark independent epics explicitly — they can run in parallel.

Load `references/epic-template.md`. Each epic must carry forward: the FR coverage it satisfies, the units it touches, dependencies (requires/enables), epic-level acceptance criteria, and the story list with a dependency flow. That FR-coverage table is what lets anyone trace the epic back to requirements.

## Cutting stories

One story = one thin vertical slice of working behavior, for one user type. Touch all layers needed to make that one behavior real.

- ✅ "User can filter products by price range" — vertical, testable end-to-end
- ❌ "Create the UserService class" — a code artifact, not a behavior
- ❌ "Implement all CRUD operations" — four behaviors; write one story per operation

For each capability, write stories in this order: core happy path, then validation (bad input), then authorization (user can only reach their own data — a frequent source of production bugs), then edge cases. Size XS-XL; prefer **M**; an **L** that keeps growing is a signal the epic decomposition needs adjusting — split before writing.

Load `references/story-template.md`. The part that makes a story buildable-without-questions is the **Required Reading** and **Tasks** sections: each task names the exact documents and sections to read (coding standards, the unit's data model, the relevant architecture section) and the output files, and references those docs rather than restating implementation detail. Acceptance criteria describe observable outcomes ("the order appears in the user's order list"), never internals ("the INSERT executes") — internals break on refactor.

## Batching into sprints

A sprint's scope is whatever it takes to *complete* one or more epics so they are demo-ready — never a partial epic, never several incomplete ones in parallel.

- Capacity by project size: TOY 2-3 epics, SMALL 1-2, MEDIUM 1, LARGE 1, ENTERPRISE ~0.5 (plan to ~70-80% of capacity).
- Definition of Done is a ladder: every sprint needs works-end-to-end + tests pass + demo-ready; SMALL+ adds code review, docs, deployable; MEDIUM+ adds integration tests and performance; ENTERPRISE adds security and load tests.

Record sprints in `references/sprint-template.yaml` form into `sprint-status.yaml`: per sprint a clear goal (what becomes demo-ready), the increment (what works end-to-end), capacity, DoD, and the epics it contains with status. A vague goal is the main thing to avoid — "Order Management works end-to-end" beats "work on orders".

## Information handoff — the through-line

At every level, ask: *can the next actor proceed without coming back to me?* This is the single discipline that makes a decomposition useful rather than decorative:

- Epic → carries FR coverage, units touched, technical decisions/ADRs, and the story list.
- Story → carries required reading (exact docs + sections), units + data model, acceptance criteria, and tasks with output files.
- Sprint → carries a concrete goal, the demonstrable increment, and a definition of done.

If a downstream agent would have to ask "which fields?", "which doc?", "what counts as done?" — the unit isn't finished.

## Dependency links — direction and shape

When decomposition output feeds an execution board with blocking semantics (e.g. a Hermes kanban dispatcher where `parents_not_done` holds an item until its parents finish), the dependency links you declare *are* the schedule. Get the direction wrong and the board deadlocks — every item waiting on an item that waits on it. This is the most expensive decomposition bug because it stops all work, not one task.

Two distinct relationships exist; never conflate them:

- **Hierarchy** — epic *contains* stories, story *contains* tasks. This is composition. If you decompose X into parts, **X is the parent and the parts are its children** — never the reverse. A `Phase A` umbrella is the parent of the `A-*` items it groups, not their child.
- **Blocking dependency** — when item B can only start after item A finishes, **A is the prerequisite (the blocking parent) and B is the dependent (the child that waits)**. In the templates, "B Depends on A" and "A ──► B" both mean the edge points A→B: A is done first. On a board with `parents_not_done`, A is B's parent.

Concretely: an `implement` task is the parent of the `verify` task that checks it (implement finishes first); never make `verify` the parent of `implement`. A `ship` task depends on everything it ships — it is a child of those, parent of nothing downstream.

The link graph **must be a DAG**. Before emitting it, validate:

- **No cycles** — A→B→C→A deadlocks the whole chain. Walk the edges; if you can return to a node you started from, the graph is invalid.
- **No inverted edges** — a later-phase item (verify, ship, QA) is never the parent of the earlier-phase item it follows.
- **No self-parent** — an item never lists itself as a parent.
- **Independent items carry no parent** — if nothing must precede it, leave it unlinked so it can be claimed immediately. A spurious parent link blocks just as hard as a wrong one.

## Don't explode review / test / QA into board children

A review, test, verification, or QA unit is **one** board item, not a parent that breeds children. The failure to avoid: a single `verify` item decomposed into five kanban children (review-umbrella, ADR-audit, baseline-test, endpoint-test, integration-test) — twenty board items the worker agents don't know how to coordinate, and the user drowning in tasks.

The right shape: keep the verify/review/test as one board task assigned to its owning role (reviewer or tester); that worker then fans the dimensions out internally as ephemeral sub-agents via `orchestration-subagent` (the review dimensions, the test levels). The fan-out is a runtime concern of the worker, not a decomposition artifact on the board.

Trigger words in a unit — **review, verify, test, QA, audit** — mean: do not create board children for it. Decompose feature/implementation work into tasks where genuine independence exists; decompose verification into a sub-agent prompt the worker runs, not into board items.

## Validating decomposition

Before stories go to development, check them against `references/story-checklist.md` and emit a **READY-FOR-DEV / NEEDS REVISION** verdict. The checks that matter most: single focus and right size; AC in Given/When/Then covering happy + error + edge; tasks atomic and ordered with file paths; traceability back to epic and FR; and a complete Definition of Done. For epics, verify each delivers demonstrable value, has explicit dependencies, and holds 2-10 stories (a one-story epic is a story; a 15+-story epic should split).

Two more checks are mandatory before any unit reaches an execution board, because they fail the board hard rather than producing a weak story:

- **Dependency graph is a valid DAG** — run the checks above (no cycles, no inverted edges, no self-parent, independent items unlinked). A broken graph deadlocks the board; do not emit it.
- **Every named skill exists** — for each skill a sub-task body names, assert it is in the toolkit's skill catalog before creating the item (on Hermes, check `hermes skills list`; elsewhere, the `skills/` directory). A task that names a non-existent skill (e.g. `security-testing` when only `review-security` exists) crashes its worker on pickup. Fail fast with a clear message — "task T names skill `X`, not in catalog; available: …" — rather than letting the worker discover it at runtime.

## Producing the decomposition

This skill defines *what* a good cut looks like; it does not require you to fill the templates alone. When the scope is non-trivial, produce the decomposition as a planning squad — 3-4 specialist sub-agents in parallel (PO, architect, analyst, devops when deploys are in scope), synthesized by you in one session. The squad composition and merge discipline live in the `planning-squad` skill; the dispatch mechanics in `orchestration-subagent`. Analyze, fan out, synthesize, validate, emit board items — all without leaving your session.

## Roles

Written for whoever holds the planning role (on a team, the product owner / scrum role; solo, you). Input is the approved PRD and architecture docs (for exact entity and field names); output feeds the developer, who implements stories via the `dev` skill.
