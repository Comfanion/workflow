# ADR-{{N}}: {{title}}

```yaml
id: ADR-{{N}}
status: proposed | accepted | deprecated | superseded
date: {{date}}
deciders: [{{names}}]
supersedes: ADR-{{X}}  # if applicable
```

---

## Context

{{describe_the_situation_and_problem}}

We need to decide {{what_decision_is_needed}} because {{why_decision_is_needed_now}}.

**Forces:**
- {{force_1}} — {{tension_it_creates}}
- {{force_2}} — {{tension_it_creates}}

**Constraints:**
- {{constraint}}

<!-- e.g.
We need to choose the primary database for the Task module. The decision affects data modeling, query patterns, and operational complexity.

We need to decide now because development starts next sprint and database choice impacts schema design.

**Forces:**
- Need ACID transactions for task assignments — pushes toward relational DB
- May need flexible attributes later — pushes toward document DB
- Team expertise is primarily SQL — reduces risk with familiar tech

**Constraints:**
- Must run on existing Kubernetes cluster
- Budget limits exclude managed services over $500/month
-->

---

## Decision

**We will {{chosen_approach}}.**

{{brief_explanation_of_what_this_means_in_practice}}

---

## Options Considered

### Option 1: {{name}}

{{brief_description}}

| Pros | Cons |
|------|------|
| {{pro}} | {{con}} |
| {{pro}} | {{con}} |

### Option 2: {{name}}

{{brief_description}}

| Pros | Cons |
|------|------|
| {{pro}} | {{con}} |

### Option 3: {{name}} ✓ CHOSEN

{{brief_description}}

| Pros | Cons |
|------|------|
| {{pro}} | {{con}} |

**Why chosen:** {{rationale}}

<!-- e.g.
### Option 1: MongoDB

Document database with flexible schema.

| Pros | Cons |
|------|------|
| Flexible schema | No ACID across documents |
| Good for nested data | Team unfamiliar |

### Option 2: PostgreSQL ✓ CHOSEN

Relational database with JSON support.

| Pros | Cons |
|------|------|
| ACID transactions | Schema migrations needed |
| Team expertise | Less flexible than document DB |
| JSON columns for flexibility | |

**Why chosen:** ACID transactions critical for task assignments. Team expertise reduces risk. JSON columns provide flexibility where needed.
-->

---

## Consequences

### Positive
- {{benefit}}
- {{benefit}}

### Negative
- {{drawback}}
- {{mitigation_if_any}}

### Risks
- {{risk}} — mitigated by {{approach}}

---

## Implementation Notes

{{any_specific_guidance_for_implementation}}

---

## References

→ Architecture: `{{path}}`
→ Related ADR: → ADR: `ADR-{{X}}`
→ Affected Units: → Unit: `{{unit}}`
