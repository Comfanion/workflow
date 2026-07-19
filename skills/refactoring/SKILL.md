---
name: refactoring
description: Use for planned, behavior-preserving restructuring that stands on its own — "refactor this module", "untangle X", "extract a layer", "pay down TD-NN", "restructure without changing behavior", "clean up this area before the next feature". This is MACRO refactoring with its own motivation, scope map, and batch plan; it drives the `refactor` flow (FLOW.yaml). Iron Law is absolute: TESTS GREEN BEFORE AND AFTER EVERY BATCH, AND NO BATCH MIXES BEHAVIOR CHANGE WITH STRUCTURE CHANGE. Where coverage is missing, characterization tests come first — you cannot preserve behavior you cannot observe. Do NOT use for: the micro refactor step inside `dev`'s red-green-refactor loop (that cleans code you just wrote, inside the story, under the same tests — no plan needed); fixing wrong behavior (`systematic-debugging` — if behavior is wrong it's a bug, and "refactoring" it is how bugs hide); a change that intentionally alters behavior (`dev`, with a story); reviewing someone else's refactor (`review-complexity` / `code-review`).
---

# Refactoring

A refactor that changes behavior is a bug delivery wearing a cleanup's name — and because the diff is large and "just moves things around", nobody reviews it closely enough to catch it. Behavior preservation is not a vibe; it is an observable property: the same tests pass before and after, every batch, and any batch that cannot prove it gets reverted, not defended.

This skill is rigid.

## The Iron Law

```
TESTS GREEN BEFORE AND AFTER EVERY BATCH —
AND NO BATCH MIXES BEHAVIOR CHANGE WITH STRUCTURE CHANGE
```

Structure moves *or* behavior changes — never both in one batch. A behavior change discovered mid-refactor is a story or a bug, filed separately; a structure change discovered mid-story is this skill, planned separately. Mixing them destroys the one property that makes either reviewable.

## Motivation and scope map first

Name the driver before touching code: a `temporary-decisions.md` entry, the `systematic-debugging` 3-fix rule firing, a measured hot spot, a boundary that blocks the next feature. **No nameable driver → it is churn; stop.** Then draw the boundary — what moves, and what is *explicitly* untouched. "While I'm here" is how a two-day refactor becomes a three-week rewrite; the out-of-scope list is the fence.

Scope artifact: `{DOCS_ROOT}/refactors/<id>/scope.md` for MEDIUM+ or multi-batch work; for a small single-batch refactor the plan lives in the TD entry it pays down.

## Coverage check → characterization tests

Before touching code the tests don't observe, pin the current behavior with characterization tests — including current *bugs*: pin the buggy behavior, log the bug separately (`bugfix` flow), do not fix it mid-refactor. The test layout map from a codebase survey (`codebase-archaeology`), where one exists, says where the bare zones are.

## Batches, green to green

Small ordered batches, each independently shippable, one commit per batch:

1. Full suite green (run it — `verification-before-completion` evidence, not memory).
2. Apply one batch of structure change.
3. Full suite green again. Same tests — updating a test to make it pass is a behavior change in disguise unless the test itself was pinned wrong (then that is its own reviewed batch).
4. Commit. Next batch.

**A batch that won't go green gets reverted, not debugged forward** — the refactoring analog of the 3-fix rule. A genuine bug uncovered by the batch goes to `systematic-debugging` separately, on top of the last green commit.

## Closing the loop

- Mark the paid-down `temporary-decisions.md` entries `resolved` (PR/commit ref).
- Run `doc-impact` — structure moved, so unit docs and architecture likely lie now.
- Changelog entry under Changed.

## Red flags — you have left the process

- "While I'm here…" — scope fence breached.
- "The test was wrong anyway, I'll just update it" — behavior change in disguise.
- "One big batch is faster" — one big unreviewable diff.
- "I'll add the tests after" — you cannot prove preservation retroactively.
- "This bug is trivial, I'll fix it in passing" — file it; fix it separately.

## Roles

The architect lens plans the scope; the developer executes batches; the tester owns the characterization suite; the reviewer runs `review-complexity` + `review-correctness` over the result. Solo, you wear all four — the batch discipline is what keeps the hats separate.

## Related

- `dev` — owns the micro refactor step inside a story; a refactor that outgrows the story's tests and scope belongs here.
- `systematic-debugging` — its 3-fix rule is a common driver; bugs found mid-refactor route there.
- `standards-temporary-decisions` — the ledger this skill reads for drivers and closes on completion.
- `doc-impact` — mandatory close-out; moved structure invalidates docs.
- `test-scenarios` — authoring the characterization cases.
- `verification-before-completion` — every "green" claim in the batch loop is that gate.
