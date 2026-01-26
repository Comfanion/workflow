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

Story task is specification with Approach steps. Transform it into executable instruction with full context.

### Step 1: Read Required Reading

Story has "Required Reading" and task has "Read First":
1. Open each linked document
2. Find the specific sections mentioned
3. Extract patterns, signatures, constraints

### Step 2: Find Existing Code

From "Read First" paths:
1. Read existing similar code (e.g., "existing service example")
2. Note the structure, imports, error handling
3. This becomes "Pattern Reference" for @coder

### Step 3: Build Context

@coder doesn't see story. Provide:
- **Existing files** - actual paths with what they contain
- **Patterns to follow** - link to existing similar code
- **What was done** - results of previous tasks this depends on
- **Imports** - what packages to use

### Step 4: Add Direction

Story has "Approach" with high-level steps. Expand with:
- Interface signatures (method names, params, return types)
- Error handling approach (what errors to return)
- Validation rules (what to validate)
- Constraints from documentation

### Step 5: Make Verification Concrete

Story has "Done when". Add:
- Specific test commands to run
- Files that must compile
- Test coverage expectations

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

### Pattern Reference
[Link to existing similar code to follow, NOT ready implementation]

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

## Implementation is @coder's Job

**DO NOT give ready code. Give direction.**

✅ **DO provide:**
- Links to existing code as pattern reference
- Interface signatures (method names, params, return types)
- Requirements (what logic to implement)
- Error handling approach
- Validation rules

❌ **DO NOT provide:**
- Full method implementations
- Ready-to-copy code blocks
- Complete structs with all logic

**@coder writes the implementation.** Give direction, not solution.

## Methodology

Include in task based on config.yaml:
- **TDD**: "Write failing test first, then implement"
- **STUB**: "Create stub first, write tests, then real implementation"
