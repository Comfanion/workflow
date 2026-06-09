# gRPC / proto design guide

Full gRPC contract design: the proto definition and the rules that keep it backward-compatible. Load this when designing a gRPC service.

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
