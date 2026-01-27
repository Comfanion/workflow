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

## CRITICAL: Context Rules

**READ ONLY (max ~70KB):**
- `CLAUDE.md`
- `docs/coding-standards/README.md`
- `docs/coding-standards/patterns.md`
- Story file

**❌ DO NOT READ — WASTES CONTEXT:**
- ❌ `docs/prd.md` — story already has context
- ❌ `docs/architecture.md` — too large, coding-standards has patterns

---

<workflow name="dev-story">

  <phase name="1-context" title="Load Minimal Context">
    <critical>DO NOT read prd.md or architecture.md!</critical>
    <read>
      <file>CLAUDE.md</file>
      <file>docs/coding-standards/README.md</file>
      <file>docs/coding-standards/patterns.md</file>
      <file>{story-file}</file>
    </read>
    <goal>~70KB context, NOT 200KB+</goal>
  </phase>

  <phase name="2-transform" title="Transform Story Task → Executable Instruction">
    <step n="1" name="read-docs">
      Story has "Required Reading", task has "Read First".
      Open each → find sections → extract patterns, signatures, constraints.
    </step>
    <step n="2" name="find-patterns">
      From "Read First" paths, find existing similar code.
      Note structure, imports, error handling → becomes "Pattern Reference".
    </step>
    <step n="3" name="build-context">
      @coder doesn't see story. Provide:
      - Existing files (paths + what they contain)
      - Patterns to follow (link to similar code)
      - What was done (results of previous tasks)
      - Imports (what packages to use)
    </step>
    <step n="4" name="add-direction">
      Story has "Approach". Expand with:
      - Interface signatures (method names, params, return types)
      - Error handling (what errors to return)
      - Validation rules
    </step>
    <step n="5" name="verification">
      Story has "Done when". Add:
      - Specific test commands
      - Files that must compile
      - Test coverage expectations
    </step>
  </phase>

  <phase name="2b-todo" title="Create TODO with IDs">
    <critical>TODO MUST use task IDs from story file!</critical>
    <template>
      ```
      [ ] S{E}-{N} T1: {task title from story}
      [ ] S{E}-{N} T2: {task title}
      [ ] S{E}-{N} T3: {task title}
      ...
      [ ] S{E}-{N} Review: run all tests, verify AC
      ```
    </template>
    <example>
      ```
      [ ] S04-01 T1: Domain Model — MergeResult value object
      [ ] S04-01 T2: Merge Service — primary selection logic
      [ ] S04-01 T3: External ID reassignment
      [ ] S04-01 T4: Unit tests for merge logic
      [ ] S04-01 Review: run all tests, verify AC
      ```
    </example>
  </phase>

  <phase name="3-delegate" title="Delegate to @coder">
    <action>Formulate task using template below</action>
    <action>Call @coder with full context</action>
    <rule>@coder writes code. Give direction, NOT solution.</rule>
  </phase>

  <phase name="4-verify" title="Verify & Mark Done">
    <action>Run tests</action>
    <action>Check "Done when" criteria</action>
    <action>Mark task ✅ in story file</action>
    <action>Update .opencode/session-state.yaml (see format below)</action>
    <next>Next task or story complete</next>
  </phase>

</workflow>

## Session State (MANDATORY)

After each task completion, update `.opencode/session-state.yaml`:

```yaml
# .opencode/session-state.yaml — AI writes, compaction plugin reads
command: /dev-story
agent: dev

story:
  id: PROJ-S01-01
  title: Story Title
  file: docs/sprint-artifacts/sprint-1/stories/story-01-01-desc.md
  current_task: T3
  completed_tasks: [T1, T2]
  pending_tasks: [T3, T4]

next_action: "Continue T3: Implement handler"

key_decisions:
  - "Decision 1"
  - "Decision 2"
```

This file survives compaction and tells the agent where to resume.

## Task Template for @coder

<template name="coder-task">
```markdown
## Task: [Name] (Task IDs)

[One line goal]

### Skills
- Use `doc-todo` for TODO comments

### Context
- [Existing file]: [what to use from it]
- Existing pattern: [path to similar code]

### Output Files
- [path/to/create.ext]

### Requirements
1. [What to implement with signatures]
2. [Another requirement]

### Pattern Reference
→ [path/to/similar/code.ext]

### Error Handling
[How to handle errors]

### Done When
- [ ] File compiles
- [ ] Tests pass
- [ ] [Specific criterion]
```
</template>

<rules name="delegation">
  <rule name="parallel">
    Each task gets full context. No shared state. Different files only.
  </rule>
  <rule name="no-code">
    Give direction, NOT solution. @coder writes implementation.
  </rule>
  <rule name="methodology">
    TDD: "Write failing test first, then implement"
    STUB: "Create stub first, write tests, then implement"
  </rule>
</rules>

<task-boundaries>
  <good>Logically complete unit (service, handler, entity). Single responsibility. Testable independently.</good>
  <split-when>Multiple unrelated responsibilities. No logical connection.</split-when>
  <combine-when>Too granular. Same file, same concern.</combine-when>
</task-boundaries>

<patterns>
  <pattern name="new-service">
    Context: domain entities, repository interface, existing service
    Requirements: interface, constructor, methods
    Pattern: existing service structure
  </pattern>
  <pattern name="new-handler">
    Context: service interface, DTOs, existing handler
    Requirements: handler struct, methods, error mapping
    Pattern: existing handler structure
  </pattern>
  <pattern name="new-tests">
    Context: code to test, existing test examples
    Requirements: test scenarios, mocks
    Pattern: existing test structure
  </pattern>
</patterns>

<critical>
  ✅ PROVIDE: pattern references, interface signatures, requirements, error approach
  ❌ DO NOT: full implementations, ready-to-copy code, complete structs
</critical>
