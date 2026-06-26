---
type: standard                                # controlled vocab — primary filter for agents
title: Eventing Standard
description: Event transport, schema, and delivery rules.
domain: events                                # dedup axis: one standard per subject
status: draft                                 # draft | approved | deprecated | superseded
tags: [events, messaging, conventions]        # free-form filter labels
version: {{version}}
updated: {{YYYY-MM-DDThh:mmZ}}                 # OKF timestamp — last meaningful change
related: [{{architecture / spec / ticket / related-doc links}}]   # cross-links
---

# Eventing Standard

**Governing ADR(s):** {{ADR-NNN link, or "—"}}

> This standard states the rules; the decisions and rationale live in the ADR(s).
> Where this standard and an ADR disagree, the **ADR wins** — fix the standard.

**Transport:** {{transport — e.g. Kafka / NATS / Pulsar / RabbitMQ / SQS+SNS / Kinesis / Redis Streams}}
**Schema format:** {{schema format — e.g. Avro / Protobuf / JSON-Schema}}

---

## Reading guide

Section-addressable — read only the sections your task needs; the whole doc is the source of truth when in doubt.

| If you are… | Read |
|-------------|------|
| **Designing** (architect / planner) | §1 Topic naming · §2 Envelope · §4 Schema & evolution · §5 Delivery semantics · §10 Shared schema package |
| **Implementing** (dev) | §3 Required headers · §6 Ordering & partition key · §7 Retries & DLQ · §8 Producer rules · §9 Consumer rules |
| **Reviewing** (reviewer) | §5 Delivery + idempotency · §8 Producer rules · §9 Consumer rules · §4 Schema evolution |

## 1. Stream / Topic Naming

Convention: {{e.g. `sys.domain.entity`}} — {{casing rule}}.

- Grouping: {{group related events for one entity into one stream (preserves per-entity order, simpler topology, easy replay) by default}}.
- Dedicated streams: {{when — e.g. request-reply, per-event-type security/scaling needs}}.

---

## 2. Message Envelope

One shape: **metadata + payload**. This project uses {{Shape A (in-message) | Shape B (transport headers + payload body)}}.

```
{{one concrete example — metadata fields + payload, in this project's format}}
```

- Required: {{e.g. event_type, occurred_at/timestamp, data}}.
- DLQ-only: {{e.g. error_type, error_msg}}.
- Optional: {{e.g. pii_fields, security, signature/checksum when crossing a trust boundary}}.

---

## 3. Required Headers / Metadata

On every message:

| Field | Example | Purpose |
|-------|---------|---------|
| `event-type` | {{domain.entity.action}} | route without deserializing the payload |
| `content-type` | {{e.g. application/avro}} | serialization format |
| `producer-id` | {{service name}} | producing service |
| `producer-v` | {{1.0}} | producer version |
| `schema-id` | {{canonical schema name/id}} | schema of the payload |
| `idempotency-key` | {{unique per event}} | consumer-side dedup |
| `correlation-id` | {{—}} | correlation across async hops |
| `trace-id` | {{—}} | distributed tracing |

Conditional: {{causation-id, message-id}}. DLQ-only: {{original-stream, original-partition, original-offset, last-attempt}}.

---

## 4. Schema & Evolution

Format: {{schema format}}. Schemas evolve **backward-compatible**:

- Add fields {{optional / with defaults}}.
- Never remove or repurpose a {{required}} field.
- A breaking change is announced ahead and coordinated with consumers; {{version/new-schema rule}}.

---

## 5. Delivery Semantics

This project guarantees: {{at-least-once | exactly-once}}.

Therefore the consumer MUST: {{dedup on idempotency-key; idempotent handlers; expect redelivery}}.

---

## 6. Ordering & Partition / Routing Key

- Order key: {{e.g. entity id}} — guarantees order **per key**, only within a partition/key.
- Routing/partition rule: {{how the key maps to partition/subject/shard}}.
- No cross-key ordering is promised.

---

## 7. Retries & Dead-Letter Policy

| Aspect | Rule |
|--------|------|
| Retry budget | {{N attempts}} |
| Backoff | {{strategy}} |
| Goes to DLQ when | {{condition — e.g. retries exhausted, non-retryable error}} |
| DLQ stream | {{name/pattern}} |
| DLQ metadata | {{original-stream, partition, offset, error, last-attempt}} |

A message that fails repeatedly goes to the DLQ — it is never dropped silently.

---

## 8. Producer Rules

- Durability/ack: {{e.g. wait for full acknowledgement; idempotent producer where supported}}.
- Set all required metadata (§3) before publish.
- Publish **after** the originating state change commits ({{outbox / transactional rule}}).

---

## 9. Consumer Rules

- Dedup on `idempotency-key`; handlers idempotent (§5).
- Handle out-of-order delivery within tolerance.
- Commit/ack **only after** successful processing.
- On unrecoverable failure, route to the DLQ (§7) — never swallow.

---

## 10. Shared Schema Package (define once, never redeclare)

Event schemas live **once** in {{path/name of the shared schemas package or repo}} and are consumed by **canonical name/id**.

- Services {{import / reference}} the shared definitions — **never copy or redeclare** a schema.
- Generation/runtime: {{codegen tool}} / {{runtime lib}}; {{regeneration command + when}}.
- A service catalog or contract index references an event by canonical name instead of embedding it.

---

## Checklist

- [ ] Transport and schema format are named (placeholders filled with the project's actual stack), not assumed.
- [ ] Stream/topic naming convention stated, with the group-vs-dedicated rule.
- [ ] Exactly **one** envelope shape chosen, with one concrete example; metadata + payload separation clear.
- [ ] Required metadata lists all of: event-type, producer id + version, schema id, idempotency key, correlation/trace id; conditional and DLQ-only fields named separately.
- [ ] Schema evolution rule is backward-compatible and stated format-neutrally (add optional/defaulted; never remove/repurpose required).
- [ ] Delivery semantics named (at-least-once / exactly-once) AND the consumer consequence (idempotent handling / dedup) stated as its direct result.
- [ ] Ordering key named; the "order only within a partition/key" limit stated explicitly.
- [ ] Retry budget + backoff + DLQ trigger + DLQ metadata defined; nothing dropped silently.
- [ ] Producer rules cover durability/ack, metadata-before-publish, publish-after-commit.
- [ ] Consumer rules cover dedup, out-of-order, commit-after-success, fail-to-DLQ.
- [ ] Shared-schema-package rule present: schemas defined once, referenced by canonical name, never redeclared per service.
- [ ] Runnable artifacts (broker/schema-registry config, the shared schema package, consumer/producer scaffolding) are **referenced**, not pasted here.
- [ ] Governing ADR linked for any rule that traces to a decision.
- [ ] No `{{placeholders}}` left.
