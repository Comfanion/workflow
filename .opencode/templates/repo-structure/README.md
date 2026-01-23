# {{project_name}}

> {{project_description}}

## Quick Start

```bash
# Install dependencies
# (project-specific command)

# Run development server
# (project-specific command)

# Run tests
# (project-specific command)
```

## Documentation

| Document | Description |
|----------|-------------|
| [PRD](docs/prd.md) | Product Requirements Document |
| [Architecture](docs/architecture.md) | System Architecture |
| [Coding Standards](docs/coding-standards/) | Code conventions |
| [API Reference](docs/api/) | API documentation |

## Project Structure

```
├── src/                    # Source code
├── tests/                  # Test files
├── docs/                   # Documentation
│   ├── prd.md             # Product requirements
│   ├── architecture.md    # System architecture
│   ├── coding-standards/  # Coding conventions
│   ├── sprint-artifacts/  # Epics, stories
│   └── confluence/        # Translated docs (Ukrainian)
├── .opencode/             # AI workflow system
└── CHANGELOG.md           # Version history
```

## Development Workflow

This project uses [OpenCode Workflow](/.opencode/README.md) for AI-assisted development.

### Commands

```bash
/requirements    # Gather requirements
/prd            # Create/edit PRD
/architecture   # Design architecture
/epics          # Create epics
/stories        # Create stories
/dev-story      # Implement story
```

### Agents

| Agent | Role |
|-------|------|
| @analyst | Requirements gathering |
| @pm | Product management |
| @architect | System design |
| @sm | Sprint management |
| @dev | Development |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

## License

{{license}}
