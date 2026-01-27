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
    <step n="2">Create master TODO list:
      ```
      [ ] Epic 1: [Title]
      [ ] Story 1-1: [Title]
      [ ] Review Story 1-1
      [ ] Story 1-2: [Title]
      [ ] Review Story 1-2
      [ ] Review Epic 1
      [ ] Epic 2: [Title]
      [ ] Story 2-1: [Title]
      ...
      [ ] Sprint integration tests
      ```
    </step>
    <step n="3">Set sprint status="in-progress" in sprint-status.yaml</step>
    <step n="4">Mark first epic as in_progress in TODO</step>
  </phase>

  <phase name="3-loop" title="Epic Execution Loop">
    <for-each item="epic" in="pending_epics">
      
      <action name="execute-epic">
        Follow dev-epic skill logic:
        - Creates nested TODO for stories
        - Executes all stories + reviews
        - Clears epic TODO when done
      </action>
      
      <action name="mark-done">
        Mark epic as completed in sprint TODO
      </action>
      
      <action name="epic-review">
        Mark "Review Epic" as in_progress
        Run epic integration tests
        Mark "Review Epic" as completed
      </action>
      
      <action name="update-state">
        Edit sprint-status.yaml:
        - Set completed epic status="done"
        - Set next epic status="in-progress"
      </action>
      
      <action name="compact">
        Mark next epic as in_progress in TODO
        Wait for auto-compaction
        Plugin reads sprint TODO → resume
      </action>
      
    </for-each>
  </phase>

  <phase name="4-finalize" title="Finalize Sprint">
    <step n="1">Run sprint integration tests (mark in TODO)</step>
    <step n="2">Set sprint status="done" in sprint-status.yaml</step>
    <step n="3">Clear sprint TODO list</step>
    <step n="4">Report completion with summary + metrics</step>
  </phase>

</workflow>

<outputs>
  - Implementation code for all stories in sprint
  - Updated sprint-status.yaml
  - Clean TODO list (all completed)
</outputs>

<rules>
  <do>Create ONE master TODO list for entire sprint at start</do>
  <do>Let dev-epic skill manage its own nested TODO</do>
  <dont>Ask for confirmation between epics — sprint TODO is your guide</dont>
  <dont>Proceed to next epic if epic review fails — HALT and report</dont>
</rules>
