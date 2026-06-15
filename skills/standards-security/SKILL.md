---
name: standards-security
description: Author and maintain the project's security standards artifact — what surfaces must be secured and exactly how, scoped to the project's actual attack surface. Replaces "the reviewer makes up a checklist every time" with a written, project-specific checklist that `review-security`, `threat-modeling`, and `dev` read directly. Use this whenever the user wants to "write the security standards", "set the security checklist", "document auth/authz rules", "lock down input validation", or mentions "security policy", "OWASP coverage", "what must be secure", or "review-security checklist". Authors `{DOCS_ROOT}/standards/security.md`. Keep this artifact about preventive rules in code; runtime detection / incident response belong elsewhere.
---

# Standards — Security

Without a written security standard, every code review has to re-invent the checklist from scratch. That is how the same vulnerability class slips past three reviewers — each one remembered a different subset of OWASP. This artifact closes that gap: **the project's checklist, scoped to the project's surface, with the concrete how-to-comply for each item.**

The artifact lives at `{DOCS_ROOT}/standards/security.md`. `{DOCS_ROOT}` defaults to `docs/`. Target size: **8-15 KB**.

`review-security` reads this file directly. A "checklist drift" between this artifact and the review skill is a defect — fix the artifact, not the reviewer's memory.

## What this artifact must cover

Eight sections. Skip a section only if the project genuinely has no surface for it; record the skip in the artifact so the next reviewer does not silently re-add the gap.

1. **Scope** — which surfaces this project has: HTTP/RPC API, message queue, database, file uploads, external auth, browser frontend, native client. The checklist below is then filtered to apply.
2. **Authentication** — mechanism (OAuth2/JWT/session/SAML), token shape, expiry, refresh flow, session storage. Concrete: the algorithm, the lifetime, the storage.
3. **Authorization** — coarse-grained (role) and fine-grained (resource ownership) rules. The rule that every protected endpoint must verify ownership before returning data is the most-commonly-missed; state it explicitly.
4. **Input validation** — the boundary (every entry point), the validator library, the failure response. Validation everywhere else is defense in depth; missing it at the boundary is the bug.
5. **Secrets** — where they come from (env / vault), what is forbidden (no hardcoded keys, no secrets in logs or errors), the `.env.example` rule.
6. **Crypto** — only standard libraries (no homerolled), allowed algorithms, randomness source (CSPRNG), constant-time comparison for secrets. A line forbidding MD5/SHA1 for passwords.
7. **Data exposure** — what may and may not be logged (no PII, no tokens, no full request bodies), error messages that do not leak internals, HTTPS-only.
8. **Dependencies** — vulnerability scanner that runs in CI (`pip-audit` / `npm audit` / `govulncheck` / `cargo audit`), update cadence, the rule that a HIGH CVE in a runtime dep blocks merge.

For each section: the rule **and** the concrete how-to-comply, with a short example. A rule without a code example gets interpreted differently by every reader.

## How to write it

1. **Read the architecture and the threat model (if it exists).** The scope section must match the surfaces the architecture actually exposes. A microservices system needs an inter-service auth section; a single-binary CLI does not.
2. **Walk OWASP Top 10 once and translate, do not paste.** The artifact is the project's checklist, not the OWASP page. Translate each relevant item into a rule scoped to the stack, with the project's library and the project's example.
3. **Draft from `references/template.md`.**
4. **Validate against `references/checklist.md`.**

## OWASP Top 10 — mapping cheatsheet

Use this only to make sure no class is dropped silently; the artifact itself names the project's rule, not the OWASP label.

| OWASP class | Project rule it produces |
|-------------|--------------------------|
| Injection | Parameterized queries; no shell interpolation; no template injection |
| Broken authn | Standard auth; rate limit auth endpoints; constant-time compare |
| Sensitive data exposure | No PII in logs; mask in errors; HTTPS only |
| XXE | Disable external entities in XML parsers |
| Broken access control | Resource ownership verified before return; deny by default |
| Misconfiguration | Security headers, debug off in prod, default creds removed |
| XSS | Escape output; CSP; sanitize HTML input |
| Insecure deserialization | Validated deserialization, safe parsers |
| Vulnerable components | Scanner in CI, update cadence, CVE blocks merge |
| Insufficient logging | Auth events logged; suspicious patterns alerted; no sensitive data |

## The line that catches the most bugs

> **A user can only reach their own data. Every endpoint that returns resource-scoped data verifies ownership before returning it.**

Put this rule in the artifact, in a callout, near the top of the authorization section. It is the single most-commonly-missed check and the one that produces the worst headlines.

## Update protocol

- A security review finding is real and repeatable → add the rule that would have prevented it.
- A new surface appears (a new endpoint family, a queue, a file upload) → extend the scope and the matching section.
- A dependency CVE forces a library swap → record the forbidden version and the replacement.
- A penetration test or audit lands → fold every finding into the artifact, not into individual stories.

## Templates and references

- `references/template.md` — full `security.md` template.
- `references/checklist.md` — validation checklist for the artifact.

## Who reads this artifact

- `review-security` — drives the dimension's checklist (no more "from memory").
- `dev` — every story that touches input, auth, data, secrets, crypto, or deserialization.
- `threat-modeling` — to enumerate the surfaces the threat model must cover.
- `security-requirements` — back-reference when requirements ask for a stronger rule.

## Roles

Authored by whoever owns security on the project (security lead, tech lead, or solo developer). Reviewed by the project owner before binding.

## Related

- `standards` — umbrella router.
- `using-standards` — consumer protocol.
- `review-security`, `threat-modeling`, `security-requirements` — downstream consumers.
