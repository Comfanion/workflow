---
name: acceptance-criteria
description: Author testable acceptance criteria in Given/When/Then (Gherkin) format and produce the project-wide acceptance-criteria QA artifact with its requirements-to-scenarios coverage matrix. Use when the user asks to *define* acceptance criteria, write Given/When/Then or Gherkin scenarios, enumerate ACs (AC1, AC2…) for a story/epic/feature, or build a requirements coverage matrix. Trigger phrases: "acceptance criteria", "Given/When/Then", "Gherkin", "AC1/AC2/AC3", "coverage matrix", "define done for this story", "QA coverage artifact". Do NOT use to author executable test cases, test code, or automated scenarios that *verify* the ACs — that is the `test-scenarios` skill. Do NOT use to attach ACs during epic/story decomposition, or to write the PRD itself — those are the `decomposition` and `prd-writing` skills; this skill is the QA-coverage source they reference, not the author of those artifacts.
---

# Acceptance Criteria

Acceptance criteria turn a requirement into something a person or a test can verify. Each one states a precondition, an action, and an expected outcome, so that "done" stops being an opinion and becomes a pass/fail check. They are the QA contract: the bridge between what the product promises (requirements) and what gets verified before shipping.

The most common failure is writing criteria that read well but cannot be tested — "the system should be fast", "handle errors gracefully". Those are wishes, not criteria. Every line here must be checkable by someone who was not in the room when it was written.

## The Given/When/Then format

Write each scenario as three parts, with optional `And` lines for extra outcomes:

- **Given** — the precondition or context that must hold before the action.
- **When** — the single action or trigger under test.
- **Then** — the expected, observable outcome.
- **And** — additional outcomes or conditions, chained onto any of the above.

One scenario tests one path. The moment you write "and also, separately…", split it into a second criterion — otherwise a failure tells you nothing about which path broke.

## What makes a criterion good

- **Testable** — verifiable as a clean pass or fail, no judgement call.
- **Independent** — does not depend on another criterion having run first; order must not matter.
- **Specific** — names the exact expected behaviour, not a vague intent.
- **Complete** — covers one whole scenario from precondition to outcome, with nothing implied.

These properties exist so that criteria can be handed to a different person (or an automated suite) and still mean exactly one thing. Ambiguity here propagates into every test and every bug report downstream.

## Cover three kinds of path — always

A requirement is not covered until you have written criteria for all of these. Missing the error and edge paths is the single most common gap, because the happy path is the one everyone naturally thinks of.

- **Happy path** — the normal, successful flow. What the feature is *for*.
- **Error case** — invalid input, failures, missing permissions. Verify the right error *and* that no side effects leaked (nothing created, nothing charged).
- **Edge case** — boundary conditions: empty, minimum, maximum, the value just over the limit.

Two more apply whenever the requirement touches them:

- **Security** — authentication and authorization. Who is allowed, who gets 403, and what an unauthorized caller can and cannot see.
- **Performance** — non-functional targets stated as measurable numbers (e.g. `< 200ms p95`, `> 1000 RPS`), never "fast" or "responsive".

## Depth depends on the artifact

Match the granularity to where the criteria live. Over-specifying a PRD bloats it; under-specifying a story leaves engineers guessing.

| Artifact | Depth of acceptance criteria |
|----------|------------------------------|
| **PRD** | High-level checklist — "Merchant can create a product", "Validation rejects bad input" |
| **Epic** | Feature-level checklist — "All CRUD operations work", "Events published", "Coverage > 80%" |
| **Story** | Full Given/When/Then for each scenario (AC1, AC2, AC3…), happy + error + edge |

## Common mistakes

- **Too vague** → replace intent with exact behaviour ("returns 400 with a validation message", not "handles bad input").
- **Multiple scenarios in one criterion** → split each into its own AC.
- **Describing implementation** → state WHAT is observable, not HOW it is built; the criterion must survive a rewrite of the internals.
- **No negative scenarios** → always add error and unauthorized cases.
- **No metrics on NFRs** → use measurable outcomes (`< 200ms`), never adjectives.

## Quick patterns

CRUD endpoints map cleanly onto status codes:

- **Create** — Given valid data, When POST, Then 201 Created (and the resource has a generated id).
- **Read** — Given an existing id, When GET, Then 200 OK with the resource.
- **Update** — Given an existing id, When PUT, Then 200 OK with the updated resource.
- **Delete** — Given an existing id, When DELETE, Then 204 No Content.

Validation: Given an invalid field, When create/update, Then 400 Bad Request with details and no record persisted.

Authorization: Given a user with a given role, When accessing the resource, Then access is allowed or denied (403) per the rule.

## Example — story-level criteria

```markdown
### AC1: Create product with valid data
**Given** an authenticated merchant with "product:create" permission
**When** POST /api/v1/products with a valid payload
**Then** 201 Created is returned
**And** the product has a generated UUID
**And** the product status is "pending"
**And** a "product.created" event is published

### AC2: Reject invalid product data
**Given** an authenticated merchant
**When** POST /api/v1/products with a missing "name"
**Then** 400 Bad Request is returned
**And** the error response contains validation details
**And** no product is created

### AC3: Reject unauthorized access
**Given** a user without "product:create" permission
**When** POST /api/v1/products
**Then** 403 Forbidden is returned
```

## The project-wide AC artifact

When acceptance criteria are tracked as a standalone QA document (referenced this way by the PRD-writing and decomposition skills), build it from `references/template.md`. That artifact groups criteria by domain, captures functional and non-functional criteria separately, and — most importantly — carries a **coverage matrix** that ties every functional requirement to its AC count, definition status, and the epic/story that implements it. The matrix is what lets anyone confirm at a glance that no requirement shipped without verifiable criteria.

Save the artifact under `{DOCS_ROOT}/acceptance-criteria/` (`{DOCS_ROOT}` defaults to `docs/` at the project root; honor the project's configured docs location if one is set).

## Roles

This skill is written for whoever holds the QA role (on a team, the QA lead; solo, you). The criteria are reviewed alongside the requirements they trace to, and consumed downstream by whoever implements and tests each story.
