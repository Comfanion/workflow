---
name: architecture-design
description: How to design system architecture following hexagonal/DDD patterns with proper module boundaries
license: MIT
compatibility: opencode
metadata:
  domain: software-architecture
  patterns: hexagonal, ddd, modular-monolith
  artifacts: docs/architecture.md
---

# Architecture Design Skill

## When to Use

Use this skill when you need to:
- Design new system architecture
- Define module/service boundaries
- Create data ownership model
- Design integration points
- Document architectural decisions

## Reference

Always check project standards: `@CLAUDE.md`

## Template

Use template at: `@.opencode/templates/architecture-template.md`

## Architecture Principles

### 1. Hexagonal Architecture (Ports & Adapters)

```
┌─────────────────────────────────────────────────────┐
│                   Infrastructure                     │
│  ┌───────────────────────────────────────────────┐  │
│  │                  Application                   │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │                 Domain                   │  │  │
│  │  │  (Business Logic - NO dependencies!)     │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  │           Use Cases (Orchestration)           │  │
│  └───────────────────────────────────────────────┘  │
│        Adapters (HTTP, DB, Kafka, External)         │
└─────────────────────────────────────────────────────┘

Dependency Direction: Infrastructure → Application → Domain
                      (NEVER reverse!)
```

### 2. Module Structure

```
module/
├── domain/              # Business logic ONLY
│   ├── aggregate/       # Entities with business rules
│   ├── valueobject/     # Immutable value objects
│   ├── service/         # Domain services
│   ├── repository/      # Repository INTERFACES (ports)
│   └── event/           # Domain events
├── application/         # Use cases
│   └── usecase/
│       └── CreateEntity/
│           ├── inport.go    # Interface
│           ├── dto.go       # Command & Result
│           ├── handler.go   # Orchestration
│           └── mappers.go   # Explicit mapping
└── infrastructure/      # Adapters
    ├── repo/            # DB implementations
    ├── http/            # HTTP handlers
    └── kafka/           # Event publishers
```

### 3. Module Boundaries

Each module must have:
- **Single responsibility** - One business capability
- **Explicit data ownership** - Clear which entities it owns
- **Defined interfaces** - API contracts for communication
- **No cross-module imports** - Communicate via Kafka/HTTP only

## Design Process

### Step 1: Identify Bounded Contexts

From PRD, identify:
1. Major business capabilities
2. Data ownership boundaries
3. Team boundaries (Conway's Law)

### Step 2: Define Module Contracts

For each module:
```yaml
module: catalog
responsibility: Product and category management
owns:
  - Product
  - Category
  - Attribute
consumes:
  - merchant.created (from Merchant module)
produces:
  - product.created
  - product.updated
  - category.created
api:
  - POST /api/v1/products
  - GET /api/v1/products/{id}
  - GET /api/v1/categories
```

### Step 3: Design Data Model

For each owned entity:
- Primary key strategy (UUID recommended)
- Required fields
- Indexes (for query patterns)
- Relationships
- Audit fields (created_at, updated_at, version)

### Step 4: Design Events

For state changes:
```yaml
event: product.created
version: "1.0"
payload:
  product_id: uuid
  merchant_id: uuid
  name: string
  created_at: timestamp
```

### Step 5: Document Decisions (ADRs)

Use skill: `adr-writing`

## NFR Mapping

Map each NFR to architectural solution:

| NFR | Architectural Support |
|-----|----------------------|
| Response < 200ms | Caching (Redis), connection pooling |
| 99.9% availability | K8s HA, health checks, circuit breakers |
| 1000 RPS | Horizontal scaling, async processing |
| Data security | TLS, encryption at rest, audit logs |

## Architecture Checklist

Before completing:
- [ ] All PRD functional areas have architectural home
- [ ] All NFRs have concrete architectural support
- [ ] Module boundaries are clear
- [ ] Data ownership is explicit (each entity has ONE owner)
- [ ] No circular dependencies between modules
- [ ] Integration points are well-defined
- [ ] ADRs exist for major decisions
- [ ] Aligns with CLAUDE.md patterns
- [ ] Diagrams included (context, container, component)

## Anti-patterns to Avoid

1. **Distributed monolith** - Modules that must deploy together
2. **Shared database** - Multiple modules accessing same tables
3. **Circular dependencies** - Module A depends on B depends on A
4. **God module** - One module doing everything
5. **Anemic domain** - Business logic in services, not entities

## Output

Save to: `docs/architecture.md`

## Related Skills

- `adr-writing` - For architecture decisions
- `data-modeling` - For database design
- `api-design` - For REST API contracts
- `event-design` - For Kafka event schemas
- `architecture-validation` - For validation
