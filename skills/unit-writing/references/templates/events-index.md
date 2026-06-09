# {{Unit Name}} Events

**Version:** 1.0
**Date:** {{YYYY-MM-DD}}

---

## Overview

{{Brief description of event patterns in this unit}}

---

## Event Flow

```
{{ASCII diagram: sources → processing → sinks}}
```

---

## Topics

### Produced Events

| Topic | Events | Key | Description |
|-------|--------|-----|-------------|
| {{topic}} | {{EventType}} | {{partition_key}} | {{description}} |

### Consumed Events

| Topic | Events | Source |
|-------|--------|--------|
| {{topic}} | {{EventType}} | {{source_system}} |

---

## Schema Files

| Schema | Description |
|--------|-------------|
| [{{event}}.avsc]({{event}}.avsc) | {{description}} |
