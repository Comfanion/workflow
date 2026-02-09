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
    <XS tasks="1-2" use="Trivial additions"/>
    <S tasks="2-3" use="TOY, SMALL projects (PREFERRED)" target="true"/>
    <M tasks="3-5" use="MEDIUM projects (PREFERRED)" target="true"/>
    <L tasks="5-8" use="LARGE - only if feature is complex"/>
    <XL tasks="8+" use="FORBIDDEN - must split into multiple stories" forbidden="true"/>
  </sizes>
  
  <feature_driven>
    <definition>Story = ONE working feature end-to-end (thin vertical slice)</definition>
    <principle>Each story delivers value users can see/test</principle>
    <approach>
      <step>1. Study existing code (MANDATORY - find patterns)</step>
      <step>2. Write test for core functionality</step>
      <step>3. Implement MINIMAL code (domain + repo + API if needed)</step>
      <step>4. Verify it works end-to-end</step>
    </approach>
    <examples>
      <good>"User can create simple order" → Order entity + CreateOrder API + test</good>
      <good>"Order validates required fields" → Add validation logic + tests</good>
      <good>"Order checks inventory" → Integration with inventory service + tests</good>
      <bad>"Create domain layer" → No working feature, just entities</bad>
      <bad>"Implement repository layer" → Can't test without use case</bad>
      <bad>"All CRUD operations" → Too big, split into Create/Read/Update/Delete stories</bad>
    </examples>
    <result>After story: feature WORKS, is TESTED, can be DEMOED</result>
  </feature_driven>
  
  <task_composition>
    <task n="1" type="study">Study existing code, design interfaces (if parallel planned)</task>
    <task n="2" type="test">Write test for core functionality</task>
    <task n="3" type="implement">Minimal implementation (domain + repo + API)</task>
    <task n="4" type="verify">Integration test (if needed)</task>
    <note>Most stories: 2-4 tasks. Prefer smaller stories over larger ones.</note>
  </task_composition>
  
  <task_approach_section critical="MANDATORY">
    <rule>Each task MUST have "Approach" section with HIGH-LEVEL steps</rule>
    <format>Numbered list of WHAT to do, NOT HOW (no code)</format>
    <good_example>
      1. Create Order struct with fields from Unit doc
      2. Add NewOrder() constructor with validation
      3. Add Validate() method
      4. Write tests: valid order, empty fields, invalid status
    </good_example>
    <bad_example>
      1. type Order struct { ID string; CustomerID string }
      2. func NewOrder(id, customerID string) (*Order, error) { ... }
      ❌ This is CODE, not approach!
    </bad_example>
    <remember>Approach = WHAT steps to take. @dev transforms this to HOW (technical details) for @coder.</remember>
  </task_approach_section>
  
  <test_strategy critical="MANDATORY">
    <principle>Test CORE functionality first, expand coverage incrementally. No tests for sake of tests.</principle>
    
    <priority>
      <p1>Business logic (validation, calculations, decisions)</p1>
      <p2>Integration points (API calls, database, external services)</p2>
      <p3>Error handling (edge cases, failures)</p3>
      <p4>Happy path (normal flow)</p4>
    </priority>
    
    <do_test>
      <what>Business rules (validation, calculations)</what>
      <what>State changes (create, update, delete)</what>
      <what>Error conditions (invalid input, failures)</what>
      <what>Integration with other services</what>
    </do_test>
    
    <dont_test>
      <skip>Simple getters/setters (no logic)</skip>
      <skip>Trivial constructors (just assign fields)</skip>
      <skip>Third-party library internals</skip>
      <skip>Database framework internals</skip>
    </dont_test>
    
    <incremental_approach>
      <story n="1">Core functionality only (happy path + critical validation)</story>
      <story n="2">Add edge cases as you discover them</story>
      <story n="3">Integration tests when connecting systems</story>
      <avoid>Writing 100% coverage in first story - wasteful, most tests never catch bugs</avoid>
    </incremental_approach>
    
    <examples>
      <good>Story: CreateOrder → Test: valid order, missing customer (2 tests, covers 80% of real issues)</good>
      <good>Story: InventoryCheck → Test: success, out-of-stock, service down (3 tests, critical paths)</good>
      <bad>Story: CreateOrder → 15 tests for all field combinations (overkill, testing framework not logic)</bad>
      <bad>Test OrderID() getter → returns field (trivial, no value)</bad>
    </examples>
    
    <metrics>
      <wrong>Coverage % target (80%, 90%) - encourages testing trivial code</wrong>
      <right>Core business paths tested (are critical flows covered?)</right>
      <right>Critical errors handled (can system fail gracefully?)</right>
    </metrics>
  </test_strategy>
  
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
