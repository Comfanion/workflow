---
name: changelog
description: Maintain a changelog after code or document changes — add entries to the repository CHANGELOG.md (Keep a Changelog + SemVer) or append a revision row to a document's own changelog table. Use whenever a story/feature ships, a release is cut, or a document is updated and the change should be recorded. This skill only records changes that already happened; it does not decide what to build or write the change itself.
---

# Changelog

A changelog is the human-readable history of what changed and why. Two distinct logs exist, and confusing them is the most common mistake: the **repository** changelog tracks code and features in a single `CHANGELOG.md` at the project root; a **document** changelog tracks revisions to one document and lives at the bottom of that document. Pick the right one for what actually changed.

## Repository CHANGELOG.md

Follow the [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format so anyone — human or tool — can read it without learning a local convention. New work accumulates under `## [Unreleased]` and moves to a version heading at release time. This keeps "what's shipped" and "what's pending" unambiguous.

Group entries under these categories, in this order, so readers scan the same way every time:

| Category | What goes here |
|----------|----------------|
| **Added** | New features, endpoints, modules |
| **Changed** | Changes to existing behavior |
| **Deprecated** | Features slated for removal |
| **Removed** | Features taken out |
| **Fixed** | Bug fixes |
| **Security** | Vulnerability fixes |

Write each entry as `{verb} {what} {context} ({reference})`. Start with a verb and add a traceable reference (story ID, issue number, CVE) so the entry links back to its source:

```markdown
- Add pagination to product list (STORY:S05-04)
- Change order status from string to enum (BREAKING)
- Fix null pointer in payment processing (#123)
- Security: Fix SQL injection in search query (CVE-2024-XXXX)
```

**When to update:** add to `[Unreleased]` when a story completes or a hotfix lands. At release, move the whole `[Unreleased]` block under a `## [X.Y.Z] - YYYY-MM-DD` heading and start a fresh empty `[Unreleased]`.

**Versioning** uses [SemVer](https://semver.org/) `MAJOR.MINOR.PATCH` — a bug fix bumps PATCH, a backward-compatible feature bumps MINOR, a breaking change bumps MAJOR. This lets consumers judge upgrade risk from the version number alone.

If conventional commit prefixes are in use, map them to categories: `feat:` → Added, `fix:` → Fixed, `refactor:`/`perf:`/`docs:` → Changed, `security:` → Security, `BREAKING:` → Changed (breaking).

Starting a CHANGELOG.md from scratch: copy `references/template.md`.

## Document changelog

Each significant document carries its own revision history as a table at the very end, so a reader knows how the document evolved without digging through version control. Append one row per revision:

```markdown
## Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.1 | 2024-01-15 | you | Add FR-015 to FR-020, clarify scope |
| 1.0 | 2024-01-10 | you | Initial approved version |
| 0.1 | 2024-01-05 | you | Initial draft |
```

Number documents `0.x` while in draft, `1.0` at first approval, `1.x` for additions and clarifications, `2.0` for a major revision or restructure. The author is whoever made the change (a role or person, not an agent handle).

**Log once per session, not per edit.** A document changelog records intent, not keystrokes — make all your changes, then add a single row summarizing them ("Add security and NFR sections; fix typos in FR-001"). A row per tiny edit drowns the signal.

## Quality bar

Before considering the log updated, confirm:

- The right log was touched — repository changes go to `CHANGELOG.md`, document changes to the document's own table.
- Repository entries sit under `[Unreleased]`, start with a verb, carry a reference, and use ISO dates (`YYYY-MM-DD`).
- A document revision bumped the version, set the current date, named the author, and described the change specifically (not "various updates").

## Roles

Anyone who makes a change records it; the person who made the change is the changelog author.
