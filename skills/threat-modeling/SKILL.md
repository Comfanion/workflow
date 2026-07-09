---
name: threat-modeling
description: Use when modeling security threats against a system or feature **design before code is written** — enumerating assets, trust boundaries, and attack surface, walking STRIDE (spoofing, tampering, repudiation, info disclosure, denial of service, elevation of privilege) per element, and proposing mitigations tied to the architecture. Fire on "threat model", "threat assessment", "attack surface", "walk STRIDE", "security architecture review", "is this design secure", "what could attack this design", or when committing to a design that handles auth, PII, money, multi-tenant data, external input, or a new trust boundary. This is a **design-time, architecture-level** lens for the architect: it analyzes how the *design* can be attacked and rates each credible threat with a named mitigation or an owner-tagged accepted risk. Output feeds forward — mitigations become security requirements for `security-requirements` and acceptance criteria for `review-security`. Do **not** use this when the user wants the security *requirements*/NFRs/abuse cases/compliance obligations of a feature (that is `security-requirements`, requirements-time), or a *code-level* security review of an existing change (that is `review-security`), or to author the project's security standards/checklist artifact (that is `standards-security`). Skip for internal/toy systems with no sensitive data and say so.
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
4. **Feed forward:** mitigations become architecture decisions (ADRs), security requirements every affected component must inherit (`security-requirements`), and security acceptance criteria for `review-security` to verify in code.

## Evidence discipline
- Every threat names the element, the STRIDE category, and a concrete attack scenario — not "could be insecure".
- Every credible threat has a named mitigation, or an explicit accepted-risk decision with a **named owner** — an unowned accepted risk is an unmanaged one.

## Output
`{DOCS_ROOT}/architecture/threat-model.md` — assets, trust boundaries, per-element STRIDE table, and mitigations. Mitigations cross-referenced from the relevant ADRs.
