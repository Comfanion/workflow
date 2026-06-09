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

## Validating decomposition

Before stories go to development, check them against `references/story-checklist.md` and emit a **READY-FOR-DEV / NEEDS REVISION** verdict. The checks that matter most: single focus and right size; AC in Given/When/Then covering happy + error + edge; tasks atomic and ordered with file paths; traceability back to epic and FR; and a complete Definition of Done. For epics, verify each delivers demonstrable value, has explicit dependencies, and holds 2-10 stories (a one-story epic is a story; a 15+-story epic should split).

## Roles

Written for whoever holds the planning role (on a team, the product owner / scrum role; solo, you). Input is the approved PRD and architecture docs (for exact entity and field names); output feeds the developer, who implements stories via the `dev` skill.
