---
name: unit-writing
description: Use when documenting modules, domains, services, or entities - creating index.md, data-model.md, API specs, or event schemas for architectural components
license: MIT
compatibility: opencode
metadata:
  domain: documentation
  artifacts: docs/architecture/{modules,services,domains}/
---

# Unit Writing Skill

## Overview

Documentation follows a **folder-based structure** organized by type: modules, services, domains. Agent determines the appropriate type based on what is being documented.

**Core Principles:**
- Each file focuses on one concern
- Files stay under 500 lines (RAG-friendly)
- Agent decides the type — no rigid rules

## When to Use

Use this skill to document any logical piece of the system:

| Type | When to Use | Example |
|------|-------------|---------|
| `module` | Deployable bounded context, largest scope | `catalog`, `auth`, `billing` |
| `domain` | Business concept grouping within module | `Order`, `Payment`, `Identity` |
| `service` | Stateless component with clear API | `NotificationService`, `CorrelationEngine` |
| `entity` | Core data object with business rules | `User`, `Product`, `Invoice` |
| `feature` | Cross-cutting capability | `Search`, `Import`, `Export` |

### Hierarchy

Components can be nested when logical:

| Parent | Can contain |
|--------|-------------|
| `module` | services, domains |
| `service` | domains, entities |
| `domain` | entities |
| `entity` | — (leaf node) |

Agent decides based on project context — no strict rules.

### Documentation Depth by Type

| Type | Location | Required Files | Optional |
|------|----------|----------------|----------|
| `module` | `modules/{name}/` | index, data-model | api/, events/, services/, domains/ |
| `service` | `services/{name}/` OR `modules/{m}/services/{name}/` | index | api/, data-model |
| `domain` | `domains/{name}/` OR inside module/service | index, data-model | entities/ |
| `entity` | inside domain | {entity}.md | — |

**When to use separate folder vs inline:**
- **Separate folder** — has own API, events, or multiple child units
- **Single file** — simple entity, no children, < 200 lines

**Don't create units for:**
- Simple value objects (document inline in parent)
- Internal implementation details
- DTOs, request/response objects

---

## Folder Structure

Documentation organized under `docs/architecture/`:

```
docs/architecture/
├── modules/                    # Bounded contexts
│   └── {module}/
│       ├── index.md
│       ├── data-model.md
│       ├── api/
│       ├── events/
│       ├── services/           # Services INSIDE module
│       │   └── {service}/
│       └── domains/            # Domains INSIDE module
│           └── {domain}/
│
├── services/                   # Standalone services (outside modules)
│   └── {service}/
│       ├── index.md
│       └── api/
│
└── domains/                    # Standalone domains (rare)
    └── {domain}/
```

### Placement rules

| Component | Standalone | Inside module |
|-----------|------------|---------------|
| service | `services/{name}/` | `modules/{m}/services/{name}/` |
| domain | `domains/{name}/` | `modules/{m}/domains/{name}/` |
| entity | — | always inside domain |

Agent decides based on:
- **Standalone service** — independent, used by multiple modules
- **Service inside module** — belongs to one bounded context

### File Purposes

| File | Purpose | Max Lines |
|------|---------|-----------|
| `index.md` | Overview, boundaries, navigation, key decisions | ~150 |
| `data-model.md` | Database schema, relations, constraints, migrations | ~400 |
| `api/*.yaml` | OpenAPI specs for each resource | ~300 each |
| `events/index.md` | Event flow overview, topic mapping | ~200 |
| `events/*.avsc` | Individual event schemas | ~100 each |

---

## Required Files

### 1. index.md (Overview)

The main entry point for the unit. Contains:
- Unit metadata (YAML frontmatter)
- Overview paragraph
- Boundaries table (owns/uses/provides)
- Architecture diagram
- Document navigation
- Key decisions/ADRs

**Template:** See `@.opencode/skills/unit-writing/templates/index.md`

```yaml
# index.md frontmatter
---
id: MOD-COLLABORATION
type: module
status: draft | approved
version: "1.0"
created: 2026-01-24
---
```

**Boundaries Table Format:**

| Aspect | Details |
|--------|---------|
| **Owns** | meetings, channels, focus_blocks (tables + behavior) |
| **Uses** | → Unit: `identity` (contributor resolution) |
| **Uses** | → Unit: `teams` (team attribution) |
| **Provides** | Collaboration metrics API, Team health signals |

### 2. data-model.md (Database Schema)

Complete database schema documentation:
- Entity Relationship Diagram (ASCII/Mermaid)
- Table definitions (SQL or structured tables)
- Indexes and constraints
- Migration strategy (if applicable)

**Structure:**
1. Overview (design principles)
2. ERD diagram
3. Core tables (with full SQL or field tables)
4. Supporting tables
5. Indexes
6. Views/Aggregates (if any)
7. Migration notes

**Example header:**
```markdown
# Collaboration Data Model

**Version:** 1.0
**Date:** 2026-01-24
**Status:** Active

## 1. Design Principles

| Principle | Description |
|-----------|-------------|
| **Single Source of Truth** | PostgreSQL primary, Redis for cache |
| **SCD2 History** | Time-scoped team membership |
```

### 3. events/index.md (Events Overview)

Overview of all events the unit produces/consumes:
- Event flow diagram
- Topic naming convention
- Event types table
- Schema file references

**Structure:**
```markdown
# {Unit} Events

## Overview
Brief description of event-driven patterns.

## Event Flow
ASCII/Mermaid diagram showing producers/consumers.

## Topics

| Topic | Events | Partition Key | Direction |
|-------|--------|---------------|-----------|
| `events.teams.canonical` | meeting_* | tenant_id | inbound |

## Schema Files

| Schema | Description |
|--------|-------------|
| `meeting-scheduled.avsc` | New meeting created |
```

### 4. api/*.yaml (OpenAPI Specs)

One OpenAPI file per resource or logical grouping:
- `meetings.yaml` - Meeting endpoints
- `focus-time.yaml` - Focus time endpoints
- `graph.yaml` - Collaboration graph endpoints

Follow OpenAPI 3.1 format.

---

## Naming Conventions

### Folder Names

```
kebab-case, lowercase

Examples:
- modules/billing/
- services/notification/
- domains/subscription/
```

### File Names

```
index.md                # Entry point (always)
data-model.md           # Database schema
{resource}.yaml         # API specs by resource
{event-type}.avsc       # Event schemas by type
```

---

## Reference Format

Reference other components with relative paths:

```markdown
| Uses | [identity](../domains/identity/) (contributor resolution) |
| Uses | [teams](../modules/teams/) (team attribution) |
```

Or with `→` shorthand:
```markdown
→ modules/billing
→ services/notification
→ domains/subscription/data-model.md#plans
```

---

## Creating Documentation

### Step 1: Determine type

Agent analyzes what is being documented:
- Has own deployment/bounded context? → `modules/`
- Stateless with clear API? → `services/`
- Business logic grouping? → `domains/`

### Step 2: Create folder

```bash
mkdir -p docs/architecture/{type}/{name}
```

### Step 3: Start with index.md

Create `index.md` with:
1. Overview paragraph
2. Boundaries table (owns/uses/provides)
3. Architecture diagram (if complex)
4. Navigation to other files

### Step 4: Add supporting files as needed

- `data-model.md` — if has database
- `api/*.yaml` — if has REST/gRPC API
- `events/` — if event-driven
- `entities/*.md` — for leaf entities

---

## Validation Checklist

### index.md
- [ ] Has YAML frontmatter (id, type, status, version)
- [ ] Overview explains single responsibility
- [ ] Boundaries table complete (owns/uses/provides)
- [ ] Architecture diagram present
- [ ] Navigation links to other files
- [ ] References to related units

### data-model.md
- [ ] ERD diagram present
- [ ] All tables documented
- [ ] Constraints and indexes listed
- [ ] Follows project DB conventions

### events/
- [ ] index.md with topic mapping
- [ ] Individual schema files for each event
- [ ] Event flow diagram

### api/
- [ ] OpenAPI 3.1 format
- [ ] Consistent naming
- [ ] Request/response examples

---

## Example

```
docs/architecture/
├── modules/
│   └── billing/                        # Module
│       ├── index.md
│       ├── data-model.md
│       ├── services/
│       │   └── payment-gateway/        # Service INSIDE module
│       │       ├── index.md
│       │       └── api/
│       └── domains/
│           └── subscription/           # Domain INSIDE module
│               ├── index.md
│               └── entities/
│                   └── plan.md
│
└── services/
    └── notification/                   # Standalone service
        ├── index.md
        └── api/
```

**Key patterns:**
1. `payment-gateway` is inside `billing` — it belongs to that module
2. `notification` is standalone — used by multiple modules
3. Each component has `index.md` as entry point
4. Entities are leaf nodes (single files inside domain)

---

## Anti-Patterns

❌ **DON'T:**
- Create 500+ line monolithic files
- Mix data model with API with events in one file
- Embed full SQL schemas in index.md
- Force everything into rigid structure

✅ **DO:**
- Keep files focused and under 500 lines
- Separate concerns (data model, API, events)
- Let agent decide appropriate structure
- Use relative paths for references

---

## Output

```
docs/architecture/
├── modules/{name}/                 # Bounded contexts
│   ├── services/{name}/            # Services inside module
│   └── domains/{name}/             # Domains inside module
├── services/{name}/                # Standalone services
└── domains/{name}/                 # Standalone domains
```

Agent decides placement based on component relationships.

## Related Skills

- `architecture-design` - Creates units during architecture phase
- `story-writing` - Tasks reference units
- `epic-writing` - Epics affect units
- `adr-writing` - ADRs may be linked from unit index
