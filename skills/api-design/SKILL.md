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

## REST design

### URL structure

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

### Naming conventions

Every inconsistency here is a thing the client has to special-case. Pick one rule and hold it across the whole API.

| Rule | Good | Bad |
|------|------|-----|
| Plural nouns for collections | `/tasks` | `/task`, `/getTask` |
| Lowercase with hyphens in paths | `/user-profiles` | `/userProfiles`, `/user_profiles` |
| No verbs in the URL | `POST /tasks` | `/createTask` |
| No trailing slash | `/tasks` | `/tasks/` |
| One casing for JSON fields, everywhere | `userId` (or `user_id`) — but never both | mixing per endpoint |

### Query parameters

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

### Methods and status codes

Use status codes as the primary signal — clients branch on them before they read the body. This table is the contract; match it exactly so a `201` always means the same thing.

| Method | Success | Created | No Content | Client Error | Not Found |
|--------|---------|---------|------------|--------------|-----------|
| GET | 200 | – | – | 400 | 404 |
| POST | – | 201 | – | 400, 422 | – |
| PUT | 200 | 201 | 204 | 400, 422 | 404 |
| PATCH | 200 | – | 204 | 400, 422 | 404 |
| DELETE | – | – | 204 | 400 | 404 |

### Response format

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

### Error codes

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

## Authentication and authorization

Document how callers prove who they are and what that identity is allowed to do — leaving this implicit is how endpoints ship unprotected.

| Method | Use for | Header |
|--------|---------|--------|
| Bearer token (JWT) | User sessions, mobile | `Authorization: Bearer <token>` |
| API key | Service-to-service, public APIs | `X-API-Key: <key>` |
| OAuth 2.0 | Third-party integrations | OAuth flow |
| mTLS | High-security service mesh | Client certificate |

State the authorization model alongside it — resource-based (can this user read this task), scope-based (the token carries `tasks:read`, `tasks:write`), or role-based (admin / user / viewer). Pick one model and apply it uniformly; mixing them per endpoint is where access-control bugs hide.

## GraphQL design

The schema is the contract. Nullability is the load-bearing decision: a field is nullable unless the server can always produce it, because flipping non-null to nullable later breaks every client that assumed it was present.

```graphql
type Query {
  task(id: ID!): Task
  tasks(filter: TaskFilter, pagination: Pagination): TaskConnection!
}

type Mutation {
  createTask(input: CreateTaskInput!): TaskPayload!
  updateTask(id: ID!, input: UpdateTaskInput!): TaskPayload!
  deleteTask(id: ID!): DeletePayload!
}

type Subscription {
  taskUpdated(projectId: ID!): Task!
}

type Task {
  id: ID!
  title: String!
  status: TaskStatus!
  assignee: User          # nullable: a task may be unassigned
  project: Project!
  createdAt: DateTime!
}

input CreateTaskInput {
  title: String!
  projectId: ID!
  assigneeId: ID
}

type TaskPayload {
  task: Task
  errors: [UserError!]    # return errors in the payload, not as transport errors
}

type UserError {
  field: String
  message: String!
}
```

The conventions that keep a GraphQL API predictable:

| Practice | Why |
|----------|-----|
| Nullable by default, non-null only when guaranteed | Tightening to non-null later is safe; loosening is breaking |
| Dedicated `input` types for mutations | Decouples write shape from read shape |
| Payload types carrying an `errors` list | Surfaces business errors without failing the whole request |
| Connection pattern (`edges`, `pageInfo`) for lists | Standard, paginatable list shape |
| Enums over free strings | The set of valid values is part of the contract |

## gRPC design

In proto, field numbers and enum zero-values are permanent — they're how the wire format stays backward-compatible, so set them with the same care as a database schema.

```protobuf
syntax = "proto3";

package tasks.v1;

option go_package = "github.com/org/project/gen/tasks/v1";

service TaskService {
  rpc GetTask(GetTaskRequest) returns (Task);
  rpc ListTasks(ListTasksRequest) returns (ListTasksResponse);
  rpc CreateTask(CreateTaskRequest) returns (Task);
  rpc UpdateTask(UpdateTaskRequest) returns (Task);
  rpc DeleteTask(DeleteTaskRequest) returns (google.protobuf.Empty);

  // Server-streaming
  rpc WatchTasks(WatchTasksRequest) returns (stream Task);
}

message Task {
  string id = 1;
  string title = 2;
  TaskStatus status = 3;
  optional string assignee_id = 4;          // optional distinguishes unset from empty
  google.protobuf.Timestamp created_at = 5;
}

enum TaskStatus {
  TASK_STATUS_UNSPECIFIED = 0;              // zero-value must be the "unknown" case
  TASK_STATUS_TODO = 1;
  TASK_STATUS_IN_PROGRESS = 2;
  TASK_STATUS_DONE = 3;
}

message ListTasksRequest {
  int32 page_size = 1;
  string page_token = 2;
  string filter = 3;                        // e.g. CEL expression
}

message ListTasksResponse {
  repeated Task tasks = 1;
  string next_page_token = 2;
}
```

The rules that keep proto evolvable:

| Practice | Why |
|----------|-----|
| Prefix enum values with the type name | Proto enums share a namespace — `TASK_STATUS_TODO` avoids collisions |
| Reserve `UNSPECIFIED = 0` | The zero-value is the default on the wire; make it mean "not set" |
| Use `optional` for nullable scalars | Tells unset apart from a legitimate default value |
| Version the package (`tasks.v1`) | Lets `v2` coexist during migration |
| Token-based pagination | Stateless and efficient at scale |

## OpenAPI specification

For REST, an OpenAPI spec is the machine-readable form of everything above — it generates clients, mocks, and docs, so the contract lives in one file instead of scattered prose. Use this as the starting shape:

```yaml
openapi: 3.1.0
info:
  title: Tasks API
  version: 1.0.0

servers:
  - url: https://api.example.com/v1

paths:
  /tasks:
    get:
      summary: List tasks
      operationId: listTasks
      tags: [Tasks]
      parameters:
        - name: status
          in: query
          schema:
            $ref: '#/components/schemas/TaskStatus'
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
            maximum: 100
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TaskList'
    post:
      summary: Create task
      operationId: createTask
      tags: [Tasks]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateTaskRequest'
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Task'
        '422':
          $ref: '#/components/responses/ValidationError'

components:
  schemas:
    Task:
      type: object
      required: [id, title, status, createdAt]
      properties:
        id: { type: string, format: uuid }
        title: { type: string, maxLength: 255 }
        status: { $ref: '#/components/schemas/TaskStatus' }
        createdAt: { type: string, format: date-time }

    TaskStatus:
      type: string
      enum: [todo, in_progress, done]

    CreateTaskRequest:
      type: object
      required: [title]
      properties:
        title: { type: string, minLength: 1, maxLength: 255 }
        assigneeId: { type: string, format: uuid }

  responses:
    ValidationError:
      description: Validation failed
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

security:
  - bearerAuth: []
```

Define every schema once under `components` and `$ref` it everywhere — the same field-consistency discipline as the rest of this skill, enforced by the tooling.

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

## Quality bar

Before considering an API design done, confirm:

- URLs follow resource conventions; the HTTP method carries the verb.
- Status codes match the method/status table; the error `code` matches its HTTP status.
- Every error uses the structured envelope — no bare strings.
- Field names use one casing across the whole API.
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
