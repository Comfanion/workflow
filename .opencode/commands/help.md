---
description: Analyze project state and suggest next steps (context-aware guidance)
agent: workflow-orchestrator
---

# Help Command

## Arguments
$ARGUMENTS

- Empty: General guidance based on project state
- "[question]": Specific guidance for a question
- "blockers": Show blocking issues
- "quick-wins": Show easy improvements

## Analyze Current State

### Check All Documents
!`ls -la docs/requirements/requirements.md 2>/dev/null && echo "EXISTS" || echo "MISSING"`
!`ls -la docs/prd.md 2>/dev/null && echo "EXISTS" || echo "MISSING"`
!`ls -la docs/architecture.md 2>/dev/null && echo "EXISTS" || echo "MISSING"`
!`ls docs/coding-standards/*.md 2>/dev/null | wc -l | xargs echo "Coding Standards files:"`
!`ls docs/modules/*/README.md 2>/dev/null | wc -l | xargs echo "Module docs:"`
!`ls docs/sprint-artifacts/*/epic-*.md 2>/dev/null | wc -l | xargs echo "Epics:"`
!`cat docs/sprint-artifacts/sprint-status.yaml 2>/dev/null | head -20 || echo "No sprint status"`

### Check Document Sizes
!`wc -l docs/prd.md 2>/dev/null || echo "0"`
!`wc -l docs/architecture.md 2>/dev/null || echo "0"`

### Check for Stale Documents
!`ls -lt docs/*.md docs/**/*.md 2>/dev/null | head -10`

### Check Active Changes
!`ls docs/changes/*/proposal.md 2>/dev/null | wc -l | xargs echo "Active change proposals:"`

## Your Task

1. **Determine Project Scale**
   - L0: Hotfix (single file)
   - L1: Small (< 5 requirements)
   - L2: Medium (5-20 requirements)
   - L3: Large (20-50 requirements)
   - L4: Enterprise (50+ requirements)

2. **Identify Current Phase**
   - Requirements gathering
   - Standards definition
   - PRD creation
   - Architecture design
   - Module documentation
   - Sprint planning
   - Implementation

3. **Detect Issues**
   - Missing prerequisites
   - Stale documents
   - Size overflows (> 2000 lines)
   - Validation gaps
   - Conflicting information

4. **Generate Recommendations**
   - Required next steps
   - Optional improvements
   - Quick wins

## Response Format

```markdown
## 🎯 Project Status

**Scale:** L[N] ([type])
**Phase:** [current phase]
**Health:** [Good/Warning/Critical]

---

### 📊 Document Status

| Document | Status | Lines | Issues |
|----------|--------|-------|--------|
| Requirements | ✅/⚠️/❌ | N | [issue] |
| ...

---

### 🚨 Issues Found

[List any issues with severity and fix command]

---

### 📋 Recommended Next Steps

#### Required
1. [Step with command]

#### Optional  
1. [Improvement with command]

#### Quick Wins
1. [Easy improvement]

---

### 💡 Context-Specific Tips

[Based on user's question if provided]
```

## Scale-Adaptive Suggestions

### L0 (Hotfix)
```
Skip full workflow. Just:
1. Document the change
2. Implement
3. Test
```

### L1 (Small)
```
Minimal workflow:
1. Brief requirements
2. Implement
3. Basic tests
```

### L2-L4 (Medium to Enterprise)
```
Full workflow with appropriate depth
```

## After Help

User can:
- Follow suggested commands
- Ask for clarification
- Request different approach
