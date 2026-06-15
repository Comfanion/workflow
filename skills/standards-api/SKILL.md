---
name: standards-api
description: Author and maintain the project's API conventions artifact — URL structure, methods and status codes, request/response envelope, error shape, pagination, versioning, authentication on the wire, and the rate-limit policy. Use this whenever the user wants to "write the API standards", "define the response envelope", "document the error format", "set up versioning", or mentions "REST conventions", "API style guide", "response shape", or "client contract". Authors `{DOCS_ROOT}/standards/api.md`. Distinct from `api-design`, which designs a specific API; this artifact is the **project-wide style** every API in the project must follow.
---

# Standards — API

A single response envelope means every client writes one parser instead of one per endpoint. A single error shape means a frontend reports the error correctly without per-endpoint code. A single versioning policy means clients break in predictable, announceable ways. The artifact pins these decisions once.

This is distinct from `api-design`, which designs the endpoints of one feature. **`standards-api` sets the style; `api-design` applies it.** When a story designs a new endpoint, the question "what does the response look like?" is answered by this artifact, not re-decided.

The artifact lives at `{DOCS_ROOT}/standards/api.md`. `{DOCS_ROOT}` defaults to `docs/`. Target size: **8-15 KB**.

Skip this skill entirely if the project does not expose an API surface clients depend on.

## What this artifact must cover

1. **Protocol(s)** — which the project uses (REST, gRPC, GraphQL) and the rule for choosing between them when more than one is allowed.
2. **URL structure** — `/{prefix}/{version}/{resource}/{id}/{sub-resource}`. Plural nouns. Kebab-case multi-word.
3. **Methods and status codes** — what each verb means; allowed status codes per verb; the rule that 2xx is success, 4xx is client fault, 5xx is server fault. No "200 with error in body".
4. **Request envelope** — required headers, content type, idempotency key for write methods (if applicable), correlation/trace headers.
5. **Response envelope** — the single success shape and the single error shape. Pagination wrapper. Field-naming convention (camelCase vs snake_case — pick one).
6. **Error shape** — error code (machine), message (human), details (per-field). Stable list of codes lives here, not in each handler.
7. **Versioning** — URL versioning (`/v1`) vs header versioning, the deprecation policy, the breaking-change rule.
8. **Authentication on the wire** — bearer token / cookie / mTLS, header name, refresh flow.
9. **Rate limiting** — per-route policy, headers returned (`Retry-After`, `X-RateLimit-*`).
10. **Idempotency** — for POST that creates resources: idempotency key header, replay window.

## How to write it

1. **Read the architecture and PRD NFRs.** If a contract test or a versioning SLA exists in the NFRs, the rule comes from there.
2. **Decide one shape per concept.** One success envelope. One error shape. One pagination shape. Two of any of these is the bug this artifact prevents.
3. **Anchor to a spec.** OpenAPI / Protobuf / GraphQL SDL — name the source of truth and the path where it lives (`docs/api/openapi.yaml`, `proto/`, `schema.graphql`). The artifact does not duplicate the spec; it sets the rules the spec must follow.
4. **Draft from `references/template.md`.**
5. **Validate against `references/checklist.md`.**

## Response envelope — pick one and stick to it

Two reasonable shapes; the artifact picks one:

```json
// Shape A — data/meta/error siblings
{ "data": { ... }, "meta": { "page": 1, "total": 100 } }
{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [...] } }

// Shape B — flat success, top-level error
{ "id": "...", "name": "..." }
{ "error": { "code": "...", "message": "..." } }
```

Shape A is friendlier to pagination and metadata; shape B is more REST-purist. The artifact names which and gives one example per resource type.

## Status codes — the short list

| Code | Use |
|------|-----|
| 200 | Success (GET, PUT) |
| 201 | Created (POST) with `Location` header |
| 204 | No Content (DELETE) |
| 400 | Bad Request (validation failure) |
| 401 | Unauthorized (no/invalid auth) |
| 403 | Forbidden (auth ok, not allowed) |
| 404 | Not Found |
| 409 | Conflict (concurrent edit, unique constraint) |
| 422 | Unprocessable (semantic validation; if 400 is reserved for syntax) |
| 429 | Too Many Requests |
| 500 | Internal Error |
| 503 | Service Unavailable |

Decide whether 400 or 422 is "validation"; do not use both for the same thing.

## Versioning — the breaking-change rule

The artifact states explicitly:

- A breaking change requires a new major version (`/v2`) and a deprecation notice on `/v1` with a removal date.
- Additive changes (new optional field, new endpoint) are not breaking and ship on the current version.
- A field rename is breaking; ship the new name alongside, deprecate the old, remove on next major.

## Update protocol

- A new HTTP code appears in the wild → add it to the table or rule it out.
- A frontend re-implements an envelope parser per endpoint → the artifact is failing; tighten the rule.
- A client breaks on a non-breaking change → either re-classify the change as breaking, or document the field-stability rule that prevents it next time.
- A new protocol joins (e.g. gRPC alongside REST) → add the protocol-specific section.

## Templates and references

- `references/template.md` — full `api.md` template.
- `references/checklist.md` — validation checklist for the artifact.

## Who reads this artifact

- `api-design` — every new endpoint design.
- `dev` — when implementing a handler.
- `review-correctness` — to judge whether the response conforms.
- `code-review` — to flag a non-conformant error shape.

## Roles

Authored by the API owner (tech lead, architect, or solo developer). Reviewed by the project owner.

## Related

- `standards` — umbrella router.
- `using-standards` — consumer protocol.
- `api-design` — applies these standards to a specific feature's endpoints.
- `standards-coding` — production-code conventions sibling.
