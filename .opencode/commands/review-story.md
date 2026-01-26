---
description: Review completed story for security, correctness, and quality before marking as done
agent: reviewer
---

# /review-story Command

Review a completed story using @reviewer agent (GPT-5.2 Codex) for deep security and quality analysis.

## When to Use

1. **After `/dev-story`** completes all tasks (auto-invoked if `auto_review: true`)
2. **Manually** when you want a fresh review
3. **After fixing** issues from previous review

## Process

```
1. Load story file
2. Identify all changed files from File List
3. Security Review (HIGH priority):
   - Hardcoded secrets
   - Input validation
   - SQL injection
   - Auth/authz
   - Sensitive data logging
4. Correctness Review:
   - All AC satisfied
   - Edge cases handled
   - Error handling
5. Test Review:
   - Coverage
   - Quality
   - No flaky tests
6. Code Quality Review:
   - Architecture compliance
   - No duplication
   - Performance
7. Generate verdict and action items
```

## Skills Loaded

- `code-review` - Review checklist and methodology

## Verdicts

| Verdict | Meaning | Next Step |
|---------|---------|-----------|
| ✅ **APPROVE** | All checks pass | Mark story `done` |
| 🔄 **CHANGES_REQUESTED** | Issues found | Fix and re-run `/review-story` |
| ❌ **BLOCKED** | Critical issues | Cannot proceed until fixed |

## Output

Updates story file with:

```markdown
## Story Review

**Reviewer:** @reviewer (Marcus)
**Date:** 2026-01-25
**Model:** GPT-5.2 Codex
**Verdict:** APPROVE | CHANGES_REQUESTED | BLOCKED

### Issues Found

#### HIGH Priority (Must Fix)
- [Security] `path/file.ts:42` - Issue description
  - **Fix:** Specific fix suggestion

#### MEDIUM Priority (Should Fix)
- [Performance] `path/file.ts:100` - Issue description

### What's Good
- Positive feedback

### Action Items
- [ ] [HIGH] Fix issue X
- [ ] [MED] Add test Y
```

## Config Options

In `.opencode/config.yaml`:

```yaml
development:
  methodology: tdd
  auto_review: true   # Auto-invoke @reviewer after /dev-story completes
```

## Flow with /dev-story

```
/dev-story
    ↓
All tasks complete
    ↓
Status → "review"
    ↓
(auto_review: true) → /review-story auto-invoked
    ↓
APPROVE → Status → "done"
CHANGES_REQUESTED → New tasks added → /dev-story again
```

## Best Practice

> **Tip:** @reviewer uses GPT-5.2 Codex which excels at finding bugs that other models miss. Trust its security findings.
