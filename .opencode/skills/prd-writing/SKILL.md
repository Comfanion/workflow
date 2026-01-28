---
name: prd-writing
description: Create Product Requirements Document from validated requirements with project classification, success metrics, and feature specifications. Use when writing PRD, documenting product vision, defining features, or when user mentions "product requirements", "PRD", "product spec", or "feature definition".
license: MIT
compatibility: opencode
metadata:
  domain: product-management
  artifacts: docs/prd.md
---

# PRD Writing Skill

```xml
<prd_writing>
  <definition>Create PRD from requirements with product vision</definition>
  
  <prd_contains>
    <executive_summary>Business value, vision</executive_summary>
    <project_classification>Size, complexity, timeline (MANDATORY FIRST SECTION)</project_classification>
    <success_criteria>Metrics, KPIs</success_criteria>
    <product_scope>MVP/Growth/Out-of-scope</product_scope>
    <user_flows>High-level capabilities</user_flows>
    <business_rules>Critical rules</business_rules>
    <ai_considerations optional="true">For AI/RAG systems</ai_considerations>
    <requirements_summary>Counts, priorities, link to requirements.md</requirements_summary>
  </prd_contains>
  
  <prd_does_not_contain>
    <detailed_fr_nfr>→ requirements.md (source of truth)</detailed_fr_nfr>
    <technical_details>→ architecture.md</technical_details>
    <task_breakdowns>→ epics/*.md, stories/*.md</task_breakdowns>
    <api_specs>→ units/*/api-spec.md</api_specs>
    <data_models>→ units/*/data-model.md</data_models>
  </prd_does_not_contain>
  
    <project_classification mandatory="true" first_section="true">
      <purpose>Determines depth of all artifacts (PRD, Architecture, Epics, Stories)</purpose>
      <attributes>Size, Complexity, Team Size, Timeline, Domain</attributes>
      
      <TOY>
        <examples>Tetris, Calculator, Todo list</examples>
        <scope>Single feature</scope>
        <team>Solo</team>
        <prd>2-3 pages, bullet points OK</prd>
        <architecture>200-500 lines, simple diagram</architecture>
        <structure>Flat components</structure>
        <epics>3-5 features</epics>
        <units>No</units>
      </TOY>
      
      <SMALL>
        <examples>Blog, REST API, CLI tool</examples>
        <scope>Single app, basic CRUD</scope>
        <team>1-2 devs</team>
        <prd>3-5 pages</prd>
        <architecture>500-1000 lines, C4 model</architecture>
        <structure>Flat services</structure>
        <epics>5-10 feature areas</epics>
        <units>No</units>
      </SMALL>
      
      <MEDIUM>
        <examples>E-commerce, CRM, Mobile app</examples>
        <scope>Multi-module system</scope>
        <team>2-5 devs</team>
        <prd>5-10 pages, break into MODULES</prd>
        <architecture>1000-2000 lines, full C4</architecture>
        <structure>Modules (OrderModule, PaymentModule)</structure>
        <epics>8-15, each Epic = one Module</epics>
        <units>Yes - docs/units/module-name/</units>
      </MEDIUM>
      
      <LARGE>
        <examples>SaaS, Payment platform, Marketplace</examples>
        <scope>Multi-domain platform</scope>
        <team>5-20 devs</team>
        <prd>10-20 pages, think in DOMAINS</prd>
        <architecture>2000-4000 lines</architecture>
        <structure>Domains/Bounded Contexts</structure>
        <epics>15-30, each Epic = one Domain</epics>
        <units>Yes - complete with API specs, events</units>
      </LARGE>
      
      <ENTERPRISE>
        <examples>Banking, Healthcare, ERP</examples>
        <scope>Enterprise-wide, compliance</scope>
        <team>20+ devs</team>
        <prd>20-50 pages, strategic</prd>
        <architecture>4000+ lines, per-domain files</architecture>
        <structure>Bounded Contexts with subdomains</structure>
        <epics>30+</epics>
        <units>Yes - audit-ready</units>
      </ENTERPRISE>
    </project_classification>
    
      <executive_summary>What system is, architecture pattern, key domains, unique value, scale</executive_summary>
      <success_criteria>MVP Success, Growth Success (measurable)</success_criteria>
      <product_scope>MVP, Growth, Out of Scope (by module for MEDIUM+)</product_scope>
      <requirements_summary>Link to requirements.md, counts by domain/priority</requirements_summary>
      <ai_considerations optional="true">Quality targets, system boundaries</ai_considerations>
      <business_rules>Numbered list with bold rule names</business_rules>
      <glossary>Table: Term | Definition</glossary>
      <references>Links to requirements.md, architecture.md, coding-standards</references>
      <changelog>Version | Date | Author | Changes</changelog>
    </structure>

  <workflow>
    <prerequisite>Check if requirements.md exists</prerequisite>
    <if_exists>Read it, use for Requirements Summary, count FRs by domain/priority</if_exists>
    <if_not_exists>STOP - tell user to run /requirements first</if_not_exists>
  </workflow>
  
  <requirements_section>
    <format>Summary only (no detailed FR/NFR tables)</format>
    <source_of_truth>requirements.md</source_of_truth>
    <summary>Count FRs by domain, priority; Count NFRs by category</summary>
  </requirements_section>
  
  <units>
    <TOY>No units</TOY>
    <SMALL>No units</SMALL>
    <MEDIUM>Yes - modules (docs/units/module-name/)</MEDIUM>
    <LARGE>Yes - domains (docs/units/domain-name/)</LARGE>
    <ENTERPRISE>Yes - bounded contexts</ENTERPRISE>
  </units>
  
  <reference_format>
    <unit>→ Unit: `Order Management` - docs/units/order-management/</unit>
    <fr>→ FR: `FR-001`</fr>
    <adr>→ ADR: `ADR-001`</adr>
    <requirements>→ Requirements: `docs/requirements/requirements.md`</requirements>
  </reference_format>
  
  <priority>
    <P0>Must have (MVP)</P0>
    <P1>Should have (Growth)</P1>
    <P2>Nice to have (Vision)</P2>
  </priority>
</prd_writing>
```

---

## Example: MEDIUM E-commerce PRD

```yaml
id: PRD-001
version: 1.0
status: approved
```

# Product Requirements Document: E-commerce Platform

## 0. Project Classification

| Attribute | Value |
|-----------|-------|
| **Size** | medium |
| **Complexity** | moderate |
| **Team Size** | 3 developers |
| **Timeline** | 3 months |
| **Domain** | web_app |

## Executive Summary

Multi-module e-commerce platform for online retail. Clean architecture with Order, Inventory, and Payment modules.

## Requirements

> **Source of Truth:** `docs/requirements/requirements.md`

### Requirements Summary

**Functional Requirements:** 23 requirements across 3 modules
- Order Management: 12 requirements (8 P0, 4 P1)
- Inventory: 6 requirements (5 P0, 1 P1)
- Payment: 5 requirements (2 P0, 3 P1)

**Priority Breakdown:**
- P0 (MVP): 15 requirements
- P1 (Growth): 8 requirements

## Product Scope

### MVP

**Order Management Module:**
- Order CRUD with items
- Status workflow (pending → paid → shipped)
- Inventory validation

→ Unit: `docs/units/order-management/`

See `template.md` for full format.


