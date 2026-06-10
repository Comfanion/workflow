---
name: review-performance
description: Review a code change for performance defects only — N+1 queries, hot-path allocations, inefficient queries/algorithms, blocking calls, unbounded work, and leaked resources. Use when running the performance dimension of a code review, when the user says "performance review", "is this slow", "check for N+1", or when code-review dispatches the performance pass. One focused lens — it does not judge security, style, or correctness; it returns performance findings with a dimension verdict.
---

# Review — Performance

The performance dimension of a code review. One job: find work this change does that it does not need to do, especially on hot paths and at scale. Most performance bugs are invisible at N=1 and fatal at N=10000.

## Scope
Applies to changes touching loops over collections, DB/network calls, request handlers, batch jobs, serialization, caching, or concurrency. Pure config/docs changes → PASS, say so.

## Checklist — work each item
For each: checked → finding, or "checked, clean".

- **N+1:** no query inside a loop; batch/join/preload instead. Look at every loop that touches IO.
- **Query efficiency:** indexed columns in WHERE/JOIN; no `SELECT *` on wide tables; no full-table scans on hot paths; pagination on unbounded results.
- **Algorithmic:** no accidental O(n²) (nested scans, repeated `.contains` on a list); right data structure (set/map vs list).
- **Allocations:** no needless allocation in hot loops; reuse buffers; avoid repeated string concatenation in loops.
- **Blocking:** no synchronous/blocking IO on an async or request-latency path; no lock held across IO.
- **Unbounded work:** inputs that scale with user data have limits/streaming, not load-everything-into-memory.
- **Resources:** connections, files, streams closed; no leaks; pools sized.

## Evidence discipline (anti-slop)
- Each finding cites `path/file:line`, the cost (what scales and how), and the fix.
- State the assumed scale ("hot path, per-request" vs "one-off migration") — a finding's severity depends on it.
- Do not flag micro-optimizations on cold paths as if they mattered.

## Output
```
PERFORMANCE: {PASS | FINDINGS}
- [MED] `path/file:line` — {what scales badly, at what N} → {fix}
```
Performance findings are usually MEDIUM (shape, rarely block) — except an O(n²)/N+1 on a hot path at real scale, which is HIGH.

**What counts as a hot path** — pin the call, don't leave it to reviewer mood. A path is hot when any of these holds:

- it runs per-request or per-event (not one-off: a migration or admin script is cold);
- it sits on a core data path — ingestion, search, sync — where volume is the product;
- its cost is visible in a user-facing response time.

A finding **blocks** (HIGH) when the impact is user-visible or the cost grows unbounded with data or traffic — O(n²)/N+1 qualifies regardless of today's frequency, because n grows even when req/s doesn't. Everything else on a cold path is MEDIUM at most. The rule is auditable: name which clause fired in the finding.
