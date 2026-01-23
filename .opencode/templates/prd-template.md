---
stepsCompleted: []
inputDocuments: []
workflowType: 'prd'
version: "1.0"
status: draft
---

# {{project_name}} - Product Requirements Document

**Author:** {{user_name}}
**Date:** {{date}}
**Version:** 1.0
**Status:** 🚧 DRAFT | 📝 REVIEW | ✅ APPROVED
**Completeness:** {{completeness}}%

---

## Document TODOs

<!-- Track document progress here -->

| Section | Status | TODO Type | Notes |
|---------|--------|-----------|-------|
| Executive Summary | ⬜ | DRAFT | First pass needed |
| User Personas | ⬜ | RESEARCH | Interview users |
| Functional Requirements | ⬜ | EXPAND | Add all FRs |
| Non-Functional Requirements | ⬜ | NUMBERS | Add metrics |
| Dependencies | ⬜ | REVIEW | Check with architect |

**Quick Stats:**
- Sections Complete: 0/15
- Open Decisions: 0
- Blocked Items: 0

---

## Executive Summary

<!-- TODO(DRAFT): Write executive summary
- What is being built?
- Why? (business value, problem being solved)
- Unique value proposition
- 2-3 paragraphs when complete
-->

[2-3 paragraphs describing:]
- **What** is being built
- **Why** it's being built (business value, problem being solved)
- **Unique value proposition** - what makes this different

---

## Project Classification

| Attribute | Value |
|-----------|-------|
| **Technical Type** | API Backend / Web App / Mobile / CLI / Library |
| **Domain** | E-commerce / Fintech / Healthcare / B2B SaaS / etc. |
| **Complexity** | Low / Medium / High |
| **Architecture** | Monolith / Microservices / Modular Monolith |
| **Team Size** | 1-3 / 4-8 / 9+ |
| **Timeline** | Weeks / Months / Quarters |

---

## Success Criteria

### MVP Success (v1.0)

| Metric | Target | Measurement Method |
|--------|--------|--------------------|
| [Metric 1] | [Target value] | [How to measure] |
| [Metric 2] | [Target value] | [How to measure] |

### Growth Success (v1.x)

| Metric | Target | Measurement Method |
|--------|--------|--------------------|
| [Metric 1] | [Target value] | [How to measure] |

---

## User Personas

<!-- TODO(RESEARCH): Validate personas with user interviews
- Schedule 3-5 interviews per persona
- Validate pain points and goals
- Update based on findings
-->

### Persona 1: {{persona_name}}

| Attribute | Description |
|-----------|-------------|
| **Who** | [Who is this user] |
| **Goals** | [What they want to achieve] |
| **Pain Points** | [Current problems they face] |
| **Context** | [When/where they use the product] |
| **Key Requirements** | FR-001, FR-002, FR-010 |

<!-- TODO(EXPAND): Add persona details
- Demographics
- Technical proficiency
- Frequency of use
-->

### Persona 2: {{persona_name}}

| Attribute | Description |
|-----------|-------------|
| **Who** | [Who is this user] |
| **Goals** | [What they want to achieve] |
| **Pain Points** | [Current problems they face] |
| **Context** | [When/where they use the product] |
| **Key Requirements** | FR-003, FR-004 |

<!-- TODO(DECISION): Do we need more personas?
- Admin user?
- Support staff?
- Discuss with stakeholders
-->

---

## User Journeys

<!-- TODO(DIAGRAM): Add journey diagrams
- Use Mermaid or draw.io
- Show decision points
- Mark pain points
-->

### Journey 1: {{journey_name}}

**Persona:** {{persona}}
**Goal:** {{what user wants to accomplish}}

```
Step 1: [User action]
Step 2: [System response]
Step 3: [User action]
Step 4: [System response]
Step 5: [Success state]
```

**Requirements Covered:** FR-001, FR-002
**Success Metric:** [How to measure success]

<!-- TODO(EXPAND): Add error scenarios
- What if step 2 fails?
- What if user abandons at step 3?
-->

### Journey 2: {{journey_name}}

**Persona:** {{persona}}
**Goal:** {{what user wants to accomplish}}

```
[Journey steps...]
```

**Requirements Covered:** FR-003, FR-004

<!-- TODO(EXAMPLE): Add real-world scenario
Describe a specific use case with real data
-->

---

## Product Scope

### MVP - Minimum Viable Product

**Timeline:** [Estimated duration]
**Goal:** [What MVP proves/validates]

| Feature | Priority | Description | Requirements |
|---------|----------|-------------|--------------|
| [Feature 1] | P0 | [Description] | FR-001, FR-002 |
| [Feature 2] | P0 | [Description] | FR-003 |
| [Feature 3] | P0 | [Description] | FR-004, FR-005 |

### Growth Features (Post-MVP)

| Feature | Priority | Description | Depends On |
|---------|----------|-------------|------------|
| [Feature 4] | P1 | [Description] | MVP |
| [Feature 5] | P1 | [Description] | Feature 4 |

### Vision (Future)

| Feature | Description | Why Not Now |
|---------|-------------|-------------|
| [Feature 6] | [Description] | [Reason] |

---

## Functional Requirements

### Domain 1: {{domain_name}}

#### FR-001: {{requirement_title}}

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 / P1 / P2 |
| **Scope** | MVP / Growth / Vision |
| **Source** | [Stakeholder / Document] |
| **Persona** | [Which persona] |
| **Journey** | [Which journey] |

**Description:**
[Detailed description of the requirement. Must be SMART: Specific, Measurable, Attainable, Relevant, Traceable]

**Acceptance Criteria:**

```gherkin
Given [precondition]
When [action]
Then [expected result]
And [additional verification]
```

**Edge Cases:**
- [Edge case 1]
- [Edge case 2]

**Out of Scope:**
- [What this requirement does NOT include]

---

#### FR-002: {{requirement_title}}

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 / P1 / P2 |
| **Scope** | MVP / Growth / Vision |

**Description:**
[Detailed description]

**Acceptance Criteria:**

```gherkin
Given [precondition]
When [action]
Then [expected result]
```

---

### Domain 2: {{domain_name}}

#### FR-010: {{requirement_title}}

[Same structure as above...]

---

## Non-Functional Requirements

<!-- TODO(NUMBERS): Add specific metrics for all NFRs
- Response times (p50, p95, p99)
- Throughput targets
- Availability SLA
- Data retention periods
-->

<!-- TODO(REVIEW): Review NFRs with architect
- Feasibility check
- Cost implications
- Trade-offs
-->

### Performance

#### NFR-001: {{requirement_title}}

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 / P1 / P2 |
| **Category** | Response Time / Throughput / Latency |

**Metric:** [Specific measurable target, e.g., "95th percentile response time < 200ms"]
**Measurement:** [How to verify, e.g., "Load testing with 1000 concurrent users"]
**Rationale:** [Why this target]

<!-- TODO(NUMBERS): Define specific performance targets
- API response time targets
- Expected concurrent users
- Peak load scenarios
-->

---

### Security

#### NFR-010: {{requirement_title}}

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 / P1 / P2 |
| **Category** | Authentication / Authorization / Data Protection / Compliance |

**Requirement:** [Specific security requirement]
**Compliance:** [Standards: GDPR, PCI-DSS, SOC2, etc.]
**Verification:** [How to verify compliance]

---

### Scalability

#### NFR-020: {{requirement_title}}

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 / P1 / P2 |
| **Category** | Horizontal / Vertical / Data Volume |

**Target:** [Specific scalability target]
**Growth Projection:** [Expected growth over time]
**Approach:** [How scalability will be achieved]

---

### Reliability

#### NFR-030: {{requirement_title}}

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 / P1 / P2 |
| **Category** | Availability / Durability / Recovery |

**Target:** [SLA / Uptime target, e.g., "99.9% availability"]
**RTO:** [Recovery Time Objective]
**RPO:** [Recovery Point Objective]

---

## Dependencies & Integrations

<!-- TODO(DEPENDENCY): Waiting for architecture.md
- Integration patterns to be defined
- API contracts to be specified
- Update this section after architecture review
-->

### External Systems

| System | Integration Type | Data Exchanged | Owner | Criticality |
|--------|-----------------|----------------|-------|-------------|
| [System 1] | API / Event / File | [Data description] | [Team] | Critical / Important |
| [System 2] | API / Event / File | [Data description] | [Team] | Critical / Important |

<!-- TODO(RESEARCH): Document external system APIs
- Get API documentation
- Check rate limits
- Identify authentication method
-->

### Third-Party Services

| Service | Purpose | Criticality | Fallback |
|---------|---------|-------------|----------|
| [Service 1] | [Why needed] | Critical / Important | [Fallback plan] |

<!-- TODO(DECISION): Select third-party providers
- Payment: Stripe vs Adyen vs LiqPay
- Email: SendGrid vs Mailgun
- Evaluate and document decision
-->

### Internal Dependencies

| Dependency | Description | Status |
|------------|-------------|--------|
| [Module/Service] | [What's needed] | Available / In Progress / Planned |

<!-- TODO(LINK): Add links to dependent PRDs/docs -->

---

## Risks & Mitigations

| # | Risk | Impact | Probability | Mitigation | Owner |
|---|------|--------|-------------|------------|-------|
| 1 | [Risk description] | High/Med/Low | High/Med/Low | [Mitigation strategy] | [Person] |
| 2 | [Risk description] | High/Med/Low | High/Med/Low | [Mitigation strategy] | [Person] |

---

## Constraints

### Technical Constraints
- [Constraint 1: e.g., Must use existing PostgreSQL database]
- [Constraint 2: e.g., Must integrate with legacy authentication system]

### Business Constraints
- [Constraint 1: e.g., Budget limited to $X]
- [Constraint 2: e.g., Must comply with regulation Y]

### Timeline Constraints
- [Constraint 1: e.g., Must launch before Q2 2024]
- [Constraint 2: e.g., Key milestone by date X]

---

## Open Questions

| # | Question | Owner | Due Date | Status | Resolution |
|---|----------|-------|----------|--------|------------|
| 1 | [Question needing decision] | [Person] | [Date] | Open/Resolved | [Answer if resolved] |
| 2 | [Question needing decision] | [Person] | [Date] | Open/Resolved | [Answer if resolved] |

---

## Assumptions

| # | Assumption | Risk if Wrong | Validation Plan |
|---|------------|---------------|-----------------|
| 1 | [Assumption made] | [Impact if incorrect] | [How to validate] |
| 2 | [Assumption made] | [Impact if incorrect] | [How to validate] |

---

## Glossary

| Term | Definition |
|------|------------|
| [Term 1] | [Definition] |
| [Term 2] | [Definition] |

---

## Requirements Traceability Matrix

| Requirement | Source | User Journey | Epic | Story | Status |
|-------------|--------|--------------|------|-------|--------|
| FR-001 | requirements.md | Journey 1 | E01 | S01-01 | Defined |
| FR-002 | requirements.md | Journey 1 | E01 | S01-02 | Defined |
| NFR-001 | requirements.md | - | - | - | Defined |

---

## Appendix

### References
- [Link to requirements document]
- [Link to research findings]
- [Link to competitive analysis]

### Related Documents
- Architecture Document: `docs/architecture.md`
- Coding Standards: `docs/coding-standards/`

---

## Changelog

<!-- UPDATE AT END OF SESSION: Summarize all changes in one entry -->

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | {{date}} | @{{user_name}} | Initial draft |

<!-- 
Changelog Guidelines:
- Update at END of work session (not on every small change)
- Summarize all changes in one entry
- Be specific but concise
- Version: 0.x=draft, 1.0=approved, 1.x=updates, 2.0=major revision

Example session entry:
| 1.2 | 2024-01-20 | @pm | Add FR-021 to FR-025; Update success metrics; Clarify MVP scope |
-->
