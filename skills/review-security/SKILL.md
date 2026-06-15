---
name: review-security
description: Review a code change for security defects only — injection, broken authn/authz, secrets, unsafe input handling, crypto misuse, and vulnerable dependencies. Use when running the security dimension of a code review, when the user says "security review", "check this for vulnerabilities", "is this safe", or when code-review dispatches the security pass. One focused lens — it does not judge performance, style, or correctness; it returns security findings with a dimension verdict.
---

# Review — Security

The security dimension of a code review. One job: find ways this change can be abused. Security findings are never "medium" — a single real one blocks the merge. The cost of being wrong is a breach, irreversible in a way a style issue never is.

## The Iron Law

```
A REAL SECURITY FINDING BLOCKS THE MERGE — NEVER DOWNGRADE IT TO PASS
```

There is no "ship it and fix the auth check next sprint." Every checklist item is actually checked against the diff — "looks secure" is a rubber stamp, not a review — and PASS is earned only when every item was checked and is clean. A finding is downgraded only by being proven not exploitable, never by schedule pressure or because the rest of the change is good.

## Scope
Applies to every change that touches input handling, auth, data access, secrets, crypto, serialization, file/network IO, or dependencies. If none of these are touched, say so explicitly and return PASS — do not invent findings.

## Source of truth: `{DOCS_ROOT}/standards/security.md`
The project's `standards-security` artifact is the checklist's source of truth — surfaces scoped to the project, with the project's libraries and concrete how-to-comply. Load it via `using-standards` before reviewing. The list below is the **baseline** when the project artifact is absent; if `security.md` exists, prefer its specific rules over these defaults. A real finding that the artifact does not cover is also a signal to file an update against `standards-security`.

## Checklist — work each item, do not skim
For each item: state checked → finding, or "checked, clean". A blanket "looks secure" is a rubber stamp, not a review.

- **Secrets:** no hardcoded keys/passwords/tokens; nothing sensitive in logs or error messages.
- **Injection:** DB access parameterized (no string-built SQL/NoSQL); no shell/command interpolation of user input; no template/SSTI or path traversal.
- **AuthN/AuthZ:** protected endpoints require authentication; data access checks authorization *before* returning anything; no IDOR (object ownership verified).
- **Input:** all external input validated/sanitized at the boundary; size/range limits; deserialization is safe.
- **Crypto:** no home-rolled crypto; no weak/`MD5`/`SHA1`-for-passwords; randomness from a CSPRNG; secrets compared in constant time.
- **Leakage:** errors to clients don't leak stack traces, queries, or file paths; PII not logged.
- **Dependencies:** new/updated deps have no known CVEs (`pip-audit`, `npm audit`, `govulncheck`).

## Evidence discipline (anti-slop)
- Every finding cites `path/file:line`, the concrete attack, and a concrete fix.
- "No finding" is valid only after each checklist item was actually checked against the diff — not assumed.
- Never downgrade a security finding to make the change pass.

## Output
```
SECURITY: {PASS | FINDINGS}
- [HIGH] `path/file:line` — {how it is exploited} → {fix}
```
PASS only when every checklist item was checked and clean. Any real finding → the umbrella `code-review` verdict is at least CHANGES_REQUESTED, BLOCKED if exploitable.
