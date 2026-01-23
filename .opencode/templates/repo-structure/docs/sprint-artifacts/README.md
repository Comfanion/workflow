# Sprint Artifacts

## Purpose

Epics, stories, and sprint planning documents.

## Structure

```
sprint-artifacts/
├── README.md              # This file
├── sprint-status.yaml     # Current sprint status
├── backlog/               # Unscheduled epics
│   └── epic-*.md
├── sprint-1/              # Sprint 1
│   ├── epic-*.md
│   └── stories/
│       └── story-*.md
├── sprint-2/              # Sprint 2
│   └── ...
└── jira-sync-report.md    # Last Jira sync
```

## Workflow

1. Create epics from PRD → `/epics`
2. Create stories for epic → `/stories {epic-id}`
3. Plan sprint → `/sprint-plan`
4. Sync to Jira → `/jira-sync`
5. Implement → `/dev-story`

## Naming Conventions

### Epics

```
epic-{NN}-{module}-{description}.md

Examples:
epic-01-auth-user-management.md
epic-02-catalog-products.md
```

### Stories

```
story-{EPIC}-{NN}-{description}.md

Examples:
story-01-01-user-registration.md
story-01-02-user-login.md
```

## Status Tracking

See `sprint-status.yaml` for current status:

```yaml
current_sprint: 1
sprints:
  - number: 1
    status: active
    epics:
      - id: E01
        status: in_progress
        stories:
          - id: S01-01
            status: done
          - id: S01-02
            status: in_progress
```

## Related

- [PRD](../prd.md)
- [Architecture](../architecture.md)
