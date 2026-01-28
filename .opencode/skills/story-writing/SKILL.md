---
name: story-writing
description: Write user stories with Given/When/Then acceptance criteria, implementation tasks, and subtasks. Use when creating stories, defining user scenarios, breaking down epics, or when user mentions "user story", "story writing", "acceptance criteria", "Given/When/Then", or "story tasks".
license: MIT
compatibility: opencode
metadata:
  domain: agile
  artifacts: docs/sprint-artifacts/*/stories/story-*.md
---

# Story Writing Skill

---

## LLM Rules (Machine-Readable)

```xml
<story_rules>
  <definition>Story = Smallest working increment (one layer/feature)</definition>
  
  <sizes>
    <XS tasks="1-2" use="Rarely (trivial changes)"/>
    <S tasks="2-4" use="TOY, SMALL projects"/>
    <M tasks="4-8" use="Preferred for all" target="true"/>
    <L tasks="8-12" use="Consider splitting"/>
    <XL tasks="12+" use="Must split" forbidden="true"/>
  </sizes>
  
  <estimation>
    <t_shirt for="TOY,SMALL,MEDIUM,LARGE">XS, S, M, L (no XL!)</t_shirt>
    <t_shirt_plus_points for="ENTERPRISE">
      <mapping XS="1" S="3" M="5" L="8" XL="13"/>
    </t_shirt_plus_points>
  </estimation>
  
  <vertical_slice>
    <principle>Stories build layers, Epic completes full stack</principle>
    <story_order>
      <step>1. Domain (entities, value objects)</step>
      <step>2. Repository interfaces</step>
      <step>3. Use cases</step>
      <step>4. Repository implementations</step>
      <step>5. API (HTTP handlers)</step>
      <step>6. UI (forms, views)</step>
      <step>7. Integration tests</step>
    </story_order>
    <result>Each story = increment, Epic = working module</result>
  </vertical_slice>
  
  <status_values>
    <draft>Being written</draft>
    <ready>Ready for dev</ready>
    <in_progress>Being implemented</in_progress>
    <review>PR submitted</review>
    <done>Merged</done>
  </status_values>
</story_rules>
```

---

## Example: MEDIUM Project Story

```yaml
id: ORD-S01-01
epic: ORD-E01
status: ready
size: M
```

# Story: Order Domain Layer

## Goal

Implement domain entities and value objects for Order Management.

**Context:** Part of Epic 01 (Order Management). Focuses on domain layer.

## Units Affected

| Unit | Action | Description |
|------|--------|-------------|
| → Unit: `Order` | Create | New entity |

## Required Reading

| Document | Section | Why |
|----------|---------|-----|
| → `CLAUDE.md` | All | Project patterns |
| → `docs/coding-standards/` | All | **MANDATORY** |
| → Unit: `Order` | Data Model | Field definitions |

## Acceptance Criteria

- [ ] Order entity created with all fields
- [ ] Validation logic implemented
- [ ] Tests pass (>80% coverage)
- [ ] Follows coding-standards

## Tasks

| ID | Task | Deps | Status |
|----|------|------|--------|
| T1 | Order entity | - | ⬜ |
| T2 | Value objects | - | ⬜ |
| T3 | Unit tests | T1, T2 | ⬜ |

### T1: Order Entity

**Goal:** Create Order entity with business rules

**Read First:**
| Document | Section | What to Look For |
|----------|---------|------------------|
| → `docs/coding-standards/` | Domain Layer | Entity patterns |
| → Unit: `Order` | Data Model | All fields |

**Output Files:**
- `internal/order/domain/order.go`
- `internal/order/domain/order_test.go`

**Done when:**
- [ ] Entity created
- [ ] Follows coding-standards
- [ ] Tests pass

See `template.md` for full format.
