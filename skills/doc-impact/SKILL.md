---
name: doc-impact
description: Use after any fix, hotfix, or refactor lands — before the work is called done — to decide which existing artifacts the root cause invalidated and declare it in a typed verdict file. A bug is evidence that some document lied — a wrong assumption in architecture.md, a shortcut missing from temporary-decisions.md, an invariant absent from coding.md, an acceptance criterion the regression test just proved was never declared. Iron Law is absolute — NO FIX IS COMPLETE WITHOUT A DECLARED DOC-IMPACT VERDICT; `none` IS A WRITTEN, HUMAN-VISIBLE DECISION, NEVER A DEFAULT. Trigger phrases: "doc impact", "which docs does this fix invalidate", "close out this bugfix/refactor"; invoked as the mandatory closing phase of the bugfix, small-change, and refactor flows and from systematic-debugging Phase 4. Do NOT use for: making the amendments themselves (`amending-artifacts` edits the doc, this skill only decides which); recording the code change (`changelog`); logging a new shortcut mid-implementation (`standards-temporary-decisions` directly); the overall completeness gate (`verification-before-completion` reads this verdict, it does not produce it).
---

# Documentation Impact

Documentation does not rot when it is written — it rots when the code moves and nobody says so. The greenfield pipeline writes correct docs once; then months of fixes silently invalidate them, one hotfix at a time, until the docs are a liability that misleads every downstream decision. Each individual omission felt too small to record. That compounding is the failure this skill stops.

The role best positioned to catch it is the one who just found the root cause: at that moment, "which document was wrong?" has an obvious answer. A week later it has none.

This skill is rigid.

## The Iron Law

```
NO FIX IS COMPLETE WITHOUT A DECLARED DOC-IMPACT VERDICT —
`none` IS A WRITTEN DECISION, NEVER A DEFAULT
```

The verdict file exists for every closed fix, hotfix, and refactor. "The fix was tiny, there's nothing to update" is the exact thought this law exists to stop — if that is true, it costs one paragraph to say so in a `verdict: none` file, and the paragraph is what makes the skip deliberate instead of silent. Skipping the phase itself is protected (`protected.yaml#doc-impact`).

## The mapping table — root-cause class → target artifact

| The root cause was… | Target artifact | Action |
|---------------------|-----------------|--------|
| A wrong assumption in the design | `architecture.md` / unit doc | `amend` via `amending-artifacts` |
| A conscious shortcut, previously unrecorded | `standards/temporary-decisions.md` | `td-entry` with cost, trigger, deadline |
| A new invariant the fix revealed | `standards/coding.md` (or the matching sibling) | `standards-rule` via `authoring-standards` |
| The regression test proves a criterion no story declared | the story / AC file | `ac-update` |
| A recorded decision that reality contradicted | the ADR | `adr-supersede` via `adr-writing` |
| An operational surprise (deploy, config, recovery) | runbook / `service-deployment` doc | `amend` |

One root cause can hit several rows. Zero rows hit → `verdict: none`, with the paragraph saying why.

## Procedure

1. **Name the root cause in one sentence.** If you cannot, the fix is not done — go back to `systematic-debugging`.
2. **Find the candidate docs.** Grep `{DOCS_ROOT}` frontmatter by the affected `domain` (the same dedup grep as `using-comfanion` §Dedup) — do not read all of docs/.
3. **Walk the mapping table** against each candidate: did this root cause make that document wrong or incomplete?
4. **Write the declaration** (schema below) — every impact, or the justified `none`.
5. **Execute or hand off** each impact: small amendments via `amending-artifacts` now; larger ones to their owner skill, with the impact left `status: pending` so it is visibly unfinished.

## The declaration — typed schema

Machine-parseable on purpose: a runtime (or a grep) must be able to answer "which fixes declared impacts that were never executed". Written to `doc-impact.md` next to the work item (`{DOCS_ROOT}/bugs/<id>/`, `changes/<id>/`, `refactors/<id>/`).

```yaml
---
type: doc-impact
title: <one line — what fix this closes>
domain: <same domain axis as the fixed code>
status: declared          # declared | executed
timestamp: <ISO 8601>
trigger:
  kind: bugfix            # bugfix | hotfix | refactor
  ref: <commit sha | story id | bug report path>
verdict: amendments       # none | amendments
impacts:                  # empty list iff verdict: none
  - artifact: <repo-relative path>
    reason: <one sentence — what the root cause invalidated>
    action: amend         # amend | td-entry | standards-rule | ac-update | adr-supersede
    status: pending       # pending | done
---
```

Body: one paragraph per impact. A `verdict: none` file still carries one paragraph — *why* nothing was invalidated. `status: executed` only when every impact is `done`.

## Red flags — you are about to let a doc rot

- "Nothing to update" — said without walking the mapping table.
- "I'll do the docs later" — later has no memory of the root cause.
- "The TD entry can wait" — an unrecorded shortcut is the next incident's surprise.
- "The docs were already wrong anyway" — that is an impact, not an excuse.
- Closing a bug report whose `doc-impact.md` does not exist.

## Roles

The analyst lens, run by whoever found the root cause — usually the developer at the end of the debugging loop. The reviewer distrusts any closed fix without a verdict file; `verification-before-completion` counts the declared verdict as part of a fix's completion evidence.

## Related

- `amending-artifacts` — executes the `amend` actions this skill declares.
- `systematic-debugging` — Phase 4 hands off here; the root-cause sentence is the input.
- `standards-temporary-decisions` — receives `td-entry` actions.
- `authoring-standards` / `adr-writing` — receive `standards-rule` / `adr-supersede` actions.
- `verification-before-completion` — the gate that reads this verdict before "done".
