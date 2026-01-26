---
name: test-design
description: Use when designing test strategy, writing unit/integration tests, or improving coverage
license: MIT
compatibility: opencode
metadata:
  domain: development
  agents: [dev, coder]
---

# Test Design Skill

Principles for writing effective tests.

## Test Naming

```
Test{Component}_{Method}_{Scenario}_{Expected}

Examples:
- TestUser_Create_ValidData_Success
- TestUser_Create_EmptyEmail_ReturnsError
- TestOrder_Cancel_AlreadyShipped_Fails
```

## Test Structure (AAA)

```
// Arrange - Setup
input := ...
expected := ...

// Act - Execute
result := sut.Method(input)

// Assert - Verify
assert(result == expected)
```

## Table-Driven Tests

When testing multiple scenarios of same function:

```
tests := []struct {
    name     string
    input    Input
    expected Output
    wantErr  bool
}{
    {"valid input", validInput(), expectedOutput(), false},
    {"empty input", emptyInput(), nil, true},
}

for _, tt := range tests {
    t.Run(tt.name, func(t *testing.T) {
        result, err := sut.Method(tt.input)
        // assert
    })
}
```

## What to Test

**Always test:**
- Public API / exported functions
- Business logic / domain rules
- Error handling paths
- Edge cases (empty, nil, zero, max)
- State transitions

**Skip testing:**
- Private implementation details
- Simple getters/setters
- Generated code
- Framework internals

## Mocking

Mock when:
- External services (HTTP, DB)
- Non-deterministic (time, random)
- Slow operations

Prefer interfaces for testability:
```
type Repository interface {
    Find(id string) (*Entity, error)
}

// Production: RealRepository
// Tests: MockRepository
```

## Test Isolation

Each test should:
- Setup its own data
- Not depend on other tests
- Clean up after itself
- Run in any order

## Coverage Guidelines

| Layer | Target |
|-------|--------|
| Domain/Business | 80%+ |
| Application/UseCase | 70%+ |
| Infrastructure | 50%+ |

Focus on critical paths, not 100% coverage.
