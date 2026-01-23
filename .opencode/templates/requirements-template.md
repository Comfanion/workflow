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

### {{Domain_1}}: {{domain_name}}

{{brief_context_for_this_group_of_requirements}}

| ID | Requirement | Priority | Source |
|----|-------------|----------|--------|
| FR-001 | {{user_can_action}} | P0 | {{stakeholder}} |
| FR-002 | {{user_can_action}} | P0 | {{stakeholder}} |
| FR-003 | {{system_does_action}} | P1 | {{stakeholder}} |

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

| ID | Requirement | Priority | Source |
|----|-------------|----------|--------|
| FR-010 | {{requirement}} | P1 | {{stakeholder}} |

---

## Non-Functional Requirements

### Performance

| ID | Requirement | Metric | Priority |
|----|-------------|--------|----------|
| NFR-001 | {{what}} | {{measurable_target}} | P0 |

### Security

| ID | Requirement | Standard/Approach | Priority |
|----|-------------|-------------------|----------|
| NFR-010 | {{what}} | {{how}} | P0 |

### Scalability

| ID | Requirement | Target | Priority |
|----|-------------|--------|----------|
| NFR-020 | {{what}} | {{number}} | P1 |

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
