---
name: unit-writing
description: Document architectural units (modules, domains, services, entities) with index.md, data-model.md, API specifications, and event schemas. Use when documenting modules, creating unit docs, defining service contracts, or when user mentions "module documentation", "domain docs", "service spec", "API contract", "event schema", or "unit index".
license: MIT
compatibility: opencode
metadata:
  domain: software-architecture
  artifacts: docs/units/*/
---

# Unit Writing Skill

```xml
<unit_writing>
  <definition>Document modules, domains, services, entities with folder-based structure</definition>
  
  <principles>
    <focus>One concern per file</focus>
    <size>Under 500 lines (RAG-friendly)</size>
    <flexibility>Agent decides type, no rigid rules</flexibility>
  </principles>
  
  <types>
    <module use="Bounded context, largest scope" example="catalog, auth, billing"/>
    <domain use="Business concept grouping" example="Order, Payment, Identity"/>
    <service use="Stateless with clear API" example="NotificationService"/>
    <entity use="Core data object" example="User, Product, Invoice"/>
    <feature use="Cross-cutting capability" example="Search, Import"/>
  </types>
  
  <hierarchy>
    <module>Can contain: services, domains</module>
    <service>Can contain: domains, entities</service>
    <domain>Can contain: entities</domain>
    <entity>Leaf node</entity>
  </hierarchy>
  
  <depth>
    <module location="modules/{name}/" required="index, data-model" optional="api/, events/, services/, domains/"/>
    <service location="services/{name}/" required="index" optional="api/, data-model"/>
    <domain location="domains/{name}/" required="index, data-model" optional="entities/"/>
    <entity location="inside domain" required="{entity}.md"/>
  </depth>
  
  <when_separate_folder>Has own API, events, or multiple children</when_separate_folder>
  <when_single_file>Simple entity, no children, &lt;200 lines</when_single_file>
  
  <dont_create_for>Value objects, DTOs, internal implementation details</dont_create_for>
  
  <folder_structure>
    <root>docs/architecture/</root>
    <modules>modules/{name}/ - Bounded contexts</modules>
    <services_standalone>services/{name}/ - Independent services</services_standalone>
    <services_inside>modules/{m}/services/{name}/ - Module-specific</services_inside>
    <domains_standalone>domains/{name}/ - Rare</domains_standalone>
    <domains_inside>modules/{m}/domains/{name}/ - Inside module</domains_inside>
    <entities>Always inside domain</entities>
  </folder_structure>
  
  <files>
    <index max_lines="150">Overview, boundaries, navigation, decisions</index>
    <data_model max_lines="400">DB schema, relations, constraints, migrations</data_model>
    <api max_lines="300">OpenAPI specs per resource</api>
    <events_index max_lines="200">Event flow, topic mapping</events_index>
    <event_schema max_lines="100">Individual event schemas (.avsc)</event_schema>
  </files>
  
  <index_md>
    <frontmatter>id, type, status, version, created</frontmatter>
    <overview>Single responsibility paragraph</overview>
    <boundaries>Table: Owns | Uses | Provides</boundaries>
    <diagram>Architecture diagram (if complex)</diagram>
    <navigation>Links to other files</navigation>
    <decisions>Key ADRs</decisions>
  </index_md>
  
  <data_model_md>
    <erd>Entity Relationship Diagram (ASCII/Mermaid)</erd>
    <tables>Full SQL or field tables</tables>
    <indexes>Constraints and indexes</indexes>
    <migrations>Migration strategy</migrations>
  </data_model_md>
  
  <events>
    <index>Event flow, topic mapping, schema references</index>
    <schemas>Individual .avsc files per event type</schemas>
  </events>
  
  <api>
    <format>OpenAPI 3.1</format>
    <organization>One file per resource</organization>
  </api>
  
  <naming>
    <folders>kebab-case, lowercase (modules/billing/)</folders>
    <files>index.md, data-model.md, {resource}.yaml, {event-type}.avsc</files>
  </naming>
  
  <reference_format>
    <relative>[identity](../domains/identity/)</relative>
    <shorthand>→ modules/billing</shorthand>
  </reference_format>
  
  <workflow>
    <step1>Determine type (module/service/domain/entity)</step1>
    <step2>Create folder: docs/architecture/{type}/{name}</step2>
    <step3>Start with index.md (overview, boundaries, diagram)</step3>
    <step4>Add supporting files (data-model, api, events)</step4>
  </workflow>
</unit_writing>
```

---

## Example: Billing Module

```
docs/architecture/
└── modules/
    └── billing/
        ├── index.md
        ├── data-model.md
        ├── api/
        │   └── subscriptions.yaml
        ├── services/
        │   └── payment-gateway/
        │       ├── index.md
        │       └── api/
        └── domains/
            └── subscription/
                ├── index.md
                └── entities/
                    └── plan.md
```

See `templates/` for full format.
