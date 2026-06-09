# Contributing Guidelines

## Git Workflow

### Branch Naming

```
feature/{ticket-id}-{short-description}
fix/{ticket-id}-{short-description}
hotfix/{ticket-id}-{short-description}
refactor/{short-description}
docs/{short-description}
```

**Examples:**
```
feature/PROJ-123-user-registration
fix/PROJ-456-login-error
hotfix/PROJ-789-critical-security-fix
refactor/cleanup-auth-module
docs/update-api-reference
```

### Commit Message Convention

Format:
```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code change, no feature/fix |
| `perf` | Performance improvement |
| `test` | Adding tests |
| `chore` | Build, config changes |

#### Scope (optional)

Module or component affected: `auth`, `api`, `db`, `ui`, etc.

#### Subject

- Imperative mood: "add" not "added" or "adds"
- No capitalization
- No period at the end
- Max 50 characters

#### Body (optional)

- Explain what and why, not how
- Wrap at 72 characters

#### Footer (optional)

- Reference issues: `Closes #123`, `Fixes #456`
- Breaking changes: `BREAKING CHANGE: description`

### Examples

```
feat(auth): add JWT token refresh

Implement automatic token refresh when access token expires.
Refresh happens 5 minutes before expiration.

Closes PROJ-123
```

```
fix(api): handle null response from payment provider

Payment provider returns null instead of error object
when service is unavailable. Added null check and
appropriate error handling.

Fixes PROJ-456
```

```
docs: update API authentication section

- Add examples for token refresh
- Document error codes
- Add troubleshooting guide
```

```
refactor: extract validation logic to separate module

No functional changes. Moved validation from controllers
to dedicated validation module for better testability.
```

## Pull Request Process

### PR Title

Same format as commit messages:
```
feat(auth): add user registration API
```

### PR Description Template

```markdown
## Summary

Brief description of changes.

## Changes

- Change 1
- Change 2

## Testing

- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing done

## Screenshots (if UI changes)

## Checklist

- [ ] Code follows project style guide
- [ ] Self-reviewed the code
- [ ] Commented complex logic
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Tests pass locally
```

### Review Process

1. Create PR with description
2. Request review from team
3. Address feedback
4. Get approval (min 1 reviewer)
5. Squash and merge

## Code Review Guidelines

### For Authors

- Keep PRs small (< 400 lines)
- Provide context in description
- Respond to all comments
- Don't take feedback personally

### For Reviewers

- Be constructive and specific
- Explain why, not just what
- Approve when good enough
- Use conventional comments:
  - `nit:` - minor, optional
  - `suggestion:` - improvement idea
  - `question:` - seeking clarification
  - `issue:` - must be addressed

## Development Setup

1. Clone repository
2. Install dependencies
3. Copy `.env.example` to `.env`
4. Run setup script
5. Verify with tests

## Questions?

Open an issue or contact the team.
