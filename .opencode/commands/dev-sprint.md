---
description: Execute full sprint - implement all epics sequentially with auto-compaction between epics
agent: dev
---

# /dev-sprint Command

Implement an entire sprint by following the `dev-sprint` skill.

## Process

1.  **Load Skill**: Read and follow the instructions in `.opencode/skills/dev-sprint/SKILL.md`.
2.  **Initialize**: Create the sprint-level TODO list and update `sprint-status.yaml` as described in the skill.
3.  **Execute**: Enter the epic -> review -> compact -> loop until all epics in the TODO list are complete.
4.  **Finalize**: Run final sprint tests and report completion.

## IMPORTANT SKILLS TO LOAD

- `dev-sprint` - The primary algorithm for this command.
