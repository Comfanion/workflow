# @comfanion/workflow

Initialize OpenCode Workflow system for AI-assisted development.

[![npm version](https://img.shields.io/npm/v/@comfanion/workflow.svg)](https://www.npmjs.com/package/@comfanion/workflow)

## Quick Start

```bash
npx @comfanion/workflow init
```

## Installation

### NPX (recommended)

```bash
npx @comfanion/workflow init
```

### Global Install

```bash
npm install -g @comfanion/workflow
comfanion-workflow init
# or
opencode-workflow init
```

## Commands

### `init`

Initialize `.opencode/` in current project.

```bash
npx @comfanion/workflow init
```

**Interactive prompts:**

1. **Your name** - For personalized agent communication
2. **Communication language** - Ukrainian or English
3. **Development methodology** - TDD or STUB
4. **Jira integration** - Enable/disable
5. **Repository structure** - Create README, CONTRIBUTING, etc.

**Flags:**

```bash
# Skip prompts, use defaults
npx @comfanion/workflow init -y

# With specific options
npx @comfanion/workflow init --tdd --jira --full
```

| Flag | Description |
|------|-------------|
| `-y, --yes` | Skip prompts, use defaults |
| `--tdd` | Use TDD methodology |
| `--stub` | Use STUB methodology |
| `--jira` | Enable Jira integration |
| `--full` | Create full repository structure |

### `update`

Update `.opencode/` to latest version while preserving `config.yaml`.

```bash
npx @comfanion/workflow update
```

### `doctor`

Check installation health.

```bash
npx @comfanion/workflow doctor
```

### `config`

Show current configuration.

```bash
npx @comfanion/workflow config
```

## What Gets Created

### `.opencode/` (always)

```
.opencode/
├── config.yaml          # Your configuration
├── FLOW.yaml            # Workflow definition (v3.0)
├── agents/              # Agent personas
├── skills/              # Knowledge modules with templates (25+)
├── workflows/           # Workflow instructions
├── checklists/          # Validation checklists
└── commands/            # Slash commands
```

### `docs/` (always)

```
docs/
├── sprint-artifacts/    # Epics, stories, sprints
├── requirements/        # Requirements documents
├── architecture/        # Architecture + ADRs
├── api/                 # API documentation
├── coding-standards/    # Coding standards
└── confluence/          # Translations (Ukrainian)
```

### Repository files (with `--full`)

```
README.md                # Project readme
CONTRIBUTING.md          # Git workflow, commit conventions
CHANGELOG.md             # Change history
.gitignore               # Git ignore patterns
.gitattributes           # Git attributes
```

## Methodologies

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

## Jira Integration

If enabled, set credentials:

```bash
export JIRA_EMAIL="your-email@company.com"
export JIRA_API_TOKEN="your-api-token"
```

## Links

- **npm:** https://www.npmjs.com/package/@comfanion/workflow
- **GitLab:** https://gitlab.com/comfanion/workflow

## License

MIT
