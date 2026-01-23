# Architecture Validation Checklist

Use this checklist to validate architecture before proceeding to epic/story creation.

## Structure Completeness

### Required Sections
- [ ] Executive Summary / Overview
- [ ] System Context (C4 Level 1)
- [ ] Container Diagram (C4 Level 2)
- [ ] Component Diagrams (C4 Level 3) for key modules
- [ ] Data Model / Schema Design
- [ ] API Contracts
- [ ] Event Schemas (if event-driven)
- [ ] Integration Architecture
- [ ] Security Architecture
- [ ] Deployment Architecture
- [ ] ADRs for key decisions

### Metadata
- [ ] Version number present
- [ ] Status clearly indicated
- [ ] Links to PRD present

## PRD Alignment

### Functional Requirements Coverage
- [ ] All P0 FRs have architectural support
- [ ] All P1 FRs considered in design
- [ ] FR → Module mapping documented

### Non-Functional Requirements

#### Performance
- [ ] Response time targets achievable with design
- [ ] Throughput targets addressed
- [ ] Caching strategy defined
- [ ] Database indexing considered

#### Security
- [ ] Authentication mechanism defined
- [ ] Authorization model documented
- [ ] Data encryption approach specified
- [ ] Secrets management addressed

#### Scalability
- [ ] Horizontal scaling approach defined
- [ ] Stateless design where appropriate
- [ ] Database scaling strategy

#### Reliability
- [ ] Availability targets achievable
- [ ] Failover/redundancy planned
- [ ] Disaster recovery approach

## Design Quality

### Architecture Patterns
- [ ] Chosen patterns documented (hexagonal, DDD, etc.)
- [ ] Pattern choice justified
- [ ] Consistent pattern application

### Module Design
- [ ] Clear module boundaries
- [ ] Single responsibility per module
- [ ] Dependencies are explicit
- [ ] No circular dependencies

### Interface Design
- [ ] APIs follow REST/gRPC best practices
- [ ] Versioning strategy defined
- [ ] Error handling standardized
- [ ] Pagination/filtering for lists

### Data Design
- [ ] Data model normalized appropriately
- [ ] Relationships clearly defined
- [ ] Indexes planned for common queries
- [ ] Data migration strategy (if applicable)

## Integration Check

### External Systems
- [ ] All integrations from PRD addressed
- [ ] Integration patterns defined (sync/async)
- [ ] Error handling for external calls
- [ ] Retry/circuit breaker strategies

### Internal Communication
- [ ] Inter-module communication defined
- [ ] Event contracts documented (if event-driven)
- [ ] Consistency strategy (eventual vs strong)

## Coding Standards Alignment

- [ ] Architecture follows CLAUDE.md patterns
- [ ] Hexagonal architecture enforced
- [ ] Use case pattern applicable
- [ ] Testing strategy fits architecture

## ADR Quality

### For Each ADR
- [ ] Context clearly stated
- [ ] Decision clearly stated
- [ ] Alternatives considered
- [ ] Consequences documented
- [ ] Status indicated

### Key Decisions Documented
- [ ] Technology choices
- [ ] Pattern choices
- [ ] Integration approaches
- [ ] Security decisions

## Risk Assessment

### Technical Risks
- [ ] Complex integrations identified
- [ ] Performance bottlenecks anticipated
- [ ] Security vulnerabilities considered
- [ ] Scaling challenges noted

### Mitigation Strategies
- [ ] Each risk has mitigation plan
- [ ] Fallback options documented

## Implementation Readiness

### Developer Clarity
- [ ] Module boundaries clear enough for parallel development
- [ ] Interfaces defined enough to code against
- [ ] Dependencies documented for implementation order

### Testing Strategy
- [ ] Unit test approach fits architecture
- [ ] Integration test points identified
- [ ] E2E test scenarios align with user journeys

## Validation Summary

| Category | Score | Status | Notes |
|----------|-------|--------|-------|
| Structure Completeness | /10 | | |
| PRD Alignment | /10 | | |
| Design Quality | /10 | | |
| Integration | /10 | | |
| ADR Quality | /10 | | |
| Implementation Readiness | /10 | | |

**Overall Score:** /60
**Status:** APPROVED / NEEDS REVISION / BLOCKED

### Severity Levels
- **60-54:** Excellent - Ready for implementation planning
- **53-42:** Good - Minor improvements recommended
- **41-30:** Acceptable - Some revisions needed
- **<30:** Needs Work - Significant revision required

**Action Items:**
1. [High priority item]
2. [Medium priority item]
3. [Low priority item]

**Validated By:** {{user_name}}
**Date:** {{date}}
