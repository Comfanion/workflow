# Test Design Skill

How to design and write effective tests for implementations.

## Test Pyramid

```
        /\
       /  \     E2E Tests (few)
      /----\    
     /      \   Integration Tests (some)
    /--------\  
   /          \ Unit Tests (many)
  /------------\
```

## Unit Tests

### When to Write
- Every public function
- Every method with business logic
- Edge cases and error paths

### Structure (Arrange-Act-Assert)

```go
func TestFunction_Scenario_ExpectedBehavior(t *testing.T) {
    // Arrange - Setup test data
    input := createTestInput()
    expected := expectedOutput()
    sut := NewSystemUnderTest()
    
    // Act - Execute the function
    result, err := sut.Function(input)
    
    // Assert - Verify the outcome
    if err != nil {
        t.Fatalf("unexpected error: %v", err)
    }
    if result != expected {
        t.Errorf("got %v, want %v", result, expected)
    }
}
```

### Naming Convention

```
Test{Type}_{Method}_{Scenario}

Examples:
- TestOffer_UpdatePrice_Success
- TestOffer_UpdatePrice_NegativePrice_ReturnsError
- TestOffer_Activate_FromPendingStatus_Success
- TestOffer_Activate_FromDeclinedStatus_Fails
```

### Table-Driven Tests

```go
func TestOffer_Validate(t *testing.T) {
    tests := []struct {
        name    string
        offer   Offer
        wantErr bool
    }{
        {
            name:    "valid offer",
            offer:   validOffer(),
            wantErr: false,
        },
        {
            name:    "zero price",
            offer:   offerWithZeroPrice(),
            wantErr: true,
        },
        {
            name:    "negative quantity",
            offer:   offerWithNegativeQty(),
            wantErr: true,
        },
    }
    
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            err := tt.offer.Validate()
            if (err != nil) != tt.wantErr {
                t.Errorf("Validate() error = %v, wantErr %v", err, tt.wantErr)
            }
        })
    }
}
```

## Integration Tests

### When to Write
- Repository implementations
- API endpoints
- External service integrations
- Multi-component workflows

### Setup/Teardown

```go
func TestMain(m *testing.M) {
    // Setup
    testDB = setupTestDatabase()
    
    // Run tests
    code := m.Run()
    
    // Teardown
    teardownTestDatabase(testDB)
    
    os.Exit(code)
}
```

### Test Isolation

```go
func TestRepository_Save(t *testing.T) {
    // Use transaction that rolls back
    tx := testDB.Begin()
    defer tx.Rollback()
    
    repo := NewRepository(tx)
    
    // Test code here
}
```

## Test Coverage Requirements

| Type | Minimum Coverage |
|------|-----------------|
| Domain/Business Logic | 80%+ |
| Use Cases/Handlers | 70%+ |
| Repositories | 60%+ |
| HTTP Handlers | 50%+ |

## What to Test

### Domain Layer
- All aggregate methods
- All value object validation
- Domain service logic
- State transitions

### Application Layer
- Use case happy paths
- Error scenarios
- Validation failures
- Authorization checks

### Infrastructure Layer
- Repository CRUD operations
- External service adapters
- Event publishing/consuming

## What NOT to Test

- Private functions (test via public interface)
- Simple getters/setters
- Framework code
- Generated code (SQLC, etc.)

## Mocking

### When to Mock
- External services
- Databases (for unit tests)
- Time-dependent operations
- Random/non-deterministic operations

### Interface-Based Mocking

```go
// Define interface
type UserRepository interface {
    FindByID(ctx context.Context, id string) (*User, error)
}

// Create mock
type MockUserRepository struct {
    FindByIDFunc func(ctx context.Context, id string) (*User, error)
}

func (m *MockUserRepository) FindByID(ctx context.Context, id string) (*User, error) {
    return m.FindByIDFunc(ctx, id)
}

// Use in test
func TestUseCase(t *testing.T) {
    mockRepo := &MockUserRepository{
        FindByIDFunc: func(ctx context.Context, id string) (*User, error) {
            return &User{ID: id, Name: "Test"}, nil
        },
    }
    
    useCase := NewUseCase(mockRepo)
    // ...
}
```

## Test Data

### Builders

```go
func NewTestOffer() *Offer {
    return &Offer{
        ID:         NewOfferID(),
        MerchantID: NewMerchantID(),
        Price:      decimal.NewFromInt(100),
        Status:     OfferStatusPending,
    }
}

func (o *Offer) WithPrice(price decimal.Decimal) *Offer {
    o.Price = price
    return o
}

func (o *Offer) WithStatus(status OfferStatus) *Offer {
    o.Status = status
    return o
}

// Usage
offer := NewTestOffer().WithPrice(decimal.NewFromInt(200)).WithStatus(OfferStatusActive)
```

## Red-Green-Refactor Cycle

### 1. RED - Write Failing Test

```go
func TestOffer_UpdatePrice_Success(t *testing.T) {
    offer := NewTestOffer()
    newPrice := decimal.NewFromInt(150)
    
    err := offer.UpdatePrice(newPrice)
    
    if err != nil {
        t.Fatalf("unexpected error: %v", err)
    }
    if !offer.Price.Equal(newPrice) {
        t.Errorf("price not updated")
    }
}
```

Run test - it should FAIL.

### 2. GREEN - Minimal Implementation

```go
func (o *Offer) UpdatePrice(price decimal.Decimal) error {
    o.Price = price
    return nil
}
```

Run test - it should PASS.

### 3. REFACTOR - Improve Code

```go
func (o *Offer) UpdatePrice(price decimal.Decimal) error {
    if price.LessThanOrEqual(decimal.Zero) {
        return ErrInvalidPrice
    }
    o.Price = price
    return nil
}
```

Run test - it should still PASS.

Add test for new validation:

```go
func TestOffer_UpdatePrice_ZeroPrice_ReturnsError(t *testing.T) {
    offer := NewTestOffer()
    
    err := offer.UpdatePrice(decimal.Zero)
    
    if !errors.Is(err, ErrInvalidPrice) {
        t.Errorf("expected ErrInvalidPrice, got %v", err)
    }
}
```

## Test Commands

```bash
# Run all tests
go test ./...

# Run with coverage
go test -cover ./...

# Run specific test
go test -run TestOffer_UpdatePrice ./...

# Run with race detection
go test -race ./...

# Verbose output
go test -v ./...
```
