# {{Unit Name}} Data Model

**Version:** 1.0
**Date:** {{YYYY-MM-DD}}
**Status:** Active

---

## Design Principles

| Principle | Description |
|-----------|-------------|
| {{Principle}} | {{Why this matters}} |

---

## Entity Relationship Diagram

```
{{ASCII or Mermaid diagram}}
```

---

## Tables

### {{Table Name}}

{{Purpose of this table}}

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Primary identifier |
| {{field}} | {{type}} | {{constraints}} | {{description}} |

**Indexes:**
- `({{fields}})` — {{purpose}}

---

## Relations

| Relation | Type | Description |
|----------|------|-------------|
| {{table_a}} → {{table_b}} | 1:N | {{description}} |

---

## Status Lifecycle

```
{{state_a}} ──► {{state_b}} ──► {{state_c}}
```

| Status | Description | Transitions To |
|--------|-------------|----------------|
| {{status}} | {{meaning}} | {{allowed_next}} |
