# Deploy Checklist — the gate, in order

Load this right before any production deploy. Work top-to-bottom. A single unchecked item in the **Gate** section means the deploy does not happen.

## Pre-flight: pipeline is green

- [ ] Build stage green — a single immutable artifact was produced.
- [ ] Test stage green — unit + integration passing (quote the result, don't assume).
- [ ] Scan stage green — no known-critical CVE, license check passed.
- [ ] Artifact published to the registry with the correct SemVer tag.
- [ ] The exact artifact that passed staging is the one being promoted (no rebuild for prod).

## Versioning

- [ ] SemVer bump matches the diff (MAJOR for breaking, MINOR for new compatible, PATCH for fix-only).
- [ ] If MAJOR: migration/upgrade notes exist for consumers.
- [ ] Version tag is immutable and not reused.

## Strategy + reversibility

- [ ] Deploy strategy chosen and written down (rolling / blue-green / canary) with the reason.
- [ ] Schema/contract changes are backward-compatible across the old+new overlap window.
- [ ] Rollback trigger defined (the observable condition that aborts/reverts).
- [ ] Rollback mechanism named (the exact action/command to revert).
- [ ] Migration rollback safety confirmed — or, if irreversible, the risk is stated and signed off explicitly.
- [ ] Who can call the rollback is named.

## Observability ready

- [ ] Dashboards/alerts in place to tell healthy from broken post-deploy.
- [ ] The 1–2 business metrics that prove the feature works are identified.

## Gate (hard — all must be true)

- [ ] All of the above checked.
- [ ] Rollback plan written for THIS release.
- [ ] **Explicit human confirmation to ship THIS version to prod, obtained this turn.**

If any Gate item is unchecked: the gate is closed. Report what's missing or red. Do not deploy.

## Post-deploy

- [ ] Smoke checks run against the deployed version (real request through the critical path) — result quoted.
- [ ] Error rate / latency / saturation watched across the post-deploy window — holding.
- [ ] Business metrics confirm the feature actually works.
- [ ] Decision recorded: healthy → release closed; degraded → rollback executed (don't debug under load).
