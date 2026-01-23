# Module Documentation Skill

How to create detailed per-module documentation.

## Purpose

Create comprehensive documentation for individual modules/services that enables developers to understand, implement, and maintain the module.

## Module Documentation Structure

```
docs/architecture/[module]/
├── index.md              # Module overview and navigation
├── architecture.md       # Technical architecture
├── data-model.md         # Database schema and entities
├── api.md                # API contracts
├── events.md             # Event schemas (if applicable)
└── testing.md            # Testing strategy
```

## 1. Index Template (index.md)

```markdown
# {{module_name}} Module

## Overview

[1-2 paragraphs describing module purpose and responsibilities]

## Key Responsibilities

- [Responsibility 1]
- [Responsibility 2]
- [Responsibility 3]

## Module Boundaries

**Owns:**
- [What this module is responsible for]

**Does NOT Own:**
- [What other modules handle]

## Quick Links

- [Architecture](./architecture.md)
- [Data Model](./data-model.md)
- [API Contracts](./api.md)
- [Events](./events.md)
- [Testing](./testing.md)

## Related Modules

| Module | Relationship | Communication |
|--------|--------------|---------------|
| [Module A] | [Depends on] | [API / Events] |
| [Module B] | [Provides to] | [API / Events] |

## Key Requirements

| FR # | Description |
|------|-------------|
| FR-001 | [Requirement this module implements] |
| FR-002 | [Requirement this module implements] |
```

## 2. Architecture Template (architecture.md)

```markdown
# {{module_name}} Architecture

## Component Diagram

[ASCII or Mermaid diagram showing module components]

## Layer Structure

```
{{module_name}}/
├── domain/
│   ├── aggregate/
│   ├── valueobject/
│   ├── service/
│   └── repository/
├── application/
│   └── usecase/
└── infrastructure/
    ├── repo/
    └── http/
```

## Key Components

### Domain Layer

#### Aggregates
- **{{Aggregate1}}**: [Description]
- **{{Aggregate2}}**: [Description]

#### Value Objects
- **{{VO1}}**: [Description]
- **{{VO2}}**: [Description]

### Application Layer

#### Use Cases
- **{{UseCase1}}**: [What it does]
- **{{UseCase2}}**: [What it does]

### Infrastructure Layer

#### Repositories
- **{{Repo1}}**: [Implementation details]

#### HTTP Handlers
- **{{Handler1}}**: [Endpoints handled]

## Design Decisions

See ADRs:
- [ADR-001: Decision title](../../adr/ADR-001.md)
```

## 3. Data Model Template (data-model.md)

```markdown
# {{module_name}} Data Model

## Entity Relationship Diagram

[ERD diagram]

## Tables

### {{table_name}}

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| name | VARCHAR(255) | NOT NULL | [Description] |
| created_at | TIMESTAMP | NOT NULL | Creation time |

**Indexes:**
- `idx_{{table}}_{{column}}` on ({{column}})

**Relationships:**
- Has many: {{related_table}}
- Belongs to: {{parent_table}}

## Migrations

| Version | Description | File |
|---------|-------------|------|
| 001 | Create {{table}} | migrations/001_create_{{table}}.sql |
```

## 4. API Template (api.md)

```markdown
# {{module_name}} API

## Base URL

`/api/v1/{{module}}`

## Endpoints

### Create {{Resource}}

`POST /{{resources}}`

**Request:**
```json
{
  "field1": "value1",
  "field2": "value2"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "field1": "value1",
  "created_at": "2024-01-01T00:00:00Z"
}
```

**Errors:**
- 400: Validation error
- 401: Unauthorized
- 409: Conflict

### Get {{Resource}}

`GET /{{resources}}/:id`

[Continue for all endpoints...]
```

## Quality Checklist

- [ ] Index provides clear overview
- [ ] Architecture shows all components
- [ ] Data model is complete with indexes
- [ ] API contracts have request/response examples
- [ ] Events documented (if applicable)
- [ ] Testing strategy defined
- [ ] Links to ADRs included
- [ ] Requirements traceability present

## Output Location

`docs/architecture/[module-name]/`
