# Documentation Translations

## Purpose

This folder contains translations of technical documentation for non-English speakers (e.g., Ukrainian for Confluence export).

## Structure

```
confluence/
├── README.md                    # This file
├── prd-uk.md                    # PRD (Ukrainian)
├── prd-uk.confluence            # PRD (Confluence format)
├── architecture-uk.md           # Architecture (Ukrainian)
└── html/                        # HTML versions
    └── *.html
```

## Documents

| Document | Format | Original |
|----------|--------|----------|
| - | - | - |

## Process

1. Technical documentation is written in English in `docs/`
2. Translations are generated via `/translate` command
3. Translated files are stored here

## Formats

| Format | Extension | Purpose |
|--------|-----------|---------|
| Markdown | `.md` | View in repository |
| Confluence | `.confluence` | Import to Confluence |
| HTML | `.html` | Standalone viewing |

## Notes

- Technical terms remain in English (API, endpoint, etc.)
- Code blocks are not translated
- Original in `docs/` is always the source of truth
