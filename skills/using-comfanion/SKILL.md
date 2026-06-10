---
name: using-comfanion
description: Establishes how to find and use this toolkit's skills at the start of any task — check whether a skill applies before responding, and if one does, invoke it and follow it rather than improvising. Use this when a conversation or task begins, before clarifying questions or exploration. This is the entry point and router for the skill library; it does not perform any delivery work itself.
---

# Using Comfanion

This toolkit only helps if its skills actually get invoked. A skill that exists but is skipped is worth nothing — the default failure mode is improvising a task that a skill already encodes a better way to do. This skill is the gate that turns "there is a skill for this" into "the skill was used."

It is the one always-on entry point; every other skill loads on demand by task match.

## Instruction priority

This ordering is absolute:

1. **User and project instructions** (the conventions guide, project docs, direct requests) — highest. If they conflict with a skill, follow the user.
2. **Comfanion skills** — override default improvisation where they apply.
3. **Default behavior** — lowest.

A skill tells you *how* to do a thing well; it never overrides what the user asked for. "Add X" means add X — it does not license skipping the workflow that makes adding X correct, but it also does not let a skill countermand an explicit user choice.

## The rule

```
CHECK FOR AN APPLICABLE SKILL BEFORE RESPONDING — EVEN A 1% CHANCE MEANS CHECK
```

At the start of any task, before clarifying questions and before exploring code, ask: does a skill apply? If there is even a small chance one does, invoke it and read it. If it turns out not to fit, you have lost nothing — drop it and proceed. Invoking a skill that does not fit is cheap; skipping one that did is the expensive mistake.

When you invoke a skill: announce it briefly ("Using `<skill>` to <purpose>"), and if it carries a checklist, turn each item into a tracked todo before starting.

## How to route

Most tasks map to a phase of the pipeline (see `FLOW.yaml`) and the skill(s) that drive it:

| The task is about… | Start with |
|--------------------|------------|
| What to build / real needs | `requirements-gathering`, then `prd-writing` |
| System or service structure | `system-architecture` / `service-architecture` (mind the altitude ladder) |
| Breaking scope into work | `decomposition` |
| Implementing an approved story | `dev` (which pulls in `test-design`, TDD) |
| A bug, failure, or crash | `systematic-debugging` |
| Judging finished code | `code-review` (routes the `review-*` dimensions) |
| Acting on review feedback | `receiving-code-review` |
| Claiming anything is done | `verification-before-completion` |
| Ideation / problem analysis | `brainstorm` |
| Running work across roles | `orchestration` (then `-subagent` or `-team`) |

**Process skills before implementation skills.** "Let's build X" → `brainstorm` / requirements first, then the implementation skills. "Fix this bug" → `systematic-debugging` first, then the domain skill. The process skill decides *how* you approach the task; deciding that after you have started is too late.

## Rigid vs. flexible skills

Each skill says which it is. **Rigid** skills (`verification-before-completion`, `systematic-debugging`, `dev`'s TDD core, `review-security`) carry an Iron Law and are followed exactly — you do not adapt away the discipline because it feels like overkill this once. **Flexible** skills are principles to adapt to context. Treat the rigid ones as non-negotiable; that rigidity is the whole value.

## Red flags — you are rationalizing past the rule

| Thought | Reality |
|---------|---------|
| "This is just a simple question" | Questions are tasks. Check for a skill. |
| "Let me explore the code first" | Skills tell you *how* to explore. Check before. |
| "I need more context before checking" | The skill check comes before clarifying questions. |
| "This doesn't need a formal skill" | If a skill exists for it, use it. |
| "I remember how this skill goes" | Skills change. Invoke and read the current version. |
| "The skill is overkill here" | Simple things grow complex. The discipline is cheap. |
| "I'll just do this one part first" | Check before doing anything. |

## Harness adaptation

Skills are written in capability prose ("search the codebase", "spawn a subagent"), not harness-specific tool names. `docs/capability-map.md` translates each capability to the concrete tool on Claude Code, opencode, Codex, and Hermes. On Claude Code, invoke skills with the `Skill` tool; on other harnesses, use that harness's skill mechanism. Never `Read` a skill file to "use" it — invoke it through the harness so it loads as an instruction.

## Roles

Loaded by the conducting agent (the one you talk to — `secretary` for planning, `orchestrator` for execution) at the start of work, and applicable to any role before it acts. It is the front door to the library; from here each role draws whatever skills its task needs. It authors nothing itself.

## Related

- `FLOW.yaml` — the pipeline this skill routes against.
- `ARCHITECTURE.md` — the full role + skill catalog and the two-layer model.
- `orchestration` — once a skill is chosen and work spans roles, this decides how to run it.
- `docs/capability-map.md` — capability-to-tool translation per harness.
