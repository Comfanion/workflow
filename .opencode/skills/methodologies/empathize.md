# Empathize Methods

Methods for understanding users, their needs, emotions, and behaviors.

## User Interviews

**Purpose:** Deep conversations to uncover needs, frustrations, and motivations

**When to use:**
- Starting new project
- Validating assumptions
- Understanding user context
- Discovering pain points

**How to conduct:**

1. **Prepare:**
   - Define research goals
   - Identify user segments
   - Prepare open-ended questions
   - Schedule 30-60 min sessions

2. **Interview Structure:**
   ```
   Opening (5 min):
   - Build rapport
   - Explain purpose
   - Get consent
   
   Main Questions (40 min):
   - "Tell me about the last time you..."
   - "Walk me through your process for..."
   - "What frustrates you most about..."
   - "What would make this easier?"
   - "Why is that important to you?"
   
   Closing (5 min):
   - "Is there anything else I should know?"
   - Thank participant
   ```

3. **Question Types:**
   - **Context:** "Tell me about your role..."
   - **Behavior:** "Walk me through how you..."
   - **Emotion:** "How did that make you feel?"
   - **Motivation:** "Why is that important?"
   - **Pain Points:** "What frustrates you about..."
   - **Ideal State:** "In a perfect world, what would..."

4. **Best Practices:**
   - Ask "Why?" to dig deeper
   - Listen more than talk (80/20 rule)
   - Avoid leading questions
   - Record with permission
   - Take notes on emotions
   - Look for patterns across interviews

**Output:** Interview notes, quotes, observations

---

## Empathy Mapping

**Purpose:** Visualize what users say, think, do, and feel

**When to use:**
- After user interviews
- To synthesize research
- To build shared understanding
- Before defining problems

**Structure:**

```
┌─────────────────────────────────────┐
│         USER: [Name/Persona]        │
├─────────────────┬───────────────────┤
│      SAYS       │      THINKS       │
│                 │                   │
│ Direct quotes   │ Unspoken thoughts │
│ from interviews │ and beliefs       │
│                 │                   │
├─────────────────┼───────────────────┤
│      DOES       │      FEELS        │
│                 │                   │
│ Observable      │ Emotional state   │
│ behaviors       │ (use emojis)      │
│                 │                   │
└─────────────────┴───────────────────┘
```

**How to create:**

1. **Identify User:** Choose specific user or persona
2. **Fill Quadrants:**
   - **Says:** Direct quotes from interviews
   - **Thinks:** Inferred thoughts, beliefs, concerns
   - **Does:** Observable actions, behaviors
   - **Feels:** Emotions (frustrated 😤, anxious 😰, happy 😊)

3. **Look for Contradictions:**
   - Says vs Thinks (what they don't say)
   - Does vs Feels (actions vs emotions)

4. **Extract Insights:**
   - What patterns emerge?
   - What contradictions exist?
   - What needs are unmet?

**Example:**

```markdown
## Empathy Map: Busy Merchant

| Says | Thinks |
|------|--------|
| "I don't have time for this" | "This is too complicated" |
| "Just let me finish" | "Why do they need all this info?" |
| "Can't I skip this?" | "I hope I don't mess this up" |

| Does | Feels |
|------|-------|
| Skips optional fields | Frustrated 😤 |
| Rushes through forms | Anxious 😰 |
| Abandons at payment | Overwhelmed 😵 |

**Insight:** Merchants value speed over completeness. They feel anxious about making mistakes and frustrated by unnecessary complexity.
```

**Output:** Visual map, insights, user needs

---

## Journey Mapping

**Purpose:** Map user's experience across all touchpoints over time

**When to use:**
- Understanding full user experience
- Identifying pain points
- Finding opportunities
- Aligning team on user flow

**Structure:**

```
Stage → Awareness → Consideration → Action → Use → Support
        ↓           ↓               ↓        ↓      ↓
Actions [what user does at each stage]
        ↓           ↓               ↓        ↓      ↓
Emotions 😊 😐 😤 😰 [how user feels]
        ↓           ↓               ↓        ↓      ↓
Pain Points [problems, frustrations]
        ↓           ↓               ↓        ↓      ↓
Opportunities [how to improve]
```

**How to create:**

1. **Define Stages:**
   - **Awareness:** User discovers need
   - **Consideration:** User researches options
   - **Action:** User makes decision
   - **Use:** User uses product
   - **Support:** User needs help

2. **For Each Stage, Document:**
   - **Actions:** What user does
   - **Touchpoints:** Where interaction happens
   - **Emotions:** How user feels (use emojis)
   - **Pain Points:** Problems, frustrations
   - **Opportunities:** How to improve

3. **Identify Patterns:**
   - Where do emotions drop? (pain points)
   - Where are gaps in experience?
   - What causes frustration?
   - What delights users?

**Example:**

```markdown
## Journey Map: Merchant Onboarding

### Stage 1: Awareness
**Actions:** Hears about platform from friend
**Emotions:** Curious 🤔, Hopeful 😊
**Pain Points:** None yet
**Opportunities:** Clear value proposition

### Stage 2: Consideration
**Actions:** Visits website, reads features, compares pricing
**Emotions:** Interested 😊, Uncertain 😐
**Pain Points:** Too many options, unclear pricing
**Opportunities:** Simplify pricing, add comparison table

### Stage 3: Action (Sign Up)
**Actions:** Fills registration form, verifies email
**Emotions:** Anxious 😰, Frustrated 😤
**Pain Points:** Form too long, asks for unnecessary data
**Opportunities:** ⭐ Reduce form fields, add progress indicator

### Stage 4: Use (First Product)
**Actions:** Creates first product listing
**Emotions:** Confused 😕, Overwhelmed 😵
**Pain Points:** Unclear what's required, no guidance
**Opportunities:** ⭐ Add onboarding wizard, inline help

### Stage 5: Support
**Actions:** Searches help docs, contacts support
**Emotions:** Frustrated 😤, Relieved 😌 (after help)
**Pain Points:** Hard to find answers
**Opportunities:** Better search, contextual help
```

**Output:** Journey map, prioritized pain points, opportunities

---

## When to Use Each Method

| Method | Best For | Time | Output |
|--------|----------|------|--------|
| **User Interviews** | Deep understanding, discovery | 30-60 min/user | Quotes, observations |
| **Empathy Mapping** | Synthesizing research, building empathy | 30-60 min | Visual map, insights |
| **Journey Mapping** | Understanding full experience, finding gaps | 1-2 hours | Journey map, opportunities |

**Typical Workflow:**
```
User Interviews → Empathy Map → Journey Map → Requirements
```

---

## Tips

**User Interviews:**
- Interview 5-8 users per segment (patterns emerge)
- Record with permission
- Ask "Why?" at least 3 times
- Look for emotions, not just facts

**Empathy Mapping:**
- Do it as a team (shared understanding)
- Use real quotes from interviews
- Focus on one user at a time
- Look for contradictions (Says vs Thinks)

**Journey Mapping:**
- Start with current state (as-is)
- Then create future state (to-be)
- Use emojis for emotions (visual impact)
- Prioritize opportunities (⭐ = high impact)
