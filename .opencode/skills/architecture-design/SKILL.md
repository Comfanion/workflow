---
name: architecture-design
description: Use when designing new system architecture, defining module boundaries, choosing architectural patterns (CQRS, Event Sourcing), or making technology decisions
license: MIT
compatibility: opencode
metadata:
  domain: software-architecture
  patterns: hexagonal, ddd, cqrs, event-sourcing, saga
  artifacts: docs/architecture.md
---

# Architecture Design Skill

## When to Use

Use this skill when you need to:
- Design new system architecture
- Define module/service boundaries
- Create data ownership model
- Design integration points
- Choose architectural patterns (CQRS, Event Sourcing, Saga)
- Make technology trade-off decisions
- Document architectural decisions

## Reference

Always check project standards: `@CLAUDE.md`

## Template

Use template at: `@.opencode/skills/architecture-design/template.md`

## CRITICAL: Adapt Depth to Project Size

**BEFORE writing architecture, read PRD's Project Classification section!**

Your architecture document size should match project size:

| Project Size | Target Lines | Diagrams | ADRs | Focus |
|--------------|--------------|----------|------|-------|
| **TOY** | 200-500 | C4 Context + Container | None | Core components only |
| **SMALL** | 500-1000 | + C4 Component | 2-3 major decisions | Clear module boundaries |
| **MEDIUM** | 1000-2000 | + Sequences + ER | 5-10 significant | Complete system design |
| **LARGE** | 2000-4000 | + Deployment + State | 10-20 all decisions | Multiple files OK |
| **ENTERPRISE** | 4000+ | All diagrams | 20+ per domain | Per-domain files |

**Examples:**

**TOY (Tetris - 350 lines):**
```
Executive Summary (50 lines)
System Context diagram (ASCII)
3 Modules: GameEngine, Renderer, ScoreManager
Data Model: GameState object (no DB)
Tech Stack: HTML5 Canvas, Vanilla JS
```

**SMALL (Blog - 800 lines):**
```
Executive Summary
Decision Summary (pattern choice)
C4 Context + Container + Component
5 Modules: Auth, Posts, Comments, Media, Admin
ER Diagram (users, posts, comments)
2-3 ADRs (why SQLite, why server-side rendering)
```

**MEDIUM (E-commerce - 1500 lines):**
```
Full C4 model
8 Modules across 3 domains
Complete ER diagram
Sequence diagrams for checkout flow
5-10 ADRs
Integration points documented
```

**Don't over-engineer small projects!** If PRD says "toy", keep it under 500 lines.

---

## Module/Unit Breakdown by Size

**CRITICAL:** Read PRD's Project Classification to determine module strategy.

| Project Size | Module Strategy | Structure |
|--------------|-----------------|-----------|
| **TOY** | No modules | Flat components (GameEngine, Renderer, ScoreManager) |
| **SMALL** | No modules | Flat components (AuthService, PostService, CommentService) |
| **MEDIUM** | **YES - Modules** | 3-5 modules (OrderModule, InventoryModule, PaymentModule) |
| **LARGE** | **YES - Domains** | 5-10 domains (OrderDomain, PaymentDomain, UserDomain) |
| **ENTERPRISE** | **YES - Bounded Contexts** | 10+ contexts with subdomains |

**For MEDIUM+ projects:**

1. **Identify Modules from PRD:**
   - Read PRD's Executive Summary → "Key Domains"
   - Each domain = Module in architecture
   - Example: PRD lists "Order Management, Inventory, Payment" → 3 modules

2. **Document Each Module:**
   - Create section per module in architecture.md
   - Define module boundaries (what's in, what's out)
   - Define module's internal services
   - Define module's data ownership
   - Define module's API (what other modules can call)

3. **Create Unit Documentation:**
   - For each module, create `docs/units/module-name/index.md`
   - Use `unit-writing` skill
   - Include: data model, API spec, events (if event-driven)

4. **Module Communication:**
   - Document how modules interact
   - Synchronous (REST/GraphQL) or Asynchronous (events)
   - Integration diagram showing module dependencies

**Example - MEDIUM E-commerce (3 modules):**

```markdown
## Modules Overview

### Order Management Module

**Purpose:** Handles order lifecycle from creation to fulfillment

**Internal Services:**
- OrderService: CRUD operations
- OrderWorkflowService: Status transitions
- OrderValidationService: Business rules

**Data Ownership:**
- orders table
- order_items table
- order_history table

**API (exposed to other modules):**
- `POST /orders` - Create order
- `GET /orders/{id}` - Get order details
- `PUT /orders/{id}/status` - Update status

**Events Published:**
- OrderCreated
- OrderPaid
- OrderShipped

→ Unit: `docs/units/order-management/`

### Payment Module
...

### Inventory Module
...
```

**TOY/SMALL projects - NO modules:**
Just list components/services in flat structure.

## Architecture Document Structure (v2)

### 1. Executive Summary

Brief prose with:
- What the system is
- Architecture pattern + why chosen
- Key domains with module counts
- Critical business rules
- Scale targets

### 2. Decision Summary

| Category | Decision | Rationale |
|----------|----------|-----------|
| Architecture | {{pattern}} | {{why_chosen}} |
| Database | {{db_choice}} | {{why_chosen}} |

*Choose pattern based on project needs — see "Architecture Style Selection" below*

### 3. System Context

ASCII diagram showing:
- External systems
- Main system boundary
- Internal modules
- Storage layer

### 4. Modules Overview

For each domain, then each module:

```markdown
### {{Domain}} ({{N}} modules)

#### {{Module}}

**Purpose:** {{single_responsibility}}

**Internal Services:**

| Service | Responsibilities | Storage |
|---------|-----------------|---------|

**Database Schema:**
```
table_name    # field descriptions
```

**Events:**
- **Produces:** Event1, Event2
- **Consumes:** Event3

**Notes:**
- Important details
```

### 5. Data Architecture

| Module | Primary DB | Cache | Other |
|--------|-----------|-------|-------|

With entity relations diagram.

### 6. Integration

External systems table + internal communication table.

### 7. Cross-Cutting Concerns

- Security (AuthN, AuthZ)
- Observability (Logging, Metrics, Tracing)
- Error Handling table

### 8. NFR Compliance

| NFR | Requirement | How Addressed |
|-----|-------------|---------------|

### 9. References

```
→ PRD: `docs/prd.md`
→ ADRs: `docs/architecture/adr/`
```

## Unit Documentation

For each module/domain/entity, create separate Unit document.

Use: `@.opencode/skills/unit-writing/template.md`

Reference in architecture:
```
→ Unit: `catalog`
→ Unit: `Task`
```

## Architecture Style Selection

**Choose based on project context — no default!**

### Style Comparison

| Style | Best For | Team Size | Complexity |
|-------|----------|-----------|------------|
| **Layered** | Simple CRUD apps, MVPs | 1-3 devs | Low |
| **Hexagonal** | Testable business logic, many integrations | 3-10 devs | Medium |
| **Clean Architecture** | Complex domain, long-term maintainability | 5+ devs | Medium-High |
| **Microservices** | Independent scaling, multiple teams | 10+ devs | High |
| **Vertical Slices** | Feature teams, rapid iteration | Any | Medium |

### Layered Architecture

```
┌─────────────────────────────┐
│       Presentation          │  ← Controllers, Views
├─────────────────────────────┤
│        Application          │  ← Services, DTOs
├─────────────────────────────┤
│          Domain             │  ← Entities, Business Logic
├─────────────────────────────┤
│       Infrastructure        │  ← DB, External APIs
└─────────────────────────────┘

Dependencies: Top → Bottom (each layer depends on layer below)
```

**Use when:** Simple CRUD, small team, fast delivery needed
**Avoid when:** Complex business rules, many external integrations

### Hexagonal (Ports & Adapters)

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

Dependencies: Outside → Inside (Infrastructure → Application → Domain)
```

**Use when:** Many integrations, need to swap implementations, testability critical
**Avoid when:** Simple apps, overhead not justified

### Clean Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Frameworks & Drivers               │
│  ┌───────────────────────────────────────────────┐  │
│  │            Interface Adapters                  │  │
│  │  ┌───────────────────────────────────────┐    │  │
│  │  │          Application Business          │    │  │
│  │  │  ┌─────────────────────────────────┐  │    │  │
│  │  │  │    Enterprise Business Rules    │  │    │  │
│  │  │  │         (Entities)              │  │    │  │
│  │  │  └─────────────────────────────────┘  │    │  │
│  │  │        (Use Cases)                    │    │  │
│  │  └───────────────────────────────────────┘    │  │
│  │   Controllers, Gateways, Presenters           │  │
│  └───────────────────────────────────────────────┘  │
│              Web, DB, UI, External                   │
└─────────────────────────────────────────────────────┘

Dependency Rule: Source code dependencies point INWARD only
```

**Use when:** Complex domain, multiple UIs, long-term project
**Avoid when:** MVP, tight deadlines

### Vertical Slices

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Feature A  │  │  Feature B  │  │  Feature C  │
│ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────┐ │
│ │ Handler │ │  │ │ Handler │ │  │ │ Handler │ │
│ │ Logic   │ │  │ │ Logic   │ │  │ │ Logic   │ │
│ │ Data    │ │  │ │ Data    │ │  │ │ Data    │ │
│ └─────────┘ │  │ └─────────┘ │  │ └─────────┘ │
└─────────────┘  └─────────────┘  └─────────────┘
       │               │               │
       └───────────────┴───────────────┘
                 Shared Kernel
```

**Use when:** Feature teams, CQRS, rapid delivery
**Avoid when:** Heavy cross-feature dependencies

---

## Module Boundaries

Regardless of architecture style, each module must have:

- **Single responsibility** - One business capability
- **Explicit data ownership** - Clear which entities it owns
- **Defined interfaces** - API contracts for communication
- **Loose coupling** - Communicate via events/APIs, not direct imports

**Communication patterns:**

| Pattern | Use When | Example |
|---------|----------|---------|
| Direct call (in-process) | Same deployment, sync needed | Service → Repository |
| REST/gRPC | Cross-service, request-response | Order → Inventory check |
| Events (Kafka/RabbitMQ) | Async, decoupled, eventual consistency | OrderPlaced → Notification |
| Shared DB (avoid) | Legacy, temporary | — migrate away |

---

## Architectural Patterns

### Pattern Selection Matrix

| Pattern | Use When | Avoid When |
|---------|----------|------------|
| **Modular Monolith** | MVP, small team, unclear boundaries | High scale needs, multiple teams |
| **Microservices** | Clear boundaries, independent scaling | Small team, shared data |
| **CQRS** | Different read/write models, complex queries | Simple CRUD |
| **Event Sourcing** | Audit trail critical, temporal queries | Simple state, storage concerns |
| **Saga** | Distributed transactions, compensation needed | Single DB, simple workflows |

### CQRS (Command Query Responsibility Segregation)

```
┌─────────────┐      ┌─────────────┐
│   Command   │      │    Query    │
│   (Write)   │      │   (Read)    │
└──────┬──────┘      └──────┬──────┘
       │                    │
       ▼                    ▼
┌─────────────┐      ┌─────────────┐
│ Write Model │      │ Read Model  │
│ (normalized)│      │(denormalized│
└──────┬──────┘      └──────┬──────┘
       │    Sync/Event      │
       └────────────────────┘
```

**When to use:**
- Read/write ratio > 10:1
- Complex query requirements
- Different consistency needs

**Trade-offs:**
| Benefit | Cost |
|---------|------|
| Optimized read performance | Eventual consistency |
| Independent scaling | Data sync complexity |
| Simpler query logic | More infrastructure |

### Event Sourcing

```
┌──────────┐    ┌──────────┐    ┌──────────┐
│ Command  │───►│  Event   │───►│  State   │
│          │    │  Store   │    │ (derived)│
└──────────┘    └──────────┘    └──────────┘
                     │
                     ▼ Replay
               ┌──────────┐
               │Projection│
               └──────────┘
```

**When to use:**
- Full audit trail required
- Temporal queries ("state at time X")
- Complex domain with many state transitions

**Trade-offs:**
| Benefit | Cost |
|---------|------|
| Complete audit history | Storage growth |
| Time-travel queries | Query complexity |
| Event replay for debugging | Schema evolution |

### Saga Pattern (Distributed Transactions)

```
┌────────┐    ┌────────┐    ┌────────┐
│ Step 1 │───►│ Step 2 │───►│ Step 3 │
└────────┘    └────────┘    └────────┘
     │             │             │
     ▼             ▼             ▼
Compensate 1  Compensate 2  Compensate 3
     ▲             ▲             │
     └─────────────┴─────────────┘
              (on failure)
```

**Types:**
| Type | Coordination | Use When |
|------|--------------|----------|
| Choreography | Events | Simple flows, few services |
| Orchestration | Central orchestrator | Complex flows, many services |

**Example: Order Saga**
1. Reserve inventory → (compensate: release inventory)
2. Charge payment → (compensate: refund)
3. Ship order → (compensate: cancel shipment)

### Resilience Patterns

| Pattern | Problem Solved | Implementation |
|---------|----------------|----------------|
| **Circuit Breaker** | Cascading failures | Open after N failures, half-open retry |
| **Retry with Backoff** | Transient failures | Exponential backoff + jitter |
| **Bulkhead** | Resource exhaustion | Isolate thread pools/connections |
| **Timeout** | Hanging requests | Set max wait time |
| **Fallback** | Service unavailable | Default response, cached data |

**Circuit Breaker States:**
```
        success
    ┌───────────────┐
    │               │
    ▼    N failures │
┌────────┐     ┌────────┐
│ CLOSED │────►│  OPEN  │
└────────┘     └────────┘
    ▲               │
    │   timeout     ▼
    │          ┌─────────┐
    └──────────│HALF-OPEN│
      success  └─────────┘
```

---

## Trade-off Analysis

### Decision Matrix Template

When choosing between options, use weighted scoring:

| Criteria | Weight | Option A | Option B | Option C |
|----------|--------|----------|----------|----------|
| Performance | 30% | 4 (1.2) | 3 (0.9) | 5 (1.5) |
| Complexity | 25% | 3 (0.75) | 5 (1.25) | 2 (0.5) |
| Team expertise | 20% | 5 (1.0) | 3 (0.6) | 2 (0.4) |
| Maintainability | 15% | 4 (0.6) | 4 (0.6) | 3 (0.45) |
| Cost | 10% | 3 (0.3) | 4 (0.4) | 5 (0.5) |
| **Total** | | **3.85** | **3.75** | **3.35** |

*Scores: 1-5, higher is better*

### Common Trade-offs

| Decision | Option A | Option B | Key Factor |
|----------|----------|----------|------------|
| Monolith vs Microservices | Simple ops, shared DB | Independent deploy, complexity | Team size, scale needs |
| SQL vs NoSQL | ACID, complex queries | Flexible schema, horizontal scale | Data structure, consistency |
| Sync vs Async | Simple, immediate | Resilient, decoupled | Latency tolerance |
| REST vs gRPC | Universal, cacheable | Performance, streaming | Client types |
| Polling vs Webhooks | Simple, reliable | Real-time, efficient | Latency requirements |

---

## Quality Attribute Scenarios

### Performance Scenario Template

```
Source:       [Who/what triggers]
Stimulus:     [What happens]
Environment:  [Under what conditions]
Artifact:     [What part of system]
Response:     [What system does]
Measure:      [How to verify]
```

### Example Scenarios

**Performance:**
| Element | Value |
|---------|-------|
| Source | 1000 concurrent users |
| Stimulus | Submit search query |
| Environment | Normal operation |
| Artifact | Search API |
| Response | Return results |
| Measure | 95th percentile < 200ms |

**Availability:**
| Element | Value |
|---------|-------|
| Source | Any user |
| Stimulus | Request any API |
| Environment | Peak load |
| Artifact | Core services |
| Response | Respond successfully |
| Measure | 99.9% uptime monthly |

**Security:**
| Element | Value |
|---------|-------|
| Source | Unauthenticated user |
| Stimulus | Access protected resource |
| Environment | Normal operation |
| Artifact | API Gateway |
| Response | Return 401, log attempt |
| Measure | 100% unauthorized blocked |

### NFR → Architecture Mapping

| NFR Type | Architectural Tactics |
|----------|----------------------|
| **Performance** | Caching, CDN, read replicas, async processing |
| **Scalability** | Horizontal scaling, sharding, queue-based load leveling |
| **Availability** | Redundancy, health checks, circuit breakers, multi-AZ |
| **Security** | Auth gateway, encryption, WAF, rate limiting |
| **Maintainability** | Modular design, clear interfaces, documentation |

---

### Reference Format

Always use `→` prefix:
```
→ Unit: `catalog`
→ FR: `FR-001`
→ ADR: `ADR-001`
→ PRD: `docs/prd.md`
```

## Validation Checklist

Before completing:
- [ ] All PRD functional areas have architectural home
- [ ] All NFRs have concrete architectural support
- [ ] Module boundaries are clear
- [ ] Data ownership is explicit (each entity has ONE owner)
- [ ] No circular dependencies between modules
- [ ] Integration points are well-defined
- [ ] ADRs exist for major decisions
- [ ] Uses `→` reference format
- [ ] Unit docs created for key modules

## Output

- Main: `docs/architecture.md`
- Units: `docs/architecture/units/` or inline
- ADRs: `docs/architecture/adr/`

## Related Skills

- `adr-writing` - For architecture decisions
- `unit-writing` - For module/entity documentation
- `architecture-validation` - For validation
