---
name: dev-story
description: Execute a story by implementing tasks/subtasks using TDD, validating, and updating story file
license: MIT
compatibility: opencode
metadata:
  domain: development
  agents: [dev]
  artifacts: story files
---

# Dev Story Skill

Execute a story by implementing tasks/subtasks, writing tests, validating, and updating the story file per acceptance criteria.

## Critical Rules

- **Story File is the single source of truth** - tasks sequence is authoritative
- **Respect task dependencies** - never start blocked tasks
- **Methodology from config.yaml** - TDD or STUB approach
- **Tests are MANDATORY validation** - each task has tests that MUST pass
- **Continue until COMPLETE** - do not stop for "milestones"
- **NEVER lie about tests** - tests must actually exist and pass
- **For parallel execution** - call multiple @coder in one message (they run concurrently)

## Methodology Selection

Read from `config.yaml → development.methodology`:

| Methodology | Flow | Validation |
|-------------|------|------------|
| **TDD** | Interface → Test (RED) → Impl (GREEN) → Refactor | Test must FAIL first, then PASS |
| **STUB** | Interface → Stub → Test → Real Impl | Test against stub, then real |

## Workflow Steps

### Step 1: Find and Load Story

```xml
<step n="1" goal="Find next ready story and load it">

  <!-- MODE 1: Jira link provided -->
  <check if="jira_link is provided">
    <action>Extract Jira key from link</action>
    <action>Load jira-cache.yaml</action>
    <action>Lookup story by Jira key</action>
    <check if="found in cache">
      <action>Get local_doc path from cache</action>
      <action>Get branch name from cache</action>
      <output>
        📋 Jira: {{jira_key}} - {{summary}}
        📄 Local: {{local_doc}}
        🌿 Branch: {{branch}}
      </output>
    </check>
    <check if="not in cache">
      <action>Fetch from Jira API</action>
      <action>Find matching local doc by summary</action>
      <ask>Link {{jira_key}} to which local doc?</ask>
    </check>
    <goto anchor="parse_story" />
  </check>

  <!-- MODE 2: Local path provided -->
  <check if="story_path is provided">
    <action>Use story_path directly</action>
    <action>Check jira-cache.yaml for Jira link</action>
    <check if="jira linked">
      <output>📋 Jira: {{jira_key}} linked</output>
    </check>
    <goto anchor="parse_story" />
  </check>

  <!-- MODE 3: Auto-find next story -->
  <check if="no input provided">
    <action>Load jira-cache.yaml</action>
    <check if="jira.control_development enabled">
      <action>Find stories with status = "planned" or "in_progress"</action>
      <output>
        📋 Ready for development:
        
        | # | Jira | Story | Status | Branch |
        |---|------|-------|--------|--------|
        | 1 | PROJ-S01 | Product Aggregate | planned | - |
        | 2 | PROJ-S02 | Product Repository | in_progress | feature/... |
      </output>
      <ask>Which story to work on? (number or Jira key)</ask>
    </check>
    <check else="no jira control">
      <action>Load sprint-status.yaml</action>
      <action>Find FIRST story with status = "ready-for-dev"</action>
    </check>
  </check>

  <anchor id="parse_story" />
  <action>Read COMPLETE story file</action>
  <action>Parse sections: Story, AC, Tasks, Dev Notes, Jira Metadata</action>
  <action>Identify first incomplete task</action>
  <action if="no incomplete tasks">COMPLETE - goto Step 7</action>
</step>
```

### Step 1b: Jira Setup (if control_development)

```xml
<step n="1b" goal="Setup Jira task and branch">
  <check if="jira.control_development enabled AND story has jira_key">
    
    <!-- Transition to In Progress -->
    <check if="jira status != in_progress">
      <action>Transition Jira issue to "In Progress"</action>
      <action>Update cache</action>
      <output>📋 Jira {{jira_key}} → In Progress</output>
    </check>
    
    <!-- Create/checkout branch -->
    <check if="branch not exists">
      <action>Generate branch name from config pattern</action>
      <action>Create branch from epic branch or main</action>
      <action>Link branch to Jira issue</action>
      <action>Update cache</action>
      <output>🌿 Branch created: {{branch}}</output>
    </check>
    <check if="branch exists">
      <action>Checkout existing branch</action>
      <output>🌿 Switched to: {{branch}}</output>
    </check>
    
    <!-- Store task context -->
    <action>Store in session: jira_key, branch, transitions</action>
  </check>
</step>
```

### Step 2: Load Context

```xml
<step n="2" goal="Load project context and story information">
  <action>Load project-context.md if exists</action>
  <action>Load CLAUDE.md for coding standards</action>
  <action>Extract developer guidance from Dev Notes section</action>
  <action>Note architecture requirements and technical specifications</action>
  
  <output>✅ **Context Loaded**
    - Story: {{story_title}}
    - First task: {{first_incomplete_task}}
    - Architecture guidance available: {{has_architecture}}
    - Coding standards loaded: {{has_claude_md}}
  </output>
</step>
```

### Step 3: Mark Story In-Progress

```xml
<step n="3" goal="Mark story in-progress">
  <check if="sprint_status file exists">
    <action>Update story status to "in-progress"</action>
    <output>🚀 Starting work on story {{story_key}}</output>
  </check>
  
  <action>Update Status section in story file to "in-progress"</action>
</step>
```

### Step 4: Implement Task (Respect Dependencies)

```xml
<step n="4" goal="Implement task following red-green-refactor cycle, respecting dependencies">
  <critical>RESPECT TASK DEPENDENCIES - never start a task if dependencies are incomplete</critical>

  <!-- DEPENDENCY CHECK -->
  <phase name="DEPENDENCY_CHECK">
    <action>Parse task summary table from story file</action>
    <action>Read "Depends On" column for current task</action>
    <check if="dependencies exist AND any dependency not marked ✅">
      <action>SKIP this task</action>
      <action>Find next task with all dependencies satisfied</action>
      <output>⏸️ Task {{task_id}} blocked by incomplete dependencies: {{blocking_tasks}}</output>
    </check>
    <check if="all dependencies complete OR no dependencies">
      <action>Proceed with task implementation</action>
      <output>✅ Task {{task_id}} dependencies satisfied, starting implementation</output>
    </check>
  </phase>

  <!-- PARALLEL OPPORTUNITY CHECK -->
  <phase name="PARALLEL_CHECK">
    <action>Identify other tasks with same satisfied dependencies</action>
    <check if="parallel tasks exist">
      <output>💡 **Parallel Opportunity:** Tasks {{parallel_tasks}} can be done together</output>
      <action>Call multiple @coder in ONE message to run them concurrently</action>
    </check>
  </phase>

  <!-- LOAD METHODOLOGY FROM CONFIG -->
  <phase name="METHODOLOGY">
    <action>Read config.yaml → development.methodology</action>
    <output>📋 Methodology: {{methodology}} (TDD | STUB)</output>
  </phase>

  <!-- TDD METHODOLOGY -->
  <check if="methodology is TDD">
    <phase name="TDD-1-INTERFACE">
      <action>Define interface/contract if task requires</action>
      <action>Ensure interface compiles</action>
    </phase>
    
    <phase name="TDD-2-RED">
      <action>Write test for task deliverables</action>
      <action>Run test - MUST FAIL (RED)</action>
      <check if="test passes">
        <halt>ERROR: Test should fail! Implementation exists before test.</halt>
      </check>
      <output>🔴 RED: Test failing as expected</output>
    </phase>

    <phase name="TDD-3-GREEN">
      <action>Implement MINIMAL code to pass test</action>
      <action>Run test - MUST PASS (GREEN)</action>
      <check if="test fails">
        <action>Fix implementation until test passes</action>
      </check>
      <output>🟢 GREEN: Test passing</output>
    </phase>

    <phase name="TDD-4-REFACTOR">
      <action>Refactor code (improve structure)</action>
      <action>Run test - MUST STILL PASS</action>
      <output>🔵 REFACTOR: Clean code, tests green</output>
    </phase>
  </check>

  <!-- STUB METHODOLOGY -->
  <check if="methodology is STUB">
    <phase name="STUB-1-INTERFACE">
      <action>Define interface/contract</action>
      <action>Ensure interface compiles</action>
    </phase>

    <phase name="STUB-2-STUB">
      <action>Write stub implementation (mock data)</action>
      <action>Stub returns expected data shapes</action>
      <output>🧪 STUB: Mock implementation ready</output>
    </phase>

    <phase name="STUB-3-TEST">
      <action>Write tests against stub</action>
      <action>Run test - MUST PASS with stub</action>
      <output>✅ Tests pass with stub</output>
    </phase>

    <phase name="STUB-4-REAL">
      <action>Replace stub with real implementation</action>
      <action>Run test - MUST STILL PASS</action>
      <check if="test fails">
        <action>Fix real implementation until test passes</action>
      </check>
      <output>🟢 REAL: Tests pass with real implementation</output>
    </phase>
  </check>

  <!-- TASK VALIDATION (MANDATORY FOR ALL TASKS) -->
  <phase name="TASK_VALIDATION" critical="MANDATORY">
    <action>Locate "Validation Test" section in task</action>
    <check if="validation test defined">
      <action>Run ALL validation tests listed</action>
      <check if="any test fails">
        <halt>❌ TASK FAILED: Validation tests not passing</halt>
      </check>
      <output>✅ All validation tests pass</output>
    </check>
    <check if="no validation test">
      <halt>❌ ERROR: Task missing validation test</halt>
    </check>
  </phase>

  <!-- TODO PLACEHOLDERS FOR FUTURE WORK -->
  <phase name="TODO_PLACEHOLDERS">
    <action>Check config.yaml → development.todo.enabled</action>
    <check if="todo enabled">
      <action>Review "TODO Placeholders" section in story</action>
      <action>Review "Related Future Work" table</action>
      
      <!-- Add TODOs for next tasks -->
      <check if="current task has dependent tasks (Blocks: T{n})">
        <action>Add TODO comment at integration point</action>
        <example>
          // TODO(TASK:T{n}): {description from next task}
          //   Implement in next task, current code provides interface
          //   See: story file #T{n}
        </example>
      </check>

      <!-- Add TODOs for future stories -->
      <check if="story references future stories">
        <action>Add TODO comment where future story will extend</action>
        <example>
          // TODO(STORY:{MODULE}-S{epic}-{nn}): {description}
          //   Current implementation is basic, enhanced in {story-id}
          //   See: docs/sprint-artifacts/.../story-{id}.md
        </example>
      </check>

      <!-- Add TODOs for future epics -->
      <check if="story references future epics">
        <action>Add TODO comment for architectural evolution</action>
        <example>
          // TODO(EPIC:{MODULE}-E{nn}): {description}
          //   Current sync approach, will be async in {epic-id}
          //   See: docs/sprint-artifacts/.../epic-{id}.md
        </example>
      </check>

      <!-- Add TODOs for technical debt -->
      <check if="implementation has known limitations">
        <action>Add TODO comment for tech debt</action>
        <example>
          // TODO(TECH_DEBT): {description}
          //   Known limitation: {what}
          //   Improvement: {how}
        </example>
      </check>

      <!-- Add TODOs for backlog items -->
      <check if="implementation could be improved but not planned">
        <action>Add TODO comment for backlog</action>
        <example>
          // TODO(BACKLOG): {description}
          //   Nice to have: {improvement idea}
        </example>
      </check>

      <!-- Add FIXME for known bugs -->
      <check if="known bug or issue discovered">
        <action>Add FIXME comment</action>
        <example>
          // FIXME(BUG:{ticket-id}): {description}
          //   Ticket: {url}
        </example>
      </check>

      <!-- Add HACK for temporary workarounds -->
      <check if="temporary workaround implemented">
        <action>Add HACK comment</action>
        <example>
          // HACK: {description}
          //   Temporary until: {condition}
          //   Remove when: {story/epic id}
        </example>
      </check>

      <output>📝 TODO placeholders added for future work</output>
    </check>
  </phase>

  <halt-conditions>
    <halt if="task dependencies not satisfied">Cannot start - dependencies incomplete</halt>
    <halt if="new dependencies required beyond story specs">Additional dependencies need user approval</halt>
    <halt if="3 consecutive implementation failures">Request guidance</halt>
    <halt if="required configuration missing">Cannot proceed without necessary configuration</halt>
  </halt-conditions>

  <critical>NEVER implement anything not mapped to a specific task</critical>
  <critical>NEVER skip dependency checks</critical>
</step>
```

### Step 4b: Update Task Status

```xml
<step n="4b" goal="Update task status in summary table">
  <action>Find task row in summary table</action>
  <action>Update Status column: ⬜ → 🔄 (when starting) → ✅ (when complete)</action>
  
  <output>
    | ID | Task | Est | Depends On | Status |
    |----|------|-----|------------|--------|
    | T1 | ... | 5h | - | ✅ |
    | T2 | ... | 6h | T1 | 🔄 | ← Current
    | T3 | ... | 5h | T1 | ⬜ | ← Can run parallel with T2
  </output>
</step>
```

### Step 5: Run Validations

```xml
<step n="5" goal="Run validations and tests">
  <action>Determine test framework from project structure</action>
  <action>Run all existing tests to ensure no regressions</action>
  <action>Run new tests to verify implementation</action>
  <action>Run linting and code quality checks if configured</action>
  <action>Validate implementation meets story acceptance criteria</action>

  <check if="regression tests fail">
    <action>STOP and fix before continuing</action>
    <action>Identify breaking changes</action>
  </check>

  <check if="new tests fail">
    <action>STOP and fix before continuing</action>
    <action>Ensure implementation correctness</action>
  </check>
</step>
```

### Step 6: Mark Task Complete

```xml
<step n="6" goal="Validate and mark task complete ONLY when fully done">
  <critical>NEVER mark a task complete unless ALL conditions are met</critical>

  <!-- VALIDATION GATES -->
  <validation>
    <check>Verify ALL tests for this task ACTUALLY EXIST and PASS 100%</check>
    <check>Confirm implementation matches EXACTLY what task specifies</check>
    <check>Validate related acceptance criteria are satisfied</check>
    <check>Run full test suite - NO regressions</check>
  </validation>

  <check if="ALL validation gates pass">
    <action>Mark task checkbox with [x]</action>
    <action>Update File List with all new/modified/deleted files</action>
    <action>Add completion notes to Dev Agent Record</action>
    <action>Add entry to Change Log</action>
    <action>Save story file</action>
  </check>

  <check if="ANY validation fails">
    <action>DO NOT mark task complete</action>
    <action>Fix issues first</action>
    <action>HALT if unable to fix</action>
  </check>

  <check if="more tasks remain">
    <goto step="4">Next task</goto>
  </check>

  <check if="no tasks remain">
    <goto step="7">Completion</goto>
  </check>
</step>
```

### Step 7: Story Completion (Session End)

```xml
<step n="7" goal="Story completion and mark for review">
  <action>Verify ALL tasks marked ✅</action>
  <action>Run full regression suite</action>
  <action>Confirm File List includes every changed file</action>
  
  <!-- SESSION END: Update changelogs with summary -->
  <phase name="SESSION_END_CHANGELOG" critical="MANDATORY">
    <note>Update changelog ONCE at session end, summarizing all work</note>
    
    <!-- Story changelog: one summary entry -->
    <action>Add ONE entry to story Changelog summarizing session work</action>
    <example>
      | 2.0 | {{date}} | @dev | Complete: T1-T7 done; All tests pass; Files: 12 created, 3 modified |
    </example>
    
    <!-- Repo CHANGELOG.md: grouped entries -->
    <action>Update repository CHANGELOG.md [Unreleased] section</action>
    <action>Group all story changes by category</action>
    <example>
      ### Added
      - Add product catalog API with CRUD operations (CATALOG-S05-03)
      - Add product validation with custom rules (CATALOG-S05-03)
      
      ### Changed  
      - Change price precision from float to decimal (CATALOG-S05-03)
    </example>
  </phase>
  
  <!-- Definition of Done -->
  <validation name="definition-of-done">
    <check>All tasks/subtasks marked complete [x]</check>
    <check>Implementation satisfies every Acceptance Criterion</check>
    <check>Unit tests for core functionality added/updated</check>
    <check>Integration tests added when required</check>
    <check>All tests pass (no regressions)</check>
    <check>Code quality checks pass</check>
    <check>File List complete</check>
    <check>Dev Agent Record has implementation notes</check>
    <check>Change Log has summary</check>
  </validation>

  <action>Update story Status to "review"</action>
  
  <check if="sprint_status file exists">
    <action>Update story status to "review" in sprint-status.yaml</action>
  </check>

  <output>✅ **Story Complete - Ready for Review**
    
    Story: {{story_key}}
    Status: review
    
    **Summary:**
    - Tasks completed: {{completed_tasks_count}}
    - Tests added: {{new_tests_count}}
    - Files changed: {{changed_files_count}}
  </output>
  
  <!-- AUTO-INVOKE: @reviewer for code review -->
  <goto step="8">Automatic code review</goto>
</step>
```

### Step 8: Auto Review (configurable via config.yaml)

```xml
<step n="8" goal="Auto review based on config.yaml setting">
  <action>Read config.yaml → development.auto_review</action>
  
  <!-- AUTO REVIEW ENABLED -->
  <check if="auto_review: true">
    <critical>Invoke @reviewer for automatic code review</critical>
    
    <action>Invoke @reviewer agent with story path</action>
    <action>@reviewer uses GPT-5.2 Codex for deep analysis</action>
    
    <invoke agent="reviewer">
      <param name="story_path">{{story_path}}</param>
      <param name="files_changed">{{file_list}}</param>
      <param name="focus">security, correctness, test coverage</param>
    </invoke>
    
    <check if="reviewer verdict = APPROVE">
      <action>Mark story status as "done"</action>
      <output>✅ Code review passed! Story complete.</output>
    </check>
    
    <check if="reviewer verdict = CHANGES_REQUESTED">
      <action>Create follow-up tasks from review findings</action>
      <action>Add tasks to story file</action>
      <output>
        🔄 **Code Review: Changes Requested**
        
        Review found {{issues_count}} issues to fix.
        New tasks added to story.
        
        Run dev-story again to fix issues.
      </output>
      <goto step="4">Fix review issues</goto>
    </check>
    
    <check if="reviewer verdict = BLOCKED">
      <action>Mark story status as "blocked"</action>
      <output>
        ❌ **Code Review: Blocked**
        
        Critical issues found. See review for details.
        Cannot proceed until blocking issues resolved.
      </output>
      <halt reason="Blocked by code review"/>
    </check>
  </check>
  
  <!-- AUTO REVIEW DISABLED -->
  <check if="auto_review: false OR not set">
    <output>
      ✅ **Story Ready for Review**
      
      Story: {{story_key}}
      Status: review
      
      Run `/review-story` to complete code review.
    </output>
  </check>
</step>
```

## Story File Sections Updated

| Section | When Updated |
|---------|--------------|
| Tasks/Subtasks `[ ]` → `[x]` | After each task completion |
| Dev Agent Record | Implementation notes, debug log |
| File List | All new/modified/deleted files |
| Change Log | Summary of changes with date |
| Status | draft → in-progress → review → done |

## HALT Conditions

- Additional dependencies need user approval
- 3 consecutive implementation failures
- Required configuration is missing
- Ambiguous requirements need clarification
- Cannot access story file

## Definition of Done Checklist

- [ ] All tasks/subtasks marked complete
- [ ] Implementation satisfies every AC
- [ ] Security checklist passed
- [ ] Unit tests added for core functionality
- [ ] Integration tests added when required
- [ ] All tests pass (no regressions)
- [ ] Code quality checks pass
- [ ] File List includes all changes
- [ ] Dev Agent Record complete
- [ ] Change Log updated
- [ ] **@reviewer approved** (if `auto_review: true`) OR status = `review` (if `auto_review: false`)
- [ ] Status set to "done" (after review)
