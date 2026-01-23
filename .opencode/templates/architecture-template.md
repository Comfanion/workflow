# [Project Name] - Architecture Document

**Author:** [Name]
**Date:** [YYYY-MM-DD]
**Version:** [X.Y]
**Status:** Draft | Review | Approved

---

## Architecture Overview

### System Context

[High-level description of system boundaries and external actors]

```
                    ┌─────────────────────────────────────────┐
                    │           External Systems              │
                    │  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
                    │  │  PIM    │  │   DAX   │  │ Payment │ │
                    │  └────┬────┘  └────┬────┘  └────┬────┘ │
                    └───────┼────────────┼────────────┼──────┘
                            │            │            │
                    ┌───────▼────────────▼────────────▼──────┐
                    │              API Gateway                │
                    └───────────────────┬────────────────────┘
                                        │
                    ┌───────────────────▼────────────────────┐
                    │            Your System                  │
                    │  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
                    │  │Module A │  │Module B │  │Module C │ │
                    │  └─────────┘  └─────────┘  └─────────┘ │
                    └─────────────────────────────────────────┘
```

### Architecture Style

| Aspect | Choice | Rationale |
|--------|--------|-----------|
| Overall | Modular Monolith / Microservices | [Why] |
| Communication | REST + Kafka Events | [Why] |
| Data | PostgreSQL + Redis | [Why] |
| Deployment | Kubernetes | [Why] |

### Key Decisions Summary

| Decision | Choice | ADR |
|----------|--------|-----|
| [Decision 1] | [Choice] | ADR-001 |
| [Decision 2] | [Choice] | ADR-002 |

---

## Module/Service Architecture

### [Module 1 Name]

**Responsibility:** [Single responsibility description]

#### Boundaries

| Aspect | Details |
|--------|---------|
| **Owns** | [Entities/data this module owns] |
| **Consumes** | [Events/APIs it consumes from other modules] |
| **Produces** | [Events/APIs it produces for other modules] |

#### Internal Structure

```
module-name/
├── domain/              # Business logic (NO infrastructure imports!)
│   ├── aggregate/       # Entities with business rules
│   │   └── entity.go
│   ├── valueobject/     # Immutable value objects
│   │   └── entity_id.go
│   ├── service/         # Domain services
│   └── repository/      # Repository INTERFACES (ports)
│       └── entity_repository.go
├── application/         # Use cases (orchestration)
│   └── usecase/
│       └── CreateEntity/
│           ├── inport.go    # Interface
│           ├── dto.go       # Command & Result
│           ├── handler.go   # Orchestration
│           └── mappers.go   # Explicit mapping
└── infrastructure/      # Adapters (implements ports)
    ├── repo/            # Database implementations
    ├── http/            # HTTP handlers, routes
    └── kafka/           # Event bus implementations
```

#### API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/v1/entities | Create entity | JWT |
| GET | /api/v1/entities/{id} | Get entity | JWT |
| PUT | /api/v1/entities/{id} | Update entity | JWT |

#### Events

| Event | Direction | Description |
|-------|-----------|-------------|
| entity.created | Produces | When entity is created |
| other.event | Consumes | Triggers action X |

---

### [Module 2 Name]

**Responsibility:** [Single responsibility description]

[Same structure as above...]

---

## Data Architecture

### Database Design

#### [Table 1 Name]

```sql
CREATE TABLE entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version INTEGER NOT NULL DEFAULT 1  -- Optimistic locking
);

-- Indexes
CREATE INDEX idx_entities_status ON entities(status);
CREATE INDEX idx_entities_name_trgm ON entities USING gin(name gin_trgm_ops);
```

#### Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────┐
│   Entity A   │       │   Entity B   │
├──────────────┤       ├──────────────┤
│ id (PK)      │──────<│ entity_a_id  │
│ name         │       │ id (PK)      │
│ status       │       │ data         │
└──────────────┘       └──────────────┘
```

### Data Flow

```
[External] → [API Gateway] → [Module A] → [Database]
                                │
                                ▼
                          [Kafka Topic]
                                │
                                ▼
                          [Module B] → [External System]
```

### Event Schema

#### entity.created

```json
{
  "event_type": "entity.created",
  "version": "1.0",
  "timestamp": "2026-01-23T10:00:00Z",
  "correlation_id": "uuid",
  "payload": {
    "entity_id": "uuid",
    "name": "string",
    "created_by": "uuid"
  }
}
```

---

## Integration Architecture

### External Systems

| System | Type | Protocol | Data Exchanged | Frequency |
|--------|------|----------|----------------|-----------|
| [System 1] | Inbound | REST API | Product data | On-demand |
| [System 2] | Outbound | Kafka | Order events | Real-time |
| [System 3] | Sync | REST API | Inventory levels | Every 5 min |

### API Contracts

#### [External API 1]

**Base URL:** https://external-system.com/api/v1
**Authentication:** API Key in header

| Endpoint | Method | Purpose |
|----------|--------|---------|
| /resources | GET | Fetch resources |
| /resources | POST | Create resource |

---

## Cross-Cutting Concerns

### Security

| Concern | Implementation |
|---------|---------------|
| Authentication | JWT tokens via API Gateway |
| Authorization | Role-based (RBAC) |
| Data Protection | TLS 1.3, AES-256 at rest |
| Secrets | HashiCorp Vault |

### Observability

| Concern | Tool | Implementation |
|---------|------|----------------|
| Logging | Loki + zerolog | Structured JSON logs |
| Metrics | VictoriaMetrics | Prometheus exposition |
| Tracing | Tempo | OpenTelemetry |
| Profiling | Pyroscope | Continuous profiling |

### Error Handling

| Error Type | HTTP Code | Strategy |
|------------|-----------|----------|
| Validation | 400 | Return structured errors |
| Not Found | 404 | Return with message |
| Business Rule | 422 | Return with error code |
| Internal | 500 | Log + correlation ID |
| External Failure | 503 | Circuit breaker + retry |

---

## Architecture Decision Records (ADRs)

### ADR-001: [Decision Title]

**Status:** Accepted | Superseded | Deprecated
**Date:** YYYY-MM-DD
**Deciders:** [Names]

**Context:**
[Why this decision was needed - the problem or requirement]

**Decision:**
[What was decided - the chosen solution]

**Consequences:**
- **Positive:** [Benefits]
- **Negative:** [Trade-offs]
- **Risks:** [What could go wrong]

**Alternatives Considered:**
1. [Alternative 1] - Rejected because [reason]
2. [Alternative 2] - Rejected because [reason]

---

### ADR-002: [Decision Title]

[Same structure...]

---

## NFR Compliance

| NFR ID | Requirement | Architectural Support |
|--------|-------------|----------------------|
| NFR-001 | Response time < 200ms | Caching, connection pooling |
| NFR-002 | 99.9% availability | K8s HA, health checks |
| NFR-003 | 1000 RPS throughput | Horizontal scaling |
| NFR-010 | Data encryption | TLS + encryption at rest |

---

## Deployment Architecture

### Infrastructure

```
┌─────────────────────────────────────────────────────────────┐
│                     Kubernetes Cluster                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    Namespace: prod                    │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │   │
│  │  │  Service A │  │  Service B │  │  Service C │     │   │
│  │  │  (3 pods)  │  │  (3 pods)  │  │  (2 pods)  │     │   │
│  │  └────────────┘  └────────────┘  └────────────┘     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                External Services                      │   │
│  │  PostgreSQL (RDS)    Kafka (MSK)    Redis (Elasticache)│ │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Scaling Strategy

| Service | Min Pods | Max Pods | Scaling Metric |
|---------|----------|----------|----------------|
| Service A | 3 | 10 | CPU > 70% |
| Service B | 3 | 8 | RPS > 500 |

---

## Risks & Technical Debt

| Item | Type | Impact | Mitigation Plan | Owner |
|------|------|--------|-----------------|-------|
| [Item 1] | Risk | High | [Plan] | [Name] |
| [Item 2] | Tech Debt | Medium | [Plan] | [Name] |

---

## Diagrams

### C4 - Container Diagram

[Link to diagram or embedded]

### Sequence Diagram - [Flow Name]

```
┌─────┐     ┌─────┐     ┌─────┐     ┌─────┐
│Client│     │ API │     │Svc A│     │ DB  │
└──┬──┘     └──┬──┘     └──┬──┘     └──┬──┘
   │  request  │           │           │
   │──────────>│           │           │
   │           │  forward  │           │
   │           │──────────>│           │
   │           │           │   query   │
   │           │           │──────────>│
   │           │           │   result  │
   │           │           │<──────────│
   │           │  response │           │
   │           │<──────────│           │
   │  response │           │           │
   │<──────────│           │           │
```

---

## References

- CLAUDE.md - Coding standards and patterns
- PRD - Product requirements
- docs/architecture/adr/ - All ADRs

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | YYYY-MM-DD | [Name] | Initial draft |
| 1.0 | YYYY-MM-DD | [Name] | Approved |
