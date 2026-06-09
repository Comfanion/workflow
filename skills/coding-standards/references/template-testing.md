# Testing Standards

**Version:** 1.0
**Status:** Active

---

## 1. Testing Philosophy

### Testing Pyramid

```
       /\
      /  \      E2E Tests (Few)
     /____\     - Full system integration
    /      \    - Critical user flows
   /________\   Integration Tests (Some)
  /          \  - Database interactions
 /____________\ - External API contracts
/              \ Unit Tests (Many)
                 - Domain logic
                 - Use case handlers
                 - Business rules
```

**Core Principle:** Focus on domain layer testing - easiest to write, most valuable for catching bugs!

---

## 2. Coverage Targets

| Layer | Minimum | Target | Priority |
|-------|---------|--------|----------|
| **Domain** | 90% | **100%** | HIGHEST |
| Application | 70% | 80% | High |
| Infrastructure | 50% | 60% | Medium |
| Interfaces | 60% | 70% | Medium |
| **Overall** | **75%** | **85%** | - |

**Why Domain Tests First?**
- Easiest to write - No mocks, no database, pure code
- Fastest to run - No external dependencies
- Most valuable - Business logic bugs affect everything
- 100% achievable - No infrastructure complexity

---

## 3. Testing Framework

### Libraries

| Library | Purpose | Usage |
|---------|---------|-------|
| `testing` | Standard Go testing | All tests |
| `testify/assert` | Assertions (non-fatal) | Regular checks |
| `testify/require` | Fatal assertions | Preconditions |
| `testify/mock` | Mocking framework | External dependencies |
| `testcontainers` | Integration testing | Real DB/Redis |
| `k6` | Load testing | Performance tests |

### Import Pattern

```go
import (
    "testing"
    
    "github.com/stretchr/testify/assert"
    "github.com/stretchr/testify/require"
    "github.com/stretchr/testify/mock"
)
```

---

## 4. Test Types

### 4.1 Unit Tests (Domain Layer)

**Location:** `domain/*_test.go`
**Dependencies:** None (pure Go)
**Speed:** < 1ms per test

**What to test:**
- Aggregates (business rules, state transitions)
- Value Objects (validation, equality)
- Domain Services (cross-aggregate logic)
- Domain Events (event creation)

**Pattern:** Table-driven tests + Arrange-Act-Assert

```go
func TestOrder_AddItem(t *testing.T) {
    tests := []struct {
        name      string
        quantity  int
        wantError bool
    }{
        {"valid quantity", 5, false},
        {"zero quantity", 0, true},
        {"negative quantity", -1, true},
    }
    
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            // Arrange
            order := NewOrder()
            
            // Act
            err := order.AddItem(Item{Quantity: tt.quantity})
            
            // Assert
            if tt.wantError {
                assert.Error(t, err)
            } else {
                assert.NoError(t, err)
            }
        })
    }
}
```

### 4.2 Application Tests (Use Case Layer)

**Location:** `application/usecase/*_test.go`
**Dependencies:** Mocked repositories/ports
**Speed:** < 10ms per test

**What to test:**
- Use case orchestration
- Error handling
- DTO mapping

**Pattern:** Mock dependencies, test orchestration

### 4.3 Integration Tests

**Location:** `infrastructure/*_test.go` or `tests/integration/`
**Dependencies:** Real database (testcontainers)
**Speed:** 100ms - 1s per test

**What to test:**
- Repository implementations
- Database queries
- External API contracts
- Message queue consumers/producers

**Pattern:** Testcontainers for real infrastructure

### 4.4 HTTP Handler Tests

**Location:** `interfaces/http/*_test.go`
**Dependencies:** Mocked use cases
**Speed:** < 50ms per test

**What to test:**
- Request parsing
- Response formatting
- Validation errors
- HTTP status codes

### 4.5 E2E Tests

**Location:** `tests/e2e/`
**Dependencies:** Full system
**Speed:** 1-10s per test

**What to test:**
- Critical user flows only
- Happy path scenarios
- Cross-module interactions

### 4.6 Load Tests

**Tool:** k6
**Location:** `tests/load/`

**What to test:**
- Throughput (RPS)
- Latency (p50, p95, p99)
- Error rate under load
- Resource usage

---

## 5. Test File Naming

| Type | Pattern | Example |
|------|---------|---------|
| Unit test | `*_test.go` | `order_test.go` |
| Integration | `*_integration_test.go` | `repo_integration_test.go` |
| E2E | `*_e2e_test.go` | `checkout_e2e_test.go` |
| Benchmark | `*_bench_test.go` | `search_bench_test.go` |

---

## 6. Test Commands

```bash
# Unit tests only (fast)
go test -short ./...

# All tests with race detector
go test -race ./...

# Coverage report
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out

# Specific package
go test ./domain/aggregate/...

# Specific test
go test -run TestOrder_AddItem ./domain/aggregate/

# Verbose output
go test -v ./...

# Integration tests (requires docker)
go test -tags=integration ./...

# Benchmark
go test -bench=. ./...
```

---

## 7. Best Practices

### DO

1. **Start with domain tests** - Easiest, most valuable
2. **Use table-driven tests** - Test multiple scenarios efficiently
3. **Test business rules thoroughly** - Cover edge cases
4. **Use descriptive test names** - `TestOrder_AddItem_NegativeQuantity_ReturnsError`
5. **Follow Arrange-Act-Assert** - Clear test structure
6. **Mock external dependencies** - Repos, APIs, time
7. **Use testcontainers for integration** - Real infrastructure
8. **Write tests BEFORE fixing bugs** - Reproduce bug, then fix
9. **Keep tests isolated** - No shared state between tests
10. **Test behavior, not implementation** - Focus on what, not how

### DON'T

1. **Don't test framework code** - Echo, pgx, etc. are already tested
2. **Don't test third-party libraries** - Trust they're tested
3. **Don't over-mock domain tests** - Domain needs ZERO mocks
4. **Don't skip domain tests** - Most valuable tests!
5. **Don't test implementation details** - Refactoring will break tests
6. **Don't share test state** - Each test should be isolated
7. **Don't write flaky tests** - Fix or delete unreliable tests
8. **Don't test private methods** - Test through public API
9. **Don't ignore test failures** - Red tests = blocked development

---

## 8. CI/CD Integration

### Pipeline Requirements

```yaml
test:
  stage: test
  script:
    - go test -race -coverprofile=coverage.out ./...
    - go tool cover -func=coverage.out
  coverage: '/total:\s+\(statements\)\s+(\d+\.\d+%)/'
```

### Quality Gates

| Check | Threshold | Action |
|-------|-----------|--------|
| Overall coverage | < 75% | Block merge |
| Domain coverage | < 90% | Warn |
| Test failures | Any | Block merge |
| Race conditions | Any | Block merge |

---

## 9. Mocking Guidelines

### When to Mock

| Dependency | Mock? | Reason |
|------------|-------|--------|
| Domain logic | NO | Test real behavior |
| Repositories | YES | Avoid DB dependency |
| External APIs | YES | Avoid network calls |
| Time/Clock | YES | Deterministic tests |
| Random | YES | Reproducible tests |

### Mock Structure

```go
// Interface in domain
type OrderRepository interface {
    Save(ctx context.Context, order *Order) error
    FindByID(ctx context.Context, id OrderID) (*Order, error)
}

// Mock for tests
type MockOrderRepository struct {
    mock.Mock
}

func (m *MockOrderRepository) Save(ctx context.Context, order *Order) error {
    args := m.Called(ctx, order)
    return args.Error(0)
}
```

---

## 10. Test Data

### Builders for Test Data

```go
// Test data builder
func NewTestOrder() *Order {
    return &Order{
        ID:     NewOrderID(),
        Status: StatusDraft,
        Items:  []Item{},
    }
}

func (o *Order) WithItems(items ...Item) *Order {
    o.Items = items
    return o
}

func (o *Order) WithStatus(status Status) *Order {
    o.Status = status
    return o
}

// Usage
order := NewTestOrder().
    WithStatus(StatusPending).
    WithItems(Item{SKU: "TEST", Quantity: 1})
```

### Golden Files (for complex output)

```go
func TestComplexOutput(t *testing.T) {
    result := GenerateReport()
    
    golden := filepath.Join("testdata", "expected_report.json")
    
    if *update {
        os.WriteFile(golden, result, 0644)
    }
    
    expected, _ := os.ReadFile(golden)
    assert.JSONEq(t, string(expected), string(result))
}
```
