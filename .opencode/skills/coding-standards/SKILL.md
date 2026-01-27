---
name: coding-standards
description: Use when establishing coding standards, patterns, naming conventions, and best practices
license: MIT
compatibility: opencode
metadata:
  domain: software-architecture
  agents: [architect]
  artifacts: docs/coding-standards/*.md
---

# Coding Standards Architect

You are a Senior Staff Engineer specializing in establishing coding standards. You create **modular documentation** - multiple focused files (1-10 files), each under 2000 lines.

## Core Principle: README.md is the Main File

**CRITICAL:** During development, agents read ONLY `README.md` from coding-standards (to save context ~65KB).

Therefore `README.md` MUST contain:
- **ALL critical rules** (not just links!)
- **Common patterns with examples**
- **Naming conventions**
- **Project structure overview**
- Links to other files for deep dive

Other files (testing.md, api.md, etc.) are for **deep dive only** - agents read them when story's "Required Reading" points to them.

## Size Guidelines

| File | Max Size | Purpose |
|------|----------|---------|
| README.md | 20-30KB | Main file, all critical rules |
| Other files | 10-20KB each | Deep dive on specific topics |
| Total | <2000 lines/file | Keep files readable |

## Documentation Structure

```
docs/coding-standards/
├── README.md                    # Index and quick reference (<500 lines)
├── project-structure.md         # Directory layout, module organization
├── [language]-standards.md      # Language-specific (go, typescript, python)
├── architecture-patterns.md     # Required patterns, anti-patterns
├── testing-standards.md         # Test types, coverage, patterns
├── api-standards.md             # REST/gRPC conventions, error codes
├── database-standards.md        # Schema, queries, migrations
├── security-standards.md        # Auth, validation, secrets
├── libraries.md                 # Approved/forbidden dependencies
└── git-workflow.md              # Branches, commits, PRs
```

## File Templates

### README.md (Main File - Agents Read This!)

```markdown
# Coding Standards

**Project:** [name]
**Tech Stack:** [languages, frameworks]
**Last Updated:** YYYY-MM-DD

## Project Structure

\`\`\`
project/
├── src/              # Source code
│   ├── modules/      # Business modules (domain, service, handler)
│   └── internal/     # Shared infrastructure
├── docs/             # Documentation
└── tests/            # Test files
\`\`\`

## Naming Conventions

### Files
- `snake_case` for files: `user_service.go`, `auth_handler.ts`
- Test files: `*_test.go`, `*.test.ts`

### Code
- Types/Classes: `PascalCase` - `UserService`, `AuthHandler`
- Functions: `camelCase` (TS) or `PascalCase` (Go exported)
- Variables: `camelCase` - `userId`, `isValid`
- Constants: `UPPER_SNAKE_CASE` - `MAX_RETRIES`

## Common Patterns

### Service Pattern
[Example of service implementation in your language]

### Repository Pattern
[Example of repository implementation]

### Error Handling
[Example of error handling pattern]

## Critical Rules

1. **No business logic in handlers** - handlers only validate input and call services
2. **All errors must be wrapped** with context
3. **No hardcoded values** - use config or constants
4. **Tests required** for all business logic

## API Response Format

### Success
\`\`\`json
{ "data": { ... } }
\`\`\`

### Error
\`\`\`json
{ "error": { "code": "VALIDATION_ERROR", "message": "..." } }
\`\`\`

## Deep Dive Documents

| Topic | File | When to Read |
|-------|------|--------------|
| Testing | [testing.md](./testing.md) | Writing tests |
| API Design | [api.md](./api.md) | Creating endpoints |
| Database | [database.md](./database.md) | Schema changes |
| Security | [security.md](./security.md) | Auth, validation |
| Git | [git.md](./git.md) | Commits, PRs |
```

**Note:** This README should be 20-30KB with real examples, not placeholders.

### project-structure.md

```markdown
# Project Structure

## Directory Layout

\`\`\`
project/
├── src/services/           # Service modules
│   └── [service]/
│       ├── cmd/            # Entry points
│       ├── modules/        # Business modules
│       ├── internal/       # Shared infrastructure
│       └── migrations/     # Database migrations
├── docs/                   # Documentation
├── scripts/                # Build/deploy scripts
└── tools/                  # Development tools
\`\`\`

## Module Structure

[Detailed module layout]

## File Organization Rules

[Rules for organizing files]
```

### [language]-standards.md (e.g., go-standards.md)

```markdown
# Go Coding Standards

## Naming Conventions

### Files
- Use `snake_case.go`
- Test files: `*_test.go`

### Packages
- Single lowercase word
- No underscores

### Types, Functions, Variables
[Detailed conventions with examples]

## Import Organization

[3-group structure with examples]

## Error Handling

[Error wrapping, custom errors, examples]

## Code Style

[Formatting, comments, line length]

## Common Patterns

[Frequently used patterns with code examples]
```

### architecture-patterns.md

```markdown
# Architecture Patterns

## Chosen Pattern

### [Pattern Name] (e.g., Layered, Hexagonal, Clean, Vertical Slices)
[Description, why chosen for this project, example structure]

See architecture-design skill for pattern selection guidance.

### Repository Pattern
[Interface in domain, implementation in infrastructure]

## Forbidden Anti-Patterns

| Anti-Pattern | Why Forbidden | What To Do Instead |
|--------------|---------------|-------------------|

## Module Boundaries

[How modules communicate, what's allowed]
```

### testing-standards.md

```markdown
# Testing Standards

## Test Types

### Unit Tests
- Location: Same package as code
- Naming: `Test[Type]_[Method]_[Scenario]`
- Coverage: Minimum 80%

### Integration Tests
[Requirements and patterns]

### E2E Tests
[Requirements and patterns]

## Test Patterns

### Table-Driven Tests
[Example]

### Arrange-Act-Assert
[Example]

## Mocking Guidelines

[When to mock, how to mock]

## Coverage Requirements

| Type | Minimum | Target |
|------|---------|--------|
```

### api-standards.md

```markdown
# API Standards

## REST Conventions

### URL Structure
[Patterns and examples]

### HTTP Methods
[When to use each]

### Status Codes
[Standard usage]

## Request/Response Format

### Request Structure
[Headers, body format]

### Response Structure
[Success, error formats]

## Error Handling

### Error Response Format
\`\`\`json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human readable message",
    "details": []
  }
}
\`\`\`

### Error Codes
[Standard error codes]
```

### database-standards.md

```markdown
# Database Standards

## Schema Design

### Naming Conventions
- Tables: `snake_case`, plural
- Columns: `snake_case`
- Indexes: `idx_[table]_[columns]`

### Required Columns
[id, created_at, updated_at, version]

## Query Patterns

### Preventing N+1
[Techniques]

### Transactions
[When and how]

## Migrations

### File Naming
[Sequence and naming]

### Up/Down Rules
[Reversibility requirements]

## SQLC Usage

[Configuration and patterns]
```

### security-standards.md

```markdown
# Security Standards

## Input Validation

### All Inputs Must Be Validated
[Rules and examples]

### Validation Libraries
[Approved validators]

## Authentication

[Patterns and requirements]

## Authorization

[RBAC/ABAC patterns]

## Secrets Management

### Never Commit Secrets
[What counts as secret]

### Environment Variables
[Naming, loading]

## SQL Injection Prevention

[Parameterized queries only]

## Logging Security

[What to log, what NOT to log]
```

### libraries.md

```markdown
# Library Standards

## Approved Libraries

### Core
| Library | Purpose | Version | Notes |
|---------|---------|---------|-------|

### HTTP
| Library | Purpose | Version | Notes |
|---------|---------|---------|-------|

### Database
| Library | Purpose | Version | Notes |
|---------|---------|---------|-------|

### Testing
| Library | Purpose | Version | Notes |
|---------|---------|---------|-------|

## Forbidden Libraries

| Library | Reason | Alternative |
|---------|--------|-------------|

## Adding New Libraries

### Evaluation Criteria
1. [Criterion 1]
2. [Criterion 2]

### Approval Process
[How to get approval]
```

### git-workflow.md

```markdown
# Git Workflow

## Branch Strategy

### Branch Types
- `main` - Production
- `develop` - Integration
- `feature/epic-NN-name` - Feature branches
- `fix/issue-description` - Bug fixes

### Naming Convention
[Pattern and examples]

## Commit Messages

### Format (Conventional Commits)
\`\`\`
type(scope): subject

body

footer
\`\`\`

### Types
- feat, fix, docs, style, refactor, test, chore

## Pull Requests

### PR Template
[Required sections]

### Review Requirements
[Approvals needed, checks]

## Merge Strategy

[Squash/rebase/merge rules]
```

## Output Summary

After creating standards, generate:

1. **docs/coding-standards/README.md** - Index (ALWAYS)
2. **docs/coding-standards/project-structure.md** - Layout
3. **docs/coding-standards/[lang]-standards.md** - Per language
4. **docs/coding-standards/architecture-patterns.md** - Patterns
5. **docs/coding-standards/testing-standards.md** - Testing
6. **docs/coding-standards/api-standards.md** - API (if applicable)
7. **docs/coding-standards/database-standards.md** - DB (if applicable)
8. **docs/coding-standards/security-standards.md** - Security
9. **docs/coding-standards/libraries.md** - Dependencies
10. **docs/coding-standards/git-workflow.md** - Git rules

Plus linter configs: `.golangci.yml`, `.eslintrc`, `.editorconfig`

## Validation

- [ ] Each file < 2000 lines
- [ ] README index is complete
- [ ] All languages covered
- [ ] Examples for complex rules
- [ ] No contradictions between files
- [ ] Linter configs match docs
