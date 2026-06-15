---
name: standards-temporary-decisions
description: Author and maintain the project's temporary-decisions artifact — a living backlog of conscious shortcuts taken to ship faster (hardcoded values, skipped tests, deferred refactors, feature-flag stubs, "TODO until X"), each with the cost of keeping it, the trigger that ends it, the deadline, and the owner. Use this whenever the user wants to "track tech debt", "log a shortcut", "record a temporary decision", "manage TODOs at the project level", or mentions "tech debt backlog", "deferred work", "temporary fix", or "TODO ledger". Authors `{DOCS_ROOT}/standards/temporary-decisions.md` and provides the read/write protocol so `dev`, `decomposition`, and `code-review` keep it honest. Distinct from per-file `// TODO` comments — this is the project-wide ledger they should graduate to.
---

# Standards — Temporary Decisions

Every project takes shortcuts. Hardcoded values to unblock a demo. A test skipped because the fixture is brittle. A feature flag left on. A "we'll move this later." Without a ledger, these become permanent — not by decision, but by forgetting. **This artifact is the ledger.** Each entry says exactly what the shortcut is, what it costs to keep, what would trigger removing it, when, and who owns the removal.

It is also a planning input: when a sprint has slack, the ledger names the cheapest debt to clear; when an incident traces back to a known shortcut, the entry shows why the project chose it.

The artifact lives at `{DOCS_ROOT}/standards/temporary-decisions.md`. `{DOCS_ROOT}` defaults to `docs/`. Target size: no fixed budget — the ledger grows; archive resolved entries to keep the live section under ~15 KB.

## What this artifact is — and is not

**Is:** the project-level backlog of conscious shortcuts that should be removed, with the data needed to remove them safely.

**Is not:**
- A per-file `TODO` dump. Those stay in code; only graduate one here when it carries meaningful cost or risk.
- A wishlist. "Would be nice to refactor X" is not a temporary decision — it's a refactor proposal.
- A bug list. Bugs are bugs; the ledger is for *intentional* shortcuts.
- A long-form ADR archive. An ADR explains a chosen long-term direction; a temporary decision is the explicit opposite — a chosen short-term compromise.

## Entry format

Every entry has the same six fields. The format is rigid because the ledger is grep-friendly and review-friendly only when it is uniform.

```markdown
### TD-{NN} — <short title>

- **Decision:** <what shortcut is in place, with file:line if applicable>
- **Why shortcut:** <the constraint that forced it — date pressure, missing API, unclear requirement>
- **Cost if kept:** <what breaks or hurts the longer this stays>
- **Trigger to revisit:** <the concrete event or condition that ends this; not "someday">
- **Deadline:** <YYYY-MM-DD or "next sprint after the trigger fires">
- **Owner:** <name / role / @handle>
- **Status:** `open` | `in-progress` | `resolved` | `accepted-as-permanent`
```

A `resolved` entry stays in the file for one quarter (so search finds it), then is moved to an archive section at the bottom. An `accepted-as-permanent` entry becomes a candidate for an ADR; once the ADR lands, the entry is removed with a pointer.

## How to write the initial artifact

1. Start with an empty index and the entry format pinned at the top.
2. Walk the codebase for `TODO`, `FIXME`, `XXX`, `HACK` comments and *triage*: graduate the meaningful ones to entries; leave the trivial ones in code.
3. Walk the architecture and standards documents for explicit "for now" decisions; each is an entry.
4. Walk the open-issue tracker for tickets that exist to remove a shortcut; each is an entry.
5. Sort by deadline ascending so the next thing to remove is at the top.

## Read/write protocol — for `dev`, `decomposition`, `code-review`

This is what other skills do when they touch the ledger.

**`dev` — when implementing a story:**
- If the implementation introduces a shortcut (hardcoded value, skipped test, mocked dep, feature flag, `TODO` worth remembering), **add an entry before finishing the story.** Reference the entry id in the code (`// TD-12: see docs/standards/temporary-decisions.md`).
- If the implementation removes a shortcut, mark the matching entry `resolved` with the PR / commit reference.

**`decomposition` — when planning a sprint:**
- Read the ledger sorted by deadline. Any `open` entry whose deadline falls inside the sprint becomes a candidate story.
- If the sprint has slack, pull the next-cheapest entry by `cost-if-kept`.

**`code-review` — when reviewing a change:**
- If the change introduces a shortcut without an entry, the reviewer's first ask is "open a temporary-decisions entry," not "remove the shortcut." Forcing removal in-PR causes scope creep.
- If the change removes a shortcut, confirm the entry is marked `resolved`.

**`verification-before-completion`:**
- Before declaring a feature complete, check that no shortcut taken to reach completion was left without an entry.

## When a shortcut graduates to permanent

If a `Trigger to revisit` fires and the team decides the shortcut is now the right answer:

1. Re-classify the entry as `accepted-as-permanent`.
2. Open an ADR via `adr-writing` to record the decision as a long-term choice with rationale.
3. After the ADR lands, remove the temporary-decisions entry with a one-line pointer to the ADR.

## Anti-patterns this artifact prevents

- Forgotten `TODO` comments shipping to production for years.
- The same shortcut introduced twice because the first one was invisible.
- A sprint with slack and no one knowing what to clear.
- An incident review surprised by a shortcut everyone forgot about.

## Update protocol

- The ledger is reviewed at every sprint planning. Stale entries get a status update or a re-deadline (with reason).
- The reviewer who keeps catching the same shortcut in PRs files a meta-entry to prevent it (e.g. linter rule, template fix).

## Templates and references

- `references/template.md` — the artifact skeleton with the entry format pinned.
- `references/checklist.md` — validation checklist for an entry.

## Who reads this artifact

- `dev` — at the end of every story (write).
- `decomposition` — at every sprint planning (read).
- `code-review` — at every change touching a shortcut (read + enforce).
- `verification-before-completion` — at every completion claim (read).
- `archiving` — when entries are old enough to leave the live section.

## Roles

Authored by the tech lead or solo developer. Updated by anyone implementing or reviewing a change.

## Related

- `standards` — umbrella router.
- `using-standards` — consumer protocol.
- `adr-writing` — when a temporary decision graduates to permanent.
- `decomposition` — pulls entries into sprint planning.
- `code-review` — enforces the "open an entry, do not just merge the shortcut" rule.
