---
name: requirements-validation
description: Use when validating requirements for completeness, clarity, and SMART criteria
license: MIT
compatibility: opencode
metadata:
  domain: quality-assurance
  artifacts: docs/validation/requirements-validation-*.md
---

# Requirements Validation Skill

## When to Use

Use this skill when you need to:
- Validate requirements.md before creating PRD
- Check for missing or conflicting requirements
- Ensure requirements meet SMART criteria

## Validation Checklist

### Structure Checks

- [ ] File exists at `docs/requirements/requirements.md`
- [ ] File is not empty
- [ ] Functional Requirements section exists
- [ ] Non-Functional Requirements section exists

### ID Checks

- [ ] All requirements have unique IDs
- [ ] FR IDs follow format: `FR-XXX` (e.g., FR-001)
- [ ] NFR IDs follow format: `NFR-XXX` (e.g., NFR-001)
- [ ] No duplicate IDs
- [ ] IDs are sequential (no gaps)

### Priority Checks

- [ ] All requirements have priorities
- [ ] Priorities use P0/P1/P2 format
- [ ] P0 requirements are truly critical

### Quality Checks (SMART)

For each requirement:
- [ ] **Specific** - Clear, unambiguous description
- [ ] **Measurable** - Has acceptance criteria or metrics
- [ ] **Achievable** - Technically feasible
- [ ] **Relevant** - Tied to business value
- [ ] **Traceable** - Has source documented

### FR-Specific Checks

- [ ] Each FR has acceptance criteria
- [ ] AC is testable (can be verified as pass/fail)
- [ ] No implementation details in requirements
- [ ] Dependencies are identified

### NFR-Specific Checks

- [ ] Each NFR has measurable metric
- [ ] Target values are specified
- [ ] Verification method is defined
- [ ] Categories are valid (Performance/Security/Scalability/Reliability)

### Language Checks

Scan for ambiguous language:
- [ ] No "should" without "must" clarification
- [ ] No "might", "could", "possibly"
- [ ] No "fast", "quick", "responsive" without metrics
- [ ] No "user-friendly" without specific criteria
- [ ] No "etc.", "and so on", "..."

### Conflict Checks

- [ ] No conflicting requirements
- [ ] No circular dependencies
- [ ] Priorities don't conflict with dependencies

## Validation Report Format

```markdown
# Requirements Validation Report

**Date:** YYYY-MM-DD
**Status:** PASS | WARN | FAIL
**File:** docs/requirements/requirements.md

## Summary

| Check Type | Total | Passed | Warnings | Failed |
|------------|-------|--------|----------|--------|
| Structure | 4 | 4 | 0 | 0 |
| IDs | 5 | 5 | 0 | 0 |
| Priorities | 3 | 3 | 0 | 0 |
| Quality | N | X | Y | Z |
| Language | 5 | 4 | 1 | 0 |

## Passed Checks

- [x] All requirements have unique IDs
- [x] All requirements have priorities

## Warnings

- [ ] FR-015: Acceptance criteria could be more specific
  - Current: "User can search products"
  - Suggestion: Add search criteria, expected results

## Failures

- [ ] FR-023: Missing acceptance criteria
  - Impact: Cannot verify implementation
  - Action: Add testable AC

- [ ] NFR-005: No measurable metric
  - Current: "System should be fast"
  - Action: Define response time target (e.g., < 200ms p95)

## Recommendations

1. Add AC to FR-023
2. Define metric for NFR-005
3. Clarify ambiguous terms in FR-015

## Next Steps

After fixing issues:
- Re-run `/validate requirements`
- If PASS, proceed to `/prd`
```

## Output

Save to: `docs/validation/requirements-validation-YYYY-MM-DD.md`

## Related Skills

- `requirements-gathering` - For fixing missing requirements
- `acceptance-criteria` - For writing better AC
