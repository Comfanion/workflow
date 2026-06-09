# REST design guide

Full REST contract design: URL structure, naming, query parameters, status codes, response envelope, and error codes. Load this when designing a REST API; the OpenAPI skeleton lives in `references/openapi-template.yaml`.

## URL structure

Model URLs as resources, not actions — the HTTP method already carries the verb, so the noun should never repeat it. This keeps the surface predictable: a client that knows one collection can guess the rest.

```
# Collection
GET    /api/v1/tasks           # List
POST   /api/v1/tasks           # Create

# Resource
GET    /api/v1/tasks/{id}      # Read
PUT    /api/v1/tasks/{id}      # Replace
PATCH  /api/v1/tasks/{id}      # Partial update
DELETE /api/v1/tasks/{id}      # Delete

# Nested resources (only when the child truly belongs to the parent)
GET    /api/v1/projects/{id}/tasks
POST   /api/v1/projects/{id}/tasks

# Actions (the rare non-CRUD operation that has no natural resource verb)
POST   /api/v1/tasks/{id}/archive
POST   /api/v1/tasks/{id}/assign
```

Reach for an action endpoint (`/archive`) only when the operation genuinely isn't a create/update/delete of some resource — otherwise model it as state on the resource.

## Naming conventions

Every inconsistency here is a thing the client has to special-case. Pick one rule and hold it across the whole API.

| Rule | Good | Bad |
|------|------|-----|
| Plural nouns for collections | `/tasks` | `/task`, `/getTask` |
| Lowercase with hyphens in paths | `/user-profiles` | `/userProfiles`, `/user_profiles` |
| No verbs in the URL | `POST /tasks` | `/createTask` |
| No trailing slash | `/tasks` | `/tasks/` |
| One casing for JSON fields, everywhere | `userId` (or `user_id`) — but never both | mixing per endpoint |

## Query parameters

Standardize filtering, sorting, and pagination once. Cursor pagination is the default because offset pagination drifts and double-counts when data changes under the client.

```
# Filtering
GET /tasks?status=active&assignee_id=123

# Sorting
GET /tasks?sort=created_at:desc,title:asc

# Pagination — cursor-based (preferred: stable under writes)
GET /tasks?cursor=eyJpZCI6MTIzfQ&limit=20

# Pagination — offset-based (only for small, slow-changing sets)
GET /tasks?page=2&per_page=20

# Field selection
GET /tasks?fields=id,title,status

# Expansion/embedding of related resources
GET /tasks?expand=assignee,project
```

## Methods and status codes

Use status codes as the primary signal — clients branch on them before they read the body. This table is the contract; match it exactly so a `201` always means the same thing.

| Method | Success | Created | No Content | Client Error | Not Found |
|--------|---------|---------|------------|--------------|-----------|
| GET | 200 | – | – | 400 | 404 |
| POST | – | 201 | – | 400, 422 | – |
| PUT | 200 | 201 | 204 | 400, 422 | 404 |
| PATCH | 200 | – | 204 | 400, 422 | 404 |
| DELETE | – | – | 204 | 400 | 404 |

## Response format

Wrap responses in a stable envelope so a client can write one parser, not one per endpoint. Single resources, collections, and errors each have a fixed shape:

```json
// Success — single resource
{
  "data": {
    "id": "123",
    "type": "task",
    "attributes": { "title": "Fix bug", "status": "active" },
    "relationships": { "assignee": { "id": "456", "type": "user" } }
  }
}

// Success — collection (with paging metadata and navigation links)
{
  "data": [ /* ... */ ],
  "meta": { "total": 100, "page": 1, "per_page": 20 },
  "links": { "next": "/tasks?cursor=abc", "prev": null }
}

// Error — always structured, never a bare string
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      { "field": "title", "message": "is required" },
      { "field": "due_date", "message": "must be in future" }
    ]
  }
}
```

## Error codes

A machine-readable `code` lets clients branch on the failure without parsing English. Keep the HTTP status and the code in lockstep with this table — a `403` should never carry a `NOT_FOUND` code.

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

## Rate limiting

Public and shared APIs need rate limits, and clients need to see their budget so they can back off instead of hammering. Surface it in headers on every response:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640000000
Retry-After: 60
```

When the limit is hit, return `429` with the standard error envelope and a `retry_after` so the client knows exactly how long to wait:

```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests",
    "retry_after": 60
  }
}
```
