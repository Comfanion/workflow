---
name: requirements-gathering
description: Use when gathering, eliciting, collecting, refining, writing, reviewing, or validating requirements — i.e., turning a vague idea or stakeholder brief into atomic, measurable, testable, traceable functional (FR) and non-functional (NFR) statements, or checking an existing requirements document/spec for SMART quality, ambiguity, conflicts, and missing metrics. Trigger phrases: "gather/write/validate requirements", "elicit requirements", "requirements doc", "FR/NFR", "stakeholder needs", "define what we're building", "interview me for requirements", "review these requirements", "discovery", "requirements spec". Fires at the start of a new project or feature when requirements don't yet exist or are too vague. NOT for writing the PRD itself (use `prd-writing`), designing architecture (use the architecture skill), or creating epics (use the planning skill) — this skill only owns the requirements document that feeds them.
---

# Requirements Gathering

Requirements are the source of truth for *what the system must do*. The PRD summarizes them, the architecture satisfies them, and tests verify them — so an ambiguous or untestable requirement poisons every artifact downstream. The whole job here is to turn fuzzy stakeholder needs into statements that are atomic, measurable, testable, and traceable.

Output: `{DOCS_ROOT}/requirements/requirements.md`.

## What makes a good requirement

Four properties, non-negotiable, because each one prevents a specific downstream failure:

- **Atomic** — one requirement states one thing. Compound requirements can't be tracked or tested cleanly.
- **Measurable** — numbers, not adjectives. "Fast" is not a requirement; "p95 < 200ms at 1000 RPS" is. A reviewer or QA must be able to decide pass/fail without a conversation.
- **Testable** — you can write a test that verifies it. If you can't imagine the test, the requirement isn't done.
- **Traceable** — every requirement carries a source and, over time, links forward to the module, architecture section, epic, and implementation status that satisfy it.

## Document structure

Load `references/template.md` for the full layout. The core is two tables plus supporting context:

**Functional requirements**, grouped by domain, each row:
`ID | Requirement | Priority | Source | Module | Doc Section | Arch § | Epic | Status`

The traceability columns are filled by different roles as work progresses — Module and Arch § by the architecture role, Epic by the planning role, Status (⬜ → ✅) by the developer during implementation. Leave them empty at gathering time; they are the spine that later lets anyone trace a requirement to its code.

**Non-functional requirements**, by category (Performance, Security, Scalability, Usability, Reliability, Maintainability), each row:
`ID | Requirement | Priority | Metric | Arch § | Status` — and the Metric column must always have a number.

Plus: summary (problem/users/outcomes), stakeholders, constraints, assumptions, dependencies, open questions, glossary.

IDs: `FR-001`, `NFR-001`, sequential, unique. Priorities: **P0** must-have (MVP), **P1** should-have (Growth), **P2** nice-to-have (Vision).

## Eliciting requirements

When the input is a vague brief, drive it out with questions rather than guessing. Useful prompts:

- Functional: What do you need to accomplish? What information must you see? What actions must you take? What should happen when X fails?
- Non-functional: How many concurrent users? What response time is acceptable? What's the data retention policy? What security/compliance standards apply?

Capture answers directly as FR/NFR rows. Where an answer is missing or contested, log it under Open Questions rather than inventing a value.

## Validating requirements

Validation is this same skill from the other side — run it before the requirements feed a PRD, or whenever asked to review a requirements document. Work through `references/checklist.md` and produce a **PASS / WARN / FAIL** verdict saved to `{DOCS_ROOT}/validation/requirements-validation-<date>.md`.

The checks that catch the most real problems:

- **SMART** — each FR is specific, measurable, attainable, relevant, traceable. Score and flag anything that fails.
- **Ambiguous language scan** — flag "should" without a "must", and "might/could/possibly", "fast/quick/responsive", "user-friendly", "etc./and so on". Each is a hidden untestable requirement.
- **Measurable NFRs** — every NFR has a target number and a verification method. "System should be fast" is a FAIL; rewrite as "< 200ms p95".
- **IDs & priorities** — unique, sequential, P0/P1/P2 present; P0 items are genuinely critical.
- **Conflicts** — no contradictory requirements, no circular dependencies, priorities consistent with dependencies.
- **No implementation leakage** — requirements say *what*, not *how*; no technology mandates unless a real constraint.

Name every failing requirement with the current text and a concrete fix ("FR-023: add testable AC"; "NFR-005: define a response-time target"). On PASS, proceed to the PRD; on WARN/FAIL, fix and re-check.

## Roles

Written for whoever holds the analysis role (on a team, the analyst; solo, you). The requirements document is the input the product role turns into a PRD and the architecture role designs against — so its quality gates everything that follows.
