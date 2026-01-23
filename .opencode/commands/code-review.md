# /code-review Command

Review implemented code for quality, correctness, and adherence to standards.

## Usage

```
/code-review [story-path]
```

## Arguments

- `story-path` (optional): Path to story file to review. If not provided, finds stories in `review` status.

## Agent

This command invokes the **Dev** agent (Amelia) in review mode.

## Process

1. Load story file and implementation
2. Check all acceptance criteria are met
3. Review code quality:
   - Follows CLAUDE.md patterns
   - Proper error handling
   - Appropriate test coverage
   - No security issues
   - Clean code principles
4. Check tests:
   - All tests pass
   - Sufficient coverage
   - Edge cases covered
5. Document findings in story file
6. Provide review outcome:
   - ✅ **Approve** - Ready to merge
   - 🔄 **Changes Requested** - Needs fixes
   - ❌ **Blocked** - Major issues found

## Skills Loaded

- `code-review` - Review checklist and process

## Output

Updates story file with:
- `Senior Developer Review (AI)` section
- Review outcome
- Action items (if any)
- `Review Follow-ups (AI)` tasks (if changes requested)

## Review Checklist

### Functionality
- [ ] All acceptance criteria satisfied
- [ ] Edge cases handled
- [ ] Error handling is appropriate

### Code Quality
- [ ] Follows CLAUDE.md patterns
- [ ] No code duplication
- [ ] Clear naming conventions
- [ ] Appropriate comments

### Testing
- [ ] Unit tests for all new code
- [ ] Integration tests where needed
- [ ] All tests pass
- [ ] Good test coverage

### Security
- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] No SQL injection risks
- [ ] Proper authentication/authorization

## Example

```bash
# Review stories in 'review' status
/code-review

# Review specific story
/code-review docs/sprint-artifacts/sprint-1/stories/1-1-user-auth.md
```

## After Review

- If **Approved**: Mark story as `done`
- If **Changes Requested**: 
  1. Review follow-up tasks added to story
  2. Run `/dev-story` to address issues
  3. Run `/code-review` again

## Best Practice

> **Tip:** For best results, run code-review using a **different** LLM than the one that implemented the story.
