---
name: diagram-creation
description: Use when the user asks to create, update, or regenerate a technical diagram that documents software. Trigger phrases: "create a diagram", "draw the architecture", "draw a diagram", "map out the system", "visualize the flow", "show how the services connect", "regenerate the ERD", "update the diagram", or any mention of "C4 diagram", "context diagram", "container diagram", "component diagram", "sequence diagram", "ER diagram", "ERD", "data model diagram", "flowchart", "state diagram", "state machine", "class diagram", "deployment diagram", or a request to render something in "Mermaid", "PlantUML", "D2", or "ASCII". Produces diagram artifacts only — in Mermaid by default, ASCII when the renderer cannot show Mermaid. Do NOT use this skill for the upstream architecture or design decisions the diagram illustrates (that is design work), for prose explanations of how code works, or for debugging/analysis of the system. If the user only wants to understand a flow or data model in words without a visual artifact, answer directly instead.
---

# Diagram Creation

A good diagram answers one question for one audience. The most common failure is the opposite: a single picture trying to show every system, every service, and every field at once — which ends up communicating nothing. This skill picks the right diagram type for the question being asked, keeps each diagram at a single level of abstraction, and stores the output where it stays discoverable and reviewable.

Diagrams are written in Mermaid (renders inline on GitHub/GitLab) by default. Fall back to ASCII only when the target renderer cannot show Mermaid — ASCII survives anywhere but is harder to maintain.

## Pick the diagram that fits the question

Start from what the reader needs to understand, not from a diagram type you already like. Choosing wrong is why diagrams get ignored — a stakeholder handed a sequence diagram learns nothing, and a developer handed a context diagram learns too little.

| The question | Diagram type |
|--------------|--------------|
| What systems exist and how do they connect? | C4 Context |
| What are the main building blocks (services, DBs, queues)? | C4 Container |
| What's inside one service or module? | C4 Component |
| How do components interact over time, step by step? | Sequence |
| What data entities exist and how do they relate? | ER diagram |
| What are the steps and branches in a process? | Flowchart |
| What states can an entity move through? | State diagram |

Match the diagram to the audience too. Business and stakeholder readers want C4 Context and high-level flowcharts; architects want Container, Component, and ER; developers want Sequence, State, and Component; a new joiner is best onboarded top-down (Context → Container → Component); a reviewer chasing one bug wants the Sequence for that single flow.

## C4: zoom in only as far as the reader needs

The C4 model is four nested zoom levels. The discipline that makes it work is staying at exactly one level per diagram — mixing a system box with the classes inside it is the fastest way to make a diagram unreadable.

```
Level 1: CONTEXT     — the system + external actors and systems
    ↓ zoom in
Level 2: CONTAINER   — services, DBs, queues inside the system
    ↓ zoom in
Level 3: COMPONENT   — modules/classes inside one container
    ↓ zoom in
Level 4: CODE        — class diagrams (usually auto-generated, rarely hand-drawn)
```

Always start at Context and zoom in only as far as the reader needs. Most projects never need Level 4 — Levels 1 through 3 carry almost all the value.

## Where diagrams live

Store every diagram under `{DOCS_ROOT}/diagrams/`, grouped by type, with an index so people can find them. A diagram nobody can locate is a diagram nobody trusts. `{DOCS_ROOT}` defaults to `docs/` at the project root; honor the project's configured docs location if one is set.

```
{DOCS_ROOT}/diagrams/
├── README.md                    # index of all diagrams
├── c4/
│   ├── system-context.md        # L1
│   ├── containers.md            # L2
│   └── <module>-components.md   # L3
├── sequences/
│   └── <flow-name>.md
├── data/
│   ├── erd-overview.md
│   └── <module>-erd.md
├── flows/
│   └── <process-name>.md
└── states/
    └── <entity>-states.md
```

Each diagram file follows the same shape: a one-line statement of what it shows, the diagram itself, and a short table explaining the elements and relationships. The reusable per-file structure for every diagram type lives in `references/template.md` — load it when you are about to write a diagram file so the format stays consistent across the project.

## How to create a diagram

1. Identify the question and the audience, then pick the type from the table above.
2. Open `references/template.md` and copy the block for that diagram type.
3. Gather the real elements — read the code, the requirements, or the architecture docs rather than inventing names. Use the project's search and code-navigation capabilities to find the actual services, entities, and flows.
4. Fill the Mermaid (or ASCII) body and the accompanying element/relationship table.
5. Keep it to one concept at one abstraction level. If the diagram is getting crowded, split it rather than shrinking the font.
6. Save it to the matching subfolder and add a row to `{DOCS_ROOT}/diagrams/README.md`.

## Quality bar

A diagram is done when it survives these checks — they map directly to the mistakes that make diagrams misleading:

- **One concept, one level** — a Context diagram shows only external actors and systems; a Component diagram never wanders up to whole services. Mixing levels confuses every reader.
- **Real names, consistent across diagrams** — the same service is called the same thing in Context, Container, and Sequence. Drift makes two diagrams look like two systems.
- **A legend where symbols aren't obvious** — colors, shapes, and `(External)` markers are explained, so the reader isn't guessing.
- **Sequences stay readable** — one scenario per diagram; split a long flow by alt/else path rather than letting it run off the screen.
- **ER diagrams show key fields only** — primary/foreign keys and the columns that carry meaning, not every nullable timestamp; document the rest in prose.
- **It matches reality and stays that way** — the diagram reflects the current code, and it gets updated in the same PR that changes the architecture. An outdated diagram is worse than none.

## Roles

This skill is for whoever documents a system — typically the architecture or development role. The diagrams it produces illustrate decisions made elsewhere; they are reviewed alongside the code or design docs they accompany, not approved on their own.
