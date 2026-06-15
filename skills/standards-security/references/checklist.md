# Security Standards — Validation Checklist

- [ ] Scope section lists every surface the project actually exposes; absent surfaces are explicitly marked "N/A".
- [ ] Authentication: mechanism, token shape, expiry, refresh flow, storage — all concrete (not "industry standard").
- [ ] Authorization: coarse + fine-grained rules; the "verify ownership before returning resource-scoped data" rule is present.
- [ ] Input validation: boundary, library, failure-response shape; example included.
- [ ] Secrets: source (env / vault), forbidden practices, `.env.example` rule.
- [ ] Crypto: allowed algorithms, CSPRNG, constant-time compare, password hashing function.
- [ ] Data exposure: what must not be logged; HTTPS-only rule.
- [ ] Dependencies: scanner in CI, CVE severity that blocks merge.
- [ ] Every rule has at least one short code example.
- [ ] No rule borrowed from OWASP without translating to the project's library and stack.
- [ ] File size 8-15 KB.
