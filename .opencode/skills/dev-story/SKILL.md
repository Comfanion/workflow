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

  <phase name="2-plan" title="Plan Task Execution">
    <step n="1">Read story tasks, determine execution order based on dependencies</step>
    <step n="2">Identify which tasks are independent (can run in parallel) vs sequential</step>
    <step n="3">For each task, note: what to do + which files/patterns are relevant context</step>
    <step n="4">Do NOT read source files that only @coder needs — save your context for orchestration</step>
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

  <phase name="3-execute" title="Execute Tasks">
    <loop>
      <step n="1">Pick next task(s) from TODO (parallel if independent, otherwise one)</step>
      <step n="2">Delegate to @coder with a brief: what to do + context file paths</step>
      <step n="3">Verify result: tests pass, files compile</step>
      <step n="4">Mark task done in story file + TODO</step>
      <step n="5">Update .opencode/session-state.yaml</step>
      <step n="6">Next task or story complete</step>
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

## Brief Format for @coder

Each @coder call = ONE task. Brief contains:
- **What**: task goal in 1-2 sentences
- **Context**: file paths (story, source, patterns to follow)
- **Methodology**: TDD ("write failing test first") or STUB ("create stub first") per config.yaml

@coder reads the files and figures out implementation details.

<rules name="delegation">
  <rule name="one-task" critical="true">
    ONE task per @coder call. Independent tasks can run in parallel (multiple agents in one message).
  </rule>
  <rule name="verify-between">
    After each task: verify result, mark done, THEN next task.
  </rule>
  <rule name="task-scope">
    Good task: logically complete unit (service, handler, entity). Single responsibility. Testable independently.
    Split when: multiple unrelated responsibilities.
    Combine when: too granular, same file, same concern.
  </rule>
</rules>
