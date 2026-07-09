---
type: standard                                # controlled vocab — primary filter for agents
title: Database Standards
description: Schema naming, migrations, and query patterns.
domain: database                              # dedup axis: one standard per subject
status: draft                                 # draft | approved | deprecated | superseded
tags: [database, conventions]                 # free-form filter labels
timestamp: {{YYYY-MM-DDThh:mmZ}}                 # OKF timestamp — last meaningful change
related: []                                    # cross-links; sibling standards under docs/standards/
---

# Database Standards

**Engine:** {{Postgres 15 | MySQL 8 | ...}}
**Governing ADR(s):** {{ADR-NNN link, or "—"}}

## Reading guide

Section-addressable — read only the sections your task needs; the whole doc is the source of truth when in doubt.

| If you are… | Read |
|-------------|------|
| **Designing** (architect / planner) | §1 Engines · §3 IDs · §3b Money / decimals · §9 System of record · §12 Read replicas / partitioning / sharding |
| **Implementing** (dev) | §2 Naming · §4 Timestamps · §5 Soft delete · §6 Migrations · §7 Queries · §8 Index baseline · §10 Connections and pools |
| **Reviewing** (reviewer) | §6 Migrations (safety) · §7 Queries · §8 Index baseline |

## 1. Engines

- Primary: {{engine + version}} — chosen in {{ADR-NNN link}}; this doc records conventions, not the decision.
- Cache / supporting: {{Redis | Memcached | ...}}.
- Search: {{Elasticsearch | OpenSearch | none}}.

## 2. Naming

| Element | Convention | Example |
|---------|-----------|---------|
| Tables | plural, snake_case | `users`, `order_items` |
| Junctions | combined, snake_case | `user_roles` |
| Columns | snake_case | `user_id`, `created_at` |
| Foreign keys | `{ref}_id` | `user_id` |
| Booleans | `is_*` / `has_*` | `is_active` |
| Timestamps | `created_at`, `updated_at`, `deleted_at` | UTC, `TIMESTAMPTZ` |
| Indexes | `idx_<table>_<cols>` | `idx_orders_user_id` |
| Unique indexes | `uq_<table>_<cols>` | `uq_users_email` |

## 3. IDs

- Type: {{UUIDv7 | ULID | bigserial}}.
- Reason: {{one-line justification}}.

## 3b. Money / Decimals

- Representation: {{integer minor units + currency column | fixed-precision decimal type}}.
- Rule: monetary and exact-decimal values are **never** stored as float.
- Reason: exact arithmetic across services. Governing decision: {{ADR-NNN link}}.

## 4. Timestamps

- All `TIMESTAMPTZ`, stored UTC.
- `created_at` default `NOW()`.
- `updated_at` set by ORM convention or by trigger.

## 5. Soft Delete

- Policy: {{enabled | disabled}}.
- Column: `deleted_at TIMESTAMPTZ NULL`.
- Rule: every read query filters `deleted_at IS NULL` unless the caller is the audit / admin path.

## 6. Migrations

- Tool: {{golang-migrate | flyway | atlas | sqlx | rails}}.
- File naming: `YYYYMMDDHHMM_<slug>.up.sql` + `<...>.down.sql`.
- Reversibility: every migration ships a `.down`. Exceptions documented in the file header.

### Zero-downtime rule

On hot systems, every schema change is rolled out across releases:

1. **Add** — nullable column, new table.
2. **Backfill + use** — app dual-writes; backfill runs.
3. **Flip** — NOT NULL, drop old column / index.

Renames are forbidden in a single deploy: add-new, dual-write, backfill, switch reads, drop-old.

## 7. Queries

- Always parameterized.
- Transactions for multi-statement writes.
- No `SELECT *` on tables wider than 5 columns on a hot path.
- Every query on a hot path has a covering index.
- No transaction held across an external call.

## 8. Index Baseline

- Primary key on every table.
- Index on every FK column.
- Index on every column in WHERE on a hot path.
- Adding an index is part of the same migration as the query that needs it.

## 9. System of Record

| Data | Owned here? | Source of truth |
|------|-------------|-----------------|
| {{entity}} | {{yes / no}} | {{this service / other service}} |

Each datum has exactly one owner. Data owned by another service is read across its contract, never copied as a second source of truth.

## 10. Connections and Pools

- Pool size, statement timeout, idle timeout: set in the boilerplate ({{path/in/boilerplate}}).
- Rule: {{one line — e.g. "every query runs under a statement timeout"}}. This doc states the rule; the boilerplate holds the values.

## 11. Backup / Recovery

- Backup cadence: {{daily}}.
- PITR window: {{N days}}.
- Runbook: {{path/to/runbook.md}}.

## 12. Read Replicas / Partitioning / Sharding

- Read replicas: {{when allowed, who decides}}.
- Partitioning: {{policy or "not used"}}.
- Sharding: {{policy or "not used"}}.
