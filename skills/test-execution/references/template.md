# Test Report — [Feature / Build]

**Date:** [YYYY-MM-DD]
**Build / commit:** [id]
**Environment:** [OS, config, dependencies]
**Executed by:** [Name]
**Scenarios source:** [link to {DOCS_ROOT}/test/<feature>-scenarios.md]

---

## Run summary

| Result   | Count |
|----------|-------|
| Pass     | 0 |
| Fail     | 0 |
| Blocked  | 0 |
| Skipped  | 0 |
| **Total**| 0 |

---

## Per-case results

| Case ID | Description | Result | Defect | Notes |
|---------|-------------|--------|--------|-------|
| TS-001 | Create with valid data | Pass | — | |
| TS-002 | Reject price = 0 | Fail | DEF-001 | |
| TS-003 | … | Blocked | — | env: queue down |
| TS-004 | … | Skipped | — | out of scope this cycle |

---

## Defects

### DEF-001 — [short title]

- **Severity:** Critical | Major | Minor | Trivial
- **Case:** TS-002
- **Repro steps:**
  1. [exact step with concrete data]
  2. …
- **Expected:** [what the case said should happen]
- **Actual:** [what actually happened]
- **Environment:** [build/commit, OS, config]
- **Evidence:**
  ```
  [quoted failing output / log / stack trace]
  ```

---

## Coverage (acceptance criteria proven)

| AC ID | Proven by passing case? | Status |
|-------|-------------------------|--------|
| FR-001-AC1 | TS-001 | ✓ proven |
| FR-001-AC2 | TS-002 (FAILING) | ✗ unproven |
| FR-001-AC3 | TS-004 (skipped) | ✗ unproven |

---

## Verdict

**Gate:** PASS | FAIL

**Deciding rule:** [e.g. FAIL — 1 open Critical defect (DEF-001); 2 ACs unproven]

**Blockers (if FAIL):**
- [DEF-001] — [next action, e.g. "route to dev for fix, then re-run TS-002"]
- [AC unproven] — [next action]

> PASS requires: all in-scope cases run, no open Critical/Major defects, every AC traced to a passing case.
> A PASS with caveats is a FAIL — name the caveat as a blocker instead.
