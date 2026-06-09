---
name: orchestration
description: Run a body of work across multiple agents instead of doing it all yourself — choose how to delegate (ephemeral subagent calls vs a standing agent-team) and how to sequence it (one-at-a-time with review gates vs parallel fan-out). Use this whenever you have several tasks or a decomposed plan to execute, want to dispatch work to specialist agents, parallelize independent work, or coordinate a team, or when the user mentions "orchestrate", "dispatch agents", "run the team", "delegate", "subagents", or "agent team". This is the router — it points you to orchestration-subagent or orchestration-team for the mechanics.
---

# Orchestration

Orchestration is the conductor's job: you hold the goal and the plan, and you run the work through agents rather than doing every step yourself. You stay in coordination — deciding what gets dispatched, in what order, and whether each result is good enough — while specialist agents do the focused work.

This skill is the entry point. It establishes the principles that apply no matter how you delegate, then routes you to the right mechanics skill.

## Core principles (apply to every mode)

These come from a hard-won observation: orchestration succeeds or fails on how well you construct each agent's task, not on the agent's cleverness.

- **Agents do not inherit your context — construct exactly what each one needs.** A dispatched agent starts fresh. Give it the precise scope, the relevant facts, the files/sections to read, and the expected output. Don't make it read your whole plan or reconstruct your reasoning. This keeps it focused *and* preserves your own context for coordination.
- **Work is not done until it is reviewed.** Build a review gate into the flow (spec compliance, then quality). An agent reporting "done" is a claim, not a verdict.
- **Use the least powerful model that can do the task.** Mechanical, well-specified work → a fast cheap model. Integration/judgment → standard. Architecture/design/review → the most capable. This conserves cost and time without lowering the ceiling where it matters.
- **Execute continuously; stop only on a real blocker.** Once the plan is agreed, don't pause to ask "should I continue?" between tasks — that wastes the user's time. Stop only for a blocker you can't resolve, genuine ambiguity, or completion.

## Choosing how to delegate

Two independent questions decide your approach.

**1. Which delegation model? (the big choice)**

- **Subagent calls** — you spawn ephemeral, isolated agents, hand each a crafted task, and collect the result directly. Best for bounded work you can scope up front. This is the default on Claude Code (the Agent tool) and opencode (subagents). → use `orchestration-subagent`.
- **A standing agent-team** — a persistent, role-specialized team coordinated through a shared board/dispatcher; agents may run longer, hand off to each other, and you monitor rather than micromanage. This is the model on Hermes (the kanban dispatcher routes to profiles), and any setup with long-lived named roles. → use `orchestration-team`.

If your harness only gives you one model, that's your answer. If it gives you both, prefer subagent calls for a contained piece of work, and a team when the work is large, ongoing, or naturally splits across persistent roles with dependencies.

**2. Sequential or parallel?**

- **Sequential** when tasks are coupled, must happen in order, or each needs a review gate before the next (most implementation work). 
- **Parallel** when tasks are genuinely independent — different files, subsystems, or problem domains with no shared state. Fan them out and integrate after.

This choice lives *inside* each model; both `orchestration-subagent` and `orchestration-team` cover it.

## How it connects to the rest of the toolkit

- **Input:** the tasks/stories produced by `decomposition` — already sized and carrying their required reading.
- **What a dispatched implementer runs:** the `dev` skill (the per-story build loop).
- **The review gate:** the `code-review` skill.
- **Who the work goes to:** the role agents in `agents/` (analyst, architect, pm, designer, the developer roles, tester, reviewer, researcher, devops).

## Roles

This skill is for whoever is conducting — the main agent you talk to, not a separate "orchestrator" agent. It assigns work to the specialist roles and owns the gates, but never does the implementation itself.
