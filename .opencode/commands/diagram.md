---
description: Use when creating technical diagrams - C4 architecture, sequence flows, ER data models, flowcharts in Mermaid format
agent: architect
---

# Diagram Creation

## Check Existing Diagrams

!`ls -la docs/diagrams/ 2>/dev/null || echo "No diagrams yet"`
!`ls docs/diagrams/*/ 2>/dev/null || echo ""`

## Input Context

Load based on scope:
- @docs/architecture.md (always)
- @docs/modules/[scope]/architecture.md (if module-specific)
- @docs/modules/[scope]/data-model.md (for ERD)

## Diagram Storage

All diagrams go to `docs/diagrams/`:

```
docs/diagrams/
├── README.md                    # Diagram index
├── c4/
│   ├── system-context.md        # L1
│   ├── containers.md            # L2
│   └── [module]-components.md   # L3 per module
├── sequences/
│   └── [flow-name].md
├── data/
│   ├── erd-overview.md
│   └── [module]-erd.md
├── flows/
│   └── [process-name].md
└── states/
    └── [entity]-states.md
```

## Your Task

1. **Determine diagram type** from arguments
2. **Load relevant context** (architecture, module docs)
3. **Create Mermaid diagram** in appropriate file
4. **Update index** in `docs/diagrams/README.md`

## Diagram Format

Each diagram file:

```markdown
# [Diagram Title]

## Context

[When/why this diagram is useful]

## Diagram

\`\`\`mermaid
[mermaid code]
\`\`\`

## Elements

| Element | Type | Description |
|---------|------|-------------|

## Notes

[Additional context, decisions]

## Related

- [Link to related diagram]
- [Link to architecture section]
```

## Index Update

After creating diagram, update `docs/diagrams/README.md`:

```markdown
# Diagrams Index

## C4 Architecture

| Diagram | Level | Scope | Description |
|---------|-------|-------|-------------|
| [System Context](./c4/system-context.md) | L1 | System | Overview |

## Sequences

| Diagram | Module | Flow |
|---------|--------|------|

## Data Models

| Diagram | Scope |
|---------|-------|

## Process Flows

| Diagram | Process |
|---------|---------|

## State Machines

| Diagram | Entity |
|---------|--------|
```

## Validation

- [ ] Mermaid syntax is valid
- [ ] Elements match architecture docs
- [ ] Index is updated
- [ ] Cross-references added

## Tips

- Keep diagrams focused (one concept per diagram)
- Use consistent naming across diagrams
- Link diagrams to relevant documentation sections
