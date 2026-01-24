# {{project}} — Architecture

```yaml
id: ARCH-001
version: 1.0
status: draft | approved
date: {{date}}
author: {{author}}
```

---

## Executive Summary

{{project}} is a {{type}} for {{purpose}}. The system handles {{core_capabilities}}.

**Architecture Pattern:** {{pattern}} — {{why_this_pattern}}

**Key Domains:**
1. **{{domain_1}}** ({{modules_count}} modules) — {{description}}
2. **{{domain_2}}** ({{modules_count}} modules) — {{description}}

**Critical Business Rules:**
- {{rule_1}}
- {{rule_2}}

**Scale:**
- **MVP:** {{scale}}
- **Growth:** {{scale}}

<!-- e.g.
TaskFlow is a task management platform for distributed teams.

**Architecture Pattern:** Modular Monolith — enables independent scaling while keeping deployment simple (pattern chosen based on team size and scale requirements)

**Key Domains:**
1. **Task Domain** (2 modules) — Task CRUD, assignments, status workflow
2. **Team Domain** (2 modules) — Users, roles, permissions

**Critical Business Rules:**
- One task = one assignee (no shared ownership)
- Status transitions: todo → in_progress → done
-->

---

## Decision Summary

| Category | Decision | Rationale |
|----------|----------|-----------|
| Architecture | {{decision}} | {{why}} |
| Database | {{decision}} | {{why}} |
| Communication | {{decision}} | {{why}} |

<!-- e.g.
| Architecture | Modular Monolith | Team size, deployment simplicity |
| Database | PostgreSQL | ACID needed, team expertise |
| Communication | REST sync + Kafka async | REST for queries, Kafka for events |
-->

---

## System Context

```
     {{external_1}}        {{external_2}}
          │                     │
          ▼                     ▼
┌─────────────────────────────────────────┐
│              {{project}}                 │
│                                          │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│   │{{mod_1}}│  │{{mod_2}}│  │{{mod_3}}│ │
│   └─────────┘  └─────────┘  └─────────┘ │
│                                          │
└─────────────────────────────────────────┘
          │                     │
          ▼                     ▼
     {{storage_1}}         {{storage_2}}
```

---

## Modules Overview

### {{Domain_1}} ({{N}} modules)

#### {{Module_1}}

**Purpose:** {{single_responsibility}}

**Internal Services:**

| Service | Responsibilities | Storage |
|---------|-----------------|---------|
| {{service}} | {{what_it_does}} | {{db}} |
| {{service}} | {{what_it_does}} | {{db}} |

**Database Schema:**
```
{{table_1}}    # {{fields_description}}
{{table_2}}    # {{fields_description}}
```

**Events:**
- **Produces:** {{event_1}}, {{event_2}}
- **Consumes:** {{event_1}}

**Notes:**
- {{important_detail}}

<!-- e.g.
#### Task Module

**Purpose:** Task lifecycle management — CRUD, assignments, status transitions

**Internal Services:**

| Service | Responsibilities | Storage |
|---------|-----------------|---------|
| tasks | Task CRUD, validation | PostgreSQL |
| assignments | User-task linking | PostgreSQL |
| workflow | Status transitions | PostgreSQL |

**Database Schema:**
```
tasks           # id, title, description, status, assignee_id, due_date
task_history    # task_id, field, old_value, new_value, changed_at
```

**Events:**
- **Produces:** TaskCreated, TaskUpdated, TaskAssigned, StatusChanged
- **Consumes:** UserDeactivated (to reassign tasks)

**Notes:**
- Status flow: todo → in_progress → done (configurable per workspace)
-->

---

## Data Architecture

### Storage by Module

| Module | Primary DB | Cache | Other |
|--------|-----------|-------|-------|
| {{module}} | {{db}} | {{cache}} | {{other}} |

### Key Entity Relations

```
{{entity_1}} ──< {{entity_2}}
      │
      └──── {{entity_3}}
```

---

## Integration

### External Systems

| System | Protocol | Direction | Purpose |
|--------|----------|-----------|---------|
| {{system}} | {{protocol}} | In/Out | {{purpose}} |

**Notes:**
- {{integration_detail}}

### Internal Communication

| From | To | Method | When |
|------|-----|--------|------|
| {{module}} | {{module}} | {{REST/Kafka}} | {{trigger}} |

---

## Cross-Cutting Concerns

### Security
| Concern | Implementation |
|---------|---------------|
| AuthN | {{approach}} |
| AuthZ | {{approach}} |

### Observability
- **Logging:** {{tool}}
- **Metrics:** {{tool}}
- **Tracing:** {{tool}}

### Error Handling
| Error Type | HTTP | Strategy |
|------------|------|----------|
| Validation | 400 | Return field errors |
| Not Found | 404 | Return with message |
| Business Rule | 422 | Return error code |

---

## NFR Compliance

| NFR | Requirement | How Addressed |
|-----|-------------|---------------|
| NFR-001 | {{requirement}} | {{solution}} |

---

## References

→ PRD: `{{path}}`
→ ADRs: `{{path}}`
→ Diagrams: `{{path}}`
