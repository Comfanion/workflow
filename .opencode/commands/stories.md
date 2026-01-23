---
description: Create stories for a specific epic
agent: sm
model: anthropic/claude-sonnet-4-20250514
---

# Story Creation

## Arguments
$ARGUMENTS

**Required:** Epic ID (e.g., `CATALOG-E05`)

## Prerequisites

Epic must exist. Check:
!`find docs/sprint-artifacts -name "epic-*.md" 2>/dev/null | head -10`

## Task

1. Load the specified epic file
2. Load skill: `story-writing`
3. Load skill: `acceptance-criteria`
4. Break epic into stories:
   - Each story is 1-3 days of work
   - User story format: As a... I want... So that...
   - **Given/When/Then AC (MANDATORY)**
   - Technical tasks checklist
   - Definition of Done
5. Save stories to epic's stories/ folder

## Story Creation Checklist

For each story:
- [ ] Unique ID: `[MODULE]-S[EPIC]-[NN]`
- [ ] User story format
- [ ] **Acceptance criteria in Given/When/Then**
- [ ] At least 3 AC (happy path, error, edge case)
- [ ] Technical tasks defined
- [ ] Estimate: XS/S/M/L/XL
- [ ] Definition of Done

## Recommended Story Order

1. Domain layer (aggregates, value objects)
2. Repository interfaces
3. Use cases
4. Repository implementations
5. HTTP handlers
6. Event publishers
7. Integration tests

## Output

Save to: `docs/sprint-artifacts/sprint-N/stories/story-EPIC-NN-description.md`

## Next Step

After stories created:
- For more epics: `/stories [next-epic-id]`
- When done: `/sprint-plan`
