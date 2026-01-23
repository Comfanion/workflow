---
name: prd-writing
description: How to write a Product Requirements Document with proper structure, sections, and traceability
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

Use the template at: `@.opencode/templates/prd-template.md`

## PRD Structure

### Required Sections

1. **Executive Summary** (2-3 paragraphs)
   - What is being built
   - Why it's being built (business value)
   - Unique value proposition

2. **Project Classification**
   - Technical Type
   - Domain
   - Complexity
   - Architecture style

3. **Success Criteria** (measurable!)
   - MVP Success metrics
   - Growth Success metrics

4. **Product Scope**
   - MVP features (P0)
   - Growth features (P1)
   - Vision features (P2)

5. **Functional Requirements**
   - Organized by domain
   - Each FR has: ID, Priority, Scope, Description, AC

6. **Non-Functional Requirements**
   - Performance (with metrics)
   - Security
   - Scalability
   - Reliability

7. **Dependencies & Integrations**
8. **Risks & Mitigations**
9. **Constraints**
10. **Open Questions**

## Writing Guidelines

### Requirement IDs
- Functional: `FR-001`, `FR-002`, ...
- Non-Functional: `NFR-001`, `NFR-002`, ...

### Priority Levels
- **P0**: Must have for MVP
- **P1**: Should have for growth
- **P2**: Nice to have for vision

### Scope Classification
- **MVP**: Minimum viable product (v1.0)
- **Growth**: Post-MVP enhancements (v1.x)
- **Vision**: Future roadmap (v2.0+)

### Language Rules
- Use "must", "shall", "will" for mandatory items
- Use "should", "may" for optional items
- Avoid ambiguous terms without metrics

## Validation Checklist

Before completing PRD:
- [ ] Executive summary explains the "why"
- [ ] All FRs from requirements.md are addressed
- [ ] All NFRs from requirements.md are addressed
- [ ] Success criteria are measurable
- [ ] Scope boundaries are clear
- [ ] No conflicting requirements
- [ ] Risks are documented with mitigations
- [ ] Each FR has acceptance criteria

## Output

Save to: `docs/prd.md`

## Related Skills

- `acceptance-criteria` - For writing testable AC
- `requirements-gathering` - For source requirements
- `prd-validation` - For validating the PRD
