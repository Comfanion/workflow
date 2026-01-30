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
  
  <task_approach critical="MANDATORY">
    <rule>Every task MUST have Approach section</rule>
    <format>Numbered list of high-level steps (WHAT to do)</format>
    <forbidden>
      <code_blocks>No code in Approach section</code_blocks>
      <implementation>No detailed implementation</implementation>
      <ready_solutions>No copy-paste code</ready_solutions>
    </forbidden>
    <example_good>
      1. Create struct with fields from Unit doc
      2. Add constructor with validation
      3. Write tests: happy path + errors
    </example_good>
    <example_bad>Define struct: type Foo struct { ... }</example_bad>
  </task_approach>
  
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

## Template & Format

**Use template:** `template.md` in this skill folder.

**Full example with Approach sections:** See `template.md` lines 103-158.

---

## Task Structure (MANDATORY)

Each task MUST include these sections:

1. **Goal** - what this task achieves
2. **Read First** - table with documentation links
3. **Output Files** - what files to create
4. **Approach** - high-level steps (MANDATORY)
5. **Done when** - completion criteria

### Approach Section Rules

**CRITICAL:** Every task MUST have **Approach** section.

**Approach = High-level steps (WHAT to do), NOT code (HOW to implement).**

✅ **CORRECT:**
```markdown
**Approach:**
1. Create Order struct with fields from Unit doc
2. Add NewOrder() constructor with validation
3. Add Validate() method for business rules
4. Write tests: valid order, validation errors
```

❌ **WRONG (has code):**
```markdown
**Approach:**
1. Define struct:
   ```go
   type Order struct { ID string }
   ```
```

**Golden Rule:** If you see code blocks in Approach → STOP, remove them.

Point to patterns, don't write implementation.
