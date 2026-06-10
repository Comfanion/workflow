---
name: security-requirements
description: Elicit the security requirements of a feature at requirements time — abuse and misuse cases, security non-functional requirements (authn, authz, audit, data protection, rate limiting), compliance obligations, and testable security acceptance criteria. Use during requirements gathering when the user says "security requirements", "abuse cases", "what are the security NFRs", "compliance needs", or when a feature touches auth, PII, money, or external input. A requirements-time security lens for the analyst — it defines what secure means for this feature, it does not design or review it.
---

# Security Requirements

The security lens at requirements time. One job: surface what "secure" means for this feature before design starts, so security is a stated requirement rather than an afterthought. Pairs with `threat-modeling` (design) and `review-security` (code).

## When to run
During `requirements`, for any feature touching authentication, authorization, PII/financial/health data, external input, multi-tenancy, or regulated domains. For a feature with none of these, record that explicitly and move on.

## What to elicit
- **Abuse / misuse cases:** for each user story, the malicious mirror — how would an attacker abuse this? (the "evil user story"). Each becomes a requirement to prevent it.
- **AuthN/AuthZ requirements:** who may do what; identity assurance level; tenant/ownership isolation.
- **Data protection:** what data is sensitive; encryption at rest/in transit; retention and deletion; what must never be logged.
- **Audit & non-repudiation:** which actions must be logged for accountability.
- **Availability/abuse limits:** rate limits, quotas, anti-automation where the feature is exposed.
- **Compliance:** GDPR/PCI/HIPAA/etc. obligations that apply, stated as requirements.

## Evidence discipline
- Each security requirement is **testable** — phrased as a Given/When/Then acceptance criterion, not "should be secure".
- Tie each to the asset or threat it protects, so design and review can trace it.

## Output
A **Security** section in `{DOCS_ROOT}/requirements/requirements.md` (or its own file): abuse cases, security NFRs, compliance obligations, each with testable acceptance criteria. Feeds `threat-modeling` (design) and `review-security` (code).
