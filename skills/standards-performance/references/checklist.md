# Performance Standards — Validation Checklist

- [ ] Every metric in the catalog has a unit and a measurement point.
- [ ] Latency table covers every surface enumerated in the architecture; each row has p50, p95, p99.
- [ ] Throughput floors and error ceilings present for any surface that has an NFR.
- [ ] Resource ceilings present per major component.
- [ ] Hot-paths list is enumerated, not described abstractly.
- [ ] Anti-pattern list is short and concrete.
- [ ] Performance-test section names location, tool, scenario, and blocker.
- [ ] Every budget number traces to a PRD NFR or an architecture decision.
- [ ] File size 8-15 KB.
- [ ] No `{{placeholders}}` left.
