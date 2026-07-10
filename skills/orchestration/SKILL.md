---
name: orchestration
description: Use this as the **router** when you — the conductor — need to decide *how* to run a body of work across multiple agents: which delegation model (ephemeral subagent calls vs a standing agent-team), which sequencing (sequential with review gates vs parallel fan-out), and which phase-domain (planning vs execution). Fire on: several tasks or a decomposed plan to execute, a desire to delegate/parallelize/coordinate specialist agents, or user terms like "orchestrate", "run this across agents", "delegate the work", "sequence these tasks", "choose how to dispatch". Do NOT fire for the mechanics themselves — `orchestration-subagent` (spawning one isolated agent, the Agent/subagent tool) and `orchestration-team` (standing roles, Hermes kanban board, persistent dispatcher) own those. Do NOT fire for ready-made compositions — `planning-squad` (fan out specialist perspectives to plan a feature) and `implementation-squad` (lanes of implementer + reviewers over decomposed stories) own those. Also do not fire for a single trivial inline edit (do it yourself). This skill establishes the cross-cutting principles — read `project-state.yaml` first, construct each agent's task, gate every result, use the least powerful model, conduct vs act directly — then routes you to the right mechanics skill.
---

# Orchestration

Orchestration is the conductor's job: you hold the goal and the plan, and you run the work through agents rather than doing every step yourself. You stay in coordination — deciding what gets dispatched, in what order, and whether each result is good enough — while specialist agents do the focused work.

This skill is the entry point. It establishes the principles that apply no matter how you delegate, then routes you to the right mechanics skill.

## Core principles (apply to every mode)

These come from a hard-won observation: orchestration succeeds or fails on how well you construct each agent's task, not on the agent's cleverness.

- **Read `project-state.yaml` before dispatching.** The state file at the **repository root** (next to `FLOW.yaml`) is the single source of truth for where the project is and what is in flight. Read it first; dispatch from there. Update it on every phase transition and every story status change.
- **Refuse verbal overrides of protected paths.** `protected.yaml` at the repo root declares decisions that cannot be skipped by user instruction (deploy gate, integration gate, security review, skip-architecture, etc.). When the user asks to bypass one, do not comply silently — state the protection and require an entry in `protected-unlocks.md` before proceeding.
- **Agents do not inherit your context — construct exactly what each one needs.** A dispatched agent starts fresh. Give it the precise scope, the relevant facts, the files/sections to read, and the expected output. Don't make it read your whole plan or reconstruct your reasoning. This keeps it focused *and* preserves your own context for coordination.
- **Work is not done until it is reviewed.** Build a review gate into the flow (spec compliance, then quality). An agent reporting "done" is a claim, not a verdict.
- **Use the least powerful model that can do the task.** Mechanical, well-specified work → a fast cheap model. Integration/judgment → standard. Architecture/design/review → the most capable. This conserves cost and time without lowering the ceiling where it matters.
- **Execute continuously; stop only on a real blocker.** Once the plan is agreed, don't pause to ask "should I continue?" between tasks — that wastes the user's time. Stop only for a blocker you can't resolve, genuine ambiguity, or completion.
- **Conduct vs act directly.** Delegation has a cost — crafting the task, dispatching, gating. For a trivial, direct, already-known, no-test change (fix a PRD line, correct a path), do it yourself: doing it inline is cheaper than describing it to an agent. Delegate when the work is substantial, needs an isolated context or a specialist, or requires testing. This never reopens "the conductor implements features" — substantial or testable build work is always dispatched and gated.
- **Hand off by reference when the artifact is self-contained; by full text when it isn't.** A decomposed story carries its required reading and AC — point the agent at the file (path + the sections it needs); re-pasting or re-explaining it wastes your context and drifts from the source. A task inside a larger plan does not stand alone — extract its full text and context yourself and hand that over; never tell a subagent "read the plan", it will drown in scope that isn't its own. The test: could the agent act on what you handed it with zero other knowledge?

## Choosing how to delegate

Three independent questions decide your approach.

**0. Which phase-domain? (planning vs execution)**

Orchestration is not one job. Orchestrating agents to **plan** a feature (research → requirements → prd → architecture → design → decomposition) is distinct from orchestrating agents to **execute** it (implementation → testing → review → deploy). On a standing team the two are owned by two conducting profiles — `secretary` (planning) and `orchestrator` (execution); on Claude Code the main session plays both. Each phase-domain still chooses a delegation model and a sequencing below. When delegating via subagent calls, each phase-domain has a ready squad composition — `planning-squad` (specialist perspectives fanned out over a scope, synthesized in one session) and `implementation-squad` (lanes of implementer + reviewers over decomposed work) — so you never derive who-to-spawn from scratch.

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

Conducting is a role, played differently per harness — not a fixed agent. On Claude Code / opencode it's your main session, which plays both phase-domains. On a standing team it's two profiles: `secretary` conducts planning and owns the intake/approval gate; `orchestrator` conducts execution and owns the build gates. Either way the conductor assigns work to the specialist roles and owns the gates, and never does substantial implementation itself — only trivial, direct, no-test edits (see "Conduct vs act directly").
