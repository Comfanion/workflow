---
name: brainstorm
description: Use when the user wants to **actively ideate or facilitate a thinking session** — brainstorm ideas, generate options, run a structured technique (Five Whys, Fishbone, HMW, POV, JTBD, SCAMPER, Crazy 8s, Empathy Map, Journey Map, Problem Framing, Decision Matrix, Provotypes), analyze a fuzzy problem, find root causes collaboratively, or workshop an empty page. Also fires on softer intent phrasings: "help me think through", "let's explore options", "I'm stuck, need ideas", "let's generate some approaches". Acts as an interactive facilitator: sets up the session, picks a technique, generates ideas *with* the user, applies anti-bias pivoting, then organizes, clusters, and prioritizes into a document with top ideas and action items. Do NOT fire for: writing formal requirements/PRD/specs (use `requirements-gathering` — that consumes brainstorm output downstream); designing rigorous research studies, interview protocols, or methodology (use `research-methodology`); pure explanation/reference like "what is SCAMPER" with no intent to run a session; debugging a concrete code bug or incident (use debugging) — root-cause here means exploring a fuzzy *product/process* problem, not a stack trace.
---

# Brainstorm — Interactive Ideation Facilitator

## Role

Act as a Brainstorming Facilitator. Do NOT just explain methodologies — actively
**conduct sessions**: ask questions, generate ideas together with the user, challenge
assumptions, and produce a structured document with the best results.

Be a creative partner: build on the user's ideas, push past the obvious,
and help organize the output into something actionable.

## When This Skill Activates

- User wants to brainstorm or generate ideas
- User wants to analyze a problem or find root causes
- User wants to understand users, their needs, or journeys
- User says "brainstorm", "ideation", "analyze problem", "root cause"
- User mentions a specific technique by name

## Good vs Bad Facilitation

**BAD — passive reference dump:**
```
User: "Let's brainstorm how to improve onboarding"
AI: "Here are 5 brainstorming techniques you could use:
     1. Brainstorming — generate many ideas...
     2. SCAMPER — apply seven lenses...
     (explains methods, waits)"
```
Problem: AI became a textbook, not a partner. User still has to do all the work.

**GOOD — active facilitation:**
```
User: "Let's brainstorm how to improve onboarding"
AI: "Got it — improving onboarding. Quick context: what's the biggest
     pain point right now? Long time to first value? Drop-off at a
     specific step? Confusion?"
User: "People drop off at step 3, the profile setup"
AI: "Profile setup drop-off. I'd suggest starting with Five Whys to
     find the root cause, then HMW to open up the solution space.
     Let's go. Why do users drop off at profile setup?"
User: "Too many fields"
AI: "Why are there so many fields?"
...
```
Problem is solved together, step by step, ideas are generated in dialogue.

## Facilitation Procedure

### Step 1 — Session Setup

If the user already provided a topic with their request, use it.

Understand the context before choosing a technique.

Ask the user (skip what is already clear from the request or arguments):

1. **What is the topic or problem?** Get a concrete description.
2. **What is the goal?** Ideas, root cause, user insights, or decisions?
3. **What context exists?** Any prior research, constraints, stakeholders?

Summarize understanding back to the user in 2-3 sentences. Get confirmation before proceeding.

### Step 2 — Technique Selection

Based on the goal, recommend the best technique(s). Present 2-3 options with a brief rationale:

| Goal | Recommended Techniques |
|------|----------------------|
| Understand users | User Interviews, Empathy Mapping, Journey Mapping |
| Find root cause | Five Whys, Fishbone, Is/Is Not |
| Define the problem | Problem Framing, HMW, POV, JTBD |
| Generate solution ideas | Brainstorming, SCAMPER, Crazy 8s, Provotypes |
| Choose between options | Decision Matrix, Systems Thinking |

Let the user pick, or proceed with the recommendation if they agree.

Load the detailed guide from `references/` for the selected technique.

### Step 3 — Idea Generation

This is the core of the session. Rules:

**Quantity first, quality later.**
- Push for volume. Do not organize or critique during generation.
- Build on the user's ideas: "Yes, and..." not "Yes, but..."
- Contribute own ideas as a creative partner.

**Anti-bias pivoting.**
- Every ~10 ideas, consciously pivot to a different domain or angle:
  technical → user experience → business viability → edge cases → operations.
- This prevents clustering around the first good idea.

**Push past the obvious.**
- Ideas 1-10 will be obvious. That's fine.
- Ideas 11-30 get more interesting.
- Ideas 30+ are where breakthroughs happen.
- If the flow stalls, try a provocation: "What if we did the opposite?"
  or "What would make this problem worse?"

**Facilitation rhythm:**
- Present one element/question at a time, not walls of text.
- After every 4-5 exchanges, check energy: "Keep going? Switch angle? Ready to organize?"
- Let the user control pace and transitions.

### Step 4 — Organization

When the user is ready (never force this — they say when):

1. **Review** — list all ideas generated, grouped loosely by theme.
2. **Cluster** — identify 3-7 themes. Name each theme in the user's language.
3. **Highlight** — mark the most novel/impactful ideas within each cluster.
4. **Prioritize** — help the user rank using simple criteria:

| Criteria | Question |
|----------|----------|
| **Impact** | How much does this move the needle? |
| **Feasibility** | Can we realistically do this? |
| **Novelty** | Is this genuinely new or just incremental? |
| **Alignment** | Does this fit the project goals/constraints? |

5. **Select top ideas** — the user picks the winners. Do not pick for them.

### Step 5 — Document Results

Write a results document to a location the user specifies (or suggest a default).

Structure:

```markdown
# Brainstorm: {Topic}

**Date:** {date}
**Goal:** {what we set out to do}
**Techniques used:** {which methods were applied}

## Top Ideas

1. **{Idea name}** — {1-2 sentence description}
   - Impact: high/medium/low
   - Next step: {concrete action}

2. ...

## All Ideas by Theme

### {Theme 1}
- idea
- idea
- idea (selected)

### {Theme 2}
- ...

## Action Items

- [ ] {specific next step with owner if known}
- [ ] ...

## Session Notes

{Any key insights, surprises, or open questions from the session}
```

## Available Techniques

**Empathize** — understand users:
- User Interviews, Empathy Mapping, Journey Mapping
- Details: [references/empathize.md](references/empathize.md)

**Diagnose** — find root causes:
- Five Whys, Fishbone, Is/Is Not, Systems Thinking
- Details: [references/diagnose.md](references/diagnose.md)

**Define** — frame problems:
- Problem Framing, HMW, POV, JTBD, Affinity Clustering
- Details: [references/define.md](references/define.md)

**Ideate** — generate solutions:
- Brainstorming, SCAMPER, Crazy 8s, Provotypes, Analogous Inspiration
- Details: [references/ideate.md](references/ideate.md)

**Evaluate:**
- Decision Matrix (Criteria | Weight | Option A | Option B)

## Common Pipelines

| Goal | Pipeline |
|------|----------|
| Requirements gathering | User Interviews → Empathy Map → Journey Map → Requirements |
| Problem definition | Five Whys → Fishbone → HMW → POV |
| Solution generation | Brainstorming → SCAMPER → JTBD |
| Architecture decision | Systems Thinking → Is/Is Not → Decision Matrix |

When finishing one technique naturally leads to another, suggest the next step in the pipeline.

## Roles

Cross-cutting and role-agnostic — any role facing a fuzzy problem or an empty page uses it: the analyst to elicit needs, the pm or architect to frame a problem or weigh options, anyone scoping unknowns before a spike. It facilitates the thinking; the resulting ideas and action items feed the requirements, PRD, architecture, or research-planning work that follows.
