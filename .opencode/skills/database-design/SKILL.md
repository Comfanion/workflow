---
name: database-design
description: Use when designing database schema, choosing storage strategy, planning migrations, or optimizing queries for a module or service
license: MIT
compatibility: opencode
metadata:
  domain: software-architecture
  patterns: normalization, indexing, partitioning, migrations
  artifacts: docs/architecture/*/data-model.md
---

# Database Design Skill

## When to Use

Use this skill when you need to:
- Design database schema for new module/service
- Choose database type (relational, document, graph, time-series)
- Plan table structure and relationships
- Design indexes for query optimization
- Plan data migrations (forward/backward compatible)
- Implement partitioning strategy
- Design for scalability and performance

## Reference

Always check project standards: `@CLAUDE.md`

## Templates

- Main: `@.opencode/skills/database-design/template.md`
- Migration: `@.opencode/skills/database-design/template-migration.md`

---

## Database Selection

**No default — choose based on project requirements.**

Analyze requirements → evaluate options → document decision in ADR.

### Selection Criteria

| Criteria | Questions to Answer |
|----------|---------------------|
| **Data model** | Relational? Documents? Key-value? Graph? Time-series? |
| **Consistency** | ACID required? Eventual OK? |
| **Scale** | GB? TB? PB? Read/write ratio? |
| **Query patterns** | Complex JOINs? Full-text? Aggregations? |
| **Deployment** | Cloud managed? Self-hosted? Embedded? Serverless? |
| **Team expertise** | What does team know? Learning curve acceptable? |
| **Cost** | License? Infrastructure? Operations? |

### Relational Databases

| Database | Pros | Cons | Best For |
|----------|------|------|----------|
| **PostgreSQL** | Feature-rich, extensions (JSONB, vectors, FTS), ACID, open-source | Heavier than alternatives, vertical scaling | Complex queries, mixed workloads, extensibility needed |
| **MySQL/MariaDB** | Fast reads, mature, wide hosting support | Less features than PG, replication complexity | Read-heavy web apps, legacy compatibility |
| **SQLite** | Zero config, embedded, single file, serverless | Single writer, no network access | Mobile, desktop apps, dev/test, edge, small projects |
| **CockroachDB** | Distributed SQL, horizontal scaling, ACID | Complexity, latency vs single-node | Global distribution, high availability |
| **TiDB** | MySQL compatible, HTAP, horizontal scaling | Operational complexity | MySQL migration with scale needs |

### Document Databases

| Database | Pros | Cons | Best For |
|----------|------|------|----------|
| **MongoDB** | Flexible schema, horizontal scaling, rich queries | No JOINs, eventual consistency default | Rapid prototyping, variable schemas, content management |
| **CouchDB** | Multi-master replication, offline-first | Limited queries, slower | Sync-heavy apps, offline-first |
| **FerretDB** | MongoDB protocol, PostgreSQL backend | Newer, subset of features | MongoDB API with PostgreSQL storage |

### Key-Value & Cache

| Database | Pros | Cons | Best For |
|----------|------|------|----------|
| **Redis** | Sub-ms latency, data structures, pub/sub | Memory-bound, persistence tradeoffs | Cache, sessions, real-time, queues |
| **Memcached** | Simple, fast, multi-threaded | No persistence, only strings | Pure caching |
| **DragonflyDB** | Redis compatible, better memory efficiency | Newer | Redis replacement at scale |
| **KeyDB** | Redis fork, multi-threaded | Community smaller | High-throughput Redis workloads |

### Search Engines

| Database | Pros | Cons | Best For |
|----------|------|------|----------|
| **Elasticsearch** | Powerful search, analytics, ecosystem | Resource heavy, operational complexity | Full-text search, logging, analytics |
| **OpenSearch** | Elasticsearch fork, open-source | Feature lag | Elasticsearch alternative (AWS) |
| **Meilisearch** | Simple, fast, typo-tolerant | Less features, smaller scale | Simple search, instant search UX |
| **Typesense** | Easy setup, typo-tolerant | Smaller community | Developer-friendly search |

### Vector Databases (AI/ML)

| Database | Pros | Cons | Best For |
|----------|------|------|----------|
| **pgvector** | PostgreSQL extension, familiar | Scale limits vs specialized | Vector search + relational in one DB |
| **Pinecone** | Managed, scalable, simple API | Vendor lock-in, cost | Production AI apps, managed solution |
| **Qdrant** | Open-source, filtering, fast | Self-hosting complexity | Self-hosted vector search |
| **Weaviate** | GraphQL, modules, hybrid search | Heavier | Semantic search, multi-modal |
| **Chroma** | Simple, embedded option | Early stage | Prototyping, small projects |
| **Milvus** | Scalable, open-source | Complex deployment | Large-scale similarity search |

### Time-Series

| Database | Pros | Cons | Best For |
|----------|------|------|----------|
| **TimescaleDB** | PostgreSQL extension, SQL | Single-node limits | Time-series + relational |
| **ClickHouse** | Blazing fast analytics, compression | Column-oriented learning curve | OLAP, analytics, logs at scale |
| **InfluxDB** | Purpose-built, ecosystem | Query language (Flux) | Metrics, IoT, monitoring |
| **QuestDB** | Fast ingestion, SQL | Smaller community | High-frequency time-series |

### Graph Databases

| Database | Pros | Cons | Best For |
|----------|------|------|----------|
| **Neo4j** | Mature, Cypher query language | License cost, scaling | Complex relationships, graph algorithms |
| **Amazon Neptune** | Managed, multiple models | AWS only | Cloud-native graph |
| **ArangoDB** | Multi-model (doc, graph, KV) | Jack of all trades | Flexible data models |

### Message Queues & Streaming

| System | Pros | Cons | Best For |
|--------|------|------|----------|
| **Kafka** | High throughput, durability, ecosystem | Operational complexity | Event streaming, high-volume |
| **RabbitMQ** | Flexible routing, protocols | Lower throughput than Kafka | Task queues, complex routing |
| **NATS** | Simple, fast, lightweight | Less features | Microservices, IoT |
| **Redis Streams** | Built into Redis | Less features than Kafka | Simple streaming with Redis |

### Multi-Storage Architecture

When one database isn't enough:

```
┌─────────────────────────────────────────────────────────┐
│                      Application                         │
└───────┬─────────────┬─────────────┬─────────────┬───────┘
        │             │             │             │
        ▼             ▼             ▼             ▼
   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
   │ Primary │   │  Cache  │   │ Search  │   │ Events  │
   │   DB    │   │         │   │         │   │         │
   └─────────┘   └─────────┘   └─────────┘   └─────────┘
```

**Considerations:**
- Sync complexity (eventual consistency)
- Operational overhead (more systems to manage)
- Cost (licenses, infrastructure, people)
- Data integrity across systems

### Decision Checklist

Before choosing:

- [ ] Requirements documented? (consistency, scale, queries)
- [ ] Multiple options evaluated with pros/cons?
- [ ] Team expertise considered?
- [ ] Operational complexity acceptable?
- [ ] Cost analyzed? (license + infra + ops)
- [ ] Migration path exists if wrong choice?
- [ ] Decision documented in ADR?

---

## Decision Scenarios

### By Project Type

| Project Type | Recommended Approach | Why |
|--------------|---------------------|-----|
| **MVP / Prototype** | SQLite or single PostgreSQL/MySQL | Simplicity, fast iteration, easy to change later |
| **SaaS B2B** | PostgreSQL + Redis cache | Complex queries, multi-tenancy, transactions |
| **Mobile app** | SQLite (local) + sync to cloud DB | Offline-first, embedded |
| **E-commerce** | PostgreSQL/MySQL + Elasticsearch + Redis | Transactions + search + cache |
| **Analytics platform** | ClickHouse / BigQuery + PostgreSQL (metadata) | OLAP for data, OLTP for config |
| **Real-time chat** | Redis/KeyDB + PostgreSQL (history) | Speed for live, durability for archive |
| **IoT / Telemetry** | TimescaleDB / InfluxDB / QuestDB | Time-series optimized |
| **AI/ML application** | PostgreSQL + pgvector OR dedicated vector DB | Embeddings + relational data |
| **Content platform** | MongoDB or PostgreSQL + S3 | Flexible content, binary storage |
| **Social network** | PostgreSQL + Neo4j (graph) + Redis | Relations + graph traversals + cache |

### By Scale

| Scale | Data Volume | Approach |
|-------|-------------|----------|
| **Small** | < 100K rows, 1 server | SQLite, single instance any DB |
| **Medium** | 100K-10M rows | Single PostgreSQL/MySQL with replicas |
| **Large** | 10M-1B rows | Sharding, read replicas, caching layer |
| **Massive** | > 1B rows | Distributed DB (CockroachDB, TiDB), specialized stores |

### By Team Size

| Team | Recommendation |
|------|----------------|
| **Solo / 1-2 devs** | SQLite → PostgreSQL. Minimize ops burden |
| **Small team (3-5)** | One primary DB + cache. Avoid polyglot until needed |
| **Medium team (5-15)** | Can handle 2-3 specialized stores if justified |
| **Large team (15+)** | Dedicated DBAs, can manage complex setups |

---

## Selection Rules

### Rule 1: Start Simple

```
IF project is new AND requirements unclear
THEN choose simplest option (SQLite for embedded, PostgreSQL for server)
     AND plan to migrate if needed
```

### Rule 2: Match Data Model

```
IF data is highly relational (JOINs, transactions)
THEN relational DB (PostgreSQL, MySQL)

IF data is documents with variable schema
THEN document DB (MongoDB) OR relational with JSONB

IF data is key-value with TTL
THEN Redis / Memcached

IF data is time-ordered metrics
THEN time-series DB (TimescaleDB, InfluxDB)

IF data is embeddings for similarity
THEN vector DB OR PostgreSQL + pgvector
```

### Rule 3: Consider Consistency Requirements

```
IF financial transactions OR inventory
THEN ACID required → relational DB with transactions

IF user preferences OR analytics
THEN eventual consistency OK → more options available

IF distributed system with strong consistency
THEN CockroachDB, Spanner, YugabyteDB
```

### Rule 4: Operational Reality

```
IF team has no DBA AND no DevOps
THEN prefer managed services (RDS, PlanetScale, Supabase, Neon)

IF compliance requires data locality
THEN self-hosted OR specific cloud regions

IF budget is limited
THEN open-source + self-hosted OR SQLite
```

### Rule 5: Don't Over-Engineer

```
IF single PostgreSQL can handle the load
THEN don't add Redis "just in case"

IF you're adding a DB "for future scale"
THEN stop — add when actually needed

IF polyglot persistence adds sync complexity
THEN evaluate if benefits outweigh costs
```

---

## Anti-Patterns

### ❌ Don't Do This

| Anti-Pattern | Problem | Better Approach |
|--------------|---------|-----------------|
| **MongoDB for everything** | Loses relational benefits, JOINs in app code | Use relational for relational data |
| **Microservice = own DB type** | Operational nightmare, 10 different DBs | Standardize on 1-2 types across services |
| **Redis as primary store** | Persistence is tricky, data loss risk | Redis for cache, real DB for persistence |
| **Premature sharding** | Complexity before it's needed | Vertical scaling first, shard when measured need |
| **Elasticsearch as primary** | Not designed for ACID, sync issues | ES for search, source of truth elsewhere |
| **Ignoring team expertise** | Steep learning curve, bugs, slow delivery | Factor in what team knows |
| **Choosing by hype** | New ≠ better, production readiness matters | Evaluate maturity, community, support |
| **No migration plan** | Stuck with wrong choice forever | Always consider "what if we need to change" |

### ⚠️ Warning Signs

| Sign | What It Means |
|------|---------------|
| "Let's use X, I've been wanting to try it" | Technology-driven, not requirement-driven |
| "We might need scale someday" | Premature optimization |
| "Everyone uses MongoDB now" | Hype-driven, not analysis-driven |
| "PostgreSQL is boring" | Boring = proven, stable, predictable |
| "We need real-time so Redis for everything" | Misunderstanding use cases |
| Adding 4th database to architecture | Complexity explosion, reconsider |

---

## Example Architectures

### Example 1: SaaS Task Management

```
Requirements:
- Multi-tenant (100s of companies)
- Real-time updates
- Full-text search in tasks
- Audit trail

Architecture:
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ PostgreSQL  │────►│    Redis    │────►│   Client    │
│ (primary)   │     │ (pub/sub,   │     │             │
│             │     │  cache)     │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
       │
       │ CDC/trigger
       ▼
┌─────────────┐
│ Meilisearch │ (search)
└─────────────┘

Why:
- PostgreSQL: ACID for tasks, RLS for multi-tenancy
- Redis: pub/sub for real-time, session cache
- Meilisearch: simple search, typo-tolerant
```

### Example 2: E-commerce Platform

```
Requirements:
- Product catalog (1M+ products)
- Order transactions
- Search with facets
- Recommendations

Architecture:
┌─────────────┐     ┌─────────────┐
│   MySQL     │     │ Elasticsearch│
│ (orders,    │────►│ (product    │
│  inventory) │     │  search)    │
└─────────────┘     └─────────────┘
       │                   
       │            ┌─────────────┐
       └───────────►│   Redis     │
                    │ (cart,cache)│
                    └─────────────┘
                           
┌─────────────┐
│  pgvector/  │ (recommendations)
│  Qdrant     │
└─────────────┘

Why:
- MySQL: proven for e-commerce, transactions
- Elasticsearch: faceted search, filters
- Redis: cart sessions, product cache
- Vector DB: "similar products" recommendations
```

### Example 3: Mobile App with Offline

```
Requirements:
- Works offline
- Syncs when online
- Simple data model

Architecture:
┌─────────────────────────────────────┐
│             Mobile App              │
│  ┌─────────────┐                    │
│  │   SQLite    │ (local)            │
│  └──────┬──────┘                    │
└─────────┼───────────────────────────┘
          │ sync
          ▼
┌─────────────────────────────────────┐
│           Backend API               │
│  ┌─────────────┐                    │
│  │ PostgreSQL  │ (cloud)            │
│  └─────────────┘                    │
└─────────────────────────────────────┘

Why:
- SQLite: embedded, zero-config, offline
- PostgreSQL: server-side, handles conflicts
- Sync: custom or use Supabase/Firebase
```

### Example 4: Analytics Dashboard

```
Requirements:
- Ingest 1M events/day
- Fast aggregations
- Historical queries

Architecture:
┌─────────────┐     ┌─────────────┐
│   Kafka     │────►│ ClickHouse  │
│ (ingest)    │     │ (analytics) │
└─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ PostgreSQL  │
                    │ (metadata,  │
                    │  users)     │
                    └─────────────┘

Why:
- Kafka: handles high-volume ingest
- ClickHouse: columnar, fast aggregations
- PostgreSQL: user accounts, dashboard configs
```

---

## Schema Design Process

### Step 1: Identify Entities

From requirements/PRD, extract:
- **Core entities** — Main business objects
- **Supporting entities** — Lookup tables, configs
- **Junction tables** — M:N relationships

### Step 2: Define Relationships

| Relationship | Implementation | Example |
|--------------|----------------|---------|
| 1:1 | FK in either table OR same table | user ↔ profile |
| 1:N | FK in "many" side | user → posts |
| M:N | Junction table | users ↔ roles |
| Hierarchy | Self-referencing FK OR nested set | categories |
| Polymorphic | Type column + nullable FKs OR separate tables | comments on posts/tasks |

### Step 3: Normalize (then Denormalize)

#### Normalization Levels

| Form | Rule | Check |
|------|------|-------|
| **1NF** | Atomic values, no arrays in columns | Each cell = one value |
| **2NF** | No partial dependencies | All non-key columns depend on FULL PK |
| **3NF** | No transitive dependencies | Non-key columns don't depend on other non-key |
| **BCNF** | Every determinant is a candidate key | Advanced, rare |

#### When to Denormalize

| Situation | Denormalization |
|-----------|-----------------|
| Read-heavy, rarely changes | Duplicate for read speed |
| Reporting/analytics | Materialized views |
| Cross-module data | Cache foreign data locally |
| Computed values | Store calculated fields |

**Rule:** Normalize first, denormalize with measured reason.

### Step 4: Design Indexes

#### Index Types

| Type | PostgreSQL | Use For |
|------|------------|---------|
| B-tree | `CREATE INDEX` (default) | Equality, range, sorting |
| Hash | `USING hash` | Equality only, faster |
| GiST | `USING gist` | Geometric, full-text |
| GIN | `USING gin` | Arrays, JSONB, full-text |
| BRIN | `USING brin` | Large tables, sorted data |

#### Index Strategy

```sql
-- Primary key (automatic)
PRIMARY KEY (id)

-- Foreign keys (CREATE MANUALLY!)
CREATE INDEX idx_tasks_user_id ON tasks(user_id);

-- Common queries
CREATE INDEX idx_tasks_status ON tasks(status) WHERE status != 'archived';

-- Composite (order matters!)
CREATE INDEX idx_tasks_user_status ON tasks(user_id, status);

-- Covering index (includes columns)
CREATE INDEX idx_tasks_list ON tasks(user_id) INCLUDE (title, status);
```

#### Index Anti-Patterns

| Anti-Pattern | Problem |
|--------------|---------|
| Index every column | Write overhead, storage |
| Missing FK indexes | Slow JOINs, lock contention |
| Wrong column order in composite | Not used for queries |
| Over-indexing low-cardinality | B-tree inefficient for few values |

---

## Table Conventions

### Naming

```sql
-- Tables: plural, snake_case
users, task_comments, user_roles

-- Columns: snake_case
created_at, user_id, is_active

-- Primary keys: id (uuid or bigint)
id UUID PRIMARY KEY DEFAULT gen_random_uuid()

-- Foreign keys: {table_singular}_id
user_id UUID REFERENCES users(id)

-- Timestamps: _at suffix
created_at, updated_at, deleted_at
```

### Standard Columns

```sql
-- Every table should have
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

-- Soft delete (if needed)
deleted_at TIMESTAMPTZ

-- Multi-tenant
tenant_id UUID NOT NULL REFERENCES tenants(id)
```

### Constraints

```sql
-- NOT NULL by default, NULL explicitly
email VARCHAR(255) NOT NULL,
bio TEXT  -- nullable explicitly documented

-- CHECK constraints for business rules
CHECK (status IN ('draft', 'active', 'archived'))
CHECK (price >= 0)
CHECK (start_date < end_date)

-- UNIQUE constraints
UNIQUE (tenant_id, email)  -- scoped uniqueness
```

---

## Common Patterns

### Soft Delete

```sql
-- Column
deleted_at TIMESTAMPTZ

-- Index for active records
CREATE INDEX idx_users_active ON users(id) WHERE deleted_at IS NULL;

-- Application: always filter
SELECT * FROM users WHERE deleted_at IS NULL;
```

### Audit Trail (History)

```sql
-- Option 1: History table
CREATE TABLE tasks_history (
    history_id UUID PRIMARY KEY,
    task_id UUID NOT NULL,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    changed_by UUID,
    operation VARCHAR(10),  -- INSERT, UPDATE, DELETE
    old_data JSONB,
    new_data JSONB
);

-- Option 2: SCD Type 2 (Slowly Changing Dimension)
CREATE TABLE users (
    id UUID,
    email VARCHAR(255),
    name VARCHAR(255),
    valid_from TIMESTAMPTZ NOT NULL,
    valid_to TIMESTAMPTZ,  -- NULL = current
    is_current BOOLEAN GENERATED ALWAYS AS (valid_to IS NULL) STORED,
    PRIMARY KEY (id, valid_from)
);
```

### Multi-Tenancy

```sql
-- Option 1: Tenant column (recommended for most cases)
CREATE TABLE tasks (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    -- ...
);

-- Row-level security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON tasks
    USING (tenant_id = current_setting('app.tenant_id')::uuid);

-- Option 2: Schema per tenant (for strong isolation)
CREATE SCHEMA tenant_abc;
CREATE TABLE tenant_abc.tasks (...);
```

### Enum vs Lookup Table

```sql
-- PostgreSQL ENUM (simple, fixed values)
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'done');
ALTER TABLE tasks ADD COLUMN status task_status;

-- Lookup table (configurable, metadata)
CREATE TABLE task_statuses (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100),
    display_order INT,
    is_terminal BOOLEAN DEFAULT FALSE
);

-- Use lookup when:
-- - Values change at runtime
-- - Need metadata (color, order, permissions)
-- - Multi-tenant with different values
```

### JSONB Usage

```sql
-- Good: Flexible attributes, rare queries
metadata JSONB DEFAULT '{}'

-- Index for queries
CREATE INDEX idx_tasks_metadata ON tasks USING gin(metadata);

-- Query
SELECT * FROM tasks WHERE metadata @> '{"priority": "high"}';

-- Bad: Structured data that needs JOINs, constraints
-- Don't store user_id in JSONB if you need FK constraint
```

---

## Partitioning

### When to Partition

| Signal | Consider Partitioning |
|--------|----------------------|
| Table > 100GB | Yes |
| Time-series data | Yes (by time) |
| Queries always filter by X | Yes (by X) |
| Deleting old data regularly | Yes (DROP partition vs DELETE) |
| < 10M rows, simple queries | No |

### Partition Strategies

```sql
-- Range partitioning (time-series)
CREATE TABLE events (
    id UUID,
    event_time TIMESTAMPTZ NOT NULL,
    data JSONB
) PARTITION BY RANGE (event_time);

CREATE TABLE events_2026_01 PARTITION OF events
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

-- List partitioning (by category)
CREATE TABLE orders (
    id UUID,
    region VARCHAR(10) NOT NULL,
    data JSONB
) PARTITION BY LIST (region);

CREATE TABLE orders_eu PARTITION OF orders FOR VALUES IN ('eu');
CREATE TABLE orders_us PARTITION OF orders FOR VALUES IN ('us');

-- Hash partitioning (even distribution)
PARTITION BY HASH (tenant_id);
```

---

## Migrations

### Migration Rules

1. **Forward compatible** — New code works with old schema
2. **Backward compatible** — Old code works with new schema
3. **Small, incremental** — One change per migration
4. **Reversible** — Include DOWN migration
5. **Tested** — Run on copy of production data

### Safe Migration Patterns

| Change | Safe Way |
|--------|----------|
| Add column | `ADD COLUMN ... DEFAULT NULL` (no lock) |
| Add NOT NULL column | Add nullable → backfill → add constraint |
| Remove column | Stop using → deploy → remove |
| Rename column | Add new → copy → remove old |
| Add index | `CREATE INDEX CONCURRENTLY` |
| Change type | Add new column → migrate → remove old |

### Dangerous Operations

```sql
-- ❌ LOCKS TABLE
ALTER TABLE tasks ADD COLUMN status VARCHAR NOT NULL DEFAULT 'todo';

-- ✅ SAFE
ALTER TABLE tasks ADD COLUMN status VARCHAR;
UPDATE tasks SET status = 'todo' WHERE status IS NULL; -- batched
ALTER TABLE tasks ALTER COLUMN status SET NOT NULL;
ALTER TABLE tasks ALTER COLUMN status SET DEFAULT 'todo';
```

### Migration File Format

```sql
-- migrations/20260124_001_add_status_to_tasks.sql

-- +migrate Up
ALTER TABLE tasks ADD COLUMN status VARCHAR(50);
CREATE INDEX CONCURRENTLY idx_tasks_status ON tasks(status);

-- +migrate Down
DROP INDEX CONCURRENTLY IF EXISTS idx_tasks_status;
ALTER TABLE tasks DROP COLUMN IF EXISTS status;
```

---

## Query Optimization

### EXPLAIN Checklist

```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT * FROM tasks WHERE user_id = '...' AND status = 'active';
```

| Look For | Problem | Fix |
|----------|---------|-----|
| `Seq Scan` on large table | Missing index | Add index |
| High `rows` estimate vs actual | Stale statistics | `ANALYZE table` |
| `Sort` with high cost | Missing index for ORDER BY | Add covering index |
| Nested Loop on large sets | Inefficient JOIN | Add index, rewrite query |

### Common Optimizations

```sql
-- Pagination: cursor-based (not OFFSET)
-- ❌ Slow for large offsets
SELECT * FROM tasks ORDER BY created_at LIMIT 20 OFFSET 10000;

-- ✅ Fast cursor-based
SELECT * FROM tasks 
WHERE created_at < '2026-01-20T10:00:00Z' 
ORDER BY created_at DESC LIMIT 20;

-- Batch operations
-- ❌ One by one
UPDATE tasks SET status = 'archived' WHERE ...;

-- ✅ Batched
UPDATE tasks SET status = 'archived' 
WHERE id IN (SELECT id FROM tasks WHERE ... LIMIT 1000);

-- Count estimation (for UI "~1000 results")
SELECT reltuples::bigint FROM pg_class WHERE relname = 'tasks';
```

---

## Validation Checklist

Before completing database design:

- [ ] Entity relationships documented (ERD)
- [ ] All tables have PK, created_at, updated_at
- [ ] Foreign keys have indexes
- [ ] Naming follows conventions
- [ ] Constraints enforce business rules
- [ ] Query patterns have supporting indexes
- [ ] Soft delete strategy defined (if needed)
- [ ] Multi-tenancy strategy defined (if needed)
- [ ] Migration strategy for schema changes
- [ ] Data retention/archival plan
- [ ] Backup strategy documented

---

## Output

- Schema: `docs/architecture/{module}/data-model.md`
- Migrations: `migrations/YYYYMMDD_NNN_description.sql`
- ERD: `docs/diagrams/data/{module}-erd.md`

## Related Skills

- `architecture-design` — Database is part of architecture
- `unit-writing` — Includes data-model.md
- `adr-writing` — Document database decisions
- `diagram-creation` — ER diagrams
