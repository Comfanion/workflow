# Agentic Development Toolkit

A harness-neutral toolkit for running software projects with AI agents — a set of **skills** (reusable procedures) and **agent roles** that take a project from a rough idea through requirements, design, decomposition, implementation, and review.

It is deliberately lean: no plugins, no MCP servers, no harness-specific tooling — just skills and roles in clean Markdown. The same content is meant to run anywhere an agent can read skills: Claude Code, opencode, Codex, and Hermes.

## The model

Three ideas, kept strictly separate:

- **Roles (`agents/`)** are viewpoints — analyst, architect, pm, dev, reviewer, researcher, change-manager. Each is a perspective with a mission and a scope. A role does **not** own a fixed set of skills, and it never references another role; it just knows its own job.
- **Skills (`skills/`)** are a single shared library. Any role draws from whichever skills the task needs. Skills surface by task match — each skill's own `description` decides when it applies — so nothing is bound to a role.
- **Orchestration** is how the work actually runs across roles. The agent you talk to conducts: it dispatches work and enforces review gates, using the `orchestration*` skills. Roles never coordinate each other directly.

## The pipeline

The skills compose into a recommended flow (see `FLOW.yaml` for the full map):

```
research → requirements → prd → architecture → decomposition → implementation → review
```

- **requirements-gathering** — elicit and validate functional/non-functional requirements (the source of truth).
- **prd-writing** — the product contract: why and what. Keeps build plans and architecture out.
- **architecture** — two altitudes, never mixed:
  - **system-architecture** — the landscape: which services exist, their boundaries, inter-service contracts, data ownership, topology. Multi-service systems only.
  - **service-architecture** — one service's internals: style (Layered/Hexagonal/Clean/Vertical-Slices), modules, data ownership, stack.
  - **unit-writing** — one module's detailed contract (data model, API, events).
  - Supporting: **adr-writing**, **api-design**, **database-design**, **diagram-creation**, **coding-standards**.
- **decomposition** — break scope into epics → stories → sprints at the right granularity, each carrying enough context that the next level can act without asking.
- **dev** — the implementation loop (single story + epic/sprint batch modes, TDD), with **test-design**, **code-review**, **acceptance-criteria**.
- **orchestration / orchestration-subagent / orchestration-team** — run the work: ephemeral subagent calls (sequential review-gated or parallel fan-out) or a standing role-team coordinated via a board.
- Utilities: **research-methodology**, **changelog**, **doc-todo**, **archiving**, **translation**.

The architecture altitude ladder is the toolkit's sharpest rule: **system → service → unit**. Keep landscape decisions out of a service's internal design, and vice-versa.

## Layout

```
skills/<name>/
  SKILL.md          # frontmatter (name + description) + the procedure
  references/       # heavy templates / checklists, loaded only when needed
agents/<role>.md    # role viewpoints
ARCHITECTURE.md     # the two-layer model + full skill/role catalog
FLOW.yaml           # the recommended pipeline: phase → role(s) → skill(s) → artifact(s)
docs/
  capability-map.md # capability → concrete tool per harness
.claude-plugin/     # Claude Code plugin + marketplace manifests
.codex-plugin/      # Codex manifest
.opencode/          # opencode symlinks → root skills/agents (best-effort)
templates/hermes/   # setup-team.sh — create Hermes profiles from agents/
```

Conventions every skill follows:

- Frontmatter is just `name` + a `description` that says what it does and when to trigger.
- The body is imperative and explains *why*, not just *what*; heavy material lives in `references/` and is loaded on demand.
- Document output goes under `{DOCS_ROOT}` (default `docs/`); no absolute or harness-specific paths.
- No persona names, no harness-specific tool mandates — capabilities are described, not hard-wired.

## Using it

One `skills/` source serves every harness; each gets a thin manifest pointing at it.

- **Claude Code** — install as a plugin. The marketplace manifest lives at `.claude-plugin/marketplace.json`; add the repo as a plugin marketplace and install `comfanion`. Skills load from `skills/` and roles become subagents from `agents/` automatically.
- **Codex** — `.codex-plugin/plugin.json` declares `skills: ./skills/` and `agents: ./agents/`. Point Codex at the repo.
- **Hermes** — add the repo as a skill tap, then install per role profile:
  ```
  hermes skills tap add <git-url-of-this-repo>
  hermes -p <role> skills install <tap>/<skill>
  ```
  Create the role profiles first with `templates/hermes/setup-team.sh` (profiles are host-side; see the script).
- **opencode** — `.opencode/skills` and `.opencode/agents` symlink to the root source (best-effort; see `.opencode/INSTALL.md`).

Skills describe **capabilities** ("search the codebase", "spawn a subagent") rather than naming a harness's tools — `docs/capability-map.md` maps each capability to the concrete tool per harness.

## Status

23 skills, 7 agent roles. Harness-neutral and consistent. Packaging present for Claude Code, Codex, Hermes (tap + profile setup); opencode via symlinks is best-effort and unverified after the flatten.
