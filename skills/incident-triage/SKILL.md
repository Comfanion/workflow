---
name: incident-triage
description: Use the moment something is broken in a running project and the next action is undecided — "production is down", "users can't log in", "the app broke after the last deploy", "how bad is this?", "hotfix or story?", "roll back or fix forward?". This skill classifies severity and blast radius with checkable criteria, applies the rollback-first rule, and forks the work — incident (mitigate now) vs bug (queue as a story), hotfix vs normal flow. It ends by handing off; it never diagnoses or fixes anything itself. Hard rule: no fix path is chosen before the classification is recorded. Entry phase of the `bugfix` flow (FLOW.yaml). Do NOT use for: root-causing the failure once the path is chosen (`systematic-debugging` — triage decides what to do first, debugging finds why); a red test during development (`dev` / `test-execution` — a failing test on a branch is not an incident); shipping or rolling back mechanics (`release-engineering`); recording what the fix invalidated afterwards (`doc-impact`).
---

# Incident Triage

Mitigation and diagnosis run on different clocks. When something is broken for real users (even if the only user is you), the first question is not "why" — it is "how bad, and what stops the bleeding fastest". Debugging first while the damage spreads is the failure mode; so is dropping everything for a cosmetic glitch that could have waited in the backlog. Triage is the five minutes that decides which clock you are on.

## The rule

```
NO FIX PATH BEFORE THE CLASSIFICATION AND FORK ARE RECORDED
```

Severity, blast radius, rollback decision, fork verdict — written down first, in the bug report (`{DOCS_ROOT}/bugs/<id>/report.md#triage`). Then, and only then, code. The record is cheap (a filled template) and it is what keeps "quick look" from silently becoming an unplanned three-hour debugging session on an S4.

## Severity ladder — binary criteria, no vibes

No external SLA here — severity is about *your* data and *your* users, however few. Take the highest rung whose criterion is true:

| Sev | Criterion (binary) | Clock |
|-----|--------------------|-------|
| **S1** | Data is being lost or corrupted right now, OR the primary flow fails for all users | Mitigate now — everything else waits |
| **S2** | A feature is unusable and no workaround exists | Mitigate now |
| **S3** | Degraded, but a workaround exists | Queue — normal pace |
| **S4** | Cosmetic, dev-only, or affects no real usage | Queue — backlog |

## Blast radius — three questions

1. **What data is affected** — none / recoverable / being corrupted?
2. **Who hits it** — one path, one user, everyone?
3. **Is it spreading** — stable symptom, or growing (queue backlog, corrupt rows accumulating)?

"Spreading" promotes one severity rung: an S3 whose damage accumulates is an S2.

## Rollback-first rule

Roll back *before* debugging when ALL three hold:

1. The symptom started after a recent deploy or merge (check what shipped — `git log` beats speculation).
2. Rollback is one revert or one redeploy of the previous version.
3. No irreversible migration or data transformation ran since that deploy.

If all three: roll back now (mechanics → `release-engineering`), confirm the symptom is gone, then continue to diagnosis at normal pace. A rollback is mitigation, not a fix — the flow does not end here.

## The fork

| Verdict | When | What happens |
|---------|------|--------------|
| **Incident** | S1/S2 | Mitigate now (rollback if the rule allows), then straight into `systematic-debugging` |
| **Bug** | S3/S4 | One line in the backlog (`decomposition` story or a note in sprint-status); nobody is interrupted; the bugfix flow picks it up when scheduled |

## Hotfix vs normal flow

A hotfix skips nothing except the calendar — verify, review, and doc-impact still run (backfilled within 48h if truly racing). Hotfix path only when **ALL** hold:

1. S1/S2 with ongoing user-facing impact or active data corruption.
2. Rollback is unavailable or insufficient (the rollback-first rule did not resolve it).
3. The fix is estimated at ≤2 production files with no schema or contract change.

Any criterion false → normal story path, even for an incident whose bleeding a rollback already stopped. If mid-fix the patch outgrows criterion 3, demote to the story path — the estimate was wrong, not the rule.

## Handoffs

- **Always** into `systematic-debugging` for the root cause — triage never diagnoses.
- If diagnosis shows code and docs agree and the user simply wants different behavior → this was never a bug; reclassify to the `small-change` flow.
- If the 3-fix rule fires in debugging → the cause is structural; reclassify to `refactor` or the architecture phase.
- At close, `doc-impact` — an S1/S2 root cause almost always invalidated a document.

## Roles

Run by whoever receives the report — usually the conducting agent (`secretary`) at intake, with the analyst lens for the classification. The developer takes over at diagnosis; triage's job is done when the fork verdict is written.

## Related

- `systematic-debugging` — receives every triaged failure; owns the "why".
- `release-engineering` — rollback and ship mechanics; the deploy gate on the way out.
- `doc-impact` — the mandatory close-out of the bugfix flow.
- `decomposition` — where S3/S4 bugs queue as stories.
