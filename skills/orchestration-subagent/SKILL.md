---
name: orchestration-subagent
description: MECHANICS skill for dispatching ephemeral, in-session subagents — not the router, not composition, not standing teams. Use when you already hold a decomposed plan or a set of independent tasks and need to spawn isolated subagents (one crafted task each) that live and die inside your current session. Trigger when the user says "subagents", "dispatch", "delegate", "fan out", "parallelize", "run these in parallel", "have an agent do X", or "agent-driven", or when you have a harness with a subagent call (Claude Code Agent tool, opencode subagents, Hermes ephemeral calls) and want either sequential review-gated execution (implementer → spec review → quality review → next task) or parallel fan-out across genuinely independent domains (different files/subsystems, no shared state). This is the HOW: constructing each agent's isolated context, picking its model, gating its output, collecting results — without spawning new sessions or board items. Route elsewhere: `orchestration` is the router and shared delegation-model principles (read it first, including the choice of whether work belongs on a board at all); `planning-squad` and `implementation-squad` own the WHO — which roles to spawn — so never derive a squad here; `orchestration-team` owns standing role-teams coordinated via a persistent board where persistence is the point. Don't use for a single linear task you'll do yourself, for creating board tickets/stories, or for deciding which specialists to assemble.
---

# Orchestration via Subagent Calls

You delegate to fresh subagents you spawn and collect from directly. Each gets an isolated context you construct deliberately — never your session history. This both keeps the subagent focused and preserves your context for coordination. Read `orchestration` first for the shared principles (construct context, review gates, model selection, continuous execution).

## One session, ephemeral helpers

Sub-agents are ephemeral: fresh context, one task, return to you, gone. They are NOT peer sessions and never outlive yours. Everything this skill describes — analysis, fan-out, synthesis, creating the resulting board items — happens inside your current session. Do not break a fan-out into N new sessions or N new board sub-tasks; that multiplies coordination cost without adding capability (the opposite of `orchestration-team`, where persistence is the point).

A board, if one exists, records the *outcomes* of your session (stories, tasks, results) — never the helpers you used to produce them.

This rule is about the helpers, not about where execution work belongs. Whether a story should be a persistent board item with its own session — its own branch, worktree, and dev → review → test lifecycle — is the delegation-model choice made in `orchestration`, set by project rules. On a harness with a board, substantial stories that need testing and parallel review usually go to the board (`orchestration-team`); don't force them through in-session calls just to avoid creating tickets. Planning and the fan-outs *inside* one worker's task are where in-session sub-agents shine.

Pick the sub-mode by how the tasks relate.

## Sequential mode — review-gated, one task at a time

Use when tasks are coupled, ordered, or each needs verification before the next (most implementation work). The loop, per task:

1. **Prepare once.** Read the plan, extract every task with its full text and context, and build a checklist. Subagents won't read the plan — you hand them the text.
2. **Dispatch an implementer subagent** with the crafted task (see `references/implementer-prompt.md`). Pick its model by task complexity. Let it ask questions before it starts — answer fully.
3. The implementer implements, tests, commits, and self-reviews, then reports a status:
   - **DONE** → go to review.
   - **DONE_WITH_CONCERNS** → read the concerns; fix correctness/scope issues before review, note mere observations and proceed.
   - **NEEDS_CONTEXT** → provide what's missing, re-dispatch.
   - **BLOCKED** → something must change: add context (re-dispatch same model), or escalate to a more capable model, or split the task, or — if the plan is wrong — raise it with the user. Never re-dispatch the same model with no change.
4. **Spec-compliance review** (`references/spec-reviewer-prompt.md`) — does the code match the task, nothing missing, nothing extra? Issues → implementer fixes → re-review. Do this *before* quality review.
5. **Quality review** (`references/quality-reviewer-prompt.md`) — once spec is ✅. Issues → implementer fixes → re-review.
6. Mark complete, move to the next task. Don't stop to check in.

After all tasks: one final review of the whole implementation, then finish the branch.

**Never** run two implementer subagents in parallel on coupled work (they conflict), skip either review, or move on with open review issues. Fixes go through the implementer (same subagent, or a fix dispatch) — never patch its work by hand: manual fixes pollute your coordination context and bypass the gates.

## Parallel mode — independent fan-out

Use when tasks are genuinely independent: different files, subsystems, or problem domains with no shared state (e.g. several unrelated test failures, separate bug domains).

1. **Identify independent domains.** Group the work so fixing one can't affect another. If two items might share a cause or a file, they are not independent — keep them together.
2. **Craft one focused, self-contained task per domain** — specific scope, all context needed (paste the errors/names), explicit constraints ("don't touch other code"), and the exact output you want back (a summary of root cause + changes).
3. **Dispatch concurrently** — on Claude Code, issue several Agent calls in one turn; on opencode, spawn the subagents together.
4. **Integrate and verify.** Read each summary, check the changes don't conflict, run the full suite, spot-check for systematic errors.

If results conflict, you've discovered a hidden dependency — reconcile by hand and consider re-running the affected pieces sequentially.

## Squad compositions — who to spawn

This skill is the *mechanics*: how to dispatch, gate, and collect. The *composition* — which roles to spawn for a given kind of work — lives in two sibling skills, so you never derive a squad from scratch:

- **`planning-squad`** — fanning specialist perspectives (PO, architect, analyst, devops) out over a scope that needs decomposing, then synthesizing into the `decomposition` templates.
- **`implementation-squad`** — deciding lanes when executing decomposed work: the implementer + two-reviewer trio per lane, the independence test for what may run in parallel, and what never overlaps.

## Per-harness dispatch

The pattern is the same; the call differs.

- **Claude Code** — the Agent tool; `subagent_type` selects a role agent from `agents/`. Parallel = multiple Agent calls in a single message.
- **opencode** — subagent invocation; assign the matching role.
- **Hermes** — ephemeral subagent calls exist, but standing work belongs on the board; for that use `orchestration-team`.

Keep tasks referring to capabilities, not a specific harness tool, when you craft them — the dispatched agent uses whatever its environment provides.

## How it connects

Input tasks come from `decomposition` (already sized, carrying their required reading). A dispatched implementer runs the `dev` skill. The review gate uses `code-review`. Roles come from `agents/`.

## Roles

For the conducting agent (the main session). It spawns specialists and owns the gates; it does not implement.
