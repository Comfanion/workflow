---
name: implementation-squad
description: Decide **who to dispatch** and **what can safely run in parallel** when executing already-decomposed stories, a batch, an epic, or a set of failures — the *composition* layer over `orchestration-subagent`'s dispatch mechanics. Use when picking up a story batch/sprint/epic and choosing between one implementer at a time and parallel lanes, when the user says "parallelize this", "fan out the work", "run these stories together", "can these run concurrently / at the same time", "why so slow, run them in parallel", "set up lanes", "how many agents should I run", or "are these independent enough to overlap". Also use for "run these N failures / fixes together" — after the shared-cause check — and for the inverse question "do these have to be sequential / can I skip the one-at-a-time queue". Core decision is the **independence test** (different files, no shared cause, no ordering, separately verifiable): items passing all four may become parallel lanes; when in doubt, run sequentially. NOT for: implementing one story (`dev`), cutting stories or building the DAG (`decomposition`), the dispatch loop/prompt mechanics (`orchestration-subagent`), or fanning out pre-work perspectives (`planning-squad`). This skill never writes code — it composes who runs.
---

# Implementation Squad

Execution speed comes from parallelism, but parallelism applied to coupled work produces conflicts that cost more than the time saved. This skill is the decision layer: given decomposed work, which agents run, in what lanes, and what must never overlap. An agent should not have to guess this per task — the rules below are the same every time.

## The fixed core: one lane = implementer + two reviewers

Within a lane, the unit of work is always the same trio, run as a pipeline per task (mechanics and prompt templates in `orchestration-subagent`):

1. **Implementer** — builds, tests, commits, self-reviews (runs the `dev` skill).
2. **Spec reviewer** — does the code match the task, nothing missing, nothing extra.
3. **Quality reviewer** — once spec is ✅ (via `code-review`).

This trio is not negotiable and not what you parallelize — you parallelize *lanes*, never the steps inside one.

## The independence test — what may become a parallel lane

Two pieces of work may run as parallel lanes only if **all** hold:

- **Different files/subsystems.** If two items might touch the same file, they are one lane.
- **No shared cause.** Several failures that might share a root cause are one investigation, not N lanes — fixing one may fix (or mask) the others.
- **No ordering.** If B reads what A produces (an API, a schema, a migration), B waits for A. The dependency links from `decomposition` are the schedule — respect them.
- **Separately verifiable.** Each lane's result can be checked without the others' changes in place.

When in doubt, the work is coupled: run it sequentially. A wrong "parallel" costs a merge conflict, a hidden dependency, or two agents fighting over state; a wrong "sequential" costs only time.

## Granularity — don't breed lanes

Default to the coarsest unit that works: **story-as-lane**. One implementer owns the whole story; its internal tasks run inside that one lane. Split a story across lanes only when it genuinely contains independent domains (rare — a well-cut story is one thin slice by construction; if it splits cleanly, that's a signal the decomposition should have cut it).

Typical shapes:

- **Sprint of independent stories** → one lane per story, capped by what you can actually review as results return.
- **Epic with a dependency chain** → lanes follow the DAG: independent stories in parallel, dependents dispatched as their parents pass the gates.
- **N unrelated failures** → one lane per failure domain (after the shared-cause check above).

## Lane = subagent call or board task — project rules decide

A lane is a unit of independent work, not a fixed mechanism. Dispatch it per the delegation model chosen in `orchestration`:

- **In-session subagent** (`orchestration-subagent`) — bounded work you can scope and review within your session.
- **Persistent board task** (`orchestration-team`) — a story that needs its own branch, worktree, testing, and review lifecycle; the dispatcher routes it to a worker in its own session, and parallel lanes run as board items with no dependency edge.

On a harness with a board, substantial stories default to board tasks — don't funnel them through in-session calls just to avoid tickets; in-session fan-out is for planning and for work *inside* one lane. Follow the project's rules where they pick one path.

## Isolation

Parallel lanes must not share a working tree. Use whatever isolation the harness provides (git worktrees, isolated workspaces) so lanes can commit without interleaving. If the harness offers none, you have one lane — parallelism without isolation is how agents overwrite each other.

## Never in parallel

- Two implementers on coupled work (same files, shared cause, ordered).
- The steps inside one lane (implement → spec review → quality review is a pipeline, not a fan-out).
- Work whose lane would bypass a gate "to keep things moving" — a lane that skipped review didn't finish faster, it just moved the failure later.

## Integration

As lanes complete: read each summary, check the changes don't conflict, run the full suite once across everything, and spot-check for systematic errors (parallel agents can make the same wrong assumption N times). If two lanes' results conflict, you found a hidden dependency — reconcile by hand and re-run the affected piece sequentially.

## How it connects

- `orchestration-subagent` — the dispatch mechanics this skill composes: the sequential loop, the parallel fan-out, the prompt templates, the one-session principle.
- `decomposition` — produces the stories and the dependency DAG that define the lanes.
- `dev` — what each implementer runs; `code-review` — the quality gate.
- `planning-squad` — the planning-side counterpart: perspectives fan-out before the work exists.

## Roles

For the conducting agent of the execution phase (on a standing team, `orchestrator`; on Claude Code, your main session). Lane workers are the dev roles from `agents/`; reviewers are the reviewer role.
