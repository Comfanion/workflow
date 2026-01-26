---
description: Use when conducting technical, market, or domain research. Creates structured research documentation
agent: researcher
---

# Research Command

## Check Existing Research

!`tree docs/research/ 2>/dev/null || echo "No research yet"`

## Input Context

Load relevant docs:
- @docs/prd.md (for context)
- @docs/architecture.md (for technical context)
- @docs/research/README.md (for index)

## Your Task

### Create New Research

1. **Determine research type and topic** from arguments

2. **Create directory** if needed:
   ```
   docs/research/[type]/
   ```

3. **Conduct research**:
   - Define research questions
   - Gather information (web, docs, code)
   - Analyze findings
   - Form recommendations

4. **Create research document**:
   ```
   docs/research/[type]/[topic]-research.md
   ```

5. **Update index**:
   ```
   docs/research/README.md
   ```

### List Research

Show all research organized by type with status.

### Update Research

1. Load existing research
2. Ask what needs updating
3. Add new findings
4. Update date and status

## Output Location

```
docs/research/
├── README.md                    # Index (always update)
├── technical/
│   └── [topic]-research.md
├── market/
│   └── [topic]-research.md
├── domain/
│   └── [topic]-research.md
├── integrations/
│   └── [topic]-research.md
└── patterns/
    └── [topic]-research.md
```

## Research Document Must Include

- [ ] Executive summary
- [ ] Clear research questions
- [ ] Methodology
- [ ] Evidence-based findings
- [ ] Comparison table (if evaluating options)
- [ ] Recommendations
- [ ] Impact on PRD/Architecture
- [ ] Sources cited

## After Completion

Suggest:
- Link research from relevant PRD/Architecture sections
- If research changes requirements: `/prd edit`
- If research changes architecture: `/architecture edit`
