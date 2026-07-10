---
name: research-planning
description: Use when the user wants to **plan** investigations before doing them: surface unknowns, risky assumptions, and open questions that block a confident decision, then turn each surviving item into a scoped, timeboxed spike (sharp question + exit criterion + timebox + owner + decision-it-unblocks). Trigger phrases: "plan research", "what do we need to find out", "we don't know yet", "list the unknowns / open questions", "de-risk this decision", "scope the spikes", "what are our assumptions". Output is a prioritized research plan only — it does not run the spikes or make the final call. Do NOT use when the user wants the research **executed**: "investigate X", "research X", "compare A vs B", "look into X and report back", "run the spike", "is X viable?", or any request to read sources and form a conclusion. Those route to `research-methodology`, which takes a planned question and produces a cited report. The dividing line: this skill **writes** the sharp questions and timeboxes; `research-methodology` **answers** them. Also do not use to make the final product/architecture decision once evidence is in.
---

# Research Planning

This skill answers one question: **what do we not yet know that could make this decision wrong, and how do we find out cheaply before committing?** The output is a research plan — a prioritized list of timeboxed spikes, each scoped to answer one sharp question. It is the step between "we have a goal" and "we have the evidence to plan the work."

The failure mode this skill exists to prevent is two-sided: charging into building on top of an untested assumption, or its opposite — open-ended research that drifts for days because nobody defined when it is allowed to stop. A spike with no exit criterion and no timebox is not research, it is a hole. This skill forces both.

## Where this sits

- **This skill PLANS** the investigations: it names the unknowns, frames them as questions, and scopes each as a timeboxed spike.
- **research-methodology PERFORMS** them: it takes a planned question and runs the actual technical/market/domain/competitive investigation, producing a cited report. That is the handoff — you write the spike; that skill executes it.
- **You do not make the decision.** The plan de-risks the decision by closing the unknowns; the product/architecture role decides once the evidence is in.

Be strict about the boundary: if you catch yourself doing the investigating (searching, comparing options, reading docs to form a conclusion), you have crossed into research-methodology. Stop and hand off. Your job ends when each unknown is a well-scoped spike ready to execute.

## Step 1 — Surface the unknowns

Before anything can be planned, name what is missing. Pull from three sources:

- **Open questions** — things explicitly unanswered ("which payment provider?", "can the existing schema hold this?").
- **Risky assumptions** — things currently being *assumed* true without evidence. These are the dangerous ones because they are invisible: nobody is asking the question because everybody thinks they know. Hunt them out by asking "what are we taking for granted here?" of every part of the plan.
- **Unknown unknowns proxies** — areas of unfamiliar technology, new domains, or untested integrations where you cannot yet articulate the question. Flag the *area* as needing exploration even when you cannot phrase the precise question yet.

Write each as a plain statement of what is not understood. Do not solve them here — just surface them. A named assumption is a finding; a hidden one is a future incident.

## Step 2 — Prioritize by risk × uncertainty

You cannot spike everything, and most unknowns do not matter. Rank each by two axes:

- **Risk / impact** — how badly does the decision go wrong if this assumption is false? (cost to reverse, blast radius, whether it blocks other work)
- **Uncertainty** — how unsure are we right now? (an assumption we are 95% confident in needs no spike; a coin-flip on a load-bearing decision needs one urgently)

The spikes worth running are **high risk × high uncertainty**: load-bearing decisions we are genuinely unsure about. High-risk-but-near-certain items get a quick confirmation, not a spike. Low-risk items, however uncertain, are left to discover during the work — spiking them wastes the timebox. Make the ranking explicit so the cut is defensible.

## Step 3 — Turn each into a scoped spike

A spike is a small, deliberately limited investigation. For each unknown that cleared the cut, define all of:

- **Sharp question** — the single thing this spike must answer, phrased so the answer is recognizable. "Investigate caching" is not a question; "Can Redis hold our session volume under 10k concurrent users within the 50ms p95 budget?" is. A vague question produces a vague answer and never terminates.
- **Exit / success criterion** — what evidence ends the spike. "We have a benchmark showing p95 latency at projected load" or "we have a documented yes/no with the reasoning." This is the stop condition — without it the spike runs forever.
- **Timebox** — a hard cap (e.g. half a day, two days). When it expires, you stop and report what you found, even if inconclusive — an "inconclusive within the timebox" is itself a decision input, telling you the question is harder than scoped.
- **Owner** — one named person/role accountable for running it. Unowned spikes do not happen.
- **Decision it unblocks** — which downstream decision this evidence feeds, so the spike's value is visible and pointless spikes are cut.

Spikes are throwaway by design: their product is knowledge and a recommendation, not shippable code. Say so, so nobody tries to ship the prototype.

## Step 4 — Order and hand off

Order the spikes so the ones that unblock the most (or feed the earliest decision) run first, and note dependencies (spike B only makes sense after spike A's answer). Then hand each off to research-methodology for execution. The plan is the contract; the report each spike produces is the fulfillment.

## Output

Write the plan to `{DOCS_ROOT}/research/research-plan.md` (or one file per spike under `{DOCS_ROOT}/research/spikes/`). `{DOCS_ROOT}` defaults to `docs/` at the project root; honor the project's configured docs location if one is set. Use the structure in `references/spike-template.md` (load when scoping a spike): it carries the question, exit criterion, timebox, owner, the decision it unblocks, and a findings slot the executing role fills in.

## Quality bar

Before calling the plan done:

- Every load-bearing assumption is surfaced as an explicit unknown — including the ones currently taken for granted.
- Each unknown is ranked by risk × uncertainty, and the cut (what gets a spike, what does not) is justified.
- Every planned spike has all five: sharp question, exit criterion, timebox, owner, decision-it-unblocks.
- No spike's question is open-ended ("look into X") — each has a recognizable answer.
- Spikes are ordered with dependencies noted, and handed to research-methodology to execute.
- The plan stops at planning — it does not contain the investigation's conclusions.

## Roles

This skill is cross-cutting — any role facing unknowns uses it (the product role de-risking scope, the architecture role de-risking a design, the dev role de-risking an integration). It plans and scopes; the research role (research-methodology) executes each spike into a cited report, and the product/architecture role makes the call once the evidence is in. The planner frames the questions; they do not answer them or decide.
