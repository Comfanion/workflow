---
description: Use when managing change proposals for modifying existing documentation. Tracks deltas and impact
agent: change-manager
---

# Change Management

## Arguments
$ARGUMENTS

**Actions:**
- `new [name]` - Create new change proposal
- `delta [change] [doc]` - Create delta for a document
- `list` - List active change proposals
- `show [name]` - Show change details
- `review [name]` - Review for conflicts
- `approve [name]` - Approve change
- `reject [name] [reason]` - Reject change
- `merge [name]` - Apply and archive

## When to Use Change Proposals

Use `/change` instead of direct edits when:
- Changing > 10 lines
- Affecting > 1 section
- Changing multiple documents
- Need stakeholder review
- Want rollback capability

For small edits, use direct commands like `/prd edit`.

## Check Current Changes

!`ls -la docs/changes/ 2>/dev/null || echo "No changes directory"`
!`cat docs/changes/README.md 2>/dev/null || echo "No active changes"`

## Actions

### new [name]

Create new change proposal:

1. Create directory: `docs/changes/[name]/`
2. Create `proposal.md` with template
3. Ask user for:
   - Summary
   - Motivation
   - Affected documents
4. Update `docs/changes/README.md`

### delta [change] [doc]

Create delta for specific document:

1. Load current document
2. Ask what to ADD, MODIFY, REMOVE
3. Create `docs/changes/[change]/deltas/[doc]-delta.md`
4. Update proposal.md with affected doc

### list

Show all active change proposals with status.

### show [name]

Display:
- Proposal summary
- All deltas
- Affected documents
- Current status

### review [name]

Check for:
1. **Parallel Changes** - Other proposals affecting same docs?
2. **Stale Deltas** - Source docs changed since delta created?
3. **Missing Deltas** - All affected docs have deltas?
4. **Conflicts** - Any conflicting changes?

Output review report with PASS/WARN/FAIL.

### approve [name]

1. Verify review passed
2. Change status to "Approved"
3. Update proposal.md
4. Notify ready for merge

### reject [name] [reason]

1. Change status to "Rejected"
2. Add rejection reason
3. Move to `docs/archive/changes/`

### merge [name]

1. Verify status is "Approved"
2. For each delta:
   - Backup current document
   - Apply changes
   - Update version
3. Update `docs/document-status.yaml`
4. Archive change to `docs/archive/changes/`
5. Update `docs/changes/README.md`

## Directory Structure

```
docs/changes/
├── README.md                    # Active changes index
├── add-oauth/
│   ├── proposal.md
│   ├── tasks.md
│   └── deltas/
│       ├── requirements-delta.md
│       ├── prd-delta.md
│       └── architecture-delta.md
└── refactor-auth/
    ├── proposal.md
    └── deltas/
        └── architecture-delta.md
```

## Delta Format

```markdown
# Delta: PRD

**Target:** docs/prd.md
**Change:** add-oauth

---

## ADDED

### OAuth2 Authentication

New requirement for OAuth2 support with Google and GitHub providers.

---

## MODIFIED

### Authentication Section

**Before:**
Users authenticate via email/password only.

**After:**
Users authenticate via email/password or OAuth2 (Google, GitHub).

**Rationale:**
User research shows 60% prefer social login.

---

## REMOVED

(none)
```

## Validation

Before merge:
- [ ] All affected docs have deltas
- [ ] No conflicting changes
- [ ] Deltas not stale
- [ ] Review completed
- [ ] Approval granted
