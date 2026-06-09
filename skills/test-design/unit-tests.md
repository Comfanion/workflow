# Unit Testing Guide

Unit tests verify individual components in isolation.

## What to Test

### ✅ Always Test
- **Public API** - Public methods, exported interfaces
- **Business Logic** - Domain rules, calculations, validations
- **Error Handling** - Invalid input, exceptions
- **Edge Cases** - Empty/null/zero, min/max, boundaries

### ❌ Don't Test
- **Private methods** - Test through public API
- **Trivial code** - Getters/setters, pass-through
- **Framework internals** - Third-party libraries

---

## AAA Pattern

**Structure:** Arrange → Act → Assert

```typescript
it('calculates order total', () => {
  // Arrange - setup
  const order = new Order();
  order.addItem({ price: 100, quantity: 2 });
  
  // Act - execute
  const total = order.calculateTotal();
  
  // Assert - verify
  expect(total).toBe(200);
});
```

---

## Test Naming

**Format:** `Test{Component}_{Method}_{Scenario}_{Expected}`

**Examples:**
```
TestOrder_CalculateTotal_WithItems_ReturnsSum
TestOrder_CalculateTotal_EmptyOrder_ReturnsZero
TestOrder_AddItem_DuplicateSKU_MergesQuantity
```

**TypeScript/Jest:**
```typescript
describe('Order', () => {
  describe('calculateTotal', () => {
    it('returns sum when order has items', () => {});
    it('returns zero when order is empty', () => {});
  });
});
```

---

## Coverage Targets

| Layer | Target | Focus |
|-------|--------|-------|
| **Domain** | 80%+ | Business logic, rules |
| **Application** | 70%+ | Use cases |
| **Infrastructure** | 50%+ | Adapters |

**Don't chase 100%** - Focus on critical paths.

---

## Advanced Topics

**For more details, see:**
- [unit-tests-patterns.md](unit-tests-patterns.md) - Table-driven tests, state transitions, validation
- [unit-tests-mocking.md](unit-tests-mocking.md) - Mocking, dependency injection, test isolation

---

## Quick Example

```typescript
describe('validateEmail', () => {
  it('accepts valid email', () => {
    expect(validateEmail('test@example.com').isValid).toBe(true);
  });
  
  it('rejects invalid email', () => {
    expect(validateEmail('invalid').isValid).toBe(false);
  });
  
  it('rejects empty email', () => {
    expect(validateEmail('').isValid).toBe(false);
  });
});
```

---

## Tips

**Keep tests simple:**
- One assertion per test
- Clear test names
- Minimal setup

**Test behavior, not implementation:**
- Test what it does, not how
- Refactor shouldn't break tests

**Make tests fast:**
- No real I/O (mock it)
- No sleep/delays
- Parallel execution
