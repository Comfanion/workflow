# Code Review Checklist

Use this checklist when reviewing implemented code before marking story as "done".

## Acceptance Criteria Verification

### Each AC from Story
- [ ] AC1: Implementation satisfies criterion
- [ ] AC2: Implementation satisfies criterion
- [ ] AC3: Implementation satisfies criterion
- [ ] [Add more as needed]

### Edge Cases
- [ ] Error scenarios handled
- [ ] Boundary conditions tested
- [ ] Invalid input rejected appropriately

## Code Quality

### Architecture Compliance
- [ ] Follows hexagonal architecture
- [ ] Domain layer has no infrastructure imports
- [ ] Use cases have 4 files (inport, dto, handler, mappers)
- [ ] Explicit mapping (no reflection libraries)
- [ ] Dependencies flow correctly (infra → app → domain)

### Code Structure
- [ ] Single responsibility principle followed
- [ ] Functions are focused and small (<50 lines)
- [ ] No code duplication
- [ ] Clear naming conventions
- [ ] Appropriate abstractions used

### Error Handling
- [ ] Errors are wrapped with context
- [ ] Domain errors vs infrastructure errors distinguished
- [ ] Error messages are descriptive
- [ ] No swallowed/ignored errors
- [ ] Errors propagated appropriately

### Comments & Documentation
- [ ] Complex logic is documented
- [ ] Public APIs have doc comments
- [ ] No commented-out code
- [ ] Self-documenting code where possible

## Testing

### Test Coverage
- [ ] Unit tests for all new functions
- [ ] Integration tests for component interactions
- [ ] Edge cases tested
- [ ] Error scenarios tested
- [ ] Coverage meets requirements (80%+ for domain)

### Test Quality
- [ ] Tests are independent
- [ ] Clear test names (TestX_Y_Z pattern)
- [ ] Arrange-Act-Assert structure
- [ ] No test interdependencies
- [ ] Mocks used appropriately

### Test Execution
- [ ] All tests pass locally
- [ ] No flaky tests introduced
- [ ] Reasonable execution time

## Security

### Input Validation
- [ ] All user input validated
- [ ] SQL injection prevented
- [ ] XSS prevented (if applicable)

### Authentication/Authorization
- [ ] Auth checks present where needed
- [ ] No unauthorized access possible
- [ ] Sensitive operations protected

### Data Protection
- [ ] No hardcoded secrets
- [ ] Sensitive data not logged
- [ ] PII handled correctly

## Performance

### Efficiency
- [ ] No N+1 query issues
- [ ] Appropriate caching used
- [ ] No obvious bottlenecks
- [ ] Database queries optimized

### Resource Usage
- [ ] No memory leaks
- [ ] Connections properly closed
- [ ] Resources cleaned up

## CLAUDE.md Compliance

- [ ] Import order correct (stdlib, external, internal)
- [ ] Naming conventions followed
- [ ] Context passed as first parameter
- [ ] Value objects used for domain concepts
- [ ] Error patterns followed

## Story File Updates

- [ ] All tasks marked complete [x]
- [ ] File List updated with all changes
- [ ] Change Log updated
- [ ] Dev Agent Record has notes
- [ ] Status set to "review"

## Review Decision

### Severity Classification

| Issue | Severity | Description |
|-------|----------|-------------|
| | High | Security, correctness, data loss - must fix |
| | Medium | Code quality, maintainability - should fix |
| | Low | Style, minor improvements - nice to fix |

### Issues Found

| # | Severity | File:Line | Issue | Suggestion |
|---|----------|-----------|-------|------------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

## Review Outcome

- [ ] **APPROVE** - Ready to merge, all criteria met
- [ ] **CHANGES REQUESTED** - Issues need addressing (see above)
- [ ] **BLOCKED** - Major issues prevent approval

### Summary

**Strengths:**
- [What was done well]

**Areas for Improvement:**
- [What needs work]

**Action Items:**
1. [If changes requested]
2. [If changes requested]

**Reviewed By:** {{user_name}}
**Date:** {{date}}
