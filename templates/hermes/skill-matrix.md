# Hermes skill → profile matrix

Profiles do not own skills; each profile installs the skills its job needs. After
`setup-team.sh` creates the profiles, add this repo as a tap and install per profile:

```bash
hermes skills tap add <git-url-of-this-repo>
hermes -p <profile> skills install <tap>/<skill>
```

Three skills are cross-cutting and belong on every profile that produces or executes work:
`using-comfanion` (the entry-point router), `verification-before-completion` (the completion
gate), and `systematic-debugging` (root-cause discipline). They are listed per profile below
rather than assumed.

| Profile | Skills |
|---------|--------|
| secretary | all skills (full library) — so it can act directly on trivial work instead of dispatching it |
| orchestrator | using-comfanion, orchestration, orchestration-team, orchestration-subagent, planning-squad, implementation-squad, code-review, verification-before-completion |
| analyst | using-comfanion, requirements-gathering, acceptance-criteria, security-requirements |
| pm | using-comfanion, prd-writing, decomposition, acceptance-criteria |
| architect | using-comfanion, system-architecture, service-architecture, adr-writing, api-design, database-design, unit-writing, standards, standards-coding, standards-testing, standards-security, standards-performance, standards-api, standards-database, standards-git, standards-temporary-decisions, using-standards, diagram-creation, threat-modeling, release-engineering |
| designer | using-comfanion, ux-design, design-system |
| devops | using-comfanion, release-engineering, verification-before-completion, systematic-debugging |
| backend-developer | using-comfanion, dev, code-review, receiving-code-review, test-design, test-scenarios, research-planning, systematic-debugging, verification-before-completion |
| frontend-developer | using-comfanion, dev, code-review, receiving-code-review, test-design, test-scenarios, research-planning, systematic-debugging, verification-before-completion |
| fullstack-developer | using-comfanion, dev, code-review, receiving-code-review, test-design, test-scenarios, research-planning, systematic-debugging, verification-before-completion |
| tester | using-comfanion, test-scenarios, test-execution, systematic-debugging, verification-before-completion |
| reviewer | using-comfanion, code-review (umbrella), review-security, review-correctness, review-tests, review-performance, review-complexity, verification-before-completion |
| researcher | using-comfanion, research-methodology, research-planning |

## Why these scopes

- **secretary** carries the full library so it can make trivial, direct, no-test edits
  (e.g. fix a PRD line) inline instead of paying a dispatch cycle. It still conducts
  rather than authors for anything substantial.
- **orchestrator** carries only orchestration + the review gate — it routes and gates,
  it does not author or implement.
- The role agents carry their authoring/execution skills, matching the phases they
  drive in `FLOW.yaml`.
- The cross-cutting trio (`using-comfanion`, `verification-before-completion`,
  `systematic-debugging`) is installed on the working profiles because the gate and the
  debugging discipline apply regardless of which phase a profile drives;
  `receiving-code-review` goes on the developer profiles, which are on the receiving end of
  the review gate. Hermes has no SessionStart hook, so `using-comfanion` is invoked as a
  normal skill rather than auto-surfaced.
