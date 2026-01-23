# PRD Acceptance Criteria

**PRD Version:** [X.Y]
**Date:** [YYYY-MM-DD]
**Author:** [Name]
**Status:** Draft | Review | Approved

---

## Overview

This document defines acceptance criteria for all Functional Requirements from the PRD.
Each FR must have testable acceptance criteria before implementation begins.

---

## Acceptance Criteria by Domain

### [Domain 1: e.g., Catalog Management]

#### FR-001: [Requirement Title]

**Priority:** P0 | P1 | P2
**PRD Reference:** Section X.Y

**Acceptance Criteria:**

| AC ID | Given | When | Then | Status |
|-------|-------|------|------|--------|
| FR-001-AC1 | [precondition] | [action] | [expected result] | Draft |
| FR-001-AC2 | [precondition] | [action] | [expected result] | Draft |

**Edge Cases:**
- [ ] [Edge case 1 - what happens when...]
- [ ] [Edge case 2 - what happens when...]

**Negative Tests:**
- [ ] [Invalid input scenario 1]
- [ ] [Invalid input scenario 2]

---

#### FR-002: [Requirement Title]

**Priority:** P0 | P1 | P2
**PRD Reference:** Section X.Y

**Acceptance Criteria:**

| AC ID | Given | When | Then | Status |
|-------|-------|------|------|--------|
| FR-002-AC1 | [precondition] | [action] | [expected result] | Draft |

---

### [Domain 2: e.g., Order Processing]

#### FR-010: [Requirement Title]

**Priority:** P0 | P1 | P2
**PRD Reference:** Section X.Y

**Acceptance Criteria:**

| AC ID | Given | When | Then | Status |
|-------|-------|------|------|--------|
| FR-010-AC1 | [precondition] | [action] | [expected result] | Draft |

---

## NFR Acceptance Criteria

### Performance (NFR-001 - NFR-0XX)

| NFR ID | Metric | Target | Test Method | Status |
|--------|--------|--------|-------------|--------|
| NFR-001 | Response time | < 200ms p95 | Load test with k6 | Draft |
| NFR-002 | Throughput | > 1000 RPS | Load test with k6 | Draft |

### Security (NFR-0XX - NFR-0XX)

| NFR ID | Requirement | Test Method | Status |
|--------|-------------|-------------|--------|
| NFR-010 | JWT authentication | Auth test suite | Draft |
| NFR-011 | Data encryption | Security audit | Draft |

### Scalability (NFR-0XX - NFR-0XX)

| NFR ID | Requirement | Test Method | Status |
|--------|-------------|-------------|--------|
| NFR-020 | Horizontal scaling | K8s scaling test | Draft |

---

## Coverage Matrix

| FR ID | AC Count | AC Defined | AC Approved | Epic | Story |
|-------|----------|------------|-------------|------|-------|
| FR-001 | 3 | ✅ | ⏳ | E01 | S01-01 |
| FR-002 | 2 | ✅ | ⏳ | E01 | S01-02 |
| FR-010 | 4 | ⏳ | ❌ | E02 | - |

**Legend:**
- ✅ Complete
- ⏳ In Progress
- ❌ Not Started

---

## Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Manager | | | |
| Tech Lead | | | |
| QA Lead | | | |

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | YYYY-MM-DD | [Name] | Initial draft |
