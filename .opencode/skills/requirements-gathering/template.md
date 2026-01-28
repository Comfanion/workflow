# {{project}} — Requirements

```yaml
id: REQ-001
version: 1.0
status: draft | approved
date: {{date}}
author: {{author}}
```

---

## Summary

{{project}} addresses the need for {{problem_being_solved}}. The primary users are {{target_users}} who need to {{what_they_need_to_accomplish}}.

**Key Outcomes:**
- {{outcome_1}}
- {{outcome_2}}

<!-- e.g.
TaskFlow addresses the need for lightweight task management for small remote teams. The primary users are team leads and developers who need to coordinate daily work without heavy project management overhead.

**Key Outcomes:**
- Reduce time spent on task coordination by 50%
- Provide visibility into team workload
-->

---

## Stakeholders

| Role | Representative | Interest | Influence |
|------|---------------|----------|-----------|
| {{role}} | {{name}} | {{what_they_care_about}} | High/Med/Low |

---

## Functional Requirements

> **Traceability:** Each FR tracks Module, Unit, Architecture section, Epic, and Status.
> **Maintained by:** 
> - @analyst — Gathers requirements from stakeholders (fills ID, Requirement, Priority, Source)
> - @architect — Fills Module, Doc Section, Arch § after architecture design
> - @pm — Fills Epic after epic creation
> - @dev — Updates Status during implementation

> **Workflow:**
> 1. @analyst creates requirements.md with FR/NFR (Module/Arch § empty)
> 2. @architect designs architecture.md, updates requirements.md (fills Module, Arch §)
> 3. @pm creates epics, updates requirements.md (fills Epic column)
> 4. @dev implements stories, updates requirements.md (Status: ⬜ → ✅)

### {{Domain_1}}: {{domain_name}}

{{brief_context_for_this_group_of_requirements}}

| ID | Requirement | Priority | Source | Module | Doc Section | Arch § | Epic | Status |
|----|-------------|----------|--------|--------|-------------|--------|------|--------|
| FR-001 | {{user_can_action}} | P0 | {{stakeholder}} | {{module}} | → Unit: `{{name}}` | §{{N}} | → Epic: `{{file}}` | ⬜ |
| FR-002 | {{user_can_action}} | P0 | {{stakeholder}} | {{module}} | → Unit: `{{name}}` | §{{N}} | → Epic: `{{file}}` | ⬜ |
| FR-003 | {{system_does_action}} | P1 | {{stakeholder}} | {{module}} | → Unit: `{{name}}` | §{{N}} | → Epic: `{{file}}` | ⬜ |

<!-- Example:
| FR-001 | User can create task with title, description, due date | P0 | Team Lead | Task | → Unit: `Task` | §3.1 | → Epic: `epic-01-task-crud.md` | ✅ |
| FR-002 | User can assign task to team member | P0 | Team Lead | Task | → Unit: `Task` | §3.1 | → Epic: `epic-01-task-crud.md` | ⬜ |
| FR-003 | System sends notification on assignment | P1 | Team Lead | Notification | → Service: `NotificationService` | §3.3 | → Epic: `epic-03-notifications.md` | ⬜ |
-->

**Business Rules:**
- {{rule}}

**Notes:**
- {{clarification}}

<!-- e.g.
### Task Management

Core task lifecycle operations that all users need.

| ID | Requirement | Priority | Source |
|----|-------------|----------|--------|
| FR-001 | User can create task with title (required) and description (optional) | P0 | Team Lead |
| FR-002 | User can assign task to team member | P0 | Team Lead |
| FR-003 | System validates title is not empty and under 200 chars | P0 | Tech Lead |

**Business Rules:**
- Task can have only one assignee at a time
- Title is required, description is optional

**Notes:**
- Assignment notifications handled in FR-010 (Notifications domain)
-->

### {{Domain_2}}: {{domain_name}}

{{brief_context}}

| ID | Requirement | Priority | Source | Module | Doc Section | Arch § | Epic | Status |
|----|-------------|----------|--------|--------|-------------|--------|------|--------|
| FR-010 | {{requirement}} | P1 | {{stakeholder}} | {{module}} | → Unit: `{{name}}` | §{{N}} | → Epic: `{{file}}` | ⬜ |

---

## Non-Functional Requirements

> **Traceability:** NFRs also track Module (if specific), Architecture section, and Status.

### Performance

| ID | Requirement | Metric | Priority | Module | Arch § | Status |
|----|-------------|--------|----------|--------|--------|--------|
| NFR-001 | {{what}} | {{measurable_target}} | P0 | {{module}} | §{{N}} | ⬜ |

<!-- Example:
| NFR-001 | API response time < 200ms (p95) | p95 < 200ms | P0 | — | §5 Performance | ⬜ |
| NFR-002 | Task data encrypted at rest | AES-256 | P0 | Task | §4 Security | ⬜ |
-->

### Security

| ID | Requirement | Standard/Approach | Priority | Module | Arch § | Status |
|----|-------------|-------------------|----------|--------|--------|--------|
| NFR-010 | {{what}} | {{how}} | P0 | {{module}} | §{{N}} | ⬜ |

### Scalability

| ID | Requirement | Target | Priority | Module | Arch § | Status |
|----|-------------|--------|----------|--------|--------|--------|
| NFR-020 | {{what}} | {{number}} | P1 | {{module}} | §{{N}} | ⬜ |

---

## AI-Specific Requirements (Optional)

> **Note:** Only for AI/ML/RAG systems. Skip for traditional applications.

### AI Quality Metrics

| ID | Metric | Target | Measurement Method | Priority | Arch § | Status |
|----|--------|--------|-------------------|----------|--------|--------|
| AI-001 | Accuracy | {{target_percentage}} | {{how_to_measure}} | P0 | §{{N}} | ⬜ |
| AI-002 | Hallucination Rate | < {{threshold}}% | {{validation_method}} | P0 | §{{N}} | ⬜ |
| AI-003 | Response Latency | < {{time}}s (p95) | {{monitoring_tool}} | P1 | §{{N}} | ⬜ |

<!-- Example for RAG system:
| AI-001 | Accuracy | 85% on gold dataset | 100 Q&A pairs validated by experts | P0 | §6 AI Quality | ⬜ |
| AI-002 | Hallucination Rate | < 5% | Manual review + TruLens framework | P0 | §6 AI Quality | ⬜ |
| AI-003 | Response Latency | < 3s (p95) | APM monitoring (Datadog) | P1 | §5 Performance | ⬜ |
-->

### System Boundaries

**In Scope:**
- {{what_system_should_answer}}
- {{capability_2}}

**Out of Scope:**
- {{what_system_should_NOT_answer}} — {{reason}}
- {{limitation_2}} — {{reason}}

<!-- Example:
**In Scope:**
- Answer questions about product documentation
- Provide code examples from official docs
- Cite sources for every answer

**Out of Scope:**
- Answer questions outside documentation scope — "I don't have information about that"
- Generate code not present in docs — "I can only show examples from our docs"
- Provide opinions or recommendations — Stick to factual information
-->

### Feedback Mechanisms

| ID | Mechanism | Purpose | Priority | Status |
|----|-----------|---------|----------|--------|
| FB-001 | {{feedback_type}} | {{why_needed}} | P0 | ⬜ |

<!-- Example:
| FB-001 | Thumbs up/down on answers | Track satisfaction, identify problem areas | P0 | ⬜ |
| FB-002 | "Report incorrect answer" button | Flag hallucinations for manual review | P0 | ⬜ |
| FB-003 | Copy answer to clipboard | Track which answers are most useful | P2 | ⬜ |
-->

---

## Constraints

| Type | Constraint | Impact |
|------|------------|--------|
| Technical | {{constraint}} | {{how_it_affects_solution}} |
| Business | {{constraint}} | {{how_it_affects_solution}} |
| Timeline | {{constraint}} | {{what_must_be_true}} |

---

## Assumptions

| # | Assumption | Risk if Wrong | Validation |
|---|------------|---------------|------------|
| 1 | {{assumption}} | {{impact}} | {{how_to_verify}} |

---

## Dependencies

| Dependency | Type | Owner | Status | Risk |
|------------|------|-------|--------|------|
| {{system_or_team}} | {{technical/organizational}} | {{who}} | {{status}} | H/M/L |

---

## Open Questions

| # | Question | Owner | Due | Status |
|---|----------|-------|-----|--------|
| 1 | {{question}} | {{name}} | {{date}} | Open |

**Resolved Questions:**
- Q: {{question}} — A: {{answer}}

---

## Glossary

| Term | Definition |
|------|------------|
| {{term}} | {{definition}} |

---

## References

→ PRD: `{{path}}`
→ Stakeholder Interviews: `{{path}}`
