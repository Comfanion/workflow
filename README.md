# Comfanion — Agentic Development Toolkit

A harness-neutral **skills library** for running software projects with AI — reusable procedures that take a project from a rough idea through requirements, architecture, standards, decomposition, implementation, and review. The skills are the substance; agent roles are an optional layer on top that dispatches them.

It is deliberately lean: no MCP servers, just skills (and roles) in clean Markdown. The same content runs anywhere an agent can read skills — Claude Code, opencode, Codex, Hermes. The one harness-specific piece is optional: a Claude Code SessionStart hook (`hooks/`) that surfaces the `using-comfanion` router at session start; delete it to stay fully neutral.

## The skills, by area

Skills are a single shared library under `skills/`. Each surfaces by task match — its own `description` decides when it applies — so nothing is bound to a role or a phase. They group into areas (the full catalog is `ARCHITECTURE.md`):

| Area | What it covers | Headline skills |
|------|----------------|-----------------|
| **Intake & product** | Turn an idea into validated requirements and a product contract | `requirements-gathering`, `prd-writing`, `acceptance-criteria`, `security-requirements`, `brainstorm`, `research-methodology`, `research-planning` |
| **Architecture** | The altitude ladder **system → service → unit**, never mixed | `system-architecture`, `service-architecture`, `unit-writing`, `adr-writing`, `api-design`, `database-design`, `diagram-creation`, `threat-modeling` |
| **Standards** | The project's agreed rules — one canonical, **section-addressable** source per topic | `standards` (umbrella) → `authoring-standards` + `standards-coding/-testing/-security/-performance/-api/-database/-git/-temporary-decisions/-events/-observability`; `using-standards` (consumer) |
| **Design (UX)** | User flows, states, and the visual system | `ux-design`, `design-system` |
| **Implementation** | The study-first, test-driven build loop | `dev` (TDD; single-story + epic/sprint batch modes), `test-design`, `test-scenarios`, `test-execution`, `systematic-debugging` |
| **Review & verification** | The last gate before merge | `code-review` → `review-security/-correctness/-tests/-performance/-complexity`, `receiving-code-review`, `verification-before-completion` |
| **Delivery & ops** | Where it runs and how it ships | `platform-infrastructure` (shared substrate), `service-deployment` (one service), `release-engineering` (release runbook + deploy gate) |
| **Orchestration** | Run the work across roles | `orchestration` → `orchestration-subagent` / `orchestration-team`; `planning-squad`, `implementation-squad` |
| **Cross-cutting** | Entry point and utilities | `using-comfanion` (the router), `changelog`, `doc-todo`, `archiving`, `translation` |

Two rules cut through everything: the **architecture altitude ladder** (`system → service → unit` — keep landscape decisions out of a service's internals and vice-versa), and the **rigid craft skills** that each carry an Iron Law — `verification-before-completion` (no "done" without fresh evidence), `systematic-debugging` (root cause before any fix), `receiving-code-review` (act on feedback with rigor, not reflexive agreement).

### Section-addressable standards

Each standards document opens with a **Reading guide** that maps a consumer to the sections it needs — so an architect at design time, a developer at build time, and a reviewer load only the relevant part, not the whole file. `using-standards` reads the guide and loads selectively. Authoring discipline (single source, rules-only, cite the governing ADR, review before propagation) lives in `authoring-standards`.

## The pipeline

The skills compose into a recommended flow (full map in `FLOW.yaml`):

```
research → requirements → prd → architecture → delivery-design → design → decomposition → implementation → testing → review → deploy
```

Each phase names the role that owns it and the skills it draws on. Phases are guidance, not a rail — skills surface by task match, so any of them can be used on its own.

## Agent roles (optional execution layer)

`agents/` holds 13 role viewpoints — secretary, orchestrator, analyst, architect, pm, designer, fullstack/backend/frontend-developer, tester, reviewer, researcher, devops. A role is a **perspective with a mission and scope**; it does not own a fixed set of skills and never references another role — it draws from whichever skills the task needs. The conducting agent (`secretary` for planning, `orchestrator` for execution) dispatches work and enforces review gates via the `orchestration*` skills.

Roles are **optional** — the skills work without them. Where a harness supports subagents (Claude Code, opencode), each role loads as a dispatchable subagent; on Claude Code you pick the model per dispatch (lighter roles cheap and fast, significant ones stronger), so the same role files stay model-agnostic and portable. Drop `agents/` entirely if you only want the skills.

## Layout

```
skills/<name>/
  SKILL.md          # frontmatter (name + description) + the procedure
  references/       # heavy templates / checklists, loaded only when needed
agents/<role>.md    # role viewpoints (optional)
ARCHITECTURE.md     # the two-layer model + full skill/role catalog
FLOW.yaml           # the recommended pipeline: phase → role(s) → skill(s) → artifact(s)
docs/capability-map.md  # capability → concrete tool per harness
hooks/              # OPTIONAL, Claude Code only — SessionStart hook that surfaces using-comfanion
plugins/comfanion/  # subdirectory plugin (manifest + symlinks to root skills/agents) for marketplace install
.claude-plugin/     # Claude Code marketplace + plugin manifests
.opencode/          # opencode symlinks → root skills/agents
templates/hermes/   # setup-team.sh — create Hermes profiles from agents/
```

Conventions every skill follows:

- Frontmatter is just `name` + a `description` that says what it does and when to trigger.
- The body is imperative and explains *why*, not just *what*; heavy material lives in `references/` and loads on demand.
- Document output goes under `{DOCS_ROOT}` (default `docs/`); no absolute or harness-specific paths.
- No persona names, no harness-specific tool mandates — capabilities are described, not hard-wired.

## Install

One `skills/` source serves every harness; each gets a thin manifest pointing at it.

- **Claude Code** — add the repo as a plugin marketplace and install `comfanion`. Skills load from `skills/` and roles become subagents from `agents/` automatically.
- **Codex** —
  ```
  codex plugin marketplace add <path-or-git-url-of-this-repo>
  codex plugin add comfanion@comfanion
  ```
  The plugin lives at `plugins/comfanion/` (a subdirectory plugin, which Codex requires) and points back at the root single-source skills/agents.
- **opencode** — `.opencode/skills` and `.opencode/agents` symlink to the root source; opencode discovers all roles and skills automatically (`opencode agent list` shows them).
- **Hermes** — add the repo as a skill tap, then install per role profile:
  ```
  hermes skills tap add <git-url-of-this-repo>
  hermes -p <role> skills install <tap>/<skill>
  ```
  Create the role profiles first with `templates/hermes/setup-team.sh`.

Skills describe **capabilities** ("search the codebase", "spawn a subagent") rather than naming a harness's tools — `docs/capability-map.md` maps each capability to the concrete tool per harness.

## Status

57 skills, 13 agent roles. Harness-neutral and consistent. Verified loading on Claude Code and opencode; Codex installs as a subdirectory plugin (`installed, enabled`). Hermes packaging present (tap + profile setup).
