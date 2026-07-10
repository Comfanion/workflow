# Comfanion Toolkit

This project uses the **comfanion** toolkit — a multi-harness skills library for
running software projects with AI. The skills take a project from a rough idea
through requirements, architecture, standards, decomposition, implementation,
and review.

## First action — load the entry-point skill

Before responding to any task, **read `skills/using-comfanion/SKILL.md`** and
follow it. That skill is the router for the entire library: it tells you when
each of the 56 skills applies and how to invoke them.

The rule, verbatim from `using-comfanion`:

```
CHECK FOR AN APPLICABLE SKILL BEFORE RESPONDING — EVEN A 1% CHANCE MEANS CHECK
```

## Pipeline

Skills compose into a recommended flow (full map in `FLOW.yaml`):

```
research → requirements → prd → architecture → delivery-design → design
       → decomposition → implementation → testing → review → deploy
```

Each phase names the role that owns it and the skills it draws on. Phases are
guidance, not a rail — skills surface by task match, so any of them can be used
on its own.

## The two rigid craft skills

Two rules cut through everything:

1. **`verification-before-completion`** — no "done / fixed / passing / ready"
   claim without fresh evidence (run the command, read the output, then state
   the result).
2. **`systematic-debugging`** — find root cause before any fix; never patch
   symptoms.

Treat both as non-negotiable.

## Where to look

| Need | Path |
|------|------|
| Entry point / router | `skills/using-comfanion/SKILL.md` |
| Full skill catalog | `ARCHITECTURE.md` |
| Pipeline definition | `FLOW.yaml` |
| Roles (viewpoints) | `agents/<role>.md` |
| Per-skill procedure | `skills/<name>/SKILL.md` |
| Per-skill templates | `skills/<name>/references/` |
| Plugin conventions reference | `docs/plugin-architecture.md` |

## Cross-harness

The same skills run on Claude Code, Codex, and Gemini CLI. On Gemini, you load
this `GEMINI.md` automatically; skills under `skills/<name>/SKILL.md` are
discovered by Gemini's skill loader.
