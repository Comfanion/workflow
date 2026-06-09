# Mocking and Test Isolation

How to mock dependencies and isolate tests.

## When to Mock

**✅ Mock these:**
- External services (HTTP, DB)
- Non-deterministic (time, random)
- Slow operations (file I/O, network)
- Dependencies you don't control

**❌ Don't mock these:**
- Simple value objects
- Pure functions
- Your own domain logic

---

## Dependency Injection

Make code testable by injecting dependencies.

**Bad (hardcoded):**
```typescript
class OrderService {
  async createOrder(data: OrderData) {
    const db = new Database(); // hardcoded!
    return db.save(data);
  }
}
```

**Good (injected):**
```typescript
class OrderService {
  constructor(private db: Database) {}
  
  async createOrder(data: OrderData) {
    return this.db.save(data);
  }
}

// Test
it('saves order', async () => {
  const mockDb = { save: jest.fn().mockResolvedValue({ id: '123' }) };
  const service = new OrderService(mockDb);
  
  await service.createOrder(orderData);
  
  expect(mockDb.save).toHaveBeenCalledWith(orderData);
});
```

---

## Interface-Based Mocking (Go)

```go
// Interface
type Database interface {
    Save(order Order) error
}

// Real implementation
type PostgresDB struct {}
func (db *PostgresDB) Save(order Order) error { /* ... */ }

// Mock for tests
type MockDB struct {
    SaveFunc func(Order) error
}
func (m *MockDB) Save(order Order) error {
    return m.SaveFunc(order)
}

// Test
func TestOrderService_CreateOrder(t *testing.T) {
    mockDB := &MockDB{
        SaveFunc: func(o Order) error {
            return nil // success
        },
    }
    
    service := NewOrderService(mockDB)
    err := service.CreateOrder(order)
    
    assert.NoError(t, err)
}
```

---

## Mock Frameworks

### TypeScript (Jest)

```typescript
// Mock function
const mockSave = jest.fn();

// Mock return value
mockSave.mockResolvedValue({ id: '123' });

// Mock error
mockSave.mockRejectedValue(new Error('DB error'));

// Verify calls
expect(mockSave).toHaveBeenCalledWith(orderData);
expect(mockSave).toHaveBeenCalledTimes(1);
```

### Python (unittest.mock)

```python
from unittest.mock import Mock, patch

# Mock object
mock_db = Mock()
mock_db.save.return_value = {'id': '123'}

# Verify calls
mock_db.save.assert_called_once_with(order_data)

# Patch dependency
@patch('module.Database')
def test_create_order(mock_db_class):
    mock_db = mock_db_class.return_value
    mock_db.save.return_value = {'id': '123'}
    # test code
```

---

## Test Isolation

**Rules:**

1. **Setup own data** - Don't depend on other tests
2. **No shared state** - Each test is independent
3. **Clean up** - Reset state after test
4. **Run in any order** - No execution dependencies

**Example:**

```typescript
describe('OrderRepository', () => {
  let repository: OrderRepository;
  let db: TestDatabase;
  
  beforeEach(async () => {
    // Fresh database for each test
    db = await TestDatabase.create();
    repository = new OrderRepository(db);
  });
  
  afterEach(async () => {
    // Clean up after each test
    await db.destroy();
  });
  
  it('saves order', async () => {
    const order = createTestOrder();
    await repository.save(order);
    // Independent of other tests
  });
});
```

---

## Test Doubles

### Stub
Returns predefined values.

```typescript
const stub = {
  getPrice: () => 100 // always returns 100
};
```

### Mock
Records calls for verification.

```typescript
const mock = {
  save: jest.fn().mockResolvedValue({ id: '123' })
};

// Later verify
expect(mock.save).toHaveBeenCalledWith(data);
```

### Spy
Wraps real object, records calls.

```typescript
const realService = new OrderService();
const spy = jest.spyOn(realService, 'createOrder');

await realService.createOrder(data);

expect(spy).toHaveBeenCalled();
```

### Fake
Working implementation (simplified).

```typescript
class FakeDatabase implements Database {
  private data = new Map();
  
  async save(order: Order) {
    this.data.set(order.id, order);
    return order;
  }
  
  async find(id: string) {
    return this.data.get(id);
  }
}
```

---

## Tips

**Prefer fakes over mocks:**
- Fakes are more realistic
- Less brittle tests
- Easier to maintain

**Keep mocks simple:**
- Mock only what you need
- Don't over-specify
- Focus on behavior

**Avoid mock hell:**
- Too many mocks = bad design
- Consider refactoring
- Use real objects when possible

**Test isolation:**
- Each test is independent
- No shared state
- Clean up after yourself
