---
description: Use when creating or updating coding standards documentation. Creates modular files for patterns, testing, API conventions
agent: architect
---

# Coding Standards Creation

## Arguments
$ARGUMENTS

- "create" or empty: Create new standards from scratch
- "edit": Edit existing standards
- "add [topic]": Add new standards file for specific topic
- "validate": Check standards completeness

## Prerequisites

Check existing standards:
!`ls -la docs/coding-standards/ 2>/dev/null || echo "No standards yet"`

Check tech stack (if code exists):
!`ls -la src/ 2>/dev/null | head -5 || echo "No src directory"`

## Input Context

Load if exists:
- @docs/requirements/requirements.md (for NFRs)
- @docs/prd.md (for tech decisions)
- @AGENTS.md (current rules)

## Your Task

### Create Mode

1. **Discover tech stack**:
   - Ask user about languages (Go, TypeScript, Python, etc.)
   - Ask about frameworks
   - Ask about infrastructure (DB, queues, etc.)

2. **Create modular documentation** in `docs/coding-standards/`:
   - **README.md** - Index and critical rules
   - **project-structure.md** - Directory layout
   - **[language]-standards.md** - Per language (go-standards.md, etc.)
   - **architecture-patterns.md** - Required patterns
   - **testing-standards.md** - Test requirements
   - **api-standards.md** - API conventions (if applicable)
   - **database-standards.md** - DB standards (if applicable)
   - **security-standards.md** - Security rules
   - **libraries.md** - Approved/forbidden deps
   - **git-workflow.md** - Git conventions

3. **Each file MUST be < 2000 lines**

4. **Generate linter configs**:
   - `.golangci.yml` for Go
   - `.eslintrc.js` for TypeScript/JavaScript
   - `.editorconfig` for all

### Edit Mode

1. Ask which file to edit
2. Load and review current content
3. Make targeted updates
4. Ensure consistency across files

### Add Topic Mode

1. Determine appropriate file name
2. Create new standards file
3. Update README.md index

## Output Structure

```
docs/coding-standards/
├── README.md                    # Index (<500 lines)
├── project-structure.md         
├── go-standards.md              # (or other language)
├── architecture-patterns.md     
├── testing-standards.md         
├── api-standards.md             
├── database-standards.md        
├── security-standards.md        
├── libraries.md                 
└── git-workflow.md              
```

## Validation

After creating, verify:
- [ ] README.md exists with complete index
- [ ] All files < 2000 lines: `wc -l docs/coding-standards/*.md`
- [ ] Each language has standards file
- [ ] No contradictions between files
- [ ] Examples provided for complex rules

## After Completion

Suggest:
- Update AGENTS.md with critical rules
- Run `/validate coding-standards`
- Continue with `/prd` if not done
