# Performance Standards — Validation Checklist

- [ ] Every metric in the catalog has a unit and a measurement point.
- [ ] Latency table covers every surface enumerated in the architecture; each row has p50, p95, p99.
- [ ] Throughput floors and error ceilings present for any surface that has an NFR.
- [ ] Resource ceilings present per major component.
- [ ] Hot-paths list is enumerated, not described abstractly.
- [ ] Anti-pattern list is short and concrete; query-shape rules deferred to `standards-database`.
- [ ] Caching policy states what / where / TTL / invalidation for each cached surface — no cache without an invalidation rule.
- [ ] Pagination defaults and max page size stated; batch-loading rule present.
- [ ] Concurrency & pooling limits stated (pool size, worker bound, timeout/cancellation).
- [ ] Payload-size ceilings and compression rule present.
- [ ] Performance-test section names location, tool, scenario; runnable scripts referenced in the boilerplate, not pasted.
- [ ] Regression gate enumerates every blocker (p95, p99, throughput, error rate, benchmark regression).
- [ ] Every budget number traces to a PRD NFR or an architecture decision; governing ADR linked where one exists.
- [ ] File size 8-15 KB.
- [ ] No `{{placeholders}}` left.
