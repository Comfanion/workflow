---
name: codebase-archaeology
description: Use when landing in a brownfield codebase with missing or untrusted docs and the structure must be inferred from source — "onboard me to this repo", "map this codebase", "what are the modules here", "reverse-engineer the architecture", "where are the entry points", "propose unit docs for this project". Entry skill of the `onboarding` flow. Produces an evidence-backed survey — languages, build/entry points, module boundaries, dependency direction, data layer, test layout — plus a proposed unit list, every claim carrying a path or file:line citation and the whole artifact marked `provenance: inferred`. This is the evidence-gathering step: its output feeds `service-architecture` in describe-AS-IS mode and `unit-writing` for the proposed units. Do NOT use for: writing the architecture document itself (`service-architecture` — archaeology digs, architecture describes); inferring coding conventions rather than structure (`standards-extraction` — the sibling that reads style, not shape); designing a NEW system (`system-architecture` / `service-architecture` in design mode); debugging a specific failure (`systematic-debugging`).
---

# Codebase Archaeology

The architecture skills are written for *deciding*; this one is for *discovering*. An existing repo with no docs is not a blank slate — it is a finished set of decisions nobody wrote down. Before comfanion can work on such a project, someone has to go from 40k lines of source to "here are the modules, here is what owns what" — and that inference step, done casually, produces the confident-sounding fiction that poisons every downstream artifact.

## Evidence, not opinion

Every claim in the survey cites its source — a path, a `file:line`, a manifest entry, an import statement. A claim you cannot cite becomes an **open question with an owner**, not an assertion (the same "never invent" rule the architecture skills carry). The survey ships with `provenance: inferred` in its frontmatter: nothing downstream builds on it until a human has reviewed it and flipped it to `inferred-reviewed` (the gate rule in `using-comfanion` §Artifact metadata).

## Depth scales with size

| Size | Survey depth |
|------|--------------|
| TOY / SMALL | Pass 1 + entry points only — inventory, one paragraph of structure |
| MEDIUM | + full module map, dependency direction, proposed unit list |
| LARGE | + per-domain dependency direction, data-ownership table |

## The four passes

### Pass 1 — Inventory

Languages and their proportions; build/manifest files (`go.mod`, `package.json`, `pyproject.toml`, Makefile, Dockerfiles); executables and entry points (`main`, servers, CLIs, cron/workers); external dependencies worth naming (frameworks, drivers, clients); config surface (env vars, config files, flags).

### Pass 2 — Structure

Directory-to-module hypothesis: which directories behave as modules (own naming, low cross-imports)? Import-graph direction: who imports whom — observed, not decreed; note where the direction is consistent (a de-facto layering) and where it tangles. Data-ownership signals: which code writes each table/store/topic; shared writers are a finding, not a detail.

### Pass 3 — Test layout

Frameworks in use; where tests live relative to code; what is covered vs bare (a rough map is enough — name the bare zones). This map is what `refactoring` later reads to decide where characterization tests are needed.

### Pass 4 — Proposed unit list

Boundary candidates as an Owns / Uses / Provides sketch per candidate, sized against `unit-writing`'s unit types. This is a *proposal* for the human review — expect it to be corrected; that is the review working, not the survey failing.

## Handoffs

- `service-architecture` — describes the AS-IS design from this survey (its brownfield mode).
- `unit-writing` — per-unit docs, starting from the proposed unit list.
- `standards-extraction` — the sibling pass over conventions; run it alongside, not instead.
- `doc-todo` — every open question the survey could not close.

## Roles

The researcher lens — dig and cite, do not judge or redesign. Divergences from good practice are recorded as findings for the human review, never fixed in passing.

## Related

- `service-architecture` — consumes the survey in describe-AS-IS mode.
- `unit-writing` — consumes the proposed unit list.
- `standards-extraction` — conventions sibling.
- `using-comfanion` — the provenance field and its gate rule.
