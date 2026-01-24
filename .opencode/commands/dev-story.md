# /dev-story Command

Implement a story using red-green-refactor cycle with TODO tracking.

## Usage

```
/dev-story [story-path]
```

## Arguments

- `story-path` (optional): Path to specific story file. If not provided, finds next `ready-for-dev` story from sprint-status.yaml.

## Agent

This command invokes the **Dev** agent (Amelia).

## Process

### Phase 1: Setup
1. Find or load story file
2. Load project context (CLAUDE.md, project-context.md)
3. **Create TODO list from story tasks** (for progress tracking)
4. Mark story as `in-progress`

### Phase 2: Implementation (for each task)
5. **Mark task as `in_progress` in TODO**
6. Delegate to @coder:
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

## Skills Loaded

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

## Example

```bash
# Find next ready story automatically
/dev-story

# Implement specific story
/dev-story docs/sprint-artifacts/sprint-1/stories/1-1-user-auth.md
```

## Story Status Flow

```
ready-for-dev → in-progress → review → done
```

## Next Steps After Completion

1. `/code-review` - Review the implementation
2. If approved, mark story as `done`
3. Continue with next story
