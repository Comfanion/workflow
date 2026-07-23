# Standards Extraction — checklist

## Sampling

- [ ] Sampled recent + high-traffic files per axis — not the whole tree, not one file.
- [ ] Axes covered where the repo has the surface: naming, error handling, layering/imports, logging, test structure, API/DB idioms.
- [ ] Sampling note records what was read.

## Per candidate

- [ ] Threshold applied: ≥5 occurrences AND ≥80% → candidate; 50–80% → contested; else dropped.
- [ ] Rule phrased do/don't (per `authoring-standards` format).
- [ ] Evidence: count + 2-3 file:line citations.
- [ ] Exceptions cited or "none found".
- [ ] Target artifact named (standards/<topic>.md).
- [ ] Contested entries record both variants + drift direction if newest files lean one way.

## Output discipline

- [ ] Single artifact at `{DOCS_ROOT}/standards/candidates.md`, frontmatter `status: draft`, `provenance: inferred`.
- [ ] Nothing asserted as a standard; no standards/<topic>.md written by this skill.
- [ ] Dropped accidents listed one-line each (reviewer context).
