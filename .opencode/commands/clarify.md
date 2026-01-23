---
description: Structured clarification of requirements before creating PRD/Architecture
agent: requirements-analyst
---

# Clarify Command

## Purpose

Run **before** `/prd` or `/architecture` to reduce rework. Asks structured questions to uncover gaps, ambiguities, and missing details in requirements.

## Arguments
$ARGUMENTS

- Empty: Clarify requirements.md
- "[topic]": Focus clarification on specific topic
- "all": Comprehensive clarification

## Prerequisites

!`ls -la docs/requirements/requirements.md 2>/dev/null && echo "EXISTS" || echo "MISSING"`

If requirements.md doesn't exist:
→ "Run `/requirements` first to gather requirements."

## Load Requirements

@docs/requirements/requirements.md

## Clarification Process

### 1. Scan for Ambiguities

Look for:
- Vague terms ("should", "might", "could", "etc.")
- Missing quantities ("fast", "many", "several")
- Undefined actors ("users", "admins" - who exactly?)
- Missing edge cases
- Unclear priorities
- Undefined terms

### 2. Generate Structured Questions

Organize questions by category:

```markdown
## Clarification Questions

### Functional Gaps

1. **FR-003: User Authentication**
   - Q: What happens if login fails 3 times?
   - Q: Is there a password reset flow?
   - Q: What are the password requirements?

2. **FR-007: Data Export**
   - Q: What formats are required (CSV, JSON, Excel)?
   - Q: Is there a size limit?

### Non-Functional Gaps

1. **NFR-001: Performance**
   - Q: "Fast response" - what is acceptable latency? (p50, p95, p99)
   - Q: Under what load conditions?

2. **NFR-003: Availability**
   - Q: "High availability" - what is the target uptime? (99%, 99.9%, 99.99%)

### Edge Cases

1. What happens when [edge case]?
2. How should the system handle [error condition]?

### User Clarifications

1. "Users" - Is this end-users, admins, or both?
2. What are the user personas?

### Scope Clarifications

1. Is [feature] in scope for MVP?
2. What is explicitly out of scope?
```

### 3. Conduct Q&A Session

For each question:
1. Ask the user
2. Record the answer
3. Update requirements.md with clarification

### 4. Document Clarifications

Add a Clarifications section to requirements.md:

```markdown
## Clarifications

### Session: YYYY-MM-DD

**Q1: What happens if login fails 3 times?**
A: Account is locked for 15 minutes. User receives email notification.
→ Added to FR-003 acceptance criteria.

**Q2: What is acceptable response latency?**
A: < 200ms p95 for API calls, < 2s for page loads.
→ Updated NFR-001 with specific metrics.
```

## Output

After clarification:
1. Updated requirements.md with answers
2. Clarifications section added
3. Ambiguous terms resolved
4. Missing acceptance criteria added

## Validation

After clarification, verify:
- [ ] No vague language remains
- [ ] All quantities are specified
- [ ] Edge cases documented
- [ ] Actors clearly defined
- [ ] Priorities assigned
- [ ] Scope boundaries clear

## After Clarification

Suggest:
- `/validate requirements` - Validate completeness
- `/prd` - Create PRD with clarified requirements
