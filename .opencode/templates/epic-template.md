# Epic {{N}}: {{title}}

```yaml
id: {{PREFIX}}-E{{N}}
status: backlog | ready | in_progress | done
priority: P0 | P1
sprint: {{sprint}}
```

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

| ID | Title | Size | Focus | Status |
|----|-------|------|-------|--------|
| S{{E}}-01 | {{title}} | S/M/L | → Unit: `{{unit}}` | ⬜ |
| S{{E}}-02 | {{title}} | S/M/L | → Unit: `{{unit}}` | ⬜ |

**Dependency Flow:**
```
S01 ──► S02 ──► S03
         │
         └──► S04
```

**Notes:**
- {{implementation_note}}

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
