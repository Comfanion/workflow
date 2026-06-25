---
name: standards-git
description: Author and maintain the project's git workflow artifact — branching model, branch naming, commit message format, PR/MR process, merge rules, and branch protection. Use this whenever the user wants to "write the git standards", "define branch naming", "set the commit format", "document the PR process", or mentions "git workflow", "trunk-based", "git flow", "conventional commits", or "branch protection". Authors `{DOCS_ROOT}/standards/git.md`. CI/CD pipeline definitions and deploy procedures belong to `release-engineering`; this artifact only sets the source-control conventions.
---

# Standards — Git

The git artifact answers four questions for every contributor: **what branch do I cut from, what do I name it, what does my commit message look like, and how does it get to main?** Without a written answer, every team improvises and the history becomes unreadable.

The artifact lives at `{DOCS_ROOT}/standards/git.md`. `{DOCS_ROOT}` defaults to `docs/`. Target size: **8-15 KB**.

## What this artifact must cover

1. **Branching model** — trunk-based, GitFlow, or epic-branches. One per project.
2. **Branch naming** — pattern per branch type (feature / bugfix / hotfix / release / epic). Concrete examples.
3. **Commit message format** — Conventional Commits or a project-specific shape; mandatory fields; subject length cap.
4. **PR / MR process** — who reviews, how many approvals, what blocks merge, draft-vs-ready rule.
5. **Merge strategy** — merge commit / squash / rebase. One choice per branch type.
6. **Branch protection** — what is enforced on `main` (signed commits, required checks, no force push, no direct push).
7. **Tagging and releases** — semver, tag format (`v1.2.3`), changelog rule.
8. **Hotfix flow** — emergency path that bypasses normal review with what compensating check.

## How to write it

1. **Read the release-engineering artifact (if any).** The deploy pipeline often dictates which branch deploys; the git model has to align.
2. **Pick one branching model** and write the reason next to it. Mixing GitFlow with trunk-based is the most common mess; the artifact prevents it by naming the model.
3. **Use concrete examples.** Every branch-naming rule gets two examples; every commit type gets one example. Pull the actual default branch name, ticket-id format, and the host/forge (GitHub / GitLab / Bitbucket) from the real project — don't bake in a host this project doesn't run.
4. **Cite the governing ADR.** When a rule (the chosen branching model, the merge strategy, a protection rule) traces to a decision, link its governing ADR (see `authoring-standards`, `adr-writing`); the ADR holds the *why*. Where the artifact and the ADR disagree, the ADR wins — fix the artifact.
5. **Rules only — no pasted enforcement.** The runnable commit-lint config, pre-commit / commit-msg hooks, PR/MR template, and CODEOWNERS live in the project's boilerplate/reference location; the artifact **references** that path and states the rule it enforces — it never pastes a copy that drifts.
6. **Draft from `references/template.md`.**
7. **Validate against `references/checklist.md`.**

## Branching model — pick one

| Model | Best for | Tradeoff |
|-------|----------|----------|
| Trunk-based | High-frequency deploys, feature flags | Requires flags; cheap reverts |
| Epic branches | Multi-story epics, per-epic demo branches | Long-lived branches, integration cost |
| GitFlow | Release-driven, multiple maintained versions | Heavy, slow; overkill for most |
| Short-lived branch + trunk | Simple SaaS, one prod | Limited release-train support |

The artifact names the model **and the reason** — model without reason invites disagreement. Pick exactly one; the choice is a decision, so cite its governing ADR (see `adr-writing`).

## Commit message — Conventional Commits baseline

```
<type>(<scope>): <subject>

[body]

[footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`. Subject capped at 72 chars. Body wraps at 100. `BREAKING CHANGE:` footer when applicable. The commit-msg hook and commit-lint config that enforce this shape live in the boilerplate — this artifact states the rule they check, not a pasted copy.

```
feat(catalog): add product search endpoint

Adds /v1/products/search with fuzzy matching.

Closes PROJ-S05-01
```

## Branch protection — non-negotiables

Even on a solo project:

- `main` requires PR; no direct push.
- Required status checks: build, lint, tests.
- No force push.
- Signed commits (if the team has signing set up).

For a team, add: required approvals, dismiss stale reviews on push.

A merge rule that the host doesn't enforce is decoration: the runnable protection config, the PR/MR template, and CODEOWNERS live in the boilerplate. This artifact states the rule; the boilerplate holds the artifact that enforces it.

## Hotfix flow

The exception that proves the review rule. Document:

- When a hotfix is allowed (production incident with severity threshold).
- Who can approve (on-call, named role).
- The compensating check (post-merge review within {{N}} hours).

Without a written hotfix flow, every incident reinvents one.

## Update protocol

- A merge breaks history readability (force-merge, junk commits) → tighten the merge strategy and require squash where it fits.
- A branch lingers > {{N}} days → file the rule that long-lived branches need integration cadence.
- A required check is bypassed in an emergency → add the compensating-check rule to the hotfix flow.

File the update through `authoring-standards` (review before it propagates); don't fix it only in a reviewer's head.

## Templates and references

- `references/template.md` — full `git.md` template.
- `references/checklist.md` — validation checklist for the artifact.

## Who reads this artifact

- `dev` — every commit and every PR.
- `release-engineering` — pipeline triggers off the branching model.
- `code-review` — to enforce PR/MR rules.

## Roles

Authored by the tech lead or release engineer. Reviewed by the project owner.

## Related

- `standards` — umbrella router.
- `authoring-standards` — cross-cutting authoring rules (ADR-cite + boilerplate discipline); route updates through it.
- `adr-writing` — write the ADR a rule cites.
- `using-standards` — consumer protocol.
- `release-engineering` — CI/CD and deploy concerns.
