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
├── coding-standards/         # Code conventions
│   ├── README.md
│   └── ...
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
└── confluence/              # Translated docs (Ukrainian)
    └── README.md
```

## Key Documents

| Document | Status | Description |
|----------|--------|-------------|
| [PRD](prd.md) | 📝 Draft | Product requirements |
| [Architecture](architecture.md) | 📝 Draft | System design |
| [Coding Standards](coding-standards/) | 📝 Draft | Code conventions |

## Documentation Workflow

1. **Technical docs** → Write in English in `docs/`
2. **Translations** → Generate to `docs/confluence/` via `/translate`
3. **Updates** → Changelog at end of each document

## Templates

Templates are co-located with skills in `.opencode/skills/`:
- `skills/prd-writing/template.md`
- `skills/architecture-design/template.md`
- `skills/epic-writing/template.md`
- `skills/story-writing/template.md`

## Writing Guidelines

- Use English for all technical documentation
- Be specific and measurable
- Include examples
- Update changelog at end of session
- Add TODO placeholders for incomplete sections
