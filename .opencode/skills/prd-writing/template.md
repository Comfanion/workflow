# {{project}} — PRD

```yaml
id: PRD-001
version: 1.0
status: draft | approved
date: {{date}}
author: {{author}}
```

---

## Executive Summary

{{project}} is a {{type}} platform for {{target_users}}. The system handles {{core_capabilities}}.

**Architecture:** {{architecture_pattern}}

**Key Domains:**
1. **{{domain_1}}** — {{description}}
2. **{{domain_2}}** — {{description}}

**What Makes This Special:**
- {{unique_value_1}}
- {{unique_value_2}}

**Scale:**
- **MVP:** {{mvp_scale}}
- **Growth:** {{growth_scale}}

<!-- e.g.
TaskFlow is a B2B platform for managing distributed teams. The system handles task management, real-time collaboration, and team analytics.

**Architecture:** Modular Monolith (pattern chosen based on team size and requirements)

**Key Domains:**
1. **Task Management** — CRUD, assignments, status workflow
2. **Team** — Users, roles, permissions

**What Makes This Special:**
- Real-time sync without WebSockets (smart polling)
- Formula-based task prioritization

**Scale:**
- **MVP:** 100 teams, 10K tasks
- **Growth:** 1000 teams, 100K tasks
-->

---

## Success Criteria

### MVP Success
- {{criterion_1}}
- {{criterion_2}}

### Growth Success
- {{criterion_1}}
- {{criterion_2}}

---

## Product Scope

### MVP — Minimum Viable Product

**{{Domain_1}}:**
- {{capability}}
- {{capability}}

**{{Domain_2}}:**
- {{capability}}

### Growth Features (Post-MVP)
- {{feature}}

### Out of Scope
- {{item}}

---

## Functional Requirements

### {{Domain_1}}

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-001 | {{requirement}} | P0 |
| FR-002 | {{requirement}} | P0 |
| FR-003 | {{requirement}} | P1 |

<!-- e.g.
| FR-001 | User can create task with title, description, due date | P0 |
| FR-002 | User can assign task to team member | P0 |
| FR-003 | System sends notification on assignment | P1 |
-->

**Notes:**
- {{important_business_rule}}

### {{Domain_2}}

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-010 | {{requirement}} | P0 |

---

## Non-Functional Requirements

### Performance
| Metric | Target |
|--------|--------|
| {{metric}} | {{value}} |

### Security
- {{requirement}}

### Scalability
- {{requirement}}

---

## Critical Business Rules

1. **{{rule_name}}** — {{description}}
2. **{{rule_name}}** — {{description}}

<!-- e.g.
1. **One User = One Task Owner** — Task can have only one assignee at a time
2. **Status Flow** — Tasks follow: todo → in_progress → done (no skip)
-->

---

## Glossary

| Term | Definition |
|------|------------|
| {{term}} | {{definition}} |

---

## References

→ Architecture: `{{path}}`
→ Requirements: `{{path}}`
