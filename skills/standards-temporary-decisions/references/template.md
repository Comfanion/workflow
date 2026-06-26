---
type: standard                                # controlled vocab — primary filter for agents
title: Temporary Decisions
description: Living backlog of conscious shortcuts and their payoff triggers.
domain: temporary-decisions                   # dedup axis: one ledger per project
status: draft                                 # draft | approved | deprecated | superseded
tags: [tech-debt, ledger]                     # free-form filter labels
updated: {{YYYY-MM-DDThh:mmZ}}                 # OKF timestamp — last meaningful change
related: []                                    # cross-links; sibling standards under docs/standards/
---

# Temporary Decisions

> The living backlog of conscious shortcuts. Each entry is a debt with a name, a price, and a payoff trigger. See `skills/standards-temporary-decisions/SKILL.md` for the read/write protocol.

## Reading guide

This is a ledger, not a rule doc — read by status, not by altitude. The whole ledger is the source of truth when in doubt.

| If you are… | Read |
|-------------|------|
| **Planning** a sprint (decomposition) | Open + In Progress, sorted by deadline — the debt cheapest to clear next |
| **Implementing** (dev) | Open / In Progress entries touching the file you change, and their `// TD-NN` code refs |
| **Reviewing** (reviewer) | reconcile Open / In Progress entries against the `// TD-NN` refs in the diff — an orphan either way is a finding |

## Open

### TD-01 — <short title>

- **Decision:** <what shortcut is in place, `path/file:line` if applicable>
- **Why shortcut:** <constraint that forced it — date pressure, missing API, unclear requirement>
- **Cost if kept:** <what breaks or hurts the longer this stays>
- **Trigger to revisit:** <concrete event or condition that ends this; not "someday">
- **Deadline:** <YYYY-MM-DD>
- **Owner:** <name / @handle>
- **Status:** `open`

### TD-02 — <short title>

…

## In Progress

### TD-NN — <short title>

…

## Accepted as Permanent

Entries here are awaiting an ADR via `adr-writing`. After the ADR lands, remove the entry and replace with a one-line pointer.

### TD-NN — <short title>

…

→ Pending ADR: `docs/adrs/<slug>.md`

## Resolved (last quarter)

### TD-NN — <short title> ✅

- Resolved in: <PR / commit reference>
- Resolution date: <YYYY-MM-DD>

## Archived

Entries older than one quarter live in `docs/archive/standards/temporary-decisions/<year-Q>.md`.
