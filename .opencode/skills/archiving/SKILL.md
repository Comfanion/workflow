---
name: archiving
description: Archive outdated documents to docs/archive/ while preserving history, version, and reason for archiving. Use when retiring documents, archiving old versions, cleaning up docs, or when user mentions "archive", "outdated docs", "retire document", or "move to archive".
license: MIT
compatibility: opencode
metadata:
  domain: documentation
  agents: [all]
---

# Document Archiving Skill

```xml
<archiving>
  <definition>Archive outdated documents while preserving history</definition>
  
  <principle>Documents are never deleted, only archived - every document has history value</principle>
  
  <structure>
    <root>docs/archive/</root>
    <folders>research/, prd/, architecture/, modules/, coding-standards/, sprint-artifacts/</folders>
  </structure>
  
  <when_to_archive>
    <research>Superseded by new research, &gt;1 year old</research>
    <prd>Major version change, scope pivot</prd>
    <architecture>Major redesign, tech stack change</architecture>
    <module_docs>Module deprecated or merged</module_docs>
    <coding_standards>Standards significantly changed</coding_standards>
    <sprint_artifacts>Sprint completed + retrospective done</sprint_artifacts>
  </when_to_archive>
  
  <process>
    <step1>Add archive metadata (archived: true, archived_date, archived_reason, superseded_by)</step1>
    <step2>Rename with date suffix (document.md → document-YYYY-MM-DD.md)</step2>
    <step3>Move to archive (docs/[path]/ → docs/archive/[path]/)</step3>
    <step4>Update references in other docs</step4>
    <step5>Update archive index (docs/archive/README.md)</step5>
  </process>
  
  <metadata_template>
    archived: true
    archived_date: YYYY-MM-DD
    archived_reason: "reason"
    superseded_by: "path to new doc"
    original_path: "original path"
    original_version: "version"
  </metadata_template>
  
  <dont_archive>Current sprint artifacts, Active research, Current PRD/Architecture, Templates</dont_archive>
</archiving>
```

---

## Example: Archive PRD v1.0

```markdown
---
archived: true
archived_date: 2026-01-29
archived_reason: "Superseded by v2.0 after scope pivot"
superseded_by: "../prd.md"
original_path: "docs/prd.md"
original_version: "1.0"
---

# Product Requirements Document (ARCHIVED)

> **ARCHIVED:** This document was archived on 2026-01-29.
> **Reason:** Superseded by v2.0 after scope pivot
> **Current Version:** [prd.md](../prd.md)

---

[Original content below]
```

## Archive Index Structure

```markdown
# Documentation Archive

## Recently Archived

| Document | Type | Archived | Reason |
|----------|------|----------|--------|
| prd-v1.0 | PRD | 2026-01-29 | v2.0 released |
| architecture-v1.5 | Architecture | 2026-01-20 | Tech stack change |

## Archive by Type

### PRD Versions
- [prd-v1.0-2026-01-29.md](./prd/prd-v1.0-2026-01-29.md) - Superseded by v2.0

### Sprint Artifacts
- [sprint-1/](./sprint-artifacts/sprint-1/) - Completed 2026-01-15
```

See `template-change-proposal.md` for full format.
