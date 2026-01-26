# AGENTS.md - AI Agent Guidelines

Instructions for AI coding agents working in this repository.

HERE IS .opencode/ , not .claude

## Project Overview

**Repository:** `/Users/evgeniystepanchuk/work/ai-wf/`
**Package:** `@comfanion/workflow` - npm package for AI-assisted development workflow with semantic code search
**Also maintains:** `create-opencode-workflow` (alias package)

**Tech Stack**: JavaScript (ES Modules), Node.js 18+

**Git Remotes:**
- `origin` → GitLab (primary): `git@gitlab.com:comfanion/workflow.git`
- `github` → GitHub (mirror): `git@github.com:Comfanion/workflow.git`

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

## Build & Deploy Workflow

### Quick Reference
```bash
cd .opencode/cli

# Build only
npm run build

# Build + bump version + publish + push
npm version patch && npm publish --access public
cd ../.. && git add -A && git commit -m "feat: description" && git push origin main && git push github main
```

### Full Deploy Process

1. **Make changes** in `.opencode/` folder
2. **Build** (copies .opencode files to cli/src/):
   ```bash
   cd .opencode/cli && npm run build
   ```
3. **Test locally**:
   ```bash
   node bin/cli.js --help
   node bin/cli.js doctor
   ```
4. **Bump version & publish**:
   ```bash
   npm version patch   # or minor/major
   npm publish --access public
   ```
5. **Commit & push to BOTH remotes**:
   ```bash
   cd ../..
   git add -A
   git commit -m "feat(scope): description"
   git push origin main    # GitLab
   git push github main    # GitHub mirror
   ```

### Git Remotes

| Remote | URL | Purpose |
|--------|-----|---------|
| `origin` | `git@gitlab.com:comfanion/workflow.git` | Primary (GitLab) |
| `github` | `git@github.com:Comfanion/workflow.git` | Mirror for awesome-opencode |

**IMPORTANT**: Always push to BOTH remotes after publishing!

### Version Bumping

```bash
npm version patch  # 4.36.21 → 4.36.22 (bug fixes, small changes)
npm version minor  # 4.36.21 → 4.37.0  (new features)
npm version major  # 4.36.21 → 5.0.0   (breaking changes)
```

### What Happens on Build

`npm run build` runs `scripts/build.js` which:
1. Cleans `src/` folder
2. Copies `.opencode/` files → `src/opencode/`
3. Copies `skills/coding-standards/repo-structure/` → `src/repo-structure/`
4. Copies `vectorizer/` → `src/vectorizer/`
5. Creates `src/build-info.json` with version from `package.json`

### Validation

No test suite. Validation is manual:
```bash
node bin/cli.js --help     # Should show commands
node bin/cli.js doctor     # Should check installation
```

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
