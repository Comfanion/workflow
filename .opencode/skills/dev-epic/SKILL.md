---
name: dev-epic
description: Use when executing a full epic, including all stories, reviews, and tests, with auto-compaction.
metadata:
  domain: development
  agents: [dev]
  artifacts: epic state file, story files
---

# Dev Epic Skill

## CRITICAL: Context Rules

**READ ONLY (max ~70KB):**
- `CLAUDE.md`
- `docs/coding-standards/README.md`
- `docs/coding-standards/patterns.md`
- Epic file (ONE)
- Current story file (ONE at a time)

**❌ DO NOT READ — WASTES CONTEXT:**
- ❌ `docs/prd.md` — epic/story already has context
- ❌ `docs/architecture.md` — too large, coding-standards has patterns
- ❌ All stories at once — read ONE, execute, then next

---

<workflow name="dev-epic">

  <phase name="1-context" title="Load Minimal Context">
    <critical>DO NOT read prd.md, architecture.md, or all stories!</critical>
    <read>
      <file>CLAUDE.md</file>
      <file>docs/coding-standards/README.md</file>
      <file>docs/coding-standards/patterns.md</file>
      <file>{epic-file}</file>
      <file>{current-story-file} — ONE only!</file>
    </read>
    <goal>~70KB per story, NOT 200KB+</goal>
  </phase>

  <phase name="2-init" title="Initialize Epic">
    <step n="1">Parse epic file → "Story Tasks" section has all stories + tasks (no need to read story files yet)</step>
    <step n="2">Create epic state: docs/sprint-artifacts/sprint-N/.sprint-state/epic-XX-state.yaml</step>
    <step n="3">Create TODO list with IDs — stories, their tasks, and reviews:
      ```
      [ ] E{N}-S01: {story title}
        [ ] E{N}-S01-T01: {task title}
        [ ] E{N}-S01-T02: {task title}
        [ ] E{N}-S01-Review: run tests, verify AC
      [ ] E{N}-S02: {story title}
        [ ] E{N}-S02-T01: {task title}
        [ ] E{N}-S02-T02: {task title}
        [ ] E{N}-S02-Review: run tests, verify AC
      ...
      [ ] E{N}-Integration: run epic integration tests
      [ ] E{N}-AC: verify epic acceptance criteria
      ```
    </step>
    <example>
      ```
      [ ] E04-S01: Merge Domain Logic
        [ ] E04-S01-T01: MergeResult value object
        [ ] E04-S01-T02: Merge service — primary selection
        [ ] E04-S01-T03: Unit tests
        [ ] E04-S01-Review: run tests, verify AC
      [ ] E04-S02: Auto Merge on Link
        [ ] E04-S02-T01: Event handler for link
        [ ] E04-S02-T02: Best-effort merge logic
        [ ] E04-S02-T03: Integration tests
        [ ] E04-S02-Review: run tests, verify AC
      [ ] E04-Integration: run epic integration tests
      [ ] E04-AC: verify epic acceptance criteria
      ```
    </example>
    <step n="4">Set state: status="in-progress", next_action="Execute [first-story.md]"</step>
    <step n="5">Mark first story as in_progress in TODO</step>
  </phase>

  <phase name="3-loop" title="Story Execution Loop">
    <critical>Status flow: in_progress → review → done. NEVER mark done before review!</critical>
    <for-each item="story" in="pending_stories">
      
      <action name="execute-story">
        Follow /dev-story logic:
        - Read ONE story file
        - Execute tasks ONE BY ONE (or parallel if independent)
        - NEVER delegate entire story to @coder in one prompt
        - After each task: verify, mark done, next task
      </action>
      
      <action name="story-to-review">
        All tasks done → set story status: review
        Mark story TODO as "review" (NOT "done" yet!)
      </action>
      
      <action name="review-story">
        Invoke @reviewer on story code
        <if condition="CHANGES_REQUESTED">
          Add fix tasks → re-execute → re-review (max 3 attempts)
        </if>
        <if condition="APPROVED">
          Set story status: done
          Mark story TODO as completed
        </if>
      </action>
      
      <action name="update-state">
        Edit epic state file:
        - Move story to completed_stories
        - Increment current_story_index
        - Set next_action to next story
      </action>
      
      <action name="compact">
        Mark next story as in_progress in TODO
        Wait for auto-compaction → resume
      </action>
      
    </for-each>
  </phase>

  <phase name="4-finalize" title="Finalize Epic">
    <critical>Epic also goes through review before done!</critical>
    <step n="1">All stories done → set epic status: review</step>
    <step n="2">Run epic integration tests (mark in TODO)</step>
    <step n="3">Verify all AC from epic file (mark in TODO)</step>
    <step n="4">If tests fail → fix → re-test</step>
    <step n="5">All passed → set epic status: done</step>
    <step n="6">Clear epic TODO list</step>
    <step n="7">Update .opencode/session-state.yaml (next epic or done)</step>
    <step n="8">Report completion with summary</step>
  </phase>

</workflow>

## Session State (MANDATORY)

After each story/task completion, update `.opencode/session-state.yaml`:

```yaml
# .opencode/session-state.yaml — AI writes, compaction plugin reads
command: /dev-epic
agent: dev

epic:
  id: PROJ-E01
  title: Epic Title
  file: docs/sprint-artifacts/sprint-1/epic-01-desc.md
  progress: "3/5 stories"

story:
  id: PROJ-S01-03
  title: Current Story Title
  file: docs/sprint-artifacts/sprint-1/stories/story-01-03-desc.md
  current_task: T2
  completed_tasks: [T1]
  pending_tasks: [T2, T3]

next_action: "Continue T2 of story S01-03"

key_decisions:
  - "Decision 1"
```

This file survives compaction and tells the agent where to resume.

<outputs>
  - Implementation code for all stories
  - Updated epic-XX-state.yaml
  - Updated .opencode/session-state.yaml
  - Clean TODO list (all completed)
</outputs>

<rules>
  <do>Create clean TODO list for each epic</do>
  <do>Update epic state file BEFORE compaction</do>
  <do>Execute stories IN ORDER as planned in epic file</do>
  <do>Execute tasks within story ONE BY ONE (or parallel if independent)</do>
  <dont>Ask user for confirmation between stories — TODO is your guide</dont>
  <dont>Proceed to next story if review fails — enter fix loop</dont>
  <dont>Reorder, skip, merge, or "optimize" story execution order</dont>
  <dont>Combine tasks from different stories into one batch</dont>
  <dont>Delegate entire story to @coder in one prompt — task by task only</dont>
</rules>
