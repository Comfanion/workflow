# {{Name}}

```yaml
type: entity
status: draft | approved
version: "1.0"
```

---

## Overview

{{What this entity represents, its role in the domain.}}

---

## Boundaries

| Aspect | Details |
|--------|---------|
| **Owns** | {{fields, behavior}} |
| **Part of** | {{parent domain/module path}} |

---

## Data Model

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Primary identifier |
| {{field}} | {{type}} | {{constraints}} | {{description}} |

---

## Relations

```
{{Entity}} ──► {{Other}} ({{type}})
{{Entity}} ──< {{Other}} ({{type}})
```

| Relation | Target | Type | Description |
|----------|--------|------|-------------|
| {{name}} | {{target}} | N:1 / 1:N / N:M | {{description}} |

---

## State Machine

```
{{state_a}} ──► {{state_b}} ──► {{state_c}}
```

| State | Description | Transitions To |
|-------|-------------|----------------|
| {{state}} | {{meaning}} | {{allowed_next}} |

---

## Operations

| Operation | Input | Output | Description |
|-----------|-------|--------|-------------|
| Create | {{params}} | Entity | {{description}} |
| {{op}} | {{params}} | {{result}} | {{description}} |

**Business Rules:**
- {{rule}}

---

## Errors

| Error | Code | When |
|-------|------|------|
| {{Error}} | {{CODE}} | {{condition}} |

---

## References

```
→ Parent: {{parent path}}
→ Related: {{related path}}
```
