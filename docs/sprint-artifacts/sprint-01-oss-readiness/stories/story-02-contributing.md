---
type: story
title: "Story 1.2: Author CONTRIBUTING.md"
description: Document how to add skills, roles, and plugin manifests so external contributors can submit PRs that match the toolkit's conventions without guessing.
domain: oss-readiness
status: draft
tags: [contributing, documentation, p1]
id: OSS-S02
epic: OSS-E1
size: M
timestamp: 2026-07-23T00:00:00Z
related: [epic-01-oss-readiness.md, story-01-license.md]
---

# Story 1.2: Author CONTRIBUTING.md

## Goal

External contributors can read a single `CONTRIBUTING.md` and produce a PR that adds a skill or role conforming to the toolkit's conventions — frontmatter shape, `references/` usage, harness-neutral capability-prose, plugin structure, and CI requirements — without a maintainer having to re-explain the rules.

**Context:** Part of Epic 1. This is the only story requiring analytic authoring (vs boilerplate); it is dispatched to a subagent with an isolated context constructed from the actual skill/agent/plugin samples in the repo.

**Out of Scope:**
- Code of Conduct (Story 1.3)
- Issue/PR template mechanics (Story 1.4) — CONTRIBUTING references them but does not define their structure

---

## Acceptance Criteria

Story is complete when:
- [ ] `CONTRIBUTING.md` exists at repo root
- [ ] Documents skill authoring: frontmatter (`name` + `description` with trigger phrases), body conventions (imperative, explains why, heavy material in `references/`), harness-neutral capability-prose rule
- [ ] Documents role authoring: `agents/*.md` is a viewpoint with mission+scope, never references another role, never owns a fixed skill set
- [ ] Documents plugin structure: how `plugins/comfanion/`, `.claude-plugin/`, `.codex-plugin/`, `.opencode/` symlinks, `gemini-extension.json` relate to the single `skills/`+`agents/` source
- [ ] Documents PR requirements: CI `enforce.yml` must be green (YAML/JSON valid, plugin structure check passes, protected.yaml sanity), SemVer bump per scope, commit message style observed in repo
- [ ] States that contributions come under the project's MIT license (links to LICENSE)
- [ ] Points at `ARCHITECTURE.md` and `FLOW.yaml` for the big picture rather than restating them
- [ ] CI stays green

---

## Tasks

| # | Task | Output | Status |
|---|------|--------|--------|
| T1 | Subagent analyzes skill/agent/plugin samples + authors CONTRIBUTING.md | `CONTRIBUTING.md` | ⬜ |

### T1: Subagent authors CONTRIBUTING.md

**Goal:** A contributor-onboarding doc grounded in the repo's actual conventions, not invented rules.

**Dispatch model:** general-purpose subagent (the work is analytic authoring, not multi-step judgment).

**Read First (subagent is handed these explicitly):**
- `ARCHITECTURE.md` — the two-layer model, full skill/role catalog
- `README.md` — conventions summary, layout section
- 2-3 sample `skills/*/SKILL.md` files (e.g. `using-comfanion`, `decomposition`, `dev`) — to extract the real frontmatter shape and body conventions
- 1-2 sample `agents/*.md` files — to extract the role viewpoint pattern
- `plugins/comfanion/` + `.claude-plugin/` + `.codex-plugin/` + `.opencode/` + `gemini-extension.json` — the multi-harness packaging
- `.github/workflows/enforce.yml` + `scripts/verify-plugin-structure.sh` — what CI checks
- `project-state.yaml` — SemVer versioning practice

**Output Files:**
- `CONTRIBUTING.md` (root)

**Approach:**
1. Read the listed samples; extract the conventions actually in use
2. Author CONTRIBUTING.md with sections: How to add a skill / How to add a role / Multi-harness plugin structure / Before you open a PR / License
3. Do NOT invent rules not present in the samples — if something is unclear, leave a TODO marker rather than guessing

**Done when:**
- [ ] Every convention stated traces to an actual file in the repo
- [ ] A new contributor could add a skill by following only this doc + the linked ARCHITECTURE.md
- [ ] CI green

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] CONTRIBUTING grounded in real samples (no invented rules)
- [ ] CI `enforce.yml` green
- [ ] References LICENSE, ARCHITECTURE.md, FLOW.yaml by link
