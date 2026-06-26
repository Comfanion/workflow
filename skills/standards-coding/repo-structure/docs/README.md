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

## Frontmatter convention

Every doc under `docs/` opens with a YAML frontmatter block — a shared, filterable index (inspired by the [Open Knowledge Format](https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing)). The toolkit's templates carry it pre-filled; fill it honestly when writing.

```yaml
---
type: adr                 # doc kind (controlled vocab): prd | architecture | service-architecture |
                          #   adr | standard | epic | story | research | design | runbook | changelog | …
title: Choose Postgres over Mongo
description: One line — what this doc is.
domain: catalog           # the module/domain this doc belongs to — the primary filter axis
status: accepted          # draft | approved | accepted | deprecated | superseded
tags: [database, persistence]
updated: 2026-06-26T14:30:00Z   # last meaningful change (OKF timestamp)
related: [docs/prd.md]    # cross-links to sibling docs
---
```

**Why it exists — dedup.** `type` + `domain` + `tags` let an agent (or a human) find an existing doc before writing a new one. Before producing an artifact, grep the frontmatter for the same `type` + `domain`:

```bash
rg -l "^type: adr" docs/ | xargs rg -l "^domain: catalog"
```

If a match exists, **update it** (bump `updated`, append or supersede) instead of creating a near-duplicate. This is what keeps the docs tree from sprawling.

## Documentation Workflow

1. **Technical docs** → Write in English in `docs/`
2. **Frontmatter** → Every doc opens with the block above; fill `type`/`domain`/`tags` honestly
3. **Before creating** → Grep existing frontmatter by `type` + `domain`; update a match rather than duplicating
4. **Translations** → Generate into `docs/translations/`
5. **Updates** → Bump `updated` + changelog at end of each document

## Writing Guidelines

- Use English for all technical documentation
- Be specific and measurable
- Include examples
- Update changelog at end of session
- Add TODO placeholders for incomplete sections
