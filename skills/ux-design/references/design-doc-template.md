# UX Design Doc — `{{feature}}`

> Write to `{DOCS_ROOT}/design/<feature>/`, split across `flows.md`, `wireframes.md`, and `handoff.md`. Fill every `{{placeholder}}`. Remove a section only if it genuinely can't apply — and say so.

---

## flows.md — user flows

For each flow:

### Flow: `{{goal}}`

- **Entry point:** {{where the user comes from / what they know}}
- **Steps:**
  1. {{user action}} → {{system response}}
  2. ...
- **Decision points:** {{branches — auth vs not, has-data vs empty, valid vs invalid}}
- **Exits:**
  - Success: {{goal reached}}
  - Failure/abandon: {{every non-success path — required}}

```
{{simple step/decision diagram — boxes for screens, diamonds for decisions}}
```

---

## wireframes.md — screens + component inventory

For each screen:

### Screen: `{{name}}`

- **Purpose / where in the flow:** {{...}}
- **Layout intent:** {{regions, hierarchy, what's primary — structure not pixels}}
- **Component inventory:**

| Component | Source | Data it needs | Notes |
|-----------|--------|---------------|-------|
| {{name}} | {{design-system / NEW}} | {{data/contract}} | {{variant, etc.}} |

- **Interaction patterns:** {{triggers→responses, validation timing, focus order, transitions in/out}}
- **UI states (all four — mandatory):**
  - Empty: {{what's shown + CTA out of empty}}
  - Loading: {{skeleton/spinner, what's interactive while waiting}}
  - Error: {{message, recoverable?, path back}}
  - Success: {{normal case + confirmation feedback}}
  - _(If a state can't occur here, say so explicitly.)_
- **Accessibility:** {{keyboard/focus, labels & semantics, contrast/target, status announcements}}
- **Responsive:** {{what reflows/collapses per breakpoint, min width, touch vs pointer}}

---

## handoff.md — implementer spec

One block per screen — buildable without asking the designer a question.

### Screen: `{{name}}`

- **Components:** {{each, source, variant/state}}
- **States:** {{empty / loading / error / success behavior, concretely}}
- **Data:** {{what each component needs + API/data contract, or "TBD — see backend"}}
- **Transitions & interactions:** {{how the user moves, what each control does}}
- **Accessibility notes:** {{per-screen specifics}}
- **Responsive notes:** {{per-screen specifics}}

**Cold-read test:** can someone who wasn't in the design conversation build this — including empty and error states — without a follow-up question? If not, the handoff isn't done.
