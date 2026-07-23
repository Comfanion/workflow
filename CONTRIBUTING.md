# Contributing to Comfanion

Comfanion is a multi-harness **skills library** — reusable Markdown procedures that take a software project from a rough idea through delivery, written once and run on any agent harness. Contributions are welcome: a new skill, a new agent role, an improvement to an existing procedure, a docs fix, or a correction to the multi-harness packaging. The library is the substance; keep it lean, harness-neutral, and consistent with what is already there.

## Before you start

Read **[ARCHITECTURE.md](ARCHITECTURE.md)** first — it defines the two-layer model (roles are *who*, skills are *how*; the two are never wired together) and the full catalog. Then read the closest existing skill or role to what you want to add and use it as a template. The conventions below are extracted from those files; when in doubt, match the neighbors.

## How to add a skill

A skill lives at `skills/<name>/SKILL.md`, with heavy templates and checklists under `skills/<name>/references/` loaded on demand. The layout and the four conventions every skill follows are stated in [README.md#layout](README.md) ("Conventions every skill follows").

### Frontmatter — exactly two fields

Every skill opens with YAML frontmatter containing **only** `name` and `description`. No other fields.

| Field | Shape | Purpose |
|-------|-------|---------|
| `name` | kebab-case, matches the directory | Identity; the harness invokes the skill by this name |
| `description` | One dense paragraph | What it does, **when to trigger** it, and the **boundary** of when *not* to use it |

The `description` is the skill's only matcher — nothing else decides when it applies — so it carries three things, in this order (see `skills/decomposition/SKILL.md`, `skills/dev/SKILL.md`):

1. **What + when to fire** — the task shapes that should surface it.
2. **Trigger phrases** — literal cues the user or task tends to use ("Trigger phrases: …", "Fire when …").
3. **The NOT-for boundary** — explicit pointer to the neighboring skill that *would* apply instead ("NOT for …", "Do NOT use for: …"). This is what keeps two skills from colliding on the same task.

```yaml
---
name: <kebab-name>
description: Use when <task shape>. Fire when the user wants to <…>. Trigger phrases: "…", "…". NOT for <neighbor skill> — use that. Do NOT use for: <…>; <…>.
---
```

### Body conventions

Drawn from `skills/using-comfanion/SKILL.md`, `skills/decomposition/SKILL.md`, and `skills/dev/SKILL.md`:

- **Imperative, and explain *why*, not just *what*.** Every non-trivial step carries its rationale ("Why first: …", "Why: …"). A reader who understands the reason can adapt; one given only a recipe cannot.
- **Put heavy material in `references/`.** Templates, checklists, and examples live in `skills/<name>/references/` and are loaded on demand ("Load `references/template.md`"), never inlined into the body. Keep `SKILL.md` to the procedure; keep the bulk out of the agent's default context.
- **Describe capabilities, never a harness's tool names.** Write "search the codebase", "spawn a subagent", "read this file" — not the concrete tool a specific harness exposes. This is the rule that keeps one source serving every harness.
  <!-- TODO: confirm with maintainer — README.md and ARCHITECTURE.md reference docs/capability-map.md as the capability→tool-per-harness translation, but that file is not present in the repo. The capability-prose convention above is real (README "Conventions every skill follows"; skill bodies); only the linked map file is missing. -->
- **No persona names, no harness-specific tool mandates.** A skill is role-agnostic — any role may load any skill. Say which viewpoint a skill *serves* in a closing `## Roles` section ("serves the developer role"), but do not hard-wire a persona.
- **Output goes under `{DOCS_ROOT}`** (default `docs/`). Never write absolute or harness-specific paths in a skill; let the project's configured docs root resolve at run time.
- **Close with `## Roles` and `## Related`.** `## Roles` names the viewpoint(s) the skill serves and its input/output handoff; `## Related` cross-links sibling skills and `FLOW.yaml` / `ARCHITECTURE.md`. Both are present across the samples.
- **State rigidity where it applies.** If the skill carries a non-negotiable discipline (an "Iron Law", e.g. `dev`, `systematic-debugging`, `verification-before-completion`, `doc-impact`, `refactoring`), say so explicitly and mean it — rigid skills are followed exactly; flexible skills are principles to adapt.

### Adding the skill

Create `skills/<name>/SKILL.md` (and `references/` only if you have bulk to offload). That is the whole change — see [Multi-harness plugin structure](#multi-harness-plugin-structure) for why no manifest edit is needed.

## How to add an agent role

A role is a **viewpoint** — a mission and a scope of responsibility — not a skill bundle. It lives at `agents/<role>.md`. The model is defined in [ARCHITECTURE.md](ARCHITECTURE.md) ("Two-Layer Model: Roles + Skills"); the shape below is taken from `agents/secretary.md` and `agents/orchestrator.md`.

- **Frontmatter:** `name` + `description`, same two-field shape as a skill. The description says when the role engages and what it conducts.
- **Body sections, in order:** `## When to invoke`, `## Mission`, `## Principles`, `## Capabilities`, `## Workflow`, `## Boundaries`, `## Output`. Match the existing role files.
- **A role never owns a fixed skill set.** It draws from `skills/` as the task needs — any role may load any skill. Do not wire a skill list into a role file.
- **A role does not reference another role's definition.** The one exception is the two **conducting** roles — `secretary` (planning) and `orchestrator` (execution) — which name the authoring roles they dispatch work *to* (analyst → pm → architect → designer; dev → tester → reviewer → devops). Every other role references none.
- **Roles are an optional layer.** The skills work without them; `agents/` can be dropped entirely. Do not make a skill depend on a role being present.

Create `agents/<role>.md`. No manifest edit is required (see below).

## Multi-harness plugin structure

**Single-source principle:** `skills/` and `agents/` are the *one* source of truth. Every harness gets a thin manifest that *points* at them — it never copies or re-declares them. This is why adding a skill or role needs **no manifest edit**: the manifests do not enumerate individual skills or roles; they point at the source directories (via relative symlinks for the subdirectory plugin), so a new file is picked up automatically.

The manifests in the repo (all verified present):

| Path | Harness | Role |
|------|---------|------|
| `.claude-plugin/marketplace.json` | Claude Code | Marketplace listing; `source` points at `./plugins/comfanion` |
| `.claude-plugin/plugin.json` | Claude Code | Root plugin manifest |
| `.codex-plugin/plugin.json` | Codex | Root plugin manifest (must carry a `hooks` field) |
| `plugins/comfanion/.claude-plugin/plugin.json` | Claude Code / Codex | Subdirectory-plugin manifest (Codex requires a subdirectory plugin) |
| `plugins/comfanion/.codex-plugin/plugin.json` | Codex | Subdirectory-plugin manifest |
| `plugins/comfanion/{skills,agents,hooks}` | All | Relative symlinks → `../../skills`, `../../agents`, `../../hooks` (single-source; must stay symlinks, never copies) |
| `gemini-extension.json` + `GEMINI.md` | Gemini CLI | Extension manifest + entry-point context |
| `hooks/` | Claude Code (optional) | The one harness-specific layer — a `SessionStart` hook that surfaces `using-comfanion`. Delete to stay fully neutral. |

When you **do** need to touch the manifests:

- **Cutting a release (version bump):** the version is duplicated across **six** files and must be bumped in all of them — `.claude-plugin/marketplace.json`, `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, `plugins/comfanion/.claude-plugin/plugin.json`, `plugins/comfanion/.codex-plugin/plugin.json`, and `gemini-extension.json`. (Current version: `6.0.0`.) CI does not currently check version sync, so this is manual — keep them aligned.
- **Changing hooks or symlinks:** run `bash scripts/verify-plugin-structure.sh` locally; it asserts the symlinks point at `../../<name>`, the root manifests exist, and the structure is intact.

<!-- TODO: confirm with maintainer — README.md#layout lists an `.opencode/` symlink directory and the Install section describes opencode discovering skills/agents from `.opencode/`, but no `.opencode/` directory is checked into the repo. The opencode path today is: run opencode inside the clone (the single-source `skills/` and `agents/` are discovered directly), or mirror those symlinks into your own project's `.opencode/`. -->

## Opening a pull request

A PR must keep CI green. The `enforce` workflow (`.github/workflows/enforce.yml`) runs on every PR and push to `main`/`master`, and checks four things:

1. **YAML syntax** across the whole repo — every `*.yaml` / `*.yml` must parse.
2. **JSON syntax** across the whole repo — every `*.json` must parse.
3. **Plugin-structure integrity** — `scripts/verify-plugin-structure.sh` (root manifests present; `.codex-plugin/plugin.json` carries a `hooks` field; the subdirectory plugin exists; `plugins/comfanion/{skills,agents,hooks}` are symlinks to `../../<name>` and not real directories; `skills/` > 50 entries, `agents/` > 10; `hooks/`, `FLOW.yaml`, `project-state.yaml`, `protected.yaml` present at root; workflow-control files are *not* under `docs/`).
4. **Protected-path policy sanity** — every entry in `protected.yaml` must have non-empty `id`, `path`, `reason`, and `override`.

Run `bash scripts/verify-plugin-structure.sh` locally before pushing; it is the same check CI runs.

### Commit and version conventions

The repo uses conventional-style commit prefixes with an optional scope (observed in `git log`):

| Prefix | Use for |
|--------|---------|
| `feat(<scope>):` | A new skill, role, or capability |
| `fix(<scope>):` | A correction to an existing skill/role/manifest |
| `refactor(<scope>):` | Restructuring with no behavior change |
| `docs:` | Documentation only |
| `chore:` / `chore(<scope>):` | Tooling, packaging, state-file updates |
| `revert:` | Reverting a prior commit |

Scopes seen include `skills`, `claude-plugin`, `flows`, `enforcement`, `state`, and combined `docs,skills`. Version bumps are their own commit: `chore: bump version X -> Y (major|minor|patch)` (SemVer; the project tracks `MAJOR.MINOR.PATCH` and is currently at `6.0.0`).

<!-- TODO: confirm with maintainer — there is no CHANGELOG.md in the repo, so the SemVer practice above is reconstructed from the manifest versions and `git log` alone. If a changelog is intended, point contributors at it here. -->

## Project structure

See [README.md#layout](README.md) for the directory map and [ARCHITECTURE.md](ARCHITECTURE.md) for the two-layer model and full skill/role catalog. [FLOW.yaml](FLOW.yaml) maps each request class to its phase → role(s) → skill(s) → artifact(s). This document does not restate them.

## License

Contributions come under the project's **MIT** license — see [LICENSE](LICENSE). By contributing, you agree your contributions are licensed under MIT.

## See also

- [ARCHITECTURE.md](ARCHITECTURE.md) — the two-layer model and full catalog
- [FLOW.yaml](FLOW.yaml) — the five flows and shared hard gates
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- [SECURITY.md](SECURITY.md)
