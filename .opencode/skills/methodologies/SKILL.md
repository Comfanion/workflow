---
name: methodologies
description: Apply analysis methodologies - Five Whys (root cause), Empathy Mapping (user feelings), Journey Mapping (user flow), Fishbone (cause-effect). Use when analyzing problems, understanding users, mapping journeys, or when user mentions "Five Whys", "root cause", "empathy map", "journey map", "user analysis", or "problem analysis".
license: MIT
compatibility: opencode
metadata:
  domain: analysis
  agents: [analyst, pm, architect, researcher]
---

# Methodologies Skill

```xml
<methodologies>
  <definition>Structured methods for requirements, analysis, problem-solving</definition>
  
  <categories>
    <empathize>Understand users → See [empathize.md](empathize.md)</empathize>
    <define>Frame problems → See [define.md](define.md)</define>
    <ideate>Generate solutions → See [ideate.md](ideate.md)</ideate>
    <diagnose>Find root causes → See [diagnose.md](diagnose.md)</diagnose>
    <evaluate>Make decisions (Decision Matrix)</evaluate>
  </categories>
  
  <by_agent>
    <analyst>User Interviews, Empathy Mapping, Journey Mapping, Five Whys, Fishbone</analyst>
    <pm>Problem Framing, HMW, POV Statement, JTBD, Brainstorming</pm>
    <architect>Systems Thinking, Fishbone, Is/Is Not, Decision Matrix</architect>
    <researcher>Five Whys, Systems Thinking, Is/Is Not</researcher>
  </by_agent>
  
  <quick_reference>
    <empathize>
      <user_interviews>Deep conversations → See [empathize.md](empathize.md)</user_interviews>
      <empathy_mapping>Says | Thinks | Does | Feels → See [empathize.md](empathize.md)</empathy_mapping>
      <journey_mapping>Awareness → Action → Use → Support → See [empathize.md](empathize.md)</journey_mapping>
    </empathize>
    
    <diagnose>
      <five_whys>Ask "Why?" 5 times → See [diagnose.md](diagnose.md)</five_whys>
      <fishbone>People | Process | Tech | Data | Env → See [diagnose.md](diagnose.md)</fishbone>
      <is_is_not>Define boundaries → See [diagnose.md](diagnose.md)</is_is_not>
      <systems_thinking>Feedback loops, leverage points → See [diagnose.md](diagnose.md)</systems_thinking>
    </diagnose>
    
    <define>
      <problem_framing>Transform observations into clear statements → See [define.md](define.md)</problem_framing>
      <hmw>How might we [action] for [user] so that [outcome]? → See [define.md](define.md)</hmw>
      <pov>[User] needs [what] because [insight] → See [define.md](define.md)</pov>
      <jtbd>When [situation], I want [motivation], so I can [outcome] → See [define.md](define.md)</jtbd>
      <affinity_clustering>Group observations to reveal patterns → See [define.md](define.md)</affinity_clustering>
    </define>
    
    <ideate>
      <brainstorming>Generate 50+ ideas without judgment → See [ideate.md](ideate.md)</brainstorming>
      <scamper>7 lenses: Substitute, Combine, Adapt, Modify, Purposes, Eliminate, Reverse → See [ideate.md](ideate.md)</scamper>
      <crazy_8s>8 sketches in 8 minutes → See [ideate.md](ideate.md)</crazy_8s>
      <provotypes>Extreme prototypes to challenge assumptions → See [ideate.md](ideate.md)</provotypes>
      <analogous_inspiration>Learn from other domains → See [ideate.md](ideate.md)</analogous_inspiration>
    </ideate>
    
    <evaluate>
      <decision_matrix>Criteria | Weight | Option A | Option B</decision_matrix>
    </evaluate>
  </quick_reference>
  
  <workflows>
    <requirements>User Interviews → Empathy Map → Journey Map → Requirements</requirements>
    <problem_definition>Five Whys → Fishbone → HMW → POV</problem_definition>
    <solution_generation>Brainstorming → SCAMPER → JTBD</solution_generation>
    <architecture>Systems Thinking → Is/Is Not → Decision Matrix → ADR</architecture>
  </workflows>
</methodologies>
```

---

## Detailed Guides

**For understanding users:**
- [empathize.md](empathize.md) - User Interviews, Empathy Mapping, Journey Mapping

**For framing problems:**
- [define.md](define.md) - Problem Framing, HMW, POV, JTBD, Affinity Clustering

**For generating solutions:**
- [ideate.md](ideate.md) - Brainstorming, SCAMPER, Crazy 8s, Provotypes, Analogous Inspiration

**For finding root causes:**
- [diagnose.md](diagnose.md) - Five Whys, Fishbone, Is/Is Not, Systems Thinking

---

## Quick Examples

### Five Whys
```
Problem: Users abandon checkout
1. Why? → Too long
2. Why? → Too many fields
3. Why? → Unnecessary data
4. Why? → No review process
5. Why? → No validation process
Root Cause: Missing validation process
```

### Empathy Map
```
User: Busy merchant
Says: "I don't have time"
Thinks: "Too complicated"
Does: Skips fields
Feels: Frustrated 😤
Insight: Values speed over completeness
```

### Journey Map
```
Awareness → Consideration → Action → Use → Support
   😊          😐           😤       😰      😌
```

For full details and more examples, see the detailed guides above.
