---
name: doc-todo
description: Add structured TODO comments in code (TASK, STORY, EPIC, TECH_DEBT, FIXME, HACK) and documentation (DRAFT, EXPAND, RESEARCH, REVIEW, DECISION). Use when marking incomplete work, adding placeholders, tracking future tasks, or when user mentions "TODO", "placeholder", "future work", "incomplete", or "mark for later".
license: MIT
compatibility: opencode
metadata:
  domain: development
  agents: [all]
---

# TODO Placeholders Skill

```xml
<doc_todo>
  <definition>Mark incomplete work with structured TODOs</definition>
  
  <code>
    <format>// TODO({type}:{id}): {description}</format>
    <types>TASK, STORY, EPIC, BACKLOG, TECH_DEBT, FIXME, HACK</types>
    <require_id>true (except BACKLOG, HACK)</require_id>
  </code>
  
  <docs>
    <format>&lt;!-- TODO({type}): {description} --&gt;</format>
    <types>DRAFT, EXPAND, RESEARCH, REVIEW, DECISION, EXAMPLE, DIAGRAM</types>
  </docs>
  
  <rules>
    <specific>Be specific: "add validation" not "fix"</specific>
    <track>Don't leave TODOs forever - resolve or convert to tasks</track>
  </rules>
</doc_todo>
```

---

## Examples

```go
// TODO(TASK:T01-03): Implement email validation
// TODO(BACKLOG): Consider caching layer
// FIXME(TASK:T02-01): Fix race condition
// HACK: Temporary workaround until API v2
```

```markdown
<!-- TODO(DRAFT): Section needs review -->
<!-- TODO(DECISION): Choose PostgreSQL or MongoDB -->
<!-- TODO(DIAGRAM): Add sequence diagram -->
```

See `config.yaml` for full configuration.
