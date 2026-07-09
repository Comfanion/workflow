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

## Language — English only

**All artifacts this toolkit produces — skill descriptions, docs, specs, ADRs, code comments, commit messages, project-state files — are English only. No Russian, no bilingual fields, no translations.** This applies regardless of the language the user converses in. The user may speak Russian in chat; the artifacts stay English. If asked to write a doc in Russian, refuse and produce English.

This rule exists so the artifact corpus is grep-able, retrievable, and consistent across harnesses and downstream consumers.

## Project state — read first

At the start of every session, before responding, check whether `project-state.yaml` exists at the **repository root** (same level as `FLOW.yaml`). If it does:

1. **Read it.** It is the single source of truth for where the project is.
2. **Resume from there**, not from scratch. The `current_phase`, `active_work`, and `open_decisions` fields tell you what is in flight and what is blocked.
3. **Update it on every transition** — when a phase advances, a story's status changes, a decision is made, or a session ends. Stale state defeats the purpose.

If `project-state.yaml` does not exist, copy `project-state.template.yaml` (also at the repo root, next to `FLOW.yaml`) into `project-state.yaml` at the start of the first session and fill in the project name. From then on, it is the resume point.

The state file lives at the **root**, not under `{DOCS_ROOT}` — it is a workflow control file like `FLOW.yaml`, not a pipeline output. Template fields and values are documented inline in the template.

## Protected paths — do not verbally override

`protected.yaml` at the repo root declares decisions and paths that cannot be skipped by a verbal user instruction. When the user asks to bypass, skip, or ignore something that matches a `protected.yaml` entry:

1. **Refuse** silently proceeding.
2. **State the protection** — *"That is protected under `<id>`: `<reason>`. To override, add an entry to `protected-unlocks.md` with date, protected id, reason, author, and expiry."*
3. **Read `protected-unlocks.md`.** If a matching entry exists, proceed. If not, do not proceed — wait for the user to add one.

This is the policy-as-code layer above the skills: even when a skill's discipline could be skipped by user instruction (priority rule 1 — user instructions outrank skills), the protected-path policy outranks the user's verbal request. The user can still override — but only by writing the unlock entry, not by saying "skip it". See `docs/enforcement.md` for the full mechanism.

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
| Infrastructure / how & where it deploys | `platform-infrastructure` (shared substrate) · `service-deployment` (one service's infra) · `release-engineering` (shipping a version + deploy gate) |
| Breaking scope into work | `decomposition` |
| Implementing an approved story | `dev` (TDD core); test strategy came from `test-design` at planning time |
| A bug, failure, or crash | `systematic-debugging` |
| Judging finished code | `code-review` (routes the `review-*` dimensions) |
| Acting on review feedback | `receiving-code-review` |
| Claiming anything is done | `verification-before-completion` |
| Ideation / problem analysis | `brainstorm` |
| Running work across roles | `orchestration` (then `-subagent` or `-team`; who to spawn: `planning-squad` / `implementation-squad`) |
| Setting up / authoring project standards | `standards` (umbrella) → routes to `standards-coding`, `-testing`, `-security`, `-performance`, `-api`, `-database`, `-git`, `-temporary-decisions`, `-events`, `-observability`; the cross-cutting authoring discipline is `authoring-standards` |
| Consuming already-written standards during design / dev / review | `using-standards` |

**Process skills before implementation skills.** "Let's build X" → `brainstorm` / requirements first, then the implementation skills. "Fix this bug" → `systematic-debugging` first, then the domain skill. The process skill decides *how* you approach the task; deciding that after you have started is too late.

## Artifact metadata — OKF v0.1 conformance

Every doc this toolkit produces under `{DOCS_ROOT}` (architecture, standards, ADRs, epics/stories, research, design, runbooks, …) opens with a YAML frontmatter block — the templates carry it. **The bundle is conformant with the [Open Knowledge Format v0.1](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md).**

### Required (OKF §4.1)

- **`type`** — short string identifying the kind of concept (e.g. `prd`, `system-architecture`, `adr`, `research`, `epic`, `story`, `unit-index`, `unit-data-model`). Consumers use this for routing, filtering, dedup. Not centrally registered — pick descriptive values, tolerate unknown ones gracefully.

### Recommended (OKF §4.1, comfanion convention)

- **`title`** — human-readable display name; if omitted, consumers derive from filename or first H1.
- **`description`** — one-line summary; used by index generators and search previews.
- **`domain`** — the module/domain the doc belongs to; the dedup axis. Use the same value across docs about the same scope so `rg -l "^domain: billing"` finds them all.
- **`tags`** — YAML list of cross-cutting labels.
- **`status`** — `draft | approved | deprecated | superseded`.
- **`timestamp`** — ISO 8601 datetime of last meaningful change. **`updated` is accepted as a legacy alias**; new docs use `timestamp`.
- **`related`** — list of paths/URIs to sibling docs; surfaces relationships and prevents orphan duplicates.

Extensions (id, version, author, supersedes, deciders, …) are allowed by OKF §4.1 — add whatever the doc kind needs.

### Cross-linking (OKF §5)

Concepts link to concepts via standard markdown links. Two forms:

- **Bundle-relative absolute** (preferred — stable when docs move within their subtree): `see the [customers entity](/docs/architecture/modules/billing/domains/subscription/entities/plan.md)`.
- **Relative**: `[sibling](./other.md)`.

A link from A to B asserts a relationship; the surrounding prose conveys the kind (parent/child, references, joins-with, depends-on). Build the cross-link graph deliberately when authoring — especially between units that share a contract (two domains that exchange events, a service and the module that owns it). `unit-writing` covers this for module/domain pairs (see that skill).

### Index files (OKF §6)

- `docs/index.md` is the **bundle root** — the ONLY `index.md` allowed to have frontmatter (must declare `okf_version: "0.1"`).
- Any subdirectory of `docs/` MAY have its own `index.md` — **no frontmatter**, body is a directory listing grouped under headings.
- Use indexes for progressive disclosure: let a consumer see what's available before opening individual docs.

### Citations (OKF §8)

When a doc's body makes claims sourced from external material, list them under a `# Citations` heading at the bottom, numbered: `[1] [source](url)`.

### Dedup — search before creating

Before producing a new artifact, search existing docs first — do not blindly create. Grep the `{DOCS_ROOT}` frontmatter for the same `type` + `domain` (e.g. `rg -l "^type: adr" docs/ | xargs rg -l "^domain: catalog"`). If a matching doc exists, **update it** (bump `timestamp`, append/supersede) instead of writing a second one. This is how the toolkit keeps agents from proliferating near-duplicate documents. When you do write one, fill the frontmatter honestly — `type`/`domain`/`tags` are what the next agent filters on.

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

Not every harness pins an invoked skill in context — if yours returns skill content as a tool result rather than injecting it, re-invoke the skill at the start of each phase it governs (per-harness behavior: `docs/capability-map.md`).

## Roles

Loaded by the conducting agent (the one you talk to — `secretary` for planning, `orchestrator` for execution) at the start of work, and applicable to any role before it acts. It is the front door to the library; from here each role draws whatever skills its task needs. It authors nothing itself.

## Related

- `FLOW.yaml` — the pipeline this skill routes against.
- `ARCHITECTURE.md` — the full role + skill catalog and the two-layer model.
- `orchestration` — once a skill is chosen and work spans roles, this decides how to run it.
- `docs/capability-map.md` — capability-to-tool translation per harness.
