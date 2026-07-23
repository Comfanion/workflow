---
name: dev
description: Use when the user wants to turn an **already-approved story** into code via a test-driven loop — "implement this story", "start on story E3-S2", "pick up the next approved story", "make the story pass acceptance criteria", "build the epic", "work the sprint", "run the backlog", or asks for "TDD / red-green-refactor". Front-loads study-first: read 2-3 existing examples, design the interface, write the failing test, make it green, refactor, then review — one task at a time, never the whole story in one shot. Iron Law is rigid: **NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST**; code written before its test is deleted and restarted from the test, not "kept as reference". Handles three scopes through the same loop: a single story (core loop), a whole epic (N stories in planned order), a whole sprint (N epics). Precondition: an approved story file must already exist. Do NOT use for: authoring/decomposing epics into stories (`decomposition`); root-causing an already-failing test or a live bug (`systematic-debugging` — fires whenever a red appears that is not the expected RED step of TDD); running the suite as a verification/QA gate (`test-execution`); or one-off "write me a quick function/snippet" with no story behind it.
---

# Dev

This skill turns an approved story into working, reviewed code. The unit of work is one story; an epic is N stories and a sprint is N epics, run through the same loop. The discipline is constant across all three: **study existing code first, design the interface, write the test before the code, keep context minimal.**

`{DOCS_ROOT}` below defaults to `docs/` at the project root; honor the project's configured docs location if one is set.

## The Iron Law

```
NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST
```

The TDD core of this loop is rigid: write the test, watch it fail for the right reason, then write the code. Wrote the code first? Delete it and start from the test — do not keep it "as reference" and adapt it, because adapting it is testing-after wearing a disguise. The only exceptions are throwaway prototypes and generated code, and those are the user's call, not yours. (The STUB-before-test case — a concrete type that must exist before the test compiles — moves the ordering of a *declaration*, not of the implementation; the test-first principle holds.)

## Keep context minimal

The single biggest waste in implementation is loading documents the story already summarizes. Read only:

- the project conventions guide
- the relevant subset of `{DOCS_ROOT}/standards/` — loaded via `using-standards`, which picks the artifacts matching the story's surface (always `coding.md` and `testing.md`; add `security.md`, `performance.md`, `api.md`, `database.md`, `git.md` only when the story touches that surface; consult `temporary-decisions.md` if the story interacts with a known shortcut)
- the **one** story file you are working (in batch modes, the one epic / one story you are on — never all of them at once)

Do **not** read the PRD or the full architecture document. The story already carries its required-reading list and acceptance criteria; the standards artifacts already carry the patterns. Pulling in the PRD or architecture.md balloons context for nothing and crowds out the code you actually need to study. If a story genuinely needs an architecture section, it names that exact section in its Required Reading — read only that.

## Working a single story (core loop)

### 1. Study existing code first (mandatory)

Before writing anything, learn how this codebase already solves similar problems. Search the codebase for a similar feature and read 2-3 real examples, noting:

- how entities / services / handlers are structured
- what error-handling pattern is used
- what test pattern is used (table tests, fixtures, mocking style)
- what imports and dependencies are common

Then load the relevant standards via `using-standards`. **Why first:** code that ignores existing patterns gets sent back in review, and you cannot write a good interface or a good test for a layer you have not seen. This step is what lets every later step be fast and correct.

Capture a short **Study Summary** in the story file: the patterns you will follow (with file paths), and — if tasks can run in parallel — the shared interfaces.

### 2. Design the interface, then plan the batches

Read the story's Required Reading and each task's "Read First", extracting the signatures, constraints, and validation rules. Look at the task list and decide the execution shape:

- **Sequential** when tasks share a file or depend on each other's output.
- **Parallel** only when tasks touch *different files*, share an agreed interface, and have no dependency between them.

When parallel work is possible, **design the shared interface first** — the contract (signatures), the shared request/response types, the error approach. Why first: parallel implementations that agree on an interface integrate cleanly; ones that don't produce merge conflicts and rework. The interface is the thing that makes parallelism safe.

Plan the work as ordered batches:

- **Batch 0 (sequential):** foundation — interfaces, shared types.
- **Batch 1 (parallel if safe):** implementations against that interface, in different files.
- **Batch 2 (sequential):** integration that needs everything above.

Track the tasks using the story's own task IDs (`E{E}-S{N}-T01`, `…-T02`, … and a final `…-Review`) so progress is unambiguous and survives an interruption.

### 3. Execute task by task, test first

Never implement a whole story in one shot. Take one task (or one safe parallel group) at a time. For each task, transform it into a standalone instruction using `references/task-template.md` — it must carry the context, pattern reference, signatures, and output files so the task can be built without re-reading the story.

Default methodology is **TDD red-green-refactor**, in this spirit:

- **RED — write one failing test first.** It states what the code *should* do, in the codebase's existing test style. Then run it and watch it fail. Why: a test you never saw fail proves nothing — it might test the wrong thing, test a mock instead of behavior, or pass by accident. Watching it fail for the *expected reason* (feature missing, not a typo) is what pins the behavior and proves the test has teeth. A test written after the code passes immediately and certifies nothing.
- **GREEN — minimal code to pass.** Write the simplest thing that makes the test pass. No extra options, no speculative flags, no "while I'm here" features. Run the test; confirm it passes and nothing else broke, output clean.
- **REFACTOR — clean up under green.** Remove duplication, improve names, extract helpers — without changing behavior and without adding any. Tests stay green throughout. A refactor that outgrows the current story's tests and scope is not this step — stop and use `refactoring` (its own motivation, scope map, and batch plan).

Use **STUB** instead only when a concrete interface must exist before the tests can compile (e.g. an implementation behind an interface other code already references): create the stub, write the tests against it, then fill it in. The test-first principle is unchanged; only the ordering of the type declaration moves.

Give direction, not a solution: pattern references, signatures, the error approach. The implementation is written fresh from the test, not pasted in.

After each batch, hit a **sync point**: verify the files compile together, the interfaces line up, and all tests pass. If a sync fails, fix it (up to two attempts) before moving on; if it still fails, stop and report rather than building on a broken base. Mark finished tasks done in the story file and your task tracker, and write each task's output to the files named in its instruction.

The sync point is the **integration gate** the orchestrator checks before transitioning a story from `in_progress` to `review` (see `FLOW.yaml#gates.integration`). A non-green sync means the story cannot leave `in_progress` — there is no "almost green" or "should pass after review". The commands you run at the sync point (typically `make build && make test`, or the project's equivalent) and their output are the evidence the orchestrator reads; without that evidence, the transition is blocked. This is the same `verification-before-completion` discipline, applied to the story-as-a-unit rather than to a single claim.

### 4. Review before done

Status flows `in_progress → review → done`. Never jump straight to done — review is where the security and quality bar is enforced.

When all tasks are green, set the story to **review** and run the full test suite against the acceptance criteria. Then hand the code to the reviewer role. The reviewer records findings in the story file (under a `## Review` section, appended as `### Review #N` for history) and returns a summary to you — act on that returned summary directly; do not re-read the whole story file for it.

If the verdict is **changes requested**, turn the returned action items into fix tasks, run them through the same red-green loop, and re-review (up to three rounds). On **approved**, set the story to **done**.

Before claiming done, the story must clear its **Definition of Done** and **security checklist**: acceptance criteria met, all tasks complete, code follows the loaded `docs/standards/*.md` artifacts (notably `coding.md` and any sibling that applied), tests pass, no lint errors, reviewed. The security checks are not optional — drawn from `docs/standards/security.md`: input validated/sanitized, protected endpoints require auth, **a user can only reach their own data** (the most common production hole), no hardcoded secrets, parameterized queries, output escaped, no PII or secrets in logs or error messages. If the story introduced a conscious shortcut, an entry must exist in `docs/standards/temporary-decisions.md` before "done".

## Batch modes: epic and sprint

An epic and a sprint are the same core loop wrapped in an outer iteration. The rules that make batch mode work: build a hierarchical task list up front, execute strictly **in the planned order**, run each story through the full study → test-first → review loop, and never ask for confirmation between items — the task list is the plan.

### Epic mode — implement N stories

Parse the epic file (its story-tasks section lists every story and its tasks, so you don't need to open the story files yet) and build a nested task list: each story, its tasks, a per-story review, then an epic-integration check and an epic-AC check at the end.

Then loop over the stories **in order**: run each one through the full single-story loop above (study → batches → review → done) before starting the next. Record progress as you complete each story so an interruption can resume on the right one — what's done, what's current, the next action, and any decisions worth keeping. Don't reorder, skip, merge, or "optimize" the story sequence, and don't combine tasks from different stories into one batch.

The epic itself goes through review before done: when all stories are done, set the epic to review, run the epic integration tests, verify the epic-level acceptance criteria, fix and re-test on failure, then set it to done and report a summary.

### Sprint mode — implement N epics

Parse the sprint plan to get the epic list for the target sprint, and build one master task list covering every epic, its stories, their tasks, and the review and integration checks. Mark the sprint in progress.

Loop over the epics **in order**, running each through epic mode (which manages its own nested story loop). When an epic's stories are all done, set the epic to review, run its integration tests, fix and re-test on failure (up to three rounds), then mark it done and move to the next. Record progress after each epic/story so a resume lands in the right place. Never work two stories or epics at once, and never proceed past a failed epic review — stop and report.

The sprint finalizes the same way: all epics done → sprint to review → run sprint integration tests → fix on failure → sprint done, with a final summary and metrics.

## Red flags — stop, you have left the loop

- Writing implementation before the test exists
- A test that passes the moment you write it (you tested existing behavior, or tested a mock)
- Jumping a story straight to `done` without the review step
- "I'll add tests after" / "too simple to test" / "just this once"
- Implementing a whole story in one shot instead of task-by-task
- Reordering, merging, or "optimizing" the story sequence in batch mode
- Marking done on the strength of "it should work" — done requires the `verification-before-completion` gate: run the suite, read the output, then claim it

When you catch one of these: stop, return to the red-green loop. A failing test you never saw fail is not TDD.

## Roles

This skill serves the developer role (on a team, an engineer; solo, you). Input is approved, ready-for-dev stories produced by the decomposition skill — this skill executes them, it does not author or re-plan them. Output is reviewed by the reviewer role, whose verdict gates a story, epic, or sprint from `review` to `done`.
