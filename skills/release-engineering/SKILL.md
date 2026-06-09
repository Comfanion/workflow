---
name: release-engineering
description: Plan and document how a change gets versioned, built, promoted across environments, and shipped to production — pick a SemVer bump, lay out the CI/CD pipeline stages, choose a deploy strategy (blue-green, canary, rolling), define a rollback plan, and enforce a hard deploy gate (nothing ships without explicit confirmation and green checks). Use this whenever the user wants to cut a release, ship a change, set up or reason about CI/CD, plan a deployment strategy, or prepare a rollback, or mentions "release", "deploy", "ship it", "CI/CD", "rollback", "cut a release", or "deployment strategy". This produces the release/deploy runbook and gate — it does not write feature code or decide product scope.
---

# Release Engineering

This skill answers one question: **how does a change get from a green build to running in production — safely, and reversibly.** It owns versioning, the pipeline, the promotion path, the deploy strategy, the rollback plan, and the gate that stops a half-baked change from shipping.

The single most important thing here is the **deploy gate**: implementing a change is not deploying it. A passing test suite is not a successful deploy. The most expensive failures in this space come from shipping on a green CI badge alone, with no human confirmation and no rollback ready. This skill exists to make that impossible by default.

## Versioning: SemVer, and why the bump is a contract

Version the release with [SemVer](https://semver.org/) `MAJOR.MINOR.PATCH`, because the number is a promise to whoever consumes the artifact:

- **MAJOR** — a breaking change. Consumers must read the migration notes before upgrading. Never sneak a breaking change into a minor bump; that is how you break downstream silently.
- **MINOR** — new backward-compatible behavior. Safe to take.
- **PATCH** — a backward-compatible fix only. No new surface.

Pick the bump from the actual diff, not the calendar. If a change forces consumers to edit their code or config, it is MAJOR regardless of how small it looks. Pre-release tags (`-rc.1`, `-beta.2`) exist so you can stage a candidate without claiming it is final — use them for anything you want exercised in staging before the real cut.

## The pipeline: stages, in order, each a gate

A release pipeline is a sequence of gates, not a single button. Each stage must pass before the next runs, because letting a later stage start on an unproven earlier one defeats the point of having stages. The canonical order:

1. **Build** — compile/package a single immutable artifact. Build once; promote that same artifact through every environment. Rebuilding per environment means you ship something you never tested.
2. **Test** — unit, then integration. Fail closed: a red stage stops the pipeline.
3. **Scan** — dependency/vulnerability and license checks. A known-critical CVE is a stop, not a warning.
4. **Publish** — push the artifact to the registry, tagged with the SemVer version. Immutable tags only; never overwrite a published version.
5. **Deploy** — promote to the target environment using the chosen strategy (below), behind the gate.
6. **Verify** — smoke checks and observability confirm the deployed version is actually healthy.

State which stages are automated and which need a human. The deploy stage into production is the one that always needs a human (see the gate).

## Environments: promote, don't leapfrog

Changes flow **dev → staging → prod**, in that order, and the artifact that reaches prod is byte-for-byte the one that passed staging. Promotion (not rebuild) is what makes staging meaningful — if you build a fresh artifact for prod, staging tested a different thing.

- **dev** — fast feedback, may be unstable; broken builds expected and fine.
- **staging** — production-like as far as practical (config, data shape, scale proxy). The last place to catch what dev's smaller scale hid.
- **prod** — real users. Every change here is gated and reversible.

Each environment owns its own config and secrets; the artifact is identical, the configuration differs. Baking environment config into the artifact breaks promotion.

## Deploy strategies: pick by blast radius and rollback cost

Choose the strategy from the cost of a bad version reaching users, not from fashion. Each trades infrastructure and complexity for a different rollback speed:

| Strategy | How it works | Choose when | Rollback |
|----------|--------------|-------------|----------|
| **Rolling** | Replace instances in batches | Stateless services, backward-compatible change, cost-sensitive | Roll forward or redeploy previous batch-by-batch (slow-ish) |
| **Blue-green** | Stand up full new version (green) beside old (blue), switch traffic at once | Need instant cutover and instant rollback; can afford double capacity briefly | Flip traffic back to blue — near-instant |
| **Canary** | Route a small % to the new version, watch metrics, ramp up | High-risk change, large user base, want real-traffic signal before full exposure | Stop the ramp, route the canary % back — small blast radius |

Two hard constraints regardless of strategy: a schema/contract change must be **backward-compatible across the overlap window** (old and new run simultaneously in every strategy above), and the strategy is only as good as the signal driving it — canary without metrics to abort on is just a slow full deploy.

## Rollback: plan it before you deploy, not during the incident

A deploy without a rollback plan is a one-way door, and one-way doors are where outages get long. Before the gate, the runbook must state:

- **The trigger** — what observable condition aborts/reverts (error rate over X, p99 latency over Y, smoke check fails, key business metric drops).
- **The mechanism** — exactly how to revert: flip blue-green traffic, halt+revert the canary, redeploy version N-1. Name the command or action.
- **Data/migration safety** — if the release ran a schema migration, can it be rolled back without data loss? Expand-contract migrations (add new, backfill, switch, remove old over separate releases) keep rollback possible; a destructive migration in the same release as the code that needs it makes rollback impossible — flag that as a stop.
- **Who decides** — who can call the rollback, so no one freezes waiting for permission.

If rollback is not actually possible for this release (irreversible migration, external side effect already fired), that is the most important sentence in the runbook — say it loudly and get explicit sign-off on the risk.

## The deploy gate (hard)

**Implement ≠ deploy. A green pipeline is a precondition for shipping, not permission to ship.** Production deploys do not happen automatically and do not happen on assumption. Before any production deploy, all of the following must be true and stated:

1. All pipeline gates green — build, test, scan, publish, staging verify. Quote the result; don't assume it.
2. The deploy strategy and the rollback plan are written down for this release.
3. Observability is in place to tell healthy from broken after the switch.
4. **Explicit human confirmation to ship — obtained, in this turn, for this version.** "Ready to deploy `v2.3.0` to prod; rollback is blue→green flip; confirm?" then wait.

Never trigger a production deploy, `git push` to a deploy branch, or run a release command on the user's behalf without that explicit confirmation. If checks are not green, the gate is closed — report what's red, do not ship. This mirrors the operating rule that implement is not deploy: surface readiness, then wait for the word.

## Post-deploy: it's not done until it's verified healthy

HTTP 200 is not "working." After the switch:

- **Smoke checks** — run the critical-path checks against the deployed version (a real request through the main flow), and quote the result before declaring success.
- **Observability** — watch error rate, latency, saturation, and the one or two business metrics that prove the feature works, across the post-deploy window. A clean deploy with a quietly broken feature is a failed release.
- **Decision point** — healthy → close the release; degraded → execute the rollback plan, don't debug in place under load.

Only after smoke checks pass and metrics hold is the release "done."

## Output

`{DOCS_ROOT}` defaults to `docs/` at the project root; honor the project's configured docs location if set.

Write the release/deploy runbook to `{DOCS_ROOT}/ops/release-<version>.md`. Build it from `references/runbook-template.md` (the full runbook structure: version + bump rationale, pipeline status, environment promotion, deploy strategy, rollback plan, post-deploy verification, sign-off). Before pulling the trigger, work top-to-bottom through `references/deploy-checklist.md` — the gate, in checklist form. **Load `references/runbook-template.md` when you start writing a release, and `references/deploy-checklist.md` right before any production deploy.**

## Roles

Written for whoever holds the devops/release role (on a team, the release engineer or on-call owner; solo, you). The deploy decision is the project owner's to confirm — the release author proposes readiness and never self-approves a production ship. Upstream this consumes a merged, reviewed change; it does not write feature code or decide product scope. Downstream it hands operations a deployed, verified version and a rollback plan that still works.
