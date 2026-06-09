---
name: api-design
description: Design and document API contracts — REST, GraphQL, or gRPC — including endpoints, request/response shapes, status codes, error formats, versioning, auth, and rate limiting. Use this whenever the user wants to design the API, write API contracts, define endpoints, plan a versioning strategy, choose between REST/GraphQL/gRPC, or produce an OpenAPI/proto/schema spec. API design is the contract layer of the architecture — keep business logic, data-model internals, and infrastructure decisions in their own documents.
---

# API Design

An API contract is the promise between a service and everyone who calls it. Once clients depend on it, every shape, name, and status code becomes expensive to change — so the goal here is to get the contract right before code exists, and to keep it consistent enough that callers can predict behavior they haven't seen yet.

The most common failure is inconsistency: one endpoint returns `userId`, another `user_id`; one error is a bare string, the next a structured object; pagination works three different ways across four endpoints. Consistency is the single most valuable thing this skill enforces, because it is what lets a client learn the API once instead of per-endpoint.

## Pick the protocol first

The protocol decision shapes everything downstream, and reversing it later is a rewrite. Choose deliberately:

| Type | Use when | Avoid when |
|------|----------|------------|
| **REST** | CRUD operations, public APIs, HTTP caching matters | Deeply nested queries, real-time push |
| **GraphQL** | Flexible client-driven queries, mobile clients, nested data | Simple CRUD, when HTTP caching is critical |
| **gRPC** | Service-to-service, high throughput, streaming | Browser clients, public-facing APIs |
| **WebSocket** | Real-time, bidirectional, live updates | Plain request/response |

If two fit, pick the one with the cheaper client story — a public API almost always wants REST because every HTTP client already speaks it and caches it for free.

## Per-protocol design guides

Each protocol has its own full design guide with the conventions, templates, and worked examples. Load the one for the protocol you picked — the cross-cutting discipline below applies to all of them regardless.

- **REST** — URL structure, naming, query params, status-code table, response envelope, error codes, rate limiting. Load `references/rest.md` when designing a REST API. For the machine-readable contract, load the OpenAPI skeleton `references/openapi-template.yaml` (it generates clients, mocks, and docs from one file; define every schema once under `components` and `$ref` it everywhere).
- **GraphQL** — schema as contract, nullability discipline, input/payload types, connection pattern. Load `references/graphql.md` when designing a GraphQL API.
- **gRPC** — proto definition, permanent field numbers and enum zero-values, package versioning. Load `references/grpc.md` when designing a gRPC service.

## Cross-cutting discipline — do not lose these

Whatever the protocol, the contract is only as good as its consistency. These rules hold across REST, GraphQL, and gRPC:

- **Status / result codes match a fixed table.** Clients branch on the code before they read the body. In REST, follow the method/status table in `references/rest.md` so a `201` always means the same thing; keep the HTTP status and the machine-readable error `code` in lockstep — a `403` never carries a `NOT_FOUND` code.
- **Every error is structured, never a bare string,** and every failure mode is enumerated. The full error-code table is mandatory output: each error carries a machine-readable `code` so clients branch on the failure without parsing English. A response that can fail in a way not listed in the table is an incomplete contract. The canonical set, kept in lockstep with the HTTP status:

| HTTP | Code | When |
|------|------|------|
| 400 | `BAD_REQUEST` | Malformed JSON, missing required params |
| 401 | `UNAUTHORIZED` | Missing or invalid auth token |
| 403 | `FORBIDDEN` | Valid auth but no permission |
| 404 | `NOT_FOUND` | Resource doesn't exist |
| 409 | `CONFLICT` | Duplicate, version conflict |
| 422 | `VALIDATION_ERROR` | Business-rule violation |
| 429 | `RATE_LIMITED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Server error — log it, never leak internals to the client |
- **Field names use one casing across the whole API,** and they match the domain model. If the domain calls it a `merchant`, the field is `merchantId` / `merchant_id`, not `vendorId` or `sellerId`. A mismatch between a field name and the domain term it represents is a defect — the next person reads the field name and trusts it. Pick one casing (`userId` *or* `user_id`) and hold it everywhere; never both.

## Authentication and authorization

Document how callers prove who they are and what that identity is allowed to do — leaving this implicit is how endpoints ship unprotected.

| Method | Use for | Header |
|--------|---------|--------|
| Bearer token (JWT) | User sessions, mobile | `Authorization: Bearer <token>` |
| API key | Service-to-service, public APIs | `X-API-Key: <key>` |
| OAuth 2.0 | Third-party integrations | OAuth flow |
| mTLS | High-security service mesh | Client certificate |

State the authorization model alongside it — resource-based (can this user read this task), scope-based (the token carries `tasks:read`, `tasks:write`), or role-based (admin / user / viewer). Pick one model and apply it uniformly; mixing them per endpoint is where access-control bugs hide.

## Versioning

Version from day one, even if there's only `v1` — retrofitting a version scheme onto an unversioned API is a breaking change in itself.

URL versioning is the default: it's explicit, cacheable, and trivial to route.

```
/api/v1/tasks
/api/v2/tasks
```

Header versioning (`Accept: application/vnd.api+json; version=2`) keeps URLs clean but is harder to test and cache — use it only when clean URLs are a hard requirement.

A version moves through a lifecycle, and clients need to know where it sits:

| Status | Meaning | Support |
|--------|---------|---------|
| `current` | Latest stable | Full support |
| `deprecated` | Being phased out | 6–12 months, with warnings |
| `sunset` | Removal scheduled | Returns 410 Gone |

The line that decides whether you need a new version: does the change break an existing client? Additive changes don't; anything that removes or reshapes does.

| Non-breaking (ship in place) | Breaking (new version) |
|------------------------------|------------------------|
| Add an optional field | Remove a field |
| Add a new endpoint | Change a field's type |
| Add an optional param | Rename a field |
| Expand enum values | Change URL structure |

## Quality bar

Before considering an API design done, confirm:

- URLs follow resource conventions; the HTTP method carries the verb.
- Status codes match the method/status table; the error `code` matches its HTTP status.
- Every error uses the structured envelope — no bare strings — and the full error-code table is present.
- Field names use one casing across the whole API, and each matches its domain term.
- Pagination is consistent (cursor by default) and present on every collection.
- A versioning strategy is declared, and breaking-vs-non-breaking changes are identified.
- Authentication and the authorization model are documented for every endpoint.
- Rate limiting is defined where the API is public or shared.
- The OpenAPI / GraphQL schema / proto spec is complete, with examples for each operation.

## Output

Write the contract where the architecture documents live. `{DOCS_ROOT}` defaults to `docs/` at the project root; honor the project's configured docs location if one is set.

- OpenAPI: `{DOCS_ROOT}/architecture/{module}/api/{resource}.yaml`
- GraphQL: `{DOCS_ROOT}/architecture/{module}/api/schema.graphql`
- gRPC: `proto/{service}/v1/{service}.proto`

## Roles

This skill is written for whoever holds the architecture role — the person designing the contract. The API design is one part of the broader architecture; reviewers and the implementing engineers consume it, and any non-obvious contract decision (protocol choice, versioning scheme, auth model) is worth recording as an architecture decision record so the reasoning outlives the discussion.
