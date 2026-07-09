---
type: change-proposal                         # controlled vocab — primary filter for agents
title: "Change Proposal: [Name]"
description: {{one line — the change being proposed}}
domain: {{domain/module affected}}            # dedup axis: find related proposals in this area
status: draft                                 # draft | review | approved | rejected | merged
tags: [{{tag}}, {{tag}}]                       # free-form filter labels
id: CP-NNN
timestamp: {{YYYY-MM-DDThh:mmZ}}                 # OKF timestamp — last meaningful change
author: {{author}}
related: []                                    # cross-links; e.g. the doc/ADR it amends
---

# Change Proposal: [Name]

---

## Summary

[1-2 sentences: What is being changed and why]

---

## Motivation

### Problem

[What problem does this change solve?]

### Current State

[How things work now]

### Desired State

[How things should work after this change]

---

## Scope

### In Scope

- [What this change includes]
- [What this change includes]

### Out of Scope

- [What this change does NOT include]
- [What will be done later]

---

## Impact Analysis

### Documents Affected

| Document | Type of Change | Delta File |
|----------|----------------|------------|
| {DOCS_ROOT}/architecture.md | Modify | [deltas/architecture.md](./deltas/architecture.md) |
| {DOCS_ROOT}/prd.md | Modify | [deltas/prd.md](./deltas/prd.md) |
| {DOCS_ROOT}/architecture/[module]/architecture.md | New | - |

### Modules Affected

| Module | Impact | Description |
|--------|--------|-------------|
| [Module A] | High | [What changes] |
| [Module B] | Low | [What changes] |

### Breaking Changes

- [ ] No breaking changes
- [ ] Breaking changes (describe below)

[If breaking changes, describe migration path]

---

## Proposed Changes

### Change 1: [Title]

**File:** `{DOCS_ROOT}/[path]`

**Current:**
```
[Current text/structure]
```

**Proposed:**
```
[New text/structure]
```

**Rationale:** [Why this change]

### Change 2: [Title]

**File:** `{DOCS_ROOT}/[path]`

**Current:**
```
[Current text/structure]
```

**Proposed:**
```
[New text/structure]
```

**Rationale:** [Why this change]

---

## Alternatives Considered

### Alternative 1: [Name]

[Description and why not chosen]

### Alternative 2: [Name]

[Description and why not chosen]

---

## Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| [Risk 1] | Low/Med/High | Low/Med/High | [How to mitigate] |
| [Risk 2] | Low/Med/High | Low/Med/High | [How to mitigate] |

---

## Implementation Plan

### Tasks

- [ ] [Task 1]
- [ ] [Task 2]
- [ ] [Task 3]

### Timeline

| Phase | Description | Target |
|-------|-------------|--------|
| Draft | Create proposal | YYYY-MM-DD |
| Review | Team review | YYYY-MM-DD |
| Approve | Get approval | YYYY-MM-DD |
| Merge | Apply changes | YYYY-MM-DD |

---

## Approval

### Reviewers

| Name | Role | Status | Date |
|------|------|--------|------|
| [Name] | [Role] | Pending/Approved/Rejected | - |
| [Name] | [Role] | Pending/Approved/Rejected | - |

### Sign-off

- [ ] Architecture review
- [ ] Product review
- [ ] No conflicts with other changes

---

## Deltas

Deltas are stored in `./deltas/` directory:

```
changes/[change-name]/
├── proposal.md          # This file
└── deltas/
    ├── architecture.md  # Changes to architecture.md
    ├── prd.md           # Changes to prd.md
    └── ...
```

---

## After Merge

- [ ] Archive this proposal to `{DOCS_ROOT}/archive/changes/`
- [ ] Update related documents
- [ ] Notify stakeholders
- [ ] Re-validate affected documents
