---
name: standards-extraction
description: Use when a project's de-facto conventions must be inferred from existing code because no standards documents exist or none can be trusted — "what conventions does this codebase follow", "extract the coding standards", "infer the test style", "what's the error-handling pattern here", "bootstrap standards for this brownfield repo". Part of the `onboarding` flow, sibling of `codebase-archaeology`. Reads real code and separates convention from accident with a frequency threshold, then emits CANDIDATE rules flagged for human review — never asserted standards: each candidate carries evidence count, citations, exceptions, and a confidence class, in a single `provenance: inferred` artifact that the `standards-*` authoring skills consume for ratification. Do NOT use for: authoring or ratifying a standard (`authoring-standards` + the matching `standards-<topic>` skill — extraction proposes, they decide); inferring structure rather than style (`codebase-archaeology` — the sibling that reads shape, not conventions); consuming standards during work (`using-standards`); deciding which standards artifacts the project needs (`standards` umbrella).
---

# Standards Extraction

Every `standards-*` skill authors rules *to be followed*. A brownfield repo poses the inverse problem: the code already follows rules nobody wrote down — mixed with accidents that only look like rules. Extracting the difference matters because an accident asserted as a standard is worse than no standard: it ratifies noise, and every future review enforces it.

## Convention vs accident — the frequency threshold

Checkable, not vibes:

| Observation | Class |
|-------------|-------|
| ≥5 occurrences AND ≥80% consistency | **candidate** convention |
| 50–80% consistency | **contested** — record both variants, flag for a human decision |
| <50% consistency or <3 occurrences | accident — drop it |

Recency tiebreak: when the newest files consistently use one variant, note the drift direction — the team may already be migrating, and the candidate should follow where they are going, not where they were.

## What to sample

Per axis, sample recent + high-traffic files — not the whole tree:

- **Naming** — files, types, functions, packages/modules.
- **Error handling** — wrap/annotate style, sentinel vs typed errors, panic policy.
- **Layering/imports** — who may import whom, as observed.
- **Logging** — library, structured or not, what gets logged at boundaries.
- **Test structure** — naming, table-driven or not, fixture style, assertion library.
- **API / DB idioms** — envelope shape, status usage, migration style, query patterns (only where the repo has those surfaces).

## Candidate rule format

Uniform entries, so ratification is a walk down a list:

```markdown
### C-{{NN}} — {{one-line rule, do/don't phrasing}}

- **Evidence:** {{n}} occurrences · {{2-3 file:line citations}}
- **Exceptions:** {{where the code deviates, cited}}
- **Confidence:** candidate | contested ({{variant split if contested}})
- **Target artifact:** standards/{{coding|testing|api|database|…}}.md
```

## Never asserted

The output ships `status: draft`, `provenance: inferred`. It is **not** a standards document and `using-standards` must not consume it as one. Ratification path: human review → the matching `standards-<topic>` skill authors the rule via `authoring-standards` → the candidate entry is removed with a pointer. (Mirrors the temporary-decisions graduate-to-ADR pattern: proposal ledger in, ratified artifact out.)

## Feeding the authors

Map each candidate's target to the `standards` umbrella's artifact table. For a brownfield project the umbrella's decision step starts here: author each topic from ratified candidates, not from scratch — the repo already voted.

## Roles

The architect lens with the researcher's discipline: cite, count, classify — never decree. The human review is where taste enters; extraction only supplies the evidence.

## Related

- `codebase-archaeology` — the structure sibling; run together during onboarding.
- `standards` — umbrella that routes ratified candidates to topic authors.
- `authoring-standards` — the authoring gate every ratified rule passes through.
- `using-standards` — consumer of the *ratified* artifacts, never of candidates.md.
