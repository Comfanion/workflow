---
description: Validate project artifacts (requirements, prd, architecture, epics)
agent: architect
model: anthropic/claude-sonnet-4-20250514
---

# Artifact Validation

## Arguments
$ARGUMENTS

- `requirements` - Validate requirements.md
- `prd` - Validate PRD + QA artifact
- `architecture` - Validate architecture + QA artifact
- `epics` - Validate epics (AC presence)
- `stories` - Validate stories (AC presence)
- `all` - Validate entire pipeline
- (empty) - Interactive selection

## Task

Based on argument, load appropriate validation skill:

### Requirements
Load skill: `requirements-validation`
- Check IDs, priorities, AC, language quality

### PRD
Load skill: `prd-validation`
- Prerequisites: requirements PASS
- Check structure, coverage, QA artifact

### Architecture
Load skill: `architecture-validation`
- Prerequisites: PRD PASS
- Check NFR compliance, modules, QA artifact

### Epics
- Check all epics have unique IDs
- **Check all epics have AC (MANDATORY)**
- Check dependencies form DAG
- Check PRD coverage

### Stories
- Check all stories have unique IDs
- Check user story format
- **Check all stories have Given/When/Then AC (MANDATORY)**
- Check DoD present

### All
Run in order: requirements → prd → architecture → epics
Stop on first FAIL.

## Output Format

```markdown
# Validation Report - [Type]

**Date:** YYYY-MM-DD
**Status:** PASS | WARN | FAIL

## Summary
- Passed: NN
- Warnings: NN
- Failed: NN

## QA Artifact
[Status of mandatory QA artifact if applicable]

## Details
[Specific checks and results]

## Next Steps
[What to do after fixing issues]
```

## Output Location

Save to: `docs/validation/[type]-validation-YYYY-MM-DD.md`

## After Validation

- If PASS: Suggest next pipeline step
- If FAIL: List issues and how to fix
