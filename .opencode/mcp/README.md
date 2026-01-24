# MCP Servers

Model Context Protocol (MCP) servers extend AI assistant capabilities with external tools and integrations.

## Quick Start

```bash
# List available MCP servers
npx @comfanion/workflow mcp list

# Interactive selection
npx @comfanion/workflow mcp enable

# Add specific server
npx @comfanion/workflow mcp add context7

# Remove server
npx @comfanion/workflow mcp remove context7
```

## Files

| File | Purpose | Updated by |
|------|---------|------------|
| `catalog.yaml` | Available MCP servers | `workflow update` |
| `enabled.yaml` | Your selections | You (manual or CLI) |

## Recommended Servers

### context7 ⭐
Library documentation for npm, Go, Python packages. Essential for researching APIs.

### sequential-thinking ⭐
Enhanced reasoning for complex multi-step problems. Helps with architecture decisions.

## Categories

- 📚 **Documentation** - Library docs, research
- 🧠 **Thinking** - Reasoning, planning
- 🌐 **Browser** - Playwright, Chrome DevTools
- 🔌 **Integrations** - Jira, GitHub, Slack
- 🗄️ **Database** - PostgreSQL, Redis, SQLite
- 🔗 **API** - HTTP, OpenAPI

## Manual Configuration

Edit `enabled.yaml`:

```yaml
context7:
  enabled: true

atlassian:
  enabled: true
  config:
    env:
      ATLASSIAN_URL: "https://your-domain.atlassian.net"
```

## Environment Variables

Some MCP servers require environment variables:

```bash
# Atlassian
export ATLASSIAN_EMAIL="your-email@company.com"
export ATLASSIAN_API_TOKEN="your-token"
export ATLASSIAN_URL="https://your-domain.atlassian.net"

# GitHub
export GITHUB_TOKEN="ghp_xxx"

# PostgreSQL
export POSTGRES_CONNECTION_STRING="postgresql://..."
```

## Adding Custom MCP

Add to `enabled.yaml`:

```yaml
my-custom-mcp:
  enabled: true
  config:
    command: npx
    args: ["-y", "my-custom-mcp-package"]
    env:
      MY_API_KEY: "xxx"
```
