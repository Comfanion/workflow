---
name: requirements-gathering
description: Gather functional and non-functional requirements through stakeholder interviews, user research, and elicitation techniques. Use when starting a new project, collecting requirements, interviewing stakeholders, or when user mentions "requirements", "FR", "NFR", "stakeholder needs", or "user research".
license: MIT
compatibility: opencode
metadata:
  domain: business-analysis
  artifacts: docs/requirements/requirements.md
---

# Requirements Gathering Skill

```xml
<requirements_gathering>
  <definition>Gather FR/NFR through stakeholder interviews</definition>
  
  <output>docs/requirements/requirements.md</output>
  
  <structure>
    <header>id, version, status, date, author</header>
    <summary>Problem, users, outcomes</summary>
    <stakeholders>Table: Role | Representative | Interest | Influence</stakeholders>
    <functional_requirements>
      <grouped_by>Domain</grouped_by>
      <table>ID | Requirement | Priority | Source | Module | Doc Section | Arch § | Epic | Status</table>
      <traceability>
        <module>Filled by @architect</module>
        <arch_section>Filled by @architect</arch_section>
        <epic>Filled by @pm</epic>
        <status>Updated by @dev (⬜ → ✅)</status>
      </traceability>
    </functional_requirements>
    <nfr>
      <categories>Performance, Security, Scalability, Usability, Reliability, Maintainability</categories>
      <table>ID | Requirement | Priority | Metric | Arch § | Status</table>
    </nfr>
    <ai_requirements optional="true">For RAG/AI systems</ai_requirements>
    <constraints>Table: Type | Description | Impact</constraints>
    <assumptions>Bullet list</assumptions>
    <dependencies>Table: Item | Owner | Status | Risk</dependencies>
    <open_questions>Checklist</open_questions>
    <glossary>Table: Term | Definition</glossary>
    <references>Links to PRD, Architecture</references>
  </structure>
  
  <requirement_rules>
    <atomic>One requirement = one thing</atomic>
    <measurable>Use numbers, not "quickly"</measurable>
    <testable>Can verify with test</testable>
    <unambiguous>Clear, no interpretation needed</unambiguous>
  </requirement_rules>
  
  <ids>
    <functional>FR-001, FR-002, ...</functional>
    <nfr>NFR-001, NFR-002, ...</nfr>
  </ids>
  
  <priority>
    <P0>Must have (MVP)</P0>
    <P1>Should have (Growth)</P1>
    <P2>Nice to have (Vision)</P2>
  </priority>
  
  <interview_questions>
    <functional>
      <q>What do you need to accomplish?</q>
      <q>What information do you need to see?</q>
      <q>What actions do you need to take?</q>
      <q>What happens when X fails?</q>
    </functional>
    <nfr>
      <q>How many users concurrently?</q>
      <q>What response time is acceptable?</q>
      <q>What's the data retention policy?</q>
      <q>What security standards apply?</q>
    </nfr>
  </interview_questions>
  
  <reference_format>
    <unit>→ Unit: `Task`</unit>
    <fr>→ FR: `FR-001`</fr>
    <prd>→ PRD: `docs/prd.md`</prd>
  </reference_format>
</requirements_gathering>
```

**When to include:**
- System uses LLM/ML models
- System has probabilistic outputs (not deterministic)
- Accuracy/hallucination metrics are critical
- System needs clear boundaries (what it should/shouldn't do)

### 6. Constraints

| Type | Constraint | Impact |
|------|------------|--------|
| Technical | Must use existing auth | Limits options |
| Timeline | MVP in 3 months | Scope pressure |

### 7. Assumptions

| # | Assumption | Risk if Wrong | Validation |
|---|------------|---------------|------------|
| 1 | Users have modern browsers | IE support needed | Analytics |

### 8. Dependencies

| Dependency | Type | Owner | Status | Risk |
|------------|------|-------|--------|------|
| Auth service | Technical | Platform team | Available | Low |

### 9. Open Questions

| # | Question | Owner | Due | Status |
|---|----------|-------|-----|--------|
| 1 | Max file size? | PM | Jan 30 | Open |

### 10. Glossary

| Term | Definition |
|------|------------|
| Task | Unit of work assigned to user |

### 11. References

```markdown
→ PRD: `docs/prd.md`
→ Stakeholder Interviews: `docs/interviews/`
```

---

## Example: Task Management Requirements

```yaml
id: REQ-001
version: 1.0
status: draft
```

# Requirements Document

## Summary

Team collaboration tool for managing tasks and assignments.

## Functional Requirements

### Task Management

| ID | Requirement | Priority | Source | Module | Doc Section | Arch § | Epic | Status |
|----|-------------|----------|--------|--------|-------------|--------|------|--------|
| FR-001 | User can create task | P0 | Team Lead | Task | → Unit: `Task` | §3.1 | → Epic: `epic-01-task-crud.md` | ⬜ |
| FR-002 | User can assign task | P0 | Team Lead | Task | → Unit: `Task` | §3.1 | → Epic: `epic-01-task-crud.md` | ⬜ |

**Business Rules:**
- One task = one assignee

## Non-Functional Requirements

### Performance

| ID | Requirement | Priority | Metric | Arch § | Status |
|----|-------------|----------|--------|--------|--------|
| NFR-001 | Page load < 2s | P0 | 95th percentile | §4.2 | ⬜ |

See `template.md` for full format.
