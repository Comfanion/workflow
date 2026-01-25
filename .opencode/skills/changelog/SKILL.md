---
name: changelog
description: Maintain changelogs for repository and documents
license: MIT
compatibility: opencode
metadata:
  domain: documentation
  agents: [dev, all]
---

# Changelog Skill

> **Purpose**: Maintain changelogs for repository and documents
> **Used by**: All agents, Dev agent (mandatory)

## Two Types of Changelog

| Type | Location | Purpose |
|------|----------|---------|
| **Repository** | `CHANGELOG.md` | Track code/feature changes |
| **Document** | Each doc file | Track document revisions |

---

## Repository CHANGELOG

### Format: Keep a Changelog

```markdown
# Changelog

## [Unreleased]

### Added
- Add product catalog API with CRUD operations
- Add Kafka event publishing for order changes

### Changed
- Change price field from float to decimal

### Fixed
- Fix race condition in inventory reservation (#234)

## [1.2.0] - 2024-01-15

### Added
- Add bulk import for products (EPIC:E08)
```

### Categories (in order)

| Category | What to include |
|----------|-----------------|
| **Added** | New features, endpoints, modules |
| **Changed** | Changes to existing functionality |
| **Deprecated** | Features to be removed in future |
| **Removed** | Removed features |
| **Fixed** | Bug fixes |
| **Security** | Security vulnerability fixes |

### Entry Format

```markdown
- {Verb} {what} {context} ({reference})

Examples:
- Add user registration API endpoint
- Add pagination to product list (STORY:S05-04)
- Change order status from string to enum (BREAKING)
- Fix null pointer in payment processing (#123)
- Security: Fix SQL injection in search query (CVE-2024-XXX)
```

### When to Update

| Event | Action |
|-------|--------|
| Story completed | Add entry to `[Unreleased]` |
| Sprint completed | Keep in `[Unreleased]` |
| Release | Move `[Unreleased]` → `[X.Y.Z] - date` |
| Hotfix | Add to `[Unreleased]` + release |

### Versioning (SemVer)

```
MAJOR.MINOR.PATCH

1.0.0 → 1.0.1  (patch: bug fix)
1.0.1 → 1.1.0  (minor: new feature)
1.1.0 → 2.0.0  (major: breaking change)
```

| Change Type | Version Bump |
|-------------|--------------|
| Bug fix | PATCH |
| New feature (backward compatible) | MINOR |
| Breaking change | MAJOR |
| Security fix | PATCH (or MINOR if API change) |

---

## Document Changelog

### Format

Add to end of every document:

```markdown
---

## Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.2 | 2024-01-20 | @architect | Add NFR section, update diagrams |
| 1.1 | 2024-01-15 | @pm | Add FR-015 to FR-020, clarify scope |
| 1.0 | 2024-01-10 | @pm | Initial approved version |
| 0.2 | 2024-01-08 | @analyst | Add user personas, journeys |
| 0.1 | 2024-01-05 | @pm | Initial draft |
```

### Entry Format

```markdown
| {version} | {date} | @{author} | {changes summary} |
```

### Version Numbering for Documents

```
0.x - Draft (not approved)
1.0 - First approved version
1.x - Minor updates (additions, clarifications)
2.0 - Major revision (scope change, restructure)
```

### When to Update

**At END of work session** - not on every small change!

```
Session Start
  ├── Make change 1
  ├── Make change 2
  ├── Make change 3
  └── ...
Session End
  └── Add ONE changelog entry summarizing all changes
```

### What to Log

Summarize session work in one entry:

| Session Work | Changelog Entry |
|--------------|-----------------|
| Added 3 sections, fixed 2 typos | "Add security, NFR, risks sections; Fix typos in FR-001, FR-003" |
| Major restructure | "Restructure: Split FR into domains; Add traceability matrix" |
| Small fixes | "Minor: Clarify scope; Update metrics" |

---

## Integration with Workflow

### Story Completion → CHANGELOG

```markdown
## Story completed: CATALOG-S05-03

### Added to CHANGELOG.md:
- Add product search API with filters (CATALOG-S05-03)
- Add Elasticsearch integration for full-text search
```

### Document Update → Document Changelog

```markdown
## PRD Updated

| 1.3 | 2024-01-20 | @pm | Add FR-021 payment retry logic |
```

### Dev Workflow Integration

```xml
<step n="7" goal="Update changelog after story completion">
  <action>Read current CHANGELOG.md</action>
  <action>Add entries to [Unreleased] section</action>
  <action>Use format: "- {Verb} {what} ({story-id})"</action>
  <action>Save CHANGELOG.md</action>
</step>
```

---

## Templates

### Repository CHANGELOG.md

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- 

### Changed
- 

### Fixed
- 

## [0.1.0] - {{date}}

### Added
- Initial project setup
- Basic documentation structure
```

### Document Changelog Section

```markdown
---

## Changelog

<!-- UPDATE AT END OF SESSION -->

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | {{date}} | @{{user}} | Initial draft |

<!-- 
Update at END of work session (not on every change)
Summarize all changes in one entry
-->
```

---

## Automation

### Git Commit → Changelog Entry

```bash
# Commit message format
feat: Add product search API

# Auto-generates:
### Added
- Add product search API
```

### Conventional Commits Mapping

| Prefix | Category |
|--------|----------|
| `feat:` | Added |
| `fix:` | Fixed |
| `docs:` | Changed (docs) |
| `refactor:` | Changed |
| `perf:` | Changed (performance) |
| `security:` | Security |
| `BREAKING:` | Changed (breaking) |

---

## Validation Checklist

### Repository CHANGELOG

- [ ] `[Unreleased]` section exists
- [ ] Entries start with verb
- [ ] Entries reference story/issue ID
- [ ] Categories in correct order
- [ ] Dates in ISO format (YYYY-MM-DD)

### Document Changelog

- [ ] Changelog section at end of document
- [ ] Version number updated
- [ ] Date is current
- [ ] Author identified
- [ ] Changes are specific
