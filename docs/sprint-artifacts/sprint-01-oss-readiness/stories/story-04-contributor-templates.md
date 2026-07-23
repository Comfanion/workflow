---
type: story
title: "Story 1.4: Contributor experience templates"
description: Add GitHub issue templates (bug/feature), the issue-template config, a pull request template, CODEOWNERS, and SUPPORT.md so the contributor flow is structured end-to-end.
domain: oss-readiness
status: done
tags: [github, templates, codeowners, support, p2]
id: OSS-S04
epic: OSS-E1
size: S
timestamp: 2026-07-23T00:00:00Z
related: [epic-01-oss-readiness.md, story-02-contributing.md]
---

# Story 1.4: Contributor experience templates

## Goal

The GitHub contributor flow is structured: bug reports and feature requests arrive via typed forms, PRs carry a checklist aligned with the repo's CI/convictions, code review routing is defined, and users know where to ask for help.

**Context:** Part of Epic 1. Depends on Story 1.2 (CONTRIBUTING) because the PR template references the conventions documented there.

**Out of Scope:**
- GitHub Discussions enablement (manual repo setting, follow-up)
- GitHub Projects board setup (out of scope)

---

## Acceptance Criteria

Story is complete when:
- [x] `.github/ISSUE_TEMPLATE/bug_report.yml` exists (GitHub Issue Forms YAML — typed form, not freeform markdown)
- [x] `.github/ISSUE_TEMPLATE/feature_request.yml` exists
- [x] `.github/ISSUE_TEMPLATE/config.yml` exists (`blank_issues_enabled: true`, links to Discussions once enabled / CONTRIBUTING)
- [x] `.github/PULL_REQUEST_TEMPLATE.md` exists with checklist: CI green, plugin structure verified, harness manifests updated if a skill/role was added, README/catalog updated if needed, CHANGELOG updated for user-visible changes
- [x] `.github/CODEOWNERS` exists (single owner for now — the user — on root, with note to expand as maintainers join)
- [x] `SUPPORT.md` exists and routes: bugs → issues with bug template, feature ideas → issues with feature template, questions → GitHub Discussions (or issues if Discussions disabled), security → SECURITY.md
- [x] All YAML files valid (CI YAML check must pass)
- [x] CI stays green

---

## Tasks

| # | Task | Output | Status |
|---|------|--------|--------|
| T1 | Write bug_report.yml issue form | `.github/ISSUE_TEMPLATE/bug_report.yml` | ✅ |
| T2 | Write feature_request.yml issue form | `.github/ISSUE_TEMPLATE/feature_request.yml` | ✅ |
| T3 | Write config.yml | `.github/ISSUE_TEMPLATE/config.yml` | ✅ |
| T4 | Write PULL_REQUEST_TEMPLATE.md | `.github/PULL_REQUEST_TEMPLATE.md` | ✅ |
| T5 | Write CODEOWNERS | `.github/CODEOWNERS` | ✅ |
| T6 | Write SUPPORT.md | `SUPPORT.md` | ✅ |

### T1–T3: Issue forms + config

**Goal:** Structured intake.

**Approach:**
1. Use GitHub Issue Forms schema (YAML with `name:`, `description:`, `labels:`, `body:` array of `type: markdown|textarea|input|dropdown|checkboxes`)
2. bug_report: skill/role affected, harness, steps to reproduce, expected vs actual, skill version (git ref)
3. feature_request: problem, proposed solution, alternatives considered, which area (skill/role/flow/docs)
4. config.yml: `blank_issues_enabled: true`, `contact_links` to CONTRIBUTING and (once enabled) Discussions

**Done when:**
- [x] Forms render in GitHub UI (validated against Issue Forms schema)
- [x] YAML passes CI lint

### T4: PR template

**Goal:** Reviewer's checklist baked into every PR.

**Approach:**
1. Checklist items mirror the CI `enforce.yml` gates + toolkit convictions (plugin structure, README/catalog sync, CHANGELOG for user-visible)
2. Reference CONTRIBUTING.md for the why

**Done when:**
- [x] Template renders on PR creation

### T5: CODEOWNERS

**Goal:** Defined review routing.

**Output:** `.github/CODEOWNERS`

**Approach:**
1. Single line: `* @StepanchukYI` (or the user's GitHub handle) owning everything
2. Comment noting this expands as maintainers join

**Done when:**
- [x] Valid CODEOWNERS syntax

### T6: SUPPORT.md

**Goal:** Clear routing for help requests.

**Approach:**
1. Table: issue type → where to go (bugs/issues/Discussions/security)
2. Link to CONTRIBUTING.md and ARCHITECTURE.md for self-service

---

## Definition of Done

- [x] All acceptance criteria met
- [x] All six files present and valid
- [x] CI `enforce.yml` green (especially the YAML validation step)
