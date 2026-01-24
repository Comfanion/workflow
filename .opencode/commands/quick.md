---
description: Use when making small changes (bug fixes, minor features) that don't need full documentation workflow
agent: pm
---

# Quick Mode

## Purpose

Skip the full workflow for small changes (L0-L1 scale):
- Bug fixes
- Minor features
- Configuration changes
- Small refactors

## Arguments
$ARGUMENTS

Description of the change to make.

Example:
```
/quick Fix login button not working on mobile
/quick Add dark mode toggle to settings
/quick Update API endpoint for user service
```

## Quick Mode Criteria

Automatically used when:
- Single file or < 5 files affected
- No new requirements needed
- No architecture changes
- Estimated time < 2 hours

## Quick Workflow

```
┌────────────────────┐
│ 1. Quick Doc       │  Create minimal change doc
│    (2-5 min)       │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ 2. Implement       │  Make the change
│    (varies)        │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ 3. Test & Verify   │  Verify it works
│    (5-10 min)      │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ 4. Done            │  Log in change history
└────────────────────┘
```

## Quick Doc Format

Create `docs/changes/quick/[date]-[slug].md`:

```markdown
# Quick Change: [Title]

**Date:** YYYY-MM-DD
**Type:** Bug Fix | Minor Feature | Config | Refactor
**Author:** [name]

## Summary

[One paragraph description]

## Changes Made

- [File 1]: [change]
- [File 2]: [change]

## Testing

- [ ] [Test 1]
- [ ] [Test 2]

## Notes

[Any additional context]
```

## Your Task

1. **Analyze the request**
   - Is this truly a quick change?
   - What files will be affected?

2. **If quick change appropriate:**
   - Create quick doc
   - Proceed with implementation guidance

3. **If NOT quick change:**
   - Explain why full workflow is needed
   - Suggest appropriate command

## Scale Check

Before proceeding, verify:

```
IF affects > 5 files → Use full workflow
IF adds new requirements → /requirements first
IF changes architecture → /architecture edit
IF affects multiple modules → /change new
```

## Quick Doc Location

```
docs/changes/quick/
├── 2026-01-23-fix-mobile-login.md
├── 2026-01-22-add-dark-mode.md
└── ...
```

## Output

For valid quick changes:

```markdown
## Quick Change: [Title]

**Scale:** L0 (Hotfix) / L1 (Small)
**Estimated Time:** [X] minutes/hours

### Files to Modify

1. `path/to/file.go` - [what to change]
2. `path/to/test.go` - [add test]

### Implementation Steps

1. [Step 1]
2. [Step 2]
3. [Step 3]

### Testing Checklist

- [ ] Manual test: [description]
- [ ] Unit test added/updated
- [ ] No regressions

### Quick Doc Created

`docs/changes/quick/YYYY-MM-DD-[slug].md`

---

Ready to implement? I can guide you through each step.
```

## After Quick Mode

- Quick doc serves as change log
- No need to update main docs
- If pattern emerges, consider documenting in main docs
