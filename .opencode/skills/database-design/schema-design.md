# Schema Design

How to design database schema: entities, relationships, normalization.

## Entities

**Types:**
- **Core entities:** Main business objects (users, orders, products)
- **Supporting entities:** Metadata, configuration (categories, tags)
- **Junction entities:** Many-to-many relationships (user_roles, product_categories)

---

## Relationships

### One-to-One (1:1)
**Implementation:** FK in either table OR same table

```sql
-- Option 1: FK in either table
CREATE TABLE users (id UUID PRIMARY KEY);
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY,
    user_id UUID UNIQUE REFERENCES users(id)
);

-- Option 2: Same table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    profile_data JSONB
);
```

### One-to-Many (1:N)
**Implementation:** FK in "many" side

```sql
CREATE TABLE users (id UUID PRIMARY KEY);
CREATE TABLE orders (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id)
);
```

### Many-to-Many (M:N)
**Implementation:** Junction table

```sql
CREATE TABLE users (id UUID PRIMARY KEY);
CREATE TABLE roles (id UUID PRIMARY KEY);
CREATE TABLE user_roles (
    user_id UUID REFERENCES users(id),
    role_id UUID REFERENCES roles(id),
    PRIMARY KEY (user_id, role_id)
);
```

### Hierarchy (Self-Referencing)
**Implementation:** Self-referencing FK OR nested set

```sql
-- Option 1: Self-referencing FK
CREATE TABLE categories (
    id UUID PRIMARY KEY,
    parent_id UUID REFERENCES categories(id),
    name VARCHAR(255)
);

-- Option 2: Nested set (for read-heavy)
CREATE TABLE categories (
    id UUID PRIMARY KEY,
    lft INT NOT NULL,
    rgt INT NOT NULL,
    name VARCHAR(255)
);
```

### Polymorphic
**Implementation:** Type column + nullable FKs OR separate tables

```sql
-- Option 1: Type column (simple)
CREATE TABLE comments (
    id UUID PRIMARY KEY,
    commentable_type VARCHAR(50), -- 'post' or 'product'
    commentable_id UUID,
    content TEXT
);

-- Option 2: Separate tables (type-safe)
CREATE TABLE post_comments (
    id UUID PRIMARY KEY,
    post_id UUID REFERENCES posts(id),
    content TEXT
);
CREATE TABLE product_comments (
    id UUID PRIMARY KEY,
    product_id UUID REFERENCES products(id),
    content TEXT
);
```

---

## Normalization

### First Normal Form (1NF)
**Rule:** Atomic values, no arrays in columns

```sql
-- ❌ Bad (not 1NF)
CREATE TABLE users (
    id UUID,
    tags VARCHAR[] -- array!
);

-- ✅ Good (1NF)
CREATE TABLE users (id UUID);
CREATE TABLE user_tags (
    user_id UUID REFERENCES users(id),
    tag VARCHAR(50)
);
```

### Second Normal Form (2NF)
**Rule:** No partial dependencies (all non-key depend on FULL PK)

```sql
-- ❌ Bad (not 2NF) - product_name depends only on product_id
CREATE TABLE order_items (
    order_id UUID,
    product_id UUID,
    product_name VARCHAR(255), -- depends only on product_id!
    quantity INT,
    PRIMARY KEY (order_id, product_id)
);

-- ✅ Good (2NF)
CREATE TABLE order_items (
    order_id UUID,
    product_id UUID REFERENCES products(id),
    quantity INT,
    PRIMARY KEY (order_id, product_id)
);
CREATE TABLE products (
    id UUID PRIMARY KEY,
    name VARCHAR(255)
);
```

### Third Normal Form (3NF)
**Rule:** No transitive dependencies (non-key don't depend on other non-key)

```sql
-- ❌ Bad (not 3NF) - city depends on zip_code
CREATE TABLE users (
    id UUID PRIMARY KEY,
    zip_code VARCHAR(10),
    city VARCHAR(100) -- depends on zip_code!
);

-- ✅ Good (3NF)
CREATE TABLE users (
    id UUID PRIMARY KEY,
    zip_code VARCHAR(10) REFERENCES zip_codes(code)
);
CREATE TABLE zip_codes (
    code VARCHAR(10) PRIMARY KEY,
    city VARCHAR(100)
);
```

### When to Denormalize

**Reasons:**
- Read-heavy, rarely changes
- Reporting/analytics
- Cross-module data
- Computed values

**Rule:** Normalize first, denormalize with measured reason.

```sql
-- Denormalized for performance
CREATE TABLE orders (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    user_email VARCHAR(255), -- denormalized from users
    total DECIMAL(10,2) -- computed from order_items
);
```

---

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Tables | plural, snake_case | users, order_items |
| Columns | snake_case | created_at, user_id |
| Primary Key | id | id UUID PRIMARY KEY |
| Foreign Key | {table}_id | user_id, order_id |
| Timestamps | *_at | created_at, updated_at |
| Boolean | is_*, has_* | is_active, has_permission |
| Junction | table1_table2 | user_roles, product_categories |

---

## Standard Columns

**Every table:**
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
```

**Soft delete (optional):**
```sql
deleted_at TIMESTAMPTZ
```

**Multi-tenant (if needed):**
```sql
tenant_id UUID NOT NULL REFERENCES tenants(id)
```

---

## Constraints

### NOT NULL
**Rule:** NOT NULL by default, NULL explicitly documented

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL, -- required
    phone VARCHAR(50) -- optional (explicitly NULL)
);
```

### CHECK
**Rule:** Validate data at database level

```sql
CREATE TABLE orders (
    status VARCHAR(50) CHECK (status IN ('pending', 'paid', 'shipped')),
    total DECIMAL(10,2) CHECK (total >= 0),
    start_date DATE,
    end_date DATE,
    CHECK (start_date < end_date)
);
```

### UNIQUE
**Rule:** Use for scoped uniqueness

```sql
-- Global uniqueness
CREATE TABLE users (
    email VARCHAR(255) UNIQUE
);

-- Scoped uniqueness (per tenant)
CREATE TABLE users (
    tenant_id UUID,
    email VARCHAR(255),
    UNIQUE (tenant_id, email)
);
```

---

## Example: Complete Table

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
    deleted_at TIMESTAMPTZ,
    
    -- Constraints
    UNIQUE (tenant_id, id)
);
```

---

## Tips

**Start simple:**
- Normalize first
- Add constraints
- Test with real data

**Iterate:**
- Denormalize if needed
- Add indexes (see indexing.md)
- Optimize queries (see optimization.md)

**Document:**
- Why denormalized
- Why nullable
- Business rules
