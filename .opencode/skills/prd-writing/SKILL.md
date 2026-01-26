---
name: prd-writing
description: Use when creating a PRD from requirements with proper structure and traceability
license: MIT
compatibility: opencode
metadata:
  domain: product-management
  artifacts: docs/prd.md
---

# PRD Writing Skill

## When to Use

Use this skill when you need to:
- Create a new PRD from requirements
- Structure product requirements into a coherent document
- Define scope boundaries (MVP/Growth/Vision)

## Template

Use the template at: `@.opencode/skills/prd-writing/template.md`

## PRD Structure (v3 - with Project Classification)

### 0. Project Classification (MANDATORY FIRST SECTION)

**Purpose:** This section determines how deep and detailed ALL subsequent artifacts will be.

**CRITICAL - Fill this FIRST:**
1. Ask user about project (or infer from requirements)
2. Classify size based on timeline and complexity
3. Fill the classification table
4. Adapt your writing style for the rest of PRD

**Classification Table:**

| Attribute | Value | Notes |
|-----------|-------|-------|
| **Size** | toy / small / medium / large / enterprise | See guide below |
| **Complexity** | simple / moderate / complex / very_complex | Business logic depth |
| **Team Size** | 1-100+ | Number of developers |
| **Timeline** | Days/weeks/months | Expected duration |
| **Domain** | game / web_app / api / library / cli / mobile_app / embedded | Project type |

**Size Impact Table:**

| Attribute | Value |
|-----------|-------|
| **PRD Depth** | X-Y pages |
| **Architecture** | X-Y lines |
| **Epics** | X-Y (scope: feature/module/domain) |
| **Stories per Epic** | X-Y |
| **Sprints** | X |

---

### How to Classify Project Size

**Ask yourself:**
- What's the scope? (single feature vs full system)
- How complex is the business logic? (simple CRUD vs complex workflows)
- How many integrations? (none vs many external systems)
- What's the data model? (few entities vs complex relationships)
- Who's the team? (solo vs multiple teams)

---

**TOY** - Learning/Prototype
- **Examples:** Tetris, Calculator, Tic-tac-toe, Todo list
- **Scope:** Single feature or concept exploration
- **Complexity:** Minimal business logic, no integrations
- **Data:** No database or simple localStorage
- **Team:** Solo developer
- **What to write:**
  - PRD: 2-3 pages, bullet points OK
  - Architecture: 200-500 lines, simple component diagram
  - Structure: Flat components (GameEngine, Renderer, ScoreManager)
  - Epics: 3-5 major features ("Game Logic", "UI", "Scoring")
  - No modules, no Unit docs

---

**SMALL** - Simple Application
- **Examples:** Blog, Portfolio site, Simple REST API, Chrome extension, CLI tool
- **Scope:** Single application with basic CRUD
- **Complexity:** Simple business logic, 1-2 integrations max
- **Data:** Basic database (5-10 tables), simple relationships
- **Team:** 1-2 developers
- **What to write:**
  - PRD: 3-5 pages, structured tables
  - Architecture: 500-1000 lines, C4 Context + Container + Component
  - Structure: Flat services (AuthService, PostService, CommentService)
  - Epics: 5-10 feature areas ("User Auth", "Post Management")
  - No modules yet, no Unit docs

---

**MEDIUM** - Multi-Module System
- **Examples:** E-commerce site, CRM, Mobile app, Booking system
- **Scope:** Multiple interconnected features
- **Complexity:** Moderate business logic, 3-5 integrations, workflows
- **Data:** 15-30 tables, complex relationships, transactions
- **Team:** 2-5 developers (small team)
- **What to write:**
  - PRD: 5-10 pages, break into **MODULES**
  - Architecture: 1000-2000 lines, full C4 model + sequences
  - Structure: **Modules** (OrderModule, InventoryModule, PaymentModule)
  - Epics: 8-15, **each Epic = one Module**
  - **Create Unit docs** for each module: `docs/units/module-name/`
  - Module boundaries matter - define what's in/out

---

**LARGE** - Multi-Domain Platform
- **Examples:** Multi-tenant SaaS, Payment platform, Social network, Marketplace
- **Scope:** Multiple domains with complex interactions
- **Complexity:** Complex business logic, 10+ integrations, event-driven
- **Data:** 50-100+ tables, multiple databases, caching layers
- **Team:** 5-20 developers (multiple teams)
- **What to write:**
  - PRD: 10-20 pages, think in **DOMAINS**
  - Architecture: 2000-4000 lines, likely multiple files per domain
  - Structure: **Domains/Bounded Contexts** (OrderDomain, PaymentDomain)
  - Epics: 15-30, **each Epic = one Domain**
  - **Complete Unit docs** with API specs, events, data models
  - ADRs for all major decisions (affects multiple teams)
  - Security review required

---

**ENTERPRISE** - Mission-Critical System
- **Examples:** Banking system, Healthcare platform, ERP, Trading platform
- **Scope:** Enterprise-wide system with governance
- **Complexity:** Very complex, regulatory compliance, high availability
- **Data:** 100+ tables, distributed databases, audit trails
- **Team:** 20+ developers (large organization)
- **What to write:**
  - PRD: 20-50 pages, strategic document
  - Architecture: 4000+ lines, per-domain files
  - Structure: **Bounded Contexts** with subdomains
  - Compliance requirements in every section
  - Multiple review stages (security, compliance, legal)
  - Audit-ready documentation

---

### How Size Affects Your Writing

**TOY/SMALL - Keep it lean:**
```markdown
## Functional Requirements

### Game Logic
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-001 | User can rotate block | P0 |
| FR-002 | Blocks fall automatically | P0 |
| FR-003 | Full lines disappear | P0 |

**Notes:**
- Rotation uses standard Tetris rules
- Fall speed increases with score
```

**MEDIUM - Structured by modules:**
```markdown
## Functional Requirements

### Order Management Module
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-ORD-001 | Customer can create order with items | P0 |
| FR-ORD-002 | System validates inventory before order | P0 |
| FR-ORD-003 | Order status follows workflow (pending → paid → shipped) | P0 |

**Notes:**
- Order cannot be modified after payment
- Inventory reserved on order creation, committed on payment

→ Unit: `docs/units/order-management/`

### Payment Module
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-PAY-001 | System integrates with Stripe | P0 |
| FR-PAY-002 | Payment failures trigger order cancellation | P0 |

→ Unit: `docs/units/payment/`
```

**LARGE/ENTERPRISE - Domain-driven:**
```markdown
## Functional Requirements

### Order Domain
→ Unit: `docs/units/order-domain/`

#### Order Lifecycle
| ID | Requirement | Priority | Compliance |
|----|-------------|----------|------------|
| FR-ORD-001 | Customer can create order | P0 | GDPR: consent required |
| FR-ORD-002 | Order audit trail maintained | P0 | SOX: 7 year retention |

#### Order Validation
...

### Payment Domain
→ Unit: `docs/units/payment-domain/`
...
```

### 1. Executive Summary

Brief prose section with:
- What the system is and does
- Architecture pattern
- Key domains (numbered list)
- What makes this special (unique value)
- Scale (MVP and Growth targets)

### 2. Success Criteria

| Section | Content |
|---------|---------|
| MVP Success | Measurable criteria for launch |
| Growth Success | Measurable criteria for scale |

### 3. Product Scope

| Section | Content |
|---------|---------|
| MVP | Features by domain |
| Growth Features | Post-MVP enhancements |
| Out of Scope | Explicit exclusions |

**IMPORTANT - Module Breakdown by Size:**

- **TOY/SMALL:** No modules needed, flat feature list
- **MEDIUM+:** Break into modules/domains (Units)
  - Each module = separate section in scope
  - Each module will become Epic later
  - Example: "Order Management Module", "Payment Module"

### 4. Functional Requirements

**Grouping by Project Size:**

**TOY/SMALL projects:**
- Group by feature area (flat structure)
- Example: "Game Logic", "UI", "Scoring"

**MEDIUM+ projects:**
- Group by Module/Unit (hierarchical)
- Each module gets its own FR table
- Example: "Order Management Module" → FR-ORD-001, FR-ORD-002

**Table format:**

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-001 | {{requirement}} | P0 |

With **Notes:** for business rules after each domain table.

**Module-based FR IDs (MEDIUM+):**
```
FR-ORD-001  # Order Management module
FR-PAY-001  # Payment module
FR-INV-001  # Inventory module
```

### 5. Non-Functional Requirements

Tables for:
- Performance (with metrics)
- Security
- Scalability

### 6. Critical Business Rules

Numbered list with **bold rule name** — description format.

### 7. Glossary

| Term | Definition |
|------|------------|

### 8. References

Using `→` format:
```
→ Architecture: `docs/architecture.md`
→ Requirements: `docs/requirements.md`
```

## Units (Modules/Domains)

**What is a Unit?**
A Unit is a module, domain, or bounded context - a cohesive piece of the system.

**When to create Units?**

| Project Size | Units? | Scope | Examples |
|--------------|--------|-------|----------|
| **TOY** | No | Flat features | "Game Logic", "UI", "Scoring" |
| **SMALL** | No | Flat features | "Auth", "Posts", "Comments" |
| **MEDIUM** | Yes | Modules | "Order Management", "Inventory", "Payment" |
| **LARGE** | Yes | Domains | "Order Domain", "Payment Domain" |
| **ENTERPRISE** | Yes | Bounded Contexts | "Core Banking", "Risk Management" |

**For MEDIUM+ projects:**
1. Identify modules/domains in Executive Summary
2. Create separate scope section per module
3. Group FRs by module (FR-ORD-001, FR-PAY-001)
4. Each module → separate Epic later
5. Each module → separate Unit documentation (docs/units/module-name/)

**Unit Documentation:**
- For MEDIUM+ projects, create `docs/units/module-name/index.md` for each module
- Use `unit-writing` skill to document each unit
- Link from PRD: `→ Unit: Order Management - docs/units/order-management/`

## Writing Guidelines

### Reference Format

Always use `→` prefix for links:
```
→ Unit: `Order Management` - docs/units/order-management/
→ FR: `FR-001`
→ ADR: `ADR-001`
→ `path/to/file.md`
```

### Requirement IDs
- Functional: `FR-001`, `FR-002`, ...
- Non-Functional: `NFR-001`, `NFR-002`, ...

### Priority Levels
- **P0**: Must have for MVP
- **P1**: Should have for growth
- **P2**: Nice to have for vision

### Tables over Prose

Prefer structured tables over paragraphs:
```markdown
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-001 | User can create task | P0 |
```

NOT:
```markdown
FR-001: The user shall be able to create a task. This is a P0 requirement...
```

## Validation Checklist

Before completing PRD:
- [ ] Executive summary explains the "why"
- [ ] All FRs from requirements.md are addressed
- [ ] All NFRs have measurable metrics
- [ ] Success criteria are measurable
- [ ] Scope boundaries are clear
- [ ] Critical business rules documented
- [ ] Uses `→` reference format
- [ ] Tables used for structured data

## Output

Save to: `docs/prd.md`

## Related Skills

- `acceptance-criteria` - For writing testable AC
- `requirements-gathering` - For source requirements
- `prd-validation` - For validating the PRD
- `unit-writing` - For documenting units referenced in PRD
