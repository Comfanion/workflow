---
name: security-requirements
description: The requirements-time security skill: define what "secure" means for a feature *before* design begins. Elicit abuse and misuse cases (the malicious mirror of each user story), security non-functional requirements (authn, authz, audit, data protection, retention, rate limiting), compliance obligations for this feature (GDPR/PCI/HIPAA), and testable security acceptance criteria phrased as Given/When/Then. Run during requirements gathering — when the user says "security requirements", "abuse cases", "what are the security NFRs", "compliance needs for this feature", or when a story touches authentication, authorization, PII, financial, health, or external-input data; if none apply, record that and skip. Do NOT run this for: threat modeling, attack-surface, STRIDE, or data-flow threat analysis (use `threat-modeling` at design time); reviewing existing code, SAST, dependency, or secret scanning (use `review-security` at code level); or authoring and maintaining the org security standard / policy / checklist itself (use `standards-security`). This skill *consumes* a standard if one exists; it does not write one. Output: a Security section in requirements.md with testable acceptance criteria that feed `threat-modeling` and `review-security`.
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
