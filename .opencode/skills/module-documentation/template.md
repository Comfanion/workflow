# [Module Name]

**Domain:** [Bounded Context]
**Owner:** [Team/Person]
**Status:** Planning | Development | Production
**Last Updated:** YYYY-MM-DD

---

## Overview

[2-3 sentences: What this module does and why it exists]

---

## Quick Links

| Document | Description |
|----------|-------------|
| [Architecture](./architecture.md) | Module design and structure |
| [PRD](./prd.md) | Module requirements |
| [Data Model](./data-model.md) | Database schema |
| [Domain](./domain.md) | Domain model (DDD) |

---

## Subdirectories

| Directory | Contents | Status |
|-----------|----------|--------|
| [api/](./api/) | OpenAPI specs | Active |
| [events/](./events/) | Event schemas | Active |
| [scenarios/](./scenarios/) | Use case scenarios | Active |
| [flows/](./flows/) | Flow diagrams | Active |
| [integrations/](./integrations/) | External integrations | - |
| [decisions/](./decisions/) | Module ADRs | - |

---

## Key Responsibilities

- [Responsibility 1]
- [Responsibility 2]
- [Responsibility 3]

---

## Dependencies

### Depends On

| Module | Type | Purpose |
|--------|------|---------|
| [Module A](../module-a/) | Sync (HTTP) | Get user data |
| [Module B](../module-b/) | Async (Event) | React to events |

### Depended By

| Module | Type | Purpose |
|--------|------|---------|
| [Module C](../module-c/) | Sync (HTTP) | Fetch our data |
| [Module D](../module-d/) | Async (Event) | Consumes our events |

---

## Key Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Latency (p95) | < 100ms | - |
| Availability | 99.9% | - |
| Error Rate | < 0.1% | - |
| Throughput | > 500 RPS | - |

---

## API Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/[resource]` | Create |
| GET | `/api/v1/[resource]/{id}` | Get by ID |
| PUT | `/api/v1/[resource]/{id}` | Update |
| GET | `/api/v1/[resource]` | List |

Full API: [api/](./api/)

---

## Events Summary

### Published

| Event | Topic | Description |
|-------|-------|-------------|
| [Event]Created | [topic] | When created |
| [Event]Updated | [topic] | When updated |

### Consumed

| Event | Topic | Source |
|-------|-------|--------|
| [Other]Created | [topic] | [Module] |

Full events: [events/](./events/)

---

## Quick Start

### Local Development

```bash
# Prerequisites
# - Go 1.21+
# - PostgreSQL 15+
# - Docker

# Run locally
cd src/services/[module]
go run cmd/api/main.go

# Run tests
go test ./...
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection | Yes |
| `KAFKA_BROKERS` | Kafka broker list | Yes |

---

## Related

- [System Architecture](../../architecture.md)
- [Database Overview](../../architecture-db.md)
