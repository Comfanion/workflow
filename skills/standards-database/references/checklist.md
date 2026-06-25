# Database Standards — Validation Checklist

- [ ] Engine + version pinned; the engine decision cites its governing ADR (not restated here).
- [ ] Naming table covers tables, columns, FKs, booleans, timestamps, indexes.
- [ ] ID choice made with a one-line reason.
- [ ] Money rule present: never float; one representation stated, with its governing ADR.
- [ ] Timestamp policy: UTC, TIMESTAMPTZ, NOW() default.
- [ ] Soft-delete decision present (yes with rule, or no with reason).
- [ ] Migrations: tool, file naming, reversibility, zero-downtime rule.
- [ ] Forbidden query patterns enumerated with the allowed alternative.
- [ ] Index baseline rule present (PK, FK, hot-path WHERE).
- [ ] System-of-record table: which data is owned vs read across a contract.
- [ ] Connection / pool config referenced in the boilerplate, with the rule stated here.
- [ ] Runnable artifacts (migration config, ORM/codegen config, schema files) referenced in the boilerplate, not pasted.
- [ ] Governing ADR linked for engine, money, and delete policy — no invented numbers.
- [ ] Backup cadence, PITR window, runbook pointer.
- [ ] Read replica / partitioning / sharding policy.
- [ ] File size 8-15 KB.
- [ ] No `{{placeholders}}` left.
