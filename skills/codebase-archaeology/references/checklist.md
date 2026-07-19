# Codebase Archaeology — checklist

## Discipline

- [ ] Every claim cites a path / file:line / manifest entry.
- [ ] Anything uncitable is an open question with an owner — not an assertion.
- [ ] Frontmatter carries `provenance: inferred`, `status: draft`.
- [ ] Depth matches size (TOY/SMALL: pass 1 + entry points; MEDIUM+: all four passes).

## Pass 1 — Inventory

- [ ] Languages with rough shares; build/manifest files listed.
- [ ] Every executable entry point found (main, servers, CLIs, workers, cron).
- [ ] Key external dependencies and config surface named.

## Pass 2 — Structure

- [ ] Directory-to-module hypothesis with one line of evidence per candidate.
- [ ] Import direction mapped; consistent layering vs tangles distinguished.
- [ ] Every store/table/topic has its writer(s) identified; shared writers flagged.

## Pass 3 — Tests

- [ ] Frameworks + location convention recorded; bare zones named.

## Pass 4 — Units

- [ ] Each candidate has Owns / Uses / Provides + evidence.
- [ ] Candidates sized against `unit-writing`'s unit types.

## Handoff

- [ ] Findings recorded (not fixed); open questions → `doc-todo`.
- [ ] `standards-extraction` run (or scheduled) as the conventions sibling.
