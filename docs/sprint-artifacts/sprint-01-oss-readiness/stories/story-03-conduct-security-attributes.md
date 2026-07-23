---
type: story
title: "Story 1.3: Community conduct, security policy, line-endings baseline"
description: Add Contributor Covenant v2.1 Code of Conduct, a SECURITY.md vulnerability reporting policy, and .gitattributes for cross-platform line-ending consistency.
domain: oss-readiness
status: done
tags: [conduct, security, git, p1]
id: OSS-S03
epic: OSS-E1
size: S
timestamp: 2026-07-23T00:00:00Z
related: [epic-01-oss-readiness.md, story-01-license.md]
---

# Story 1.3: Community conduct, security policy, line-endings baseline

## Goal

The repo carries the standard community-conduct and security-reporting governance artifacts, plus a line-endings baseline, so the project meets the baseline expectations of a public OSS repository and contributors on different OSes don't introduce whitespace noise.

**Context:** Part of Epic 1. All three files are canonical/standard content — direct authoring, no subagent needed (per `orchestration` "Conduct vs act directly").

**Out of Scope:**
- Issue/PR template content (Story 1.4)
- Detailed security review process for skills (out of OSS-readiness scope)

---

## Acceptance Criteria

Story is complete when:
- [x] `CODE_OF_CONDUCT.md` exists with the canonical Contributor Covenant v2.1 text (en, the standard version)
- [x] CoC enforcement contact points to a real channel (GitHub issue / email — confirm with user)
- [x] `SECURITY.md` exists and defines: scope (this is a markdown/content toolkit — scope is narrow: malicious skill content, not runtime vulnerabilities), reporting channel, response SLA, what NOT to do (no public issue for security reports)
- [x] `.gitattributes` exists with `* text=auto eol=lf`, binary handling for `*.png`, and linguist-detection overrides if needed
- [x] No other files touched
- [x] CI stays green

---

## Tasks

| # | Task | Output | Status |
|---|------|--------|--------|
| T1 | Write CODE_OF_CONDUCT.md (Contributor Covenant v2.1) | `CODE_OF_CONDUCT.md` | ✅ |
| T2 | Write SECURITY.md | `SECURITY.md` | ✅ |
| T3 | Write .gitattributes | `.gitattributes` | ✅ |

### T1: CODE_OF_CONDUCT.md

**Goal:** Canonical community conduct text.

**Output:** `CODE_OF_CONDUCT.md`

**Approach:**
1. Use Contributor Covenant v2.1 canonical text from https://www.contributor-covenant.org/version/2/1/code_of_conduct/code_of_conduct.md
2. Replace enforcement contact placeholder with a real channel (default: link to SECURITY.md reporting + GitHub issues for non-sensitive conduct reports — confirm with user if email preferred)

**Done when:**
- [x] Text matches Covenant v2.1
- [x] Enforcement section has a concrete contact

### T2: SECURITY.md

**Goal:** Clear vulnerability reporting path.

**Output:** `SECURITY.md`

**Approach:**
1. State the scope honestly: this is a markdown skills library, not a runtime service — security concerns are limited to malicious skill content (prompt injection vectors, exfiltration patterns) and repo supply chain (compromised symlinks in plugin packaging)
2. Reporting: prefer private GitHub Security Advisory (a `Report a vulnerability` button appears on GitHub once SECURITY.md exists) — DO NOT open a public issue
3. SLA: acknowledge within 72h, assessment within 7 days
4. Supported versions: latest major

**Done when:**
- [x] Scope section is honest about what is and isn't a security issue here
- [x] Reporting channel uses GitHub's private advisory flow

### T3: .gitattributes

**Goal:** No line-ending churn across contributors.

**Output:** `.gitattributes`

**Approach:**
1. `* text=auto eol=lf`
2. `*.png binary`, `*.jpg binary`, `*.svg` (treat as text — it's XML)
3. Mark `.DS_Store` as ignored-ish via export-ignore

**Done when:**
- [x] File present, no syntax errors

---

## Definition of Done

- [x] All acceptance criteria met
- [x] All three files present and valid
- [x] CI `enforce.yml` green
