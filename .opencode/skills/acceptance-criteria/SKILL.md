---
name: acceptance-criteria
description: Use when writing testable acceptance criteria in Given/When/Then format
license: MIT
compatibility: opencode
metadata:
  domain: quality-assurance
  format: gherkin
---

# Acceptance Criteria Writing Skill

## When to Use

Use this skill when you need to:
- Write acceptance criteria for FRs in PRD
- Write AC for epics and stories
- Define testable behavior specifications
- Create QA test scenarios

## Given/When/Then Format

### Structure

```gherkin
Given [precondition/context]
When [action/trigger]
Then [expected outcome]
And [additional outcome]
```

### Example

```gherkin
AC1: Successful product creation
Given a merchant is authenticated
And the merchant has permission to create products
When the merchant submits a valid product with:
  - name: "Test Product"
  - price: 100.00 UAH
  - SKU: "TEST-001"
Then a new product is created with status "pending"
And the product is assigned a unique ID
And an event "product.created" is published
```

## AC Quality Checklist

Each acceptance criterion must be:
- [ ] **Testable** - Can be verified as pass/fail
- [ ] **Independent** - Doesn't depend on other AC execution order
- [ ] **Specific** - Exact expected behavior, not vague
- [ ] **Complete** - Covers one complete scenario

## Types of Acceptance Criteria

### 1. Happy Path AC
Normal, successful flow.

```gherkin
Given valid input
When action performed
Then success result
```

### 2. Edge Case AC
Boundary conditions.

```gherkin
Given input at boundary (min/max/empty)
When action performed
Then appropriate handling
```

### 3. Error Case AC
Invalid input or failure scenarios.

```gherkin
Given invalid input
When action attempted
Then error returned with message
And no side effects occur
```

### 4. Security AC
Authorization and authentication.

```gherkin
Given user without permission
When action attempted
Then access denied (403)
```

### 5. Performance AC
Non-functional behavior.

```gherkin
Given 1000 concurrent requests
When action performed
Then response time < 200ms p95
```

## AC for Different Artifacts

### PRD Level (High-level)

```markdown
## FR-001: Product Creation

**Acceptance Criteria:**
- [ ] Merchant can create product with required fields
- [ ] Product validation rejects invalid data
- [ ] Created product appears in product list
- [ ] Product creation event is published
```

### Epic Level (Feature-level)

```markdown
## Acceptance Criteria

- [ ] All CRUD operations for products work
- [ ] Validation rules are enforced
- [ ] Events are published for all state changes
- [ ] API follows REST conventions
- [ ] Unit test coverage > 80%
```

### Story Level (Detailed)

```markdown
## Acceptance Criteria

### AC1: Create product with valid data
**Given** authenticated merchant with "product:create" permission
**When** POST /api/v1/products with valid payload
**Then** 201 Created returned
**And** product has generated UUID
**And** product status is "pending"
**And** "product.created" event published to Kafka

### AC2: Reject invalid product data
**Given** authenticated merchant
**When** POST /api/v1/products with missing "name"
**Then** 400 Bad Request returned
**And** error response contains validation details
**And** no product is created

### AC3: Reject unauthorized access
**Given** authenticated user without "product:create" permission
**When** POST /api/v1/products
**Then** 403 Forbidden returned
```

## Common Mistakes to Avoid

1. **Too vague**: "System works correctly" → Define WHAT "correctly" means
2. **Multiple scenarios in one AC**: Split into separate ACs
3. **Implementation details**: "Use PostgreSQL" → Focus on WHAT, not HOW
4. **Missing error cases**: Always include negative scenarios
5. **No measurable outcome**: "Fast response" → "< 200ms"

## AC Templates

### CRUD Operations

```gherkin
# Create
Given valid [entity] data
When POST /api/v1/[entities]
Then 201 Created with [entity] details

# Read
Given existing [entity] with ID
When GET /api/v1/[entities]/{id}
Then 200 OK with [entity] details

# Update
Given existing [entity] with ID
When PUT /api/v1/[entities]/{id} with updates
Then 200 OK with updated [entity]

# Delete
Given existing [entity] with ID
When DELETE /api/v1/[entities]/{id}
Then 204 No Content
And [entity] no longer retrievable
```

### Validation

```gherkin
Given [entity] with invalid [field]
When create/update attempted
Then 400 Bad Request
And error identifies [field] and reason
```

### Authorization

```gherkin
Given user with role [role]
When accessing [resource]
Then [allowed/denied] based on permissions
```

## Related Skills

- `story-writing` - For complete user stories
- `epic-writing` - For epic-level AC
- `prd-writing` - For FR-level AC
- `integration-testing` - For test implementation
