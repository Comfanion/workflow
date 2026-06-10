---
name: planning-squad
description: Produce a decomposition (epic → stories → dev sub-tasks) by fanning out a parallel squad of specialist sub-agents — PO, architect, analyst, plus devops when deploys are in scope — and synthesizing their outputs into the decomposition templates, all inside your current session. Use whenever a scope needs planning with multiple perspectives, even if nobody says "squad" — decomposing a kanban task, breaking an epic into stories, planning a feature, or when the user says "decompose this", "plan this", "спланируй", "разбей на задачи". Dispatch mechanics live in orchestration-subagent; this skill defines WHO to spawn, WHAT each returns, and how to merge the results.
---

# Planning Squad

A decomposition is only as good as the perspectives that produced it. One agent planning alone writes stories from a single viewpoint and silently skips the questions an architect or tester would have asked. The squad fixes that: the same scope examined in parallel by the specialist roles whose answers the templates need, merged by you.

This is a composition skill: it tells you who to spawn and what each returns. The dispatch mechanics (how to spawn, gates, model selection) are `orchestration-subagent`; the template definitions and validation rules are `decomposition`.

## One session, no board trace

The squad runs entirely inside your current session. Sub-agents are ephemeral helpers: fresh context, one task, return to you, gone. Do not open a session per planning role and do not create board items for the squad's work — the board records the *outcome* (validated stories and tasks), never the helpers that produced it. Breaking the squad into N sessions or N board sub-tasks multiplies coordination cost without adding any capability.

The whole loop — analyze the scope, fan out, synthesize, validate, emit board items — is one continuous pass. Don't stop to check in between steps.

## Squad composition

Pick members by what the scope contains, not by habit — every extra agent is synthesis cost you pay later.

| Role | Loads skills | Returns | Include when |
|------|--------------|---------|--------------|
| PO | `prd-writing`, `requirements-gathering`, `acceptance-criteria` (+ `security-requirements` if PII/auth) | Story descriptions with Given/When/Then AC | always |
| Architect | `service-architecture`, `adr-writing` (+ `api-design` if the scope has API surface) | Units touched, technical decisions, required-reading list per story | always |
| Analyst | `test-design`, `test-scenarios` (+ `threat-modeling` if auth/external integration) | Test levels per story, edge and error scenarios | always |
| Devops | `release-engineering` | Deploy/rollback notes, environment constraints | only if deploys in scope |

Minimum viable squad: PO + architect + analyst. A scope with no deploy work gets no devops agent; a scope that is pure infra may invert the weights. The table is a default, not a law.

## Dispatch

Spawn the whole squad in one message, in parallel — their perspectives are independent by construction (same scope, different questions), so there is nothing to sequence.

Each agent's prompt must carry:

- the scope statement **verbatim** — squad members never read your session history or "the plan";
- which role it plays and which skills to load;
- the exact template section it must fill (from `decomposition`'s references);
- the instruction "your output must be self-contained — the reader has no other context".

## Synthesize

You merge; agents don't see each other's output. Read all four returns, fill the epic/story templates from `decomposition`, and resolve conflicts between perspectives yourself — you hold the goal, so a PO/architect disagreement is yours to settle (or to raise with the user if it changes scope).

Then validate exactly as `decomposition` requires: story checklist, dependency graph is a DAG, every named skill exists in the catalog. The squad's output is raw material — the validation gate is still yours.

## Emit

Create the board items: the validated stories and dev sub-tasks, each carrying its required reading and AC. That is the only artifact the squad leaves behind.

## How it connects

- `decomposition` — defines the templates, sizing rules, and validation this squad fills and passes.
- `orchestration-subagent` — the dispatch mechanics (and the one-session principle this skill applies to planning).
- `implementation-squad` — the execution-side counterpart: who to dispatch and what to parallelize when building what this squad planned.

## Roles

For the conducting agent of the planning phase (on a standing team, `secretary` or the orchestrator decomposing a claimed task; solo, your main session). The squad members are the planning roles from `agents/` (pm, architect, analyst, devops).
