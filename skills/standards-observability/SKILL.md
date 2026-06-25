---
name: standards-observability
description: Author or update the project's observability standard — the three signals (metrics, tracing, structured logging), what to instrument (RED/USE), naming and label conventions, cardinality rules, span and context-propagation conventions, the correlation id that ties signals together, and the rules for what must never reach a log. Use whenever the user wants to write/define observability standards, set metric naming or label rules, define tracing/span conventions, write logging rules, or mentions "observability standards", "metrics conventions", "logging standards", or "tracing rules". Writes one topic doc into the project's standards source. Rules only — the runnable collector/agent config, dashboards, and alert rules live in the project's infrastructure/deployment docs and the boilerplate; this doc states the convention and cites its governing ADR. Tool-neutral: the metrics/tracing/logging vendor is a placeholder. The source of truth `dev` and code-review use to judge instrumentation.
---

# Standards — Observability

The observability standard answers the questions a developer needs before instrumenting a service: **what to measure, how to name it, what to span, what to log, and how the three signals join up.** Without a written answer every service invents its own metric names and label sets, cardinality explodes, logs leak secrets, and an incident becomes archaeology. Pin the answers once.

This doc is one topic in the project's standards source (the `standards` umbrella decides where that source lives and which topics a project needs). Read `authoring-standards` for the cross-cutting rules every standard obeys. This skill covers only what's specific to *observability*: metrics, tracing, and structured logging (logging is a subsection here, not a separate doc). Template (its final section is the validation checklist): `references/template.md`.

## What this standard must cover

1. **Philosophy + the three signals** — one line on what the project optimizes for, then the role of each signal (metrics = aggregate health, traces = request lifecycle, logs = discrete events) and the **correlation id** that joins them.
2. **Metrics** — what to instrument (RED for request-driven, USE for resources), metric naming + unit convention, label/tag conventions, the cardinality budget, and SLI/SLO linkage.
3. **Tracing** — span naming + attributes, context/correlation-id propagation across boundaries, what earns a span, and the sampling rule.
4. **Logging** (folded subsection) — structured format, log levels and when each applies, the required fields, what must NEVER be logged (secrets/PII/tokens — cross-ref `standards-security`), and the volume/sampling rule.
5. **Correlation + retention** — the one id that stitches logs+traces+metrics, and a pointer to where retention/topology is owned (the system-level infrastructure docs), not the numbers themselves.

## How to write it

1. **Read the architecture and `standards-coding`** — service/layer names used in metric labels and log fields must match the architecture, or queries written against one service don't transfer.
2. **Keep the vendor a placeholder** — the template is tool-neutral on purpose. Fill `{{metrics backend}}` / `{{tracing backend}}` / `{{log store}}` with whatever the project actually runs (e.g. Prometheus/OpenTelemetry/Grafana/Loki/Tempo/Datadog/ELK). Don't bake a stack this project doesn't use.
3. **Anchor metrics to SLOs, not to whatever is easy to emit** — every RED/USE metric should map to a question someone asks during an incident or a target in `standards-performance`. Drop metrics that answer nothing.
4. **Set a real cardinality budget** — name the labels that are allowed and forbid unbounded ones (user id, request id, full URL path). High cardinality is the most common way a metrics bill and a query both blow up.
5. **Cite the governing ADR** — if a convention traces to a decision (e.g. "one correlation id format across all services", "sampling at N%"), link the ADR via `{{ADR-NNN link}}`; the ADR holds the *why*.
6. **The runnable config lives elsewhere** — the collector/agent config, dashboards, alert rules, and retention topology are owned by `platform-infrastructure` (the shared observability substrate) and the boilerplate. State the convention here and **reference** those artifacts; don't paste a copy that will drift.
7. **Draft from `references/template.md`; validate against the Checklist section of that template.**

## Metrics — sensible conventions

Adjust to the project; record the reason for any deviation in the doc.

| Concern | Convention | Why |
|---------|-----------|-----|
| Request-driven services | RED: Rate, Errors, Duration | The three numbers an incident starts from |
| Resources (pools, queues, CPU) | USE: Utilization, Saturation, Errors | Where capacity problems show first |
| Naming | `unit`-suffixed, `_total` for counters, base SI units (seconds, bytes) | Queries and dashboards stay portable |
| Labels | bounded set only; service, env, version, endpoint, status | Cardinality stays finite |
| Forbidden labels | user id, request/trace id, raw path, free text | Each is an unbounded dimension |

## Logging — required fields (the part that makes correlation real)

Every log line must carry: timestamp, level, message, the **correlation/trace id**, and the service identity (service, env, version). Without the correlation id a log cannot be joined to its trace, and the three signals stop being one story. The runnable shipping config lives in the boilerplate; this doc states which fields are mandatory and what must never appear (secrets, tokens, full PII — cross-ref `standards-security`).

## Update signals — when this standard is failing

- Cardinality blows up (slow queries, surprise bill) → tighten the label budget; name the offending label as forbidden.
- An incident can't be traced end to end → the correlation id isn't propagated somewhere; add the boundary to the propagation rule.
- A secret or PII field shows up in logs → add it to the never-log list and cross-ref the security standard.
- A new signal type appears (profiling, events) → add a subsection with its naming + correlation rule.
- A metric nobody queries lingers → drop it; every metric should map to an SLO or an incident question.

File the update through `authoring-standards` (review before it propagates); don't fix it in a reviewer's head.

## Related

`standards` (umbrella — which topics, where the source lives) · `authoring-standards` (cross-cutting authoring rules + ADR/boilerplate discipline) · `using-standards` (how `dev`/review load and apply this) · `standards-coding` (production-code sibling; service/layer names must agree) · `standards-performance` (the latency/throughput budgets this standard measures) · `standards-security` (no secrets/PII/tokens in logs — the never-log list defers there). `platform-infrastructure` owns the runnable observability topology — collector/agent config, dashboards, alert rules, and retention; this standard states the conventions those artifacts implement and references them, never duplicates them.
