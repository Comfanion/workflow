# Diagnose Methods

Methods for root cause analysis and problem diagnosis.

## Five Whys

**Purpose:** Drill down to root cause by asking "Why?" repeatedly

**When to use:**
- Problem has unclear root cause
- Need to go beyond symptoms
- Quick analysis needed
- Team problem-solving

**How to use:**

1. **State the Problem:** Be specific
   - ❌ Bad: "Users are unhappy"
   - ✅ Good: "40% of users abandon checkout"

2. **Ask "Why?" 5 Times:**
   ```
   Problem: [Specific problem statement]
   
   1. Why? [First answer]
   2. Why? [Dig deeper]
   3. Why? [Keep going]
   4. Why? [Almost there]
   5. Why? [Root cause]
   ```

3. **Identify Root Cause:** Usually appears at level 4-5

4. **Verify:** Ask "If we fix this, will the problem go away?"

**Example:**

```markdown
**Problem:** Users abandon checkout (40% drop-off)

1. **Why?** Checkout takes too long
   → Symptom: Time

2. **Why?** Too many form fields (15 fields)
   → Symptom: Complexity

3. **Why?** We ask for unnecessary data (shipping for digital products)
   → Symptom: Poor design

4. **Why?** No one reviewed field requirements
   → Process gap

5. **Why?** No process for validating forms before launch
   → **ROOT CAUSE:** Missing validation process

**Solution:** Create form validation checklist, review all forms
```

**Tips:**
- Stop when you reach actionable root cause
- Sometimes need more/fewer than 5 whys
- Can branch (multiple "whys" per level)
- Verify root cause with data

---

## Fishbone Diagram (Ishikawa)

**Purpose:** Map all possible causes of a problem across categories

**When to use:**
- Complex problems with multiple causes
- Team brainstorming
- Need comprehensive analysis
- Before making decisions

**Structure:**

```
People          Process         Technology
   \               |               /
    \              |              /
     \             |             /
      \            |            /
       \           |           /
        \          |          /
         \         |         /
          \        |        /
           \       |       /
            \      |      /
             \     |     /
              \    |    /
               \   |   /
                \  |  /
                 \ | /
                  \|/
              [PROBLEM]
                 /|\
                / | \
               /  |  \
              /   |   \
             /    |    \
            /     |     \
           /      |      \
          /       |       \
         /        |        \
        /         |         \
       /          |          \
      /           |           \
     /            |            \
    /             |             \
   /              |              \
Data         Environment      Other
```

**Categories (6M):**
- **People:** Skills, training, motivation
- **Process:** Procedures, workflows, steps
- **Technology:** Tools, systems, infrastructure
- **Data:** Quality, availability, accuracy
- **Environment:** Physical space, culture, regulations
- **Other:** Anything else

**How to create:**

1. **Define Problem:** Write at "head" of fish
2. **Identify Categories:** Use 6M or custom
3. **Brainstorm Causes:** For each category
4. **Ask "Why?" for Each Cause:** Add sub-causes
5. **Analyze:** Which causes are most likely?
6. **Prioritize:** Which to address first?

**Example:**

```markdown
## Fishbone: Users Abandon Checkout

### People
- Merchants lack training on checkout flow
- Support team doesn't know common issues
- No one owns checkout experience

### Process
- No form validation before launch
- No user testing of checkout
- No monitoring of drop-off points

### Technology
- Slow page load (3+ seconds)
- Form doesn't save progress
- No mobile optimization

### Data
- Missing analytics on field-level drop-off
- No A/B testing data
- Can't identify which fields cause problems

### Environment
- Competitive pressure to launch fast
- No culture of user testing
- Regulatory requirements add fields

### Other
- Seasonal traffic spikes
- Payment gateway downtime

**Analysis:**
- **Primary causes:** No validation process, slow load, no mobile optimization
- **Secondary causes:** Missing analytics, no user testing
- **Action:** Fix top 3 causes first
```

**Tips:**
- Do as team exercise (whiteboard/Miro)
- Use sticky notes (easy to move)
- Don't judge ideas during brainstorming
- Verify causes with data
- Prioritize based on impact + effort

---

## Is/Is Not Analysis

**Purpose:** Define problem boundaries by contrasting what it is vs what it's not

**When to use:**
- Problem is vague or unclear
- Need to narrow scope
- Multiple interpretations exist
- Before root cause analysis

**Structure:**

| Dimension | IS | IS NOT | Difference | Clue |
|-----------|----|----|------------|------|
| What | [Problem] | [Not problem] | [Key difference] | [Insight] |
| Where | [Locations] | [Not locations] | [Pattern] | [Insight] |
| When | [Times] | [Not times] | [Pattern] | [Insight] |
| Who | [Affected] | [Not affected] | [Pattern] | [Insight] |
| How Much | [Extent] | [Not extent] | [Pattern] | [Insight] |

**How to use:**

1. **Define Dimensions:** What, Where, When, Who, How Much
2. **Fill IS Column:** What the problem IS
3. **Fill IS NOT Column:** What it's NOT (but could be)
4. **Identify Differences:** What's unique about IS?
5. **Extract Clues:** What do differences tell us?

**Example:**

```markdown
## Is/Is Not: Checkout Abandonment

| Dimension | IS | IS NOT | Difference | Clue |
|-----------|----|----|------------|------|
| **What** | Abandonment at checkout | Abandonment at product page | Happens late in funnel | Problem is checkout-specific |
| **Where** | Mobile devices (60%) | Desktop (20%) | Mobile 3x higher | Mobile experience is broken |
| **When** | Peak hours (6-9pm) | Off-peak hours | High traffic times | Performance issue? |
| **Who** | New users (70%) | Returning users (30%) | New users unfamiliar | Onboarding/guidance needed |
| **How Much** | 40% drop-off | 10% drop-off (competitors) | 4x worse than average | Severe problem |

**Insights:**
1. Problem is checkout-specific (not general UX)
2. Mobile experience is critically broken
3. Performance degrades under load
4. New users need more guidance
5. Problem is severe vs competitors

**Hypothesis:** Mobile checkout is slow and confusing for new users during peak traffic.
```

**Tips:**
- Be specific in IS/IS NOT (not vague)
- Look for patterns across dimensions
- Differences reveal root cause
- Use data to fill table
- Update as you learn more

---

## Systems Thinking

**Purpose:** Understand how parts of a system interact and create feedback loops

**When to use:**
- Complex systems with many parts
- Problems keep recurring
- Solutions have unintended consequences
- Need to find leverage points

**Key Concepts:**

1. **Feedback Loops:**
   - **Reinforcing (R):** Amplifies change (growth or decline)
   - **Balancing (B):** Resists change (stabilizes)

2. **Delays:** Time between action and result

3. **Leverage Points:** Small changes with big impact

**How to use:**

1. **Map the System:**
   ```
   [Element A] → [Element B] → [Element C]
        ↑                            ↓
        └────────────────────────────┘
   ```

2. **Identify Loops:**
   - Reinforcing: Success → More users → More success (R)
   - Balancing: Load → Slow → Fewer users → Less load (B)

3. **Find Delays:**
   - Where is there lag between cause and effect?

4. **Identify Leverage Points:**
   - Where can small change have big impact?

**Example:**

```markdown
## System: User Onboarding

### Elements:
- New users sign up
- Onboarding flow
- First product created
- User retention
- Word of mouth

### Feedback Loops:

**R1 (Reinforcing - Growth):**
```
More users → More products → More success stories → More word of mouth → More users
```
**Effect:** Growth accelerates

**B1 (Balancing - Quality):**
```
More users → More support load → Slower response → Worse experience → Fewer users
```
**Effect:** Growth limited by support capacity

**R2 (Reinforcing - Decline):**
```
Complex onboarding → Users fail → Bad reviews → Fewer new users → Less revenue → Less dev → More complex
```
**Effect:** Death spiral

### Delays:
- **Sign up → First product:** 2 days (too long!)
- **Bad experience → Review:** 1 week
- **Review → Impact on signups:** 2 weeks

### Leverage Points:
1. **Onboarding wizard** (breaks R2 decline loop)
2. **Automated support** (prevents B1 capacity limit)
3. **Success metrics** (amplifies R1 growth loop)

**Strategy:** Focus on onboarding wizard (highest leverage)
```

**Tips:**
- Draw diagrams (visual helps)
- Look for vicious/virtuous cycles
- Delays make problems hard to see
- Fix leverage points, not symptoms
- Test interventions (systems are complex)

---

## When to Use Each Method

| Method | Best For | Time | Output |
|--------|----------|------|--------|
| **Five Whys** | Quick root cause, simple problems | 15-30 min | Root cause |
| **Fishbone** | Complex problems, team brainstorming | 1-2 hours | Cause categories |
| **Is/Is Not** | Unclear problems, defining scope | 30-60 min | Problem boundaries |
| **Systems Thinking** | Complex systems, recurring problems | 2-4 hours | System map, leverage points |

**Typical Workflow:**
```
Is/Is Not (define) → Five Whys (quick analysis) → Fishbone (comprehensive) → Systems Thinking (complex)
```

---

## Tips

**Five Whys:**
- Stop at actionable root cause
- Verify with "If we fix this, does problem go away?"
- Can branch (multiple causes)

**Fishbone:**
- Do as team (diverse perspectives)
- Don't judge during brainstorming
- Verify causes with data
- Prioritize by impact

**Is/Is Not:**
- Be specific (not vague)
- Use data to fill table
- Look for patterns across dimensions
- Update as you learn

**Systems Thinking:**
- Draw diagrams (visual helps)
- Look for feedback loops
- Find leverage points (small change, big impact)
- Test interventions (systems surprise you)
