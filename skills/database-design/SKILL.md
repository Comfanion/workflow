---
name: database-design
description: Use when the user wants to **design a relational schema for a specific feature or area** — model entities and relationships, normalize to 3NF then denormalize with a measured reason, enforce constraints (NOT NULL, CHECK, UNIQUE, foreign keys) at the database level, define an indexing strategy, or write safe zero-downtime migrations for that schema. Fire on messages like "design the database", "model these entities", "create the tables for orders and billing", "add foreign keys and constraints", "plan indexes for these queries", "normalize this schema", "write a migration for the new tenants table", or that mention "schema", "data model" (in a *design* sense), "normalization", "indexing", or "query performance". Output is a feature/area schema written to `{DOCS_ROOT}/architecture/<area>/data-model.md`, plus the SQL tables, constraints, indexes, and migration files for that feature. Do NOT fire for these siblings: **unit-writing** — fires when the user wants to *document* an existing module or domain, including capturing its data model as part of unit docs (this skill *designs* the schema; unit-writing *documents* what a module exposes); **standards-database** — fires when the user wants to author the *project-wide* database conventions (naming rules, migration policy, query patterns, index baseline) into `standards/database.md` (this skill *applies* those rules to one feature's schema; it does not write the standards themselves); **research-methodology** — fires when the user is choosing *which* database engine to use (PostgreSQL vs MongoDB vs Redis); engine selection is a research tradeoff, this skill assumes the engine is already decided.
---

# Database Design

This skill turns a set of requirements into a concrete relational schema: the tables, the relationships between them, the constraints that protect the data, the indexes that keep queries fast, and the migrations that get you there without downtime. The examples use PostgreSQL syntax; the principles carry to any relational engine.

The single most common failure in database design is treating the schema as something you can fix later. You cannot — once data is in a table, changing its shape means a migration against live rows, and a careless one locks the table for minutes. So the discipline here is front-loaded: get the names, constraints, and foreign-key indexes right the first time, because they are the cheapest to set and the most expensive to retrofit.

This skill does not cover *which* database to use. Engine selection is a research decision with its own tradeoffs (consistency model, query patterns, operational cost) — handle it with the research-methodology skill before you reach for this one.

## Naming is a contract, not a preference

Pick one convention and never break it, because every query, ORM mapping, and migration in the project reads these names — an inconsistency forces a lookup or, worse, a silent bug. The convention this skill enforces:

| Thing | Convention | Example |
|-------|------------|---------|
| Tables | plural, `snake_case` | `users`, `order_items` |
| Columns | `snake_case` | `created_at`, `user_id` |
| Primary key | `id` (UUID or bigint) | `id UUID PRIMARY KEY` |
| Foreign key | `{table}_id` | `user_id`, `order_id` |
| Timestamps | `*_at` | `created_at`, `updated_at` |
| Booleans | `is_*`, `has_*` | `is_active`, `has_permission` |
| Junction tables | `{table1}_{table2}` | `user_roles`, `product_categories` |

The `{table}_id` rule for foreign keys matters most: it makes the relationship between two tables readable from the column name alone, and it lets tooling infer joins. Keep the column name and the domain concept aligned — if the domain calls it a "merchant", the column is `merchant_id`, not `vendor_id` or `seller_id`. A mismatch between the field name and the domain term it represents is a defect, because the next person reads the column name and trusts it.

## Standard columns every table carries

Add these to every table without thinking about it, because the moment you need them retroactively you are writing a migration against live data:

```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
```

Two optional columns, added only when the requirement is real:

- `deleted_at TIMESTAMPTZ` — for soft delete, when the business needs to recover or audit removed rows rather than truly drop them.
- `tenant_id UUID NOT NULL REFERENCES tenants(id)` — for multi-tenancy, when rows from different customers share a table and must be isolated.

Do not add these speculatively. A `deleted_at` on a table that never soft-deletes is dead weight that every query must remember to filter.

## Model relationships by their cardinality

Each relationship shape has one correct implementation. Get it wrong and you either lose referential integrity or fight the schema forever:

- **One-to-one** — foreign key with a `UNIQUE` constraint in either table, or fold the columns into one table if they are always read together.
- **One-to-many** — foreign key on the "many" side. This is the default; the "one" side never holds a list.
- **Many-to-many** — a junction table whose primary key is the pair of foreign keys. Never simulate this with arrays or comma-separated strings.
- **Hierarchy** — a self-referencing `parent_id`, or a nested-set model when reads vastly outnumber writes.

The full reasoning, with worked SQL for each shape (including polymorphic relationships), lives in the schema-design guide — load `references/schema-design.md` when you are actually laying out tables.

## Normalize first, denormalize only with a measured reason

Normalize to third normal form (3NF) by default, because normalization is what prevents update anomalies — the same fact stored in two places that drift apart. The progression:

- **1NF** — atomic values, no arrays or repeating groups in a column.
- **2NF** — every non-key column depends on the *whole* primary key, not part of it.
- **3NF** — no non-key column depends on another non-key column (no transitive dependencies).

Denormalize *after* you have a normalized model and a measured reason: a read-heavy path that rarely changes, a reporting query that joins too many tables, or a computed value that is expensive to recalculate. When you denormalize, write down *why* in a comment, because the next person will otherwise assume it is a mistake and "fix" it. The schema-design guide (`references/schema-design.md`) has the full normal-form examples and the denormalization checklist.

## Push constraints into the database

Enforce data rules at the database level, not just in application code, because the database is the last line of defense — every code path, every script, every manual fix goes through it, and only it can guarantee the rule holds for every row:

- `NOT NULL` by default; make a column nullable only when "unknown" is a meaningful state, and document why.
- `CHECK` for value rules — allowed enum values, non-negative amounts, ordered date ranges.
- `UNIQUE` for uniqueness, scoped where the domain requires it (e.g. `UNIQUE (tenant_id, email)` means email is unique *per tenant*, not globally).

A constraint in application code alone is a suggestion; a constraint in the schema is a guarantee.

## Index foreign keys — this is the rule people forget

Indexes are how the database avoids scanning whole tables, and the order of disciplines matters:

- **Primary keys** are indexed automatically.
- **Foreign keys are NOT.** You must create the index manually. This is the single most common performance bug in a new schema — an unindexed foreign key turns every join and every cascading delete into a full table scan, and it causes lock contention under load. Every `{table}_id` column gets its own `CREATE INDEX`.
- **WHERE / ORDER BY / JOIN columns** get indexed when queries filter or sort on them frequently.
- **Composite indexes** are ordered most-selective-column-first, and they only serve queries that filter on a leading prefix of their columns.

Do not index every column — each index adds write overhead and storage, and low-cardinality columns rarely benefit. The full decision table (index types, partial indexes, covering indexes, anti-patterns) is in the indexing guide — load `references/indexing.md` when tuning query performance.

## Migrations must be safe by construction

A migration runs against live production rows, so an unsafe one is an outage. Five rules make a migration safe:

1. **Forward compatible** — new code must work against the old schema (so you can deploy code before the migration).
2. **Backward compatible** — old code must work against the new schema (so a rollback does not break).
3. **Incremental** — one logical change per migration.
4. **Reversible** — always include a DOWN migration.
5. **Tested** — run it on a copy of production data and measure how long it locks.

The traps that cause outages: adding a `NOT NULL DEFAULT` column in one step (rewrites the whole table under a lock), changing a column type in place, and adding a foreign key before its index exists. The safe form of each is a multi-step sequence — add nullable, backfill in batches, then constrain. The migrations guide (`references/migrations.md`) has the safe-pattern recipes, the dangerous patterns to avoid, the file-naming and versioning scheme, and a ready-to-fill migration template.

## A complete table, end to end

```sql
CREATE TABLE orders (
    -- Standard columns
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Multi-tenancy
    tenant_id UUID NOT NULL REFERENCES tenants(id),

    -- Business columns
    user_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(50) NOT NULL
        CHECK (status IN ('pending', 'paid', 'shipped', 'cancelled'))
        DEFAULT 'pending',
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0),

    -- Soft delete
    deleted_at TIMESTAMPTZ
);

-- Index the foreign keys — they are NOT indexed automatically
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_tenant_id ON orders(tenant_id);

-- Partial index for the common "active, unshipped" query
CREATE INDEX idx_orders_status ON orders(status)
    WHERE status != 'shipped' AND deleted_at IS NULL;
```

## Where the design lives

Write the resulting data model to `{DOCS_ROOT}/architecture/<area>/data-model.md`, alongside the rest of the architecture documents. `{DOCS_ROOT}` defaults to `docs/` at the project root; honor the project's configured docs location if one is set.

## References

Load these only when you reach the matching step — the SKILL above is enough for the common case:

- `references/schema-design.md` — load when laying out tables: entity types, every relationship shape in full SQL, the normal forms with bad/good examples, naming, standard columns, and constraints.
- `references/indexing.md` — load when tuning query performance: index types, when (and when not) to index, composite/covering/partial indexes, anti-patterns, and how to find unused indexes.
- `references/migrations.md` — load when writing a migration: safe and dangerous patterns side by side, the migration template, versioning, and batching large backfills.

## Roles

This skill is written for whoever holds the architecture or backend role — the person turning requirements into a schema. The data model is reviewed by the project owner before any migration touches a live database.
