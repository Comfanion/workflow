# Task instruction template

Use this when handing a single task to whoever (or whatever) writes the code — including yourself. It carries everything needed to implement the task cold, without re-reading the story. One task per instruction; never bundle a whole story into one prompt.

```markdown
## Task: {{name}} ({{task IDs}})

{{one-line goal}}

### Context
- {{existing file}}: {{what to use from it}}
- Existing pattern: {{path to similar code}}
- Done so far: {{results of previous tasks this task depends on}}

### Output files
- {{path/to/create.ext}}
- {{path/to/create_test.ext}}

### Requirements
1. {{what to implement, with interface signatures — method names, params, return types}}
2. {{validation rules}}

### Pattern reference
→ {{path/to/similar/code.ext}}  (follow its structure, imports, error handling)

### Error handling
{{which errors to return, error codes / format from the standards}}

### Methodology
TDD (default): write the failing test first, watch it fail, then minimal code to green, then refactor under green.
STUB (only when a real interface must exist before tests compile): create the stub, write tests against it, then fill in.

### Done when
- [ ] Test was written first and observed to fail for the right reason
- [ ] Minimal code makes it pass; whole package compiles
- [ ] All tests pass, output clean (no warnings)
- [ ] {{specific observable criterion}}
```

Provide direction, not solution: pattern references, interface signatures, requirements, the error approach. Do not paste full implementations or ready-to-copy code — the implementer writes it from the test.
