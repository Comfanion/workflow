# Performance Standards

**Project:** {{project_name}}
**Stack:** {{stack}}
**Last updated:** {{date}}
**Governing ADR(s):** {{ADR-NNN link, or "—"}}

> Source of truth for `review-performance`. Budgets here mean "below this fails review"; the architecture and NFRs feed the numbers. Runtime dashboards and alerts that watch these metrics live in `standards-observability`.

## Reading guide

Section-addressable — read only the sections your task needs; the whole doc is the source of truth when in doubt.

| If you are… | Read |
|-------------|------|
| **Designing** (architect / planner) | §2 Latency budgets · §3 Throughput & error ceilings · §4 Resource ceilings · §5 Hot paths · §7 Caching policy |
| **Implementing** (dev) | §1 Metrics catalog · §6 Anti-patterns · §8 Pagination & batching · §9 Concurrency & pooling · §10 Payload size · §12 Tracing |
| **Reviewing** (review-performance) | §6 Anti-patterns · §11 Regression gate · the budgets §2–§4 |

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

## 7. Caching Policy

| Surface | What is cached | Where | TTL | Invalidation |
|---------|----------------|-------|-----|--------------|
| {{surface}} | {{data}} | {{in-process / shared tier}} | {{TTL}} | {{TTL-only / write-through / bust on event}} |

Default rule: no cache without a stated invalidation rule. Cache tier: {{tier}} ({{cite ADR-NNN if a decision}}).

## 8. Pagination & Batching

- List endpoints paginate by default; default page size: {{N}}; max page size: {{N}}.
- Pagination style: {{offset / cursor}} ({{reason}}).
- Batch-load related entities ({{batch API}}); never loop a query over a result set — see anti-pattern 1. Query-shape rules live in `standards-database`.

## 9. Concurrency & Pooling

| Resource | Limit | Notes |
|----------|-------|-------|
| Connection pool (max) | {{N}} | per instance |
| Connection pool (min / idle) | {{N}} | warm |
| Worker / concurrency bound | {{N}} | bounded; no unbounded fan-out |
| Request timeout | {{ms}} | context cancellation propagated |

## 10. Payload Size

- Request body ceiling: {{size}}. Response body ceiling: {{size}}.
- Compression: {{when applied — e.g. gzip above N KB}}.

## 11. Performance Tests & Regression Gate

- Location: `tests/load/` — runnable scenarios live in the boilerplate (`{{path/in/boilerplate}}`).
- Tool: {{tool}}
- Scenario: {{scenario}}

| Check | Threshold | Action |
|-------|-----------|--------|
| Load-test p95 | > {{budget}} | block |
| Load-test p99 | > {{budget}} | block |
| Throughput | < {{floor}} | block |
| Error rate | > {{ceiling}} | block |
| Benchmark regression | > {{allowed delta}} | block |

This table is the rule; the boilerplate's load-test job enforces it.

## 12. Tracing and Sampling

- Tracer: {{tracer}}
- Sampling rate: {{rate}}
- Required spans: handler, service, repository, external call.
