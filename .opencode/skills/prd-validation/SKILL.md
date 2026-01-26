---
name: prd-validation
description: Use when validating PRD for completeness, requirements coverage, and QA artifacts
license: MIT
compatibility: opencode
metadata:
  domain: quality-assurance
  artifacts: docs/validation/prd-validation-*.md
---

# PRD Validation Skill

## When to Use

Use this skill when you need to:
- Validate PRD before creating architecture
- Ensure all requirements are covered
- Check QA artifact (prd-acceptance-criteria.md) exists

## Prerequisites

- Requirements validation must PASS first
- File: `docs/requirements/requirements.md`

## Validation Checklist

### Structure Checks

- [ ] File exists at `docs/prd.md`
- [ ] Executive Summary section exists
- [ ] Project Classification section exists
- [ ] Success Criteria section exists
- [ ] Product Scope section exists (MVP/Growth/Vision)
- [ ] Functional Requirements section exists
- [ ] Non-Functional Requirements section exists
- [ ] Dependencies section exists
- [ ] Risks section exists

### Requirements Coverage

- [ ] All FRs from requirements.md are addressed
- [ ] All NFRs from requirements.md are addressed
- [ ] No orphan requirements (in PRD but not in requirements.md)
- [ ] FR IDs match between documents

### Quality Checks

- [ ] Executive summary explains the "why"
- [ ] Success criteria are measurable
- [ ] Scope boundaries are clear
- [ ] MVP is minimal but viable
- [ ] Growth features depend on MVP
- [ ] Priorities are consistent with requirements.md

### QA Artifact Check (MANDATORY)

- [ ] File exists: `docs/prd-acceptance-criteria.md`
- [ ] All FRs have acceptance criteria defined
- [ ] AC uses Given/When/Then format
- [ ] Coverage matrix is complete

### Traceability Check

For each FR in PRD:
- [ ] Maps to requirement in requirements.md
- [ ] Has clear scope (MVP/Growth/Vision)
- [ ] Has priority (P0/P1/P2)

## Validation Report Format

```markdown
# PRD Validation Report

**Date:** YYYY-MM-DD
**Status:** PASS | WARN | FAIL
**File:** docs/prd.md

## Prerequisites

| Prerequisite | Status |
|--------------|--------|
| requirements.md validated | ✅ PASS |

## Summary

| Check Type | Total | Passed | Warnings | Failed |
|------------|-------|--------|----------|--------|
| Structure | 9 | 9 | 0 | 0 |
| Coverage | 3 | 3 | 0 | 0 |
| Quality | 6 | 5 | 1 | 0 |
| QA Artifact | 4 | 4 | 0 | 0 |

## QA Artifact Status

| Artifact | Status |
|----------|--------|
| `docs/prd-acceptance-criteria.md` | ✅ Present |
| FR Coverage | 100% (45/45) |
| AC Format | Given/When/Then ✅ |

## Requirements Coverage

| Source | Total | Covered | Missing |
|--------|-------|---------|---------|
| Functional (FR) | 45 | 45 | 0 |
| Non-Functional (NFR) | 12 | 12 | 0 |

## Passed Checks

- [x] All FRs from requirements.md covered
- [x] All NFRs from requirements.md covered
- [x] QA artifact present

## Warnings

- [ ] Success criteria for Growth phase could be more specific

## Failures

(None if PASS)

## Recommendations

1. Add specific metrics to Growth success criteria

## Next Steps

After fixing issues:
- Re-run validation
- If PASS, proceed to architecture design
```

## If QA Artifact Missing

```markdown
## FAILURE: QA Artifact Missing

**Required:** `docs/prd-acceptance-criteria.md`
**Status:** ❌ NOT FOUND

### Action Required

Create the QA artifact using template:
`@.opencode/skills/acceptance-criteria/template.md`

This artifact is MANDATORY before proceeding to architecture.

### What It Should Contain

1. Acceptance criteria for ALL FRs
2. Given/When/Then format
3. Edge cases and negative tests
4. NFR test methods
5. Coverage matrix
```

## Output

Save to: `docs/validation/prd-validation-YYYY-MM-DD.md`

## Related Skills

- `prd-writing` - For fixing PRD issues
- `acceptance-criteria` - For writing AC in QA artifact
