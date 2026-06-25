---
name: standards-events
description: Author or update the project's eventing standard — transport-neutral, for ANY event-streaming system (Kafka / NATS / Pulsar / RabbitMQ / SQS+SNS / Kinesis / Redis Streams). Covers stream/topic naming, the message envelope, required metadata headers, schema + backward-compatible evolution, delivery semantics and the idempotent consumer rule, ordering and partition keys, retries + dead-letter policy, producer and consumer rules, and the shared-schema-package reference rule (schemas defined once, never redeclared). Use whenever the user wants to write/define eventing standards, pick the event envelope, set topic naming, document schema evolution, or define delivery/ordering/DLQ rules, or mentions "event standards", "messaging standards", "topic naming", or "schema evolution". Writes one topic doc into the project's standards source. Rules only — the broker/schema-registry config and the shared schema package live in the boilerplate; this doc states the rule and cites its governing ADR. The source of truth `system-architecture`, `dev`, and code-review use to judge an event.
---

# Standards — Events

The eventing standard answers the questions every producer and consumer re-answer if you let them: **what does a message look like, how do I know what it is without parsing it, what happens when it's delivered twice, and how does the schema change without breaking everyone downstream.** One envelope means one parser per consumer instead of one per event. One delivery-semantics rule means every consumer is idempotent by default instead of by accident. One schema package means a contract is defined once and referenced by name, not copy-pasted into five services that then drift. Pin the answers once.

This doc is one topic in the project's standards source (the `standards` umbrella decides where that source lives and which topics a project needs). Read `authoring-standards` for the cross-cutting rules every standard obeys. This skill covers only what's specific to *event streaming*, and it is **transport-neutral**: the broker and the schema format are `{{placeholders}}` you fill from the real project, never hardcoded. Template (its final section is the validation checklist): `references/template.md`.

Skip this skill entirely if the project produces and consumes no events.

## What this standard must cover

1. **Stream/topic naming** — one convention (e.g. `{{sys.domain.entity}}`), casing, and the rule for grouping related events into one stream vs splitting into dedicated streams.
2. **Message envelope** — *one* shape: metadata + payload. Pick one; two shapes is the bug this doc prevents.
3. **Required headers/metadata** — on every message: `event-type`, producer id + version, schema id, idempotency key, correlation/trace id. Conditional and DLQ-only fields named separately.
4. **Schema + evolution** — the schema format ({{Avro / Protobuf / JSON-Schema}}) and the backward-compatible evolution rule (add optional/defaulted fields; never remove or repurpose a required field) — stated format-neutrally.
5. **Delivery semantics** — at-least-once vs exactly-once, and the consequence: what the consumer must therefore do (idempotent handling / dedup on the idempotency key).
6. **Ordering + partition/routing key** — what key guarantees per-entity order, and the explicit statement that order holds only within a partition/key.
7. **Retries + dead-letter policy** — retry budget/backoff, when a message goes to the DLQ, and what metadata the DLQ message carries.
8. **Producer rules** — durability/ack settings, set metadata before publish, publish only after the state change commits.
9. **Consumer rules** — dedup, handle out-of-order, commit/ack only after successful processing, fail to DLQ not silently.
10. **Shared-schema-package reference** — event schemas live **once** in a shared schema package and are referenced by canonical name; never redeclared per service.

## How to write it

1. **Read the architecture and `standards-api`** — the async contracts here and the sync contracts there must agree on the same domain ids, envelope conventions, and stable-code style, or the two get read inconsistently.
2. **Name the transport and the schema format once.** Fill the `{{transport}}` and `{{schema-format}}` placeholders from the real project. The template names example values (Kafka, NATS, Avro, Protobuf, …) only as placeholders — pick the project's actual stack; don't bake one it doesn't use.
3. **Decide one envelope.** Metadata + payload, one shape, one example. Two envelopes is the failure this doc exists to prevent.
4. **Make the idempotency rule a consequence of delivery semantics.** State the chosen semantics, then state what the consumer must do because of it — don't leave "be idempotent" as folklore.
5. **Cite the governing ADR** — when the naming scheme, the envelope, the delivery semantics, or the schema-package model traces to a decision, link it via `{{ADR-NNN link}}`; the ADR holds the *why*. Where the standard and the ADR disagree, the ADR wins — fix the standard.
6. **The runnable artifacts live elsewhere.** Broker/topic config, schema-registry config, the shared schema package itself, and consumer/producer scaffolding are maintained in the boilerplate or the shared schemas repo. Name those source-of-truth paths here and **reference** them; this doc sets the rules they follow, it never pastes a copy that will drift.
7. **Draft from `references/template.md`; validate against the Checklist section of that template.**

## Envelope — pick one and stick to it

Two reasonable shapes; the standard names which. Whatever you pick, metadata is carried the same way everywhere and the payload is the schema's concern:

```
// Shape A — flat metadata + nested payload
{ "event_type": "...", "occurred_at": "...", "data": { ... } }

// Shape B — transport headers carry metadata, body is payload only
headers: { event-type, producer-id, schema-id, idempotency-key, trace-id }
body:    { ... }   // the schema-governed payload, nothing else
```

Shape A travels through transports without a rich header model; shape B keeps routing cheap (read `event-type` without deserializing). Pick based on the transport's header support; carry the same metadata either way.

## Delivery semantics — the consumer consequence

| Project guarantees | The consumer MUST |
|--------------------|-------------------|
| At-least-once (the common default) | dedup on the idempotency key; make handlers idempotent; expect redelivery |
| Exactly-once (transport+config dependent) | still verify the constraints hold end-to-end; don't assume it across service boundaries |

State the chosen semantics explicitly. "At-least-once" with no idempotency rule is a duplicate-processing incident waiting to happen.

## Shared-schema-package rule — the part that stops drift

The standard states it plainly: event schemas are defined **once** in a shared schema package ({{path/name of the shared schemas repo or package}}) and consumed by **canonical name/id** — services import or reference, **never copy or redeclare** a schema. A service catalog or contract index can then point at an event contract by its canonical name rather than embedding it.

## Update signals — when this standard is failing

- The same schema is found redeclared in two services → tighten the shared-package rule; it isn't being followed.
- A consumer double-processes on redelivery → the idempotency consequence wasn't stated or wasn't enforced; make it explicit.
- A "backward-compatible" change breaks a consumer → re-classify it as breaking and write the field-stability rule that prevents it.
- A second transport joins (e.g. a queue alongside the stream) → add its envelope/header mapping and the choose-between rule.

File the update through `authoring-standards` (review before it propagates); don't fix it in a reviewer's head.

## Related

`standards` (umbrella — which topics, where the source lives) · `authoring-standards` (cross-cutting authoring rules + ADR/boilerplate discipline) · `using-standards` (how `system-architecture`/`dev`/review load and apply this) · `standards-api` (the sync-contract sibling; async contracts here must agree with sync there).
