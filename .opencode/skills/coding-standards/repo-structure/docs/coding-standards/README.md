# Coding Standards

## Purpose

This folder contains coding conventions and best practices for the project.

## Files

| File | Description |
|------|-------------|
| README.md | This overview |
| naming.md | Naming conventions |
| architecture.md | Architecture patterns |
| testing.md | Testing standards |
| git.md | Git workflow (see also CONTRIBUTING.md) |

## Quick Reference

### File Naming

```
snake_case.ext       # Source files
PascalCase           # Classes/Types
camelCase            # Functions/variables
SCREAMING_SNAKE_CASE # Constants
```

### Directory Structure

```
src/
├── domain/          # Business logic
├── application/     # Use cases
├── infrastructure/  # External adapters
└── api/             # API layer
```

### Code Organization

- Single responsibility per file
- Explicit imports
- No circular dependencies
- Tests next to source

## Process

Generate standards with `/coding-standards` using @architect agent.

## Related

- [CONTRIBUTING.md](/CONTRIBUTING.md) - Git workflow
- [Architecture](../architecture.md) - System design
