---
description: Use when checking project workflow status or getting guidance on next steps in the documentation pipeline
agent: pm
---

# Workflow Status

## Overview

This command shows the current state of your project documentation workflow and suggests what to do next.

## Workflow Definition

Reference: @.opencode/FLOW.yaml

## Check All Artifacts

### Stage 1: Requirements
!`ls -la docs/requirements/requirements.md 2>/dev/null && echo "EXISTS" || echo "MISSING"`

### Stage 2: PRD
!`ls -la docs/prd.md 2>/dev/null && echo "EXISTS" || echo "MISSING"`

### Stage 2.1: PRD QA (Mandatory)
!`ls -la docs/prd-acceptance-criteria.md 2>/dev/null && echo "EXISTS" || echo "MISSING"`

### Stage 3: Architecture  
!`ls -la docs/architecture.md 2>/dev/null && echo "EXISTS" || echo "MISSING"`

### Stage 3.1: Architecture QA (Mandatory)
!`ls -la docs/architecture-integration-tests.md 2>/dev/null && echo "EXISTS" || echo "MISSING"`

### Stage 4: Epics
!`ls docs/sprint-artifacts/*/epic-*.md 2>/dev/null | wc -l | xargs echo "Epics:"`

### Stage 5: Stories
!`ls docs/sprint-artifacts/*/stories/*.md 2>/dev/null | wc -l | xargs echo "Stories:"`

### Stage 6: Sprint Status
!`ls -la docs/sprint-artifacts/sprint-status.yaml 2>/dev/null && echo "EXISTS" || echo "MISSING"`

### Stage 7: Jira Sync
!`ls -la docs/sprint-artifacts/jira-sync-report.md 2>/dev/null && echo "EXISTS" || echo "NEVER RUN"`

### Validation Reports
!`ls -la docs/validation/*.md 2>/dev/null | tail -5 || echo "No validation reports"`

## Generate Status Report

Based on the checks above, generate a status report in this format:

```markdown
# Project Workflow Status

**Project:** marketplace
**Date:** YYYY-MM-DD
**Workflow:** @.opencode/FLOW.yaml

## Pipeline Status

| # | Stage | Artifact | Status | QA Status |
|---|-------|----------|--------|-----------|
| 1 | Requirements | requirements.md | ✅/❌ | N/A |
| 2 | PRD | prd.md | ✅/❌ | prd-acceptance-criteria.md: ✅/❌ |
| 3 | Architecture | architecture.md | ✅/❌ | architecture-integration-tests.md: ✅/❌ |
| 4 | Epics | N epics | ✅/⏳/❌ | N/A |
| 5 | Stories | N stories | ✅/⏳/❌ | N/A |
| 6 | Sprint Plan | sprint-status.yaml | ✅/❌ | N/A |
| 7 | Jira Sync | Last sync | ✅/❌ | N/A |

## Current Stage

**You are at:** Stage N - [Stage Name]
**Next action:** [What to do next]

## Validation Status

| Artifact | Last Validated | Result |
|----------|---------------|--------|
| Requirements | date | PASS/WARN/FAIL |
| PRD | date | PASS/WARN/FAIL |
| Architecture | date | PASS/WARN/FAIL |
| Epics | date | PASS/WARN/FAIL |

## Recommended Next Steps

1. [First action with command]
2. [Second action with command]
```

## Decision Logic

Follow FLOW.yaml pipeline order:

### If requirements.md missing:
→ "Run `/requirements` to start gathering requirements"

### If requirements exists but not validated:
→ "Run `/validate requirements` to validate before PRD"

### If requirements validated but PRD missing:
→ "Run `/prd` to create PRD"

### If PRD exists but prd-acceptance-criteria.md missing:
→ "PRD QA artifact missing! Create `docs/prd-acceptance-criteria.md` with AC for all FRs"

### If PRD exists but not validated:
→ "Run `/validate prd` to validate before architecture"

### If PRD validated but architecture missing:
→ "Run `/architecture` to create architecture"

### If architecture exists but architecture-integration-tests.md missing:
→ "Architecture QA artifact missing! Create `docs/architecture-integration-tests.md`"

### If architecture exists but not validated:
→ "Run `/validate architecture` to validate before epics"

### If architecture validated but no epics:
→ "Run `/epics` to create epics"

### If epics exist but no stories:
→ "Run `/stories [epic-id]` to create stories for each epic"

### If stories exist but no sprint plan:
→ "Run `/sprint-plan` to organize into sprints"

### If sprint plan exists but not in Jira:
→ "Run `/jira-sync` to synchronize with Jira"

### If all complete:
→ "Ready for implementation! Run `/sprint-plan status` to see current sprint"

## Quick Commands Reference

| Command | Description | Stage |
|---------|-------------|-------|
| `/requirements` | Gather FR/NFR requirements | 1 |
| `/validate requirements` | Validate requirements | 1→2 |
| `/prd` | Create/edit PRD | 2 |
| `/validate prd` | Validate PRD | 2→3 |
| `/architecture` | Create/edit architecture | 3 |
| `/validate architecture` | Validate architecture | 3→4 |
| `/epics` | Create epics from PRD | 4 |
| `/validate epics` | Validate epics | 4→5 |
| `/stories [epic]` | Create stories for epic | 5 |
| `/sprint-plan` | Plan sprints | 6 |
| `/jira-sync` | Sync to Jira | 7 |
| `/workflow-status` | This command | - |
