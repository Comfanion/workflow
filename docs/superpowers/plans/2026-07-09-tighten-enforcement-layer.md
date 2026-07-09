---
type: plan
title: Tighten Existing Skills with Enforcement Layer (Variant A)
description: Concrete plan to add external enforcement over existing comfanion skills — closes the gap between prose discipline and blocking gates. Predecessor to HOTL transition (Variant B).
domain: comfanion
status: draft
tags: [plan, enforcement, gates, comfanion, hotl-prerequisite]
updated: 2026-07-09T00:00Z
related:
  - FLOW.yaml
  - ARCHITECTURE.md
  - skills/verification-before-completion/SKILL.md
  - skills/test-execution/SKILL.md
  - skills/dev/SKILL.md
  - skills/code-review/SKILL.md
  - skills/using-comfanion/SKILL.md
  - docs/research/technical/human-on-the-loop-research.md
---

# Plan — Tighten Existing Skills with Enforcement Layer (Variant A)

## Executive Summary

**Goal:** close the gap between comfanion's existing prose-discipline skills and actual blocking gates, without rewriting the skills or building new infrastructure.

**Why:** the toolkit's 57 skills encode the right discipline (TDD, verification-before-completion, code-review dimensions, QA gate). All six user pain points trace to one root cause: skills are *behavioral advice*, not *external enforcement*. An agent that decides to skip — or a user that verbally overrides — meets no resistance.

**Scope:** add 5 enforcement primitives that turn the strongest existing skills into blocking gates. No new skills library, no framework adoption, no platform build.

**Out of scope (Variant B):** HOTL transition (action classifier, audit trail, circuit breakers, durable runtime). Comes after this plan lands and stabilizes.

**Estimated effort:** 7–10 working days, phased. Each phase independently shippable.

---

## Current State (verified by reading skill files)

| Layer | What's there | Strength |
|-------|--------------|----------|
| Skills as prose | 57 skills, rigid ones carry Iron Laws | Excellent content, well-written |
| Pipeline (FLOW.yaml) | 11 phases with `validation.required: true` on key ones | Declarative gates exist |
| Roles | 13 roles, secretary (planning + approval) + orchestrator (execution + quality) | Clean two-layer model |
| Conducting layer | orchestration trio + planning/implementation squads | Design is complete |
| Deploy gate | `hard: true` in FLOW.yaml | Written, but not enforced externally |

**What's missing:** a layer *above* the agent that enforces what the skills already prescribe.

---

## Gap Analysis (per pain point)

| # | Pain | Skill that should prevent it | Concrete gap |
|---|------|------------------------------|--------------|
| G1 | "Have to nag agent to verify" | `verification-before-completion` | No CI/hook that blocks merge without verification output |
| G2 | "Doesn't finish tests" | `test-execution` QA gate | FLOW.yaml `testing` phase has empty `validation` block; no green-tests-required rule |
| G3 | "Code not wired/integrated" | none | No build/integration gate exists between implementation and deploy |
| G4 | "Can break the flow myself" | `using-comfanion` priority rule | User override = highest priority; no protected-paths mechanism |
| G5 | "Agents plan incoherently across sessions" | `orchestration-team` board | Board is per-session; no `project-state.yaml` read on every session start |
| G6 | "Multi-model chaos" (Codex/Claude/GLM/MiniMax) | `orchestration` "least powerful model" | Principle without a routing policy artifact |

---

## Proposed Enforcement Layer — 5 primitives

Each maps to one or more gaps. Each is independently shippable.

### E1 — Persistent project-state file  (closes G5)
**What:** `docs/project-state.yaml` — single source of truth read on every session start.
**Why:** kills the "30-minute re-entry" problem; gives agents shared memory across sessions.
**Schema (initial):**
```yaml
project: <name>
current_phase: research | requirements | prd | architecture | delivery-design | design | decomposition | implementation | testing | review | deploy
phase_started: <ISO date>
prd_ref: <path>
arch_ref: <path>
standards_index: <path>
active_work:
  - id: <epic/story id>
    status: in_progress | review | done | blocked
    blocked_on: <text or null>
open_decisions:
  - id: <decision id>
    status: awaiting_human | resolved
last_updated: <ISO date>
```
**Files touched:** new `docs/project-state.yaml`; small update to `using-comfanion` to read it first; small update to `orchestration-*` skills to update it.
**Effort:** 1 day.
**Exit criterion:** cold-start session reads `project-state.yaml` first; agent can resume work in <5 min instead of 30.

### E2 — Build + integration gate  (closes G3)
**What:** explicit gate in FLOW.yaml between implementation and deploy requiring `make build && make test` green.
**Why:** kills "code not wired" — no code reaches review/deploy without compiling and passing tests as a unit.
**Concrete changes:**
- Add `validation` block to `testing` phase (currently empty) referencing `test-execution` checklist.
- Add explicit `gate` block to `testing` phase: `type: integration, hard: true, description: "Build and integration tests must pass before review"`.
- Update `dev` skill: "sync point" already exists in prose — formalize as the gate the orchestrator checks before transitioning `in_progress → review`.
**Files touched:** `FLOW.yaml` (2 edits); `skills/dev/SKILL.md` (small addition); `skills/test-execution/SKILL.md` (small addition).
**Effort:** 1–2 days.
**Exit criterion:** in a sample story run, broken-integration code cannot move to `review` status; orchestrator returns it with evidence.

### E3 — External enforcement: pre-commit + CI hooks  (closes G1, G4 partially)
**What:** repo-level git hooks and CI checks that block bad commits even if the agent skipped the skill.
**Why:** this is the layer skills cannot enforce themselves. Without it, prose discipline is advisory.
**Concrete artifacts (new):**
- `.githooks/pre-commit` — runs linter + unit tests; blocks commit on failure.
- `.github/workflows/enforce.yml` (or GitLab equivalent) — runs build, full tests, linter on every PR; blocks merge on failure.
- Optional: `.githooks/pre-push` — same but stricter.
- Document in `docs/factory/enforcement.md` how to install (`git config core.hooksPath .githooks`).
**Files touched:** new `.githooks/`, new CI config, new `docs/factory/enforcement.md`. No changes to skills themselves.
**Effort:** 2–3 days.
**Exit criterion:** attempt to commit failing code → blocked by hook; attempt to merge PR with red CI → blocked by branch protection.

### E4 — Protected-path policy for "I can break the flow myself"  (closes G4)
**What:** a YAML file that declares which paths/decisions cannot be overridden verbally; agent must refuse and ask for explicit unlock.
**Why:** currently `using-comfanion` puts user instructions as highest priority — meaning "skip architecture" works. Some gates should be unoverridable (deploy, security review, integration).
**Schema (`docs/factory/protected.yaml`):**
```yaml
protected:
  - path: FLOW.yaml#deploy
    reason: irreversible; explicit human deploy confirmation required
    override: requires commit to docs/factory/unlock-log.md with reason
  - path: skills/review-security
    reason: security findings block by default
    override: requires ADR documenting accepted risk
  - path: FLOW.yaml#architecture → implementation
    reason: skipping architecture produces uncoordinated code
    override: requires explicit `/skip-architecture` command + logged reason
```
**Files touched:** new `docs/factory/protected.yaml`; small update to `using-comfanion` priority rule (priority 0 above user instructions for paths in this file); new `docs/factory/unlock-log.md` template.
**Effort:** 1–2 days.
**Exit criterion:** attempt to verbally skip deploy gate → agent refuses and points at the unlock procedure.

### E5 — Multi-model routing policy  (closes G6)
**What:** explicit artifact that says which model goes in which slot, replacing the prose "least powerful model that can do the task".
**Why:** prose works for a single-model setup; with 4 models (Codex/Claude/GLM/MiniMax) it produces inconsistent choices.
**Schema (`docs/factory/model-routing.yaml`):**
```yaml
slots:
  research_deep:        { primary: claude-opus,   fallback: glm }
  research_bulk:        { primary: glm,           fallback: minimax }
  architecture_options: { primary: claude-opus,   parallel: [codex, glm] }   # divergent
  code_generation:      { primary: codex,         fallback: claude-sonnet }
  code_review:          { primary: claude-sonnet }
  security_review:      { primary: claude-opus }
  translation:          { primary: glm }
  media_generation:     { primary: minimax }
overrides:
  - if_cost_below_usd: 0.50
    then_prefer: glm
```
**Files touched:** new `docs/factory/model-routing.yaml`; small update to `orchestration` skill to reference it; `using-comfanion` routing table gets a row for model selection.
**Effort:** 1 day.
**Exit criterion:** orchestrator's dispatch decisions match the routing policy; documented deviation requires a logged reason.

---

## Phasing & Order

Dependency-driven. Each phase's exit enables the next.

| Phase | Items | Days | Why this order |
|-------|-------|------|----------------|
| **P1** | E1 (project-state) | 1 | Foundation — every later phase reads/writes state through it |
| **P2** | E2 (build/integration gate) | 1–2 | Closes the most painful gap (broken integration); no external infra needed |
| **P3** | E3 (CI/hooks enforcement) | 2–3 | Now there are gates to enforce; enforcement lands on real gates |
| **P4** | E4 (protected-path policy) | 1–2 | Requires P3 to be meaningful (otherwise just more prose) |
| **P5** | E5 (model routing) | 1 | Independent of others; can land anytime after P1 |

**Total: 7–10 days.** Can be compressed (parallel P3 + P5) or stretched (more validation per phase).

---

## Per-Pain-Point Closure Map

| Pain | Closed by | Phase |
|------|-----------|-------|
| "Have to nag agent to verify" | E3 (CI/hooks) | P3 |
| "Doesn't finish tests" | E2 + E3 | P2 + P3 |
| "Code not wired" | E2 | P2 |
| "Can break flow myself" | E4 (protected paths) | P4 |
| "Incoherent cross-session planning" | E1 (state file) | P1 |
| "Multi-model chaos" | E5 (routing policy) | P5 |

---

## Bridge to Variant B (HOTL transition)

This plan deliberately stops short of HOTL. After P1–P5 land and stabilize for ~2 weeks of real use, the bridge to HOTL becomes:

- E1's `project-state.yaml` becomes the substrate for the async audit trail.
- E3's CI logs become the input to circuit breakers (rejection-rate detection).
- E4's protected.yaml becomes the policy decision point for the action classifier (AUTO/LOG/REQUIRE_APPROVAL).
- E5's routing policy becomes the worker-selector in a deterministic orchestrator.

I.e. — Variant A is **not throwaway work**. It's the foundation Variant B builds on.

---

## Explicit Non-Goals

- No new agent framework adoption (no LangGraph / Temporal / Inngest in this plan).
- No changes to existing skill content beyond small cross-references.
- No multi-project rollout — validate on one real pet-project first (recommendation: dora-monorepo, since it has the richest existing structure to gate against).
- No new skills added to the library (E1–E5 are *artifacts + small skill updates*, not new skills).
- No enforcement of optional phases (research, delivery-design) — only mandatory gates get protection.

---

## Risks

| Risk | Mitigation |
|------|-----------|
| E3 hooks slow down dev loop | Make pre-commit fast (lint + affected tests only); full suite in CI |
| E4 protected paths frustrate legit fast iteration | Override path exists; logged, not forbidden |
| E1 state file drifts from reality | Update on every status transition in skills; weekly cron verifies file matches actual repo state |
| E5 routing policy becomes stale | Add `last_reviewed` date; quarterly review checklist |

---

## Open Questions (need user input before P1 starts)

1. **Target project for first rollout:** dora-monorepo, or a smaller pet-project to validate faster?
2. **CI provider:** GitHub Actions, GitLab CI, or both (since dora uses submodules)?
3. **Hook installation:** repo-level `.githooks/` (per-clone opt-in) or `.husky/`-style enforced install?
4. **E4 aggressiveness:** strict (refuse verbal override, force unlock-log entry) or soft (warn + allow with logged reason)?
