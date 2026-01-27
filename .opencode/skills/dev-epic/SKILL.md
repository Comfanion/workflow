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
    <step n="1">Parse epic file → extract story list</step>
    <step n="2">Create epic state: docs/sprint-artifacts/sprint-N/.sprint-state/epic-XX-state.yaml</step>
    <step n="3">Create TODO list with IDs — stories, their tasks, and reviews:
      ```
      [ ] E{N}-S01: {story title}
        [ ] S01 T1: {task title}
        [ ] S01 T2: {task title}
        [ ] S01 Review: run tests, verify AC
      [ ] E{N}-S02: {story title}
        [ ] S02 T1: {task title}
        [ ] S02 T2: {task title}
        [ ] S02 Review: run tests, verify AC
      ...
      [ ] E{N} Integration tests
      [ ] E{N} Verify epic AC
      ```
    </step>
    <example>
      ```
      [ ] E04-S01: Merge Domain Logic
        [ ] S01 T1: MergeResult value object
        [ ] S01 T2: Merge service — primary selection
        [ ] S01 T3: Unit tests
        [ ] S01 Review: run tests, verify AC
      [ ] E04-S02: Auto Merge on Link
        [ ] S02 T1: Event handler for link
        [ ] S02 T2: Best-effort merge logic
        [ ] S02 T3: Integration tests
        [ ] S02 Review: run tests, verify AC
      [ ] E04 Integration tests
      [ ] E04 Verify epic AC
      ```
    </example>
    <step n="4">Set state: status="in-progress", next_action="Execute [first-story.md]"</step>
    <step n="5">Mark first story as in_progress in TODO</step>
  </phase>

  <phase name="3-loop" title="Story Execution Loop">
    <for-each item="story" in="pending_stories">
      
      <action name="execute-story">
        Follow /dev-story logic:
        - Create nested TODO for tasks
        - Implement all tasks (RED/GREEN/REFACTOR)
        - Clear task TODO when done
      </action>
      
      <action name="mark-done">
        Mark story as completed in epic TODO
      </action>
      
      <action name="review">
        Mark "Review Story" as in_progress
        Invoke @reviewer
        <if condition="CHANGES_REQUESTED">
          Add fix tasks → re-execute → re-review (max 3 attempts)
        </if>
        <if condition="APPROVED">
          Mark "Review Story" as completed
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
        Wait for auto-compaction
        Plugin reads TODO + state → resume
      </action>
      
    </for-each>
  </phase>

  <phase name="4-finalize" title="Finalize Epic">
    <step n="1">Run epic integration tests (mark in TODO)</step>
    <step n="2">Verify all AC from epic file (mark in TODO)</step>
    <step n="3">Set state: status="done"</step>
    <step n="4">Clear epic TODO list</step>
    <step n="5">Update .opencode/session-state.yaml (next epic or done)</step>
    <step n="6">Report completion with summary</step>
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
  <dont>Ask user for confirmation between stories — TODO is your guide</dont>
  <dont>Proceed to next story if review fails — enter fix loop</dont>
</rules>
