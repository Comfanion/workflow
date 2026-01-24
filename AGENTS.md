# AGENTS.md - AI Agent Guidelines

Instructions for AI coding agents working in this repository.

## Project Overview

**OpenCode Workflow** - AI-assisted development workflow system for Claude Code.
An npm package (`@comfanion/workflow`) that installs workflow definitions, agents, skills, and templates.

**Tech Stack**: JavaScript (ES Modules), Node.js 18+

## Project Structure

```
.opencode/              # Workflow framework (distributed via npm)
  ├── cli/              # CLI tool source (bin/cli.js entry point)
  ├── agents/           # Agent persona definitions (*.md)
  ├── skills/           # Knowledge modules (SKILL.md + templates)
  ├── commands/         # Slash command definitions
  ├── config.yaml       # User configuration
  └── FLOW.yaml         # Main workflow definition
docs/                   # Documentation output (gitignored)
```

## Build/Test Commands

```bash
# Install dependencies
cd .opencode/cli && npm install

# Build CLI (copies opencode files to src/)
npm run build

# Test (runs --help to verify CLI works)
npm test

# Run CLI locally
node bin/cli.js --help
node bin/cli.js doctor

# Publish
npm run build && npm publish
```

**Note**: No test suite exists. Validation done via `node bin/cli.js --help`.

## Code Style Guidelines

### Module System (ES Modules only)
```javascript
// Good - ES Modules
import { Command } from 'commander';
import chalk from 'chalk';
import path from 'path';

// Bad - CommonJS (don't use)
const x = require('x');
```

### Import Organization
```javascript
// 1. Node.js built-ins
import path from 'path';
import { fileURLToPath } from 'url';

// 2. External packages
import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs-extra';

// 3. Local modules
import { myUtil } from './utils.js';
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files | kebab-case | `cli.js`, `build.js` |
| Variables | camelCase | `targetDir`, `configPath` |
| Constants | UPPER_SNAKE_CASE | `PACKAGE_DIR` |
| Functions | camelCase | `parseConfig()` |

### Async/Await & Error Handling
```javascript
async function init() {
  try {
    await fs.copy(src, dest);
  } catch (error) {
    console.error(chalk.red('Failed:'), error);
    process.exit(1);
  }
}
```

### Markdown Files
- All docs in English (technical requirement)
- YAML frontmatter for skills/commands
- Keep each file under 2000 lines
- Fenced code blocks with language hints

## Git Workflow

### Branch Naming
```
epic/[PROJECT]-E[NN]-[description]
feature/[PROJECT]-S[EPIC]-[NN]-[desc]
bugfix/[PROJECT]-[ID]-[description]
```

### Commit Messages (Conventional Commits)
```
<type>(<scope>): <subject>

Types: feat, fix, docs, style, refactor, test, chore
```

Examples:
```bash
feat(cli): add doctor command
fix(init): handle existing config
docs(skills): add code-review template
```

## Key Configuration

### config.yaml
```yaml
development:
  methodology: tdd    # or 'stub'
jira:
  enabled: true/false
  project_key: "PROJ"
```

### Environment Variables
```bash
JIRA_EMAIL="your-email@company.com"
JIRA_API_TOKEN="your-api-token"
```

## Important Files

| File | Purpose |
|------|---------|
| `.opencode/FLOW.yaml` | Workflow pipeline definition |
| `.opencode/config.yaml` | User configuration |
| `.opencode/cli/bin/cli.js` | CLI entry point |
| `.opencode/agents/*.md` | Agent persona definitions |
| `.opencode/skills/*/SKILL.md` | Skill knowledge modules |

## Development Methodology

**TDD**: Write failing test (RED) -> Pass (GREEN) -> Refactor

**STUB**: Define interface -> Write tests against stub -> Implement real code

## What NOT to Do

- Don't commit `node_modules/`, `package-lock.json`
- Don't commit `.opencode/jira-cache.yaml`, `docs/`
- Don't use CommonJS (`require`)
- Don't hardcode secrets
- Don't create files over 2000 lines
