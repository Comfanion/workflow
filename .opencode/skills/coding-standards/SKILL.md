---
name: coding-standards
description: Establish coding standards, design patterns, naming conventions, code organization, and best practices for the project. Use when defining code style, setting up standards, documenting patterns, or when user mentions "coding standards", "code style", "naming conventions", "best practices", "code patterns", or "style guide".
license: MIT
compatibility: opencode
metadata:
  domain: software-architecture
  agents: [architect]
  artifacts: docs/coding-standards/*.md
---

# Coding Standards Skill

```xml
<coding_standards>
  <definition>Establish coding standards, patterns, naming conventions</definition>
  
  <core_principle>
    <readme>Main file - agents read ONLY this during development (saves context)</readme>
    <must_contain>All critical rules, common patterns, naming, project structure</must_contain>
    <other_files>Deep dive only - read when story's "Required Reading" points to them</other_files>
  </core_principle>
  
  <size_guidelines>
    <readme max="20-30KB">Main file, all critical rules</readme>
    <other_files max="10-20KB">Deep dive on specific topics</other_files>
    <limit>Under 2000 lines per file</limit>
  </size_guidelines>
  
  <structure>
    <readme>Index and quick reference</readme>
    <project_structure>Directory layout, module organization</project_structure>
    <language_standards>Language-specific (go-standards.md, typescript-standards.md)</language_standards>
    <architecture_patterns>Required patterns, anti-patterns</architecture_patterns>
    <testing_standards>Test types, coverage, patterns</testing_standards>
    <api_standards>REST/gRPC conventions, error codes</api_standards>
    <database_standards>Schema, queries, migrations</database_standards>
    <security_standards>Auth, validation, secrets</security_standards>
    <libraries>Approved/forbidden dependencies</libraries>
    <git_workflow>Branches, commits, PRs</git_workflow>
  </structure>
  
  <naming>
    <files>snake_case (user_service.go, auth_handler.ts)</files>
    <types_classes>PascalCase (UserService, AuthHandler)</types_classes>
    <functions>camelCase (TS) or PascalCase (Go exported)</functions>
    <variables>camelCase (userId, isValid)</variables>
    <constants>UPPER_SNAKE_CASE (MAX_RETRIES)</constants>
    <tests>*_test.go, *.test.ts</tests>
  </naming>
  
  <patterns>
    <service>Business logic layer</service>
    <repository>Data access layer</repository>
    <handler>HTTP/API layer (no business logic)</handler>
    <error_handling>Consistent error types and codes</error_handling>
  </patterns>
  
  <critical_rules>
    <no_business_in_handlers>Handlers only validate and call services</no_business_in_handlers>
    <dependency_injection>Use interfaces, inject dependencies</dependency_injection>
    <error_wrapping>Wrap errors with context</error_wrapping>
    <no_global_state>Avoid global variables</no_global_state>
    <test_coverage>Domain 80%+, Application 70%+</test_coverage>
  </critical_rules>
  
  <api_response>
    <success>{"data": {...}, "meta": {...}}</success>
    <error>{"error": {"code": "...", "message": "...", "details": [...]}}</error>
  </api_response>
  
  <workflow>
    <step1>Read PRD and Architecture to understand project</step1>
    <step2>Create docs/coding-standards/ folder</step2>
    <step3>Start with README.md (all critical rules)</step3>
    <step4>Add deep-dive files as needed</step4>
    <step5>Ensure README.md is self-contained (agents read only this)</step5>
  </workflow>
  
  <what_to_document>
    <guide>See [what-to-document.md](what-to-document.md) for complete guide</guide>
    <essential>Project structure, naming, patterns, errors, testing, API, database, security, dependencies, git</essential>
  </what_to_document>
</coding_standards>
```

---

## Detailed Guide

**For complete information on what to document:**
- [what-to-document.md](what-to-document.md) - 10 essential sections with examples

---

## Example: README.md Structure

```markdown
# Coding Standards

**Project:** E-commerce Platform
**Tech Stack:** Go, PostgreSQL, React
**Last Updated:** 2026-01-29

## Project Structure

\`\`\`
project/
├── internal/
│   ├── order/       # Order module
│   │   ├── domain/
│   │   ├── service/
│   │   └── handler/
│   └── shared/      # Shared utilities
├── docs/
└── tests/
\`\`\`

## Naming Conventions

- Files: `snake_case` (user_service.go)
- Types: `PascalCase` (UserService)
- Functions: `camelCase` (getUserById)
- Constants: `UPPER_SNAKE_CASE` (MAX_RETRIES)

## Common Patterns

### Service Pattern
\`\`\`go
type UserService struct {
    repo UserRepository
}

func (s *UserService) Create(user *User) error {
    // Business logic here
    return s.repo.Save(user)
}
\`\`\`

## Critical Rules

1. No business logic in handlers
2. Use dependency injection
3. Wrap errors with context
4. Test coverage: Domain 80%+

## Deep Dive

- → `project-structure.md` - Full directory layout
- → `go-standards.md` - Go-specific patterns
- → `testing-standards.md` - Test patterns
```

See `template-*.md` for full formats.
