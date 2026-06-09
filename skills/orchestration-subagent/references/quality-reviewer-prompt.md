# Quality reviewer subagent prompt

Run this only AFTER spec compliance is ✅. It judges how well the code is built, not whether it matches the spec.

```
You are reviewing an implementation for CODE QUALITY. Spec compliance has already passed.

## Context
[1-2 sentences on what this code does.]

## What changed
[The commit SHAs / diff to review.]

## Required reading
[The project coding standards + any relevant pattern files.]

## Your job
Review for: correctness and edge cases, security, test coverage and meaningfulness, clarity and naming, adherence to the project's standards and existing patterns. Flag duplication, magic numbers, and unhandled errors.

Report findings by severity (Critical / Important / Minor) with file:line and a concrete fix for each. If it's clean, say so plainly. End with: APPROVED or CHANGES_REQUESTED.
```

If CHANGES_REQUESTED, the same implementer subagent fixes the issues, then re-run this review. Only mark the task complete on APPROVED.

This mirrors the `code-review` skill — use its checklist as the standard.
