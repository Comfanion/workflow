---
name: ux-design
description: Design and document the experience of a feature — map the user flows, lay out the screens and component inventory, define the interaction patterns, specify every UI state (empty, loading, error, success), cover accessibility (WCAG basics) and responsive behavior, and write a handoff spec a frontend implementer can build from directly. Use this whenever the user wants to design the UX of a feature, map a user flow, produce wireframes or screen designs, define interaction design, or prepare a design handoff, or mentions "design the UX", "user flow", "wireframe", "screen design", "interaction design", or "design handoff". This defines the EXPERIENCE — not the reusable visual system (that's design-system) and not the implementation code.
---

# UX Design

This skill answers one question at one altitude: **what does the user actually do, see, and experience to accomplish this feature** — flow by flow, screen by screen, state by state. The output is precise enough that a frontend implementer can build it without guessing.

Two boundaries keep this skill sharp. First, it defines the *experience*, not the *visual system*: tokens, the component library, theming, and naming conventions live in `design-system` — here you compose from that system, you don't define it. Second, it stops at the spec: it describes what to build, not how to build it in code. The most common failure is designing only the happy path — a flow that looks done but has no empty state, no error state, no loading state. That gap is exactly where implementation stalls and re-asks, so this skill treats all states as mandatory, not optional.

## Prerequisite: know what the feature must do

The experience serves requirements, so confirm there's a PRD or feature definition to design against (default `{DOCS_ROOT}/prds/<feature-slug>/PRD.md`) and read it. If the visual system already exists, read it too (`{DOCS_ROOT}/design/design-system.md`) — its components and tokens are what you compose from, and inventing parallel ones fragments the product. If neither exists for anything beyond a trivial screen, flag it: designing UX against unknown requirements is guesswork.

`{DOCS_ROOT}` defaults to `docs/` at the project root; honor the project's configured docs location if set.

## User flows: the path, the decisions, the dead ends

A flow is the ordered path a user takes to reach a goal, including where it branches and where it can fail. Map it before drawing any screen, because the screens fall out of the flow — not the other way around. For each flow capture:

- **Entry point** — where the user comes from and what they already know.
- **Steps** — each action and the system's response, in order.
- **Decision points** — branches (authenticated vs not, has data vs empty, valid vs invalid input).
- **Exits** — success (goal reached) and every failure/abandon path. A flow with only a success exit is incomplete.

Draw flows as simple step/decision diagrams. The value is in surfacing the branches you'd otherwise forget — every branch is a screen or state you'll have to design.

## Screens and component inventory

For each screen the flows touch, list **what is on it**: the components, the content, and the data each component needs. This inventory is what connects the experience to the system and to the backend:

- Name each component and mark whether it comes from the design system or is new (a new one is a signal to feed back into `design-system`, not to invent ad hoc).
- State the data each component renders — so the handoff can name the API/data contract behind it.
- Note layout intent (regions, hierarchy, what's primary) without prescribing pixel-exact visual styling — that's the system's job.

Wireframes here are about structure and content, not polish. Low fidelity on purpose: it keeps the conversation on *what goes where and why*, not on color.

## Interaction patterns

Define how the screen responds to the user, because behavior is half the experience and the part most often left implicit:

- **Triggers and responses** — what each control does, what feedback the user gets.
- **Transitions** — how the user moves between screens/states, and any motion that carries meaning (not decoration).
- **Input handling** — validation timing (on blur, on submit), inline vs summary errors, defaults, and focus order.
- **Consistency** — reuse the product's established patterns rather than inventing a new one per screen; a novel interaction is a cost the user pays in relearning.

## Every UI state (mandatory)

This is the section that separates a real spec from a mockup. Each screen that holds data must define all four states, because each is a different thing to build and each is where users actually get stuck:

- **Empty** — no data yet. What does the user see, and what's the call to action that gets them out of empty? "Blank screen" is a bug, not a state.
- **Loading** — data in flight. Skeleton, spinner, or optimistic render — and what the user can/can't do while waiting.
- **Error** — the request failed or input was invalid. What the message says, whether it's recoverable, and the path back. Generic "something went wrong" with no next step is a failure.
- **Success** — data present and the action completed. The normal case, plus confirmation feedback for actions that change state.

If a state genuinely can't occur for a screen, say so explicitly — don't leave it silently absent, because absence reads as "forgotten" to the implementer.

## Accessibility (WCAG basics)

Build accessibility into the spec, not as a later retrofit — retrofitting is far more expensive and usually incomplete. The baseline to specify per screen:

- **Keyboard** — every interactive element reachable and operable by keyboard; visible focus; sensible focus order; focus management on state changes (e.g. moving focus to an error or a newly opened dialog).
- **Semantics & labels** — meaningful labels for controls, alt text for informative images, correct heading structure, and roles/landmarks so assistive tech can navigate.
- **Contrast & target size** — text contrast meets WCAG AA; interactive targets are large enough to hit. (Exact token values come from the design system.)
- **Status announcements** — loading/error/success conveyed to assistive tech, not by color or position alone.

## Responsive behavior

State how the layout adapts across breakpoints, because "it works on my screen" is not a spec. For each screen note what reflows, what collapses (nav, multi-column), what's touch-vs-pointer specific, and the minimum width the design must hold. Define behavior at breakpoints, not just one fixed width.

## Handoff spec: what the implementer actually needs

The handoff is the deliverable that makes everything above buildable without a follow-up meeting. It pulls the design into one implementable list per screen:

- **Components** — each one, design-system source or new, with its variant/state.
- **States** — the empty/loading/error/success behavior for that screen, concretely.
- **Data** — what each component needs and the data/API contract behind it (name it, even if "TBD — see backend").
- **Transitions & interactions** — how the user moves and what each control does.
- **Accessibility & responsive notes** — the per-screen specifics from above.

The test: hand it to someone who wasn't in the design conversation. If they can build the screen — including its empty and error states — without asking you a question, the handoff is done.

## How to write it

1. Read the PRD/feature definition; read the design system if it exists.
2. Load `references/design-doc-template.md` when you start — it carries the flows / wireframes / handoff structure and the per-screen state and accessibility checklists.
3. Map flows first, then derive screens, then specify states, interactions, accessibility, and responsive behavior per screen.
4. Write the experience to `{DOCS_ROOT}/design/<feature>/`, split as `flows.md`, `wireframes.md`, and `handoff.md`.
5. Self-check before calling it done: every screen has all four states, every flow has a failure exit, every component is sourced (system or new), and the handoff is buildable cold.

**Load `references/design-doc-template.md` when you start a feature's UX.**

## Roles

Written for whoever holds the designer role (on a team, the UX/product designer; solo, you). Upstream it consumes the PRD/feature definition and composes from the design system. It hands off to the frontend implementer, who builds against the handoff spec — and to the design-system owner when a new component surfaces that the system should own. The author specifies the experience; they do not define the visual system or write the implementation.
