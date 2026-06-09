---
name: design-system
description: Define and document the reusable visual system of a product — design tokens (color, typography, spacing, radii, shadows), the component library with its variants and states, the visual language and naming conventions, theming and dark-mode, and the consistency rules everything else builds on. Use this whenever the user wants to set up or evolve a design system, define design tokens, build or document a component library, establish a visual language or style guide, or add theming, or mentions "design system", "design tokens", "component library", "visual language", "theming", or "style guide". This defines the reusable VISUAL SYSTEM shared across the product — not the per-feature flows and screens (that's ux-design).
---

# Design System

This skill answers one question: **what is the single, reusable visual vocabulary the whole product is built from** — the tokens, components, and rules every feature composes from instead of reinventing. It is the foundation `ux-design` draws on; get it right and every feature inherits consistency for free, get it wrong and every screen drifts.

The boundary that keeps this skill clean: it defines the *system*, not any one *feature's experience*. Flows, screens, and per-feature states live in `ux-design`, which composes from what you define here. The most common failure is the system that's really a pile of one-off styles — colors and components added per screen with no tokens and no naming discipline. That pile cannot be themed, cannot be kept consistent, and rots into "every page looks slightly different." This skill exists to prevent that by making tokens and naming the foundation, not an afterthought.

## Prerequisite: brand and product context

A visual system encodes a brand and product context, so before defining tokens, gather whatever brand direction, existing styles, or product constraints exist (read the PRD if there is one, default `{DOCS_ROOT}/prds/<feature-slug>/PRD.md`). If a system already exists, read it and evolve it — don't fork a parallel one, because two design systems is worse than one imperfect one.

`{DOCS_ROOT}` defaults to `docs/` at the project root; honor the project's configured docs location if set.

## Design tokens: the single source of truth

Tokens are named values — never raw literals scattered in components. They are the foundation because a token changed in one place updates the whole product, while a hex code copied into fifty components updates nothing. Define them as a layer:

- **Primitive tokens** — the raw palette/scale (`color-blue-500`, `space-4`). The values, named but not yet meaningful.
- **Semantic tokens** — primitives mapped to intent (`color-surface`, `color-text-primary`, `color-danger`, `space-inline-sm`). Components reference *these*, never primitives — so re-theming is remapping semantics, not editing components.

Cover the full set, because a gap here forces a one-off literal later:

- **Color** — palette, plus semantic roles (surface, text, border, brand, success/warning/danger/info). Define for every theme (see theming).
- **Typography** — font families, a type scale (sizes + line-heights), weights, and the semantic roles (heading levels, body, caption, code).
- **Spacing** — one consistent scale (e.g. 4px base). Everything — padding, gaps, margins — snaps to it; arbitrary values are what make layouts feel inconsistent.
- **Radii** — the corner-radius scale.
- **Shadows / elevation** — the elevation scale, mapped to meaning (raised, overlay, modal) rather than ad hoc blur values.

## Component library: inventory, variants, states

The component library is the set of reusable building blocks, each documented with its full surface — because an undocumented variant or state is one an implementer will invent inconsistently. For each component capture:

- **Purpose** — what it's for and, briefly, when *not* to use it (prevents misuse).
- **Variants** — the deliberate options (e.g. button: primary / secondary / ghost / danger). Variants are a closed set; "any color you like" is not a variant, it's drift.
- **States** — every interaction and data state the component can be in: default, hover, focus, active, disabled, loading, error, selected — whichever apply. Focus state is mandatory for anything interactive (accessibility depends on it).
- **Anatomy & tokens used** — which semantic tokens drive its color, spacing, radius, type. This is the link that keeps components on-system.
- **Composition rules** — what it can contain / what it nests into, and any spacing rules between instances.

Components must be built from semantic tokens, not literals — that is the rule that makes the whole library themeable and consistent at once.

## Visual language and naming conventions

The visual language is the through-line that makes separate components feel like one product: the density, the shape language (sharp vs rounded), the typographic voice, the use of color and elevation. State it explicitly so new components can be judged against it rather than guessed.

Naming conventions are not cosmetic — they are how the system stays navigable and how tooling resolves tokens. Pick one scheme and apply it everywhere: a consistent, predictable token/component naming pattern (e.g. `category-property-variant`, `color-text-primary`, `space-inline-md`). Inconsistent names are the quiet way a system becomes unsearchable and un-themeable. Write the convention down and hold every new addition to it.

## Theming and dark-mode

Theming is why the semantic-token layer exists: a theme is a remap of semantic tokens to different primitive values, and components — referencing only semantics — adapt with zero changes. Specify:

- **The themes** — at minimum light and dark, plus any brand themes.
- **Per-theme semantic values** — every semantic color token resolved for each theme. Dark mode is not "invert the colors"; surfaces, contrast, and elevation each need deliberate dark values that still meet contrast (see consistency rules).
- **Switching** — how a theme is selected/persisted, and that all components are validated in every theme (a component only checked in light mode will break in dark).

If only one theme exists today, still structure tokens through the semantic layer — retrofitting theming onto literal-based components is a rewrite.

## Consistency rules

These are the non-negotiables that keep the system a system rather than a gallery:

- **Tokens over literals** — no raw hex/px in components; everything references a token. A literal is a bug.
- **Closed variant sets** — components expose defined variants only; no arbitrary one-offs.
- **Accessible by construction** — color pairings meet WCAG AA contrast in every theme, focus states are always present and visible, and interactive targets meet minimum size. Bake it into the tokens/components so features inherit it.
- **One naming scheme** — applied to every token and component, no exceptions.
- **Additions go through the system** — a new need becomes a new token/variant/component in the system, reviewed for fit, not a local override. The local override is how drift starts.

## How to write it

1. Gather brand/product context; read the existing system if there is one and evolve it.
2. Load `references/design-system-template.md` when you start — it carries the token tables, the component documentation structure, and the theming and consistency sections.
3. Define tokens first (primitive → semantic), then build components on those tokens, then state the visual language, naming, theming, and consistency rules.
4. Write the system to `{DOCS_ROOT}/design/design-system.md`, with the tokens defined there (or in a referenced tokens file if the project keeps them separate).
5. Self-check before done: every component uses semantic tokens (no literals), every interactive component documents its focus state, every semantic color is resolved per theme and meets contrast, and one naming scheme is applied throughout.

**Load `references/design-system-template.md` when you start building or evolving the system.**

## Roles

Written for whoever holds the designer role (on a team, the design-system owner / design lead; solo, you). The system is the shared foundation, so changes to it are reviewed at the product level rather than per feature. Downstream, the `ux-design` role composes features from this system and feeds back new components the system should absorb; the frontend implementer builds the system's components as reusable code. The author defines the reusable visual system, not any individual feature's flows or screens.
