# Database Standards — Validation Checklist

- [ ] Engine + version pinned.
- [ ] Naming table covers tables, columns, FKs, booleans, timestamps, indexes.
- [ ] ID choice made with a one-line reason.
- [ ] Timestamp policy: UTC, TIMESTAMPTZ, NOW() default.
- [ ] Soft-delete decision present (yes with rule, or no with reason).
- [ ] Migrations: tool, file naming, reversibility, zero-downtime rule.
- [ ] Forbidden query patterns enumerated with the allowed alternative.
- [ ] Index baseline rule present (PK, FK, hot-path WHERE).
- [ ] Connections / pool / statement timeout values.
- [ ] Backup cadence, PITR window, runbook pointer.
- [ ] Read replica / partitioning / sharding policy.
- [ ] File size 8-15 KB.
- [ ] No `{{placeholders}}` left.
