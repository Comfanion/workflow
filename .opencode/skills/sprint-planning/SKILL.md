---
name: sprint-planning
description: Organize epics and stories into sprint cycles, create sprint-status.yaml, and track sprint progress. Use when planning sprints, organizing backlog, estimating capacity, or when user mentions "sprint planning", "sprint organization", "backlog prioritization", or "sprint schedule". Requires epics to exist first.
license: MIT
compatibility: opencode
metadata:
  domain: agile
  artifacts: docs/sprint-artifacts/sprint-status.yaml
---

# Sprint Planning Skill

```xml
<sprint_planning>
  <prerequisites>
    <check>Epics must exist (backlog or sprint folders)</check>
    <if_missing>STOP → Run /epics first</if_missing>
    <command>ls docs/sprint-artifacts/backlog/epic-*.md</command>
  </prerequisites>
  
  <principle>Sprint = Scope for completing epic(s)</principle>
  
  <capacity_by_project_size>
    <TOY epics="2-3" result="Working app"/>
    <SMALL epics="1-2" result="Working features"/>
    <MEDIUM epics="1" result="Working module"/>
    <LARGE epics="1" result="Working domain"/>
    <ENTERPRISE epics="0.5" result="Working context"/>
  </capacity_by_project_size>
  
  <definition_of_done>
    <ALL>Works end-to-end, Tests pass, No bugs, Demo-ready</ALL>
    <SMALL_plus>+ Code review, Docs, Deployable</SMALL_plus>
    <MEDIUM_plus>+ Integration tests, Performance</MEDIUM_plus>
    <ENTERPRISE>+ Security review, Load tests</ENTERPRISE>
  </definition_of_done>
  
  <workflow>
    <step n="1">Read PRD → project size</step>
    <step n="2">List backlog epics → check dependencies</step>
    <step n="3">Define goal (what will be demo-ready)</step>
    <step n="4">Select epics (use capacity table)</step>
    <step n="5">Calculate capacity (T-shirt or points)</step>
    <step n="6">Set DoD</step>
    <step n="7">Move epics: backlog → sprint-N/</step>
    <step n="8">Update sprint-status.yaml</step>
  </workflow>
  
  <sprint_status_values>
    <planned>Sprint defined but not started</planned>
    <in_progress>Current sprint</in_progress>
    <completed>Sprint finished</completed>
  </sprint_status_values>
  
  <yaml_fields>
    <goal>What will be demo-ready</goal>
    <increment>What works end-to-end</increment>
    <capacity>1L epic or 34 pts</capacity>
    <definition_of_done>Array of DoD items</definition_of_done>
    <start_date>YYYY-MM-DD</start_date>
    <end_date>YYYY-MM-DD</end_date>
  </yaml_fields>
  
  <rules>
    <do>Select complete epic(s)</do>
    <do>Clear goal</do>
    <do>Plan 70-80% capacity</do>
    <dont>Partial epic</dont>
    <dont>Multiple incomplete epics</dont>
    <dont>Vague goal</dont>
  </rules>
  
  <output>docs/sprint-artifacts/sprint-status.yaml</output>
</sprint_planning>
```

---

## YAML Example

```yaml
sprint-1:
  status: in_progress
  goal: "Order Management works end-to-end"
  increment: "Users can create/view/update orders"
  capacity: "1L epic"  # or "34 pts" for ENTERPRISE
  definition_of_done:
    - "Works end-to-end (UI → API → DB)"
    - "Tests pass"
    - "Demo-ready"
  epics:
    - id: ORD-E01
      status: in_progress
```

See `template.yaml` for full format.
