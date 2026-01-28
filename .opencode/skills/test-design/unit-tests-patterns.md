# Unit Testing Patterns

Common patterns for writing effective unit tests.

## Table-Driven Tests

Test multiple scenarios with same logic.

**Go Example:**
```go
func TestValidateEmail(t *testing.T) {
    tests := []struct {
        name    string
        email   string
        wantErr bool
    }{
        {"valid", "test@example.com", false},
        {"missing @", "testexample.com", true},
        {"empty", "", true},
    }
    
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            err := ValidateEmail(tt.email)
            if (err != nil) != tt.wantErr {
                t.Errorf("got error = %v, want %v", err, tt.wantErr)
            }
        })
    }
}
```

**TypeScript Example:**
```typescript
describe('validateEmail', () => {
  test.each([
    { email: 'test@example.com', valid: true },
    { email: 'testexample.com', valid: false },
    { email: '', valid: false },
  ])('validates $email', ({ email, valid }) => {
    expect(validateEmail(email).isValid).toBe(valid);
  });
});
```

---

## State Transitions

Test state machine behavior.

```typescript
describe('Order state transitions', () => {
  it('transitions DRAFT → PENDING on submit', () => {
    const order = new Order(); // DRAFT
    
    order.submit();
    
    expect(order.status).toBe('PENDING');
  });
  
  it('throws error on invalid transition', () => {
    const order = new Order();
    order.submit(); // DRAFT → PENDING
    
    expect(() => order.submit()).toThrow('Invalid state');
  });
});
```

---

## Validation Testing

Test input validation rules.

```typescript
describe('Order validation', () => {
  it('rejects empty items', () => {
    const order = new Order();
    
    const result = order.validate();
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Order must have items');
  });
  
  it('rejects negative quantities', () => {
    const order = new Order();
    order.addItem({ price: 100, quantity: -1 });
    
    const result = order.validate();
    
    expect(result.errors).toContain('Quantity must be positive');
  });
});
```

---

## Error Handling

Test error scenarios and recovery.

```typescript
describe('OrderService error handling', () => {
  it('handles database errors', async () => {
    const mockDb = {
      save: jest.fn().mockRejectedValue(new Error('DB error'))
    };
    const service = new OrderService(mockDb);
    
    await expect(service.createOrder(order))
      .rejects.toThrow('Failed to create order');
  });
  
  it('retries on transient errors', async () => {
    const mockDb = {
      save: jest.fn()
        .mockRejectedValueOnce(new Error('Timeout'))
        .mockResolvedValueOnce({ id: '123' })
    };
    
    const result = await service.createOrder(order);
    
    expect(result.id).toBe('123');
    expect(mockDb.save).toHaveBeenCalledTimes(2);
  });
});
```

---

## Boundary Testing

Test edge cases and limits.

```typescript
describe('boundary conditions', () => {
  it('handles empty input', () => {
    expect(calculateTotal([])).toBe(0);
  });
  
  it('handles single item', () => {
    expect(calculateTotal([{ price: 100 }])).toBe(100);
  });
  
  it('handles maximum items', () => {
    const items = Array(1000).fill({ price: 1 });
    expect(calculateTotal(items)).toBe(1000);
  });
  
  it('handles zero price', () => {
    expect(calculateTotal([{ price: 0 }])).toBe(0);
  });
});
```

---

## Tips

**Table-driven tests:**
- Use for multiple input/output combinations
- Name each case clearly
- Include edge cases

**State transitions:**
- Test all valid transitions
- Test invalid transitions (should error)
- Verify state after transition

**Validation:**
- Test each validation rule separately
- Test combinations of errors
- Verify error messages

**Error handling:**
- Test error paths
- Test recovery/retry logic
- Verify error messages
