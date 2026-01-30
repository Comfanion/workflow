---
description: Use when implementing a story using red-green-refactor TDD cycle. Finds next ready story or uses specified path
agent: dev
---

# /dev-story Command

Implement a story using red-green-refactor cycle with TODO tracking.

## Process

1. **Load Skill**: Read and follow `.opencode/skills/dev-story/SKILL.md`
2. **Setup**: Find story file, create TODO from tasks, mark story `in-progress`
3. **Execute**: Delegate tasks to @coder one by one (or parallel if independent), verify each result
4. **Finalize**: Run full test suite, update story file, mark story `review`
5. **Review**: If `config.yaml → development.auto_review: true` — invoke @reviewer automatically

## IMPORTANT SKILLS TO LOAD

- `dev-story` - The primary algorithm for this command
- `test-design` - Test writing patterns
