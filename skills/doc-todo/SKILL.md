---
name: doc-todo
description: Mark incomplete work with structured TODO markers — in code (TASK, STORY, EPIC, BACKLOG, TECH_DEBT, FIXME, HACK) and in documentation (DRAFT, EXPAND, RESEARCH, REVIEW, DECISION, EXAMPLE, DIAGRAM). Use when leaving a placeholder, flagging future work, or marking something as incomplete or to-be-decided. This skill standardizes how a marker is written; it does not do the deferred work itself.
---

# Structured TODOs

A bare `// TODO` tells the next reader nothing — not what kind of work it is, not whether it's tracked, not who owns it. Tagging every marker with a type makes the backlog greppable: you can list all the `FIXME`s, all the unanswered `DECISION`s, or everything tied to a given story. That is the whole point of this skill.

## In code

Write code markers as `// TODO({type}:{id}): {description}`. The id ties the marker to a tracked work item so it can't get lost; `BACKLOG` and `HACK` are the exceptions where no id is expected.

| Type | Means |
|------|-------|
| `TASK` | Tracked task, needs an id |
| `STORY` | Tied to a story, needs an id |
| `EPIC` | Tied to an epic, needs an id |
| `BACKLOG` | Idea for later, no id |
| `TECH_DEBT` | Known shortcut to repay, needs an id |
| `FIXME` | Broken or fragile, needs an id |
| `HACK` | Temporary workaround, no id |

```go
// TODO(TASK:T01-03): Implement email validation
// TODO(BACKLOG): Consider a caching layer
// FIXME(TASK:T02-01): Fix race condition on concurrent reserve
// HACK: Temporary workaround until API v2 ships
```

## In documentation

Write documentation markers as an HTML comment, `<!-- TODO({type}): {description} -->`, so they stay invisible in rendered output but obvious in the source.

| Type | Means |
|------|-------|
| `DRAFT` | Section is unfinished |
| `EXPAND` | Needs more detail |
| `RESEARCH` | Needs investigation before writing |
| `REVIEW` | Needs another reader |
| `DECISION` | An open choice to resolve |
| `EXAMPLE` | A worked example is missing |
| `DIAGRAM` | A diagram is missing |

```markdown
<!-- TODO(DRAFT): Section needs review -->
<!-- TODO(DECISION): Choose PostgreSQL or MongoDB -->
<!-- TODO(DIAGRAM): Add sequence diagram for checkout -->
```

## Two rules that keep markers useful

- **Be specific.** "Add email-format validation" is actionable; "fix" is noise the next reader has to reverse-engineer.
- **Don't let markers rot.** A TODO is a short-lived note, not permanent storage. Resolve it, or promote it to a real tracked task and remove the marker. Markers that outlive their context become lies.

## Roles

Anyone leaving incomplete work writes the marker; whoever picks up the work resolves it and deletes the marker.
