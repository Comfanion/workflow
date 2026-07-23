<!-- Thanks for contributing! Fill the checklist, delete anything irrelevant. -->

## What

<!-- One-line summary of what this PR adds/changes. -->

## Why

<!-- The problem this solves. Link an issue if there is one: Closes #N. -->

## Type

- [ ] New skill
- [ ] New agent role
- [ ] Improvement to existing skill / role
- [ ] Flow / FLOW.yaml change
- [ ] Multi-harness packaging (manifest / symlink / extension)
- [ ] Documentation
- [ ] Other

## Checklist — all must be ticked before requesting review

- [ ] CI `enforce` workflow is green on this branch
- [ ] If a **new skill** was added: `skills/<name>/SKILL.md` with frontmatter `name` + `description` (description carries trigger phrases + the NOT-for boundary)
- [ ] If a **new agent role** was added: `agents/<role>.md` is a viewpoint (mission + scope), references no other role, owns no fixed skill set
- [ ] If packaging changed: the **single source** is still `skills/` + `agents/`; the harness manifests (`plugins/comfanion/`, `.claude-plugin/`, `.codex-plugin/`, `gemini-extension.json`) only point at it — run `bash scripts/verify-plugin-structure.sh` locally
- [ ] No harness-specific tool names inside skill bodies (capability prose only)
- [ ] README catalog / ARCHITECTURE.md updated if the skill/role surface changed
- [ ] `CHANGELOG.md` `[Unreleased]` updated for user-visible changes
- [ ] For a non-trivial change, an ADR under `docs/architecture/adr/` records the decision (see `skills/adr-writing`)

## Out of scope / follow-ups

<!-- Note anything intentionally left for a later PR. -->
