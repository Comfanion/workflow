# Define Methods

Methods for synthesizing research into clear, actionable problem statements.

## Problem Framing

**Purpose:** Create a clear, shared understanding of the problem

**When to use:**
- After research/empathy phase
- When team disagrees on the problem
- Before generating solutions
- When problem feels vague

**Template:**

```
[User type] experiences [problem] when [context] because [root cause].
This matters because [impact].
```

**How to create:**

1. **Identify User Type:** Who specifically has this problem?
2. **Define Problem:** What is the observable problem?
3. **Specify Context:** When/where does it happen?
4. **Find Root Cause:** Why does it happen? (use Five Whys)
5. **State Impact:** Why does it matter? (business + user impact)

**Good vs Bad Examples:**

| Bad | Good |
|-----|------|
| "The form is too long" | "New merchants abandon the onboarding form at step 3 because they don't understand why we need bank details before they've listed products. This causes 40% drop-off and lost revenue." |
| "Users don't like the UI" | "Returning merchants spend 3x longer finding order details because the navigation changed without warning. This increases support tickets by 25%." |
| "We need a better search" | "Merchants with 100+ products can't find specific items because search only matches exact titles. This causes them to scroll manually, wasting 10 min/day." |

**Anti-patterns:**
- Too vague: "Users are unhappy"
- Solution embedded: "Users need a better button"
- No user specified: "The system is slow"
- No context: "Onboarding is broken"
- No impact: "Some users leave the page"

**Output:** Clear problem statement agreed by team

---

## How Might We (HMW)

**Purpose:** Reframe problems as opportunities for design

**When to use:**
- After defining the problem
- To open up solution space
- When team is stuck on one approach
- To generate multiple angles

**Format:**

```
How might we [verb] [user/object] [desired outcome]?
```

**Rules:**
- Start with "How might we..."
- Not too broad (unsolvable)
- Not too narrow (implies solution)
- Focus on one aspect at a time

**How to create:**

1. Start with Problem Statement
2. Break into aspects
3. Reframe each as HMW
4. Use ladder up/down to find right level

**Ladder Up/Down Technique:**

```
Too Broad:    "HMW make onboarding better?"
              ↕ (ladder down - more specific)
Just Right:   "HMW reduce merchant anxiety during bank detail entry?"
              ↕ (ladder down - too specific)
Too Narrow:   "HMW add a tooltip to the bank field?"
```

**Good vs Bad Examples:**

| Bad (Too Broad) | Bad (Too Narrow) | Good |
|-----------------|------------------|------|
| "HMW fix onboarding?" | "HMW add a progress bar?" | "HMW show merchants their progress and next steps?" |
| "HMW make users happy?" | "HMW change button color?" | "HMW reduce anxiety during payment setup?" |
| "HMW improve the app?" | "HMW add a search icon?" | "HMW help merchants find products in large catalogs?" |

**Example Session:**

```markdown
Problem: "New merchants abandon onboarding at bank details step"

HMW Questions:
1. HMW build trust before asking for bank details?
2. HMW explain why bank details are needed?
3. HMW let merchants start selling before providing bank details?
4. HMW make the bank detail entry feel safe?
5. HMW reduce the information we need upfront?
6. HMW use information merchants have already provided?
7. HMW make merchants excited about the next step?
8. HMW show merchants what they'll get after completing this step?
```

**Output:** 5-15 HMW questions that open solution space

---

## Point of View (POV) Statement

**Purpose:** Define the user, their need, and the insight behind it

**When to use:**
- After empathy research
- To focus ideation
- When team needs alignment
- Before brainstorming

**Format:**

```
[User type] needs [what] because [insight].
```

**Components:**

1. **User Type:** Specific, not generic
   - Bad: "Users"
   - Good: "First-time merchants with no e-commerce experience"

2. **Need:** Verb-based, not solution-based
   - Bad: "needs a progress bar"
   - Good: "needs to feel confident about their progress"

3. **Insight:** Non-obvious, based on research
   - Bad: "because it's confusing"
   - Good: "because they associate sharing bank details online with scams"

**Good vs Bad Examples:**

| Bad | Good |
|-----|------|
| "Users need a better form because it's too long" | "First-time merchants need to understand the value of each step because they associate lengthy forms with untrustworthy sites" |
| "Merchants need search because they can't find products" | "High-volume merchants need to locate specific products instantly because their customers are often waiting on the phone" |

**Output:** Focused POV statement that guides ideation

---

## Jobs to Be Done (JTBD)

**Purpose:** Understand what users are trying to accomplish (not what they say they want)

**When to use:**
- Defining product strategy
- Understanding competitive landscape
- When features don't match user needs
- Reframing problems around outcomes

**Format:**

```
When [situation/trigger],
I want to [motivation/action],
so I can [expected outcome].
```

**Three Types of Jobs:**

1. **Functional Job:** The practical task
   - "When I receive an order, I want to ship it quickly, so I can maintain my delivery promise"

2. **Emotional Job:** How they want to feel
   - "When I set up my store, I want to feel like a professional, so I can be confident in my business"

3. **Social Job:** How they want to be perceived
   - "When I share my store link, I want it to look polished, so others see me as a legitimate business"

**JTBD vs Features:**

| Feature Request | Job Behind It |
|----------------|---------------|
| "Add bulk upload" | "I need to list 500 products without spending a week on it" |
| "Add dark mode" | "I need to work on my store at night without eye strain" |
| "Add analytics" | "I need to know which products to promote so I don't waste money" |
| "Add chat support" | "I need answers immediately when something goes wrong with an order" |

**How to discover JTBD:**

1. **Interview Questions:**
   - "What were you trying to accomplish?"
   - "What triggered you to look for a solution?"
   - "What alternatives did you consider?"
   - "What would you do if this product didn't exist?"

2. **Look for:**
   - Workarounds (what do they do now?)
   - Triggers (what started the search?)
   - Hiring/Firing criteria (why switch?)
   - Desired outcomes (what does success look like?)

**Example:**

```markdown
## JTBD: Merchant Onboarding

**Main Job:**
When I decide to sell products online,
I want to set up my store with minimal effort,
so I can start earning money as quickly as possible.

**Related Jobs:**
- When I'm setting up, I want to see examples of successful stores, so I can model my store after them
- When I hit a confusing step, I want immediate help, so I don't waste time being stuck
- When I finish setup, I want to know what to do next, so I can start getting customers
```

**Output:** Job statements that reveal true user motivation

---

## Affinity Clustering

**Purpose:** Organize research data into themes and patterns

**When to use:**
- After interviews (lots of raw data)
- When patterns aren't obvious
- To find themes across users
- Before problem definition

**How to do it:**

1. **Write Observations:**
   - One observation per note
   - Use user's words when possible
   - Include context

2. **Cluster:**
   - Group similar observations
   - Don't pre-define categories
   - Let themes emerge
   - Move notes between groups

3. **Name Clusters:**
   - Give each group a descriptive name
   - Name should capture the theme
   - Use user language, not jargon

4. **Prioritize:**
   - Which themes appeared most?
   - Which have highest impact?
   - Which are most surprising?

**Example:**

```markdown
## Raw Observations (from 8 merchant interviews):

1. "I didn't know why they needed my bank info" - Merchant A
2. "The form felt like it would never end" - Merchant B
3. "I wasn't sure if I was doing it right" - Merchant C
4. "I wanted to see what my store would look like first" - Merchant D
5. "I almost left when they asked for my SSN" - Merchant E
6. "Why can't I just start selling?" - Merchant F
7. "I didn't understand the terminology" - Merchant C
8. "I felt like I was signing up for a mortgage" - Merchant B
9. "I wanted to try before committing" - Merchant A
10. "The error messages didn't help" - Merchant D

## Clusters:

### Trust & Safety Concerns (1, 5, 8)
Merchants feel uncomfortable sharing sensitive information
without understanding why it's needed.

### Desire for Quick Start (4, 6, 9)
Merchants want to see value before completing full setup.
They want to "try before they buy."

### Clarity & Understanding (3, 7, 10)
Merchants struggle with jargon, unclear instructions,
and unhelpful error messages.

### Form Fatigue (2, 8)
The length and complexity of the process feels
disproportionate to the task.
```

**Output:** Themed clusters, prioritized insights

---

## When to Use Each Method

| Method | Best For | Time | Output |
|--------|----------|------|--------|
| **Problem Framing** | Clear problem definition | 30-60 min | Problem statement |
| **HMW** | Opening solution space | 15-30 min | 5-15 HMW questions |
| **POV Statement** | Focusing ideation | 15-30 min | POV statement |
| **JTBD** | Understanding motivation | 1-2 hours | Job statements |
| **Affinity Clustering** | Finding patterns in data | 1-2 hours | Themed clusters |

**Typical Workflow:**
```
Affinity Clustering -> Problem Framing -> POV Statement -> HMW -> Ideation
```

---

## Tips

**Problem Framing:**
- Include measurable impact when possible
- Test: can someone outside the team understand it?
- Avoid embedding solutions in the problem
- Update as you learn more

**HMW:**
- Generate 10-15 HMW questions per problem
- Use ladder up/down to find the right level
- Vote to prioritize (each person gets 3 votes)
- Pick top 3 for ideation

**POV Statement:**
- The insight should be non-obvious
- Test: does it change how you'd approach the problem?
- One POV per user type

**JTBD:**
- Focus on the job, not the solution
- Look for emotional and social jobs (often overlooked)
- "People don't want a quarter-inch drill, they want a quarter-inch hole"

**Affinity Clustering:**
- Don't pre-define categories (let them emerge)
- Use actual user quotes
- Look for surprises (not just confirmation)
- Aim for 3-7 clusters
