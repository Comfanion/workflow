# [Module] Test Cases

**Parent:** [Module Architecture](./architecture.md)
**Version:** 1.0
**Status:** Draft | Review | Approved
**QA Owner:** [Name]

> **Note:** This file is OPTIONAL. Create only when module has complex test scenarios that don't fit in PRD acceptance criteria.

---

## Overview

Test cases specific to this module, covering domain logic, use cases, and module-specific integrations.

---

## Domain Layer Tests

### Aggregate: [Aggregate Name]

#### Business Rules

| Rule ID | Rule Description | Test Case |
|---------|------------------|-----------|
| BR-01 | Order total must be > 0 | Create order with zero total → error |
| BR-02 | Cannot add items to completed order | Add item to completed → error |
| BR-03 | Discount cannot exceed total | Apply 100% discount → max discount applied |

#### State Transitions

```
     ┌─────────┐
     │  DRAFT  │
     └────┬────┘
          │ submit()
          ▼
     ┌─────────┐
     │ PENDING │
     └────┬────┘
     ┌────┴────┐
approve()  reject()
     │         │
     ▼         ▼
┌────────┐ ┌──────────┐
│ ACTIVE │ │ REJECTED │
└────────┘ └──────────┘
```

| From | To | Action | Test Case |
|------|-----|--------|-----------|
| DRAFT | PENDING | submit() | Valid order → status = PENDING |
| DRAFT | PENDING | submit() | Invalid order → error, status = DRAFT |
| PENDING | ACTIVE | approve() | Approve → status = ACTIVE |
| PENDING | REJECTED | reject() | Reject with reason → status = REJECTED |
| ACTIVE | DRAFT | submit() | Invalid transition → error |

#### Value Object Validation

| Value Object | Valid | Invalid | Edge Case |
|--------------|-------|---------|-----------|
| Email | test@example.com | "invalid" | max length |
| Phone | +380501234567 | "123" | international format |
| Money | 100.00 UAH | -1 | 0.01 (minimum) |
| SKU | "SKU-001" | "" | special chars |

---

## Use Case Tests

### Use Case: [Create Order]

**Input:** CreateOrderCommand
**Output:** OrderCreatedResult

#### Test Matrix

| Scenario | Input | Expected | Priority |
|----------|-------|----------|----------|
| Happy path | Valid order | Created, event published | Must |
| Empty items | No items | Validation error | Must |
| Invalid customer | Missing required | Validation error | Must |
| Duplicate SKU | Same SKU twice | Items merged | Should |
| Concurrent creation | Same order ID | Conflict error | Must |

#### Detailed Scenarios

```
Scenario: Create order - happy path
  Given valid customer data
  And valid items list
  When CreateOrder is executed
  Then order is saved with status DRAFT
  And OrderCreated event is published
  And order ID is returned

Scenario: Create order - validation failure
  Given customer phone is invalid
  When CreateOrder is executed
  Then ValidationError is returned
  And no order is saved
  And no event is published
```

---

## API Tests

### Endpoint: POST /api/v1/orders

| Scenario | Request | Response | Status |
|----------|---------|----------|--------|
| Valid request | Full body | Order DTO | 201 |
| Missing field | No customer | Error details | 400 |
| Invalid auth | No token | Unauthorized | 401 |
| Forbidden | Wrong merchant | Forbidden | 403 |

### Endpoint: GET /api/v1/orders/{id}

| Scenario | Request | Response | Status |
|----------|---------|----------|--------|
| Exists | Valid ID | Order DTO | 200 |
| Not found | Unknown ID | Error | 404 |
| Wrong owner | Other's order | Forbidden | 403 |

---

## Event Tests

### Event: OrderCreated

**Producer:** This module
**Consumers:** Inventory, Notifications

| Scenario | Test | Verification |
|----------|------|--------------|
| Event structure | Create order | Event has all required fields |
| Event timing | After save | Event published after DB commit |
| Idempotency key | Event ID | Unique per order |

### Event: InventoryReserved (consumed)

**Producer:** Inventory
**Consumer:** This module

| Scenario | Test | Verification |
|----------|------|--------------|
| Reservation success | Receive event | Order status → CONFIRMED |
| Reservation failed | Receive failure | Order status → FAILED |
| Duplicate event | Same event twice | Ignored, no state change |

---

## Database Tests

### Table: orders

| Test | Query | Verification |
|------|-------|--------------|
| Insert | Create order | Row exists, all fields correct |
| Update | Change status | Only changed fields updated |
| Optimistic lock | Concurrent update | Second update fails |
| Cascade delete | Delete order | Items deleted |

### Performance

| Query | Max Time | Load |
|-------|----------|------|
| Find by ID | 10ms | Single |
| Search by status | 50ms | 1000 rows |
| List by merchant | 100ms | 10000 rows |

---

## Error Handling Tests

| Error Type | Trigger | Expected Behavior |
|------------|---------|-------------------|
| Validation | Invalid input | 400 + field errors |
| Not found | Unknown ID | 404 + message |
| Conflict | Duplicate | 409 + conflict details |
| DB timeout | Slow query | 503 + retry |
| External failure | API down | Graceful degradation |

---

## Coverage Requirements

| Layer | Target | Current |
|-------|--------|---------|
| Domain | 100% | - |
| Use Cases | 80% | - |
| API Handlers | 70% | - |
| Repository | 60% | - |

---

## Test Data

### Fixtures

```yaml
# fixtures/orders.yaml
valid_order:
  customer:
    name: "Test Customer"
    phone: "+380501234567"
    email: "test@example.com"
  items:
    - sku: "TEST-001"
      quantity: 2
      price: 100.00

invalid_order:
  customer:
    name: ""  # Missing required field
  items: []   # Empty items
```

---

## Validation Checklist

- [ ] All business rules have tests
- [ ] All state transitions tested
- [ ] All use cases covered
- [ ] All API endpoints tested
- [ ] Error scenarios documented
- [ ] Performance requirements defined
- [ ] Test data prepared
