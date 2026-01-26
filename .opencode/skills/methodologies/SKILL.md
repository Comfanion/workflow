---
name: methodologies
description: Use when applying Five Whys, Empathy Mapping, Journey Mapping, or other analysis methods
license: MIT
compatibility: opencode
metadata:
  domain: analysis
  agents: [analyst, pm, architect, researcher]
---

# Methodologies Skill

> **Purpose**: Structured methods for requirements, analysis, and problem-solving
> **Used by**: Analyst, PM, Architect, Researcher

---

## By Agent Role

| Agent | Primary Methods |
|-------|-----------------|
| **Analyst (Mary)** | User Interviews, Empathy Mapping, Journey Mapping, Affinity Clustering, Five Whys, Fishbone |
| **PM (John)** | Problem Framing, HMW, POV Statement, JTBD, Brainstorming, SCAMPER |
| **Architect (Winston)** | Systems Thinking, Fishbone, Is/Is Not Analysis, Decision Matrix |
| **Researcher (Alex)** | Analogous Inspiration, Five Whys, Systems Thinking, Is/Is Not |

---

## EMPATHIZE Methods (Analyst)

### User Interviews
**Purpose**: Deep conversations to understand user needs, experiences, and pain points

**Prompts**:
- What brings you here today?
- Walk me through a recent experience
- What frustrates you most?
- What would make this easier?
- Tell me more about that

**Output**: Interview notes, verbatim quotes, key insights

---

### Empathy Mapping
**Purpose**: Visual representation of what users Say, Think, Do, Feel

```
┌─────────────────────────────────────┐
│            SAYS                     │
│  "Actual quotes from user"          │
├─────────────────────────────────────┤
│            THINKS                   │
│  What might they be thinking?       │
├─────────────────────────────────────┤
│            DOES                     │
│  What actions did they take?        │
├─────────────────────────────────────┤
│            FEELS                    │
│  What emotions surfaced?            │
└─────────────────────────────────────┘
```

---

### Journey Mapping
**Purpose**: Document complete user experience across touchpoints

```
Stage:      │ Awareness │ Consideration │ Action │ Use │ Support │
────────────┼───────────┼───────────────┼────────┼─────┼─────────┤
Actions     │           │               │        │     │         │
Thoughts    │           │               │        │     │         │
Emotions    │   😀      │      😐       │   😰   │ 😊  │   😡    │
Pain Points │           │               │        │     │         │
Opportunities│          │               │        │     │         │
```

**Prompts**:
- What's their starting point?
- What steps do they take?
- Where do they struggle?
- What delights them?
- What's the emotional arc?

---

## DEFINE Methods (Analyst, PM)

### Problem Framing
**Purpose**: Transform observations into clear actionable problem statements

**Prompts**:
- What's the **real** problem? (not the symptom)
- Who experiences this?
- Why does it matter?
- What would success look like?

**Output**: 1-2 sentence problem statement that inspires solutions

---

### How Might We (HMW)
**Purpose**: Reframe problems as opportunity questions

**Format**: `How might we [action] for [user] so that [outcome]?`

**Examples**:
- How might we help merchants update inventory faster?
- How might we make checkout easier for mobile users?
- How might we reduce friction in onboarding?

**Rules**:
- Opens solution space (not prescriptive)
- User-centered
- Implies positive change

---

### Point of View (POV) Statement
**Purpose**: Specific user-centered problem statements

**Template**:
```
[User type] needs [what] because [insight]
```

**Example**:
> A busy merchant needs quick inventory updates because they lose sales when items show as available but are out of stock.

**Prompts**:
- What's driving this need?
- Why does it matter to them?

---

### Affinity Clustering
**Purpose**: Group observations to reveal patterns and themes

**Process**:
1. Write each observation on a card/sticky
2. Group similar items together (silently)
3. Name each cluster
4. Identify meta-themes

**Prompts**:
- What connects these?
- What themes emerge?
- What story do they tell?

---

### Jobs to be Done (JTBD)
**Purpose**: Identify what users are "hiring" solutions to accomplish

**Template**:
```
When [situation], I want to [motivation], so I can [expected outcome]
```

**Three Job Types**:
| Type | Question |
|------|----------|
| **Functional** | What task are they completing? |
| **Emotional** | How do they want to feel? |
| **Social** | How do they want to be perceived? |

**Prompts**:
- What job are they trying to do?
- What progress do they want?
- What are they really hiring this for?
- What alternatives exist?

---

## IDEATE Methods (PM, Analyst)

### Brainstorming Rules
1. **No bad ideas** - defer judgment
2. **Build on others** - "Yes, and..."
3. **Aim for quantity** - 50+ ideas
4. **Be visual** - sketch it
5. **Stay on topic** - one problem at a time
6. **Time-box** - 10-15 minutes max

---

### SCAMPER
**Purpose**: Apply 7 lenses to existing solutions for innovation

| Letter | Question | Example |
|--------|----------|---------|
| **S**ubstitute | What can we substitute? | Different payment provider? |
| **C**ombine | What can we combine? | Checkout + registration? |
| **A**dapt | What can we adapt from elsewhere? | How does Uber handle this? |
| **M**odify | How can we modify/magnify? | What if 10x faster? |
| **P**ut to other uses | Other purposes? | Could this data serve analytics? |
| **E**liminate | What can we remove? | Do we need this step? |
| **R**everse | What if we reversed it? | User pulls instead of push? |

---

## DIAGNOSIS Methods (Analyst, Architect, Researcher)

### Five Whys Root Cause
**Purpose**: Drill through symptoms to find root cause

**Example**:
```
Problem: Users are abandoning checkout
  └─ Why? → Payment fails frequently
       └─ Why? → Timeout errors occur
            └─ Why? → Payment gateway is slow
                 └─ Why? → No connection pooling
                      └─ Why? → Legacy implementation
                           
ROOT CAUSE: Legacy payment integration needs refactoring
```

**Tips**:
- Don't stop at the comfortable answer
- Look for systemic causes, not blame
- May need 3-7 "whys" (5 is a guideline)

---

### Fishbone Diagram (Ishikawa)
**Purpose**: Map all potential causes across categories

```
                    ┌─────────────────────────────────────────┐
    People ─────────┤                                         │
                    │                                         │
    Process ────────┤                                         │
                    │              PROBLEM                    ├───▶ EFFECT
    Technology ─────┤                                         │
                    │                                         │
    Data ───────────┤                                         │
                    │                                         │
    Environment ────┤                                         │
                    └─────────────────────────────────────────┘
```

**Categories (adapt to context)**:
| Category | Questions |
|----------|-----------|
| **People** | Skills? Training? Capacity? Communication? |
| **Process** | Steps? Handoffs? Bottlenecks? Unclear? |
| **Technology** | Systems? Tools? Integration? Performance? |
| **Data** | Quality? Availability? Format? Timeliness? |
| **Environment** | External factors? Dependencies? Constraints? |

---

### Is/Is Not Analysis
**Purpose**: Define problem boundaries by contrast

| Question | IS | IS NOT |
|----------|-----|--------|
| **WHAT** is the problem? | | |
| **WHERE** does it occur? | | |
| **WHEN** does it happen? | | |
| **WHO** experiences it? | | |
| **HOW MUCH** impact? | | |

**Prompts**:
- Where does problem occur? Where doesn't it?
- When does it happen? When doesn't it?
- Who experiences it? Who doesn't?
- What pattern emerges from the contrast?

---

### Systems Thinking
**Purpose**: Map interconnected elements, feedback loops, and leverage points

**Components to Map**:
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  ELEMENTS   │────▶│ CONNECTIONS │────▶│  FEEDBACK   │
│             │     │             │     │   LOOPS     │
│ What are    │     │ What        │     │ Reinforcing │
│ the parts?  │     │ relationships?│   │ or balancing?│
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  LEVERAGE   │
                    │   POINTS    │
                    │             │
                    │ Where small │
                    │ change = big│
                    │ impact?     │
                    └─────────────┘
```

**Prompts**:
- What are the system components?
- What relationships exist between them?
- What feedback loops exist? (reinforcing or balancing)
- What delays occur in the system?
- Where are the leverage points?

---

## EVALUATION Methods (Architect, PM)

### Decision Matrix
**Purpose**: Systematically evaluate options against weighted criteria

**Template**:
| Criterion | Weight | Option A | Option B | Option C |
|-----------|--------|----------|----------|----------|
| Performance | 3 | 8 (24) | 6 (18) | 9 (27) |
| Cost | 2 | 7 (14) | 9 (18) | 5 (10) |
| Complexity | 2 | 6 (12) | 8 (16) | 4 (8) |
| Team Skills | 1 | 9 (9) | 5 (5) | 7 (7) |
| **Total** | | **59** | **57** | **52** |

**Process**:
1. List options
2. Define criteria (from NFRs, constraints)
3. Assign weights (importance)
4. Score each option (1-10)
5. Calculate weighted scores
6. Discuss and decide

---

## RESEARCH Methods (Researcher)

### Analogous Inspiration
**Purpose**: Find solutions from different domains

**Prompts**:
- What other field solves a similar problem?
- How does nature handle this? (biomimicry)
- What's an analogous problem in another industry?
- What can we borrow and adapt?

**Examples**:
| Problem | Analogous Domain | Insight |
|---------|------------------|---------|
| Queue management | Theme parks | FastPass reservation system |
| Fraud detection | Immune system | Pattern recognition, antibodies |
| Load balancing | Ant colonies | Distributed decision-making |

---

## Quick Reference by Task

### Requirements Gathering
1. **User Interviews** → raw data
2. **Empathy Mapping** → organize insights
3. **Affinity Clustering** → find patterns
4. **JTBD** → frame needs

### Problem Definition
1. **Problem Framing** → clear statement
2. **Five Whys** → root cause
3. **Is/Is Not** → boundaries
4. **HMW** → opportunity questions

### Solution Generation
1. **Brainstorming** → quantity of ideas
2. **SCAMPER** → systematic exploration
3. **Analogous Inspiration** → cross-domain ideas

### Architecture Decisions
1. **Systems Thinking** → understand complexity
2. **Fishbone** → cause analysis
3. **Decision Matrix** → evaluate options

---

## Method Selection Guide

| Situation | Use These Methods |
|-----------|-------------------|
| Don't understand users | User Interviews, Empathy Mapping, Journey Mapping |
| Problem is vague | Problem Framing, Five Whys, Is/Is Not |
| Need root cause | Five Whys, Fishbone, Systems Thinking |
| Need fresh ideas | Brainstorming, SCAMPER, Analogous Inspiration |
| Organizing insights | Affinity Clustering, JTBD |
| Comparing options | Decision Matrix |
| Complex system issues | Systems Thinking, Fishbone |
