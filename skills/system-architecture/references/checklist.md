# System Architecture Validation Checklist

Validate the system landscape before per-service design or epics. Produce PASS / WARN / FAIL.

## Topology justification
- [ ] The monolith-vs-services choice is recorded in an ADR.
- [ ] Every separate service traces to a real driver: independent scaling, team autonomy, or fault isolation.
- [ ] No service boundary exists "because microservices" — splits with no driver → WARN (paying distribution cost for nothing).
- [ ] A single-service answer was considered and rejected for a stated reason (or chosen).

## Service inventory
- [ ] Each service owns exactly one business capability.
- [ ] No capability is spread across two services (distributed monolith).
- [ ] No service owns two unrelated capabilities (a split waiting to happen).

## Data ownership (hard checks)
- [ ] Exactly one service owns each piece of data.
- [ ] No shared database across services. (Violation = hard FAIL.)
- [ ] Others read data only through the owner's API or events, never its store.

## Inter-service communication
- [ ] Every interaction names sync vs async and its protocol/contract.
- [ ] Async interactions name the event and assume at-least-once + idempotent consumers.
- [ ] Cross-service transactions have a Saga or an explicit consistency story — never a distributed DB transaction.
- [ ] Network-boundary calls that can fail have a resilience pattern (timeout/retry/circuit breaker).

## Dependency graph
- [ ] The service dependency graph is a DAG — no cycles. (Cycle = hard FAIL: distributed deadlock / cannot deploy independently.)

## Cross-cutting & NFRs
- [ ] AuthN/AuthZ across services is defined.
- [ ] Observability (tracing/log correlation across calls) is defined.
- [ ] Each system-level NFR (scaling, availability, fault isolation) maps to a concrete topology decision, not hand-waving.

## Altitude
- [ ] The document stays at landscape level — no per-service internal design leaked in (that belongs in service-architecture).

## Verdict
PASS → proceed to per-service service-architecture.
WARN → minor gaps (e.g. unjustified split); note and proceed with caution.
FAIL → data-ownership violation, shared DB, or a service cycle; fix before any service design.
