---
name: jira-integration
description: Bidirectional sync between local docs and Jira with development control
license: MIT
compatibility: opencode
metadata:
  domain: project-management
  agents: [pm, dev]
---

# Jira Integration Skill

> **Purpose**: Bidirectional sync between local docs and Jira with development control
> **Used by**: SM agent, Dev agent

---

## Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     JIRA INTEGRATION                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   User Input              Cache                   Jira API      │
│   ───────────            ──────                  ─────────      │
│   • Links (optional)  →  jira-cache.yaml    ←→   REST API      │
│   • Project key          (local state)           (remote)       │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │                     HIERARCHY                            │  │
│   │   Epic (PROJ-E01)                                        │  │
│   │     └── Story (PROJ-S01)                                 │  │
│   │           └── Task (PROJ-T01)                            │  │
│   │           └── Task (PROJ-T02)                            │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │            DEVELOPMENT CONTROL MODE                      │  │
│   │   Backlog → Planned → In Progress → Review → QA → Done   │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Configuration

### config.yaml

```yaml
jira:
  enabled: true
  base_url: "https://your-domain.atlassian.net"
  project_key: "PROJ"
  
  cache:
    enabled: true
    file: "{project-root}/.opencode/jira-cache.yaml"
    ttl_minutes: 30
    
  control_development: true
  
  required_statuses:
    backlog: ["Backlog", "To Do"]
    planned: ["Planned", "Ready"]
    in_progress: ["In Progress"]
    review: ["In Review", "Code Review"]
    qa: ["QA", "Testing"]
    done: ["Done", "Closed"]
```

### Environment Variables

```bash
export JIRA_EMAIL="your-email@company.com"
export JIRA_API_TOKEN="your-api-token"
```

---

## User Input Modes

### Mode 1: User Provides Links

```
User: "Sync with https://jira.company.com/browse/PROJ-123, PROJ-124"

Agent:
1. Parse links → extract keys [PROJ-123, PROJ-124]
2. Fetch from Jira API
3. Find related issues (parent/children)
4. Show found issues
5. Ask: "Which do you want to update?"
```

### Mode 2: No Links (Auto-Create)

```
User: "Create epics in Jira"

Agent:
1. Read local docs (epics, stories)
2. Check cache for existing Jira issues
3. Show what will be created/updated
4. Ask: "Proceed with creation?"
5. Create in configured project
```

### Mode 3: Mixed

```
User: "Sync epic PROJ-E01 with local docs"

Agent:
1. Fetch PROJ-E01 from Jira
2. Find local epic-01.md
3. Compare and show differences
4. Ask: "Update Jira or local?"
```

---

## Cache System

### Cache File: `.opencode/jira-cache.yaml`

```yaml
metadata:
  last_sync: "2024-01-20T10:30:00Z"
  cache_ttl_minutes: 30
  
project:
  key: "PROJ"
  statuses: [...]
  workflow_valid: true
  
sprints:
  - id: "123"
    name: "Sprint 5"
    state: "active"
    
epics:
  - key: "PROJ-E01"
    summary: "Product Catalog"
    status: "In Progress"
    local_doc: "docs/sprint-artifacts/sprint-1/epic-01.md"
    stories:
      - key: "PROJ-S01"
        summary: "Product Aggregate"
        status: "In Progress"
        branch: "feature/PROJ-S01-product-aggregate"
        tasks: [...]

lookup:
  by_key: {...}
  by_local_doc: {...}
  by_status: {...}
  
pending_sync:
  create: []
  update: []
```

### Cache Operations

| Operation | When |
|-----------|------|
| **Refresh** | TTL expired, manual request |
| **Update** | After Jira API call |
| **Invalidate** | Config changed, errors |
| **Lookup** | Every agent query |

### Cache Usage Flow

```
Agent needs Jira data
  │
  ├─► Check cache exists?
  │     ├─► No: Full refresh from API
  │     └─► Yes: Check TTL
  │           ├─► Expired: Refresh from API
  │           └─► Valid: Use cache
  │
  └─► Return data
```

---

## Workflow: Initial Setup

### Step 1: Validate Project

```xml
<step n="1" goal="Validate Jira project and statuses">
  <action>Read config.yaml → jira settings</action>
  <action>Call Jira API: GET /rest/api/3/project/{key}</action>
  <action>Get available statuses: GET /rest/api/3/status</action>
  
  <check if="project not found">
    <ask>Project {key} not found. Enter correct project key:</ask>
  </check>
  
  <action>Map Jira statuses to required_statuses</action>
  <action>Store mapping in cache</action>
</step>
```

### Step 2: Validate Workflow Statuses

```xml
<step n="2" goal="Ensure required statuses exist">
  <action>Check each required status category has at least one match</action>
  
  <check if="missing statuses">
    <output>
      ⚠️ Missing required statuses for workflow:
      
      | Category | Required | Found | Status |
      |----------|----------|-------|--------|
      | backlog | ✓ | "Backlog" | ✅ |
      | in_progress | ✓ | "In Progress" | ✅ |
      | review | ✓ | - | ❌ MISSING |
      | qa | ✓ | - | ❌ MISSING |
      | done | ✓ | "Done" | ✅ |
      
      **Options:**
      1. Add missing statuses to Jira project
      2. Map existing statuses to these categories
      3. Disable development control mode
    </output>
    <ask>Choose option (1/2/3):</ask>
    
    <on choice="2">
      <ask>Which existing status should map to "review"?</ask>
      <action>Update config with custom mapping</action>
    </on>
  </check>
  
  <action>Mark workflow_valid: true in cache</action>
</step>
```

---

## Workflow: Sync Epics

### User provides links

```xml
<workflow name="sync-with-links">
  <input>User provides Jira links or keys</input>
  
  <step n="1" goal="Parse and fetch">
    <action>Extract keys from links</action>
    <action>Fetch issues from Jira API</action>
    <action>Fetch children (stories under epic)</action>
  </step>
  
  <step n="2" goal="Find related and show">
    <output>
      📋 Found issues:
      
      **Epic:** PROJ-E01 - Product Catalog
      **Status:** In Progress
      **Stories:**
        - PROJ-S01 - Product Aggregate (In Progress)
        - PROJ-S02 - Product Repository (To Do)
        - PROJ-S03 - Product API (To Do)
      
      **Local docs found:**
        - epic-01.md → PROJ-E01 ✅
        - story-01.md → PROJ-S01 ✅
        - story-02.md → No link ⚠️
        - story-03.md → No link ⚠️
    </output>
    
    <ask>
      Which do you want to update?
      1. All (create missing links)
      2. Only existing links
      3. Select specific issues
    </ask>
  </step>
  
  <step n="3" goal="Sync selected">
    <action>For each selected: compare local ↔ Jira</action>
    <action>Show diff</action>
    <ask>Update Jira with local content? (y/n)</ask>
    <action>Execute updates</action>
    <action>Update cache</action>
  </step>
</workflow>
```

### User provides no links (auto-create)

```xml
<workflow name="auto-create">
  <input>No links provided</input>
  
  <step n="1" goal="Scan local docs">
    <action>Find all epic-*.md files</action>
    <action>Find all story-*.md files</action>
    <action>Check cache for existing Jira links</action>
  </step>
  
  <step n="2" goal="Show plan">
    <output>
      📋 Sync Plan:
      
      **Will CREATE in Jira:**
        - Epic: "Product Catalog" (from epic-01.md)
          - Story: "Product Aggregate" (from story-01.md)
          - Story: "Product Repository" (from story-02.md)
      
      **Will UPDATE in Jira:**
        - PROJ-S03: description changed
        
      **Already synced (no changes):**
        - PROJ-E02, PROJ-S04
    </output>
    
    <ask>Proceed? (y/n)</ask>
  </step>
  
  <step n="3" goal="Execute">
    <action>Create epics first (get keys)</action>
    <action>Create stories with epic parent</action>
    <action>Create tasks under stories</action>
    <action>Update local docs with Jira metadata</action>
    <action>Update cache</action>
  </step>
</workflow>
```

---

## Development Control Mode

### When `control_development: true`

Agent manages the full development lifecycle:

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT LIFECYCLE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  BACKLOG → PLANNED → IN_PROGRESS → REVIEW → QA → DONE           │
│     │         │           │          │       │      │           │
│     │         │           │          │       │      │           │
│  Groomed   Sprint      Dev starts  PR      QA    Merged         │
│            planned     + branch   created  tests  + deployed    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Status Transitions

| From | To | Trigger | Agent Action |
|------|----|---------|--------------|
| backlog | planned | Sprint planning | Update Jira status |
| planned | in_progress | `/dev-story` starts | Create branch, update status |
| in_progress | review | PR created | Link PR, update status |
| review | in_progress | Review failed | Update status, add comment |
| review | qa | Review passed | Update status |
| qa | in_progress | QA failed | Update status, create bug task |
| qa | done | QA passed | Update status |

### Dev Agent Receives

When dev agent starts work on a task:

```yaml
# Passed to dev agent
task:
  jira_key: "PROJ-S01"
  jira_url: "https://jira.company.com/browse/PROJ-S01"
  branch: "feature/PROJ-S01-product-aggregate"
  local_doc: "docs/sprint-artifacts/sprint-1/stories/story-01.md"
  status: "in_progress"
  
  parent_epic:
    key: "PROJ-E01"
    branch: "feature/epic-PROJ-E01-product-catalog"
    
  transitions:
    submit_review: "31"  # Jira transition ID
    mark_blocked: "41"
```

### Branch Creation

```xml
<step goal="Create branch for task">
  <action>Read branch pattern from config</action>
  <action>Generate branch name: feature/{story_key}-{slug}</action>
  
  <check if="parent epic has branch">
    <action>Branch from epic branch</action>
  </check>
  <check else>
    <action>Branch from main/develop</action>
  </check>
  
  <action>Create branch</action>
  <action>Update Jira: add branch link</action>
  <action>Update cache</action>
  
  <output>
    🌿 Branch created: feature/PROJ-S01-product-aggregate
    📋 Jira: PROJ-S01 → In Progress
    📄 Doc: docs/sprint-artifacts/sprint-1/stories/story-01.md
  </output>
</step>
```

---

## API Operations

### Fetch Issue with Children

```bash
# Get epic with all stories
curl -X GET \
  -H "Authorization: Basic $AUTH" \
  "$JIRA_URL/rest/api/3/search?jql=parent=PROJ-E01&fields=summary,status,description"
```

### Create Epic

```bash
curl -X POST \
  -H "Authorization: Basic $AUTH" \
  -H "Content-Type: application/json" \
  "$JIRA_URL/rest/api/3/issue" \
  -d '{
    "fields": {
      "project": {"key": "PROJ"},
      "issuetype": {"name": "Epic"},
      "summary": "Product Catalog",
      "description": {...}
    }
  }'
```

### Transition Issue

```bash
# Get available transitions
curl -X GET "$JIRA_URL/rest/api/3/issue/PROJ-S01/transitions"

# Execute transition
curl -X POST \
  "$JIRA_URL/rest/api/3/issue/PROJ-S01/transitions" \
  -d '{"transition": {"id": "31"}}'
```

### Link Branch to Issue

```bash
curl -X POST \
  "$JIRA_URL/rest/dev-status/1.0/issue/detail" \
  -d '{
    "issueId": "PROJ-S01",
    "detail": {
      "branches": [{
        "name": "feature/PROJ-S01-product-aggregate",
        "url": "https://github.com/org/repo/tree/feature/PROJ-S01-product-aggregate"
      }]
    }
  }'
```

---

## Sync Report

```markdown
# Jira Sync Report

**Date:** 2024-01-20 10:30:00
**Project:** PROJ
**Mode:** Full Sync

## Summary

| Action | Count |
|--------|-------|
| Epics created | 2 |
| Stories created | 8 |
| Tasks created | 24 |
| Issues updated | 3 |
| Status transitions | 5 |
| Branches created | 8 |
| Errors | 0 |

## Created Issues

| Local Doc | Jira Key | Type | Summary |
|-----------|----------|------|---------|
| epic-01.md | PROJ-E01 | Epic | Product Catalog |
| story-01.md | PROJ-S01 | Story | Product Aggregate |

## Status Transitions

| Key | From | To | Trigger |
|-----|------|----|---------|
| PROJ-S01 | Backlog | In Progress | Dev started |

## Branches Created

| Key | Branch |
|-----|--------|
| PROJ-S01 | feature/PROJ-S01-product-aggregate |

## Errors

None

---

## Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024-01-20 | @sm | Initial sync: 2 epics, 8 stories, 24 tasks |
```

---

## Error Handling

### Missing Statuses

```
⚠️ Cannot proceed: Missing required statuses

Required: [backlog, planned, in_progress, review, qa, done]
Found: [backlog, in_progress, done]
Missing: [planned, review, qa]

Options:
1. Add statuses to Jira (requires admin)
2. Map existing statuses: which status = "review"?
3. Disable control_development mode
```

### API Errors

| Error | Cause | Resolution |
|-------|-------|------------|
| 401 | Invalid credentials | Check JIRA_EMAIL, JIRA_API_TOKEN |
| 403 | No permission | Check project access |
| 404 | Issue not found | Verify key, check cache |
| 400 | Invalid transition | Check workflow, get valid transitions |

---

## Validation Checklist

- [ ] Jira credentials configured
- [ ] Project key valid
- [ ] All required statuses mapped
- [ ] Cache file writable
- [ ] Workflow transitions work
- [ ] Branch naming valid
