---
name: authoring-standards
description: Author or update a single standards artifact correctly — write it in the canonical standards source, state rules (not runnable artifacts), cite the governing ADR, keep it platform-wide, record the change, and put it through review before it propagates. Use whenever the user adds or changes a coding/architecture/testing/security/performance/api/database/git standard, consolidates a rule scattered across places into the one source, or mentions "update the standard", "add a standard", "write the coding standard". This is the cross-cutting discipline every `standards-<topic>` author obeys — the `standards` umbrella decides which artifacts exist; this decides how each one is written.
---

# Authoring Standards

Write or update a standard **in the project's canonical standards source**, in its format, through review. A standard is a commitment every implementer inherits and every reviewer enforces — a change here propagates to every consumer, so the bar is high. This skill is the discipline shared by all the `standards-<topic>` authoring skills; it does not write any one topic — it governs how each is written.

## The rules

1. **Single source of truth.** Author the standard only in the canonical source (`{DOCS_ROOT}/standards/<topic>.md` by default). Don't create a parallel copy. Scattered copies get consolidated *into* it, then the old locations point at it.
2. **Review required.** A standards change needs the owning role's approval (architect / tech lead; solo — your own deliberate gate) before it propagates, always via the source's change process (a pull/merge request), never a silent direct edit.
3. **Rules only — no runnable artifacts.** The standards source holds *documents that state rules*. Runnable artifacts — linter/formatter configs, Dockerfiles, CI jobs, `.env`, a service skeleton — live in the project's reference/boilerplate location, not in the standard. Pasting a copy here duplicates the boilerplate and drifts. A standard *references* the artifact and states the rule it must satisfy.
4. **Cite the governing decision.** Every rule that traces to a decision links its ADR with a direct link (see `adr-writing`). The standard states the rule; the ADR holds the *why* and is the source of truth — if they disagree, fix the standard. A proposed-but-undecided rule ships as `Draft`, never `Active`.
5. **Platform-wide only.** The source is shared by every implementer. A rule true for one service, or one module's tables/contracts/choices, belongs in that service's or module's docs (`service-architecture`), not here.
6. **Record the change.** Version the document and record it in the standards index/changelog so consumers know what moved and can bump their pinned reference.
7. **Make it section-addressable.** A standard is read by different roles at different times — the architect wants the contract-shape and topology decisions at design time, the developer wants the concrete how-to-implement rules at build time, the reviewer wants the gates. Open the document with a short **Reading guide**: a table mapping each consumer (designing → architect / planner, implementing → dev, reviewing → reviewer) to the sections it needs. Keep the sections stable and the guide in sync whenever you add or move one. This lets a consumer load only the rules its altitude needs instead of the whole document — the doc stays one file and one source of truth; the guide just makes its parts addressable.

## Document format

Match the canonical source's existing format — typically a short versioned header (version, date, status), a **Reading guide** (rule 7), then concrete-rule sections. Write concrete-rule documents (do / don't, with examples), not essays. Match the structure, depth, and language of the file you are editing; each `standards-<topic>` skill carries the section layout and the Reading guide for its topic in `references/template.md`, and an entry in the `{DOCS_ROOT}/standards/README.md` index routes readers to the document.

## Process

1. **Confirm it's platform-wide** (rule 5). Service- or module-specific rules go in that unit's docs, not the shared source.
2. **Find the right home** — extend the existing topic document, or add a new one and route to it from the index. Don't duplicate a rule the source already states.
3. **Write in the source's format** — versioned header, concrete rules with examples, and a direct link to the governing ADR for every decision-shaped rule.
4. **A runnable artifact?** It does not belong here — change it in the reference/boilerplate location, and have the standard reference it and state the rule it must meet.
5. **Record and submit for review** — update the index/changelog and route the change through review. Never merge your own standard unreviewed; consumers pick it up by bumping their pinned reference.

## Consolidating scattered standards

When a rule lives in more than one place: bring the unique content **into the canonical source**, then point the old locations at it. Don't leave two homes — reconcile and link.

## Never invent

Don't assert a rule the team hasn't agreed — a standard is a commitment every implementer inherits. A proposed-but-undecided rule ships as `Draft` and is raised for ratification, never as `Active`. Inferred candidates arrive the same way: `standards-extraction` delivers them as `Draft` proposals in `candidates.md`, and ratification here is what promotes a candidate into the standard.

## Related

- `standards` — the umbrella that decides which artifacts a project needs and routes to each topic author.
- The per-topic authors `standards-coding` / `-testing` / `-security` / `-performance` / `-api` / `-database` / `-git` / `-temporary-decisions` / `-events` / `-observability` — each writes one topic in its format; this skill is the cross-cutting discipline they all obey.
- `using-standards` — how implementers consume what you author here.
- `adr-writing` — the governing ADR each decision-shaped rule cites; author the decision there, then cite it from the standard.
