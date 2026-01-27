---
name: dev-sprint
description: Use when executing a full sprint, including all epics, stories, reviews, and tests, with auto-compaction.
metadata:
  domain: development
  agents: [dev]
  artifacts: sprint-status.yaml, epic state files, story files
---

# Dev Sprint Skill

## CRITICAL: Context Rules

**READ ONLY (max ~70KB):**
- `CLAUDE.md`
- `docs/coding-standards/README.md`
- `docs/coding-standards/patterns.md`
- `sprint-status.yaml`
- Current epic file (ONE)
- Current story file (ONE at a time)

**❌ DO NOT READ — WASTES CONTEXT:**
- ❌ `docs/prd.md` — epic/story already has context
- ❌ `docs/architecture.md` — too large, coding-standards has patterns
- ❌ All epics at once — read ONE, execute, then next
- ❌ All stories at once — read ONE, execute, then next

---

<workflow name="dev-sprint">

  <phase name="1-context" title="Load Minimal Context">
    <critical>DO NOT read prd.md, architecture.md, or all epics/stories!</critical>
    <read>
      <file>CLAUDE.md</file>
      <file>docs/coding-standards/README.md</file>
      <file>docs/coding-standards/patterns.md</file>
      <file>sprint-status.yaml</file>
      <file>{current-epic-file} — ONE only!</file>
      <file>{current-story-file} — ONE only!</file>
    </read>
    <goal>~70KB per story, NOT 200KB+</goal>
  </phase>

  <phase name="2-init" title="Initialize Sprint">
    <step n="1">Parse sprint-status.yaml → extract epic list for target sprint</step>
    <step n="2">Create master TODO list with IDs — epics, stories, tasks, and reviews:
      ```
      [ ] E{N1}: {epic title}
        [ ] E{N1}-S01: {story title}
          [ ] E{N1}-S01-T01: {task title}
          [ ] E{N1}-S01-T02: {task title}
          [ ] E{N1}-S01-Review: run tests, verify AC
        [ ] E{N1}-S02: {story title}
          [ ] E{N1}-S02-T01: {task title}
          [ ] E{N1}-S02-Review: run tests, verify AC
        [ ] E{N1}-Integration: epic integration tests
      [ ] E{N2}: {epic title}
        [ ] E{N2}-S01: {story title}
          [ ] E{N2}-S01-T01: {task title}
          [ ] E{N2}-S01-Review: run tests, verify AC
        [ ] E{N2}-Integration: epic integration tests
      [ ] Sprint-Integration: run sprint integration tests
      ```
    </step>
    <example>
      ```
      [ ] E04: Identity Merge
        [ ] E04-S01: Merge Domain Logic
          [ ] E04-S01-T01: MergeResult value object
          [ ] E04-S01-T02: Merge service
          [ ] E04-S01-T03: Unit tests
          [ ] E04-S01-Review: run tests, verify AC
        [ ] E04-S02: Auto Merge on Link
          [ ] E04-S02-T01: Event handler
          [ ] E04-S02-T02: Integration tests
          [ ] E04-S02-Review: run tests, verify AC
        [ ] E04-Integration: epic integration tests
      [ ] E06: Team Management
        [ ] E06-S01: Team CRUD
          [ ] E06-S01-T01: Domain model
          [ ] E06-S01-T02: Handler
          [ ] E06-S01-Review: run tests, verify AC
        [ ] E06-Integration: epic integration tests
      [ ] Sprint-Integration: run sprint integration tests
      ```
    </example>
    <step n="3">Set sprint status="in-progress" in sprint-status.yaml</step>
    <step n="4">Mark first epic as in_progress in TODO</step>
  </phase>

  <phase name="3-loop" title="Epic Execution Loop">
    <critical>Status flow: in_progress → review → done. NEVER mark done before review!</critical>
    <for-each item="epic" in="pending_epics">
      
      <action name="execute-epic">
        Follow dev-epic skill logic:
        - Creates nested TODO for stories
        - Executes all stories + reviews
        - Clears epic TODO when done
      </action>
      
      <action name="epic-to-review">
        All stories done → set epic status: review
        Mark epic TODO as "review" (NOT "done" yet!)
      </action>
      
      <action name="epic-review">
        Run epic integration tests
        <if condition="TESTS_FAIL">
          Fix → re-test (max 3 attempts)
        </if>
        <if condition="TESTS_PASS">
          Set epic status: done
          Mark epic TODO as completed
        </if>
      </action>
      
      <action name="update-state">
        Edit sprint-status.yaml:
        - Set completed epic status="done"
        - Set next epic status="in-progress"
      </action>
      
      <action name="compact">
        Mark next epic as in_progress in TODO
        Wait for auto-compaction → resume
      </action>
      
    </for-each>
  </phase>

  <phase name="4-finalize" title="Finalize Sprint">
    <critical>Sprint also goes through review before done!</critical>
    <step n="1">All epics done → set sprint status: review</step>
    <step n="2">Run sprint integration tests (mark in TODO)</step>
    <step n="3">If tests fail → fix → re-test</step>
    <step n="4">All passed → set sprint status: done in sprint-status.yaml</step>
    <step n="5">Clear sprint TODO list</step>
    <step n="6">Update .opencode/session-state.yaml (done)</step>
    <step n="7">Report completion with summary + metrics</step>
  </phase>

</workflow>

## Session State (MANDATORY)

After each epic/story/task completion, update `.opencode/session-state.yaml`:

```yaml
# .opencode/session-state.yaml — AI writes, compaction plugin reads
command: /dev-sprint
agent: dev

sprint:
  number: 2
  status: in-progress

epic:
  id: PROJ-E04
  title: Current Epic Title
  file: docs/sprint-artifacts/sprint-2/epic-04-desc.md
  progress: "3/5 stories"

story:
  id: PROJ-S04-03
  title: Current Story Title
  file: docs/sprint-artifacts/sprint-2/stories/story-04-03-desc.md
  current_task: T2
  completed_tasks: [T1]
  pending_tasks: [T2, T3]

next_action: "Continue T2 of story S04-03"

key_decisions:
  - "Decision 1"
```

This file survives compaction and tells the agent where to resume.

<outputs>
  - Implementation code for all stories in sprint
  - Updated sprint-status.yaml
  - Updated .opencode/session-state.yaml
  - Clean TODO list (all completed)
</outputs>

<rules>
  <do>Create ONE master TODO list for entire sprint at start</do>
  <do>Let dev-epic skill manage its own nested TODO</do>
  <do>Execute epics IN ORDER as planned in sprint-status.yaml</do>
  <do>Within each epic, execute stories IN ORDER as planned</do>
  <do>Within each story, execute tasks ONE BY ONE (or parallel if independent)</do>
  <dont>Ask for confirmation between epics — sprint TODO is your guide</dont>
  <dont>Proceed to next epic if epic review fails — HALT and report</dont>
  <dont>Reorder, skip, merge, or "optimize" epic/story execution order</dont>
  <dont>Work on multiple stories or epics in parallel</dont>
  <dont>Delegate entire story to @coder in one prompt — task by task only</dont>
</rules>
