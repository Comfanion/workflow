# OpenCode Workflow

AI-assisted development workflow system for Claude Code / OpenCode.

## Quick Start

```bash
npx create-opencode-workflow init
```

Or with shell:

```bash
curl -fsSL https://gitlab.com/comfanion/workflow/-/raw/main/.opencode/cli/install.sh | bash
```

## What is this?

A structured workflow system that helps AI agents (Claude) assist with software development:

- **Requirements gathering** → PRD → Architecture → Epics → Stories → Code
- **Agents with personas** - Analyst, PM, Architect, Scrum Master, Developer
- **Skills** - Reusable knowledge modules
- **Templates** - Document templates for all artifacts
- **Jira integration** - Sync stories, manage sprints

## Features

- **3 Phases**: Planning → Sprint → Implementation
- **TDD/STUB methodologies** - Choose your approach
- **Atomic tasks** - 1-2 hour tasks with dependencies
- **Multi-language** - English docs, Ukrainian communication
- **Jira sync** - Bidirectional synchronization

## Structure

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
├── skills/              # Knowledge modules (25+)
├── templates/           # Document templates
├── workflows/           # Workflow instructions
├── checklists/          # Validation checklists
└── commands/            # Slash commands
```

## Commands

| Command | Description |
|---------|-------------|
| `/requirements` | Gather requirements |
| `/prd` | Create/edit PRD |
| `/architecture` | Design architecture |
| `/epics` | Create epics |
| `/stories` | Create stories |
| `/sprint-plan` | Plan sprint |
| `/dev-story` | Implement story |
| `/jira-sync` | Sync with Jira |

## CLI Commands

```bash
# Initialize
npx create-opencode-workflow init

# Interactive options:
# - Your name
# - Communication language (Ukrainian/English)
# - Methodology (TDD/STUB)
# - Jira integration
# - Full repo structure

# Update to latest
npx create-opencode-workflow update

# Health check
npx create-opencode-workflow doctor

# Show config
npx create-opencode-workflow config
```

## Configuration

Edit `.opencode/config.yaml`:

```yaml
# User
user_name: "Your Name"
communication_language: "Ukrainian"

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

## License

MIT
