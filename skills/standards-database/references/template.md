# Database Standards

**Project:** {{project_name}}
**Engine:** {{Postgres 15 | MySQL 8 | ...}}
**Last updated:** {{date}}

## 1. Engines

- Primary: {{engine + version}}.
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

## 9. Connections and Pools

- Pool size: {{N}} per pod.
- Statement timeout: {{ms}}.
- Idle timeout: {{ms}}.

## 10. Backup / Recovery

- Backup cadence: {{daily}}.
- PITR window: {{N days}}.
- Runbook: {{path/to/runbook.md}}.

## 11. Read Replicas / Partitioning / Sharding

- Read replicas: {{when allowed, who decides}}.
- Partitioning: {{policy or "not used"}}.
- Sharding: {{policy or "not used"}}.
