# Templates v2

Technical documentation templates optimized for clarity, structure, and RAG retrieval.

---

## Design Principles

| # | Principle | Why |
|---|-----------|-----|
| 1 | **Context first** | Every section starts with brief explanation |
| 2 | **Tables for data** | Structured data in tables, not prose |
| 3 | **Examples inline** | `<!-- e.g. -->` shows how to fill |
| 4 | **References linked** | `→` prefix for all cross-references |
| 5 | **Notes where needed** | Business rules, gotchas inline |
| 6 | **No code** | Diagrams and schemas, not implementation |

---

## Templates

| Template | Purpose | When to Use |
|----------|---------|-------------|
| `prd-v2.md` | Product Requirements | Project kickoff |
| `architecture-v2.md` | System Architecture | After PRD approved |
| `unit-v2.md` | Module/Entity/Service | Per logical unit |
| `epic-v2.md` | Epic | Sprint planning |
| `story-v2.md` | Story + Tasks | Implementation |
| `requirements-v2.md` | FR/NFR gathering | Discovery phase |
| `adr-v2.md` | Architecture Decision | Technical decisions |

---

## Unit Types

"Unit" is universal term for any logical piece:

| Type | Scale | Examples |
|------|-------|----------|
| module | Large | `auth`, `billing`, `catalog` |
| domain | Medium | `Order`, `Payment` |
| entity | Small | `User`, `Task`, `Product` |
| service | Medium | `NotificationService` |
| feature | Varies | `Search`, `Import` |

---

## Reference Format

Always use `→` prefix:

```
→ Unit: `Task`
→ FR: `FR-001`
→ ADR: `ADR-001`
→ PRD: `docs/prd.md`
→ `path/to/file.md`
```

---

## Syntax

| Element | Meaning |
|---------|---------|
| `{{placeholder}}` | Replace with value |
| `→` | Reference link |
| `<!-- e.g. ... -->` | Inline example |
| `H/M/L` | High/Medium/Low |
| `P0/P1/P2` | Priority |
| `⬜ 🔄 ✅` | Not started / In progress / Done |

---

## Structure Pattern

Each template follows:

```markdown
# Title

yaml frontmatter

---

## Executive Summary / Overview
Context and purpose (prose)

---

## Main Content
Tables with data + Notes where needed

---

## References
Links to related docs
```
