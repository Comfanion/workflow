---
name: unit-writing
description: How to document modules, domains, entities, services, and features using the universal Unit format
license: MIT
compatibility: opencode
metadata:
  domain: documentation
  artifacts: docs/architecture/units/*.md
---

# Unit Writing Skill

## When to Use

Use this skill when you need to document any logical piece of the system:
- **Module** - Large bounded context (e.g., `catalog`, `billing`)
- **Domain** - Medium business area (e.g., `Order`, `Payment`)
- **Entity** - Small data object (e.g., `User`, `Task`, `Product`)
- **Service** - Medium component (e.g., `NotificationService`)
- **Feature** - Varies (e.g., `Search`, `Import`)

## Template

Use template at: `@.opencode/templates/unit-template.md`

## Unit Document Structure

### 1. Header

```yaml
id: {{ID}}
type: module | domain | entity | service | feature
status: draft | approved
```

### 2. Overview

Prose paragraph explaining:
- What the unit is responsible for
- What it owns
- What it provides to others
- Key characteristics

### 3. Boundaries

| Aspect | Details |
|--------|---------|
| **Owns** | Data and behavior this unit controls |
| **Uses** | → Unit: `dependency` |
| **Provides** | What others can use from this unit |

### 4. Data Model

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Primary identifier |
| name | string | required, max 200 | Display name |

### 5. Relations

ASCII diagram + table:

```
Task ──► User (assignee)
Task ──< Comment (1:N)
```

| Relation | Target | Type | Description |
|----------|--------|------|-------------|
| assignee | → Unit: `User` | N:1 | Task assigned to user |

### 6. Operations

| Operation | Input | Output | Description |
|-----------|-------|--------|-------------|
| Create | params | Entity | Creates new instance |

With **Business Rules:** list.

### 7. State Machine (if applicable)

```
todo ──► in_progress ──► done
```

| State | Description | Transitions To |
|-------|-------------|----------------|

### 8. Errors

| Error | Code | When |
|-------|------|------|
| NotFound | UNIT_001 | Entity doesn't exist |

### 9. References

```
→ Architecture: `docs/architecture.md`
→ Related: → Unit: `OtherUnit`
```

## Unit Types Guide

| Type | When to Use | Example |
|------|-------------|---------|
| `module` | Deployable bounded context | `catalog`, `auth` |
| `domain` | Business concept grouping | `Order`, `Inventory` |
| `entity` | Core data object | `User`, `Task` |
| `service` | Stateless component | `EmailService` |
| `feature` | Cross-cutting capability | `Search`, `Export` |

## Naming Conventions

### File Names

```
unit-{name}.md

Examples:
- unit-task.md
- unit-catalog.md
- unit-notification-service.md
```

### Unit IDs

```
{TYPE}-{NAME}

Examples:
- MOD-CATALOG
- ENT-TASK
- SVC-NOTIFICATION
```

## Reference Format

Always use `→` prefix when referencing units:

```markdown
→ Unit: `Task`
→ Unit: `catalog/Product`
→ Unit: `NotificationService`
```

In other documents (PRD, Architecture, Stories):
```markdown
| Feature | Unit |
|---------|------|
| Task CRUD | → Unit: `Task` |
```

## When to Create Unit Doc

| Situation | Create Unit Doc? |
|-----------|-----------------|
| New module in architecture | Yes |
| Complex entity with business rules | Yes |
| Entity referenced from multiple places | Yes |
| Simple value object | No (document inline) |
| Internal implementation detail | No |

## Validation Checklist

- [ ] Type is correctly specified
- [ ] Overview explains single responsibility
- [ ] Boundaries are clear (owns/uses/provides)
- [ ] Data model complete with constraints
- [ ] Relations use `→ Unit:` format
- [ ] Operations list all public methods
- [ ] Business rules documented
- [ ] Errors have codes
- [ ] References link to related docs

## Output

Save to: `docs/architecture/units/unit-{name}.md`

Or inline in architecture doc for simple units.

## Related Skills

- `architecture-design` - References units
- `story-writing` - Tasks reference units
- `epic-writing` - Epics affect units
