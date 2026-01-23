---
name: adr-writing
description: How to write Architecture Decision Records (ADRs) documenting technical decisions and rationale
license: MIT
compatibility: opencode
metadata:
  domain: software-architecture
  artifacts: docs/architecture/adr/
---

# ADR Writing Skill

## When to Use

Use this skill when you need to:
- Document a significant architectural decision
- Record the rationale behind a technical choice
- Track decision history over time
- Communicate decisions to the team

## When to Write an ADR

Write an ADR when:
- Choosing between multiple valid approaches
- Making a decision that affects multiple modules
- Selecting a technology or framework
- Defining a pattern to follow consistently
- Making a trade-off between quality attributes

## ADR Template

```markdown
# ADR-NNN: [Decision Title]

**Status:** Proposed | Accepted | Deprecated | Superseded by ADR-XXX
**Date:** YYYY-MM-DD
**Deciders:** [Names of people involved]
**Technical Story:** [Link to epic/story if applicable]

## Context

[Describe the situation that led to this decision. What is the problem?
What forces are at play? What constraints exist?]

## Decision

[State the decision clearly. What are we going to do?]

## Consequences

### Positive
- [Benefit 1]
- [Benefit 2]

### Negative
- [Drawback 1]
- [Drawback 2]

### Neutral
- [Side effect that is neither good nor bad]

## Alternatives Considered

### Alternative 1: [Name]
[Brief description]
- **Pros:** [advantages]
- **Cons:** [disadvantages]
- **Rejected because:** [reason]

### Alternative 2: [Name]
[Brief description]
- **Pros:** [advantages]
- **Cons:** [disadvantages]
- **Rejected because:** [reason]

## References

- [Link to relevant documentation]
- [Link to research or benchmarks]

## Notes

[Any additional context, caveats, or follow-up actions]
```

## Naming Convention

```
ADR-NNN-short-description.md

Examples:
- ADR-001-use-postgresql.md
- ADR-002-event-driven-integration.md
- ADR-003-modular-monolith-architecture.md
```

## Status Lifecycle

```
Proposed → Accepted → (Deprecated | Superseded)
```

- **Proposed:** Under discussion
- **Accepted:** Decision made and in effect
- **Deprecated:** No longer relevant (system changed)
- **Superseded:** Replaced by a newer ADR

## Good ADR Examples

### Example: Database Choice

```markdown
# ADR-001: Use PostgreSQL as Primary Database

**Status:** Accepted
**Date:** 2026-01-15
**Deciders:** Tech Lead, Architect

## Context

We need a primary database for the marketplace system.
Requirements:
- ACID transactions for orders
- Complex queries for product search
- JSON support for flexible attributes
- Proven reliability at scale

## Decision

Use PostgreSQL 17+ with AWS RDS.

## Consequences

### Positive
- Strong ACID guarantees
- Excellent JSON/JSONB support
- GIN indexes for full-text search
- Team expertise exists

### Negative
- Requires careful schema design
- Scaling writes is harder than NoSQL
- AWS RDS costs

## Alternatives Considered

### MySQL
- Pros: Simpler, cheaper
- Cons: Weaker JSON support, fewer features
- Rejected: JSON operations are critical for us

### MongoDB
- Pros: Flexible schema, easy scaling
- Cons: No ACID across documents, eventual consistency
- Rejected: Need strong consistency for orders
```

### Example: Integration Pattern

```markdown
# ADR-002: Event-Driven Integration Between Modules

**Status:** Accepted
**Date:** 2026-01-16
**Deciders:** Architect, Tech Lead

## Context

Modules need to communicate. Options:
1. Direct API calls (synchronous)
2. Event-driven (asynchronous)
3. Shared database (anti-pattern)

## Decision

Use Kafka for event-driven integration between modules.
Modules publish domain events, others subscribe.

## Consequences

### Positive
- Loose coupling between modules
- Better scalability
- Natural audit trail
- Resilient to failures

### Negative
- Eventual consistency complexity
- Need idempotent consumers
- Additional infrastructure (Kafka)
- Harder to debug

## Alternatives Considered

### Direct HTTP Calls
- Rejected: Creates tight coupling, cascading failures
```

## Directory Structure

```
docs/architecture/adr/
├── ADR-001-use-postgresql.md
├── ADR-002-event-driven-integration.md
├── ADR-003-modular-monolith.md
├── ADR-004-hexagonal-architecture.md
└── README.md  # Index of all ADRs
```

## ADR Index (README.md)

```markdown
# Architecture Decision Records

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [ADR-001](ADR-001-use-postgresql.md) | Use PostgreSQL | Accepted | 2026-01-15 |
| [ADR-002](ADR-002-event-driven-integration.md) | Event-driven integration | Accepted | 2026-01-16 |
| [ADR-003](ADR-003-modular-monolith.md) | Modular monolith | Accepted | 2026-01-17 |
```

## Quality Checklist

Before finalizing ADR:
- [ ] Context explains the problem clearly
- [ ] Decision is stated unambiguously
- [ ] Consequences include both positive and negative
- [ ] At least 2 alternatives were considered
- [ ] Alternatives explain why they were rejected
- [ ] Status is set correctly
- [ ] Date and deciders are recorded

## Output

Save to: `docs/architecture/adr/ADR-NNN-description.md`
Update: `docs/architecture/adr/README.md` (index)

## Related Skills

- `architecture-design` - For overall architecture
- `architecture-validation` - For validating ADRs exist
