# Test Strategy

When to use which type of test and how much coverage.

## Test Pyramid

```
        /\
       /  \      E2E (Few)
      /____\     - User scenarios
     /      \    - Critical paths
    /        \   
   /__________\  Integration (Some)
  /            \ - Module contracts
 /              \- API boundaries
/________________\ Unit (Many)
                   - Business logic
                   - Fast, isolated
```

**Principle:** More unit tests, fewer E2E tests.

---

## Test Types

### Unit Tests
**What:** Individual components in isolation  
**When:** Business logic, calculations, validations  
**Speed:** Fast (milliseconds)  
**Coverage:** 70-80%

**Example:**
```typescript
it('calculates order total', () => {
  const order = new Order();
  order.addItem({ price: 100, quantity: 2 });
  expect(order.calculateTotal()).toBe(200);
});
```

### Integration Tests
**What:** Multiple components working together  
**When:** Module boundaries, API contracts, DB operations  
**Speed:** Medium (seconds)  
**Coverage:** 50-60%

**Example:**
```typescript
it('creates order in database', async () => {
  const order = await orderService.create(orderData);
  const saved = await db.orders.findById(order.id);
  expect(saved).toMatchObject(orderData);
});
```

### E2E Tests
**What:** Complete user scenarios  
**When:** Critical user flows, smoke tests  
**Speed:** Slow (minutes)  
**Coverage:** 20-30% of critical paths

**Example:**
```typescript
it('user can place order', async () => {
  await page.goto('/products');
  await page.click('[data-testid="add-to-cart"]');
  await page.click('[data-testid="checkout"]');
  await page.fill('[name="email"]', 'test@example.com');
  await page.click('[data-testid="place-order"]');
  await expect(page.locator('.success')).toBeVisible();
});
```

---

## Coverage Targets

### By Layer

| Layer | Target | Focus |
|-------|--------|-------|
| **Domain** | 80%+ | Business rules, state transitions |
| **Application** | 70%+ | Use cases, orchestration |
| **Infrastructure** | 50%+ | Adapters, repositories |
| **API** | 60%+ | Endpoints, validation |
| **UI** | 40%+ | Critical user flows |

### By Project Size

| Size | Unit | Integration | E2E |
|------|------|-------------|-----|
| **TOY** | 60%+ | 30%+ | 10%+ |
| **SMALL** | 70%+ | 40%+ | 20%+ |
| **MEDIUM** | 75%+ | 50%+ | 25%+ |
| **LARGE** | 80%+ | 60%+ | 30%+ |

**Don't chase 100%** - Focus on critical paths.

---

## What to Test at Each Level

### Unit Tests
✅ **Test:**
- Business logic
- Calculations
- Validations
- State transitions
- Error handling

❌ **Don't test:**
- Private methods
- Getters/setters
- Framework code

### Integration Tests
✅ **Test:**
- Module contracts
- API boundaries
- Database operations
- Event publishing/consuming
- External service calls

❌ **Don't test:**
- Business logic (unit test it)
- UI rendering (E2E test it)

### E2E Tests
✅ **Test:**
- Critical user flows
- Happy paths
- Smoke tests
- Cross-browser (if needed)

❌ **Don't test:**
- Edge cases (unit test them)
- Error scenarios (integration test them)
- Every feature (too slow)

---

## When to Write Tests

### TDD (Test-Driven Development)
**Process:** Red → Green → Refactor

1. **Red:** Write failing test
2. **Green:** Make it pass (simplest way)
3. **Refactor:** Improve code

**When to use:**
- Clear requirements
- Complex business logic
- API design
- Bug fixes

**Example:**
```typescript
// 1. Red - write failing test
it('calculates discount', () => {
  expect(calculateDiscount(100, 0.1)).toBe(10);
});

// 2. Green - make it pass
function calculateDiscount(price, rate) {
  return price * rate;
}

// 3. Refactor - improve
function calculateDiscount(price: number, rate: number): number {
  if (rate < 0 || rate > 1) throw new Error('Invalid rate');
  return price * rate;
}
```

### Test After
Write code first, then tests.

**When to use:**
- Prototyping
- Unclear requirements
- Exploratory coding
- Spikes

---

## Cost vs Benefit

### High Value Tests
- Critical business logic
- Payment processing
- Security features
- Data integrity
- User authentication

### Medium Value Tests
- Standard CRUD operations
- Common workflows
- API endpoints
- Form validation

### Low Value Tests
- Simple getters/setters
- Configuration loading
- Trivial formatting
- Pass-through methods

**Focus on high-value tests first.**

---

## Test Maintenance

### Keep Tests Green
- Fix failing tests immediately
- Don't skip tests
- Don't comment out tests

### Refactor Tests
- DRY (helper functions)
- Clear names
- Remove obsolete tests

### Fast Feedback
- Run unit tests on save
- Run integration tests on commit
- Run E2E tests on PR

---

## CI/CD Integration

```yaml
# Example CI pipeline
stages:
  - lint
  - unit-tests      # Fast (1-2 min)
  - integration     # Medium (5-10 min)
  - e2e            # Slow (15-30 min)
  - deploy

unit-tests:
  script: npm test
  coverage: 80%
  
integration:
  script: npm run test:integration
  coverage: 50%
  
e2e:
  script: npm run test:e2e
  only: [main, develop]
```

---

## Tips

**Start with unit tests:**
- Fastest feedback
- Easiest to write
- Most coverage

**Add integration tests for boundaries:**
- Module contracts
- API endpoints
- Database operations

**E2E tests for critical flows:**
- User registration
- Checkout
- Payment
- Core features

**Measure what matters:**
- Coverage is a guide, not a goal
- Focus on critical paths
- Test behavior, not implementation
