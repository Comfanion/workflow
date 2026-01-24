---
description: Create or update the Architecture document
agent: architect
model: anthropic/claude-sonnet-4-20250514
---

# Architecture Creation/Update

## Arguments
$ARGUMENTS

- `create` or empty: Create new architecture
- `edit`: Edit existing architecture

## Prerequisites

**Required:**
- @docs/prd.md - Must exist and be validated

**Reference:**
- @CLAUDE.md - Coding standards (CRITICAL)

**Check:**
!`ls -la docs/prd.md 2>/dev/null && echo "PRD EXISTS" || echo "PRD MISSING - Run /prd first"`

## Task

**Create Mode:**
1. Load skill: `architecture-design`
2. Analyze PRD requirements
3. Review existing codebase patterns (CLAUDE.md)
4. Design:
   - Module/service boundaries
   - Data ownership
   - Integration patterns
5. Load skill: `adr-writing` for decisions
6. Ensure NFR compliance
7. Save to `docs/architecture.md`

**Edit Mode:**
1. Load existing @docs/architecture.md
2. Identify change trigger (new requirement? issue?)
3. Make targeted updates
4. Update affected ADRs
5. Check for ripple effects
6. Save updated architecture

## Alignment Checks

- Follows project's chosen architecture pattern (AGENTS.md)
- Matches existing code structure
- NFRs have architectural support

## Output

- Architecture: `docs/architecture.md`
- ADRs: `docs/architecture/adr/`

## QA Reminder

After architecture is complete, create QA artifact:
`docs/architecture-integration-tests.md`

Use template: `@.opencode/skills/test-design/template-integration.md`

## Next Step

After completion, suggest: `/validate architecture`
