# Diagnose Methods

Methods for understanding root causes and system dynamics behind problems.

## Five Whys

**Purpose:** Find root cause by asking "Why?" repeatedly

**When to use:**
- Problem seems obvious but keeps recurring
- Need to go deeper than symptoms
- Before jumping to solutions
- When team disagrees on the cause

**How to do it:**

1. **State the problem clearly**
2. **Ask "Why?" and answer**
3. **Ask "Why?" about the answer**
4. **Repeat until root cause emerges** (usually 3-7 times)
5. **Verify: does fixing the root cause fix the problem?**

**Example:**

```markdown
## Five Whys: Users Abandon Checkout

**Problem:** 35% of users abandon checkout at payment step

**Why 1:** Why do users abandon at payment?
→ They don't trust the payment form

**Why 2:** Why don't they trust the payment form?
→ It doesn't look like the rest of the site

**Why 3:** Why doesn't it look like the rest of the site?
→ It's a third-party iframe with different styling

**Why 4:** Why is it a third-party iframe with different styling?
→ The payment provider doesn't allow custom styling on the current plan

**Why 5:** Why are we on a plan that doesn't allow custom styling?
→ No one evaluated the UX impact when choosing the payment provider

**Root Cause:** Payment provider was chosen based on cost alone,
without considering UX impact on conversion.

**Action:** Evaluate payment providers based on UX customization,
not just cost. Upgrade current plan or switch providers.
```

**Tips:**
- Don't stop at the first "comfortable" answer
- There may be multiple branches (multiple causes)
- The root cause should be actionable
- Avoid blame ("because John didn't...") - focus on systems
- Verify by asking: "If we fix this, does the problem go away?"

**Output:** Root cause statement, actionable next steps

---

## Fishbone Diagram (Ishikawa)

**Purpose:** Map all possible causes of a problem systematically

**When to use:**
- Problem has multiple possible causes
- Need comprehensive cause analysis
- Before prioritizing what to fix
- When Five Whys gives too narrow a view

**Structure:**

```
                          Problem
                         /   |   \
                        /    |    \
              People  Process  Technology
                |        |        |
              cause    cause    cause
              cause    cause    cause

              Data  Environment  Other
                |        |        |
              cause    cause    cause
              cause    cause    cause
```

**6M Categories:**

1. **People:** Skills, knowledge, staffing, communication
2. **Process:** Workflows, procedures, policies, steps
3. **Technology:** Tools, systems, infrastructure, bugs
4. **Data:** Quality, availability, format, accuracy
5. **Environment:** Context, timing, market, culture
6. **Other:** Anything that doesn't fit above

**How to create:**

1. **Write the problem on the right** (the "head")
2. **Draw main branches** (categories)
3. **Brainstorm causes** for each category
4. **Ask "Why?"** for each cause to go deeper
5. **Identify the most likely root causes**
6. **Prioritize** by impact and evidence

**Example:**

```markdown
## Fishbone: Merchant Onboarding Drop-off (40%)

### People
- Support team can't help with technical issues
- Merchants have low tech literacy
- No dedicated onboarding specialist
- Merchant expectations set incorrectly by sales

### Process
- 12-step onboarding flow (too many steps)
- Bank verification takes 3-5 days
- No save-and-resume capability
- Mandatory fields that aren't actually mandatory
- No clear explanation of why info is needed

### Technology
- Form crashes on mobile Safari
- No auto-save (lose progress on timeout)
- Slow page loads (8+ seconds on step 3)
- Bank API integration fails silently

### Data
- Address validation rejects valid addresses
- Tax ID format not clear (with/without dashes?)
- Error messages are generic ("Invalid input")
- Required vs optional fields not distinguished

### Environment
- Merchants often start on mobile (form not optimized)
- Competitors have 3-step onboarding
- Merchants try during business hours (distracted)
- Seasonal rush creates urgency pressure

### Other
- Legal requires disclosures that scare merchants
- Recent negative press about data breaches
- Form available only in English

## Priority Causes (by evidence):
1. Form crashes on mobile Safari (30% of users)
2. No save-and-resume (users lose progress)
3. 12-step flow (competitors have 3 steps)
4. Bank API fails silently (users don't know what happened)
```

**Output:** Comprehensive cause map, prioritized root causes

---

## Is/Is Not Analysis

**Purpose:** Precisely define problem boundaries by clarifying what the problem IS and IS NOT

**When to use:**
- Problem scope is unclear
- Team is conflating multiple problems
- Need to narrow focus
- When assumptions need testing

**Structure:**

| Dimension | IS | IS NOT |
|-----------|-----|--------|
| **What** | What is the problem? | What is it NOT? |
| **Where** | Where does it occur? | Where does it NOT occur? |
| **When** | When does it happen? | When does it NOT happen? |
| **Who** | Who is affected? | Who is NOT affected? |
| **How Much** | How big is the impact? | How big is it NOT? |

**How to create:**

1. **Ask IS questions:** What specifically is happening?
2. **Ask IS NOT questions:** What similar things are NOT happening?
3. **Look for distinctions:** What's different between IS and IS NOT?
4. **Form hypotheses:** What could cause these distinctions?

**Example:**

```markdown
## Is/Is Not: Checkout Abandonment

| Dimension | IS | IS NOT |
|-----------|-----|--------|
| **What** | Users abandon at payment step | Users don't abandon at address step |
| **What** | Credit card form is the issue | PayPal option works fine |
| **Where** | Happens on mobile web | Doesn't happen on desktop |
| **Where** | Happens on iOS Safari | Doesn't happen on Chrome mobile |
| **When** | Started after Oct 15 release | Wasn't happening before Oct 15 |
| **When** | Happens during business hours | Less frequent at night |
| **Who** | Affects new users | Doesn't affect returning users |
| **Who** | Affects users with saved cards | N/A - no saved card feature |
| **How Much** | 35% abandonment rate | Was 15% before Oct 15 |
| **How Much** | Costs ~$50K/month | Not affecting average order value |

## Distinctions:
- Mobile vs Desktop → something broke in mobile layout
- After Oct 15 → specific release introduced the issue
- New vs Returning → returning users may use different flow
- Credit Card vs PayPal → credit card form specifically

## Hypothesis:
The Oct 15 release broke the credit card form layout on
mobile Safari, causing new users (who don't have alternative
payment methods saved) to abandon checkout.
```

**Output:** Clear problem boundaries, specific hypotheses

---

## Systems Thinking

**Purpose:** Understand how parts interact, find leverage points

**When to use:**
- Problem keeps recurring despite fixes
- Multiple stakeholders involved
- Solution in one area creates problems in another
- Need to understand long-term effects

**Key Concepts:**

### Feedback Loops

**Reinforcing Loop (R):** Growth or decline that feeds itself
```
More users → More content → More value → More users (R+)
Bad reviews → Fewer users → Less revenue → Worse product → Bad reviews (R-)
```

**Balancing Loop (B):** Self-correcting, seeks equilibrium
```
More support tickets → Hire more agents → Faster resolution → Fewer tickets (B)
More features → More complexity → More bugs → Slow down development → Fewer features (B)
```

### Delays

Effects that take time to appear:
```
Change onboarding → [2 weeks] → See impact on completion rate
Hire developers → [3 months] → See impact on velocity
```

### Leverage Points

Where small changes have big effects:
1. **Rules of the system** (what's allowed/not)
2. **Information flows** (who knows what)
3. **Feedback loops** (what reinforces what)
4. **Goals** (what the system is trying to do)

**How to apply:**

1. **Map the system:**
   - What are the key elements?
   - How do they connect?
   - What are the feedback loops?

2. **Identify loops:**
   - Which are reinforcing (R)?
   - Which are balancing (B)?
   - Where are the delays?

3. **Find leverage points:**
   - Where would a small change have the biggest impact?
   - What information is missing?
   - What feedback loop is broken?

**Example:**

```markdown
## System Map: User Onboarding

### Elements:
- New signups
- Onboarding completion rate
- Active merchants
- Revenue
- Product investment
- Product quality
- Support tickets
- Support team capacity

### Loops:

**R1 (Growth Loop):**
More active merchants → More revenue → More product investment
→ Better product → Higher completion rate → More active merchants

**R2 (Death Spiral):**
Low completion rate → Fewer active merchants → Less revenue
→ Less investment → Worse product → Lower completion rate

**B1 (Support Pressure):**
More signups → More support tickets → Longer wait times
→ Worse experience → Lower completion rate → Fewer active users
→ Fewer support tickets

**Delay:**
Product improvements → [6-8 weeks to build] → Impact on completion rate

### Leverage Points:
1. **Onboarding completion rate** - affects both R1 and R2
2. **Self-serve help** - reduces B1 pressure without adding staff
3. **Time to first value** - if merchants see value faster,
   they complete onboarding despite friction

### Recommendation:
Focus on reducing "time to first value" - let merchants
experience the product before completing full onboarding.
This breaks the R2 death spiral and reinforces R1 growth.
```

**Output:** System map, identified loops, leverage points, recommendations

---

## When to Use Each Method

| Method | Best For | Time | Output |
|--------|----------|------|--------|
| **Five Whys** | Quick root cause for specific problem | 15-30 min | Root cause, actions |
| **Fishbone Diagram** | Comprehensive cause mapping | 45-60 min | Cause categories, priorities |
| **Is/Is Not** | Precise problem scoping | 30-45 min | Boundaries, hypotheses |
| **Systems Thinking** | Understanding complex dynamics | 1-2 hours | System map, leverage points |

**Typical Workflow:**
```
Is/Is Not (scope) -> Five Whys (depth) -> Fishbone (breadth) -> Systems Thinking (dynamics)
```

---

## Tips

**Five Whys:**
- Branch when there are multiple causes
- Stop when you reach something actionable
- Avoid "because humans make mistakes" (that's never the root cause)
- Always verify: "If we fix this, does the problem go away?"

**Fishbone Diagram:**
- Use the 6M categories as starting points, not rigid buckets
- Involve people from different roles (they see different causes)
- Mark causes that have evidence vs. speculation
- Prioritize by impact AND likelihood

**Is/Is Not:**
- The IS NOT column is just as important as IS
- Distinctions between IS and IS NOT reveal the cause
- Be very specific (dates, percentages, user segments)
- Test your hypotheses with data

**Systems Thinking:**
- Start simple, add complexity gradually
- Look for delays (they cause oscillation and overreaction)
- Find reinforcing loops (they cause exponential growth or decline)
- The best leverage point is often information flow (making the invisible visible)
