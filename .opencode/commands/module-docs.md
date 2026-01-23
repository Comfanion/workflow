---
description: Create detailed documentation for a module in docs/architecture/[module]/
agent: module-docs
---

# Module Documentation

## Arguments
$ARGUMENTS

- `[module-name]`: Create docs for specified module
- `list`: List existing modules
- `[module] add [type]`: Add specific file to module (api, events, scenarios, flows)

## Module Location

All modules live in `docs/architecture/[module-name]/`

## Prerequisites Check

1. **Main Architecture** - @docs/architecture.md (REQUIRED)
2. **PRD** - @docs/prd.md (REQUIRED)

!`ls -la docs/architecture.md 2>/dev/null || echo "ARCHITECTURE MISSING"`
!`ls -la docs/prd.md 2>/dev/null || echo "PRD MISSING"`

## Check Existing Modules

!`ls -la docs/architecture/ 2>/dev/null || echo "No modules yet"`

## Input Context

Load:
- @docs/architecture.md (REQUIRED)
- @docs/prd.md (REQUIRED)
- @docs/architecture-db.md (if exists)
- @docs/coding-standards/README.md

## Your Task

### Create Mode: `/module-docs [module-name]`

Create module directory and files:

```
docs/architecture/[module-name]/
├── index.md                 # Overview (ALWAYS)
├── architecture.md          # Module architecture (ALWAYS)
├── prd.md                   # Module requirements (if needed)
├── data-model.md            # DB schema (if has DB)
├── domain.md                # Domain model (if DDD)
```

**Step by step:**

1. Create directory `docs/architecture/[module-name]/`

2. **index.md** (ALWAYS)
   - Overview, purpose
   - Quick links to other files
   - Dependencies (depends on / depended by)
   - Key metrics

3. **architecture.md** (ALWAYS)
   - Context diagram (ASCII)
   - Layers (domain, application, infrastructure)
   - Boundaries (owns vs references)
   - Use cases table
   - Communication (inbound/outbound)

4. **prd.md** (if module has own requirements)
   - Module-specific FRs
   - Module-specific NFRs
   - Subset of main PRD

5. **data-model.md** (if module has database)
   - Schema diagram (ASCII)
   - Tables with columns
   - Indexes
   - Relationships
   - Migrations list

6. **domain.md** (if using DDD)
   - Aggregates with diagrams
   - State machines
   - Value objects
   - Domain services
   - Domain events

### Add Mode: `/module-docs [module] add [type]`

Add subdirectory to existing module:

| Type | Creates |
|------|---------|
| `api` | `api/index.md`, `api/openapi.yaml` |
| `events` | `events/index.md` |
| `scenarios` | `scenarios/` directory |
| `flows` | `flows/` directory |
| `integrations` | `integrations/` directory |
| `decisions` | `decisions/adr-001.md` |

### List Mode: `/module-docs list`

Show all existing modules and their files.

## Writing Rules

1. **NO code** - Architecture and specs only
2. **ASCII diagrams** - Box drawing characters
3. **< 2000 lines** - Per file
4. **Cross-references** - Link to main architecture (`../../architecture.md`)
5. **Tables** - Structured, scannable

## Output Structure

```
docs/architecture/[module]/
├── index.md                 # Overview
├── architecture.md          # Design
├── prd.md                   # Requirements
├── data-model.md            # DB schema
├── domain.md                # DDD model
│
├── api/                     # If has API
│   ├── index.md
│   └── openapi.yaml
│
├── events/                  # If event-driven
│   └── index.md
│
├── scenarios/               # Use case scenarios
│   └── [scenario].md
│
├── flows/                   # Flow diagrams
│   └── [flow].md
│
└── integrations/            # External integrations
    └── [system].md
```

## Validation

After creating, verify:
- [ ] index.md and architecture.md present
- [ ] Each file < 2000 lines
- [ ] No code examples
- [ ] ASCII diagrams present
- [ ] Cross-references work (../../architecture.md)
- [ ] Aligns with main architecture

## After Completion

Suggest:
- `/validate module [name]` - Cascading validation
- `/module-docs [name] add api` - Add API docs
- `/module-docs [name] add events` - Add events docs
- `/diagram [module] c4-component` - Component diagram
