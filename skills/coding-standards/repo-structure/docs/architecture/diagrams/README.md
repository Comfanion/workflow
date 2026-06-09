# Architecture Diagrams

## Purpose

Visual diagrams for system architecture.

## Diagram Types

| Type | Tool | Description |
|------|------|-------------|
| C4 Context | Mermaid/PlantUML | System context |
| C4 Container | Mermaid/PlantUML | Containers/services |
| C4 Component | Mermaid/PlantUML | Components |
| Sequence | Mermaid | Interactions |
| ER | Mermaid | Data model |
| Flowchart | Mermaid | Processes |

## Mermaid Examples

### C4 Context

```mermaid
C4Context
    title System Context
    
    Person(user, "User", "End user")
    System(system, "System", "Our system")
    System_Ext(ext, "External", "External system")
    
    Rel(user, system, "Uses")
    Rel(system, ext, "Calls")
```

### Sequence

```mermaid
sequenceDiagram
    participant U as User
    participant A as API
    participant S as Service
    participant D as Database
    
    U->>A: Request
    A->>S: Process
    S->>D: Query
    D-->>S: Result
    S-->>A: Response
    A-->>U: Response
```

## Files

| File | Description |
|------|-------------|
| - | No diagrams yet |

## Creating Diagrams

Use `/diagram` or include in architecture document.
