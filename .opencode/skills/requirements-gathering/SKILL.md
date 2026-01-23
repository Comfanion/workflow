---
name: requirements-gathering
description: How to conduct stakeholder interviews and extract functional/non-functional requirements
license: MIT
compatibility: opencode
metadata:
  domain: business-analysis
  artifacts: docs/requirements/requirements.md
---

# Requirements Gathering Skill

## When to Use

Use this skill when you need to:
- Gather requirements from stakeholders
- Document functional and non-functional requirements
- Create the foundation for PRD

## Template

Use template at: `@.opencode/templates/requirements-template.md`

## Requirements Document Structure (v2)

### 1. Header

```yaml
id: REQ-001
version: 1.0
status: draft | approved
date: {{date}}
author: {{author}}
```

### 2. Summary

Brief prose explaining:
- What problem is being solved
- Who the primary users are
- Key outcomes expected

### 3. Stakeholders

| Role | Representative | Interest | Influence |
|------|---------------|----------|-----------|
| Product Owner | Name | Feature delivery | High |
| End Users | Segment | Daily usage | High |

### 4. Functional Requirements

**Grouped by domain:**

```markdown
### Task Management

Core task lifecycle operations.

| ID | Requirement | Priority | Source |
|----|-------------|----------|--------|
| FR-001 | User can create task | P0 | Team Lead |

**Business Rules:**
- One task = one assignee

**Notes:**
- Notifications in separate domain
```

### 5. Non-Functional Requirements

Separate tables by category:
- Performance (with metrics)
- Security
- Scalability

### 6. Constraints

| Type | Constraint | Impact |
|------|------------|--------|
| Technical | Must use existing auth | Limits options |
| Timeline | MVP in 3 months | Scope pressure |

### 7. Assumptions

| # | Assumption | Risk if Wrong | Validation |
|---|------------|---------------|------------|
| 1 | Users have modern browsers | IE support needed | Analytics |

### 8. Dependencies

| Dependency | Type | Owner | Status | Risk |
|------------|------|-------|--------|------|
| Auth service | Technical | Platform team | Available | Low |

### 9. Open Questions

| # | Question | Owner | Due | Status |
|---|----------|-------|-----|--------|
| 1 | Max file size? | PM | Jan 30 | Open |

### 10. Glossary

| Term | Definition |
|------|------------|
| Task | Unit of work assigned to user |

### 11. References

```markdown
→ PRD: `docs/prd.md`
→ Stakeholder Interviews: `docs/interviews/`
```

## Reference Format

Use `→` for all references:
```markdown
→ PRD: `docs/prd.md`
→ FR: `FR-001`
```

## Requirement Writing Rules

### Good Requirements

| Rule | Good | Bad |
|------|------|-----|
| Atomic | User can create task | User can create and edit task |
| Measurable | Load in < 2s | Load quickly |
| Testable | Title max 200 chars | Title reasonable length |
| Unambiguous | Required field | Important field |

### Requirement IDs

- Functional: `FR-001`, `FR-002`, ...
- Non-Functional: `NFR-001`, `NFR-002`, ...

### Priority

| Level | Meaning | Scope |
|-------|---------|-------|
| P0 | Must have | MVP |
| P1 | Should have | Growth |
| P2 | Nice to have | Vision |

## Interview Questions

### Functional Discovery

1. What do you need to accomplish?
2. What information do you need to see?
3. What actions do you need to take?
4. What happens when X fails?

### NFR Discovery

1. How many users concurrently?
2. What response time is acceptable?
3. What's the data retention policy?
4. What security standards apply?

## Validation Checklist

- [ ] All stakeholders identified
- [ ] Requirements grouped by domain
- [ ] Each requirement is atomic and testable
- [ ] NFRs have measurable metrics
- [ ] Constraints documented
- [ ] Assumptions validated
- [ ] Dependencies identified with owners
- [ ] Uses `→` reference format

## Output

Save to: `docs/requirements/requirements.md`

## Related Skills

- `prd-writing` - Uses requirements as input
- `requirements-validation` - Validates requirements
- `acceptance-criteria` - For testable AC
