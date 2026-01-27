---
description: Execute full epic - implement all stories sequentially with auto-compaction between stories
agent: dev
---

# /dev-epic Command

Implement an entire epic by following the `dev-epic` skill.

## Process

1.  **Load Skill**: Read and follow the instructions in `.opencode/skills/dev-epic/SKILL.md`.
2.  **Initialize**: Create the epic-level TODO list and the epic state file as described in the skill.
3.  **Execute**: Enter the story -> review -> compact -> loop until all stories in the TODO list are complete.
4.  **Finalize**: Run final tests and report completion.

## IMPORTANT SKILLS TO LOAD

- `dev-epic` - The primary algorithm for this command.
