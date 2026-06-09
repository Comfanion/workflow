# GraphQL design guide

Full GraphQL contract design: the schema, nullability discipline, and the conventions that keep a GraphQL API predictable. Load this when designing a GraphQL API.

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
