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

  <phase name="0-study" title="Study Existing Code (MANDATORY)">
    <critical>BEFORE any coding, study existing patterns!</critical>
    
    <step n="1">Search similar features:
      search({ query: "similar feature pattern", index: "code" })
    </step>
    
    <step n="2">Read 2-3 examples:
      - How are entities/services/handlers structured?
      - What error handling patterns exist?
      - What test patterns are used?
      - What imports/dependencies are common?
    </step>
    
    <step n="3">Read coding standards:
      - docs/coding-standards/README.md
      - docs/coding-standards/patterns.md
    </step>
    
    <step n="4">Analyze task dependencies:
      - Which tasks can run parallel? (different files, no deps)
      - Which must be sequential? (dependencies exist)
    </step>
    
    <step n="5">If parallel possible → design interfaces FIRST:
      - Shared contract (interface signature)
      - Shared types (request/response models)
      - Error handling approach
    </step>
    
    <output>Study Summary (write to story file):
      - Existing patterns: [file paths]
      - Shared interfaces (if parallel): [signatures]
      - Batch plan: [sequential/parallel grouping]
    </output>
  </phase>

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
      [ ] E{E}-S{N}-T01: {task title from story}
      [ ] E{E}-S{N}-T02: {task title}
      [ ] E{E}-S{N}-T03: {task title}
      ...
      [ ] E{E}-S{N}-Review: run all tests, verify AC
      ```
    </template>
    <example>
      ```
      [ ] E04-S01-T01: Domain Model — MergeResult value object
      [ ] E04-S01-T02: Merge Service — primary selection logic
      [ ] E04-S01-T03: External ID reassignment
      [ ] E04-S01-T04: Unit tests for merge logic
      [ ] E04-S01-Review: run all tests, verify AC
      ```
    </example>
  </phase>

  <phase name="3-execute" title="Execute Tasks — Batches (Interface-First)">
    <critical>DO NOT delegate entire story to @coder in one prompt!</critical>
    
    <batch-system>
      <batch n="0" type="sequential">Foundation (interfaces, types)</batch>
      <batch n="1" type="parallel">Implementations (different files, same interface)</batch>
      <batch n="2" type="sequential">Integration (needs all previous)</batch>
    </batch-system>
    
    <strategy>
      For each batch:
      1. If batch is sequential → execute tasks one by one
      2. If batch is parallel → execute all tasks simultaneously
      3. After batch completes → SYNC POINT (verify integration)
      4. If sync OK → next batch, if fails → fix and retry (max 2 attempts)
    </strategy>
    
    <parallel-rules>
      <safe>Different files + shared interface + no dependencies</safe>
      <unsafe>Same file OR no contract OR dependencies between tasks</unsafe>
      <example-safe>Batch 0: OrderValidator interface → Batch 1 (parallel): RequiredFieldsValidator, InventoryValidator, PriceValidator</example-safe>
      <example-unsafe>T1: Add field to Order entity, T2: Add method to Order entity → SAME FILE, must be sequential</example-unsafe>
    </parallel-rules>
    
    <loop>
      <step n="1">Pick next batch from TODO</step>
      <step n="2">Transform tasks → executable instructions (include Study Summary)</step>
      <step n="3">
        If sequential: delegate ONE task, wait for completion
        If parallel: delegate ALL tasks in batch simultaneously (each with Study Summary + interface contract)
      </step>
      <step n="4">Wait for batch completion</step>
      <step n="5">SYNC POINT: verify all files compile together, interfaces match, tests pass</step>
      <step n="6">If sync fails: identify issues, fix (max 2 attempts), then HALT if still failing</step>
      <step n="7">Mark batch tasks ✅ in story file + TODO</step>
      <step n="8">Update .opencode/session-state.yaml</step>
      <step n="9">Next batch or story complete</step>
    </loop>
  </phase>

  <phase name="4-review" title="Review BEFORE Done">
    <critical>Status flow: in_progress → review → done. NEVER skip review!</critical>
    <step n="1">All tasks done → set story status: review</step>
    <step n="2">Run all tests, verify AC</step>
    <step n="3">If called from /dev-epic: invoke @reviewer.
      Reviewer does TWO things:
      1. WRITES findings to story file (## Review → ### Review #N) — for history
      2. RETURNS summary to you — use THIS, do NOT re-read story file</step>
    <step n="4">If CHANGES_REQUESTED: use reviewer's returned action items directly → fix → re-review (max 3 attempts)</step>
    <step n="5">Review passed → set story status: done</step>
    <step n="6">Update .opencode/session-state.yaml</step>
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
  <rule name="task-by-task" critical="true">
    Delegate ONE task at a time (or parallel group if independent).
    NEVER delegate entire story as one big prompt.
  </rule>
  <rule name="parallel">
    Each task gets full context. No shared state. Different files only.
  </rule>
  <rule name="verify-between">
    After each task: run tests, verify, mark done, THEN next task.
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
