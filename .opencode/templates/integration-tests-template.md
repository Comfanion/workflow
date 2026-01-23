# Architecture Integration Tests

**Architecture Version:** [X.Y]
**Date:** [YYYY-MM-DD]
**Author:** [Name]
**Status:** Draft | Review | Approved

---

## Overview

This document defines integration test specifications for module contracts, 
API boundaries, and cross-cutting concerns as defined in the Architecture document.

**Reference:** @docs/architecture.md

---

## 1. Module Contract Tests

### 1.1 [Module A] ↔ [Module B] Contract

**Integration Type:** API | Event | Database
**Architecture Reference:** Section X.Y

#### Contract Definition

```yaml
producer: module-a
consumer: module-b
contract_type: REST API | Kafka Event | Shared Schema
```

#### Test Scenarios

| Test ID | Scenario | Input | Expected Output | Priority |
|---------|----------|-------|-----------------|----------|
| INT-001 | Happy path | Valid request | 200 OK + response | P0 |
| INT-002 | Invalid input | Malformed request | 400 Bad Request | P0 |
| INT-003 | Not found | Non-existent ID | 404 Not Found | P1 |
| INT-004 | Timeout handling | Slow response | Retry + fallback | P1 |

#### Contract Schema

```json
// Request
{
  "id": "uuid",
  "data": {}
}

// Response  
{
  "status": "success|error",
  "data": {}
}
```

---

### 1.2 [Module C] ↔ [External System] Contract

**Integration Type:** External API
**Architecture Reference:** Section X.Y

#### Test Scenarios

| Test ID | Scenario | Input | Expected Output | Priority |
|---------|----------|-------|-----------------|----------|
| INT-010 | External API call | Valid payload | External response | P0 |
| INT-011 | External unavailable | Any request | Circuit breaker | P0 |
| INT-012 | Rate limit hit | Many requests | Backoff + retry | P1 |

---

## 2. Event-Driven Integration Tests

### 2.1 Event: [event.name]

**Producer:** [module-name]
**Consumers:** [consumer-1], [consumer-2]
**Architecture Reference:** Section X.Y

#### Event Schema

```json
{
  "event_type": "order.created",
  "version": "1.0",
  "timestamp": "ISO8601",
  "payload": {
    "order_id": "uuid",
    "customer_id": "uuid"
  }
}
```

#### Test Scenarios

| Test ID | Scenario | Setup | Action | Verification | Priority |
|---------|----------|-------|--------|--------------|----------|
| EVT-001 | Event published | Order created | Publish event | Event in Kafka topic | P0 |
| EVT-002 | Consumer processes | Event published | Consumer runs | State updated | P0 |
| EVT-003 | Idempotent processing | Duplicate event | Consumer runs | No duplicate state | P0 |
| EVT-004 | Dead letter handling | Invalid event | Consumer fails | Event in DLQ | P1 |

---

## 3. Database Integration Tests

### 3.1 [Module] Repository Tests

**Database:** PostgreSQL
**Tables:** [table1], [table2]
**Architecture Reference:** Section X.Y

#### Test Scenarios

| Test ID | Scenario | Setup | Operation | Verification | Priority |
|---------|----------|-------|-----------|--------------|----------|
| DB-001 | Create entity | Empty DB | Insert | Entity persisted | P0 |
| DB-002 | Read entity | Entity exists | Select | Correct data returned | P0 |
| DB-003 | Update entity | Entity exists | Update | Changes persisted | P0 |
| DB-004 | Delete entity | Entity exists | Delete | Entity removed | P0 |
| DB-005 | Optimistic lock | Concurrent update | Update | Version conflict | P0 |
| DB-006 | Transaction rollback | Partial failure | Multi-insert | All rolled back | P0 |

---

## 4. API Boundary Tests

### 4.1 [Service] HTTP API

**Base URL:** /api/v1/[resource]
**Architecture Reference:** Section X.Y

#### Endpoint Tests

| Test ID | Method | Endpoint | Request | Expected | Priority |
|---------|--------|----------|---------|----------|----------|
| API-001 | POST | /resource | Valid body | 201 Created | P0 |
| API-002 | GET | /resource/{id} | Valid ID | 200 + entity | P0 |
| API-003 | PUT | /resource/{id} | Valid update | 200 + updated | P0 |
| API-004 | DELETE | /resource/{id} | Valid ID | 204 No Content | P0 |
| API-005 | POST | /resource | Invalid body | 400 + errors | P0 |
| API-006 | GET | /resource/{id} | Unknown ID | 404 Not Found | P0 |
| API-007 | ANY | /resource | No auth | 401 Unauthorized | P0 |
| API-008 | ANY | /resource | Wrong role | 403 Forbidden | P1 |

---

## 5. Cross-Cutting Concerns

### 5.1 Authentication & Authorization

| Test ID | Scenario | Setup | Action | Expected | Priority |
|---------|----------|-------|--------|----------|----------|
| AUTH-001 | Valid JWT | Valid token | API call | 200 OK | P0 |
| AUTH-002 | Expired JWT | Expired token | API call | 401 Unauthorized | P0 |
| AUTH-003 | Invalid JWT | Malformed token | API call | 401 Unauthorized | P0 |
| AUTH-004 | Role check | User without role | Protected endpoint | 403 Forbidden | P0 |

### 5.2 Observability

| Test ID | Scenario | Action | Verification | Priority |
|---------|----------|--------|--------------|----------|
| OBS-001 | Request logging | API call | Log entry created | P1 |
| OBS-002 | Error logging | Error occurs | Error logged with context | P0 |
| OBS-003 | Trace propagation | Cross-service call | Trace ID preserved | P1 |
| OBS-004 | Metrics export | API calls | Metrics in Prometheus | P1 |

### 5.3 Error Handling

| Test ID | Scenario | Trigger | Expected Response | Priority |
|---------|----------|---------|-------------------|----------|
| ERR-001 | Validation error | Invalid input | 400 + structured error | P0 |
| ERR-002 | Business error | Domain violation | 422 + error code | P0 |
| ERR-003 | Not found | Unknown resource | 404 + message | P0 |
| ERR-004 | Internal error | Unexpected failure | 500 + correlation ID | P0 |
| ERR-005 | Service unavailable | Dependency down | 503 + retry-after | P1 |

---

## 6. NFR Verification Tests

### 6.1 Performance Tests

**Tool:** k6
**Environment:** Staging

| Test ID | NFR ID | Scenario | Target | Duration | Priority |
|---------|--------|----------|--------|----------|----------|
| PERF-001 | NFR-001 | API response time | p95 < 200ms | 10 min | P0 |
| PERF-002 | NFR-002 | Throughput | > 1000 RPS | 10 min | P0 |
| PERF-003 | NFR-003 | Concurrent users | 500 users | 30 min | P1 |

### 6.2 Reliability Tests

| Test ID | NFR ID | Scenario | Recovery Time | Priority |
|---------|--------|----------|---------------|----------|
| REL-001 | NFR-010 | Service restart | < 30 sec | P0 |
| REL-002 | NFR-011 | Database failover | < 60 sec | P0 |
| REL-003 | NFR-012 | Kafka partition leader change | No message loss | P0 |

---

## 7. Test Environment

### 7.1 Testcontainers Setup

```go
// Example testcontainers configuration
containers:
  postgres:
    image: postgres:17
    ports: [5432]
    env:
      POSTGRES_DB: test_db
      POSTGRES_USER: test
      POSTGRES_PASSWORD: test
  
  kafka:
    image: confluentinc/cp-kafka:7.x
    ports: [9092]
  
  redis:
    image: redis:7
    ports: [6379]
```

### 7.2 Test Data

| Dataset | Description | Location |
|---------|-------------|----------|
| seed_data.sql | Initial test data | tests/fixtures/ |
| events.json | Sample Kafka events | tests/fixtures/ |

---

## Coverage Matrix

| Module | Contract Tests | Event Tests | API Tests | DB Tests | Total |
|--------|---------------|-------------|-----------|----------|-------|
| Catalog | 5 | 3 | 8 | 6 | 22 |
| Orders | 4 | 5 | 10 | 8 | 27 |
| Inventory | 3 | 4 | 6 | 5 | 18 |
| **Total** | 12 | 12 | 24 | 19 | 67 |

---

## Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Architect | | | |
| Tech Lead | | | |
| QA Lead | | | |

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | YYYY-MM-DD | [Name] | Initial draft |
