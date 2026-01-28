---
name: acceptance-criteria
description: Write testable acceptance criteria in Given/When/Then (Gherkin) format for stories, epics, and features. Use when defining acceptance criteria, writing test scenarios, or when user mentions "acceptance criteria", "Given/When/Then", "Gherkin", "test scenarios", or "AC".
license: MIT
compatibility: opencode
metadata:
  domain: agile
  format: gherkin
---

# Acceptance Criteria Writing Skill

```xml
<acceptance_criteria>
  <definition>Write testable AC in Given/When/Then format</definition>
  
  <format>
    <given>Precondition/context</given>
    <when>Action/trigger</when>
    <then>Expected outcome</then>
    <and>Additional outcomes</and>
  </format>
  
  <quality>
    <testable>Can be verified as pass/fail</testable>
    <independent>No execution order dependency</independent>
    <specific>Exact expected behavior</specific>
    <complete>Covers one complete scenario</complete>
  </quality>
  
  <types>
    <happy_path>Normal, successful flow</happy_path>
    <edge_case>Boundary conditions (min/max/empty)</edge_case>
    <error_case>Invalid input, failures, no side effects</error_case>
    <security>AuthN/AuthZ, 403 Forbidden</security>
    <performance>NFR with measurable metrics (e.g., &lt;200ms p95)</performance>
  </types>
  
  <depth_by_artifact>
    <prd>High-level checklist (Merchant can create product, Validation works)</prd>
    <epic>Feature-level checklist (All CRUD works, Events published, Coverage >80%)</epic>
    <story>Detailed Given/When/Then for each scenario (AC1, AC2, AC3...)</story>
  </depth_by_artifact>
  
  <common_mistakes>
    <vague>Too vague → Define exact behavior</vague>
    <multiple_scenarios>Split into separate ACs</multiple_scenarios>
    <implementation>Focus on WHAT, not HOW</implementation>
    <missing_errors>Always include negative scenarios</missing_errors>
    <no_metrics>Use measurable outcomes (&lt;200ms, not "fast")</no_metrics>
  </common_mistakes>
  
  <templates>
    <crud>
      <create>Given valid data, When POST, Then 201 Created</create>
      <read>Given existing ID, When GET, Then 200 OK</read>
      <update>Given existing ID, When PUT, Then 200 OK</update>
      <delete>Given existing ID, When DELETE, Then 204 No Content</delete>
    </crud>
    <validation>Given invalid field, When create/update, Then 400 Bad Request</validation>
    <authorization>Given user with role, When accessing resource, Then allowed/denied</authorization>
  </templates>
</acceptance_criteria>
```

---

## Example: Story-Level AC

```markdown
## Acceptance Criteria

### AC1: Create product with valid data
**Given** authenticated merchant with "product:create" permission
**When** POST /api/v1/products with valid payload
**Then** 201 Created returned
**And** product has generated UUID
**And** product status is "pending"
**And** "product.created" event published

### AC2: Reject invalid product data
**Given** authenticated merchant
**When** POST /api/v1/products with missing "name"
**Then** 400 Bad Request returned
**And** error response contains validation details
**And** no product is created

### AC3: Reject unauthorized access
**Given** user without "product:create" permission
**When** POST /api/v1/products
**Then** 403 Forbidden returned
```

See `template.md` for full format.
