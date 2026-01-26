---
name: prd-writing
description: Use when creating a PRD from requirements with proper structure and traceability
license: MIT
compatibility: opencode
metadata:
  domain: product-management
  artifacts: docs/prd.md
---

# PRD Writing Skill

## When to Use

Use this skill when you need to:
- Create a new PRD from requirements
- Structure product requirements into a coherent document
- Define scope boundaries (MVP/Growth/Vision)

## Template

Use the template at: `@.opencode/skills/prd-writing/template.md`

## PRD Structure (v2)

### 1. Executive Summary

Brief prose section with:
- What the system is and does
- Architecture pattern
- Key domains (numbered list)
- What makes this special (unique value)
- Scale (MVP and Growth targets)

### 2. Success Criteria

| Section | Content |
|---------|---------|
| MVP Success | Measurable criteria for launch |
| Growth Success | Measurable criteria for scale |

### 3. Product Scope

| Section | Content |
|---------|---------|
| MVP | Features by domain |
| Growth Features | Post-MVP enhancements |
| Out of Scope | Explicit exclusions |

### 4. Functional Requirements

**Grouped by domain in tables:**

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-001 | {{requirement}} | P0 |

With **Notes:** for business rules after each domain table.

### 5. Non-Functional Requirements

Tables for:
- Performance (with metrics)
- Security
- Scalability

### 6. Critical Business Rules

Numbered list with **bold rule name** — description format.

### 7. Glossary

| Term | Definition |
|------|------------|

### 8. References

Using `→` format:
```
→ Architecture: `docs/architecture.md`
→ Requirements: `docs/requirements.md`
```

## Writing Guidelines

### Reference Format

Always use `→` prefix for links:
```
→ Unit: `Task`
→ FR: `FR-001`
→ ADR: `ADR-001`
→ `path/to/file.md`
```

### Requirement IDs
- Functional: `FR-001`, `FR-002`, ...
- Non-Functional: `NFR-001`, `NFR-002`, ...

### Priority Levels
- **P0**: Must have for MVP
- **P1**: Should have for growth
- **P2**: Nice to have for vision

### Tables over Prose

Prefer structured tables over paragraphs:
```markdown
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-001 | User can create task | P0 |
```

NOT:
```markdown
FR-001: The user shall be able to create a task. This is a P0 requirement...
```

## Validation Checklist

Before completing PRD:
- [ ] Executive summary explains the "why"
- [ ] All FRs from requirements.md are addressed
- [ ] All NFRs have measurable metrics
- [ ] Success criteria are measurable
- [ ] Scope boundaries are clear
- [ ] Critical business rules documented
- [ ] Uses `→` reference format
- [ ] Tables used for structured data

## Output

Save to: `docs/prd.md`

## Related Skills

- `acceptance-criteria` - For writing testable AC
- `requirements-gathering` - For source requirements
- `prd-validation` - For validating the PRD
- `unit-writing` - For documenting units referenced in PRD
