# Performance Standards

**Project:** {{project_name}}
**Stack:** {{stack}}
**Last updated:** {{date}}

> Source of truth for `review-performance`. Budgets here mean "below this fails review"; the architecture and NFRs feed the numbers.

## 1. Metrics Catalog

| Metric | Unit | Where emitted | How measured |
|--------|------|---------------|--------------|
| Request latency | ms | handler entry → response sent | histogram, p50/p95/p99 |
| Throughput | RPS | reverse proxy | rolling 1-min average |
| Error rate | % | handler return path | 5xx / total over 5 min |
| CPU | % | runtime | per-pod, 1-min average |
| RSS | MB | runtime | per-pod, 1-min average |
| Heap (if VM) | MB | runtime | per-pod, 1-min average |
| Queue depth | items | consumer entry | gauge |
| DB query time | ms | repository | per-query histogram |
| Rows scanned | rows | DB | per-query, log if > {{threshold}} |
| Pool utilization | % | connection pool | gauge |

## 2. Latency Budgets

| Surface | p50 | p95 | p99 |
|---------|-----|-----|-----|
| {{surface}} | {{p50}} | {{p95}} | {{p99}} |
| {{surface}} | {{p50}} | {{p95}} | {{p99}} |
| {{surface}} | {{p50}} | {{p95}} | {{p99}} |

Window: rolling 5 minutes unless stated otherwise.

## 3. Throughput Floors and Error Ceilings

| Surface | Floor (RPS / EPS) | Error ceiling |
|---------|-------------------|---------------|
| {{surface}} | {{rps}} | {{error}} |

## 4. Resource Ceilings

| Component | CPU | RSS | Notes |
|-----------|-----|-----|-------|
| {{component}} | {{cpu}}% | {{rss}} MB | per pod |

## 5. Hot Paths

Anything in this list must hit the budgets above; anything not in this list is cold.

- {{handler / endpoint}}
- {{ingestion path}}
- {{search / sync path}}

Cold by default: migrations, admin scripts, scheduled cleanup, one-off backfills.

## 6. Anti-patterns (always block review)

1. N+1 query — a query inside a loop over results of another query.
2. `SELECT *` on a wide table on a hot path.
3. Unbounded list materialized into memory.
4. Accidental O(n²) — nested scans, repeated `.contains` on list, list-as-set.
5. Allocation in a tight loop (string concat, slice grow without `make`).
6. Blocking IO on an async / request-latency path.
7. Lock held across IO.

## 7. Performance Tests

- Location: `tests/load/`
- Tool: {{tool}}
- Scenario: {{scenario}}
- Blocker: any budget breach in scenario blocks merge.

## 8. Tracing and Sampling

- Tracer: {{tracer}}
- Sampling rate: {{rate}}
- Required spans: handler, service, repository, external call.
