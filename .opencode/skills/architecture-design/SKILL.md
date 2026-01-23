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
| Architecture | Hexagonal | Organizational standard |
| Database | PostgreSQL per module | Service isolation |

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

Use: `@.opencode/templates/unit-template.md`

Reference in architecture:
```
→ Unit: `catalog`
→ Unit: `Task`
```

## Architecture Principles

### Hexagonal Architecture

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
```

### Module Boundaries

Each module must have:
- **Single responsibility** - One business capability
- **Explicit data ownership** - Clear which entities it owns
- **Defined interfaces** - API contracts for communication
- **No cross-module imports** - Communicate via Kafka/HTTP only

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
