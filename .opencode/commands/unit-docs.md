---
description: Use when documenting module/domain/service/entity using Universal Unit format with index.md, data-model.md
agent: architect
skills_loaded:
  - unit-writing
---

# Unit Documentation Command

Create structured documentation for any logical piece of the system using the Universal Unit format.

## Supported Unit Types

| Type | When to Use | Example |
|------|-------------|---------|
| `module` | Deployable bounded context | `catalog`, `auth`, `billing` |
| `domain` | Business concept grouping | `Order`, `Inventory`, `Payment` |
| `entity` | Core data object | `User`, `Task`, `Product` |
| `service` | Stateless component | `NotificationService`, `EmailService` |
| `feature` | Cross-cutting capability | `Search`, `Import`, `Export` |

## Prerequisites Check

1. **Main Architecture** - @docs/architecture.md (REQUIRED)
2. **PRD** - @docs/prd.md (RECOMMENDED)

!`ls -la docs/architecture.md 2>/dev/null || echo "ARCHITECTURE MISSING - run /architecture first"`

## Check Existing Units

!`ls -la docs/architecture/units/ 2>/dev/null || echo "No units yet"`

## Input Context

Load:
- @docs/architecture.md (REQUIRED)
- @docs/prd.md (if exists)
- @.opencode/skills/unit-writing/SKILL.md
- @.opencode/skills/unit-writing/template.md

## Your Task

### Create Mode: `/unit-docs [type] [name]`

1. Load the unit-writing skill
2. Gather info about the unit from existing docs
3. Use the template structure:

```yaml
id: {TYPE}-{NAME}
type: module | domain | entity | service | feature
status: draft
```

4. Fill sections:
   - **Overview** - Purpose, responsibilities
   - **Boundaries** - Owns/Uses/Provides
   - **Data Model** - Fields, types, constraints
   - **Relations** - Links to other units
   - **Operations** - Public methods/endpoints
   - **State Machine** - If applicable
   - **Errors** - Error codes and conditions
   - **References** - Links to related docs

5. Save to: `docs/architecture/units/unit-{name}.md`

### List Mode: `/unit-docs list`

Show all existing unit documents with their type and status.

!`ls -la docs/architecture/units/*.md 2>/dev/null | awk '{print $NF}'`

### Validate Mode: `/unit-docs validate [name]`

Check unit doc against checklist:
- [ ] Type correctly specified
- [ ] Overview explains single responsibility
- [ ] Boundaries clear (owns/uses/provides)
- [ ] Data model complete with constraints
- [ ] Relations use `-> Unit:` format
- [ ] Operations list all public methods
- [ ] Business rules documented
- [ ] Errors have codes
- [ ] References link to related docs

## Naming Conventions

### File Names

```
unit-{name}.md

Examples:
- unit-task.md
- unit-catalog.md
- unit-notification-service.md
```

### Unit IDs

```
{TYPE_PREFIX}-{NAME}

TYPE_PREFIX:
- MOD = module
- DOM = domain
- ENT = entity
- SVC = service
- FEA = feature

Examples:
- MOD-CATALOG
- ENT-TASK
- SVC-NOTIFICATION
```

## Reference Format

When referencing units in other docs:

```markdown
-> Unit: `Task`
-> Unit: `catalog/Product`
```

## Output Location

`docs/architecture/units/unit-{name}.md`

## Writing Rules

1. **Single Responsibility** - Each unit does ONE thing
2. **Clear Boundaries** - Explicit owns/uses/provides
3. **Complete Data Model** - All fields with constraints
4. **Linked References** - Use `-> Unit:` format
5. **< 500 lines** - Keep focused, split if larger

## After Completion

Suggest:
- `/validate architecture` - Re-validate architecture with new unit
- `/unit-docs [type] [name]` - Document related units
- `/stories {epic-id}` - Reference unit in story tasks


