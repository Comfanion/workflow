---
type: test-scenarios                          # controlled vocab — primary filter for agents
title: Test Scenarios — [Feature]
description: {{one line — the feature these scenarios cover}}
domain: {{feature/domain under test}}         # dedup axis: one scenarios doc per feature
status: draft                                 # draft | approved | deprecated | superseded
tags: [{{tag}}, {{tag}}]                       # free-form filter labels
timestamp: {{YYYY-MM-DDThh:mmZ}}                 # OKF timestamp — last meaningful change
author: {{author}}
related: []                                    # cross-links; e.g. the acceptance-criteria doc
---

# Test Scenarios — [Feature]

**Feature:** [name]
**Acceptance criteria source:** [link to {DOCS_ROOT}/acceptance-criteria/...]

> One row per concrete case. Fill in real input data and a real expected result — no placeholders.
> Keep this document living during development: add cases as branches, validations, and edge cases surface.

---

## Scenarios by behavior

### [Behavior 1 — e.g. Create product]

| Case ID | Technique | Setup / Given | Input (concrete) | Expected result (concrete) | Covers AC |
|---------|-----------|---------------|------------------|----------------------------|-----------|
| TS-001 | happy path | authenticated merchant | `{name:"Shoe", price:10}` | 201, body has UUID, status `pending`, event `product.created` | FR-001-AC1 |
| TS-002 | boundary | authenticated merchant | `{name:"Shoe", price:0}` | 400, `price: must be > 0`, nothing persisted | FR-001-AC2 |
| TS-003 | error guess | authenticated merchant | `{name:"", price:10}` | 400, `name: required`, nothing persisted | FR-001-AC2 |
| TS-004 | negative/abuse | user without `product:create` | valid payload | 403, nothing persisted | FR-001-AC3 |

### [Behavior 2 — e.g. Status transitions]

State-transition matrix — one case per cell (✓ legal, ✗ must be rejected):

| From \ To | draft | pending | active | archived |
|-----------|-------|---------|--------|----------|
| draft     | —     | ✓ TS-010 | ✗ TS-011 | ✗ TS-012 |
| active    | ✗ TS-013 | ✗ | — | ✓ TS-014 |
| archived  | ✗ TS-015 | ✗ | ✗ | ✗ TS-016 (idempotent) |

### [Behavior 3 — decision table example]

| Row | Cond A | Cond B | Cond C | Expected | Case ID |
|-----|--------|--------|--------|----------|---------|
| 1 | T | T | T | [outcome] | TS-020 |
| 2 | T | T | F | [outcome] | TS-021 |
| … | | | | | |

---

## Input partitions checklist (per input field)

For each significant field, confirm a representative case exists:

- [ ] valid (typical)
- [ ] each invalid class (out of range, wrong type, wrong format)
- [ ] missing / null
- [ ] empty / whitespace-only
- [ ] boundary: min, min−1, min+1, max, max−1, max+1
- [ ] degenerate: zero, negative, very long, Unicode/emoji, metacharacters

---

## Coverage matrix (back to acceptance criteria)

| AC ID | Description | Cases covering it | Covered? |
|-------|-------------|-------------------|----------|
| FR-001-AC1 | Create with valid data | TS-001 | ✓ |
| FR-001-AC2 | Reject invalid data | TS-002, TS-003 | ✓ |
| FR-001-AC3 | Reject unauthorized | TS-004 | ✓ |
| FR-00x-ACy | … | — | ✗ GAP |

> Any row marked GAP is an unproven acceptance criterion. Resolve before the QA gate.

---

## Cases discovered during development

> Log cases found while writing the code — the non-obvious domain edges. Fold each into the tables above.

- [date] [what was discovered] → TS-xxx
