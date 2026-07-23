# Doc-Impact — verdict checklist

Run at the doc-impact phase of every bugfix / small-change / refactor close-out.

## Preconditions

- [ ] Root cause named in one sentence (from `systematic-debugging` / the refactor scope). Cannot name it → the fix is not done; go back.
- [ ] Candidate docs found via frontmatter `domain` grep — not by reading all of `{DOCS_ROOT}`, not by memory.

## Walk the mapping table — every row, against every candidate

- [ ] Wrong design assumption → `architecture.md` / unit doc (`amend`)?
- [ ] Unrecorded conscious shortcut → `temporary-decisions.md` (`td-entry`)?
- [ ] New invariant revealed → `standards/coding.md` or sibling (`standards-rule`)?
- [ ] Regression test proves an undeclared criterion → story/AC file (`ac-update`)?
- [ ] Reality contradicted a recorded decision → ADR (`adr-supersede`)?
- [ ] Operational surprise → runbook / deployment doc (`amend`)?

## The declaration

- [ ] `doc-impact.md` exists next to the work item, frontmatter complete (`type`, `trigger.kind`, `trigger.ref`, `verdict`, `impacts[]`).
- [ ] `verdict: none` → `impacts: []` AND one justification paragraph. No paragraph = no verdict.
- [ ] `verdict: amendments` → every impact has artifact, one-sentence reason, action, status.
- [ ] Each impact executed now (via `amending-artifacts` / owner skill) or left visibly `pending` — never silently dropped.
- [ ] `status: executed` only when every impact is `done`.
