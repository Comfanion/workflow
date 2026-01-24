# /dev-story Command

Implement a story using red-green-refactor cycle.

## Usage

```
/dev-story [story-path]
```

## Arguments

- `story-path` (optional): Path to specific story file. If not provided, finds next `ready-for-dev` story from sprint-status.yaml.

## Agent

This command invokes the **Dev** agent (Amelia).

## Process

1. Find or load story file
2. Load project context (CLAUDE.md, project-context.md)
3. Mark story as `in-progress`
4. For each task/subtask:
   - 🔴 RED: Write failing test
   - 🟢 GREEN: Implement minimal code to pass
   - 🔵 REFACTOR: Improve while keeping tests green
5. Mark task complete `[x]` only when tests pass
6. Update story file (File List, Change Log, Dev Agent Record)
7. Mark story as `review` when all tasks complete

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
