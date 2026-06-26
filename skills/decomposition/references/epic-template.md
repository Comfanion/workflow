---
type: epic                                    # controlled vocab — primary filter for agents
title: "Epic {{N}}: {{title}}"
description: {{one line — the capability this epic delivers}}
domain: {{domain/module this epic belongs to}}   # dedup axis: find existing epics in this domain
status: backlog                               # backlog | in_progress | review | done
tags: [{{tag}}, {{tag}}]                       # free-form filter labels
id: {{PREFIX}}-E{{N}}
priority: P0                                  # P0 | P1
size: M                                       # S | M | L | XL | XXL (T-shirt)
estimate: {{points}}                          # Optional: ENTERPRISE only (sum of story points)
sprint: {{sprint}}
updated: {{YYYY-MM-DDThh:mmZ}}                 # OKF timestamp — last meaningful change
related: [docs/prd.md]                         # cross-links; prevents orphan duplicates
---

# Epic {{N}}: {{title}}

<!-- Size guide:
  S (TOY): 3-8 stories
  M (SMALL): 5-12 stories
  L (MEDIUM): 8-15 stories
  XL (LARGE): 10-20 stories
  XXL (ENTERPRISE): 15-30 stories
-->

---

## Overview

This epic delivers **{{user_visible_outcome}}** for {{target_users}}. When complete, users will be able to {{what_they_can_do}}.

**Business Value:** {{why_this_matters}}

**Scope:**
- {{included_1}}
- {{included_2}}

**Not Included:**
- {{excluded}}

<!-- e.g.
This epic delivers **complete task management** for team members. When complete, users will be able to create, assign, and track tasks through their lifecycle.

**Business Value:** Core functionality needed for MVP launch

**Scope:**
- Task CRUD operations
- Assignment to team members
- Status workflow (todo → in_progress → done)

**Not Included:**
- Recurring tasks (Growth feature)
- Task templates
-->

---

## Units Affected

| Unit | Changes | Impact |
|------|---------|--------|
| → Unit: `{{unit}}` | Create | New entity |
| → Unit: `{{unit}}` | Modify | Add {{what}} |

---

## Dependencies

| Type | Item | Why |
|------|------|-----|
| **Requires** | {{epic/system}} | {{reason}} |
| **Enables** | {{epic/system}} | {{reason}} |

---

## PRD Coverage

| FR | Requirement | Notes |
|----|-------------|-------|
| → FR: `FR-{{N}}` | {{short_description}} | {{notes}} |
| → FR: `FR-{{N}}` | {{short_description}} | |

---

## Acceptance Criteria

Epic is complete when:
- [ ] {{measurable_outcome}}
- [ ] {{measurable_outcome}}
- [ ] All stories completed
- [ ] Tests pass (coverage >{{N}}%)
- [ ] Documentation updated

---

## Stories

| ID | Title | Size | File | Status |
|----|-------|------|------|--------|
| E{{E}}-S01 | {{title}} | S/M/L | `story-{{E}}-01-{{slug}}.md` | ⬜ |
| E{{E}}-S02 | {{title}} | S/M/L | `story-{{E}}-02-{{slug}}.md` | ⬜ |

**Dependency Flow:**
```
S01 ──► S02 ──► S03
         │
         └──► S04
```

---

## Story Tasks

<!-- Populated when stories are written; lets the developer build a task list without opening every story file. -->

### E{{E}}-S01: {{story title}}
- E{{E}}-S01-T01: {{task title}}
- E{{E}}-S01-T02: {{task title}}

### E{{E}}-S02: {{story title}}
- E{{E}}-S02-T01: {{task title}}
- E{{E}}-S02-T02: {{task title}}

<!-- Example:
### E04-S01: Merge Domain Logic
- E04-S01-T01: MergeResult value object
- E04-S01-T02: Merge service — primary selection
- E04-S01-T03: Unit tests

### E04-S02: Auto Merge on Link
- E04-S02-T01: Event handler for link
- E04-S02-T02: Best-effort merge logic
- E04-S02-T03: Integration tests
-->

---

## Technical Decisions

| Decision | Rationale | ADR |
|----------|-----------|-----|
| {{decision}} | {{why}} | → ADR: `ADR-{{N}}` |

---

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| {{risk}} | H/M/L | {{approach}} |

---

## References

→ PRD: `{{path}}`
→ Architecture: `{{path}}`
→ Unit: `{{unit}}`
