# Story Validation Checklist

Use this checklist to validate stories before marking them "ready-for-dev".

## Story Structure

### Required Sections
- [ ] Story ID and Epic reference
- [ ] Status clearly indicated
- [ ] Priority and Estimate assigned
- [ ] User Story format (As a... I want... So that...)
- [ ] Acceptance Criteria (Given/When/Then)
- [ ] Tasks/Subtasks defined
- [ ] Dev Notes section
- [ ] Definition of Done

### Metadata
- [ ] Created date
- [ ] Last updated date

## User Story Quality

### Format
- [ ] Follows "As a [persona], I want [capability], So that [benefit]"
- [ ] Persona is valid (from PRD)
- [ ] Capability is specific and actionable
- [ ] Benefit is clear and valuable

### Scope
- [ ] Story is right-sized (1-3 days of work)
- [ ] Not too large (split if needed)
- [ ] Not too small (merge if needed)
- [ ] Single focus - does one thing well

## Acceptance Criteria Quality

### Format
- [ ] Uses Given/When/Then format
- [ ] Each AC is independent
- [ ] Each AC is testable

### Coverage
- [ ] Happy path covered
- [ ] Error scenarios covered
- [ ] Edge cases considered
- [ ] Validation rules clear

### Testability
- [ ] Can write automated test for each AC
- [ ] Expected outcomes are specific
- [ ] No ambiguous terms

## Tasks/Subtasks Quality

### Structure
- [ ] Tasks are in logical order
- [ ] Each task is atomic (single action)
- [ ] Subtasks break down complex tasks
- [ ] Red-green-refactor cycle applicable

### Completeness
- [ ] Implementation tasks present
- [ ] Test writing tasks present
- [ ] Documentation tasks (if needed)
- [ ] Integration tasks (if needed)

### Clarity
- [ ] Each task is actionable
- [ ] File paths indicated where relevant
- [ ] Dependencies between tasks clear

## Dev Notes Quality

### Context Provided
- [ ] Architecture requirements noted
- [ ] Related files/modules listed
- [ ] Patterns to follow specified
- [ ] Previous learnings documented

### Technical Guidance
- [ ] API/Interface definitions clear
- [ ] Data model considerations noted
- [ ] Integration points identified
- [ ] Test scenarios suggested

## Traceability

### Backward Tracing
- [ ] Maps to Epic
- [ ] Maps to FR(s) from PRD
- [ ] Maps to user journey

### Forward Tracing
- [ ] Can map to implementation files
- [ ] Can map to test files

## Definition of Done

### Standard DoD Items
- [ ] All AC implemented and verified
- [ ] All tasks/subtasks complete
- [ ] Unit tests written and passing
- [ ] Integration tests (if required)
- [ ] Code follows CLAUDE.md patterns
- [ ] Code reviewed
- [ ] No linting errors
- [ ] Documentation updated
- [ ] PR merged

## Dependencies

- [ ] Dependencies on other stories identified
- [ ] External dependencies noted
- [ ] Blockers documented (if any)

## Validation Summary

| Category | Pass | Fail | Notes |
|----------|------|------|-------|
| Story Structure | | | |
| User Story Quality | | | |
| AC Quality | | | |
| Tasks Quality | | | |
| Dev Notes | | | |
| Traceability | | | |
| DoD | | | |

**Status:** READY-FOR-DEV / NEEDS REVISION

**Issues Found:**
1. [Issue if any]
2. [Issue if any]

**Ready for Dev:** YES / NO

**Validated By:** {{user_name}}
**Date:** {{date}}
