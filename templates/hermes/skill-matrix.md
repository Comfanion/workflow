# Hermes skill → profile matrix

Profiles do not own skills; each profile installs the skills its job needs. After
`setup-team.sh` creates the profiles, add this repo as a tap and install per profile:

```bash
hermes skills tap add <git-url-of-this-repo>
hermes -p <profile> skills install <tap>/<skill>
```

| Profile | Skills |
|---------|--------|
| secretary | all skills (full library) — so it can act directly on trivial work instead of dispatching it |
| orchestrator | orchestration, orchestration-team, orchestration-subagent, code-review |
| analyst | requirements-gathering, acceptance-criteria, security-requirements |
| pm | prd-writing, decomposition, acceptance-criteria |
| architect | system-architecture, service-architecture, adr-writing, api-design, database-design, unit-writing, coding-standards, diagram-creation, threat-modeling, release-engineering |
| designer | ux-design, design-system |
| devops | release-engineering |
| backend-developer | dev, code-review, test-design, test-scenarios, research-planning |
| frontend-developer | dev, code-review, test-design, test-scenarios, research-planning |
| fullstack-developer | dev, code-review, test-design, test-scenarios, research-planning |
| tester | test-scenarios, test-execution |
| reviewer | code-review (umbrella), review-security, review-correctness, review-tests, review-performance, review-complexity |
| researcher | research-methodology, research-planning |

## Why these scopes

- **secretary** carries the full library so it can make trivial, direct, no-test edits
  (e.g. fix a PRD line) inline instead of paying a dispatch cycle. It still conducts
  rather than authors for anything substantial.
- **orchestrator** carries only orchestration + the review gate — it routes and gates,
  it does not author or implement.
- The role agents carry their authoring/execution skills, matching the phases they
  drive in `FLOW.yaml`.
