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
- Conduct stakeholder interviews
- Extract functional requirements (FR)
- Extract non-functional requirements (NFR)
- Discover hidden requirements through questions

## Interview Technique

### Phase 1: Context Discovery

Ask these questions first:
1. What problem are we solving?
2. Who are the users/stakeholders?
3. What existing systems does this integrate with?
4. What's the timeline and budget?
5. What happens if we don't build this?

### Phase 2: Functional Discovery

For each user type:
1. What actions should they be able to perform?
2. What are the main workflows?
3. What data do they need to see/edit?
4. What are the edge cases?
5. What errors might occur?

### Phase 3: Quality Attributes (NFR)

Ask about:
- **Performance**: Expected response times? Concurrent users?
- **Security**: Authentication? Data sensitivity? Compliance?
- **Scalability**: Data volume growth? User growth?
- **Reliability**: Uptime requirements? Recovery time?
- **Usability**: User expertise level? Accessibility?

### Phase 4: Constraints & Assumptions

Document:
- Technical constraints (existing systems, languages, platforms)
- Business constraints (budget, timeline, regulations)
- Assumptions being made

## Output Format

### Functional Requirements

```markdown
### FR-001: [Requirement Title]

**Priority:** P0 | P1 | P2
**Source:** [Stakeholder / Document / Interview]
**Category:** [Domain area]

**Description:**
[Clear, unambiguous description of what the system must do]

**Acceptance Criteria:**
- [ ] [Testable criterion 1]
- [ ] [Testable criterion 2]

**Dependencies:** [FR-XXX, NFR-XXX]
**Notes:** [Additional context]
```

### Non-Functional Requirements

```markdown
### NFR-001: [Requirement Title]

**Priority:** P0 | P1 | P2
**Category:** Performance | Security | Scalability | Reliability | Usability

**Requirement:**
[Specific, measurable requirement]

**Metric:** [How to measure]
**Target:** [Specific target value]

**Verification Method:** [How to verify compliance]
```

## Requirement Quality Checklist

Each requirement must be:
- [ ] **Specific** - Clear, unambiguous
- [ ] **Measurable** - Has acceptance criteria or metrics
- [ ] **Achievable** - Technically feasible
- [ ] **Relevant** - Tied to business value
- [ ] **Traceable** - Has unique ID and source

## Common Anti-patterns to Avoid

1. **Vague language**: "The system should be fast" → "API response < 200ms p95"
2. **Missing metrics**: "High availability" → "99.9% uptime"
3. **Solution masquerading as requirement**: "Use Redis" → "Cache frequently accessed data"
4. **Missing acceptance criteria**: Always include testable criteria

## Discovery Questions Bank

### For Hidden Requirements
- "What would make this a failure even if it works correctly?"
- "Who else needs to be involved that we haven't talked to?"
- "What reports or dashboards do you need?"
- "How do you handle this process today?"

### For Prioritization
- "If you could only have 3 features, which would they be?"
- "What's the minimum needed to go live?"
- "What's the cost of NOT having this feature?"

## Output

Save to: `docs/requirements/requirements.md`

## Related Skills

- `prd-writing` - For turning requirements into PRD
- `requirements-validation` - For validating requirements
