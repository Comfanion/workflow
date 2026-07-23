---
type: story
title: "Story 1.1: License the repo under MIT"
description: Add MIT LICENSE at repo root and a License section + badge in README so the repo is legally usable and GitHub detects the license.
domain: oss-readiness
status: draft
tags: [license, mit, p0]
id: OSS-S01
epic: OSS-E1
size: XS
timestamp: 2026-07-23T00:00:00Z
related: [epic-01-oss-readiness.md]
---

# Story 1.1: License the repo under MIT

## Goal

The repository carries a valid MIT `LICENSE` file at the root and a License section in README, so external users have clear legal permission to use, copy, modify, and distribute the toolkit, and GitHub's license detector classifies the repo correctly.

**Context:** This story is part of Epic 1 (Public Release Readiness). It is the legal foundation — every downstream story and any external use depends on it.

**Out of Scope:**
- README badges beyond license (those are Story 1.5)
- GitHub repo-side license selector (manual, follow-up)

---

## Acceptance Criteria

Story is complete when:
- [ ] `LICENSE` file exists at repo root
- [ ] LICENSE contains the canonical MIT text with copyright line `2026 Comfanion / Evgeniy Stepanchuk`
- [ ] README has a `## License` section near the end
- [ ] README License section names MIT, links to `LICENSE`, and includes a license badge
- [ ] No other files modified
- [ ] CI `enforce.yml` stays green

---

## Tasks

| # | Task | Output | Status |
|---|------|--------|--------|
| T1 | Write canonical MIT LICENSE | `LICENSE` | ⬜ |
| T2 | Amend README with License section + badge | `README.md` | ⬜ |

### T1: Write LICENSE

**Goal:** Legally valid MIT license file.

**Output Files:**
- `LICENSE` (root)

**Approach:**
1. Write the canonical MIT text (https://opensource.org/licenses/MIT)
2. Copyright line: `Copyright (c) 2026 Comfanion / Evgeniy Stepanchuk`
3. No modifications to the license body text

**Done when:**
- [ ] File matches canonical MIT exactly except the copyright year/holder

### T2: Amend README

**Goal:** Surface the license in README.

**Read First:**
- `README.md` (existing structure — find the right insertion point near the end, before any existing closing section)

**Output Files:**
- `README.md`

**Approach:**
1. Append `## License` section with one-line summary + link to `LICENSE`
2. Add shield.io license badge (MIT)

**Done when:**
- [ ] Section renders correctly in GitHub markdown preview
- [ ] Badge URL is valid

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] All tasks completed
- [ ] CI `enforce.yml` green
- [ ] No unrelated files touched
