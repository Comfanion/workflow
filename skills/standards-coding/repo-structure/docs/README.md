# Documentation

## Structure

```
docs/
├── README.md                 # This file
├── prd.md                    # Product Requirements Document
├── architecture.md           # System Architecture
│
├── requirements/             # Requirements gathering
│   └── README.md
│
├── standards/                # Project-wide standards
│   ├── README.md             # Index of which artifacts are active / skipped
│   ├── coding.md             # Naming, layering, errors, critical rules
│   ├── testing.md            # Coverage targets, types, gates
│   ├── security.md           # Surface-scoped checklist
│   ├── performance.md        # Budgets, hot paths, anti-patterns
│   ├── api.md                # URL, envelope, errors, versioning
│   ├── database.md           # Naming, migrations, query patterns
│   ├── git.md                # Branching, commits, PR/MR process
│   └── temporary-decisions.md # Living backlog of conscious shortcuts
│
├── architecture/             # Architecture details
│   ├── adr/                  # Architecture Decision Records
│   └── diagrams/             # Architecture diagrams
│
├── api/                      # API documentation
│   └── README.md
│
├── sprint-artifacts/         # Sprint work
│   ├── backlog/             # Unscheduled epics
│   ├── sprint-1/            # Sprint 1 epics & stories
│   └── sprint-status.yaml   # Current status
│
└── translations/            # Translated docs
    └── README.md
```

## Key Documents

| Document | Status | Description |
|----------|--------|-------------|
| [PRD](prd.md) | 📝 Draft | Product requirements |
| [Architecture](architecture.md) | 📝 Draft | System design |
| [Standards](standards/) | 📝 Draft | Project-wide standards (coding, testing, security, …) |

## Documentation Workflow

1. **Technical docs** → Write in English in `docs/`
2. **Translations** → Generate into `docs/translations/`
3. **Updates** → Changelog at end of each document

## Writing Guidelines

- Use English for all technical documentation
- Be specific and measurable
- Include examples
- Update changelog at end of session
- Add TODO placeholders for incomplete sections
