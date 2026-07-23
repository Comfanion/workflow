---
type: story
title: "Story 1.5: CHANGELOG + README badges"
description: Establish a Keep a Changelog CHANGELOG.md with a retrospective of the existing git history, and add status badges (CI, license, version) to README so the project surface signals maturity.
domain: oss-readiness
status: done
tags: [changelog, badges, readme, p3]
id: OSS-S05
epic: OSS-E1
size: M
timestamp: 2026-07-23T00:00:00Z
related: [epic-01-oss-readiness.md, story-01-license.md]
---

# Story 1.5: CHANGELOG + README badges

## Goal

The repo has a forward-maintained `CHANGELOG.md` seeded with a retrospective of releases so far, and README carries status badges (CI, license, version) so visitors immediately see the project's health and license.

**Context:** Part of Epic 1. The CHANGELOG is analytic work (full git-log walk) and dispatched to a subagent; the badges are trivial direct edits.

**Out of Scope:**
- Automated release-tooling integration (semantic-release etc.) — forward-maintained manually for now, aligns with existing manual SemVer practice
- Badge for coverage / code quality — no test suite to measure yet

---

## Acceptance Criteria

Story is complete when:
- [x] `CHANGELOG.md` exists at repo root
- [x] Format follows Keep a Changelog (https://keepachangelog.com/) — `## [version] — YYYY-MM-DD` with Added/Changed/Deprecated/Removed/Fixed/Security sections
- [x] Retrospective covers the version history visible in `git log` (down to v6.0.0 and earlier if tagged), grouped by release
- [x] An `## [Unreleased]` section is present for in-flight work
- [x] README has badges: CI status (enforce workflow), license (MIT), version (latest tag or static)
- [x] Badge URLs render (valid shield.io URLs)
- [x] CI stays green

---

## Tasks

| # | Task | Output | Status |
|---|------|--------|--------|
| T1 | Subagent builds retrospective CHANGELOG from git log | `CHANGELOG.md` | ✅ |
| T2 | Add badges to README top | `README.md` | ✅ |

### T1: Subagent builds CHANGELOG

**Goal:** A retrospective changelog grounded in actual commit history, not invented entries.

**Dispatch model:** general-purpose subagent.

**Read First (subagent is handed these):**
- `git log --oneline` (full history) and `git log --oneline --tags` for tagged releases
- `git tag` for the version map
- Existing commit message style (the repo uses conventional-style prefixes: `feat(...)`, `fix(...)`, `chore(...)`, `docs:`)

**Output Files:**
- `CHANGELOG.md` (root)

**Approach:**
1. Walk the full git log; identify version boundaries (tags, `chore: bump version` commits)
2. Group commits under each release using the Added/Changed/Removed/Fixed/Deprecated/Security buckets
3. Lead with an `## [Unreleased]` section (empty placeholders, to be filled forward)
4. Do NOT invent entries — if a commit's intent is unclear, summarize it neutrally or skip with a note

**Done when:**
- [x] Every entry traces to a real commit
- [x] Format is Keep a Changelog compliant
- [x] Latest release at top, Unreleased above it

### T2: README badges

**Goal:** Project surface signals health + license at a glance.

**Read First:**
- `README.md` (existing top — find the right place, typically just under the H1)

**Output:** `README.md`

**Approach:**
1. Add shield.io badges: CI (workflow `enforce`), license (MIT), version (GitHub tag — `v6.0.0`)
2. Keep the badge row minimal — three badges max

**Done when:**
- [x] Badge URLs valid
- [x] Row renders inline correctly

---

## Definition of Done

- [x] All acceptance criteria met
- [x] CHANGELOG entries trace to real commits
- [x] Badge URLs valid
- [x] CI `enforce.yml` green
