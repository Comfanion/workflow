# Incident Triage — decision checklist

Walk top to bottom before any code is touched. Every answer lands in `report.md#triage`.

## 1. Classification recorded?

- [ ] Bug report exists at `{DOCS_ROOT}/bugs/<id>/report.md` with symptom, expected, reproduction (or "not yet reproduced"), environment, started.

## 2. Severity — take the highest true rung

- [ ] S1: data being lost/corrupted now, OR primary flow fails for all users?
- [ ] S2: a feature unusable, no workaround?
- [ ] S3: degraded, workaround exists?
- [ ] S4: cosmetic / dev-only?
- [ ] Blast radius answered (data / who / spreading) — spreading promotes one rung.

## 3. Rollback-first — ALL three or none

- [ ] Symptom started after a recent deploy/merge (checked `git log`, not guessed)?
- [ ] Rollback is one revert / one redeploy?
- [ ] No irreversible migration or data transformation since?
- [ ] If all yes → rolled back, symptom confirmed gone, noted in report. Flow continues to diagnosis.

## 4. Fork

- [ ] S1/S2 → incident: mitigate now, then `systematic-debugging`.
- [ ] S3/S4 → bug: one backlog line, no interruption.

## 5. Hotfix — ALL three or story path

- [ ] S1/S2 with ongoing impact or active corruption?
- [ ] Rollback unavailable or insufficient?
- [ ] Fix estimated ≤2 production files, no schema/contract change?
- [ ] Verdict recorded. If hotfix: verify/review/doc-impact backfill within 48h is noted as a commitment, not waived.

## 6. Handoff

- [ ] `systematic-debugging` invoked for root cause — triage wrote no fix.
