# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- FLOW.yaml v5 with 5 entry flows and 6 maintenance/adoption skills.

### Fixed

- Removed invalid `skills`/`agents` fields from `.claude-plugin` manifests.

<!-- skipped: 5bc5221 — project-state status note, no user-visible change -->

## [6.0.0] — 2026-07-10

### Added

- Gemini CLI extension (harness) support.
- Persistent `project-state` primitive for using-comfanion and orchestration.
- Hard integration gate in the dev / test-execution flow before review.
- External hooks/CI enforcement (P3) and protected-path policy (P4).
- OKF v0.1 full conformance, with unit-writing as the spec layer.

### Changed

- Rewrote skill bodies across all families for invocation-rate (architectural, implementation, review-area, intake/research/design, orchestration, and high-frequency skills).
- Renamed "harness-neutral" to "multi-harness" throughout the toolkit.
- Rewrote the README skills-first, treating agents as an optional layer.
- Added OKF-style frontmatter to all artifact templates and canonicalized the template timestamp field.
- Backported generic standards/architecture improvements from shared-skills and made standards section-addressable.
- Repointed plugin manifests at the comfanion/workflow org repo.
- Corrected per-harness install commands in the README.
- Moved `project-state` to the repo root.
- Added the HOTL research and enforcement-layer plan.

### Removed

- Removed the translation skill and stripped Cyrillic (ru/ukr) from skill bodies.
- Removed unused/outdated scaffolding (`.opencode`, capability-map, kanban design).

### Fixed

- Packaged comfanion as a subdirectory plugin so Codex loads it.
- Added a hooks manifest and cross-harness variable detection to the Codex plugin.

<!-- skipped: 3f9112a reverts the English-only rule added in 9ccc579 — they cancel within this release (net no-op); only the invocation-rate rewrite from 9ccc579 is retained above -->
<!-- skipped: d21f146 — session-internal doc cleanup, no user-visible change -->

## [5.3.0] — 2026-06-15

### Added

- Split coding-standards into a standards group with a using-standards consumer skill.
- Added planning-squad and implementation-squad skills.

### Fixed

- Scoped the one-session rule to helpers; execution stories now belong on the board.
- Addressed the 2026-06-10 skill-accuracy lessons (hot-path, Hermes loading, routing).

<!-- skipped: 28d3b4e — merge commit; merged content is captured above -->

## [5.1.0] — 2026-06-10

### Added

- Orchestration skill family (subagent + team).
- Secretary and orchestrator agents (intake/planning and execution conductors), with the orchestration roles and kanban-flow model.
- Split review into dimension skills and added security lenses.
- Craft-discipline skills with skill-invocation enforcement.
- Brainstorm skill (ideation facilitator).
- Delivery-design phase giving devops an early pipeline slot.
- Expanded team and pipeline: design, QA, and delivery roles & skills.
- Hermes skill-to-profile matrix.
- Multi-harness packaging.
- README documenting the model, pipeline, architecture altitude ladder, and usage.

### Changed

- Split architecture into system vs service altitude.
- Reframed agents as roles (not skill-owners), dropping skill lists and cross-agent references.
- Synced architecture roles 11 to 13 and the skill catalog.
- Standardized the PRD path to `prds/<slug>/PRD.md` in FLOW; dropped the jira-sync-report orphan.
- Repointed manifest URLs at StepanchukYI/comfanion.
- Updated README counts (29 skills / 12 roles), pipeline phases, and dev split.
- Pointed setup-team.sh at skill-matrix.md.

### Removed

- Removed the marginal change-manager role (its doc-hygiene work is covered by changelog/archiving/doc-todo skills any role uses).

### Fixed

- Decomposition/orchestration dependency-graph, review fan-out, and skill validation.

## [5.0.0] — 2026-06-10

### Added

- Initial flat agentic-dev toolkit: 19 skills and 7 agents.

<!--
Scope note: this changelog covers the comfanion/workflow project line, rooted at
3a1e3a0 (2026-06-10). The v4.38.2 / v4.38.3 tags and the "OpenCode Workflow" history
(rooted at 22b1f3e) live on a separate branch that is not an ancestor of HEAD and
belong to a precursor project; they are intentionally excluded.
-->
