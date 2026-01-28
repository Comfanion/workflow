# {{project}} — PRD

```yaml
id: PRD-001
version: 1.0
status: draft | approved
date: {{date}}
author: {{author}}
```

---

## Project Classification

> **Purpose:** Determines workflow depth and artifact sizes. Agents use this to adapt their approach.
> See `.opencode/project-size-guide.yaml` for detailed guidelines.

| Attribute | Value | Notes |
|-----------|-------|-------|
| **Size** | {{size}} | toy / small / medium / large / enterprise |
| **Complexity** | {{complexity}} | simple / moderate / complex / very_complex |
| **Team Size** | {{team_size}} | Number of developers |
| **Timeline** | {{timeline}} | Expected duration |
| **Domain** | {{domain}} | web_app / mobile_app / api / library / cli / game / embedded |

**Size Impact:**
- **PRD Depth:** {{prd_pages}} pages
- **Architecture:** {{arch_lines}} lines
- **Epics:** {{epic_count}} ({{epic_scope}})
- **Stories per Epic:** {{stories_per_epic}}
- **Sprints:** {{sprint_count}}

<!-- Examples:
TOY (Tetris):
  Size: toy | Complexity: simple | Team: 1 | Timeline: < 1 week | Domain: game
  PRD: 2-3 pages | Arch: 200-500 lines | Epics: 3-5 (major features) | Stories: 3-8 | Sprints: 1

SMALL (Blog):
  Size: small | Complexity: simple | Team: 1-2 | Timeline: 1-4 weeks | Domain: web_app
  PRD: 3-5 pages | Arch: 500-1000 lines | Epics: 5-10 (features) | Stories: 5-12 | Sprints: 1-2

MEDIUM (E-commerce):
  Size: medium | Complexity: moderate | Team: 2-5 | Timeline: 1-3 months | Domain: web_app
  PRD: 5-10 pages | Arch: 1000-2000 lines | Epics: 8-15 (modules) | Stories: 8-15 | Sprints: 2-4
-->

---

## Executive Summary

{{project}} is a {{type}} platform for {{target_users}}. The system handles {{core_capabilities}}.

**Architecture:** {{architecture_pattern}}

**Key Domains:**
1. **{{domain_1}}** — {{description}}
2. **{{domain_2}}** — {{description}}

**What Makes This Special:**
- {{unique_value_1}}
- {{unique_value_2}}

**Scale:**
- **MVP:** {{mvp_scale}}
- **Growth:** {{growth_scale}}

<!-- e.g.
TaskFlow is a B2B platform for managing distributed teams. The system handles task management, real-time collaboration, and team analytics.

**Architecture:** Modular Monolith (pattern chosen based on team size and requirements)

**Key Domains:**
1. **Task Management** — CRUD, assignments, status workflow
2. **Team** — Users, roles, permissions

**What Makes This Special:**
- Real-time sync without WebSockets (smart polling)
- Formula-based task prioritization

**Scale:**
- **MVP:** 100 teams, 10K tasks
- **Growth:** 1000 teams, 100K tasks
-->

---

## Success Criteria

### MVP Success
- {{criterion_1}}
- {{criterion_2}}

### Growth Success
- {{criterion_1}}
- {{criterion_2}}

---

## AI-Specific Considerations (Optional)

> **Note:** Only for AI/ML/RAG systems. Skip for traditional applications.

### AI Quality Targets

| Metric | MVP Target | Growth Target | Measurement |
|--------|-----------|---------------|-------------|
| Accuracy | {{percentage}} | {{percentage}} | {{method}} |
| Hallucination Rate | < {{threshold}}% | < {{threshold}}% | {{method}} |
| Response Latency | < {{time}}s (p95) | < {{time}}s (p95) | {{tool}} |
| Context Relevance | {{percentage}} | {{percentage}} | {{method}} |

<!-- Example for RAG system:
| Metric | MVP Target | Growth Target | Measurement |
|--------|-----------|---------------|-------------|
| Accuracy | 85% | 95% | Gold dataset (100 Q&A pairs) |
| Hallucination Rate | < 5% | < 1% | Manual review + TruLens |
| Response Latency | < 3s (p95) | < 2s (p95) | APM monitoring |
| Context Relevance | 80% | 90% | RAG Triad metrics |
-->

### System Boundaries

**What the AI Should Do:**
- {{capability_1}} — {{description}}
- {{capability_2}} — {{description}}
- {{capability_3}} — {{description}}

**What the AI Should NOT Do:**
- {{limitation_1}} — {{reason}}
- {{limitation_2}} — {{reason}}
- {{limitation_3}} — {{reason}}

<!-- Example for RAG system:
**What the AI Should Do:**
- Answer questions about product documentation — Using only official docs as source
- Provide code examples from docs — With proper attribution and links
- Cite sources for every answer — Show which doc section was used
- Admit when information is not available — "I don't have information about that"

**What the AI Should NOT Do:**
- Answer questions outside documentation scope — Redirect to support/community
- Generate code not present in docs — Risk of hallucinations
- Provide opinions or recommendations — Stick to factual information only
- Make assumptions about user's context — Ask clarifying questions
-->

### Feedback & Improvement

**User Feedback Mechanisms:**
- {{mechanism}} — {{purpose}} — {{how_used}}
- {{mechanism}} — {{purpose}} — {{how_used}}

**Model Improvement Process:**
- {{approach}} — {{frequency}} — {{who_responsible}}
- {{approach}} — {{frequency}} — {{who_responsible}}

<!-- Example:
**User Feedback Mechanisms:**
- Thumbs up/down on answers — Track satisfaction, identify problem areas — Weekly review
- "Report incorrect answer" button — Flag hallucinations — Immediate review queue
- Copy answer to clipboard — Track which answers are most useful — Monthly analysis

**Model Improvement Process:**
- Weekly review of flagged answers — Update gold dataset — ML team
- Monthly retraining on updated documentation — Improve accuracy — ML team
- Quarterly review of system boundaries — Adjust scope — Product team
-->

---

## Product Scope

### MVP — Minimum Viable Product

**{{Domain_1}}: {{domain_name}}**

Core capabilities:
- {{capability_1}} — {{brief_description}}
- {{capability_2}} — {{brief_description}}
- {{capability_3}} — {{brief_description}}

Key user flows:
1. **{{flow_name}}:** {{user_action}} → {{system_response}} → {{outcome}}
2. **{{flow_name}}:** {{user_action}} → {{system_response}} → {{outcome}}

**{{Domain_2}}: {{domain_name}}**

Core capabilities:
- {{capability_1}} — {{brief_description}}
- {{capability_2}} — {{brief_description}}

Key user flows:
1. **{{flow_name}}:** {{user_action}} → {{system_response}} → {{outcome}}

<!-- Example:
**Task Management:**

Core capabilities:
- Task CRUD — Create, read, update, delete tasks with title, description, due date
- Task Assignment — Assign tasks to team members, reassign, unassign
- Status Workflow — Move tasks through todo → in_progress → done states

Key user flows:
1. **Create Task:** User fills form → System validates → Task created → Assignee notified → Task appears in list
2. **Complete Task:** User clicks "Done" → System updates status → Team sees update → Analytics updated
-->

### Growth Features (Post-MVP)

**Phase 2:**
- {{feature}} — {{why_important}} — {{business_value}}
- {{feature}} — {{why_important}} — {{business_value}}

**Phase 3:**
- {{feature}} — {{why_important}} — {{business_value}}

<!-- Example:
**Phase 2:**
- Task Templates — Reduce repetitive task creation — Save 30% time for recurring workflows
- Task Dependencies — Model complex workflows — Enable project management use cases

**Phase 3:**
- Recurring Tasks — Automate periodic work — Expand to operations teams
- Time Tracking — Measure effort — Enable billing use cases
-->

### Out of Scope

**Never:**
- {{item}} — {{reason_why_never}}
- {{item}} — {{reason_why_never}}

**Not Now (Future):**
- {{item}} — {{why_later}}
- {{item}} — {{why_later}}

<!-- Example:
**Never:**
- Time tracking — Use external tools (Toggl, Harvest) - not core competency
- Gantt charts — Too complex for target users (small teams)
- Resource management — Out of product vision

**Not Now (Future):**
- Mobile app — Focus on web first, mobile in Phase 3 after PMF
- Integrations — Wait for user demand, prioritize after MVP
- Advanced reporting — Basic analytics in MVP, advanced in Phase 2
-->

---

## Requirements

> **Source of Truth:** All detailed Functional and Non-Functional Requirements are maintained in `requirements.md`.

→ **Requirements Document:** `docs/requirements/requirements.md`

### Requirements Summary

**Functional Requirements:** {{total_fr_count}} requirements across {{domain_count}} domains
- {{domain_1}}: {{fr_count}} requirements ({{p0_count}} P0, {{p1_count}} P1)
- {{domain_2}}: {{fr_count}} requirements ({{p0_count}} P0, {{p1_count}} P1)

**Non-Functional Requirements:** {{total_nfr_count}} requirements
- Performance: {{nfr_count}} requirements
- Security: {{nfr_count}} requirements
- Scalability: {{nfr_count}} requirements

**Priority Breakdown:**
- P0 (Must Have - MVP): {{p0_count}} requirements
- P1 (Should Have - Growth): {{p1_count}} requirements
- P2 (Nice to Have - Vision): {{p2_count}} requirements

<!-- Example:
**Functional Requirements:** 23 requirements across 3 domains
- Task Management: 12 requirements (8 P0, 4 P1)
- User Management: 6 requirements (5 P0, 1 P1)
- Notifications: 5 requirements (2 P0, 3 P1)

**Non-Functional Requirements:** 8 requirements
- Performance: 3 requirements
- Security: 3 requirements
- Scalability: 2 requirements

**Priority Breakdown:**
- P0 (Must Have - MVP): 15 requirements
- P1 (Should Have - Growth): 8 requirements
- P2 (Nice to Have - Vision): 0 requirements
-->

---

## Critical Business Rules

1. **{{rule_name}}** — {{description}}
2. **{{rule_name}}** — {{description}}

<!-- e.g.
1. **One User = One Task Owner** — Task can have only one assignee at a time
2. **Status Flow** — Tasks follow: todo → in_progress → done (no skip)
-->

---

## Glossary

| Term | Definition |
|------|------------|
| {{term}} | {{definition}} |

---

## References

→ **Requirements (Source of Truth for FR/NFR):** `docs/requirements/requirements.md`  
→ **Architecture:** `docs/architecture.md`  
→ **Coding Standards:** `docs/coding-standards/README.md`

---

## Document Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | {{date}} | {{author}} | Initial PRD |

<!-- Example:
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-15 | @pm | Initial PRD created from requirements |
| 1.1 | 2026-01-20 | @pm | Added AI-specific considerations |
| 1.2 | 2026-01-25 | @architect | Updated requirements summary after architecture |
-->
