---
name: prd-writing
description: Use whenever the user wants to spec a product or feature at the product level — write, update, review, or validate a Product Requirements Document (PRD). Trigger phrases: "write/update/review a PRD", "validate the PRD", "product requirements document", "product spec", "product brief", "define product vision", "scope the MVP", "what does this deliver and why", "is this PRD complete", "product-level spec". The PRD captures WHY and WHAT only — project-size classification, measurable success criteria, MVP/Growth/Out-of-scope scope, critical business rules, and a requirements summary. NOT for gathering detailed functional/non-functional requirements (use `requirements-gathering`), technical design or stack decisions (use the architecture skill), or task/epic breakdown and delivery phases (use the planning skill) — the PRD links to those, it does not contain them.
---

# PRD Writing

A PRD answers two questions and nothing else: **why** does this product/feature exist, and **what** does success look like. It is the product-level contract everyone aligns on before any design or build starts.

The most common failure when writing a PRD is letting other documents' content leak in — build plans, architecture, detailed requirements. That makes the PRD bloated, stale the moment implementation starts, and impossible to approve cleanly. Keeping strict boundaries is the single most important thing this skill enforces.

## What a PRD contains — and what it must not

A PRD **contains**:
- Executive summary — the press-release version: who benefits and what they can now do
- Project classification — size/complexity/timeline (drives the depth of every downstream artifact)
- Success criteria — measurable MVP and growth targets
- Product scope — MVP, Growth (post-MVP), and explicit Out-of-scope
- Critical business rules — the non-negotiable rules of the domain
- Requirements summary — counts and priorities, with a link to the requirements document
- Glossary — every term that could be read two ways

A PRD **must not contain** (each belongs elsewhere — write a one-line pointer instead):
- Detailed functional/non-functional requirements → the requirements document is the source of truth
- Technical design, stack choices, data models, API specs → architecture documents
- **Task breakdowns, epics, stories, build sequencing, delivery phases** → epics/stories documents
- Implementation detail of any kind → it is HOW, and HOW is not the PRD's job

If you catch yourself writing "Phase 1: build the skeleton" or "first we implement X, then Y", stop — that is a build plan, and it goes in an epic, not here.

## Prerequisite: requirements first

Detailed requirements are the source of truth the PRD summarizes. Before writing, check whether a requirements document exists (default `{DOCS_ROOT}/requirements/requirements.md`).

- **If it exists** — read it. Use it for the Requirements Summary: count functional requirements by domain and priority, count non-functional requirements by category.
- **If it does not exist** — for anything larger than a trivial change, gather requirements first (see the `requirements-gathering` skill). For a tiny change where requirements are obvious and unambiguous, you may capture them inline in the PRD and note that you did so.

## Project classification drives everything

This is the mandatory first section of the PRD. The size you pick sets the depth of the PRD and the granularity of every downstream artifact — including how many epics the work decomposes into. Getting this right prevents both under-specifying large work and over-decomposing small work.

| Size | Examples | PRD depth | Epics | Units? |
|------|----------|-----------|-------|--------|
| **TOY** | Calculator, Tetris, todo list | 2-3 pages, bullets OK | 3-5 (major features) | No |
| **SMALL** | Blog, REST API, CLI tool | 3-5 pages | 5-10 (feature areas) | No |
| **MEDIUM** | E-commerce, CRM | 5-10 pages, think in modules | 8-15 (one epic ≈ one module) | Yes — per module |
| **LARGE** | SaaS, marketplace, payments | 10-20 pages, think in domains | 15-30 (one epic ≈ one domain) | Yes — full |
| **ENTERPRISE** | Banking, healthcare, ERP | 20-50 pages, strategic | 30+ | Yes — audit-ready |

"One epic ≈ one module/domain" is the anti-over-decomposition rule: don't split a medium feature into many tiny epics, and don't cram a large platform into a handful.

## How to write it

1. Read the requirements document (or gather requirements first).
2. Load the template: `references/template.md`. It carries the full section structure, size-impact guidance, and worked examples.
3. Fill every `{{placeholder}}`. Remove sections that genuinely don't apply (e.g. the AI-specific section for a non-AI product), rather than leaving them empty.
4. Make every goal measurable. "Improve UX" gives nobody a target; "reduce checkout abandonment from 40% to 25%" does.
5. Make non-goals explicit. If mobile is out of scope, write it — an absent non-goal reads as "build it".
6. Write the PRD to `{DOCS_ROOT}/prds/<feature-slug>/PRD.md`.

`{DOCS_ROOT}` defaults to `docs/` at the project root; honor the project's configured docs location if one is set.

## Quality bar

Before considering the PRD done, check it against `references/checklist.md`. The checks that matter most:

- **No implementation leakage** — focus is WHAT, not HOW; no technology mandates unless they are a real constraint; no task breakdown.
- **Goals are measurable** — numbers, baselines, and how they're measured.
- **Scope is explicit on all three sides** — MVP, Growth, and Out-of-scope are all named.
- **Every ambiguous term is in the glossary** — agents implement from these definitions.
- **Requirements are summarized, not duplicated** — counts and a link, not the full FR/NFR tables.

## Validating a PRD

Validation is the same skill from the other side: confirm a finished PRD holds up before design starts. Run it when asked to review/validate a PRD, or as your own final pass after writing one.

Prerequisite: the requirements document should be validated first — the PRD's coverage claims are only as good as the requirements they trace to.

Work through `references/checklist.md` and produce a short verdict:

- **Structure** — every required section present (executive summary, classification, success criteria, scope, business rules, requirements summary, glossary).
- **Coverage** — every functional and non-functional requirement from the requirements document is reflected; no orphan requirements that exist in the PRD but not in the source; requirement IDs match across documents.
- **Quality** — the summary explains the *why*; success criteria are measurable; scope boundaries are explicit on all three sides; MVP is minimal but viable; growth depends on MVP; priorities match the requirements document.
- **No implementation leakage** — no task breakdown, no architecture, no stack mandate (unless a real constraint).

Write the verdict as **PASS / WARN / FAIL** with the failing checks named and concrete fix actions. Save it to `{DOCS_ROOT}/validation/prd-validation-<date>.md`. On PASS, the PRD is ready for architecture design; on WARN/FAIL, return to the relevant section above and fix, then re-check.

If the project tracks acceptance criteria as a separate QA artifact, confirm it exists and covers every functional requirement (see the `acceptance-criteria` skill) — treat a missing one as a FAIL when your workflow requires it.

## Roles

This skill is written for whoever holds the product role (on a team, the product owner / PM; solo, you). The PRD is reviewed and approved by the project owner — the author does not approve their own PRD. Downstream, the architecture role turns the PRD into design documents, and the planning role turns it into epics and stories.
