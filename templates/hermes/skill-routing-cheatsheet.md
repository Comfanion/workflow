# Skill Routing Cheatsheet (Hermes profiles)

Embed this block in a profile's SOUL.md (or load it at task pickup). It exists because Hermes has no always-on skill injection: `skill_view` returns skill content as a tool result, not pinned instructions, and no session hook surfaces `using-comfanion` automatically. Without this table a worker improvises tasks that a skill already encodes a better way to do.

## The rule

Before acting on any task — before clarifying questions, before exploring code — check this table. If a skill matches even 1%, run `skill_view('<name>')` and follow it. Re-view the skill at the start of each phase it governs: tool-result content fades as the conversation grows, so one view at session start is not enough for a long task.

## Routing table

| The task is about… | skill_view |
|--------------------|------------|
| What to build / real needs | `requirements-gathering`, then `prd-writing` |
| System or service structure | `system-architecture` / `service-architecture` |
| Breaking scope into work | `decomposition` (squad: `planning-squad`) |
| Implementing an approved story | `dev` (TDD core); test strategy came from `test-design` at planning time |
| A bug, failure, or crash | `systematic-debugging` |
| Judging finished code | `code-review` (routes the `review-*` dimensions) |
| Acting on review feedback | `receiving-code-review` |
| Claiming anything is done | `verification-before-completion` |
| Ideation / problem analysis | `brainstorm` |
| Running work across roles | `orchestration` (then `-subagent` or `-team`; who to spawn: `planning-squad` / `implementation-squad`) |

## Rigid skills — never adapted away

`verification-before-completion`, `systematic-debugging`, `dev`'s TDD core, `review-security`. Each carries an Iron Law; follow exactly, even when it feels like overkill.

## Keeping this in sync

This table mirrors the routing table in `skills/using-comfanion/SKILL.md` — that file is the source of truth. When it changes, update this cheatsheet and the profiles that embed it.
