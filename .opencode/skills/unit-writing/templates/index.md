# {{Name}}

```yaml
type: module | domain | service | entity
status: draft | approved
version: "1.0"
created: {{YYYY-MM-DD}}
```

---

## Overview

{{One paragraph describing what this unit does, what problem it solves, and key characteristics.}}

**Not responsible for:**
- {{What this unit explicitly doesn't handle}}

---

## Boundaries

| Aspect | Details |
|--------|---------|
| **Owns** | {{tables, domain objects, behavior}} |
| **Uses** | → Unit: `{{dependency}}` ({{purpose}}) |
| **Provides** | {{APIs, events, services to others}} |

---

## Architecture

```
{{ASCII diagram showing high-level structure}}
```

---

## Documents

| Document | Description |
|----------|-------------|
| [data-model.md](data-model.md) | Database schema |
| [api/](api/) | API specifications |
| [events/](events/) | Event schemas |

## Child Units

| Unit | Type | Description |
|------|------|-------------|
| [services/{{service}}/](services/{{service}}/) | service | {{description}} |
| [domains/{{domain}}/](domains/{{domain}}/) | domain | {{description}} |

---

## References

```
→ Architecture: docs/architecture.md
→ Related: modules/{{related}}/ or services/{{related}}/
```
