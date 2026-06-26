---
type: design-system                           # controlled vocab — primary filter for agents
title: Design System — {{product}}
description: {{one line — the visual language and component contract}}
domain: {{product/design domain}}             # dedup axis: one design-system per product
status: draft                                 # draft | approved | deprecated | superseded
tags: [design-system, ui]                     # free-form filter labels
updated: {{YYYY-MM-DDThh:mmZ}}                 # OKF timestamp — last meaningful change
related: []                                    # cross-links; e.g. ux design docs
---

# Design System — `{{product}}`

> Write to `{DOCS_ROOT}/design/design-system.md` (tokens here, or in a referenced tokens file if kept separate). Fill every `{{placeholder}}`. Remove a section only if it genuinely doesn't apply.

## Visual language

- **Voice:** {{density, shape language (sharp/rounded), typographic tone, use of color & elevation}}
- **Principles:** {{the 2–4 rules a new component is judged against}}

## Naming convention

- **Scheme:** {{e.g. `category-property-variant` → `color-text-primary`, `space-inline-md`}}
- Applied to every token and component, no exceptions.

## Tokens

### Color — primitives
| Token | Value |
|-------|-------|
| `color-{{hue}}-{{step}}` | `{{#hex}}` |

### Color — semantic (per theme)
| Semantic token | Light | Dark | {{brand?}} |
|----------------|-------|------|-----------|
| `color-surface` | `{{}}` | `{{}}` | |
| `color-text-primary` | `{{}}` | `{{}}` | |
| `color-border` | `{{}}` | `{{}}` | |
| `color-brand` | `{{}}` | `{{}}` | |
| `color-danger` / `-success` / `-warning` / `-info` | `{{}}` | `{{}}` | |

### Typography
- Families: {{...}} · Weights: {{...}}
| Role | Size / line-height | Weight |
|------|--------------------|--------|
| `text-heading-1` | `{{}}` | `{{}}` |
| `text-body` / `-caption` / `-code` | `{{}}` | `{{}}` |

### Spacing — scale (base {{4px}})
| Token | Value |
|-------|-------|
| `space-1` … `space-n` | `{{}}` |

### Radii
| Token | Value |
|-------|-------|
| `radius-sm` / `-md` / `-lg` / `-full` | `{{}}` |

### Shadows / elevation
| Token | Meaning | Value |
|-------|---------|-------|
| `shadow-raised` / `-overlay` / `-modal` | {{}} | `{{}}` |

## Component library

For each component:

### Component: `{{name}}`
- **Purpose / when not to use:** {{...}}
- **Variants:** {{closed set, e.g. primary / secondary / ghost / danger}}
- **States:** {{default, hover, focus (mandatory if interactive), active, disabled, loading, error, selected — those that apply}}
- **Tokens used:** {{semantic tokens for color/spacing/radius/type — no literals}}
- **Composition:** {{what it contains / nests into, spacing rules}}

## Theming

- **Themes:** {{light, dark, brand themes}}
- **Mechanism:** semantic tokens remap per theme; components reference only semantics.
- **Switching:** {{how selected/persisted}}
- **Validation:** every component checked in every theme.

## Consistency rules

- [ ] Tokens over literals — no raw hex/px in components.
- [ ] Closed variant sets — no arbitrary one-offs.
- [ ] WCAG AA contrast met in every theme; focus states always visible; target sizes met.
- [ ] One naming scheme throughout.
- [ ] New needs become reviewed system additions, not local overrides.
