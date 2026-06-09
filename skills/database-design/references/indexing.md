# Indexing Strategy

Index types, when to use, and optimization.

## Index Types

| Type | Use Case | Example |
|------|----------|---------|
| **B-tree** | Equality, range, sorting (default) | `WHERE id = X`, `ORDER BY created_at` |
| **Hash** | Equality only (faster) | `WHERE email = X` |
| **GIN** | Arrays, JSONB, full-text | `WHERE tags @> '{tag1}'` |
| **GiST** | Geometric, full-text | `WHERE location <-> point` |
| **BRIN** | Large tables, sorted data | Time-series data |

---

## When to Index

### ✅ Always Index
- **Primary keys** - Automatic
- **Foreign keys** - CREATE MANUALLY! (critical)
- **WHERE clauses** - Frequently filtered columns
- **ORDER BY** - Sorting columns
- **JOIN conditions** - Both sides

### ❌ Don't Index
- Small tables (< 1000 rows)
- Columns with low cardinality (few unique values)
- Frequently updated columns (write overhead)
- Every column (storage waste)

---

## Index Strategies

### Composite Indexes
**Order matters!**

```sql
-- Good for: WHERE user_id = X AND status = Y
CREATE INDEX idx_orders_user_status ON orders(user_id, status);

-- NOT good for: WHERE status = Y (status not first)
-- Need separate index: CREATE INDEX idx_orders_status ON orders(status);
```

**Rule:** Most selective column first.

### Covering Indexes
**Avoid table lookup by including columns**

```sql
-- Query: SELECT id, email FROM users WHERE status = 'active'
CREATE INDEX idx_users_status_covering 
    ON users(status) INCLUDE (email);
```

### Partial Indexes
**Index subset of rows**

```sql
-- Only index active users
CREATE INDEX idx_users_active 
    ON users(id) WHERE deleted_at IS NULL;

-- Only index pending orders
CREATE INDEX idx_orders_pending 
    ON orders(id) WHERE status = 'pending';
```

---

## Common Patterns

### Foreign Key Indexes
**CRITICAL: Always index foreign keys**

```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id)
);

-- MUST create this index!
CREATE INDEX idx_orders_user_id ON orders(user_id);
```

**Why:** Slow JOINs, lock contention without index.

### Multi-Column WHERE
```sql
-- Query: WHERE tenant_id = X AND status = Y
CREATE INDEX idx_orders_tenant_status 
    ON orders(tenant_id, status);
```

### ORDER BY + WHERE
```sql
-- Query: WHERE user_id = X ORDER BY created_at DESC
CREATE INDEX idx_orders_user_created 
    ON orders(user_id, created_at DESC);
```

### JSONB Indexing
```sql
-- Index entire JSONB
CREATE INDEX idx_metadata_gin ON products USING gin(metadata);

-- Query
SELECT * FROM products 
WHERE metadata @> '{"category": "electronics"}';
```

---

## Anti-Patterns

### ❌ Missing FK Indexes
```sql
-- Bad: No index on user_id
CREATE TABLE orders (
    user_id UUID REFERENCES users(id)
);
-- Result: Slow JOINs
```

### ❌ Wrong Composite Order
```sql
-- Bad: status first (low cardinality)
CREATE INDEX idx_orders_status_user ON orders(status, user_id);
-- Query: WHERE user_id = X AND status = Y
-- Result: Index not used efficiently
```

### ❌ Indexing Every Column
```sql
-- Bad: Too many indexes
CREATE INDEX idx1 ON orders(user_id);
CREATE INDEX idx2 ON orders(status);
CREATE INDEX idx3 ON orders(created_at);
CREATE INDEX idx4 ON orders(total);
-- Result: Write overhead, storage waste
```

---

## Optimization

### Check Index Usage
```sql
-- Find unused indexes
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY pg_relation_size(indexrelid) DESC;
```

### Create Index Concurrently
```sql
-- Don't lock table
CREATE INDEX CONCURRENTLY idx_orders_status ON orders(status);
```

### Analyze After Creating
```sql
CREATE INDEX idx_orders_user_id ON orders(user_id);
ANALYZE orders;
```

---

## Tips

**Start with:**
- PK (automatic)
- FK (manual!)
- Common WHERE columns

**Monitor:**
- Query performance (EXPLAIN)
- Index usage (pg_stat_user_indexes)
- Table size vs index size

**Iterate:**
- Add indexes for slow queries
- Remove unused indexes
- Adjust composite order
