---
name: code-review
description: Use when reviewing code for security, correctness, and quality before merge
license: MIT
compatibility: opencode
metadata:
  domain: development
  agents: [reviewer, dev]
---

# Code Review Skill

How to perform thorough code reviews for implemented stories.

## Purpose

Ensure code quality, correctness, and adherence to project standards before merging.

---

<workflow name="code-review">

  <phase name="1-prepare" title="Preparation">
    <action>Read the story file completely</action>
    <action>Identify all acceptance criteria</action>
    <action>Load docs/coding-standards/*.md for coding standards</action>
    <action>Use search() to find similar patterns in codebase to compare against</action>
    <action>Use search() in docs for architecture requirements</action>
    <action>Review File List section for changed files</action>
  </phase>

  <phase name="2-security" title="Security Analysis (HIGH Priority)">
    <critical>Security issues are ALWAYS high priority</critical>
    <check>No hardcoded secrets, API keys, passwords</check>
    <check>All user inputs validated and sanitized</check>
    <check>Parameterized queries (no SQL injection)</check>
    <check>Auth required on protected endpoints</check>
    <check>Authorization checks before data access</check>
    <check>Sensitive data not logged</check>
    <check>Error messages don't leak internal details</check>
  </phase>

  <phase name="3-correctness" title="Correctness Analysis (HIGH Priority)">
    <check>All acceptance criteria satisfied</check>
    <check>Edge cases handled</check>
    <check>Error scenarios have proper handling</check>
    <check>No obvious logic errors</check>
    <check>No race conditions</check>
  </phase>

  <phase name="4-tests" title="Testing Review (HIGH Priority)">
    <check>Unit tests exist for new code</check>
    <check>Tests cover happy path and errors</check>
    <check>No flaky tests</check>
    <check>Test names are descriptive</check>
    <check>Run test suite: go test / npm test / pytest / cargo test</check>
    <check>If failures → include in review report as HIGH priority</check>
  </phase>

  <phase name="5-quality" title="Code Quality (MEDIUM Priority)">
    <check>Follows project architecture</check>
    <check>Clear naming conventions</check>
    <check>No code duplication</check>
    <check>Functions are focused and small</check>
    <check>Proper error wrapping</check>
    <check>No N+1 query issues</check>
    <check>Run linter: golangci-lint / eslint / ruff / cargo clippy</check>
  </phase>

  <phase name="6-write-file" title="Write Findings to Story File">
    <critical>MANDATORY: Append review to story file for history/analytics</critical>
    <step n="1">Read story file's ## Review section</step>
    <step n="2">Count existing ### Review #N blocks → your review is N+1</step>
    <step n="3">Append ### Review #N block with format below</step>
    <step n="4">NEVER overwrite previous reviews — always APPEND</step>
  </phase>

  <phase name="7-return-summary" title="Return Summary to Caller">
    <critical>Caller (@dev) uses YOUR output, not the file. Keep it actionable.</critical>
    <step n="1">Return SHORT summary: verdict + action items</step>
    <step n="2">Caller will use this directly without re-reading story file</step>
  </phase>

</workflow>

---

## Review Process

### 1. Preparation

```
1. Load the story file completely
2. Identify all acceptance criteria
3. Load docs/coding-standards/*.md for coding standards
5. Review File List section for changed files
```

### 2. Acceptance Criteria Check

For each AC in the story:
- [ ] Verify implementation satisfies the criterion
- [ ] Check edge cases are handled
- [ ] Confirm error scenarios addressed

### 3. Code Quality Review

#### Architecture Compliance
- [ ] Follows project's chosen architecture pattern (see AGENTS.md)
- [ ] Business logic isolated from infrastructure
- [ ] Clear separation of concerns
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

### 🔄 Changes Requested

Issues found that need addressing.

### ❌ Blocked

Major issues that prevent approval.

## Write Findings to Story File (MANDATORY)

After completing the review, **append** your findings to the story file's `## Review` section.
Each review round is a separate `### Review #N` block. NEVER overwrite previous reviews — always append.

**How to determine review number:**
1. Read the story file's `## Review` section
2. Count existing `### Review #N` blocks
3. Your review is `N + 1` (or `#1` if none exist)

**Format to append at the end of the story file:**

```markdown
### Review #{{N}} — {{YYYY-MM-DD}}

**Verdict:** {{APPROVE | CHANGES_REQUESTED | BLOCKED}}
**Reviewer:** @reviewer (Marcus)

**Summary:** {{1-2 sentences}}

**Tests:** {{PASS | FAIL — details}}
**Lint:** {{PASS | FAIL — details}}

{{IF issues found:}}
#### Action Items
- [ ] [HIGH] `path/file.ts:42` — {{issue}} → Fix: {{specific fix}}
- [ ] [MED] `path/file.ts:100` — {{issue}} → Fix: {{specific fix}}
- [ ] [LOW] `path/file.ts:15` — {{issue}}

{{IF approve:}}
#### What's Good
- {{positive feedback}}
```

**Example — first review with issues:**

```markdown
### Review #1 — 2026-01-27

**Verdict:** CHANGES_REQUESTED
**Reviewer:** @reviewer (Marcus)

**Summary:** Missing error handling in CreateUser handler, no test for duplicate email.

**Tests:** PASS (12/12)
**Lint:** PASS

#### Action Items
- [ ] [HIGH] `internal/user/handler.go:42` — No error handling for DB timeout → Fix: wrap with domain error
- [ ] [MED] `internal/user/handler_test.go` — Missing duplicate email test → Fix: add TestCreateUser_DuplicateEmail
```

**Example — second review after fixes:**

```markdown
### Review #2 — 2026-01-27

**Verdict:** APPROVE
**Reviewer:** @reviewer (Marcus)

**Summary:** All issues from Review #1 fixed. Error handling added, test coverage complete.

**Tests:** PASS (14/14)
**Lint:** PASS

#### What's Good
- Clean error wrapping with domain errors
- Good test coverage for edge cases
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

**MANDATORY:** Use the format from "Write Findings to Story File" section above.
Append `### Review #N` block to the `## Review` section at the end of the story file.
NEVER overwrite previous reviews — history must be preserved for analytics.

## Return Summary to Caller (MANDATORY)

After writing to story file, return a SHORT summary to the calling agent (@dev).
This prevents the caller from re-reading the story file.

**Format:**

```
**VERDICT: {{APPROVE | CHANGES_REQUESTED | BLOCKED}}**

{{IF CHANGES_REQUESTED or BLOCKED:}}
Action items:
- [HIGH] `path/file.ts:42` — {{issue}} → {{fix}}
- [MED] `path/file.ts:100` — {{issue}} → {{fix}}

{{IF APPROVE:}}
All good. No issues found.
```

**Example — Changes Requested:**

```
**VERDICT: CHANGES_REQUESTED**

Action items:
- [HIGH] `internal/user/handler.go:42` — No error handling for DB timeout → wrap with domain error
- [MED] `internal/user/handler_test.go` — Missing duplicate email test → add TestCreateUser_DuplicateEmail
```

**Example — Approve:**

```
**VERDICT: APPROVE**

All good. No issues found. Clean error wrapping, good test coverage.
```

---

## Best Practices

1. **Be specific** - Point to exact file and line
2. **Suggest solutions** - Don't just criticize
3. **Prioritize** - Focus on important issues first
4. **Be constructive** - Phrase feedback positively
5. **Use search()** - Find similar patterns before reviewing
