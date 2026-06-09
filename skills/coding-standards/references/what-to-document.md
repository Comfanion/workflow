# What to Document in Coding Standards

Complete guide on what to include in your project's coding standards.

## Essential Sections

### 1. Project Structure

**What to document:**
- Directory layout
- Module organization
- File naming conventions
- Where to put what

**Example:**
```markdown
## Project Structure

\`\`\`
project/
├── internal/           # Private application code
│   ├── domain/        # Business entities
│   ├── service/       # Business logic
│   ├── repository/    # Data access
│   └── handler/       # HTTP handlers
├── pkg/               # Public libraries
├── cmd/               # Application entry points
├── docs/              # Documentation
└── tests/             # Integration tests
\`\`\`

**Rules:**
- `internal/` - private code, not importable
- `pkg/` - reusable libraries
- `cmd/` - one folder per binary
```

---

### 2. Naming Conventions

**What to document:**
- Files (snake_case, kebab-case, PascalCase)
- Types/Classes (PascalCase, snake_case)
- Functions/Methods (camelCase, snake_case)
- Variables (camelCase, snake_case)
- Constants (UPPER_SNAKE_CASE)
- Tests (*_test, *.test, *.spec)

**Example:**
```markdown
## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files | snake_case | user_service.go |
| Types | PascalCase | UserService |
| Functions | camelCase | getUserById |
| Variables | camelCase | userId, isValid |
| Constants | UPPER_SNAKE_CASE | MAX_RETRIES |
| Private | _prefix | _internalHelper |
| Tests | *_test | user_service_test.go |

**Rules:**
- Exported (public) functions: PascalCase (Go)
- Unexported (private) functions: camelCase (Go)
- Boolean variables: is/has/can prefix (isValid, hasPermission)
```

---

### 3. Code Organization Patterns

**What to document:**
- Layered architecture
- Dependency direction
- Module boundaries
- Common patterns

**Example:**
```markdown
## Code Organization

### Layers

\`\`\`
Handler → Service → Repository → Database
  ↓         ↓          ↓
 HTTP    Business    Data
Layer     Logic     Access
\`\`\`

**Rules:**
- Handlers: HTTP/API only, no business logic
- Services: Business logic, orchestration
- Repositories: Data access, queries
- Domain: Entities, value objects, rules

### Dependency Direction

\`\`\`
Handler → Service → Domain
   ↓         ↓         ↑
Infrastructure ←────────┘
\`\`\`

**Rule:** Dependencies point inward (toward domain)
```

---

### 4. Error Handling

**What to document:**
- Error types
- Error wrapping
- Error codes
- Error responses

**Example:**
```markdown
## Error Handling

### Error Types

\`\`\`go
// Domain errors
type ValidationError struct {
    Field   string
    Message string
}

// Application errors
type NotFoundError struct {
    Resource string
    ID       string
}

// Infrastructure errors
type DatabaseError struct {
    Operation string
    Cause     error
}
\`\`\`

### Error Wrapping

\`\`\`go
// Always wrap errors with context
if err != nil {
    return fmt.Errorf("failed to create user: %w", err)
}
\`\`\`

### Error Codes

| Code | Meaning | HTTP Status |
|------|---------|-------------|
| VALIDATION_ERROR | Invalid input | 400 |
| NOT_FOUND | Resource not found | 404 |
| UNAUTHORIZED | Not authenticated | 401 |
| FORBIDDEN | Not authorized | 403 |
| INTERNAL_ERROR | Server error | 500 |

### API Error Response

\`\`\`json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
\`\`\`
```

---

### 5. Testing Standards

**What to document:**
- Test types (unit, integration, E2E)
- Coverage targets
- Test naming
- Test structure

**Example:**
```markdown
## Testing Standards

### Coverage Targets

| Layer | Target | Focus |
|-------|--------|-------|
| Domain | 80%+ | Business rules |
| Service | 70%+ | Use cases |
| Handler | 60%+ | API contracts |
| Repository | 50%+ | Queries |

### Test Naming

\`\`\`
Test{Component}_{Method}_{Scenario}_{Expected}

Examples:
- TestUserService_Create_ValidInput_ReturnsUser
- TestUserService_Create_DuplicateEmail_ReturnsError
\`\`\`

### Test Structure (AAA)

\`\`\`go
func TestUserService_Create(t *testing.T) {
    // Arrange
    service := NewUserService(mockRepo)
    user := &User{Email: "test@example.com"}
    
    // Act
    result, err := service.Create(user)
    
    // Assert
    assert.NoError(t, err)
    assert.NotNil(t, result)
}
\`\`\`
```

---

### 6. API Standards

**What to document:**
- REST conventions
- URL structure
- HTTP methods
- Status codes
- Request/response format

**Example:**
```markdown
## API Standards

### REST Conventions

| Method | Path | Action |
|--------|------|--------|
| GET | /users | List users |
| GET | /users/:id | Get user |
| POST | /users | Create user |
| PUT | /users/:id | Update user |
| DELETE | /users/:id | Delete user |

### URL Structure

\`\`\`
/api/v1/{resource}/{id}/{sub-resource}

Examples:
- GET /api/v1/users
- GET /api/v1/users/123
- GET /api/v1/users/123/orders
\`\`\`

### Status Codes

| Code | Usage |
|------|-------|
| 200 | Success (GET, PUT) |
| 201 | Created (POST) |
| 204 | No Content (DELETE) |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Error |

### Response Format

\`\`\`json
// Success
{
  "data": {...},
  "meta": {
    "page": 1,
    "total": 100
  }
}

// Error
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input"
  }
}
\`\`\`
```

---

### 7. Database Standards

**What to document:**
- Schema conventions
- Naming (tables, columns)
- Migrations
- Query patterns

**Example:**
```markdown
## Database Standards

### Table Naming

- Plural, snake_case: `users`, `order_items`
- Junction tables: `user_roles`, `product_categories`

### Column Naming

- snake_case: `user_id`, `created_at`
- Foreign keys: `{table}_id` (user_id, order_id)
- Timestamps: `created_at`, `updated_at`, `deleted_at`

### Migrations

\`\`\`sql
-- Up migration: 20260129_create_users.up.sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Down migration: 20260129_create_users.down.sql
DROP TABLE users;
\`\`\`

### Query Patterns

\`\`\`go
// Use prepared statements
stmt, err := db.Prepare("SELECT * FROM users WHERE id = $1")
defer stmt.Close()

// Use transactions for multiple operations
tx, err := db.Begin()
defer tx.Rollback()
// ... operations
tx.Commit()
\`\`\`
```

---

### 8. Security Standards

**What to document:**
- Authentication
- Authorization
- Input validation
- Secrets management

**Example:**
```markdown
## Security Standards

### Authentication

- Use JWT tokens
- Token expiry: 1 hour
- Refresh token: 30 days
- Store tokens in httpOnly cookies

### Authorization

\`\`\`go
// Check permissions
if !user.HasPermission("user:create") {
    return ErrForbidden
}
\`\`\`

### Input Validation

\`\`\`go
// Always validate input
func (s *UserService) Create(input CreateUserInput) error {
    if err := input.Validate(); err != nil {
        return ValidationError{err}
    }
    // ...
}
\`\`\`

### Secrets Management

- Never commit secrets to git
- Use environment variables
- Use secret management (Vault, AWS Secrets Manager)

\`\`\`bash
# .env (gitignored)
DATABASE_URL=postgres://...
JWT_SECRET=...
\`\`\`
```

---

### 9. Dependencies

**What to document:**
- Approved libraries
- Forbidden libraries
- Version constraints

**Example:**
```markdown
## Dependencies

### Approved Libraries

| Purpose | Library | Version |
|---------|---------|---------|
| HTTP Router | chi | v5.x |
| Database | pgx | v5.x |
| Validation | validator | v10.x |
| Testing | testify | v1.x |

### Forbidden Libraries

- ❌ `gorm` - Use pgx instead
- ❌ `gin` - Use chi instead
- ❌ `reflect` - Avoid reflection

### Version Constraints

- Use semantic versioning
- Pin major versions
- Update dependencies monthly
```

---

### 10. Git Workflow

**What to document:**
- Branch naming
- Commit messages
- PR process

**Example:**
```markdown
## Git Workflow

### Branch Naming

\`\`\`
feature/PROJ-123-add-user-auth
bugfix/PROJ-456-fix-login
hotfix/PROJ-789-critical-bug
\`\`\`

### Commit Messages

\`\`\`
<type>(<scope>): <subject>

feat(auth): add JWT authentication
fix(user): handle duplicate email error
docs(api): update API documentation
\`\`\`

### PR Process

1. Create feature branch
2. Make changes
3. Write tests
4. Create PR
5. Code review
6. Merge to main
```

---

## Tips

**Keep it practical:**
- Use real examples from your project
- Show code, not just rules
- Include anti-patterns (what NOT to do)

**Make it searchable:**
- Clear headings
- Table of contents
- Examples for each rule

**Keep it updated:**
- Review quarterly
- Update when patterns change
- Remove obsolete rules

**Make it accessible:**
- Link from README
- Reference in stories
- Include in onboarding
