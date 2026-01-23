# Epic {{epic_number}}: {{epic_title}}

**Epic ID:** {{module}}-E{{epic_number}}
**Status:** TODO | IN_PROGRESS | DONE
**Priority:** P0 | P1 | P2
**Sprint:** sprint-{{sprint_number}}
**Branch:** feature/epic-{{epic_number}}-{{short_name}}

---

## Overview

[2-3 sentences describing what this epic delivers and why it matters]

### Business Value

[Why is this epic important? What problem does it solve?]

### Dependencies

**Requires (must complete first):**
- [Epic ID]: [brief reason]

**Enables (unlocks these):**
- [Epic ID]: [brief reason]

### Technical Documentation (MANDATORY)

**Documents used to create this epic:**
- [ ] `CLAUDE.md` - Project patterns and conventions
- [ ] `docs/architecture.md` - Section: [specific section]
- [ ] `docs/architecture/{{module}}/` - Module documentation
  - [ ] `index.md` - Module overview
  - [ ] `architecture.md` - Module design
  - [ ] `data-model.md` - Database schema
  - [ ] `api/` - API contracts
  - [ ] `events/` - Event schemas

### Architecture References

- [Link to architecture section that this epic implements]
- [Link to data model section]
- [Link to API contracts if applicable]

### PRD Coverage

| FR ID | Requirement | Covered |
|-------|-------------|---------|
| FR-XXX | [description] | [ ] |
| FR-YYY | [description] | [ ] |

---

## Acceptance Criteria

- [ ] [High-level acceptance criterion 1]
- [ ] [High-level acceptance criterion 2]
- [ ] [High-level acceptance criterion 3]
- [ ] All stories completed and reviewed
- [ ] All tests passing
- [ ] Documentation updated

---

## Stories

### Story Breakdown

| ID | Title | Status | Priority | Est | Tasks | Deps |
|----|-------|--------|----------|-----|-------|------|
| {{module}}-S{{epic_number}}-01 | [Domain Layer] | TODO | P0 | M | 6 | - |
| {{module}}-S{{epic_number}}-02 | [Use Cases] | TODO | P0 | M | 8 | S01 |
| {{module}}-S{{epic_number}}-03 | [HTTP Handlers] | TODO | P1 | S | 5 | S02 |
| {{module}}-S{{epic_number}}-04 | [Integration Tests] | TODO | P1 | S | 4 | S03 |

### Story Dependency Graph

```
S01 ──► S02 ──► S03 ──► S04
  │              │
  └──────────────┘ (S03 also needs domain from S01)
```

### Story Decomposition Rules

Each story MUST:
1. Be completable (not too big, not too small)
2. Have self-contained tasks with documentation links
3. Have clear dependencies on other stories
4. Map to specific Acceptance Criteria

### Recommended Story Order

1. **Domain Layer** - Aggregates, value objects, domain services
2. **Repository Interfaces** - Ports (domain layer)
3. **Use Cases** - Application layer handlers
4. **Repository Implementations** - Infrastructure adapters
5. **HTTP/API Handlers** - Infrastructure entry points
6. **Events** - Domain events, Kafka publishers
7. **Integration Tests** - End-to-end verification

### Stories by Layer

| Layer | Stories | Tasks | Size |
|-------|---------|-------|------|
| Domain | 1 | 4 | M |
| Application | 2 | 6 | M |
| Infrastructure | 2 | 5 | L |
| Testing | 1 | 3 | S |
| **Total** | **6** | **18** | |

**Note:** No hour estimates. Size = relative complexity (XS/S/M/L/XL).

---

## Technical Notes

### Key Decisions
- [Decision 1]
- [Decision 2]

### Implementation Hints
- [Hint 1]
- [Hint 2]

### Files to Create/Modify
- `src/path/to/file` - [description]
- `src/path/to/another` - [description]

### Testing Strategy
- Unit tests: [approach]
- Integration tests: [approach]

---

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| [Risk 1] | H/M/L | H/M/L | [How to address] |

---

## Notes

[Any additional context, links, or references]

---

## Changelog

<!-- UPDATE AT END OF SESSION -->

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | {{date}} | @{{author}} | Initial creation |

<!-- 
Changelog Guidelines:
- Update at END of work session
- Summarize all changes in one entry
- Version: 0.x=planning, 1.0=sprint-ready, 1.x=in-progress

Example:
| 1.0 | 2024-01-15 | @sm | Add stories S01-S05; Define all AC; Ready for sprint |
-->
