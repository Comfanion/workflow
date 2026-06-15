# Coding Standards — Validation Checklist

Walk this list before declaring `docs/standards/coding.md` done. A "yes" needs evidence (the section / the example); a "no" is a fix-now item.

## Coverage

- [ ] Section 1 — Project structure: directory tree present, every top-level dir has a one-line purpose.
- [ ] Section 2 — Naming: table present and covers files, types, functions, variables, constants, booleans, tests.
- [ ] Section 3 — Code organization: layering listed; dependency direction stated as a written rule.
- [ ] Section 4 — Error handling: error types + wrapping example present.
- [ ] Section 5 — Dependencies: approved table and forbidden list; every forbidden entry names an alternative.
- [ ] Section 6 — Critical rules: short numbered list (≤7 items).

## Quality

- [ ] Every rule has at least one short example.
- [ ] No section overlaps with sibling artifacts (testing / security / performance / api / db / git / temp-decisions).
- [ ] Naming table matches the existing codebase (sampled at least three files).
- [ ] Dependency direction matches the architecture document.

## Hygiene

- [ ] File size 8-15 KB.
- [ ] Cross-links to sibling standards listed at the bottom.
- [ ] No placeholders (`{{...}}`) left unfilled.
