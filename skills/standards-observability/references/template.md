# Observability Standard

**Version:** {{version}}
**Status:** {{Draft | Active}}
**Last updated:** {{date}}
**Governing ADR(s):** {{ADR-NNN link, or "—"}}
**Related:** {{architecture / spec / ticket / related-doc links, or —}}

> Scope: instrumentation **conventions** only — how a service emits metrics, traces, and logs, and how they correlate. The runnable collector/agent config, dashboards, alert rules, retention, and the observability topology are infrastructure — see the project's `{{infrastructure/deployment doc}}` and the boilerplate. This doc states the rule; those own the artifact.

---

## Reading guide

Section-addressable — read only the sections your task needs; the whole doc is the source of truth when in doubt.

| If you are… | Read |
|-------------|------|
| **Designing** (architect / planner) | §1 Philosophy & the three signals · §5 Correlation & retention · §6 Where the runnable artifacts live |
| **Implementing** (dev) | §2 Metrics · §3 Tracing · §4 Logging |
| **Reviewing** (reviewer) | §2 Cardinality budget · §4 Never-log list · the correlation id present across all signals |

## 1. Philosophy & The Three Signals

This project optimizes for: {{one sentence — e.g. "every request traceable end to end from a single id"}}.

| Signal | Role | Backend (placeholder) |
|--------|------|------------------------|
| Metrics | aggregate health, alerting, SLOs | {{metrics backend}} |
| Traces | request lifecycle across services | {{tracing backend}} |
| Logs | discrete events with full context | {{log store}} |

Joining id: **{{correlation/trace id field name}}** — present on every signal; the one value that stitches a metric exemplar → a trace → its logs.

Core principle: {{the one habit this standard enforces}}.

---

## 2. Metrics

### 2.1 What to instrument

- Request-driven paths — **RED**: Rate, Errors, Duration.
- Resources (pools, queues, caches, CPU/mem) — **USE**: Utilization, Saturation, Errors.
- Business signals: {{list — e.g. items processed, success rate}}.

Baseline set:

| Signal | Type | Name (convention) | Labels |
|--------|------|-------------------|--------|
| Request rate | counter | `{{requests_total}}` | `{{method, endpoint, status}}` |
| Latency | histogram | `{{request_duration_seconds}}` | `{{method, endpoint}}` |
| Error rate | counter | `{{errors_total}}` | `{{endpoint, error_type}}` |
| Resource use | gauge | `{{resource_in_use}}` | `{{resource}}` |

### 2.2 Naming & units

- Counters end `_total`; durations in **seconds**, sizes in **bytes** (base SI).
- Name pattern: {{`namespace_subsystem_name_unit`}}.
- One metric = one meaning; don't overload a metric with conditional labels.

### 2.3 Cardinality budget

Allowed labels (bounded): {{service, env, version, endpoint, status, ...}}.
**Forbidden labels** (unbounded): user id, request/trace id, raw URL path, free-text, timestamps.
Per-metric label ceiling: {{N}} labels. Reason any deviation in this doc.

### 2.4 SLI/SLO linkage

Each metric maps to an SLI or an incident question. The SLO targets themselves live in `standards-performance`:

| SLI | Source metric | SLO target | Owner |
|-----|---------------|------------|-------|
| {{availability}} | {{metric}} | {{target}} | {{team}} |
| {{latency p95}} | {{metric}} | {{target}} | {{team}} |

---

## 3. Tracing

### 3.1 Span conventions

- Span name = {{operation, low-cardinality — e.g. "CreateOrder", "db.query"}}; never embed ids in the name.
- Required attributes: `{{service}}`, `{{env}}`, `{{version}}`, and the joining id.
- Record errors on the span ({{set status + attach error}}); don't swallow them silently.

### 3.2 Context propagation

- The **{{correlation/trace id}}** propagates across every boundary: inbound request → outbound calls → async messages → background jobs.
- Propagation mechanism: {{header / message attribute name and format}}.
- A boundary that drops the id breaks correlation — list every boundary the service crosses: {{list}}.

### 3.3 What to span

Span: {{inbound handlers, outbound calls, DB queries, message publish/consume, expensive domain ops}}.
Don't span: {{trivial in-memory calls, hot-loop iterations}}.

### 3.4 Sampling

Rule: {{e.g. 100% in non-prod, N% head-sampling in prod, always-sample on error}}.
Runnable sampler config lives in the `{{infrastructure/deployment doc}}` / boilerplate.

---

## 4. Logging (structured)

### 4.1 Format & required fields

Format: structured {{JSON}}, one event per line, machine-parseable.

| Field | Required | Notes |
|-------|----------|-------|
| timestamp | yes | {{format}} |
| level | yes | see 4.2 |
| message | yes | static string; variables go in fields, not the message |
| {{correlation/trace id}} | yes | joins logs ↔ traces ↔ metrics |
| service / env / version | yes | service identity |
| {{domain fields}} | as needed | structured, never string-concatenated |

### 4.2 Levels — when each applies

| Level | When | Example |
|-------|------|---------|
| DEBUG | dev/troubleshooting only, off in prod | {{...}} |
| INFO | important business events | {{...}} |
| WARN | recoverable / fallback / retry | {{...}} |
| ERROR | needs attention, with error + context | {{...}} |
| {{FATAL}} | unrecoverable startup failure only | {{...}} |

Default prod level: {{INFO}}, set via {{env var}}.

### 4.3 Never log

Secrets, tokens, credentials, full PII (card numbers, passwords, full personal data). Defer the full rule to `standards-security`; this list is the observability-side reminder. Mask/truncate where a value is needed for debugging ({{e.g. last 4 digits}}).

### 4.4 Volume / sampling

- Don't log in hot loops; log a summary after the loop.
- High-volume paths: {{sampling/rate-limit rule}}.

---

## 5. Correlation & Retention

- One id — **{{correlation/trace id}}** — present on every signal; document the navigation it enables (metric exemplar → trace → logs).
- Shared low-cardinality labels across signals: {{service, env, version}}.
- Retention and storage topology are **owned by the `{{infrastructure/deployment doc}}`** — reference it; do not pin retention numbers here.

---

## 6. Where the runnable artifacts live

| Artifact | Owner | Reference |
|----------|-------|-----------|
| Collector / agent config | infrastructure | `{{path/ref}}` |
| Dashboards | infrastructure | `{{path/ref}}` |
| Alert rules | infrastructure | `{{path/ref}}` |
| Instrumentation boilerplate (SDK setup, middleware) | boilerplate | `{{path/in/boilerplate}}` |

This doc states the conventions those artifacts implement.

---

## Checklist

- [ ] Philosophy line + the three signals table, with each backend left as a `{{placeholder}}` (no hard-coded vendor).
- [ ] The joining correlation/trace id is named once and used consistently across metrics, traces, and logs.
- [ ] Metrics: RED named for request paths, USE named for resources; baseline metric set has names + bounded labels.
- [ ] Metric naming + unit convention stated (counters `_total`, base SI units).
- [ ] Cardinality budget: allowed labels listed AND forbidden unbounded labels named (user id, request/trace id, raw path, free text).
- [ ] SLI/SLO linkage present; SLO targets deferred to `standards-performance`, not pinned here.
- [ ] Tracing: span naming (low-cardinality), required attributes, error recording.
- [ ] Context propagation rule names every boundary the service crosses (inbound, outbound, async, jobs).
- [ ] Sampling rule stated; runnable sampler config referenced, not pasted.
- [ ] Logging: structured format + all required fields (timestamp, level, message, correlation id, service identity).
- [ ] Log levels defined with when-each applies.
- [ ] Never-log list present (secrets/PII/tokens) and defers to `standards-security`.
- [ ] Volume/sampling rule for logs (no hot-loop logging).
- [ ] Correlation + retention: retention/topology deferred to the infrastructure/deployment doc, not numbered here.
- [ ] Runnable artifacts (collector/agent config, dashboards, alerts, instrumentation boilerplate) are **referenced**, not pasted.
- [ ] Governing ADR linked for any convention that traces to a decision (id format, sampling rate, label policy).
- [ ] Service/layer names in labels and log fields match the architecture and `standards-coding`.
- [ ] No `{{placeholders}}` left.
