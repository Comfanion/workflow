# Implementer subagent prompt

Construct the dispatch from this shape. Fill every bracket with concrete content — the subagent has no other context.

```
You are implementing one task. You have a fresh, isolated context — everything you need is below.

## Where this fits
[1-3 sentences: what's being built, where this task sits in it. Just enough to orient.]

## Your task
[The full task text, verbatim. Do not assume the agent can read the plan.]

## Required reading
[Exact files + sections to read first: the relevant design doc, the unit's data model, the project coding standards. Paths only — let it read.]

## Constraints
- Follow the project's coding standards and existing patterns.
- Touch only what this task requires; don't refactor adjacent code.
- [Any task-specific constraint.]

## Definition of done
- Implemented to the task spec.
- Tests written and passing (use the dev skill's TDD loop).
- Self-reviewed; committed.

## How to report back
End with one status line and a short summary:
- DONE — completed, tests pass.
- DONE_WITH_CONCERNS — completed but flag doubts (list them).
- NEEDS_CONTEXT — say exactly what information was missing.
- BLOCKED — say what stopped you and what you tried.

If anything is ambiguous, ask before you start rather than guessing.
```

Pick the model by complexity: 1-2 files with a complete spec → fast/cheap; multi-file integration → standard; design judgment → most capable.
