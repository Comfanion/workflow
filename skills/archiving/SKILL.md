---
name: archiving
description: Archive an outdated document or piece of code instead of deleting it — move it under {DOCS_ROOT}/archive/ with metadata recording when, why, and what superseded it, then fix references and update the archive index. Use when retiring a document, shelving an old version after a major revision or scope pivot, or cleaning up superseded material. Archiving preserves history; deletion is not the goal here.
---

# Archiving

Documents are never deleted, only archived — every version carries history value: why a decision was made, what an old design looked like, what a pivot replaced. Throwing that away loses the reasoning behind the current state. Archiving moves the material aside while keeping it findable and clearly marked as stale.

`{DOCS_ROOT}` defaults to `docs/` at the project root; honor the project's configured docs location if one is set.

## When to archive

Archive when a document is genuinely superseded — not merely old:

| Material | Archive when |
|----------|-------------|
| Research | Superseded by newer research, or stale (over a year old) |
| PRD | Major version change or scope pivot |
| Architecture | Major redesign or tech-stack change |
| Module docs | Module deprecated or merged away |
| Coding standards | Standards changed significantly |
| Sprint artifacts | Sprint completed and its retrospective is done |

Do **not** archive things still in use: the current sprint's artifacts, active research, the current PRD or architecture, or templates. Archiving live material breaks the workflow that depends on it.

## How to archive

The archive lives under `{DOCS_ROOT}/archive/`, mirroring the source layout with subfolders like `research/`, `prd/`, `architecture/`, `modules/`, `standards/`, and `sprint-artifacts/`. Mirroring the structure means a reader finds the archived version where they'd expect the live one.

Work through these steps in order, because each depends on the previous:

1. **Stamp metadata** at the top of the document so its archived status travels with the file:
   ```yaml
   ---
   archived: true
   archived_date: YYYY-MM-DD
   archived_reason: "Superseded by v2.0 after scope pivot"
   superseded_by: "../prd.md"
   original_path: "{DOCS_ROOT}/prd.md"
   original_version: "1.0"
   ---
   ```
   Add a short banner under the title too (`> ARCHIVED on <date> — <reason>. Current: <link>`) so the staleness is visible even when the front matter is hidden.
2. **Rename with a date suffix** — `document.md` → `document-YYYY-MM-DD.md` — so multiple archived versions coexist without collision.
3. **Move** it from `{DOCS_ROOT}/[path]/` to `{DOCS_ROOT}/archive/[path]/`.
4. **Fix references** in other documents that pointed at it, so nothing now links into a moved or stale file unknowingly.
5. **Update the archive index** at `{DOCS_ROOT}/archive/README.md` so the archived item is discoverable.

## Archive index

The index is the front door to the archive — a recent-changes table plus a breakdown by type:

```markdown
# Documentation Archive

## Recently Archived

| Document | Type | Archived | Reason |
|----------|------|----------|--------|
| prd-v1.0 | PRD | 2026-01-29 | v2.0 released |
| architecture-v1.5 | Architecture | 2026-01-20 | Tech stack change |

## Archive by Type

### PRD Versions
- [prd-v1.0-2026-01-29.md](./prd/prd-v1.0-2026-01-29.md) — Superseded by v2.0
```

## Proposing a change before archiving

When the archiving is part of a larger documented change (a redesign, a scope pivot) and you need a reviewable proposal first, use the change-proposal format in `references/template-change-proposal.md`. It captures motivation, scope, impact, alternatives, and approval, and its "After Merge" checklist points back here to archive the superseded documents.

## Roles

Anyone retiring a document archives it; for a major change, the proposal is reviewed and approved by the document owner before the archiving step runs.
