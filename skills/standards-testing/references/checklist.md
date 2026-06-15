# Testing Standards — Validation Checklist

- [ ] Pyramid present, tuned to the stack.
- [ ] Coverage table covers every layer that exists in the architecture.
- [ ] Per-layer reasons given, not just numbers.
- [ ] Every test type lists: location, dependencies, speed budget, what-to-test, canonical pattern.
- [ ] Naming pattern stated for files and for test functions, with two examples.
- [ ] Structure section names a default (AAA or GWT) and shows it.
- [ ] Mocking guidelines name the four standard mock targets (repos, external APIs, time, randomness) and forbid mocking domain.
- [ ] Test-data section covers builders and golden files.
- [ ] Quality gates enumerate every blocker (overall floor, domain floor, race, failure, new-behavior-without-test).
- [ ] File size 8-15 KB.
- [ ] No `{{placeholders}}` left.
