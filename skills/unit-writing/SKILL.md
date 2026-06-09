---
name: unit-writing
description: Write per-module/per-domain documentation — an index, a data model, API surface, and event schemas — for one architectural unit (module, domain, service, or entity). Use this whenever the user wants to document a module or domain, capture a service contract or data model, write unit docs, or mentions "unit docs", "module documentation", "domain docs", "service spec", "API contract", "event schema", or "unit index". Unit docs are the MEDIUM-and-larger artifact: one unit per folder, one concern per file — for TOY/SMALL projects, skip them and keep the design in the PRD and architecture document.
---

# Unit Writing

A unit document is the detailed contract for a single architectural unit — what it owns, the data it stores, the API it exposes, and the events it emits or consumes. Where the architecture document describes the system as a whole, unit docs zoom in on one module or domain so an implementer can build it without guessing.

The core discipline is **one concern per file, one unit per folder**. The reason is mechanical, not aesthetic: these files are read back by agents and retrieval tools, so a focused file under ~400 lines retrieves cleanly while a sprawling everything-file buries the answer. When a file outgrows its concern, split it — never stretch it.

## When to write unit docs at all

Unit docs are a MEDIUM-and-larger artifact. The project classification in the PRD decides this:

| Size | Unit docs? |
|------|------------|
| TOY, SMALL | No — keep the design in the PRD and architecture document |
| MEDIUM | Yes — one unit per module |
| LARGE | Yes — full unit coverage per domain |
| ENTERPRISE | Yes — audit-ready, every unit documented |

If someone asks for unit docs on a TOY or SMALL project, say so and point them at the architecture document instead — separate unit files there add navigation cost without adding clarity.

## Pick the unit type first

Everything downstream depends on naming the unit type correctly, because the type sets which files are required and where the folder lives. Choose the smallest type that fits — don't promote an entity to a module because it feels important.

| Type | Use for | Examples |
|------|---------|----------|
| **Module** | A bounded context, the largest scope | catalog, auth, billing |
| **Domain** | A business-concept grouping | Order, Payment, Identity |
| **Service** | A stateless unit with a clear API | a notification service |
| **Entity** | A core data object | User, Product, Invoice |
| **Feature** | A cross-cutting capability | search, import |

Types nest: a module can contain services and domains; a service can contain domains and entities; a domain can contain entities; an entity is a leaf. Let the real structure decide the nesting — don't invent a module wrapper for a single domain.

Do **not** create a unit for value objects, DTOs, or internal implementation details. They are not contracts anyone integrates against, so a separate file for them is pure overhead — describe them inline in the parent unit instead.

## Folder layout

Units live under `{DOCS_ROOT}/architecture/`. `{DOCS_ROOT}` defaults to `docs/` at the project root; honor the project's configured docs location if one is set.

```
{DOCS_ROOT}/architecture/
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

Placement by type:

- **Module** → `modules/{name}/` — requires `index.md` and `data-model.md`; add `api/`, `events/`, `services/`, `domains/` as the module needs them.
- **Service** → `services/{name}/` standalone, or `modules/{m}/services/{name}/` when module-specific — requires `index.md`; add `api/` and `data-model.md` if it has them.
- **Domain** → `domains/{name}/` (rare standalone) or `modules/{m}/domains/{name}/` — requires `index.md` and `data-model.md`; add `entities/` as needed.
- **Entity** → always inside its domain, as `entities/{entity}.md`.

Give a unit its own folder when it has its own API, events, or multiple children. Keep it a single file when it is a simple entity with no children and under ~200 lines — a folder for one short file is friction with no payoff.

Naming: folders are kebab-case and lowercase (`modules/billing/`); files are `index.md`, `data-model.md`, `{resource}.yaml` for API specs, and `{event-type}.avsc` for event schemas.

## The files and what goes in each

Each file owns one concern. Keep each within its size budget — the budget is the signal to split, not a hard cap to game.

- **`index.md`** (~150 lines) — the entry point. A single-responsibility overview paragraph, a boundaries table (Owns / Uses / Provides), an architecture diagram if the unit is non-trivial, navigation links to the other files and child units, and any key architectural decisions. Frontmatter carries `id`, `type`, `status`, `version`, `created`.
- **`data-model.md`** (~400 lines) — the persistent state: an entity-relationship diagram (ASCII or Mermaid), full table/field definitions with constraints, indexes, status lifecycles, and migration strategy.
- **API specs** (`api/{resource}.yaml`, ~300 lines each) — OpenAPI 3.1, one file per resource. Splitting by resource keeps each spec focused and lets them evolve independently.
- **`events/` index** (~200 lines) — the event flow, produced and consumed topics with partition keys, and references to the schema files.
- **Event schemas** (`events/{event-type}.avsc`, ~100 lines each) — one Avro schema per event type.

Reference other units by relative link with a short pointer, e.g. `[identity](../domains/identity/)` or `→ modules/billing`. Relative links keep the docs portable when the tree moves.

## How to write a unit

1. Confirm the project is MEDIUM or larger (check the PRD's classification). If not, stop and point at the architecture document.
2. Determine the unit type (module / service / domain / entity) and its place in the hierarchy.
3. Create the folder under `{DOCS_ROOT}/architecture/{type}/{name}/`.
4. Write `index.md` first — overview, boundaries, diagram, navigation. It frames everything else.
5. Add the supporting files the unit actually has — `data-model.md`, `api/`, `events/`. Don't create empty stubs for files the unit doesn't need.

Load `references/templates/` when you start filling files — it carries the full section structure for each file type:

- `references/templates/index.md` — unit overview and boundaries
- `references/templates/data-model.md` — database schema, relations, lifecycle
- `references/templates/events-index.md` — event flow and topic mapping
- `references/templates/entity.md` — a single entity (data model, relations, state machine, operations, errors)

Fill every `{{placeholder}}` and delete the sections a given unit genuinely doesn't have, rather than leaving them empty.

## Roles

This skill is for whoever holds the architecture role — they author unit docs from the PRD and architecture document. The implementer builds against them, and the project owner reviews; the author does not approve their own units.
