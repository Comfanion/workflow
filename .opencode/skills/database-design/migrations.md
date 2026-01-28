# Database Migrations

Safe migration patterns for zero-downtime deployments.

## Rules

1. **Forward compatible** - New code works with old schema
2. **Backward compatible** - Old code works with new schema
3. **Incremental** - One change per migration
4. **Reversible** - Include DOWN migration
5. **Tested** - Run on copy of production data

---

## Safe Patterns

### Add Column (Nullable)
**Safe:** No lock

```sql
-- +migrate Up
ALTER TABLE tasks ADD COLUMN priority VARCHAR(50);

-- +migrate Down
ALTER TABLE tasks DROP COLUMN priority;
```

### Add Column (NOT NULL)
**Safe:** Multi-step

```sql
-- Step 1: Add nullable
ALTER TABLE tasks ADD COLUMN status VARCHAR(50);

-- Step 2: Backfill (in batches)
UPDATE tasks SET status = 'todo' 
WHERE status IS NULL AND id IN (
    SELECT id FROM tasks WHERE status IS NULL LIMIT 1000
);

-- Step 3: Add constraint
ALTER TABLE tasks ALTER COLUMN status SET NOT NULL;
ALTER TABLE tasks ALTER COLUMN status SET DEFAULT 'todo';
```

### Remove Column
**Safe:** Multi-step

```sql
-- Step 1: Stop using column (deploy code)
-- Step 2: Remove column (after deploy)
ALTER TABLE tasks DROP COLUMN old_column;
```

### Rename Column
**Safe:** Add new, copy, remove old

```sql
-- Step 1: Add new column
ALTER TABLE tasks ADD COLUMN new_name VARCHAR(255);

-- Step 2: Copy data
UPDATE tasks SET new_name = old_name;

-- Step 3: Deploy code using new_name
-- Step 4: Remove old column
ALTER TABLE tasks DROP COLUMN old_name;
```

### Add Index
**Safe:** Use CONCURRENTLY

```sql
-- No lock
CREATE INDEX CONCURRENTLY idx_tasks_status ON tasks(status);

-- Analyze after
ANALYZE tasks;
```

### Change Column Type
**Safe:** Add new, migrate, remove old

```sql
-- Step 1: Add new column
ALTER TABLE tasks ADD COLUMN priority_new VARCHAR(50);

-- Step 2: Migrate data
UPDATE tasks SET priority_new = priority::VARCHAR;

-- Step 3: Deploy code using priority_new
-- Step 4: Remove old column
ALTER TABLE tasks DROP COLUMN priority;
ALTER TABLE tasks RENAME COLUMN priority_new TO priority;
```

---

## Dangerous Patterns

### ❌ Add NOT NULL with DEFAULT
**Problem:** Locks table

```sql
-- BAD: Locks table for rewrite
ALTER TABLE tasks 
ADD COLUMN status VARCHAR NOT NULL DEFAULT 'todo';
```

**Safe alternative:**
```sql
-- 1. Add nullable
ALTER TABLE tasks ADD COLUMN status VARCHAR;

-- 2. Backfill in batches
UPDATE tasks SET status = 'todo' WHERE status IS NULL;

-- 3. Set NOT NULL
ALTER TABLE tasks ALTER COLUMN status SET NOT NULL;

-- 4. Set DEFAULT
ALTER TABLE tasks ALTER COLUMN status SET DEFAULT 'todo';
```

### ❌ Change Column Type Directly
**Problem:** Locks table, may fail

```sql
-- BAD: Locks table
ALTER TABLE tasks ALTER COLUMN priority TYPE VARCHAR(50);
```

**Safe alternative:** Add new column, migrate, remove old (see above)

### ❌ Add Foreign Key Without Index
**Problem:** Slow, locks

```sql
-- BAD: No index on user_id
ALTER TABLE orders 
ADD CONSTRAINT fk_orders_user 
FOREIGN KEY (user_id) REFERENCES users(id);
```

**Safe alternative:**
```sql
-- 1. Add index first
CREATE INDEX CONCURRENTLY idx_orders_user_id ON orders(user_id);

-- 2. Add FK
ALTER TABLE orders 
ADD CONSTRAINT fk_orders_user 
FOREIGN KEY (user_id) REFERENCES users(id);
```

---

## Migration Template

```sql
-- migrations/20260129_001_add_status_to_tasks.sql

-- +migrate Up
-- Description: Add status column to tasks table

-- Step 1: Add nullable column (no lock)
ALTER TABLE tasks ADD COLUMN status VARCHAR(50);

-- Step 2: Backfill (run in batches via application)
-- UPDATE tasks SET status = 'todo' WHERE status IS NULL;

-- Step 3: Add constraints
ALTER TABLE tasks ALTER COLUMN status SET NOT NULL;
ALTER TABLE tasks ALTER COLUMN status SET DEFAULT 'todo';
ALTER TABLE tasks ADD CONSTRAINT tasks_status_check 
    CHECK (status IN ('todo', 'in_progress', 'done'));

-- Step 4: Add index
CREATE INDEX CONCURRENTLY idx_tasks_status ON tasks(status);

-- +migrate Down
DROP INDEX CONCURRENTLY IF EXISTS idx_tasks_status;
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_status_check;
ALTER TABLE tasks DROP COLUMN IF EXISTS status;
```

---

## Versioning

### File Naming
```
migrations/
├── 20260129_001_create_users.sql
├── 20260129_002_add_email_to_users.sql
└── 20260129_003_create_orders.sql
```

**Format:** `YYYYMMDD_NNN_description.sql`

### Tracking
```sql
CREATE TABLE schema_migrations (
    version VARCHAR(255) PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## Tips

**Test migrations:**
- Run on copy of production data
- Measure execution time
- Check locks (pg_locks)

**Batch large updates:**
```sql
-- Bad: Update all at once
UPDATE tasks SET status = 'todo';

-- Good: Update in batches
UPDATE tasks SET status = 'todo'
WHERE id IN (
    SELECT id FROM tasks WHERE status IS NULL LIMIT 1000
);
```

**Monitor progress:**
```sql
-- Check how many rows left
SELECT COUNT(*) FROM tasks WHERE status IS NULL;
```

**Rollback plan:**
- Always have DOWN migration
- Test rollback on staging
- Keep old code deployable
