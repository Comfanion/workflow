---
name: database-design
description: Design database schema, plan migrations, define indexing strategy, optimize queries, and establish naming conventions. Use when designing database, creating schema, planning migrations, or when user mentions "database design", "schema", "migrations", "database optimization", "indexing", or "query performance". For DB type selection, use research-methodology skill.
license: MIT
compatibility: opencode
metadata:
  domain: software-architecture
  patterns: normalization, indexing, partitioning, migrations
  artifacts: docs/architecture/*/data-model.md
---

# Database Design Skill

```xml
<database_design>
  <definition>Design database schema, plan migrations, optimize queries</definition>
  
  <note>For choosing DB type (PostgreSQL vs MongoDB vs Redis etc.) - use research-methodology skill for deep research</note>
  
  <guides>
    <schema>Entities, relationships, normalization → See [schema-design.md](schema-design.md)</schema>
    <indexing>Index types, strategies, optimization → See [indexing.md](indexing.md)</indexing>
    <migrations>Safe patterns, zero-downtime → See [migrations.md](migrations.md)</migrations>
    <patterns>Soft delete, audit, multi-tenancy → See patterns.md</patterns>
    <optimization>EXPLAIN, pagination, batching → See optimization.md</optimization>
  </guides>
  
  <quick_reference>
    <naming>
      <tables>plural, snake_case (users, order_items)</tables>
      <columns>snake_case (created_at, user_id)</columns>
      <pk>id (UUID or bigint)</pk>
      <fk>{table}_id (user_id, task_id)</fk>
    </naming>
    
    <standard_columns>
      <every_table>id, created_at, updated_at</every_table>
      <soft_delete>deleted_at TIMESTAMPTZ</soft_delete>
      <multi_tenant>tenant_id UUID REFERENCES tenants(id)</multi_tenant>
    </standard_columns>
    
    <relationships>
      <one_to_one>FK in either table</one_to_one>
      <one_to_many>FK in "many" side</one_to_many>
      <many_to_many>Junction table</many_to_many>
    </relationships>
    
    <indexes>
      <pk>Automatic</pk>
      <fk>CREATE MANUALLY! (critical)</fk>
      <where>Index columns in WHERE, ORDER BY</where>
      <composite>Order matters! Most selective first</composite>
    </indexes>
  </quick_reference>
  
  <critical_rules>
    <normalize_first>Normalize to 3NF, then denormalize with reason</normalize_first>
    <index_fk>Always index foreign keys</index_fk>
    <safe_migrations>Forward/backward compatible, incremental, tested</safe_migrations>
    <use_constraints>NOT NULL, CHECK, UNIQUE at database level</use_constraints>
  </critical_rules>
</database_design>
```

---

## Detailed Guides

**Schema Design:**
- [schema-design.md](schema-design.md) - Entities, relationships, normalization, naming, constraints

**Indexing:**
- [indexing.md](indexing.md) - Index types, strategies, composite indexes, optimization

**Migrations:**
- [migrations.md](migrations.md) - Safe patterns, zero-downtime, versioning

**Patterns:** (coming soon)
- Soft delete, audit trail, multi-tenancy, JSONB, partitioning

**Optimization:** (coming soon)
- EXPLAIN analysis, pagination, batching, query optimization

---

## Quick Example

```sql
-- Standard table structure
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
        CHECK (status IN ('pending', 'paid', 'shipped'))
        DEFAULT 'pending',
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
    
    -- Soft delete
    deleted_at TIMESTAMPTZ
);

-- Indexes (CRITICAL: index foreign keys!)
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_tenant_id ON orders(tenant_id);
CREATE INDEX idx_orders_status ON orders(status) 
    WHERE status != 'shipped' AND deleted_at IS NULL;
```

---

## Migration Example

```sql
-- Safe: Add NOT NULL column in steps
-- Step 1: Add nullable
ALTER TABLE tasks ADD COLUMN status VARCHAR(50);

-- Step 2: Backfill
UPDATE tasks SET status = 'todo' WHERE status IS NULL;

-- Step 3: Add constraint
ALTER TABLE tasks ALTER COLUMN status SET NOT NULL;

-- Step 4: Add index
CREATE INDEX CONCURRENTLY idx_tasks_status ON tasks(status);
```

For full details, see the guides above.
