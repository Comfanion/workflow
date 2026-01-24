---
name: diagram-creation
description: Use when creating technical diagrams - C4 architecture, sequence flows, ER data models, flowcharts, state machines, or deployment infrastructure
license: MIT
compatibility: opencode
metadata:
  domain: documentation
  formats: mermaid, ascii, plantuml
  artifacts: docs/diagrams/
---

# Diagram Creation Skill

## Overview

Creates clear, informative diagrams for software architecture documentation. Produces diagrams in Mermaid format (renderable in GitHub/GitLab) or ASCII art for universal compatibility.

## Core Responsibilities

1. **C4 Diagrams** - Context, Container, Component, Code levels
2. **Sequence Diagrams** - Interaction flows
3. **ER Diagrams** - Entity relationships
4. **Flowcharts** - Process and decision flows
5. **State Diagrams** - State machines

---

## When to Use Which Diagram

### Decision Guide

| Question | Diagram Type |
|----------|--------------|
| What systems exist and how they connect? | **C4 Context** |
| What are the main building blocks (services, DBs)? | **C4 Container** |
| What's inside a service/module? | **C4 Component** |
| How do components interact over time? | **Sequence** |
| What data entities exist and relate? | **ER Diagram** |
| What are the steps in a process? | **Flowchart** |
| What states can an entity be in? | **State Diagram** |

### By Audience

| Audience | Best Diagrams |
|----------|---------------|
| **Stakeholders / Business** | C4 Context, high-level Flowchart |
| **Architects** | C4 Container, C4 Component, ER |
| **Developers** | Sequence, ER, State, C4 Component |
| **New team members** | C4 Context → Container → Component (top-down) |
| **Code reviewers** | Sequence (for specific flow) |

### By Project Phase

| Phase | Diagrams to Create |
|-------|-------------------|
| **Discovery** | C4 Context (rough), ER (draft) |
| **Architecture** | C4 Container, C4 Component, ER (detailed) |
| **Development** | Sequence (per feature), State (per entity) |
| **Documentation** | All of above, refined |
| **Troubleshooting** | Sequence (problem flow) |

### C4 Model Zoom Levels

```
Level 1: CONTEXT     — System + external actors
    ↓ zoom in
Level 2: CONTAINER   — Services, DBs, queues inside system
    ↓ zoom in  
Level 3: COMPONENT   — Classes/modules inside a container
    ↓ zoom in
Level 4: CODE        — Class diagrams (usually auto-generated)
```

**Rule:** Start at Context, zoom in only as needed. Most projects need L1-L3.

---

## Diagram Storage

All diagrams go in `docs/diagrams/` with clear naming:

```
docs/diagrams/
├── README.md                    # Diagram index
├── c4/
│   ├── system-context.md        # L1: System context
│   ├── containers.md            # L2: Containers
│   └── [module]-components.md   # L3: Module components
├── sequences/
│   ├── [flow-name].md
│   └── ...
├── data/
│   ├── erd-overview.md          # High-level ERD
│   └── [module]-erd.md          # Module-specific ERD
├── flows/
│   ├── [process-name].md
│   └── ...
└── states/
    └── [entity]-states.md
```

## Diagram Templates

### C4 Context Diagram (Mermaid)

```markdown
# System Context Diagram

## Overview
[What this diagram shows]

## Diagram

\`\`\`mermaid
C4Context
    title System Context Diagram for [System Name]
    
    Person(user, "User", "Description")
    System(system, "System Name", "Description")
    System_Ext(ext1, "External System", "Description")
    
    Rel(user, system, "Uses")
    Rel(system, ext1, "Integrates with")
\`\`\`

## Elements

| Element | Type | Description |
|---------|------|-------------|
| User | Person | ... |

## Relationships

| From | To | Description |
|------|-----|-------------|
```

### C4 Container Diagram

```markdown
# Container Diagram

\`\`\`mermaid
C4Container
    title Container Diagram for [System Name]
    
    Person(user, "User")
    
    Container_Boundary(system, "System Name") {
        Container(api, "API Gateway", "Go", "Routes requests")
        Container(svc1, "Service 1", "Go", "Handles X")
        ContainerDb(db, "Database", "PostgreSQL", "Stores data")
        ContainerQueue(queue, "Message Queue", "Kafka", "Events")
    }
    
    Rel(user, api, "HTTPS")
    Rel(api, svc1, "gRPC")
    Rel(svc1, db, "SQL")
    Rel(svc1, queue, "Publishes")
\`\`\`
```

### C4 Component Diagram

```markdown
# [Service Name] Component Diagram

## Overview
Internal structure of [Service Name] container.

## Diagram

\`\`\`mermaid
C4Component
    title Component Diagram for [Service Name]
    
    Container_Boundary(svc, "[Service Name]") {
        Component(ctrl, "API Controller", "Go", "HTTP handlers")
        Component(usecase, "Use Cases", "Go", "Business logic orchestration")
        Component(domain, "Domain", "Go", "Core business rules")
        Component(repo, "Repository", "Go", "Data access")
    }
    
    ContainerDb(db, "Database", "PostgreSQL")
    Container(queue, "Message Queue", "Kafka")
    
    Rel(ctrl, usecase, "Calls")
    Rel(usecase, domain, "Uses")
    Rel(usecase, repo, "Persists via")
    Rel(repo, db, "SQL")
    Rel(usecase, queue, "Publishes events")
\`\`\`

## Components

| Component | Responsibility | Dependencies |
|-----------|---------------|--------------|
| API Controller | HTTP routing, validation | Use Cases |
| Use Cases | Orchestration, transactions | Domain, Repository |
| Domain | Business rules, entities | None (pure) |
| Repository | Data persistence | Database |

## Patterns Used

- Hexagonal Architecture (Ports & Adapters)
- Dependency injection
- Repository pattern
```

### C4 with ASCII (Alternative)

When Mermaid C4 not supported, use ASCII:

```markdown
# System Context (ASCII)

\`\`\`
                         ┌─────────────┐
                         │   Admin     │
                         │   (Person)  │
                         └──────┬──────┘
                                │ manages
                                ▼
┌─────────────┐          ┌─────────────┐          ┌─────────────┐
│  Customer   │─────────►│   System    │─────────►│  Payment    │
│  (Person)   │  uses    │             │  calls   │  Gateway    │
└─────────────┘          └─────────────┘          │  (External) │
                                │                  └─────────────┘
                                │ sends
                                ▼
                         ┌─────────────┐
                         │   Email     │
                         │  (External) │
                         └─────────────┘
\`\`\`

Legend:
- Box = System/Person
- Arrow = Relationship
- (External) = Outside our control
```

### Sequence Diagram

```markdown
# [Flow Name] Sequence

## Context
[When this flow occurs]

## Diagram

\`\`\`mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant A as API
    participant S as Service
    participant D as Database
    
    U->>A: Request
    A->>S: Process
    S->>D: Query
    D-->>S: Result
    S-->>A: Response
    A-->>U: Result
    
    Note over S,D: Transaction boundary
\`\`\`

## Steps

1. **Request**: User sends...
2. **Process**: Service validates...

## Error Scenarios

[What happens on failure]
```

### ER Diagram

```markdown
# [Domain] Entity Relationship Diagram

\`\`\`mermaid
erDiagram
    MERCHANT ||--o{ PRODUCT : owns
    PRODUCT ||--|{ OFFER : has
    PRODUCT }o--|| CATEGORY : belongs_to
    
    MERCHANT {
        uuid id PK
        string name
        string status
        timestamp created_at
    }
    
    PRODUCT {
        uuid id PK
        uuid merchant_id FK
        string sku
        string name
    }
    
    OFFER {
        uuid id PK
        uuid product_id FK
        decimal price
        int quantity
    }
\`\`\`

## Entities

### MERCHANT
[Description and business rules]

### PRODUCT
[Description and business rules]
```

### Flowchart

```markdown
# [Process Name] Flow

\`\`\`mermaid
flowchart TD
    A[Start] --> B{Condition?}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E
    
    style A fill:#f9f
    style E fill:#9f9
\`\`\`

## Decision Points

| Point | Condition | Yes Path | No Path |
|-------|-----------|----------|---------|
```

### State Diagram

```markdown
# [Entity] State Machine

\`\`\`mermaid
stateDiagram-v2
    [*] --> Draft
    Draft --> Pending: submit()
    Pending --> Approved: approve()
    Pending --> Rejected: reject()
    Approved --> Active: activate()
    Active --> Suspended: suspend()
    Suspended --> Active: resume()
    Rejected --> [*]
    Active --> [*]: close()
\`\`\`

## States

| State | Description | Allowed Transitions |
|-------|-------------|---------------------|
| Draft | Initial state | submit |
```

## Diagram Index (README.md)

```markdown
# Diagrams Index

## Architecture Diagrams

| Diagram | Level | Description |
|---------|-------|-------------|
| [System Context](./c4/system-context.md) | C4-L1 | High-level system view |
| [Containers](./c4/containers.md) | C4-L2 | Service boundaries |

## Sequence Diagrams

| Flow | Description |
|------|-------------|
| [User Registration](./sequences/user-registration.md) | ... |

## Data Diagrams

| Diagram | Scope |
|---------|-------|
| [Overview ERD](./data/erd-overview.md) | All domains |

## Process Flows

| Process | Description |
|---------|-------------|
```

## Best Practices

1. **One concept per diagram** - Don't overcrowd
2. **Consistent naming** - Same names across diagrams
3. **Include legend** - Explain symbols/colors
4. **Version with docs** - Update diagrams when architecture changes
5. **Cross-reference** - Link diagrams to relevant docs

---

## Complete Examples

### Example 1: E-commerce System (C4 Context → Container)

**Context Diagram:**

```mermaid
C4Context
    title E-commerce System Context
    
    Person(customer, "Customer", "Browses and buys products")
    Person(admin, "Admin", "Manages catalog and orders")
    
    System(ecommerce, "E-commerce Platform", "Allows customers to browse and purchase products")
    
    System_Ext(payment, "Payment Provider", "Stripe/PayPal")
    System_Ext(shipping, "Shipping Service", "Calculates rates, tracks packages")
    System_Ext(email, "Email Service", "SendGrid")
    
    Rel(customer, ecommerce, "Browses, purchases")
    Rel(admin, ecommerce, "Manages")
    Rel(ecommerce, payment, "Processes payments")
    Rel(ecommerce, shipping, "Gets rates, creates labels")
    Rel(ecommerce, email, "Sends notifications")
```

**Container Diagram:**

```mermaid
C4Container
    title E-commerce Containers
    
    Person(customer, "Customer")
    
    Container_Boundary(system, "E-commerce Platform") {
        Container(web, "Web App", "React", "Product browsing, checkout")
        Container(api, "API", "Node.js", "REST API")
        Container(catalog, "Catalog Service", "Go", "Products, categories")
        Container(orders, "Orders Service", "Go", "Order processing")
        Container(search, "Search", "Elasticsearch", "Product search")
        ContainerDb(db, "Database", "PostgreSQL", "Products, orders, users")
        ContainerQueue(queue, "Events", "Kafka", "Order events")
        Container(cache, "Cache", "Redis", "Sessions, product cache")
    }
    
    Rel(customer, web, "HTTPS")
    Rel(web, api, "REST")
    Rel(api, catalog, "gRPC")
    Rel(api, orders, "gRPC")
    Rel(api, cache, "Gets/sets")
    Rel(catalog, db, "SQL")
    Rel(catalog, search, "Syncs")
    Rel(orders, db, "SQL")
    Rel(orders, queue, "Publishes")
```

### Example 2: Order Processing (Sequence)

```mermaid
sequenceDiagram
    autonumber
    
    participant C as Customer
    participant API as API Gateway
    participant O as Order Service
    participant I as Inventory
    participant P as Payment
    participant N as Notifications
    participant DB as Database
    
    C->>API: POST /orders
    API->>O: CreateOrder(items)
    
    O->>I: ReserveItems(items)
    alt Items available
        I-->>O: Reserved
        O->>DB: SaveOrder(pending)
        
        O->>P: ChargePayment(amount)
        alt Payment success
            P-->>O: PaymentConfirmed
            O->>DB: UpdateOrder(confirmed)
            O->>I: CommitReservation
            O->>N: SendConfirmation
            O-->>API: OrderConfirmed
            API-->>C: 201 Created
        else Payment failed
            P-->>O: PaymentFailed
            O->>I: ReleaseReservation
            O->>DB: UpdateOrder(failed)
            O-->>API: PaymentError
            API-->>C: 402 Payment Required
        end
    else Items unavailable
        I-->>O: OutOfStock
        O-->>API: StockError
        API-->>C: 409 Conflict
    end
```

### Example 3: Task Entity (State Diagram)

```mermaid
stateDiagram-v2
    [*] --> Draft: create()
    
    Draft --> Open: publish()
    Draft --> [*]: delete()
    
    Open --> InProgress: start()
    Open --> Blocked: block()
    Open --> Cancelled: cancel()
    
    InProgress --> Open: pause()
    InProgress --> Blocked: block()
    InProgress --> Review: submitForReview()
    
    Blocked --> Open: unblock()
    Blocked --> Cancelled: cancel()
    
    Review --> InProgress: requestChanges()
    Review --> Done: approve()
    
    Done --> [*]
    Cancelled --> [*]
    
    note right of Blocked: Waiting for external input
    note right of Review: Requires approval
```

**State Transition Table:**

| From | To | Trigger | Conditions |
|------|-----|---------|------------|
| Draft | Open | publish() | Has title, assignee |
| Open | InProgress | start() | Assignee available |
| InProgress | Review | submitForReview() | All subtasks done |
| Review | Done | approve() | Reviewer approved |
| Review | InProgress | requestChanges() | Changes requested |
| Any | Blocked | block() | External dependency |
| Blocked | Previous | unblock() | Dependency resolved |

### Example 4: User Domain (ER Diagram)

```mermaid
erDiagram
    TENANT ||--o{ USER : has
    USER ||--o{ USER_ROLE : has
    ROLE ||--o{ USER_ROLE : assigned_to
    ROLE ||--o{ ROLE_PERMISSION : has
    PERMISSION ||--o{ ROLE_PERMISSION : granted_to
    USER ||--o{ SESSION : has
    USER ||--o{ AUDIT_LOG : generates
    
    TENANT {
        uuid id PK
        string name
        string slug UK
        string plan
        timestamp created_at
    }
    
    USER {
        uuid id PK
        uuid tenant_id FK
        string email UK
        string password_hash
        string name
        boolean is_active
        timestamp last_login_at
        timestamp created_at
    }
    
    ROLE {
        uuid id PK
        uuid tenant_id FK
        string name
        string description
        boolean is_system
    }
    
    USER_ROLE {
        uuid user_id FK
        uuid role_id FK
    }
    
    PERMISSION {
        uuid id PK
        string code UK
        string description
    }
    
    ROLE_PERMISSION {
        uuid role_id FK
        uuid permission_id FK
    }
    
    SESSION {
        uuid id PK
        uuid user_id FK
        string token_hash
        string ip_address
        timestamp expires_at
        timestamp created_at
    }
    
    AUDIT_LOG {
        uuid id PK
        uuid user_id FK
        string action
        string resource_type
        uuid resource_id
        jsonb changes
        timestamp created_at
    }
```

---

## Common Mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| Too much detail in Context | Overwhelming, loses purpose | Only external systems and actors |
| Mixing abstraction levels | Confusing, inconsistent | Stick to one C4 level per diagram |
| No legend | Reader guesses meaning | Always include legend for colors/shapes |
| Outdated diagrams | Misleading | Update with code changes, review in PRs |
| Sequence too long | Unreadable | Split into multiple diagrams by scenario |
| ER with all fields | Cluttered | Show only key fields, document rest separately |

---

## Related Skills

- `architecture-design` - Creates diagrams during design
- `unit-writing` - Links diagrams from unit docs
- `adr-writing` - ADRs may include decision diagrams
