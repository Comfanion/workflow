---
name: dev-story
description: Use when implementing a story with tasks/subtasks using TDD red-green-refactor cycle
license: MIT
compatibility: opencode
metadata:
  domain: development
  agents: [dev]
  artifacts: story files
---

# Dev Story Skill

How to transform story tasks into executable instructions for @coder.

## Task Transformation

Story task is a specification. @coder needs executable instruction with full context.

### Add Context

@coder doesn't see the full story. Include:
- **Existing files** - actual paths to domain entities, interfaces, services that exist
- **Patterns to follow** - link to existing similar code ("follow pattern from X")
- **What was done** - results of previous tasks that this task depends on
- **Imports** - what packages to use

### Add Implementation Details

Story has Code Sketch. Expand it:
- Actual method signatures with types
- Error handling approach
- Logging requirements
- Validation rules

### Add Verification

Story has "Done when". Make it concrete:
- Specific test commands to run
- Expected output format
- Files that must compile

## Formulating Task for @coder

Structure:
```
## Task: [Name] (Task IDs)

[One line goal]

### Skills
- Use `doc-todo` for TODO comments

### Context
- [Existing file]: [What it contains, what to use from it]
- [Another file]: [Description]
- Existing pattern: [Path to similar code to follow]

### Output Files
- [Path to create/modify]

### Requirements
[Numbered list of what to implement with signatures/details]

### Implementation Pattern
[Code example or reference to existing code]

### Error Handling
[How to handle errors]

### Done When
- [ ] [Specific checkable item]
- [ ] [Another item]
- [ ] File compiles
- [ ] Tests pass
```

## Parallel Tasks

When delegating multiple tasks in one message:
1. Each task gets full context (don't assume @coder remembers)
2. Clearly separate tasks with headers
3. No shared state between parallel tasks
4. Tasks must work on different files

## Task Boundaries

**Good task:**
- Logically complete unit (service, handler, entity, feature)
- Clear single responsibility
- Can be tested independently

**Consider splitting when:**
- Multiple unrelated responsibilities
- No logical connection between parts

**Consider combining when:**
- Tasks too granular to be meaningful
- Same file, same concern

## Common Patterns

### New Service
Context: domain entities, repository interface, existing service example
Requirements: interface, constructor, methods
Pattern: existing service structure

### New Handler
Context: service interface, DTOs, existing handler example
Requirements: handler struct, methods, error mapping
Pattern: existing handler structure

### New Tests
Context: code to test, existing test examples
Requirements: test scenarios, mocks
Pattern: existing test structure

## Methodology

Include in task based on config.yaml:
- **TDD**: "Write failing test first, then implement"
- **STUB**: "Create stub first, write tests, then real implementation"
