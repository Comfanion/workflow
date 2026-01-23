---
description: Archive outdated documents while preserving history
agent: archivist
---

# Archive Command

## Arguments
$ARGUMENTS

Format: `[action] [path]`

**Actions:**
- "move [path]" - Archive a specific document
- "sprint [sprint-N]" - Archive completed sprint
- "list" - Show archive contents
- "find [query]" - Search archive

**Examples:**
- `/archive move docs/research/technical/old-topic.md`
- `/archive sprint sprint-0`
- `/archive list`
- `/archive find authentication`

## Archive Policy

**CRITICAL RULES:**
1. Documents are NEVER deleted, only archived
2. Every archived doc gets metadata (date, reason, superseded_by)
3. References to archived docs must be updated
4. Archive index must be updated

## Current Archive State

!`tree docs/archive/ 2>/dev/null || echo "Archive empty"`

## Your Task

### Archive Document (move)

1. **Verify document exists**:
   !`ls -la $1`

2. **Ask for archive reason**:
   - Superseded by new version?
   - No longer relevant?
   - Merged into another doc?

3. **Add archive metadata** to document:
   ```markdown
   ---
   archived: true
   archived_date: YYYY-MM-DD
   archived_reason: "[reason]"
   superseded_by: "[path]"  # if applicable
   original_path: "[original path]"
   ---
   
   # [Title] (ARCHIVED)
   
   > **ARCHIVED:** This document was archived on YYYY-MM-DD.
   > **Reason:** [reason]
   > **Current Version:** [link] (if superseded)
   ```

4. **Determine archive path**:
   - `docs/research/x.md` → `docs/archive/research/x-YYYY-MM-DD.md`
   - `docs/prd.md` → `docs/archive/prd/prd-vX.Y-YYYY-MM-DD.md`
   - `docs/architecture.md` → `docs/archive/architecture/architecture-vX.Y-YYYY-MM-DD.md`

5. **Move document**:
   ```bash
   mkdir -p docs/archive/[type]/
   mv [source] docs/archive/[type]/[name]-YYYY-MM-DD.md
   ```

6. **Update references**:
   - Find docs that link to archived doc
   - Update links or add "archived" notes

7. **Update archive index**:
   - Add entry to `docs/archive/README.md`

### Archive Sprint

1. **Verify sprint is complete**:
   - All stories done
   - Retrospective completed

2. **Move entire sprint folder**:
   ```bash
   mv docs/sprint-artifacts/sprint-N docs/archive/sprint-artifacts/sprint-N
   ```

3. **Update sprint-status.yaml**:
   - Mark sprint as archived
   - Remove from active sprints

4. **Update archive index**

### List Archive

Show contents organized by:
- Type (research, prd, architecture, etc.)
- Date (most recent first)
- Status

### Find in Archive

Search archive by:
- Document name
- Content keywords
- Date range

## Archive Structure

```
docs/archive/
├── README.md                    # Archive index
├── research/
│   └── [topic]-YYYY-MM-DD.md
├── prd/
│   └── prd-vX.Y-YYYY-MM-DD.md
├── architecture/
│   └── architecture-vX.Y-YYYY-MM-DD.md
├── modules/
│   └── [module]/
├── coding-standards/
│   └── [file]-YYYY-MM-DD.md
└── sprint-artifacts/
    └── sprint-N/
```

## Validation

Before archiving:
- [ ] Archive reason documented
- [ ] Superseding doc exists (if applicable)
- [ ] Archive metadata added
- [ ] Target archive path correct

After archiving:
- [ ] Document moved successfully
- [ ] References updated
- [ ] Archive index updated
- [ ] No broken links
