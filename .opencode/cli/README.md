# @comfanion/workflow

AI-assisted development workflow with **semantic code search**, agents, and structured documentation.

[![npm version](https://img.shields.io/npm/v/@comfanion/workflow.svg)](https://www.npmjs.com/package/@comfanion/workflow)

## Features

- 🔍 **Semantic Code Search** - Find code by meaning, not just text (`"authentication logic"` → finds auth handlers)
- 🤖 **AI Agents** - Specialized personas (Analyst, PM, Architect, Developer) with skills
- 📝 **Structured Workflow** - PRD → Architecture → Epics → Stories → Implementation
- 🔄 **Auto-indexing** - Background indexing on startup with fun toast notifications
- 🎯 **Jira Integration** - Bidirectional sync with your project

## Quick Start

```bash
npx @comfanion/workflow init
```

## Semantic Code Search

Search your codebase by **meaning**, not just text matching:

```bash
# In Claude Code / AI assistant:
/search "user authentication middleware"    # Finds auth-related code
/search "database connection handling"      # Finds DB setup
/search "error handling patterns"           # Finds error handlers
```

### How It Works

1. **Vectorizer** converts code into embeddings using local AI model
2. **Indexes** are stored in `.opencode/vectors/` (code, docs, config)
3. **Search** finds semantically similar code chunks
4. **Auto-indexer** keeps indexes fresh on startup

### Available Indexes

| Index | Files | Use Case |
|-------|-------|----------|
| `code` | `*.js, *.ts, *.py, *.go...` | Find functions, classes, logic |
| `docs` | `*.md, *.txt` | Find documentation, guides |
| `config` | `*.yaml, *.json` | Find configuration, settings |

### Commands

```bash
# Manual indexing
npx @comfanion/workflow index              # Index all
npx @comfanion/workflow index --code       # Index code only
npx @comfanion/workflow index --docs       # Index docs only

# Check index status
npx @comfanion/workflow index --status
```

## Installation

### NPX (recommended)

```bash
npx @comfanion/workflow init
```

### Global Install

```bash
npm install -g @comfanion/workflow
opencode-workflow init
```

### Alternative Package Name

```bash
npx create-opencode-workflow init
```

## Commands

### `init`

Initialize `.opencode/` in current project.

```bash
npx @comfanion/workflow init
```

**Interactive prompts:**

1. **Your name** - For personalized agent communication
2. **Communication language** - Ukrainian, English, Russian
3. **Development methodology** - TDD or STUB
4. **Vectorizer** - Enable semantic search
5. **Jira integration** - Enable/disable

**Flags:**

| Flag | Description |
|------|-------------|
| `-y, --yes` | Skip prompts, use defaults |
| `--tdd` | Use TDD methodology |
| `--stub` | Use STUB methodology |
| `--jira` | Enable Jira integration |
| `--full` | Create full repository structure |

### `update`

Update `.opencode/` to latest version.

```bash
npx @comfanion/workflow update
```

**Preserves:**
- ✅ Your `config.yaml` (with comments!)
- ✅ Vector indexes (`.opencode/vectors/`)
- ✅ Custom settings

### `doctor`

Check installation health.

```bash
npx @comfanion/workflow doctor
```

### `vectorizer`

Manage semantic search vectorizer.

```bash
npx @comfanion/workflow vectorizer install   # Install dependencies
npx @comfanion/workflow vectorizer status    # Check status
```

## Configuration

### `config.yaml`

```yaml
# User settings
user_name: "Developer"
communication_language: "en"  # en, uk, ru

# Development
development:
  methodology: tdd  # tdd or stub

# Semantic Search
vectorizer:
  enabled: true
  auto_index: true      # Auto-index on startup
  debounce_ms: 5000
  indexes:
    code: { enabled: true }
    docs: { enabled: true }
    config: { enabled: false }
  exclude:
    - "node_modules/**"
    - "dist/**"
    - "*.min.js"

# Jira Integration
jira:
  enabled: false
  url: "https://your-domain.atlassian.net"
  project_key: "PROJ"
```

## What Gets Created

### `.opencode/`

```
.opencode/
├── config.yaml          # Your configuration
├── FLOW.yaml            # Workflow definition
├── agents/              # AI agent personas
│   ├── analyst.md       # Business Analyst
│   ├── pm.md            # Product Manager
│   ├── architect.md     # Solution Architect
│   └── dev.md           # Senior Developer
├── skills/              # Knowledge modules (25+)
├── plugins/             # Auto-indexer plugin
├── vectorizer/          # Semantic search engine
│   ├── index.js
│   └── package.json
├── vectors/             # Vector indexes (auto-created)
│   ├── code/
│   ├── docs/
│   └── config/
├── tools/               # MCP tools
│   ├── search.ts        # Semantic search tool
│   └── codeindex.ts     # Index management tool
└── commands/            # Slash commands
```

### `docs/`

```
docs/
├── sprint-artifacts/    # Epics, stories, sprints
├── requirements/        # Requirements documents
├── architecture/        # Architecture + ADRs
└── coding-standards/    # Coding patterns
```

## Auto-Indexer Plugin

The auto-indexer runs on Claude Code / AI assistant startup:

- 🔍 Checks if indexes need updating
- 📊 Shows toast notification with file count
- ☕ Shows fun message while indexing ("Grab a coffee!")
- 📝 Logs to `.opencode/indexer.log`

**Disable auto-indexing:**

```yaml
# config.yaml
vectorizer:
  auto_index: false
```

## Methodologies

### TDD (Test-Driven Development)

```
1. Write failing test (RED)
2. Write minimal code to pass (GREEN)
3. Refactor (BLUE)
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

Set credentials:

```bash
export JIRA_EMAIL="your-email@company.com"
export JIRA_API_TOKEN="your-api-token"
```

## Requirements

- **Node.js** >= 18
- **~100MB disk** for vectorizer dependencies

## Links

- **npm:** https://www.npmjs.com/package/@comfanion/workflow
- **GitLab:** https://gitlab.com/comfanion/workflow

## License

MIT
