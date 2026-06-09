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
```

## Workflow

1. Create epics and stories from the PRD → the decomposition skill
2. Plan sprints → the decomposition skill
3. Implement → the dev skill

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
