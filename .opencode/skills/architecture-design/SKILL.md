---
name: architecture-design
description: Design system architecture, define module boundaries, choose architectural patterns (Hexagonal, DDD, CQRS, Event Sourcing), and document technology decisions. Use when designing architecture, defining modules, choosing patterns, or when user mentions "architecture", "system design", "module boundaries", "DDD", "CQRS", "hexagonal", or "technology stack".
license: MIT
compatibility: opencode
metadata:
  domain: software-architecture
  patterns: hexagonal, ddd, cqrs, event-sourcing, saga
  artifacts: docs/architecture.md
---

# Architecture Design Skill

```xml
<architecture_design>
  <definition>Design system architecture, define module boundaries, choose patterns</definition>
  
    <TOY lines="200-500" diagrams="C4 Context+Container" adrs="None">Core components only</TOY>
    <SMALL lines="500-1000" diagrams="+C4 Component" adrs="2-3">Clear module boundaries</SMALL>
    <MEDIUM lines="1000-2000" diagrams="+Sequences+ER" adrs="5-10">Complete system design</MEDIUM>
    <LARGE lines="2000-4000" diagrams="+Deployment+State" adrs="10-20">Multiple files OK</LARGE>
    <ENTERPRISE lines="4000+" diagrams="All" adrs="20+">Per-domain files</ENTERPRISE>
  </depth_by_size>
  
  <modules>
    <TOY>No modules - flat components</TOY>
    <SMALL>No modules - flat services</SMALL>
    <MEDIUM>YES - 3-5 modules (Purpose, Services, Data, API, Events)</MEDIUM>
    <LARGE>YES - 5-10 domains</LARGE>
    <ENTERPRISE>YES - 10+ bounded contexts</ENTERPRISE>
  </modules>
  
  <structure>
    <executive_summary>What system is, pattern choice, key domains, scale</executive_summary>
    <decision_summary>Table: Category | Decision | Rationale</decision_summary>
    <system_context>C4 Context diagram (ASCII)</system_context>
    <modules_overview>Per domain/module: Purpose, Services, Data, Events</modules_overview>
    <data_architecture>Table: Module | DB | Cache | ER diagram</data_architecture>
    <integration>External systems, internal communication</integration>
    <cross_cutting>Security, Observability, Error Handling</cross_cutting>
    <nfr_compliance>Table: NFR | Requirement | How Addressed</nfr_compliance>
    <references>Links to PRD, ADRs, Units</references>
  </structure>
  
  <unit_documentation>
    <MEDIUM_plus>Create docs/units/module-name/ for each module</MEDIUM_plus>
    <use_skill>unit-writing</use_skill>
  </unit_documentation>

For each module/domain/entity, create separate Unit document.

Use: `@.opencode/skills/unit-writing/template.md`

Reference in architecture:
```
→ Unit: `catalog`
→ Unit: `Task`
```

  <architecture_styles>
    <Layered best_for="Simple CRUD, MVPs" team="1-3" complexity="Low"/>
    <Hexagonal best_for="Testable logic, many integrations" team="3-10" complexity="Medium"/>
    <Clean best_for="Complex domain, long-term" team="5+" complexity="Medium-High"/>
    <Microservices best_for="Independent scaling, multiple teams" team="10+" complexity="High"/>
    <Vertical_Slices best_for="Feature teams, rapid iteration" team="Any" complexity="Medium"/>
  </architecture_styles>
  
    <CQRS use_when="Read/write ratio >10:1, complex queries" avoid="Simple CRUD"/>
    <Event_Sourcing use_when="Audit trail, temporal queries" avoid="Simple state"/>
    <Saga use_when="Distributed transactions" types="Choreography, Orchestration"/>
    <Resilience>Circuit Breaker, Retry, Bulkhead, Timeout, Fallback</Resilience>
  </patterns>
  
  <module_boundaries>
    <single_responsibility>One business capability</single_responsibility>
    <data_ownership>Clear entity ownership</data_ownership>
    <interfaces>API contracts</interfaces>
    <communication>Direct call, REST/gRPC, Events (avoid Shared DB)</communication>
  </module_boundaries>
  
  <traceability>
    <after_architecture>Update requirements.md with Module/Arch § columns</after_architecture>
  </traceability>
</architecture_design>
```

---

## Example: MEDIUM E-commerce Architecture

```yaml
id: ARCH-001
version: 1.0
```

# Architecture Document

## Executive Summary

E-commerce platform using Hexagonal Architecture with 3 modules: Order, Inventory, Payment.

## Decision Summary

| Category | Decision | Rationale |
|----------|----------|-----------|
| Architecture | Hexagonal | Testability, many integrations |
| Database | PostgreSQL | ACID, complex queries |

## Modules Overview

### Order Management Module

**Purpose:** Order lifecycle management

**Internal Services:**
- OrderService: CRUD
- OrderWorkflowService: Status transitions

**Data Ownership:**
- orders, order_items tables

**API:**
- POST /orders
- GET /orders/{id}

→ Unit: `docs/units/order-management/`

See `template.md` for full format.
