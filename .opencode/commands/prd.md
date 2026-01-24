---
description: Use when creating or updating Product Requirements Document. Defines scope, FRs, NFRs, user journeys
agent: pm
---

# PRD Creation/Update

## Arguments
$ARGUMENTS

- `create` or empty: Create new PRD
- `edit`: Edit existing PRD

## Prerequisites

**Required:**
- @docs/requirements/requirements.md - Must exist

**Check:**
!`ls -la docs/requirements/requirements.md 2>/dev/null && echo "EXISTS" || echo "MISSING - Run /requirements first"`

## Task

**Create Mode:**
1. Load skill: `prd-writing`
2. Review all requirements from requirements.md
3. Collaborate to define:
   - Project classification
   - Success criteria
   - MVP/Growth/Vision scope
4. Structure into PRD sections
5. Load skill: `acceptance-criteria` for writing AC
6. Save to `docs/prd.md`

**Edit Mode:**
1. Load existing @docs/prd.md
2. Ask what sections need updates
3. Make targeted edits
4. Update version in frontmatter
5. Save updated PRD

## Validation Before Save

- All FRs from requirements.md addressed
- All NFRs from requirements.md addressed
- Success criteria are measurable
- Scope boundaries clear

## Output

Save to: `docs/prd.md`

## QA Reminder

After PRD is complete, create QA artifact:
`docs/prd-acceptance-criteria.md`

Use template: `@.opencode/skills/acceptance-criteria/template.md`

## Next Step

After completion, suggest: `/validate prd`
