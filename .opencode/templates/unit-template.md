# Unit: {{name}}

```yaml
id: {{ID}}
type: module | domain | entity | service | feature
status: draft | approved
```

---

## Overview

{{name}} is responsible for {{single_responsibility}}. It owns {{what_it_owns}} and provides {{what_it_exposes}} to other parts of the system.

**Type:** {{module/domain/entity/service/feature}}

**Key Characteristics:**
- {{characteristic_1}}
- {{characteristic_2}}

<!-- e.g.
Task is responsible for representing a unit of work in the system. It owns title, description, status, and due date, and provides CRUD operations and status transitions to other parts of the system.

**Type:** entity

**Key Characteristics:**
- Immutable ID after creation
- Status follows defined workflow
- Always belongs to one workspace
-->

---

## Boundaries

| Aspect | Details |
|--------|---------|
| **Owns** | {{data_and_behavior}} |
| **Uses** | → Unit: `{{dependency}}` |
| **Provides** | {{exposed_operations}} |

**Notes:**
- {{boundary_clarification}}

---

## Data Model

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | {{type}} | PK | Primary identifier |
| {{field}} | {{type}} | {{constraints}} | {{description}} |
| {{field}} | {{type}} | {{constraints}} | {{description}} |

<!-- e.g.
| id | UUID | PK | Primary identifier |
| title | string | required, max 200 | Task title |
| status | enum | required | todo, in_progress, done |
| assignee_id | UUID | FK → User, nullable | Assigned user |
| due_date | datetime | nullable | Deadline |
-->

---

## Relations

```
{{this}} ──► {{other}} ({{relation_type}})
{{this}} ──< {{other}} ({{relation_type}})
```

| Relation | Target | Type | Description |
|----------|--------|------|-------------|
| {{name}} | → Unit: `{{target}}` | {{1:1/1:N/N:M}} | {{description}} |

<!-- e.g.
| assignee | → Unit: `User` | N:1 | Task assigned to user |
| comments | → Unit: `Comment` | 1:N | Task has many comments |
| tags | → Unit: `Tag` | N:M | Task can have multiple tags |
-->

---

## Operations

| Operation | Input | Output | Description |
|-----------|-------|--------|-------------|
| {{op}} | {{params}} | {{result}} | {{what_it_does}} |

**Business Rules:**
- {{rule}}

<!-- e.g.
| Create | title, description | Task | Creates new task with status=todo |
| Assign | task_id, user_id | Task | Assigns task to user |
| ChangeStatus | task_id, new_status | Task | Transitions status |

**Business Rules:**
- Cannot assign to deactivated user
- Status can only move forward (todo→progress→done)
-->

---

## State Machine

```
{{state_1}} ──► {{state_2}} ──► {{state_3}}
     │              │
     └──────────────┘ ({{condition}})
```

| State | Description | Transitions To |
|-------|-------------|----------------|
| {{state}} | {{meaning}} | {{next_states}} |

---

## Errors

| Error | Code | When |
|-------|------|------|
| {{error}} | {{code}} | {{condition}} |

<!-- e.g.
| TaskNotFound | TASK_001 | Task with ID doesn't exist |
| InvalidTransition | TASK_002 | Status change not allowed |
| AssigneeInactive | TASK_003 | Cannot assign to deactivated user |
-->

---

## References

→ Architecture: `{{path}}`
→ Related: → Unit: `{{related}}`
