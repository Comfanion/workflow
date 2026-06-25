---
name: standards-performance
description: Author and maintain the project's performance standards artifact — what to measure, exactly how to measure it, the budget for each metric, and the hot paths that must stay inside the budget. Replaces "the reviewer guesses whether this is fast enough" with written, project-specific latency and throughput targets that `review-performance`, `dev`, and `service-architecture` read directly. Use this whenever the user wants to "write the performance standards", "set latency budgets", "define what to measure", "document hot paths", or mentions "performance budget", "p95 / p99 target", "what metrics matter", or "how to profile". Authors `{DOCS_ROOT}/standards/performance.md`. Runtime monitoring dashboards and alerting policies belong elsewhere; this artifact is the rules code must satisfy.
---

# Standards — Performance

Performance bugs are invisible at N=1 and fatal at N=10000. Without a written standard, every review asks the same question — "is this slow?" — and answers it from intuition. This artifact replaces intuition with budgets: **what we measure, how, the number that fails review, and which paths must hit it.**

The artifact lives at `{DOCS_ROOT}/standards/performance.md`. `{DOCS_ROOT}` defaults to `docs/`. Target size: **8-15 KB**.

`review-performance` reads this artifact directly. The "what counts as a hot path" question lives here, decided once, instead of in every reviewer's head.

## What this artifact must cover

1. **Metrics catalog** — what the project measures and what unit. Latency (p50/p95/p99), throughput (RPS / EPS / batch-per-hour), error rate, resource use (CPU, RSS, heap, connections), saturation (queue depth, pool utilization), database (rows scanned, query time, lock waits). Every metric has a unit and a measurement point. (The runtime dashboards and alert policies that watch these live in `standards-observability` — cross-ref, don't duplicate.)
2. **How to measure** — the tool / library / endpoint per metric. Histograms vs gauges. Sampling rate. Where the metric is emitted from (handler entry / service / repository) so different services produce comparable numbers.
3. **Budgets** — per-metric numbers that fail review. Latency table: p50, p95, p99, with the budget for each. Throughput floor. Error-rate ceiling. Resource ceiling. **A number without a budget is decoration.**
4. **Hot paths** — the enumerated list of paths that must hit the budgets. "Hot path" is a project decision, not a vibe; freeze it here so reviewers and implementers agree. Cold paths get explicit relaxed rules.
5. **Anti-patterns** — the short list of things that fail review regardless of measured impact, because they will fail at scale: N+1, unbounded SELECT, full-table scan on a hot path, blocking IO in async, allocation in a tight loop, lock held across IO.
6. **Caching policy** — when to cache, where the cache lives, the TTL default, and — the part people skip — the invalidation rule. A cache without an invalidation rule is a staleness bug waiting to ship.
7. **Pagination & batching** — list endpoints page by default; max page size; batch-load related entities instead of looping queries. Points at `standards-database` for the query-shape rules; doesn't restate them.
8. **Concurrency & pooling** — connection-pool sizing, worker/goroutine bounds, timeout and context-cancellation rules.
9. **Payload size** — request/response body ceilings and the compression rule.
10. **Performance tests + regression gate** — load test location (e.g. `tests/load/`), tool (k6 / Locust / Artillery / wrk), what scenario is run, and the gate: the p50/p95/p99 thresholds the test asserts and the condition that blocks merge (a perf regression past the allowed delta blocks merge). The runnable scripts live in the boilerplate (see the boilerplate discipline below); this artifact states the threshold.

## How to write it

1. **Read the architecture and NFRs.** Budgets come from the PRD's NFRs, not from a benchmark you ran once. If the PRD says "checkout p99 < 300 ms", that is the row in the table.
2. **Identify hot paths from the architecture.** Per-request handlers, ingestion paths, search, sync — these are typically hot. Migrations, admin scripts, batch jobs — cold by default; raise them only if they have a deadline.
3. **Define how to measure before you set the budget.** A budget on "p95 latency" is meaningless without saying *p95 over what window, sampled how*. Write the measurement first; the budget last.
4. **Cite the governing ADR for any budget or policy that traces to a decision.** When a number or a policy exists because of a recorded architectural decision ("p99 < 300 ms for checkout", "the shared cache tier is X"), link the ADR so the *why* stays one hop away. The ADR is the source of truth — if a rule here ever conflicts with its ADR, the ADR wins and this rule gets corrected. See `authoring-standards` and `adr-writing`.
5. **Keep this artifact rules-only — runnable artifacts live in the boilerplate.** The load-test scripts, the k6/Locust scenario, and the profiler/benchmark harness with its config are maintained in `reference/boilerplate`, not pasted here. State the threshold and reference the artifact; a pasted copy drifts from the one that actually runs.
6. **Draft from `references/template.md`.**
7. **Validate against `references/checklist.md`.**

## Latency budgets — example shape

| Surface | p50 | p95 | p99 | Notes |
|---------|-----|-----|-----|-------|
| Public REST GET (single resource) | 50 ms | 150 ms | 300 ms | warmed cache |
| Public REST POST (write) | 80 ms | 250 ms | 500 ms | includes DB write |
| Search endpoint | 100 ms | 400 ms | 800 ms | cold-cache fan-out |
| Internal RPC | 20 ms | 80 ms | 200 ms | warm |
| Background job (per item) | — | 500 ms | 2 s | not user-facing |

Adjust to the actual SLOs in the PRD. The point of the table is to make "good enough" a number, not an opinion.

## Hot paths — name them

`review-performance` asks: is this a hot path? The artifact must list:

- the per-request handlers and RPC endpoints,
- the ingestion / sync / search paths,
- any path on a user-facing critical journey.

Anything not on the list is cold; reviewers can stop debating it.

## Anti-patterns — the always-block list

Even without a measured impact, these fail review because they fail at scale:

- N+1 query — a query inside a loop over results of another query.
- `SELECT *` on a wide table on a hot path.
- Unbounded list materialized into memory (no LIMIT, no pagination, no streaming).
- O(n²) accidentally (nested scans, repeated `.contains` on a list, list-as-set).
- Allocation in a tight loop (string concat, slice grow without `make`).
- Blocking IO on an async / request-latency path.
- A lock held across IO.

This list belongs in the artifact so the reviewer cites it instead of restating it. The query-shape rules (indexes, `SELECT` columns, scan limits) live in `standards-database`; this artifact points there rather than restating them.

## Caching policy — the invalidation rule is the policy

State for each cached surface: **what** is cached, **where** (in-process / shared tier), the **TTL**, and **how it is invalidated** (TTL-only, write-through, explicit bust on event). Write-without-invalidate is the default bug; name the rule that prevents it. If the cache tier is a recorded decision, cite the ADR.

## Pagination & batching

List endpoints page by default; state the max page size and the pagination style (offset / cursor). Batch-load related entities instead of looping a query over a result set (see anti-pattern N+1). The query-shape rules behind this live in `standards-database`.

## Concurrency & pooling

State the connection-pool sizing (max, min/idle), the worker/goroutine bound (no unbounded fan-out), and the request timeout with context-cancellation propagation.

## Payload size

State the request and response body ceilings and the compression rule (e.g. gzip above N KB).

## Regression gate — the part that makes budgets real

The gate names every blocker: any load-test budget breach (p95/p99 over threshold), throughput below floor, error rate above ceiling, a benchmark regression past the allowed delta. A perf regression blocks merge. The runnable enforcement is the boilerplate's load-test job; this artifact states which conditions block.

## Update protocol

- An incident traces back to a missing budget → add the metric and the number that would have caught it.
- A new endpoint or pipeline appears → file it as hot or cold in the artifact.
- An anti-pattern bites again → add it to the always-block list (rare; the list should stabilize).
- An NFR changes in the PRD → update the matching budget row and re-cite the ADR.

File the update through `authoring-standards` (review before it propagates); don't fix it in a reviewer's head.

## Templates and references

- `references/template.md` — full `performance.md` template.
- `references/checklist.md` — validation checklist for the artifact.

## Who reads this artifact

- `review-performance` — drives the dimension; "what counts as a hot path" answered here.
- `dev` — when an implementation touches a hot path.
- `service-architecture` — when choosing between sync and async, caching strategy, or scaling shape.
- `test-design` — when planning load tests.

## Roles

Authored by the tech lead, performance engineer, or solo developer. Reviewed by the project owner.

## Related

- `standards` — umbrella router.
- `authoring-standards` — cross-cutting authoring rules + ADR/boilerplate discipline; route updates through it.
- `adr-writing` — the governing-decision record a budget or policy cites.
- `using-standards` — consumer protocol.
- `standards-database` — query-shape rules (the perf overlap lives there).
- `standards-observability` — the runtime dashboards and alerts that measure these budgets.
- `review-performance`, `service-architecture`, `test-design` — downstream consumers.
