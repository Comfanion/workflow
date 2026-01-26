# {{project}} — PRD

```yaml
id: PRD-001
version: 1.0
status: draft | approved
date: {{date}}
author: {{author}}
```

---

## Project Classification

> **Purpose:** Determines workflow depth and artifact sizes. Agents use this to adapt their approach.
> See `.opencode/project-size-guide.yaml` for detailed guidelines.

| Attribute | Value | Notes |
|-----------|-------|-------|
| **Size** | {{size}} | toy / small / medium / large / enterprise |
| **Complexity** | {{complexity}} | simple / moderate / complex / very_complex |
| **Team Size** | {{team_size}} | Number of developers |
| **Timeline** | {{timeline}} | Expected duration |
| **Domain** | {{domain}} | web_app / mobile_app / api / library / cli / game / embedded |

**Size Impact:**
- **PRD Depth:** {{prd_pages}} pages
- **Architecture:** {{arch_lines}} lines
- **Epics:** {{epic_count}} ({{epic_scope}})
- **Stories per Epic:** {{stories_per_epic}}
- **Sprints:** {{sprint_count}}

<!-- Examples:
TOY (Tetris):
  Size: toy | Complexity: simple | Team: 1 | Timeline: < 1 week | Domain: game
  PRD: 2-3 pages | Arch: 200-500 lines | Epics: 3-5 (major features) | Stories: 3-8 | Sprints: 1

SMALL (Blog):
  Size: small | Complexity: simple | Team: 1-2 | Timeline: 1-4 weeks | Domain: web_app
  PRD: 3-5 pages | Arch: 500-1000 lines | Epics: 5-10 (features) | Stories: 5-12 | Sprints: 1-2

MEDIUM (E-commerce):
  Size: medium | Complexity: moderate | Team: 2-5 | Timeline: 1-3 months | Domain: web_app
  PRD: 5-10 pages | Arch: 1000-2000 lines | Epics: 8-15 (modules) | Stories: 8-15 | Sprints: 2-4
-->

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
