# OpenCode Workflow Architecture

## Separation of Concerns: Commands vs Agents vs Skills

### Commands (Entry Points)

**Purpose:** User-triggered actions, workflow entry points
**Location:** `.opencode/commands/`
**Invocation:** `/command [args]`

Commands are **thin wrappers** that:
1. Parse arguments
2. Check prerequisites
3. Invoke appropriate agent
4. Agent loads necessary skills

```yaml
# Command structure
/requirements:
  args: [topic]
  agent: analyst        # WHO does the work
  # Agent decides WHAT skills to load
```

### Agents (Personas/Roles)

**Purpose:** Specialized personas with domain expertise
**Location:** `.opencode/agents/`
**Invocation:** Automatically by commands or via `@agent`

Agents are **pure personas** that:
1. Have specific expertise domain
2. Know WHEN to use which skills
3. Have appropriate tool permissions
4. Maintain consistent communication style

```yaml
# Agent = WHO (persona)
analyst:
  expertise: Requirements engineering
  personality: Methodical, thorough, asks clarifying questions
  skills_knowledge: Knows about requirements-gathering, validation skills
  # Does NOT contain HOW-TO instructions
```

### Skills (Reusable Knowledge)

**Purpose:** Reusable how-to instructions, templates, processes
**Location:** `.opencode/skills/`
**Invocation:** `skill({ name: "skill-name" })` by agents

Skills are **knowledge modules** that:
1. Describe HOW to do something specific
2. Include templates, checklists, examples
3. Are agent-agnostic (any agent can use)
4. Are loaded on-demand

```yaml
# Skill = HOW (knowledge)
prd-writing:
  what: How to write a PRD
  includes: Template, structure, validation checklist
  # Can be used by: pm, analyst, architect
```

---

## Proposed Structure

### Commands (9 total)

| Command | Purpose | Agent | Skills Used |
|---------|---------|-------|-------------|
| `/requirements` | Start requirements gathering | analyst | requirements-gathering |
| `/prd` | Create/edit PRD | pm | prd-writing, requirements-tracing |
| `/architecture` | Create/edit architecture | architect | architecture-design, adr-writing |
| `/epics` | Create epics | sm | epic-writing, sprint-planning |
| `/stories` | Create stories for epic | sm | story-writing |
| `/sprint-plan` | Plan sprints | sm | sprint-planning |
| `/validate` | Validate artifacts | architect | validation-* |
| `/jira-sync` | Sync to Jira | sm | jira-integration |
| `/workflow-status` | Show status | sm | - |

### Agents (4 total - pure personas)

| Agent | Expertise | Personality |
|-------|-----------|-------------|
| `analyst` | Requirements engineering | Methodical, asks questions, uncovers hidden needs |
| `pm` | Product management | Business-focused, prioritizes, defines scope |
| `architect` | System design | Technical, patterns-focused, trade-off aware |
| `sm` | Sprint management | Organized, breaks down work, tracks progress |

**Note:** `jira-sync` becomes a **skill**, not an agent.

### Skills (15+ total)

#### Requirements Skills
| Skill | Purpose |
|-------|---------|
| `requirements-gathering` | How to interview stakeholders, extract FR/NFR |
| `requirements-validation` | How to validate requirements (SMART, no conflicts) |

#### PRD Skills
| Skill | Purpose |
|-------|---------|
| `prd-writing` | How to write PRD (template, sections, examples) |
| `prd-validation` | How to validate PRD completeness |
| `acceptance-criteria` | How to write testable AC (Given/When/Then) |

#### Architecture Skills
| Skill | Purpose |
|-------|---------|
| `architecture-design` | How to design system architecture |
| `adr-writing` | How to write Architecture Decision Records |
| `architecture-validation` | How to validate architecture |
| `data-modeling` | How to design database schemas |
| `api-design` | How to design REST APIs |
| `event-design` | How to design event schemas |

#### Sprint Skills
| Skill | Purpose |
|-------|---------|
| `epic-writing` | How to write epics with AC |
| `story-writing` | How to write user stories with AC |
| `sprint-planning` | How to plan and organize sprints |
| `git-branching` | How to create feature branches |

#### Integration Skills
| Skill | Purpose |
|-------|---------|
| `jira-integration` | How to sync with Jira API |
| `integration-testing` | How to write integration test specs |

---

## Directory Structure

```
.opencode/
├── FLOW.yaml                    # Workflow definition
├── ARCHITECTURE.md              # This file
├── opencode.json                # Config (models, permissions)
│
├── commands/                    # Entry points (thin)
│   ├── requirements.md
│   ├── prd.md
│   ├── architecture.md
│   ├── epics.md
│   ├── stories.md
│   ├── sprint-plan.md
│   ├── validate.md
│   ├── jira-sync.md
│   └── workflow-status.md
│
├── agents/                      # Personas (who)
│   ├── analyst.md               # Requirements Analyst
│   ├── pm.md                    # Product Manager
│   ├── architect.md             # Solution Architect
│   └── sm.md                    # Sprint Manager
│
├── skills/                      # Knowledge (how)
│   ├── requirements-gathering/
│   │   └── SKILL.md
│   ├── requirements-validation/
│   │   └── SKILL.md
│   ├── prd-writing/
│   │   └── SKILL.md
│   ├── prd-validation/
│   │   └── SKILL.md
│   ├── acceptance-criteria/
│   │   └── SKILL.md
│   ├── architecture-design/
│   │   └── SKILL.md
│   ├── adr-writing/
│   │   └── SKILL.md
│   ├── architecture-validation/
│   │   └── SKILL.md
│   ├── epic-writing/
│   │   └── SKILL.md
│   ├── story-writing/
│   │   └── SKILL.md
│   ├── sprint-planning/
│   │   └── SKILL.md
│   ├── jira-integration/
│   │   └── SKILL.md
│   └── integration-testing/
│       └── SKILL.md
│
└── templates/                   # Referenced by skills
    ├── requirements-template.md
    ├── prd-template.md
    ├── architecture-template.md
    ├── epic-template.md
    ├── story-template.md
    └── ...
```

---

## Flow Example: `/prd` command

```
User: /prd create

1. Command (prd.md) parses args, checks prerequisites
   └─> Invokes agent: pm

2. Agent (pm) receives task "create PRD"
   └─> Loads skill: prd-writing
   └─> Skill provides: template, structure, checklist
   └─> PM uses expertise to fill content
   └─> Loads skill: acceptance-criteria (for writing AC)
   └─> Loads skill: requirements-tracing (to ensure coverage)

3. PM produces: docs/prd.md

4. User: /validate prd
   └─> Command invokes: architect
   └─> Architect loads skill: prd-validation
   └─> Validates and produces report
```

---

## Benefits of This Separation

1. **Reusability** - Skills can be used by multiple agents
2. **Maintainability** - Update skill once, all agents get update
3. **Clarity** - Clear who does what and how
4. **Flexibility** - Easy to add new skills without changing agents
5. **Testability** - Skills can be tested independently
6. **Composability** - Agents compose skills as needed

---

## Migration Plan

### Phase 1: Create Skills Structure
1. Create `.opencode/skills/` directory
2. Extract templates into skill folders
3. Write SKILL.md for each skill

### Phase 2: Simplify Agents
1. Remove how-to content from agents
2. Keep only: persona, expertise, personality
3. Add skill awareness to agent prompts

### Phase 3: Update Commands
1. Make commands thinner
2. Remove duplicate instructions
3. Let agents decide which skills to load

### Phase 4: Update FLOW.yaml
1. Add skills section
2. Map commands → agents → skills
