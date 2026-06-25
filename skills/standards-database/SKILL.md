---
name: standards-database
description: Author and maintain the project's database conventions artifact — table and column naming, ID and timestamp rules, migration policy (forward-only, reversible, zero-downtime), query patterns (parameterized, transactions, no `SELECT *` on hot paths), and the index baseline. Use this whenever the user wants to "write the database standards", "define schema conventions", "set the migration policy", "document query patterns", or mentions "DB naming", "migration rules", "schema conventions", or "SQL style". Authors `{DOCS_ROOT}/standards/database.md`. Distinct from `database-design`, which models a specific feature's schema; this artifact is the **project-wide rules** every model must follow.
---

# Standards — Database

A consistent schema convention means a reader can guess the column name before opening the table. A documented migration policy means a deploy does not lock the production DB for ten minutes. A query baseline means the same N+1 does not ship in two services. The artifact pins these once.

Distinct from `database-design`: that skill designs the schema for one feature; **this skill sets the rules every schema and every query must follow.**

The artifact lives at `{DOCS_ROOT}/standards/database.md`. `{DOCS_ROOT}` defaults to `docs/`. Target size: **8-15 KB**.

Skip this skill if the project does not own persistent storage. If it talks to a database owned by another team, the rules come from that team's standards, not this one.

## What this artifact must cover

1. **Engines** — primary DB (Postgres / MySQL / etc.), supporting stores (Redis, Elastic). Version pins. The engine *decision* lives in its ADR; this artifact records the conventions.
2. **Naming** — tables (plural, snake_case), columns (snake_case), FKs (`{ref_table}_id`), timestamps (`created_at`, `updated_at`, `deleted_at`), booleans (`is_*` / `has_*`). Index naming (`idx_<table>_<cols>`).
3. **IDs** — UUID v7 / ULID / serial? One choice per project. Justification one line.
4. **Money / decimals** — a hard rule: monetary and exact-decimal values are never floats. One representation (integer minor units + currency column, or fixed-precision decimal). Governing ADR linked.
5. **Timestamps** — UTC, `TIMESTAMPTZ`, populated by the DB (`DEFAULT NOW()`), updated by trigger or by ORM convention.
6. **Soft delete** — yes/no. If yes: column name and the rule that every query must filter it.
7. **Migrations** — tool, file naming (`YYYYMMDDHHMM_<slug>.up.sql` + `.down.sql`), forward-only vs reversible, the rule that production migrations must be backwards-compatible for one release (add column nullable, backfill, then drop nullable).
8. **Queries** — parameterized only (forbid string-built SQL), transactions for multi-statement writes, no `SELECT *` on hot paths, every query has an index that covers it.
9. **Index baseline** — primary key, every FK, every column used in WHERE on a hot path. Adding an index is part of the migration, not a follow-up.
10. **System of record** — which data this service owns vs reads from elsewhere. Exactly one owner per piece of data; data owned by another service is read across its contract, never copied as a second source of truth.
11. **Connection / pool pointer** — where the runtime pool config lives. This artifact states the rule (e.g. every query runs under a statement timeout); the runnable values live in the boilerplate.
12. **Backup / recovery / PITR pointer** — one line per topic, links to the runbook (runbook lives elsewhere).
13. **Read replicas, sharding, partitioning** — when each is allowed, who decides.

## How to write it

1. **Read the architecture.** Engine choice and replication shape come from there; this artifact records the conventions, not the decision.
2. **Pick once.** UUIDv7 vs ULID, soft delete vs hard, naming style — make the call and write the reason on one line. Never two answers for one question.
3. **Anchor migrations to deploy reality.** If the project deploys to a hot system, the artifact must include the zero-downtime migration rule. If it is a CLI that deploys offline, simplify.
4. **Cite the governing ADR for decision-shaped rules.** Engine choice, money representation, and the delete policy each trace to a decision, not to this artifact; link the ADR that holds the *why* (see `adr-writing`, `authoring-standards`). On conflict, the ADR wins. Never invent an ADR number.
5. **Rules only — runnable artifacts live in the boilerplate.** The migration tooling config, ORM/codegen config, schema/DDL files, and connection-pool config are maintained in `references/boilerplate`. State the rule here and **reference** the artifact; don't paste a copy that drifts.
6. **Draft from `references/template.md`.**
7. **Validate against `references/checklist.md`.**

## Naming — the project picks one shape

```sql
-- tables
CREATE TABLE users (...);
CREATE TABLE user_roles (...);     -- junction
CREATE TABLE order_items (...);

-- columns
id              UUID PRIMARY KEY,
user_id         UUID NOT NULL REFERENCES users(id),
email           VARCHAR(255) NOT NULL UNIQUE,
is_active       BOOLEAN NOT NULL DEFAULT TRUE,
created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()

-- indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE UNIQUE INDEX uq_users_email ON users(email);
```

## Money — state it as a rule, no exceptions

Monetary and exact-decimal values are never floats. Pick one representation — integer minor units plus a currency column where currency defines scale, or a fixed-precision decimal type — and write it as a rule. The reason is exact arithmetic across services; the governing decision lives in its ADR (`adr-writing`), which the rule cites.

## System of record — one owner per datum

Each piece of data has exactly one owning store. List what this service owns vs what it reads from another service. Data owned elsewhere is read across that service's contract, never copied locally as a second source of truth.

## Zero-downtime migration rule

On a hot system, a single migration may not break the running app. The rule:

1. **Add** in one release (nullable column, new table). Backfill if needed.
2. **Use** in the next release (app starts writing).
3. **Backfill complete + flip** (NOT NULL, drop old column / index) in the release after.

Renaming a column is forbidden in a single deploy; it is "add-new, dual-write, backfill, switch reads, drop-old" across three releases.

## Forbidden in queries

| Pattern | Forbidden | Use |
|---------|-----------|-----|
| String concatenation of user input into SQL | always | parameterized query |
| `SELECT *` on tables with > 5 columns on a hot path | always | enumerate columns |
| `OR` across non-indexed columns | hot path | rewrite or add index |
| Unbounded `LIMIT`-less list on user-driven queries | always | pagination |
| Transaction held open across an external call | always | close, then call |

## Update protocol

- A bug traces to a missing FK or index → add the rule that would have caught it.
- A migration causes downtime → the zero-downtime rule failed; tighten with the exact failure mode.
- A new store joins (Redis, Elasticsearch) → add the section for its conventions.
- Money drifts between two representations → the money rule wasn't enforced; make it a query/review gate.

File the update through `authoring-standards` (reviewed before it propagates); don't fix it in a reviewer's head.

## Templates and references

- `references/template.md` — full `database.md` template.
- `references/checklist.md` — validation checklist for the artifact.

## Who reads this artifact

- `database-design` — every new schema design.
- `dev` — every story that writes a migration or a query.
- `review-correctness` and `review-performance` — to judge N+1, missing indexes, unbounded queries.
- `service-architecture` — when deciding read replicas / partitioning.

## Roles

Authored by the DB owner (DBA, tech lead, architect). Reviewed by the project owner.

## Related

- `standards` — umbrella router.
- `authoring-standards` — cross-cutting authoring rules + ADR/boilerplate discipline; route updates through it.
- `adr-writing` — the decisions (engine, money, delete policy) this artifact cites; the ADR wins on conflict.
- `using-standards` — consumer protocol.
- `database-design` — applies these standards to a specific feature's schema.
- `standards-performance` — for query budgets and hot-path policy.
