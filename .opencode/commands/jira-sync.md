---
description: Use when synchronizing epics and stories with Jira. Creates issues, updates status, links branches
agent: pm
---

# Jira Synchronization

## Arguments
$ARGUMENTS

- `full` or empty: Full sync (create missing, update existing)
- `status`: Sync status only
- `epic [id]`: Sync specific epic

## Prerequisites

**Config:** @.opencode/jira-config.yaml

**Environment:**
```bash
JIRA_USER=your-email@company.com
JIRA_API_TOKEN=your-api-token
```

## Task

1. Load skill: `jira-integration`
2. Read jira-config.yaml for settings
3. Based on mode:

### Full Sync
- Find all epics/stories without `jira_id`
- Create in Jira
- Store `jira_id` in files
- Update status for existing items
- Generate sync report

### Status Sync
- For items with `jira_id`
- Compare local vs Jira status
- Update whichever is behind

### Epic Sync
- Sync specific epic and its stories

## Output

- Updated epic/story files with Jira metadata
- Sync report: `docs/sprint-artifacts/jira-sync-report.md`

## Sync Report

Shows:
- Created issues
- Updated statuses
- Errors encountered
- Next actions
