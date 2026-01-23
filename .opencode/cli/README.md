# create-opencode-workflow

Initialize OpenCode Workflow system for AI-assisted development.

## Quick Start

```bash
npx create-opencode-workflow init
```

## Installation

### Option 1: NPX (recommended)

```bash
npx create-opencode-workflow init
```

### Option 2: Global Install

```bash
npm install -g create-opencode-workflow
create-opencode-workflow init
```

## Commands

### `init`

Initialize `.opencode/` in current project.

```bash
npx create-opencode-workflow init
```

**Interactive prompts:**

1. **Your name** - For personalized agent communication
2. **Communication language** - Ukrainian or English
3. **Development methodology** - TDD or STUB
4. **Jira integration** - Enable/disable
5. **Repository structure** - Create full repo structure (README, CONTRIBUTING, etc.)

**Flags:**

```bash
# Skip prompts, use defaults
npx create-opencode-workflow init -y

# With specific options
npx create-opencode-workflow init --tdd --jira --full
```

| Flag | Description |
|------|-------------|
| `-y, --yes` | Skip prompts, use defaults |
| `--tdd` | Use TDD methodology |
| `--stub` | Use STUB methodology |
| `--jira` | Enable Jira integration |
| `--full` | Create full repository structure |

### `update`

Update `.opencode/` to latest version while preserving your `config.yaml`.

```bash
npx create-opencode-workflow update
```

### `doctor`

Check installation health.

```bash
npx create-opencode-workflow doctor
```

### `config`

Show current configuration.

```bash
npx create-opencode-workflow config
```

## What Gets Created

### `.opencode/` (always)

```
.opencode/
├── config.yaml          # Your configuration
├── FLOW.yaml            # Workflow definition (v3.0)
├── agents/              # Agent personas
│   ├── analyst.md       # Mary - Requirements
│   ├── pm.md            # John - PRD
│   ├── architect.md     # Winston - Architecture
│   ├── sm.md            # Sarah - Sprint Management
│   └── dev.md           # Amelia - Development
├── skills/              # Knowledge modules
├── templates/           # Document templates
├── workflows/           # Workflow instructions
├── checklists/          # Validation checklists
└── commands/            # Slash commands
```

### `docs/` (always)

```
docs/
├── sprint-artifacts/    # Epics, stories, sprints
│   └── backlog/
├── requirements/        # Requirements documents
├── architecture/        # Architecture docs
│   ├── adr/             # Architecture Decision Records
│   └── diagrams/
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

## Development

### Building

```bash
cd .opencode/cli
npm run build
```

### Testing locally

```bash
node bin/cli.js init
```

### Publishing

```bash
npm run build
npm publish
```

## License

MIT
