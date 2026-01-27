---
name: dev-epic
description: Use when executing a full epic, including all stories, reviews, and tests, with auto-compaction.
metadata:
  domain: development
  agents: [dev]
  artifacts: epic state file, story files
---

# Dev Epic Skill

<workflow name="dev-epic">

  <phase name="1-context" title="Load Minimal Context">
    <read>
      <file>CLAUDE.md</file>
      <file>docs/coding-standards/README.md</file>
      <file>docs/coding-standards/patterns.md</file>
      <file>{epic-file}</file>
      <file>{current-story-file}</file>
    </read>
    <skip reason="too large, epic/story has context">
      <file>docs/prd.md</file>
      <file>docs/architecture.md</file>
      <file>all stories at once</file>
    </skip>
    <goal>~70KB per story</goal>
  </phase>

  <phase name="2-init" title="Initialize Epic">
    <step n="1">Parse epic file → extract story list</step>
    <step n="2">Create epic state: docs/sprint-artifacts/sprint-N/.sprint-state/epic-XX-state.yaml</step>
    <step n="3">Create TODO list:
      ```
      [ ] Story 1: [Title]
      [ ] Review Story 1
      [ ] Story 2: [Title]
      [ ] Review Story 2
      ...
      [ ] Epic integration tests
      [ ] Verify epic AC
      ```
    </step>
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
    <step n="5">Report completion with summary</step>
  </phase>

</workflow>

<outputs>
  - Implementation code for all stories
  - Updated epic-XX-state.yaml
  - Clean TODO list (all completed)
</outputs>

<rules>
  <do>Create clean TODO list for each epic</do>
  <do>Update epic state file BEFORE compaction</do>
  <dont>Ask user for confirmation between stories — TODO is your guide</dont>
  <dont>Proceed to next story if review fails — enter fix loop</dont>
</rules>
