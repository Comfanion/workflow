---
description: Create epics from PRD and Architecture
agent: sm
model: anthropic/claude-sonnet-4-20250514
---

# Epic Creation

## Prerequisites

**Required:**
- @docs/prd.md - For requirements coverage
- @docs/architecture.md - For module structure

**Check:**
!`ls -la docs/prd.md docs/architecture.md 2>/dev/null || echo "Missing PRD or Architecture"`

## Task

1. Load skill: `epic-writing`
2. Analyze PRD functional requirements
3. Review architecture module boundaries
4. Create epics that:
   - Cover all FRs from PRD
   - Align with architecture modules
   - Have clear dependencies
   - Are sized for 1-2 weeks
5. Load skill: `acceptance-criteria` for epic AC
6. **Ensure every epic has AC (MANDATORY)**
7. Save epics to sprint artifacts

## Epic Creation Checklist

For each epic:
- [ ] Unique ID: `[MODULE]-E[NN]`
- [ ] Clear responsibility
- [ ] PRD coverage documented
- [ ] Architecture references
- [ ] Dependencies identified
- [ ] **Acceptance criteria defined**
- [ ] Branch name specified

## Output

Save to: `docs/sprint-artifacts/backlog/epic-NN-module-description.md`

Or if assigning to sprint:
`docs/sprint-artifacts/sprint-N/epic-NN-module-description.md`

## Next Step

After epics created, suggest: `/stories [epic-id]` for each epic
