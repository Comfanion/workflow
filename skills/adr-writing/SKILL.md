---
name: adr-writing
description: Write, update, or supersede an Architecture Decision Record (ADR) — capture the context and forces behind a significant technical choice (database, framework, pattern, API design, major library), the options weighed, the decision made, and its consequences. Use this whenever the user wants to record an architecture decision, write an ADR, justify "why we chose X over Y", supersede an earlier decision, or mentions "ADR", "architecture decision record", or "decision log". An ADR captures a single decision and its rationale — keep broad system design, requirements, and task breakdowns out of it (they live in other documents).
---

# ADR Writing

An ADR records one architectural decision: the situation that forced a choice, the options weighed, the option taken, and the consequences you now own. It exists so a future reader — including future you — can reconstruct *why* the system is the way it is without archaeology through commit logs and chat history.

Write an ADR for decisions with long-term, hard-to-reverse consequences. The most common failure is writing the decision but not the forces behind it: a record that says "we use PostgreSQL" without the tensions that made it the right call is almost worthless six months later, because the reader can't tell whether the reasoning still holds. Capturing the forces and the rejected options is the single most important thing this skill enforces.

## When to write an ADR

Write one when the decision shapes the system and would be expensive to undo. Skip it for choices that are local, easily reversed, or governed by an existing standard.

| Decision | ADR? |
|----------|------|
| Database choice | Yes |
| Framework choice | Yes |
| Architecture pattern (e.g. event-driven, CQRS) | Yes |
| API design decision (versioning, contract shape) | Yes |
| Major library with lock-in | Yes |
| Minor utility library | No — too easily swapped |
| Code style / formatting | No — that belongs to coding standards |

The test: if someone later asks "why did we do it this way?" and the honest answer involves tradeoffs, write the ADR.

## What an ADR contains

An ADR captures, in order:

- **Header** — id, status, date, deciders, and `supersedes` if it replaces an earlier ADR.
- **Context** — the situation and the problem, why a decision is needed *now*, plus the **Forces** (the tensions pulling in different directions) and the **Constraints** (the hard limits you can't negotiate).
- **Decision** — one bold, unambiguous statement of what will be done, followed by a sentence on what it means in practice.
- **Options Considered** — at least two real options, each with a short description and a pros/cons table; mark the chosen one and state why it won.
- **Consequences** — grouped as Positive, Negative, and Risks (each risk paired with its mitigation).
- **Implementation Notes** — optional, only if there is concrete guidance the implementer needs.
- **References** — links to the broader architecture document, related ADRs, and the parts of the system this decision affects.

The Forces and the rejected options are not decoration. A decision without its forces can't be re-evaluated when conditions change; a decision with no alternatives reads as if nothing else was considered, which undermines trust in the choice.

## How to write it

1. Confirm the decision is ADR-worthy against the table above. If it isn't, point the user to the right home (coding standards, a code comment, or just the code itself) instead of producing a record that adds noise.
2. Load the template at `references/template.md` — load it when you start drafting; it carries the full section structure with worked examples inline. Fill every `{{placeholder}}` and remove the commented example blocks.
3. State the forces honestly, including the ones that argued *against* the chosen option. An ADR that only lists forces supporting the decision is advocacy, not a record.
4. Write the Decision as a single declarative sentence in bold. If you can't state it in one sentence, the decision isn't crisp enough yet.
5. Include at least two genuine options. A throwaway strawman alternative fools no one — if there really was only one viable path, say so in the rationale rather than inventing a fake contender.
6. Make consequences honest on both sides. Every real decision has a downside; an ADR with only positive consequences is hiding something.
7. Assign the next sequential id (`ADR-001`, `ADR-002`, …) and write the record to `{DOCS_ROOT}/architecture/adr/ADR-<NNN>-<short-title>.md` (e.g. `ADR-001-postgresql-database.md`).

`{DOCS_ROOT}` defaults to `docs/` at the project root; honor the project's configured docs location if one is set.

## Reference format

Within the References section, prefix every cross-reference with `→` so links are visually consistent and easy to scan:

```markdown
→ Architecture: `{DOCS_ROOT}/architecture.md`
→ Related ADR: `ADR-002`
→ Affected component: `Task`
```

## Lifecycle and superseding

An ADR moves through `proposed → accepted → deprecated`, and a separate branch to `superseded` when a later decision replaces it:

```
proposed ──► accepted ──► deprecated
                │
                └──► superseded (by a new ADR)
```

Never edit an accepted ADR's decision in place to reflect a change of mind — that erases the historical record, which is the whole point. Instead, write a new ADR and link the two:

1. Create the new ADR capturing the new decision.
2. Add `supersedes: ADR-<old>` to the new ADR's header.
3. Set the old ADR's status to `superseded` and add `superseded_by: ADR-<new>` to its header.

This keeps the chain readable: anyone landing on the old ADR is routed forward, and anyone on the new one can trace back to what it replaced.

## Quality bar

Before considering the ADR done, confirm:

- **Context explains the problem**, not just the solution — a reader who knows nothing about the situation can follow why a decision was needed.
- **Forces describe real tensions**, including those against the chosen option.
- **The decision is one clear statement**, not a paragraph of hedging.
- **At least two options were genuinely considered**, the chosen one is marked, and the rationale explains why it won.
- **Consequences cover positives and negatives**, with each risk paired to a mitigation.
- **References use the `→` format** and link to the affected parts of the system.

If any of these fail, return to the relevant section above and fix it before publishing — an incomplete ADR is worse than none, because it looks authoritative while hiding the reasoning.

## Roles

This skill is written for whoever holds the architecture role on the work (on a team, the architect or tech lead; solo, you). The deciders named in the header are the people accountable for the choice; downstream, the implementing role turns the decision into code, and a reviewer checks the record holds up before it is accepted.

## Related

- `system-architecture` / `service-architecture` — the broader designs whose decisions an ADR records and is linked back from; an architecture doc *names* a pattern and links its ADR rather than re-deciding it inline.
- `standards` / `authoring-standards` — a standard **cites its governing ADR**: the ADR holds the *why* and is the source of truth, the standard states the rule. If a standard and its ADR disagree, the ADR wins — fix the standard. A decision that recurs across the codebase graduates from a per-case ADR into a standard.
- `using-standards` — consumers follow the standard and open the linked ADR only when they need the rationale.
