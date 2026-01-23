# OpenCode Workflow

AI-assisted development workflow system for Claude Code.

[![npm version](https://img.shields.io/npm/v/@comfanion/workflow.svg)](https://www.npmjs.com/package/@comfanion/workflow)
[![GitLab](https://img.shields.io/badge/GitLab-repo-orange)](https://gitlab.com/comfanion/workflow)

## Quick Start

```bash
npx @comfanion/workflow init
```

Or install globally:

```bash
npm i -g @comfanion/workflow
comfanion-workflow init
```

## What is this?

A structured workflow system that helps AI agents (Claude) assist with software development through the full cycle:

```
Requirements → PRD → Architecture → Epics → Stories → Code
```

### Key Features

- **Agents with personas** - Analyst, PM, Architect, Scrum Master, Developer
- **Skills** - 25+ reusable knowledge modules
- **Templates** - Document templates for all artifacts
- **TDD/STUB methodologies** - Choose your development approach
- **Atomic tasks** - 1-2 hour tasks with dependencies
- **Jira integration** - Sync stories, manage sprints
- **Multi-language** - English docs, Ukrainian/English communication

## Installation Options

### Interactive (recommended)

```bash
npx @comfanion/workflow init
```

Prompts for:
- Your name
- Communication language (Ukrainian/English)
- Development methodology (TDD/STUB)
- Jira integration (yes/no)
- Full repo structure (yes/no)

### Non-interactive

```bash
npx @comfanion/workflow init -y --tdd --full
```

| Flag | Description |
|------|-------------|
| `-y, --yes` | Skip prompts, use defaults |
| `--tdd` | TDD methodology |
| `--stub` | STUB methodology |
| `--jira` | Enable Jira integration |
| `--full` | Create full repo structure |

### Shell script

```bash
curl -fsSL https://gitlab.com/comfanion/workflow/-/raw/main/.opencode/cli/install.sh | bash
```

## What Gets Created

```
.opencode/
├── config.yaml          # Configuration
├── FLOW.yaml            # Workflow definition (v3.0)
├── agents/              # Agent personas
│   ├── analyst.md       # Mary - Requirements
│   ├── pm.md            # John - PRD
│   ├── architect.md     # Winston - Architecture
│   ├── sm.md            # Sarah - Sprint Management
│   └── dev.md           # Amelia - Development
├── skills/              # 25+ knowledge modules
├── templates/           # Document templates
├── workflows/           # Workflow instructions
├── checklists/          # Validation checklists
└── commands/            # Slash commands

docs/
├── sprint-artifacts/    # Epics, stories, sprints
├── requirements/        # Requirements docs
├── architecture/        # Architecture + ADRs
├── api/                 # API documentation
├── coding-standards/    # Coding standards
└── confluence/          # Translations
```

With `--full` flag, also creates:
- `README.md`
- `CONTRIBUTING.md` (Git workflow, commit conventions)
- `CHANGELOG.md`
- `.gitignore`
- `.gitattributes`

## Commands

| Command | Description |
|---------|-------------|
| `/requirements` | Gather requirements |
| `/prd` | Create/edit PRD |
| `/architecture` | Design architecture |
| `/epics` | Create epics |
| `/stories` | Create stories |
| `/sprint-plan` | Plan sprint |
| `/dev-story` | Implement story (TDD/STUB) |
| `/code-review` | Review code |
| `/jira-sync` | Sync with Jira |

## Configuration

Edit `.opencode/config.yaml`:

```yaml
# User
user_name: "Your Name"
communication_language: "Ukrainian"  # or English

# Development
development:
  methodology: tdd  # or stub
  task:
    max_hours: 2

# Jira (optional)
jira:
  enabled: true
  base_url: "https://your-domain.atlassian.net"
  project_key: "PROJ"
```

## CLI Commands

```bash
# Initialize
npx @comfanion/workflow init

# Update to latest (preserves config)
npx @comfanion/workflow update

# Health check
npx @comfanion/workflow doctor

# Show config
npx @comfanion/workflow config
```

## Development Methodologies

### TDD (Test-Driven Development)

```
1. Write failing test
2. Write minimal code to pass
3. Refactor
4. Repeat
```

### STUB (Stub-First Development)

```
1. Write interface/stub with TODO
2. Write tests against stub
3. Implement stub
4. Remove TODOs
```

## Links

- **npm:** https://www.npmjs.com/package/@comfanion/workflow
- **GitLab:** https://gitlab.com/comfanion/workflow
- **Issues:** https://gitlab.com/comfanion/workflow/-/issues

## License

MIT
