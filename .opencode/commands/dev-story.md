---
description: Use when implementing a story using red-green-refactor TDD cycle. Finds next ready story or uses specified path
agent: dev
---

# /dev-story Command

Implement a story using red-green-refactor cycle with TODO tracking.

## Process

### Phase 1: Setup
1. Find or load story file
2. Load project context (CLAUDE.md, docs/prd.md, docs/architecture.md)
3. Use skill dev-story, test-design
3. **Create TODO list from story tasks** (for progress tracking)
4. Mark story as `in-progress`

### Phase 2: Implementation (for each task)
5. **Mark task as `in_progress` in TODO**
6. Delegate to @coder`s (call agents in one message or multi-agent-call if needed):
   - 🔴 RED: Write failing test
   - 🟢 GREEN: Implement minimal code to pass
   - 🔵 REFACTOR: Improve while keeping tests green
7. Verify @coder result (tests pass)
8. **Mark task as `completed` in TODO**
9. Mark task `[x]` in story file

### Phase 3: Finalization
10. Run full test suite
11. Update story file (File List, Change Log, Dev Agent Record)
12. **Clear TODO** (all tasks done)
13. Mark story as `review`

### Phase 4: Auto Review (configurable)
14. Check `config.yaml → development.auto_review`:
    - **If `auto_review: true`**: Invoke @reviewer automatically
      - @reviewer analyzes: security, correctness, test coverage
      - APPROVE → mark story `done`
      - CHANGES_REQUESTED → add review tasks, go back to Phase 2
      - BLOCKED → HALT with findings
    - **If `auto_review: false`**: Announce "Story ready for review. Run /review-story to complete."

## TODO Workflow

```
┌─────────────────────────────────────────────────┐
│  @dev reads story → creates TODO:               │
│  ┌─────────────────────────────────────────┐    │
│  │ [ ] Task 1: Create User entity          │    │
│  │ [ ] Task 2: Add repository              │    │
│  │ [ ] Task 3: Write integration tests     │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  For each task:                                 │
│  1. @dev marks [→] in_progress in TODO          │
│  2. @dev calls @coder with task details         │
│  3. @coder implements (no TODO access)          │
│  4. @dev verifies result                        │
│  5. @dev marks [✓] completed in TODO            │
│  6. @dev marks [x] in story file                │
└─────────────────────────────────────────────────┘
```

## IMPORTANT SKILLS TO LOAD

- `dev-story` - Implementation workflow (skills/dev-story/SKILL.md)
- `test-design` - Test writing patterns

## Output

- Implementation code
- Unit tests
- Integration tests
- Updated story file with:
  - Tasks marked `[x]`
  - File List
  - Change Log
  - Dev Agent Record

## HALT Conditions

The workflow will HALT and ask for input when:
- Additional dependencies need approval
- 3 consecutive implementation failures
- Required configuration is missing
- Ambiguous requirements need clarification

## Story Status Flow

```
ready-for-dev → in-progress -> @coder`s  → review → @reviewer → done
                                 ↑_____________________| (if changes requested)
```

## Next Steps After Completion

- **If `auto_review: true`**: Story automatically reviewed by @reviewer
  - Approved → `done`
  - Changes requested → fix and re-run
- **If `auto_review: false`**: Run `/review-story` manually
