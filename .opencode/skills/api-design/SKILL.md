---
name: api-design
description: Use when designing REST, GraphQL, or gRPC APIs, defining contracts, versioning strategy, or documenting endpoints
license: MIT
compatibility: opencode
metadata:
  domain: software-architecture
  patterns: rest, graphql, grpc, openapi
  artifacts: docs/architecture/*/api/*.yaml
---

# API Design Skill

## When to Use

Use this skill when you need to:
- Design REST API endpoints for a module/service
- Define GraphQL schema and resolvers
- Design gRPC service definitions
- Plan API versioning strategy
- Document API contracts (OpenAPI/Swagger)
- Design error responses and status codes
- Plan authentication/authorization for APIs

## Reference

Always check project standards: `@CLAUDE.md`

## Templates

- OpenAPI: `@.opencode/skills/api-design/template-openapi.yaml`
- GraphQL: `@.opencode/skills/api-design/template-graphql.md`

---

## API Type Selection

| Type | Use When | Avoid When |
|------|----------|------------|
| **REST** | CRUD operations, public APIs, caching needed | Complex queries, real-time |
| **GraphQL** | Flexible queries, mobile clients, nested data | Simple CRUD, caching critical |
| **gRPC** | Service-to-service, high performance, streaming | Browser clients, public APIs |
| **WebSocket** | Real-time, bidirectional, live updates | Request-response patterns |

---

## REST API Design

### URL Structure

```
# Collection
GET    /api/v1/tasks           # List
POST   /api/v1/tasks           # Create

# Resource
GET    /api/v1/tasks/{id}      # Read
PUT    /api/v1/tasks/{id}      # Replace
PATCH  /api/v1/tasks/{id}      # Partial update
DELETE /api/v1/tasks/{id}      # Delete

# Nested resources (when child belongs to parent)
GET    /api/v1/projects/{id}/tasks
POST   /api/v1/projects/{id}/tasks

# Actions (non-CRUD operations)
POST   /api/v1/tasks/{id}/archive
POST   /api/v1/tasks/{id}/assign
```

### Naming Conventions

| Rule | Good | Bad |
|------|------|-----|
| Plural nouns | `/tasks` | `/task`, `/getTask` |
| Lowercase, hyphens | `/user-profiles` | `/userProfiles`, `/user_profiles` |
| No verbs in URL | `POST /tasks` | `/createTask` |
| No trailing slash | `/tasks` | `/tasks/` |
| Consistent casing | `userId` | `user_id` in JSON |

### Query Parameters

```
# Filtering
GET /tasks?status=active&assignee_id=123

# Sorting
GET /tasks?sort=created_at:desc,title:asc

# Pagination (cursor-based preferred)
GET /tasks?cursor=eyJpZCI6MTIzfQ&limit=20

# Pagination (offset-based)
GET /tasks?page=2&per_page=20

# Field selection
GET /tasks?fields=id,title,status

# Expansion/embedding
GET /tasks?expand=assignee,project
```

### HTTP Methods & Status Codes

| Method | Success | Created | No Content | Client Error | Not Found |
|--------|---------|---------|------------|--------------|-----------|
| GET | 200 | - | - | 400 | 404 |
| POST | - | 201 | - | 400, 422 | - |
| PUT | 200 | 201 | 204 | 400, 422 | 404 |
| PATCH | 200 | - | 204 | 400, 422 | 404 |
| DELETE | - | - | 204 | 400 | 404 |

### Response Format

```json
// Success (single resource)
{
  "data": {
    "id": "123",
    "type": "task",
    "attributes": {
      "title": "Fix bug",
      "status": "active"
    },
    "relationships": {
      "assignee": { "id": "456", "type": "user" }
    }
  }
}

// Success (collection)
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "per_page": 20
  },
  "links": {
    "next": "/tasks?cursor=abc",
    "prev": null
  }
}

// Error
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

### Error Codes

| HTTP | Code | When |
|------|------|------|
| 400 | `BAD_REQUEST` | Malformed JSON, missing required params |
| 401 | `UNAUTHORIZED` | Missing or invalid auth token |
| 403 | `FORBIDDEN` | Valid auth but no permission |
| 404 | `NOT_FOUND` | Resource doesn't exist |
| 409 | `CONFLICT` | Duplicate, version conflict |
| 422 | `VALIDATION_ERROR` | Business rule violation |
| 429 | `RATE_LIMITED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Server error (log, don't expose details) |

---

## Versioning Strategy

### URL Versioning (Recommended)

```
/api/v1/tasks
/api/v2/tasks
```

**Pros:** Clear, cacheable, easy routing
**Cons:** URL changes on version bump

### Header Versioning

```
GET /api/tasks
Accept: application/vnd.api+json; version=2
```

**Pros:** Clean URLs
**Cons:** Harder to test, cache

### Version Lifecycle

| Status | Meaning | Support |
|--------|---------|---------|
| `current` | Latest stable | Full support |
| `deprecated` | Being phased out | 6-12 months |
| `sunset` | Removal scheduled | Returns 410 Gone |

### Breaking vs Non-Breaking Changes

| Non-Breaking (OK) | Breaking (New Version) |
|-------------------|------------------------|
| Add optional field | Remove field |
| Add new endpoint | Change field type |
| Add optional param | Rename field |
| Expand enum values | Change URL structure |

---

## Authentication & Authorization

### Auth Methods

| Method | Use For | Header |
|--------|---------|--------|
| Bearer Token (JWT) | User sessions, mobile | `Authorization: Bearer <token>` |
| API Key | Service-to-service, public APIs | `X-API-Key: <key>` |
| OAuth 2.0 | Third-party integrations | OAuth flow |
| mTLS | High-security service mesh | Certificate |

### Authorization Patterns

```yaml
# Resource-based
GET /tasks/{id}  # Check: user can read task

# Scope-based (OAuth)
Authorization: Bearer <token>
# Token has scopes: ["tasks:read", "tasks:write"]

# Role-based
# Admin: all operations
# User: own tasks only
# Viewer: read-only
```

---

## GraphQL Design

### Schema Structure

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
  assignee: User
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
  errors: [UserError!]
}

type UserError {
  field: String
  message: String!
}
```

### GraphQL Best Practices

| Practice | Example |
|----------|---------|
| Nullable by default | `assignee: User` (nullable) |
| Non-null when guaranteed | `id: ID!`, `createdAt: DateTime!` |
| Input types for mutations | `input CreateTaskInput` |
| Payload types with errors | `TaskPayload { task, errors }` |
| Connection pattern for lists | `TaskConnection { edges, pageInfo }` |
| Use enums | `enum TaskStatus { TODO, IN_PROGRESS, DONE }` |

---

## gRPC Design

### Proto File Structure

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
  
  // Streaming
  rpc WatchTasks(WatchTasksRequest) returns (stream Task);
}

message Task {
  string id = 1;
  string title = 2;
  TaskStatus status = 3;
  optional string assignee_id = 4;
  google.protobuf.Timestamp created_at = 5;
}

enum TaskStatus {
  TASK_STATUS_UNSPECIFIED = 0;
  TASK_STATUS_TODO = 1;
  TASK_STATUS_IN_PROGRESS = 2;
  TASK_STATUS_DONE = 3;
}

message ListTasksRequest {
  int32 page_size = 1;
  string page_token = 2;
  string filter = 3;  // CEL expression
}

message ListTasksResponse {
  repeated Task tasks = 1;
  string next_page_token = 2;
}
```

### gRPC Best Practices

| Practice | Why |
|----------|-----|
| Prefix enums with type name | Avoid conflicts: `TASK_STATUS_TODO` |
| Use `UNSPECIFIED = 0` | Default value detection |
| Use `optional` for nullable | Distinguish null vs default |
| Package versioning | `package tasks.v1` |
| Pagination with tokens | Stateless, efficient |

---

## OpenAPI Specification

### Minimal Example

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
        id:
          type: string
          format: uuid
        title:
          type: string
          maxLength: 255
        status:
          $ref: '#/components/schemas/TaskStatus'
        createdAt:
          type: string
          format: date-time
    
    TaskStatus:
      type: string
      enum: [todo, in_progress, done]
    
    CreateTaskRequest:
      type: object
      required: [title]
      properties:
        title:
          type: string
          minLength: 1
          maxLength: 255
        assigneeId:
          type: string
          format: uuid

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

---

## Rate Limiting

### Headers

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640000000
Retry-After: 60
```

### Response (429)

```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests",
    "retry_after": 60
  }
}
```

---

## Validation Checklist

Before completing API design:

- [ ] URLs follow RESTful conventions
- [ ] HTTP methods used correctly
- [ ] Status codes are appropriate
- [ ] Error responses are consistent
- [ ] Pagination implemented (cursor preferred)
- [ ] Versioning strategy defined
- [ ] Authentication documented
- [ ] Rate limiting defined
- [ ] OpenAPI spec complete
- [ ] Examples for all endpoints
- [ ] Breaking changes identified

---

## Output

- OpenAPI: `docs/architecture/{module}/api/{resource}.yaml`
- GraphQL: `docs/architecture/{module}/api/schema.graphql`
- gRPC: `proto/{service}/v1/{service}.proto`

## Related Skills

- `architecture-design` — API is part of architecture
- `unit-writing` — API specs in api/ folder
- `adr-writing` — Document API decisions
