---
name: dev-story
description: Use when implementing a story with tasks/subtasks using TDD red-green-refactor cycle
license: MIT
compatibility: opencode
metadata:
  domain: development
  agents: [dev]
  artifacts: story files
---

# Dev Story Skill

Details for implementing stories. For workflow overview, see `/dev-story` command.

## Critical Rules

- **Story File is the single source of truth** - tasks sequence is authoritative
- **Respect task dependencies** - never start blocked tasks
- **Tests are MANDATORY** - each task has tests that MUST pass
- **NEVER lie about tests** - tests must actually exist and pass
- **For parallel execution** - call multiple @coder in one message

## Methodology (from config.yaml)

| Methodology | Flow | Validation |
|-------------|------|------------|
| **TDD** | Interface → Test (RED) → Impl (GREEN) → Refactor | Test must FAIL first, then PASS |
| **STUB** | Interface → Stub → Test → Real Impl | Test against stub, then real |

## Task Implementation

### Dependency Check

```xml
<phase name="DEPENDENCY_CHECK">
  <action>Parse task summary table from story file</action>
  <action>Read "Depends On" column for current task</action>
  <check if="dependencies not complete">
    <action>SKIP this task, find next ready task</action>
  </check>
</phase>
```

### Parallel Opportunity

```xml
<phase name="PARALLEL_CHECK">
  <action>Identify tasks with same satisfied dependencies</action>
  <check if="parallel tasks exist">
    <action>Call multiple @coder in ONE message</action>
  </check>
</phase>
```

### TDD Cycle

```xml
<check if="methodology is TDD">
  <phase name="RED">
    <action>Write test for task deliverables</action>
    <action>Run test - MUST FAIL</action>
  </phase>

  <phase name="GREEN">
    <action>Implement MINIMAL code to pass test</action>
    <action>Run test - MUST PASS</action>
  </phase>

  <phase name="REFACTOR">
    <action>Improve code structure</action>
    <action>Run test - MUST STILL PASS</action>
  </phase>
</check>
```

### STUB Cycle

```xml
<check if="methodology is STUB">
  <phase name="STUB">
    <action>Write stub implementation (mock data)</action>
  </phase>

  <phase name="TEST">
    <action>Write tests against stub</action>
    <action>Run test - MUST PASS with stub</action>
  </phase>

  <phase name="REAL">
    <action>Replace stub with real implementation</action>
    <action>Run test - MUST STILL PASS</action>
  </phase>
</check>
```

## Task Validation

```xml
<validation>
  <check>ALL tests for this task EXIST and PASS 100%</check>
  <check>Implementation matches EXACTLY what task specifies</check>
  <check>Related acceptance criteria satisfied</check>
  <check>Full test suite - NO regressions</check>
</validation>

<check if="ALL pass">
  <action>Mark task [x] in story file</action>
  <action>Update File List</action>
</check>

<check if="ANY fails">
  <action>DO NOT mark task complete</action>
  <action>Fix issues first</action>
</check>
```

## HALT Conditions

- Task dependencies not satisfied
- Additional dependencies need user approval
- 3 consecutive implementation failures
- Required configuration missing

## Definition of Done

- [ ] All tasks marked [x]
- [ ] Implementation satisfies every AC
- [ ] Unit tests added
- [ ] Integration tests (if required)
- [ ] All tests pass
- [ ] File List complete
- [ ] Change Log updated
