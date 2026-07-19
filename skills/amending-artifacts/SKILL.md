---
name: amending-artifacts
description: Use when changing an artifact that already exists under {DOCS_ROOT} — "update the architecture doc", "amend the PRD", "fix this section of the standard", "the doc says X but reality is Y". The pipeline's templates cover generating documents; this covers amending them — locate the owning section, make the minimal diff, preserve everything else, record the change, and never silently contradict an accepted ADR. Also owns the provenance promotion rule (a human-reviewed `inferred` doc becomes `inferred-reviewed`). Do NOT use for: creating a new artifact (the artifact's authoring skill and its template); deciding WHICH docs a fix invalidated (`doc-impact` decides, this executes); changing a standards rule (`authoring-standards` — its review gate applies on top of these mechanics); reversing an architectural decision (`adr-writing` — supersede, never edit the old record).
---

# Amending Artifacts

The pipeline knows how to *generate* a document from a template. Amending is different work: the document already carries approved decisions, accumulated context, and cross-links — regenerating it from the template destroys all of that to change one section, and produces a whole-file diff no human can meaningfully review. The discipline here is surgical: the smaller the diff, the more reviewable the change and the more trustworthy everything that did not move.

## The rules

1. **Locate before writing.** Find the owning doc via the dedup grep (`using-comfanion` §Dedup — frontmatter `type` + `domain`). Amend the found doc; never create a sibling because searching felt slow.
2. **Minimal diff.** Touch only the invalidated section. Unchanged sections are evidence of stability, not noise to rewrite. If the edit wants to spill into three sections, stop — that is a redesign, take it to the artifact's authoring skill.
3. **Record the change.** Bump the frontmatter `timestamp`; append a row to the document's changelog table where the artifact keeps one (see `changelog` for the document-changelog rules). An amendment nobody can date is a mystery, not a record.
4. **ADR consistency — the one hard prohibition.** If the amendment contradicts an accepted ADR: stop. Supersede the ADR first via `adr-writing`, then amend and link the new record. A document that quietly disagrees with its own decision log is worse than a stale one — readers cannot tell which is lying.
5. **Preserve links.** The doc is a node in the cross-link graph (OKF §5). If a section moves or a heading changes, fix inbound references (`grep` the path) rather than orphaning them.

## Status and provenance transitions

Amending often changes what the metadata claims:

- `draft → approved` — only the artifact's owner flips this, not the amender.
- `provenance: inferred → inferred-reviewed` — flips when a human has verified the inferred content; this amendment *is* the review's record. Never flip it as a side effect of an unrelated edit.
- Approved content invalidated by reality → the finding routes through `doc-impact` first; this skill executes the resulting `amend` action.

## Roles

Cross-cutting mechanics — any role amends docs; `doc-impact` is the usual dispatcher, `refactoring` and the small-change flow's amend phase the usual callers. For standards artifacts, `authoring-standards`' review-before-propagation gate applies on top.

## Related

- `doc-impact` — decides which docs need amending; this skill executes.
- `authoring-standards` — the extra gate when the artifact is a standard.
- `adr-writing` — supersede path when an amendment collides with a recorded decision.
- `changelog` — the document-changelog row format.
- `using-comfanion` — dedup grep and the OKF frontmatter this skill updates.
