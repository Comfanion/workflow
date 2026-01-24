---
name: adr-writing
description: Use when documenting significant architectural decisions - database choice, framework selection, pattern adoption, or any decision with long-term consequences
license: MIT
compatibility: opencode
metadata:
  domain: software-architecture
  artifacts: docs/architecture/adr/*.md
---

# ADR Writing Skill

## When to Use

Use this skill when you need to:
- Document a significant architectural decision
- Record the rationale behind a technical choice
- Create a reference for future developers
- Track decision evolution over time

## Template

Use template at: `@.opencode/skills/adr-writing/template.md`

## ADR Structure (v2)

### 1. Header

```yaml
id: ADR-{{N}}
status: proposed | accepted | deprecated | superseded
date: {{date}}
deciders: [{{names}}]
supersedes: ADR-{{X}}  # if applicable
```

### 2. Context

Prose explaining:
- The situation and problem
- What decision is needed
- Why it's needed now

With **Forces:** (tensions/tradeoffs) and **Constraints:**

```markdown
## Context

We need to choose the primary database for the Task module.

We need to decide now because development starts next sprint.

**Forces:**
- Need ACID transactions — pushes toward relational
- Team expertise is SQL — reduces risk

**Constraints:**
- Must run on existing K8s cluster
```

### 3. Decision

Bold statement + brief explanation:

```markdown
## Decision

**We will use PostgreSQL as the primary database.**

This means all Task module data will be stored in PostgreSQL with JSONB for flexible attributes.
```

### 4. Options Considered

For each option:
- Brief description
- Pros/Cons table
- Mark chosen with ✓

```markdown
### Option 1: MongoDB

Document database with flexible schema.

| Pros | Cons |
|------|------|
| Flexible schema | No ACID across documents |

### Option 2: PostgreSQL ✓ CHOSEN

Relational database with JSON support.

| Pros | Cons |
|------|------|
| ACID transactions | Schema migrations needed |
| Team expertise | |

**Why chosen:** ACID critical for assignments. Team expertise reduces risk.
```

### 5. Consequences

Grouped by type:
- Positive (✓)
- Negative (✗)
- Risks (⚠)

```markdown
## Consequences

### Positive
- Single deploy = simple CI/CD
- Team already knows PostgreSQL

### Negative
- Must manage migrations carefully

### Risks
- Schema evolution — mitigated by versioned migrations
```

### 6. Implementation Notes (optional)

Specific guidance for implementing the decision.

### 7. References

```markdown
→ Architecture: `docs/architecture.md`
→ Related ADR: → ADR: `ADR-002`
→ Affected Units: → Unit: `Task`
```

## Reference Format

Always use `→` prefix:

```markdown
→ ADR: `ADR-001`
→ Unit: `Task`
→ Architecture: `docs/architecture.md`
```

## When to Write ADR

| Situation | Write ADR? |
|-----------|-----------|
| Database choice | Yes |
| Framework choice | Yes |
| Architecture pattern | Yes |
| API design decision | Yes |
| Library choice | Maybe (if significant) |
| Code style decision | No (use coding-standards) |

## ADR Lifecycle

```
proposed ──► accepted ──► deprecated
                │
                └──► superseded (by new ADR)
```

When superseding:
1. Create new ADR
2. Add `supersedes: ADR-XXX` to new ADR
3. Update old ADR status to `superseded`
4. Add `superseded_by: ADR-YYY` to old ADR

## Naming Conventions

### File Names

```
ADR-[NNN]-[short-title].md

Examples:
- ADR-001-postgresql-database.md
- ADR-002-hexagonal-architecture.md
```

### IDs

Sequential: `ADR-001`, `ADR-002`, ...

## Validation Checklist

- [ ] Context explains the problem clearly
- [ ] Forces describe tensions/tradeoffs
- [ ] Decision is a clear statement
- [ ] At least 2 options were considered
- [ ] Chosen option is marked
- [ ] Rationale explains why chosen
- [ ] Consequences include positives AND negatives
- [ ] Uses `→` reference format
- [ ] Links to affected units

## Output

Save to: `docs/architecture/adr/ADR-[NNN]-[title].md`

## Related Skills

- `architecture-design` - Creates ADRs for decisions
- `unit-writing` - ADRs affect units
