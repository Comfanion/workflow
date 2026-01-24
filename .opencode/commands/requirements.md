---
description: Use when gathering FR/NFR requirements through stakeholder interviews. First step before PRD
agent: analyst
---

# Requirements Gathering

## Arguments
$ARGUMENTS

Topic or area to focus requirements gathering (optional).

## Prerequisites

Check for existing context:
- @docs/prd.md (if exists - for context)
- @docs/architecture.md (if exists - for context)
- @CLAUDE.md (project standards)

## Task

**If `docs/requirements/requirements.md` exists:**
1. Review existing requirements
2. Ask if user wants to ADD new requirements or EDIT existing
3. Continue discovery from where it left off

**If starting fresh:**
1. Load skill: `requirements-gathering`
2. Begin stakeholder interview
3. Discover functional requirements (FR-XXX)
4. Discover non-functional requirements (NFR-XXX)
5. Structure into requirements.md

## Validation Before Save

Load skill: `requirements-validation`
- All requirements have IDs
- All requirements have acceptance criteria
- No ambiguous language
- Priorities are assigned

## Output

Save to: `docs/requirements/requirements.md`

## Next Step

After completion, suggest: `/validate requirements`
