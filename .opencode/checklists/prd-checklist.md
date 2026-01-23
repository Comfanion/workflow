# PRD Validation Checklist

Use this checklist to validate PRD before proceeding to architecture design.

## Structure Completeness

### Required Sections
- [ ] Executive Summary present
- [ ] Project Classification defined
- [ ] Success Criteria with measurable targets
- [ ] User Personas defined
- [ ] User Journeys documented
- [ ] Product Scope (MVP/Growth/Vision)
- [ ] Functional Requirements (all FRs)
- [ ] Non-Functional Requirements (all NFRs)
- [ ] Dependencies & Integrations
- [ ] Risks & Mitigations
- [ ] Constraints documented
- [ ] Glossary included
- [ ] Traceability Matrix present

### Metadata
- [ ] Version number present
- [ ] Status clearly indicated
- [ ] Author identified
- [ ] Date recorded

## Functional Requirements Quality

### SMART Validation (Score each FR 1-5)

| FR # | Specific | Measurable | Attainable | Relevant | Traceable | Avg | Flag |
|------|----------|------------|------------|----------|-----------|-----|------|
| FR-001 | | | | | | | |
| FR-002 | | | | | | | |
| ... | | | | | | | |

**Legend:** 1=Poor, 3=Acceptable, 5=Excellent
**Flag:** X = Any score < 3

### Acceptance Criteria
- [ ] Every FR has acceptance criteria
- [ ] AC uses Given/When/Then format
- [ ] AC is testable
- [ ] Edge cases covered

### Coverage
- [ ] All user journeys have supporting FRs
- [ ] All personas have relevant FRs
- [ ] MVP scope is clearly marked

## Non-Functional Requirements Quality

### Performance
- [ ] Response time targets specified
- [ ] Throughput targets specified
- [ ] Measurement method defined

### Security
- [ ] Authentication requirements defined
- [ ] Authorization requirements defined
- [ ] Data protection requirements defined
- [ ] Compliance requirements listed

### Scalability
- [ ] Scale targets specified
- [ ] Growth projections documented

### Reliability
- [ ] Availability target (SLA) defined
- [ ] Recovery objectives (RTO/RPO) specified

## Traceability Check

### Source Tracing
- [ ] Each FR traces to source document
- [ ] Each FR traces to user journey
- [ ] Each FR maps to persona

### Forward Tracing
- [ ] Epic assignments planned
- [ ] Story breakdown feasible

## Consistency Check

### Terminology
- [ ] Terms used consistently
- [ ] All terms in glossary defined
- [ ] No conflicting definitions

### Priority Alignment
- [ ] P0 requirements are truly critical
- [ ] MVP scope is minimal but viable
- [ ] Dependencies respect priority order

### No Implementation Leakage
- [ ] No specific technology mandates (unless constraint)
- [ ] Focus is on WHAT, not HOW
- [ ] No premature architecture decisions

## Risk Assessment

### Risks Identified
- [ ] Technical risks documented
- [ ] Business risks documented
- [ ] Timeline risks documented
- [ ] Each risk has mitigation strategy

### Dependencies
- [ ] External dependencies listed
- [ ] Internal dependencies identified
- [ ] Fallback plans for critical dependencies

## Validation Summary

| Category | Score | Status | Notes |
|----------|-------|--------|-------|
| Structure Completeness | /10 | | |
| FR Quality (SMART) | /10 | | |
| NFR Quality | /10 | | |
| Traceability | /10 | | |
| Consistency | /10 | | |
| Risk Coverage | /10 | | |

**Overall Score:** /60
**Status:** APPROVED / NEEDS REVISION / BLOCKED

### Severity Levels
- **60-54:** Excellent - Ready for architecture
- **53-42:** Good - Minor improvements recommended
- **41-30:** Acceptable - Some revisions needed
- **<30:** Needs Work - Significant revision required

**Action Items:**
1. [High priority item]
2. [Medium priority item]
3. [Low priority item]

**Validated By:** {{user_name}}
**Date:** {{date}}
