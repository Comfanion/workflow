---
name: architecture-validation
description: Use when validating architecture document before creating epics - checks PRD coverage, NFR compliance, module boundaries, and QA artifacts
license: MIT
compatibility: opencode
metadata:
  domain: quality-assurance
  artifacts: docs/validation/architecture-validation-*.md
---

# Architecture Validation Skill

## When to Use

Use this skill when you need to:
- Validate architecture before creating epics
- Ensure all PRD requirements have architectural home
- Ensure all NFRs have architectural support
- Check QA artifact (architecture-integration-tests.md) exists

## Prerequisites

- PRD validation must PASS first
- File: `docs/prd.md`

## Validation Checklist

### Structure Checks

- [ ] File exists at `docs/architecture.md`
- [ ] Architecture Overview section exists
- [ ] Module/Service Architecture section exists
- [ ] Data Architecture section exists
- [ ] Integration Architecture section exists
- [ ] Cross-Cutting Concerns section exists
- [ ] ADRs section exists
- [ ] NFR Compliance section exists

### PRD Coverage

- [ ] All PRD functional areas have architectural home
- [ ] Each module has clear responsibility
- [ ] Each module has defined boundaries
- [ ] Data ownership is explicit

### NFR Compliance

For each NFR in PRD:
- [ ] Has concrete architectural support
- [ ] Support is documented in NFR Compliance section
- [ ] Implementation approach is clear

### Module Quality

For each module:
- [ ] Single responsibility defined
- [ ] Owns specific entities (data ownership)
- [ ] Consumes/produces events documented
- [ ] API contracts defined
- [ ] No circular dependencies

### Pattern Compliance

- [ ] Architecture style is documented and justified (ADR)
- [ ] Dependency direction follows chosen pattern
- [ ] Business logic isolated from infrastructure
- [ ] Aligns with CLAUDE.md standards

### ADR Checks

- [ ] Major decisions have ADRs
- [ ] ADRs follow template (Context, Decision, Consequences)
- [ ] ADRs have status (Accepted/Superseded/Deprecated)

### QA Artifact Check (MANDATORY)

- [ ] File exists: `docs/architecture-integration-tests.md`
- [ ] Module contracts defined
- [ ] Event-driven tests specified
- [ ] API boundary tests specified
- [ ] NFR verification tests specified

## Dependency Analysis

Check for circular dependencies:

```
Module A → Module B → Module C → Module A  ❌ CYCLE!
```

Build dependency graph and verify it's a DAG.

## Validation Report Format

```markdown
# Architecture Validation Report

**Date:** YYYY-MM-DD
**Status:** PASS | WARN | FAIL
**File:** docs/architecture.md

## Prerequisites

| Prerequisite | Status |
|--------------|--------|
| prd.md validated | ✅ PASS |

## Summary

| Check Type | Total | Passed | Warnings | Failed |
|------------|-------|--------|----------|--------|
| Structure | 8 | 8 | 0 | 0 |
| PRD Coverage | 4 | 4 | 0 | 0 |
| NFR Compliance | 12 | 12 | 0 | 0 |
| Module Quality | 5 | 5 | 0 | 0 |
| Pattern Compliance | 4 | 4 | 0 | 0 |
| ADRs | 3 | 3 | 0 | 0 |
| QA Artifact | 4 | 4 | 0 | 0 |

## QA Artifact Status

| Artifact | Status |
|----------|--------|
| `docs/architecture-integration-tests.md` | ✅ Present |
| Module Contract Tests | Defined |
| API Boundary Tests | Defined |
| NFR Verification Tests | Defined |

## Module Dependency Graph

```
Catalog ──→ (none)
Inventory ──→ Catalog
Orders ──→ Catalog, Inventory
```

**Circular Dependencies:** None ✅

## NFR Compliance Matrix

| NFR ID | Requirement | Architectural Support | Status |
|--------|-------------|----------------------|--------|
| NFR-001 | < 200ms response | Redis caching | ✅ |
| NFR-002 | 99.9% uptime | K8s HA, health checks | ✅ |
| NFR-003 | 1000 RPS | Horizontal scaling | ✅ |

## ADR Summary

| ADR | Decision | Status |
|-----|----------|--------|
| ADR-001 | Use PostgreSQL | Accepted |
| ADR-002 | Event-driven integration | Accepted |
| ADR-003 | Modular monolith | Accepted |

## Passed Checks

- [x] All PRD functional areas covered
- [x] All NFRs have architectural support
- [x] No circular dependencies
- [x] QA artifact present

## Warnings

(None)

## Failures

(None if PASS)

## Next Steps

After validation:
- If PASS, proceed to `/epics`
```

## If QA Artifact Missing

```markdown
## FAILURE: QA Artifact Missing

**Required:** `docs/architecture-integration-tests.md`
**Status:** ❌ NOT FOUND

### Action Required

Create the QA artifact using template:
`@.opencode/skills/test-design/template-integration.md`

This artifact is MANDATORY before proceeding to epics.
```

## Output

Save to: `docs/validation/architecture-validation-YYYY-MM-DD.md`

## Related Skills

- `architecture-design` - For fixing architecture issues
- `adr-writing` - For documenting decisions
