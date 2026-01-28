---
name: test-design
description: Design test strategy, write unit/integration/E2E tests, plan test coverage, and define testing approach. Use when designing tests, writing test cases, planning test coverage, or when user mentions "test design", "test strategy", "unit tests", "integration tests", "test coverage", or "testing approach".
license: MIT
compatibility: opencode
metadata:
  domain: development
  agents: [dev, coder]
---

# Test Design Skill

```xml
<test_design>
  <definition>Design test strategy, write unit/integration/E2E tests</definition>
  
  <test_types>
    <unit>Individual components, fast, isolated → See [unit-tests.md](unit-tests.md)</unit>
    <integration>Module contracts, API boundaries → See [integration-tests.md](integration-tests.md)</integration>
    <e2e>User scenarios, critical paths → See [e2e-tests.md](e2e-tests.md)</e2e>
  </test_types>
  
  <test_pyramid>
    <many>Unit tests (70-80% coverage)</many>
    <some>Integration tests (50-60% coverage)</some>
    <few>E2E tests (20-30% critical paths)</few>
  </test_pyramid>
  
  <quick_reference>
    <what_to_test>Public API, Business logic, Error handling, Edge cases</what_to_test>
    <what_not_to_test>Private methods, Getters/setters, Framework internals</what_not_to_test>
    <naming>Test{Component}_{Method}_{Scenario}_{Expected}</naming>
    <structure>AAA: Arrange → Act → Assert</structure>
  </quick_reference>
  
  <coverage_targets>
    <domain>80%+</domain>
    <application>70%+</application>
    <infrastructure>50%+</infrastructure>
    <focus>Critical paths, not 100%</focus>
  </coverage_targets>
  
  <when_to_test>
    <tdd>Red → Green → Refactor (clear requirements)</tdd>
    <after>Write code first (prototyping, unclear requirements)</after>
  </when_to_test>
</test_design>
```

---

## Detailed Guides

**Unit Testing:**
- [unit-tests.md](unit-tests.md) - Basics: what to test, AAA pattern, naming
- [unit-tests-patterns.md](unit-tests-patterns.md) - Table-driven, state transitions, validation
- [unit-tests-mocking.md](unit-tests-mocking.md) - Mocking, DI, test isolation

**Integration Testing:**
- [integration-tests.md](integration-tests.md) - Module contracts, API boundaries, events

**E2E Testing:**
- [e2e-tests.md](e2e-tests.md) - User scenarios, critical paths, smoke tests

**Strategy:**
- [test-strategy.md](test-strategy.md) - Test pyramid, coverage targets, when to use what

**Templates:**
- [templates/template-integration.md](templates/template-integration.md) - Architecture integration tests
- [templates/template-module.md](templates/template-module.md) - Module test cases

---

## Quick Example

```typescript
// Unit test
it('calculates order total', () => {
  const order = new Order();
  order.addItem({ price: 100, quantity: 2 });
  expect(order.calculateTotal()).toBe(200);
});

// Integration test
it('saves order to database', async () => {
  const order = await orderService.create(orderData);
  const saved = await db.orders.findById(order.id);
  expect(saved).toMatchObject(orderData);
});
```

---

## Test Pyramid

```
        /\
       /  \      E2E (Few)
      /____\     
     /      \    Integration (Some)
    /        \   
   /__________\  Unit (Many)
```

For full details, see the guides above.
