---
name: threat-modeling
description: Model the security threats of a system or feature design before it is built — enumerate assets, trust boundaries, and attack surface, walk STRIDE per element, and propose mitigations tied to the architecture. Use during architecture/design when the user says "threat model", "what could go wrong security-wise", "attack surface", "STRIDE", or before committing a design that handles sensitive data, auth, money, or external input. A design-time security lens for the architect — it models the design, it does not review finished code (that is review-security).
---

# Threat Modeling

A design-time security analysis. One job: before code is written, find how the *design* can be attacked, so mitigations are built in rather than bolted on. Operates on the architecture, not the implementation.

## When to run
At the `architecture` phase, especially for systems handling auth, PII/money, external input, multi-tenant data, or new trust boundaries. Skip for a TOY/internal tool with no sensitive data — say so.

## Method
1. **Decompose:** list assets (what an attacker wants), entry points, and data flows. Draw the trust boundaries (where data crosses from less- to more-trusted).
2. **STRIDE per element** — for each component/flow crossing a boundary, ask:
   - **S**poofing — can identity be faked? (auth gaps)
   - **T**ampering — can data/requests be modified in transit or at rest?
   - **R**epudiation — can an actor deny an action? (audit gaps)
   - **I**nformation disclosure — can data leak? (authz, encryption, error leakage)
   - **D**enial of service — can it be exhausted? (rate limits, unbounded work)
   - **E**levation of privilege — can a user gain rights they shouldn't?
3. **Rate & mitigate:** for each credible threat, note likelihood/impact and a concrete mitigation tied to the design (authn mechanism, authz check, encryption, validation, rate limit, audit log).
4. **Feed forward:** mitigations become architecture decisions (ADRs) and security acceptance criteria for `review-security` to verify in code.

## Evidence discipline
- Every threat names the element, the STRIDE category, and a concrete attack scenario — not "could be insecure".
- Every credible threat has a named mitigation or an explicit accepted-risk decision.

## Output
`{DOCS_ROOT}/architecture/threat-model.md` — assets, trust boundaries, per-element STRIDE table, and mitigations. Mitigations cross-referenced from the relevant ADRs.
