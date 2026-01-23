# Git Workflow

**Version:** 1.0
**Status:** Active

---

## Branching Strategy

```
main (production)
 │
 ├── develop (integration)
 │    │
 │    ├── epic/PROJ-E01-user-auth ─────────────────────┐
 │    │    │                                           │
 │    │    ├── feature/PROJ-S01-01-login-form          │
 │    │    ├── feature/PROJ-S01-02-password-reset      │
 │    │    ├── feature/PROJ-S01-03-oauth-google        │
 │    │    └── [merge to epic branch when ready]       │
 │    │                                                │
 │    │◄───────────────────────────────────────────────┘
 │    │    [merge epic to develop when complete]
 │    │
 │    ├── epic/PROJ-E02-catalog ───────────────────────┐
 │    │    │                                           │
 │    │    ├── feature/PROJ-S02-01-product-list        │
 │    │    ├── feature/PROJ-S02-02-product-detail      │
 │    │    └── ...                                     │
 │    │                                                │
 │    │◄───────────────────────────────────────────────┘
 │    │
 │    └── hotfix/PROJ-XXX-critical-bug
 │
 └── release/v1.0.0 ──► tag: v1.0.0
```

---

## Branch Types

| Type | Pattern | Source | Target | Purpose |
|------|---------|--------|--------|---------|
| **main** | `main` | - | - | Production code |
| **develop** | `develop` | main | main | Integration branch |
| **epic** | `epic/[EPIC-ID]-[name]` | develop | develop | Epic scope |
| **feature** | `feature/[STORY-ID]-[name]` | epic/* | epic/* | Story implementation |
| **bugfix** | `bugfix/[STORY-ID]-[name]` | epic/* | epic/* | Bug fix in epic |
| **hotfix** | `hotfix/[ID]-[name]` | main | main + develop | Production fix |
| **release** | `release/v[X.Y.Z]` | develop | main | Release preparation |

---

## Branch Naming

### Epic Branches

```
epic/[PROJECT]-E[NN]-[short-description]

Examples:
epic/CATALOG-E01-product-management
epic/AUTH-E03-oauth-integration
epic/ORDER-E05-checkout-flow
```

### Feature/Story Branches

```
feature/[PROJECT]-S[EPIC]-[NN]-[short-description]

Examples:
feature/CATALOG-S01-01-create-product-api
feature/CATALOG-S01-02-product-validation
feature/AUTH-S03-01-google-oauth
```

### Bugfix Branches

```
bugfix/[PROJECT]-S[EPIC]-[NN]-[short-description]

Examples:
bugfix/CATALOG-S01-03-fix-price-validation
bugfix/AUTH-S03-02-token-refresh-error
```

### Hotfix Branches

```
hotfix/[PROJECT]-[ID]-[short-description]

Examples:
hotfix/CATALOG-123-fix-null-pointer
hotfix/AUTH-456-security-patch
```

---

## Workflow

### 1. Starting an Epic

```bash
# Create epic branch from develop
git checkout develop
git pull origin develop
git checkout -b epic/CATALOG-E01-product-management

# Push epic branch
git push -u origin epic/CATALOG-E01-product-management
```

### 2. Starting a Story

```bash
# Create feature branch from epic
git checkout epic/CATALOG-E01-product-management
git pull origin epic/CATALOG-E01-product-management
git checkout -b feature/CATALOG-S01-01-create-product-api

# Work on feature...
git add .
git commit -m "feat(catalog): add create product endpoint"

# Push feature branch
git push -u origin feature/CATALOG-S01-01-create-product-api
```

### 3. Completing a Story

```bash
# Create PR/MR: feature/* → epic/*
# After review and approval, merge to epic branch
# Delete feature branch after merge
```

### 4. Completing an Epic

```bash
# Ensure all stories merged to epic branch
# Create PR/MR: epic/* → develop
# After review and approval, merge to develop
# Delete epic branch after merge
```

### 5. Creating a Release

```bash
# Create release branch from develop
git checkout develop
git pull origin develop
git checkout -b release/v1.0.0

# Final testing, version bump, changelog
git commit -m "chore: prepare release v1.0.0"

# Merge to main
git checkout main
git merge release/v1.0.0
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin main --tags

# Merge back to develop
git checkout develop
git merge release/v1.0.0
git push origin develop

# Delete release branch
git branch -d release/v1.0.0
```

### 6. Hotfix

```bash
# Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/CATALOG-123-fix-null-pointer

# Fix and commit
git commit -m "fix(catalog): handle null product reference"

# Merge to main
git checkout main
git merge hotfix/CATALOG-123-fix-null-pointer
git tag -a v1.0.1 -m "Hotfix v1.0.1"
git push origin main --tags

# Merge to develop
git checkout develop
git merge hotfix/CATALOG-123-fix-null-pointer
git push origin develop
```

---

## Commit Messages

### Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `style` | Formatting (no code change) |
| `refactor` | Code restructuring |
| `test` | Adding tests |
| `chore` | Maintenance tasks |
| `perf` | Performance improvement |
| `ci` | CI/CD changes |

### Examples

```bash
# Feature
feat(catalog): add product search endpoint

# Bug fix
fix(auth): correct token expiration calculation

# With body
feat(order): implement checkout flow

- Add cart validation
- Integrate payment gateway
- Send confirmation email

Closes PROJ-S05-01

# Breaking change
feat(api)!: change response format for products

BREAKING CHANGE: Product response now includes nested category object
```

---

## Pull/Merge Request

### Title Format

```
[STORY-ID] <type>: <description>

Examples:
[CATALOG-S01-01] feat: add create product API
[AUTH-S03-02] fix: token refresh error
```

### PR Template

```markdown
## Summary
[Brief description of changes]

## Story
[PROJ-S01-01](link-to-story)

## Type of Change
- [ ] Feature
- [ ] Bug fix
- [ ] Refactoring
- [ ] Documentation

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] Code reviewed

## Screenshots (if UI)
[Add screenshots]
```

---

## Branch Protection Rules

### main

- Require PR before merging
- Require 2 approvals
- Require status checks (CI)
- No direct pushes
- No force pushes

### develop

- Require PR before merging
- Require 1 approval
- Require status checks (CI)
- No direct pushes

### epic/*

- Require PR before merging
- Require 1 approval
- Require status checks (CI)

---

## Workflow Diagram

```
                                    ┌─────────────────────────────────────┐
                                    │              MAIN                    │
                                    │         (production)                 │
                                    └──────────────┬──────────────────────┘
                                                   │
                         ┌─────────────────────────┼─────────────────────────┐
                         │                         │                         │
                    hotfix/*                  release/*                      │
                         │                         │                         │
                         ▼                         ▼                         │
                    ┌──────────────────────────────────────────────────────┐ │
                    │                      DEVELOP                          │ │
                    │                   (integration)                       │ │
                    └──────────────────────────┬───────────────────────────┘ │
                                               │                             │
              ┌────────────────────────────────┼────────────────────────────┐│
              │                                │                            ││
              ▼                                ▼                            ▼│
    ┌──────────────────┐            ┌──────────────────┐         ┌─────────────────┐
    │ epic/PROJ-E01-*  │            │ epic/PROJ-E02-*  │         │ epic/PROJ-E03-* │
    └────────┬─────────┘            └────────┬─────────┘         └────────┬────────┘
             │                               │                            │
    ┌────────┼────────┐             ┌────────┼────────┐          ┌────────┼────────┐
    │        │        │             │        │        │          │        │        │
    ▼        ▼        ▼             ▼        ▼        ▼          ▼        ▼        ▼
feature  feature  feature       feature  feature  bugfix     feature  feature  feature
S01-01   S01-02   S01-03        S02-01   S02-02   S02-03     S03-01   S03-02   S03-03
```

---

## Quick Reference

```bash
# Start epic
git checkout develop && git pull
git checkout -b epic/PROJ-E01-name

# Start story
git checkout epic/PROJ-E01-name && git pull
git checkout -b feature/PROJ-S01-01-name

# Daily work
git add . && git commit -m "feat(scope): message"
git push origin feature/PROJ-S01-01-name

# After PR merged to epic
git checkout epic/PROJ-E01-name
git pull origin epic/PROJ-E01-name
git branch -d feature/PROJ-S01-01-name

# After epic complete
git checkout develop
git pull origin develop
git branch -d epic/PROJ-E01-name
```

---

## CI/CD Integration

| Event | Trigger | Actions |
|-------|---------|---------|
| Push to feature/* | On push | Lint, Test, Build |
| PR to epic/* | On PR | Lint, Test, Build, Code Review |
| PR to develop | On PR | Full test suite, Integration tests |
| PR to main | On PR | Full test suite, Security scan |
| Tag v*.*.* | On tag | Build, Deploy to production |
