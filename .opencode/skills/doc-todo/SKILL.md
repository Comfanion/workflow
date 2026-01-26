---
name: doc-todo
description: Use when adding TODO placeholders in code or documentation
license: MIT
compatibility: opencode
metadata:
  domain: development
  agents: [all]
---

# TODO Placeholders

How to mark incomplete work in code and docs.

## In Code

```
// TODO: description
// TODO(STORY-123): description with ticket
// FIXME: known bug
// HACK: temporary workaround
```

## In Documentation

```markdown
<!-- TODO: section needs expansion -->
<!-- TODO(DECISION): choose between A or B -->
```

## Types

| Type | Use for |
|------|---------|
| `TODO` | General incomplete work |
| `FIXME` | Known bug to fix |
| `HACK` | Temporary workaround |
| `NOTE` | Important context |

## Best Practices

- Be specific: `TODO: add validation` not `TODO: fix`
- Add ticket if exists: `TODO(PROJ-123): ...`
- Don't leave TODOs forever - track and resolve
