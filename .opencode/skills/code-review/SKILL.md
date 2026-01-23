# Code Review Skill

How to perform thorough code reviews for implemented stories.

## Purpose

Ensure code quality, correctness, and adherence to project standards before merging.

## Review Process

### 1. Preparation

```
1. Load the story file completely
2. Identify all acceptance criteria
3. Load CLAUDE.md for coding standards
4. Load project-context.md if exists
5. Review File List section for changed files
```

### 2. Acceptance Criteria Check

For each AC in the story:
- [ ] Verify implementation satisfies the criterion
- [ ] Check edge cases are handled
- [ ] Confirm error scenarios addressed

### 3. Code Quality Review

#### Architecture Compliance
- [ ] Follows hexagonal architecture
- [ ] Domain layer has no infrastructure imports
- [ ] Use cases have 4 files (inport, dto, handler, mappers)
- [ ] Explicit mapping (no reflection libraries)

#### Code Structure
- [ ] Single responsibility principle
- [ ] Clear naming conventions
- [ ] Appropriate abstractions
- [ ] No code duplication
- [ ] Functions are focused and small

#### Error Handling
- [ ] Errors are wrapped with context
- [ ] Domain errors vs infrastructure errors distinguished
- [ ] Error messages are descriptive
- [ ] No swallowed errors

#### Comments & Documentation
- [ ] Complex logic is documented
- [ ] Public APIs have doc comments
- [ ] No commented-out code
- [ ] README updated if needed

### 4. Testing Review

#### Test Coverage
- [ ] Unit tests exist for new code
- [ ] Integration tests for component interactions
- [ ] Edge cases tested
- [ ] Error scenarios tested

#### Test Quality
- [ ] Tests are independent
- [ ] Clear test names (TestX_Y_Z pattern)
- [ ] Arrange-Act-Assert structure
- [ ] No test interdependencies

#### Test Execution
- [ ] All tests pass locally
- [ ] No flaky tests
- [ ] Reasonable execution time

### 5. Security Review

- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] No SQL injection vulnerabilities
- [ ] Proper authentication checks
- [ ] Authorization verified

### 6. Performance Review

- [ ] No N+1 query issues
- [ ] Appropriate indexing considered
- [ ] Caching strategy where needed
- [ ] No obvious bottlenecks

## Review Outcomes

### ✅ Approve

All criteria met. Code is ready to merge.

```markdown
### Review Outcome: Approve

All acceptance criteria satisfied. Code follows project standards.
Ready for merge.
```

### 🔄 Changes Requested

Issues found that need addressing.

```markdown
### Review Outcome: Changes Requested

**Action Items:**
- [ ] [High] Fix missing error handling in X
- [ ] [Med] Add unit test for edge case Y
- [ ] [Low] Improve variable naming in Z
```

### ❌ Blocked

Major issues that prevent approval.

```markdown
### Review Outcome: Blocked

**Blocking Issues:**
1. Security vulnerability in authentication flow
2. Missing critical test coverage

Cannot proceed until blocking issues resolved.
```

## Severity Levels

| Level | Description | Must Fix Before Merge |
|-------|-------------|----------------------|
| High | Security, correctness, data loss | Yes |
| Medium | Code quality, maintainability | Recommended |
| Low | Style, minor improvements | Optional |

## Review Comments Format

```markdown
**[Severity]** File: path/to/file.go:42

Issue: Description of the issue

Suggestion: How to fix it

Example:
```go
// Instead of this
func foo() { ... }

// Do this
func foo() error { ... }
```
```

## Updating Story File

After review, add to story file:

```markdown
## Senior Developer Review (AI)

### Review Date
2024-01-15

### Review Outcome
Changes Requested

### Action Items
- [ ] [High] Add error handling to CreateUser handler
- [ ] [Med] Add unit test for duplicate email validation
- [ ] [Low] Rename 'x' to 'userCount'

### Detailed Comments
[Include detailed review comments here]
```

If changes requested, also add:

```markdown
### Review Follow-ups (AI)

- [ ] [AI-Review] [High] Add error handling to CreateUser handler
- [ ] [AI-Review] [Med] Add unit test for duplicate email validation
```

## Best Practices

1. **Be specific** - Point to exact file and line
2. **Suggest solutions** - Don't just criticize
3. **Prioritize** - Focus on important issues first
4. **Be constructive** - Phrase feedback positively
5. **Use different LLM** - For fresh perspective
