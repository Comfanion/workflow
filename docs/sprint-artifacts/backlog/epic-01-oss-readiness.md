---
type: epic
title: "Epic 1: Public Release Readiness"
description: Bring the comfanion/workflow repo to a public-OSS standard — license, contributor onboarding, community conduct, security policy, changelog, and GitHub repo grooming.
domain: oss-readiness
status: in_progress
tags: [oss, licensing, community, documentation]
id: OSS-E1
priority: P0
size: M
sprint: sprint-01-oss-readiness
timestamp: 2026-07-23T00:00:00Z
related: [README.md, ARCHITECTURE.md, project-state.yaml]
---

# Epic 1: Public Release Readiness

## Overview

This epic delivers **a legally publishable, contributor-ready open-source repository** for the comfanion/workflow toolkit. When complete, external users can legally use the skills under MIT, external contributors can add skills/roles following documented conventions, and the repo surface (GitHub UI, README, issue/PR flow) signals a maintained community project.

**Business Value:** Unblocks public adoption and external contribution — the toolkit is technically mature (62 skills, 13 roles, multi-harness) but currently has no license (legally "all rights reserved") and no contributor on-ramp.

**Scope:**
- MIT `LICENSE` + README license section
- `CONTRIBUTING.md` documenting skill/role authoring conventions
- `CODE_OF_CONDUCT.md` (Contributor Covenant v2.1)
- `SECURITY.md` vulnerability reporting policy
- `.gitattributes` (LF normalization)
- Issue/PR templates, CODEOWNERS, SUPPORT.md
- `CHANGELOG.md` (Keep a Changelog, retrospective)
- README badges (CI, license, version)

**Not Included:**
- GitHub repo settings (description, topics, branch protection) — manual, tracked as follow-up outside this epic
- FUNDING.yml — deferred until sponsor decision
- CLA/DCO automation — not required for MIT + Contributor Covenant flow
- CITATION.cff — academic citation, not needed yet

---

## Units Affected

This is a documentation/governance epic; no code units are touched. Affected surfaces:

| Surface | Changes | Impact |
|---------|---------|--------|
| Repo root | New: LICENSE, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, CHANGELOG, SUPPORT, .gitattributes | Legal + community baseline |
| `.github/` | New: ISSUE_TEMPLATE/, PULL_REQUEST_TEMPLATE.md, CODEOWNERS | Contributor experience |
| `README.md` | Amend: License section, badges | Public-facing metadata |

---

## Dependencies

| Type | Item | Why |
|------|------|-----|
| **Requires** | none | Greenfield governance work |
| **Enables** | Public announcement / promotion | Can't publish legally without LICENSE |
| **Enables** | External contributions | Can't accept PRs sanely without CONTRIBUTING + CoC |

---

## PRD Coverage

No formal PRD — `ARCHITECTURE.md` + `README.md` serve as the project contract (per `project-state.yaml#prd_ref: null`). This epic implements the implicit "make the repo public-ready" requirement.

---

## Acceptance Criteria

Epic is complete when:
- [ ] `LICENSE` exists at repo root (MIT, full canonical text)
- [ ] README has a License section + license badge
- [ ] `CONTRIBUTING.md` documents: skill frontmatter, `references/`, harness-neutral capability-prose, plugin structure checks, PR requirements
- [ ] `CODE_OF_CONDUCT.md` present (Contributor Covenant v2.1, canonical text)
- [ ] `SECURITY.md` defines reporting channel + scope + SLA
- [ ] `.gitattributes` enforces LF on text, binary on assets
- [ ] Issue templates (bug, feature) + config.yml present
- [ ] `PULL_REQUEST_TEMPLATE.md` present
- [ ] `CODEOWNERS` present
- [ ] `SUPPORT.md` present
- [ ] `CHANGELOG.md` present (Keep a Changelog format, retrospective entries)
- [ ] README badges render (CI, license, version)
- [ ] CI `enforce.yml` stays green (no YAML/JSON/plugin-structure regressions)

---

## Stories

| ID | Title | Size | File | Status |
|----|-------|------|------|--------|
| OSS-S01 | License the repo under MIT | XS | `story-01-license.md` | ⬜ |
| OSS-S02 | Author CONTRIBUTING.md | M | `story-02-contributing.md` | ⬜ |
| OSS-S03 | Community conduct + security + line-endings baseline | S | `story-03-conduct-security-attributes.md` | ⬜ |
| OSS-S04 | Contributor experience templates | S | `story-04-contributor-templates.md` | ⬜ |
| OSS-S05 | CHANGELOG + README badges | M | `story-05-changelog-badges.md` | ⬜ |

**Dependency Flow (DAG):**
```
S01 (LICENSE) ──► S02 (CONTRIBUTING — references license)
              │
              ├──► S03 (CoC/SECURITY/.gitattributes — independent)
              │
              └──► S05 (CHANGELOG/badges — references license badge)

S02 (CONTRIBUTING) ──► S04 (templates reference contributing conventions)
```

S03 and S05 have no edge between them — genuinely independent, can run in parallel with S02.

---

## Technical Decisions

| Decision | Rationale |
|----------|-----------|
| MIT license | Maximally permissive, lowest adoption friction for a skills/content toolkit; patent protection (Apache-2.0) is irrelevant for markdown procedures |
| Contributor Covenant v2.1 | De-facto OSS standard; canonical text, not authored from scratch |
| No CLA/DCO | MIT + Covenant keeps contribution friction minimal; revisit if corporate contributions arrive |
| Keep a Changelog format | Aligns with existing SemVer (v6.0.0) practice already in the repo |
| Direct authoring for boilerplate, subagent fan-out for CONTRIBUTING + CHANGELOG | Per `orchestration` "Conduct vs act directly" — canonical texts are trivial; the two analytic artifacts get isolated subagent contexts |

---

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| CONTRIBUTING drifts from actual skill conventions | M | Subagent reads actual `skills/*/SKILL.md` samples + `ARCHITECTURE.md` before authoring |
| CHANGELOG retrospective misses pre-tag history | L | Subagent walks full `git log`, not just tags |
| License change after external contributions | M | Decide MIT now while solo; document in CONTRIBUTING that contributions come under same license |

---

## References

→ README: `README.md`
→ Architecture: `ARCHITECTURE.md`
→ Project state: `project-state.yaml`
