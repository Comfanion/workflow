---
name: epic-writing
description: Create epics from PRD with acceptance criteria, story breakdown, and technical approach. Use when breaking down PRD into epics, defining feature areas, or when user mentions "epic", "feature breakdown", "epic creation", or "story grouping".
license: MIT
compatibility: opencode
metadata:
  domain: agile
  artifacts: docs/sprint-artifacts/*/epic-*.md
---

# Epic Writing Skill

```xml
<epic_writing>
  <definition>Epic = Group of stories forming complete feature/module</definition>
  
  <scope_by_project_size>
    <TOY scope="Major feature" stories="3-8" size="S"/>
    <SMALL scope="Feature area" stories="5-12" size="M"/>
    <MEDIUM scope="Module/Unit" stories="8-15" size="L"/>
    <LARGE scope="Domain" stories="10-20" size="XL"/>
    <ENTERPRISE scope="Bounded Context" stories="15-30" size="XXL"/>
  </scope_by_project_size>
  
  <vertical_slice>
    <principle>Epic = Complete vertical slice (all layers)</principle>
    <layers>Domain → Repository → Use Cases → API → UI → Tests</layers>
    <result>Working module (demo-ready)</result>
  </vertical_slice>
  
  <status_values>
    <todo>Not started</todo>
    <in_progress>Work ongoing</in_progress>
    <review>All stories done, under review</review>
    <done>Completed and merged</done>
  </status_values>
  
  <estimation>
    <t_shirt for="TOY,SMALL,MEDIUM,LARGE">S, M, L, XL</t_shirt>
    <t_shirt_plus_points for="ENTERPRISE">
      <mapping S="8-13" M="13-21" L="21-34" XL="34-55" XXL="55+"/>
      <calculate>Sum of story points</calculate>
    </t_shirt_plus_points>
  </estimation>
  
  <depth_by_size>
    <TOY>
      <overview>Simple (1-2 paragraphs)</overview>
      <units>Not needed</units>
      <ac>Simple checklist</ac>
      <stories>Bullet points</stories>
      <increment>"Feature works"</increment>
    </TOY>
    
    <MEDIUM>
      <overview>Detailed with business value</overview>
      <units>References Unit docs</units>
      <ac>Comprehensive</ac>
      <stories>Table with dependencies</stories>
      <technical_decisions>With ADR links</technical_decisions>
      <risks>Identified</risks>
      <increment>"Module works end-to-end"</increment>
    </MEDIUM>
    
    <ENTERPRISE>
      <overview>Complete with strategic context</overview>
      <units>Multiple Units (cross-domain)</units>
      <ac>Exhaustive with compliance</ac>
      <stories>With estimates and confidence</stories>
      <technical_decisions>All documented</technical_decisions>
      <risks>With mitigation plans</risks>
      <security>Considerations included</security>
      <increment>"Domain slice works"</increment>
    </ENTERPRISE>
  </depth_by_size>
  
  <header_fields>
    <id>{{PREFIX}}-E{{N}}</id>
    <status>backlog | ready | in_progress | done</status>
    <priority>P0 | P1</priority>
    <size>S | M | L | XL | XXL</size>
    <estimate>Optional: ENTERPRISE only (story points total)</estimate>
    <sprint>{{sprint}}</sprint>
  </header_fields>
  
  <structure>
    <overview>What epic delivers, business value, scope</overview>
    <units_affected>Table: Unit | Changes | Impact</units_affected>
    <dependencies>Table: Type | Item | Why</dependencies>
    <prd_coverage>Table: FR | Requirement | Notes</prd_coverage>
    <acceptance_criteria>Checklist defining "working increment"</acceptance_criteria>
    <stories>Table: ID | Title | Size | Focus | Status</stories>
    <technical_decisions>Table: Decision | Rationale | ADR</technical_decisions>
    <risks>Table: Risk | Impact | Mitigation</risks>
    <references>Links to PRD, Architecture, Units</references>
  </structure>
  
  <story_order>
    <step n="1">Domain layer (entities, value objects)</step>
    <step n="2">Repository interfaces</step>
    <step n="3">Use cases</step>
    <step n="4">Repository implementations</step>
    <step n="5">HTTP handlers</step>
    <step n="6">Integration tests</step>
  </story_order>
  
  <naming>
    <file>epic-[NN]-[description].md</file>
    <id>[PREFIX]-E[NN]</id>
    <examples>
      <file>epic-01-task-management.md</file>
      <id>TASK-E01</id>
    </examples>
  </naming>
  
  <traceability>
    <after_epic_creation>Update requirements.md with Epic column</after_epic_creation>
    <format>→ Epic: `epic-01-task-crud.md`</format>
  </traceability>
  
  <reference_format>
    <unit>→ Unit: `Task`</unit>
    <fr>→ FR: `FR-001`</fr>
    <adr>→ ADR: `ADR-001`</adr>
    <prd>→ PRD: `docs/prd.md`</prd>
  </reference_format>
  
  <output>
    <sprint>docs/sprint-artifacts/sprint-[N]/epic-[NN]-[description].md</sprint>
    <backlog>docs/sprint-artifacts/backlog/epic-[NN]-[description].md</backlog>
  </output>
</epic_writing>
```

---

## Example: MEDIUM Project Epic

```yaml
id: ORD-E01
status: in_progress
priority: P0
size: L
sprint: sprint-1
```

# Epic: Order Management Module

## Overview

This epic delivers **complete order management** for e-commerce platform. When complete, users will be able to create, view, update, and track orders through full lifecycle.

**Business Value:** Core functionality for MVP launch

**Scope:**
- Order CRUD operations
- Order status workflow
- Inventory validation
- Order history

**Not Included:**
- Recurring orders (Growth phase)
- Bulk order import (Enterprise)

## Units Affected

| Unit | Changes | Impact |
|------|---------|--------|
| → Unit: `Order` | Create | New domain entity |
| → Unit: `Inventory` | Modify | Add reservation logic |

## Acceptance Criteria

- [ ] **Increment ready:** Order Management module works end-to-end
- [ ] Users can create orders via UI
- [ ] Orders validate against inventory
- [ ] Order status workflow implemented
- [ ] Integration tests pass (Order ↔ Inventory)
- [ ] All stories completed
- [ ] Tests pass (>80% coverage)
- [ ] API documented
- [ ] **Demo-ready:** Can show to stakeholders

## Stories

| ID | Title | Size | Focus | Status |
|----|-------|------|-------|--------|
| ORD-S01-01 | Order Domain | M | → Unit: `Order` | ⬜ |
| ORD-S01-02 | Order Repository | M | → Unit: `Order` | ⬜ |
| ORD-S01-03 | Create Order Use Case | M | → Unit: `Order` | ⬜ |
| ORD-S01-04 | Order API | M | → Unit: `Order` | ⬜ |
| ORD-S01-05 | Order UI | M | → Unit: `Order` | ⬜ |
| ORD-S01-06 | Integration Tests | S | All | ⬜ |

```
S01 ──► S02 ──► S03 ──► S04 ──► S05 ──► S06
```

See `template.md` for full format.
