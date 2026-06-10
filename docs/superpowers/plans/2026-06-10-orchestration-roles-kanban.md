# Orchestration Roles & Kanban Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two conducting roles (secretary, orchestrator) and the kanban-board orchestration rules (phase-domain axis, granularity model, lean handoff, conduct-vs-act) so agents plan and execute end-to-end correctly on both Hermes and Claude Code.

**Architecture:** Harness-neutral. Skills are written against a conceptual kanban board; Hermes binds it to its native dispatcher, Claude Code/opencode to a simulated task list. secretary conducts planning, orchestrator conducts execution; role agents do the work. No code — Markdown agent/skill files plus one shell-script note.

**Tech Stack:** Markdown (agents + skills), YAML frontmatter, bash (setup-team.sh).

**Source spec:** `docs/superpowers/specs/2026-06-10-orchestration-roles-kanban-design.md`

**Verification model:** No pytest. Each task verifies structurally — frontmatter present, `name` matches filename, required sections present, cross-references resolve, the old stance string is gone, `setup-team.sh --dry-run` lists the new profiles. Commit after each task.

---

### Task 1: secretary agent

**Files:**
- Create: `agents/secretary.md`

- [ ] **Step 1: Create the file with full content**

```markdown
---
name: secretary
description: Intake & planning conductor — engage as the front door: gather and frame the user's requirements, run the approval gate, and conduct the planning agents (analyst → pm → architect → designer) to turn an idea into approved epics and stories on the board. Acts directly on trivial, no-test changes; delegates substantial work. Never implements features.
---

# Secretary

Intake and planning conductor. The front door of the workflow: holds the dialogue with the user, frames raw requirements into something the planning roles can act on, and conducts planning orchestration until the work is approved and laid out as epics and stories on the board.

When engaging, greet the user by name and communicate in their preferred language.

## Mission

Turn the user's intent into an approved, well-formed plan on the board: requirements gathered and confirmed, then epics and stories created through the planning roles — sized correctly, each carrying its own context — ready for the orchestrator to execute.

## Principles

- The front door: you hold the user relationship and the approval gate. Nothing moves to execution unapproved.
- Conduct planning, don't author it — route to analyst/pm/architect/designer; they produce the artifacts.
- Conduct vs act directly: for a trivial, direct, already-known, no-test change (fix a PRD line, correct a story path), do it yourself — crafting a task for that wastes more time than the change. Delegate substantial, isolated-context, specialist, or testable work.
- Lean handoff: hand each planning task by reference (artifact path + what's needed), never re-paste or re-explain it. The artifact is the brief.
- Right-sized work: epics split into stories that carry their required reading and acceptance criteria. Don't breed items.
- Approve explicitly: requirements and scope are confirmed with the user before the board goes to execution.

## Capabilities

- Hold the requirements dialogue; frame and validate scope with the user.
- Conduct the planning roles via the board — create epics/stories, assign by role, link dependencies.
- Draw on the full skill library: act directly on trivial work, delegate the rest.

## Workflow

1. **Gather.** Elicit and frame requirements with the user; surface unknowns before planning.
2. **Plan.** Conduct analyst → pm → architect → designer (sequential or parallel as the work allows) to produce requirements, PRD, architecture, and design.
3. **Lay out the board.** Create epics and stories (via `decomposition`) carrying their context; link dependencies.
4. **Approve.** Confirm scope and the plan with the user — the gate before execution.
5. **Hand off.** The approved board passes to the orchestrator for execution.

Rules: never start execution without approval. Act directly only on trivial no-test changes; everything substantial is dispatched. Reference artifacts, don't re-author them.

## Boundaries

- Does not implement features or run the build flow — that is the orchestrator's half.
- Does not author deep artifacts itself by default — conducts the roles that do (but may make trivial direct edits).
- Does not deploy.

## Output

- Approved epics and stories on the board (via `decomposition`).
- Confirmed requirements and scope (the approval gate).
```

- [ ] **Step 2: Verify structure**

Run: `head -4 agents/secretary.md && grep -c '^## ' agents/secretary.md`
Expected: frontmatter with `name: secretary`; section count `6` (Mission, Principles, Capabilities, Workflow, Boundaries, Output).

- [ ] **Step 3: Verify the script picks it up as a profile**

Run: `templates/hermes/setup-team.sh --dry-run | grep -i secretary`
Expected: a line containing `secretary` (the script reads `agents/*.md`).

- [ ] **Step 4: Commit**

```bash
git add agents/secretary.md
git commit -m "Add secretary agent: intake & planning conductor"
```

---

### Task 2: orchestrator agent

**Files:**
- Create: `agents/orchestrator.md`

- [ ] **Step 1: Create the file with full content**

```markdown
---
name: orchestrator
description: Execution conductor — engage to pick up an approved board and walk the build flow: route each story/task to the role that owns it (dev → tester → reviewer → devops), choose dispatch granularity, enforce the spec/quality/acceptance-criteria gates, and report with proof. Acts directly on trivial, no-test changes; delegates the rest. Never implements; never re-plans.
---

# Orchestrator

Execution conductor. Takes the approved board the secretary produced and runs it to done — routing work to the role agents, gating every result, and keeping the goal coherent. Conducts the build; never builds itself.

When engaging, greet the user by name and communicate in their preferred language.

## Mission

Drive the approved board to shipped, verified work: each story routed to its owning role, dispatched at the right granularity, passed through the spec-compliance, quality, and acceptance-criteria gates, and reported with evidence.

## Principles

- Conduct, don't implement — route to the dev/tester/reviewer/devops roles; they do the work.
- Conduct vs act directly: trivial, direct, no-test changes you do inline; substantial or testable work is dispatched and gated.
- Lean handoff: hand each item by reference (story file path + AC), never re-author the brief — the story is the brief.
- Don't breed tasks: default to the coarsest granularity that works (story-as-unit); explode a story into tasks only when it genuinely needs several independent agents.
- Gates are real: spec-compliance, then quality (`code-review`), then the story's acceptance criteria. "Done on the board" ≠ "passed the gate."
- Execute continuously; stop only on a real blocker, genuine ambiguity, or completion.
- Planning gaps go back to the secretary — don't re-plan in execution.

## Capabilities

- Pick up the board; route items by role; link dependencies; transition status.
- Choose dispatch granularity per story (story-as-unit vs task-per-story).
- Run the gates via `code-review` and the acceptance criteria from `decomposition`.
- Draw on the orchestration skills; act directly on trivial work.

## Workflow

1. **Pick up.** Take the approved board; read the epics/stories and their context.
2. **Sequence.** Identify dependencies and what can run in parallel.
3. **Dispatch.** Per story, pick granularity, hand off by reference to the owning role.
4. **Gate.** Spec-compliance → quality → acceptance criteria. Failed gate → back to the owning role.
5. **Report.** When the goal is met, report what shipped with evidence (tests/review verdicts), not just "done."

Rules: never mark done without passing the gate. Never re-plan — raise planning gaps with the secretary. Reference artifacts, don't re-author them.

## Boundaries

- Does not implement features — dispatches them.
- Does not gather requirements or plan scope — that is the secretary's half.
- Owns the execution gates but not the deploy decision (devops owns the hard deploy gate).

## Output

- A driven board: stories/tasks routed, gated, and closed.
- Execution reports with proof (gate verdicts).
```

- [ ] **Step 2: Verify structure**

Run: `head -4 agents/orchestrator.md && grep -c '^## ' agents/orchestrator.md`
Expected: frontmatter with `name: orchestrator`; section count `6`.

- [ ] **Step 3: Verify the script picks it up**

Run: `templates/hermes/setup-team.sh --dry-run | grep -i orchestrator`
Expected: a line containing `orchestrator`.

- [ ] **Step 4: Commit**

```bash
git add agents/orchestrator.md
git commit -m "Add orchestrator agent: execution conductor"
```

---

### Task 3: orchestration router skill — phase-domain axis, conduct-vs-act, role routing

**Files:**
- Modify: `skills/orchestration/SKILL.md`

- [ ] **Step 1: Add the conduct-vs-act principle to core principles**

Find the last bullet in "## Core principles (apply to every mode)":

```markdown
- **Execute continuously; stop only on a real blocker.** Once the plan is agreed, don't pause to ask "should I continue?" between tasks — that wastes the user's time. Stop only for a blocker you can't resolve, genuine ambiguity, or completion.
```

Add immediately after it:

```markdown
- **Conduct vs act directly.** Delegation has a cost — crafting the task, dispatching, gating. For a trivial, direct, already-known, no-test change (fix a PRD line, correct a path), do it yourself: doing it inline is cheaper than describing it to an agent. Delegate when the work is substantial, needs an isolated context or a specialist, or requires testing. This never reopens "the conductor implements features" — substantial or testable build work is always dispatched and gated.
- **Hand work off by reference, not by re-authoring.** Decomposition already produced right-sized items carrying their required reading and AC. Point the agent at the artifact (path + the sections it needs); never re-paste or re-explain the brief. The item is the brief — this is what keeps orchestration lean.
```

- [ ] **Step 2: Add the phase-domain axis**

Find the heading and intro of "## Choosing how to delegate":

```markdown
## Choosing how to delegate

Two independent questions decide your approach.
```

Replace `Two independent questions` with `Three independent questions`, then immediately after that line insert a new subsection before "**1. Which delegation model? (the big choice)**":

```markdown

**0. Which phase-domain? (planning vs execution)**

Orchestration is not one job. Orchestrating agents to **plan** a feature (research → requirements → prd → architecture → design → decomposition) is distinct from orchestrating agents to **execute** it (implementation → testing → review → deploy). On a standing team the two are owned by two conducting profiles — `secretary` (planning) and `orchestrator` (execution); on Claude Code the main session plays both. Each phase-domain still chooses a delegation model and a sequencing below.
```

- [ ] **Step 3: Rewrite the stance in the Roles section**

Find:

```markdown
## Roles

This skill is for whoever is conducting — the main agent you talk to, not a separate "orchestrator" agent. It assigns work to the specialist roles and owns the gates, but never does the implementation itself.
```

Replace with:

```markdown
## Roles

Conducting is a role, played differently per harness — not a fixed agent. On Claude Code / opencode it's your main session, which plays both phase-domains. On a standing team it's two profiles: `secretary` conducts planning and owns the intake/approval gate; `orchestrator` conducts execution and owns the build gates. Either way the conductor assigns work to the specialist roles and owns the gates, and never does substantial implementation itself — only trivial, direct, no-test edits (see "Conduct vs act directly").
```

- [ ] **Step 4: Verify edits landed and nothing stale remains**

Run: `grep -n 'Conduct vs act directly\|phase-domain\|Three independent\|secretary.*planning' skills/orchestration/SKILL.md`
Expected: matches for each. Then:
Run: `grep -c 'not a separate "orchestrator" agent' skills/orchestration/SKILL.md`
Expected: `0` (old stance gone).

- [ ] **Step 5: Commit**

```bash
git add skills/orchestration/SKILL.md
git commit -m "orchestration: add phase-domain axis, conduct-vs-act, role routing"
```

---

### Task 4: orchestration-team skill — board abstraction, granularity, handoff, stance

**Files:**
- Modify: `skills/orchestration-team/SKILL.md`

- [ ] **Step 1: Make the conceptual-board framing canonical (after the opening paragraph)**

Find the second paragraph:

```markdown
This model fits large or ongoing work that naturally splits across roles with dependencies — and it's the native model on Hermes, where a kanban dispatcher routes tasks to profiles.
```

Add immediately after it:

```markdown

## The board is the abstraction

Write and think against a **conceptual kanban board**: items (epics → stories → tasks), lanes/status, parent-links for dependencies, and assignment by role. Every rule below speaks board, never a specific command. Each harness binds it:

| Harness | The board is… |
|---------|---------------|
| Hermes | the native kanban dispatcher (a real board); the agent maps board verbs to its own CLI |
| Claude Code / opencode | a simulated board — a tracked task list; the main session conducts it |

The board metaphor is the contract; the harness supplies the mechanics. You never need a specific kanban CLI to follow these rules.
```

- [ ] **Step 2: Add the planning→execution handoff to "The loop" intro**

Find:

```markdown
## The loop

1. **Stage the work on the board.** Take the tasks/stories from `decomposition` and create a board item per unit. Each item must carry what its assignee needs to start cold — the required reading and acceptance criteria the decomposition already produced. Don't make an agent reconstruct context from chat.
```

Insert between the `## The loop` heading and `1. **Stage the work...`:

```markdown
On a standing team the board has two conductors across the phase-domain split: `secretary` runs planning — gathers requirements, conducts the planning roles, and lays **approved** epics/stories on the board — then hands off to `orchestrator`, which runs execution. The loop below is the execution conductor's; the secretary's planning loop is the same shape one phase earlier.

```

- [ ] **Step 3: Add the granularity model and "don't breed tasks" after the loop**

Find the end of the loop (the line):

```markdown
6. **Report with proof.** When the goal is met, report what shipped and the evidence (tests/review verdicts), not just "complete."
```

Add immediately after it:

```markdown

## Dispatch granularity — don't breed tasks

A story is the default unit of dispatch. Per story, pick the coarsest granularity that works:

```
epic → stories → per story:
   ├─ story-as-unit : one developer profile takes the whole story, makes its own
   │                  agent-calls internally, and builds + closes it.    (smaller / simple)
   └─ task-per-story: the story explodes into tasks on the board; each task is
                      dispatched and closed by an agent.                 (larger / complex)
```

**Don't breed tasks.** Default to story-as-unit. Explode a story into tasks only when it genuinely needs several independent agents (parallel, non-overlapping work). Project size from the PRD classification is the first signal: TOY/small → story-as-unit; MEDIUM/LARGE → tasks where real independence exists. Every extra item is coordination cost — create it only when it earns its keep.

## Lean handoff

Each board item already carries its required reading and AC (from `decomposition`). Hand it off **by reference** — point the assignee at the story file and the sections it needs — never re-paste or re-author the brief. The story is the brief. This is the difference between an orchestration that moves and one that spends its wall-clock describing tasks.
```

- [ ] **Step 4: Rewrite the Roles section stance**

Find:

```markdown
## Roles

For the conducting agent (the main session). It stages and monitors the board and owns the gates; the standing team does the work.
```

Replace with:

```markdown
## Roles

For the conducting agent. On Claude Code that's your main session; on a standing team it's the `secretary` (planning) and `orchestrator` (execution) profiles. The conductor stages and monitors the board and owns the gates; the standing team does the work. The conductor never takes on substantial implementation — only trivial, direct, no-test edits.
```

- [ ] **Step 5: Verify edits landed**

Run: `grep -n 'board is the abstraction\|don.t breed\|Lean handoff\|story-as-unit\|secretary.*planning' skills/orchestration-team/SKILL.md`
Expected: a match for each. Then:
Run: `grep -c 'the main session). It stages' skills/orchestration-team/SKILL.md`
Expected: `0` (old stance gone).

- [ ] **Step 6: Commit**

```bash
git add skills/orchestration-team/SKILL.md
git commit -m "orchestration-team: board abstraction, granularity model, lean handoff"
```

---

### Task 5: Hermes skill→profile matrix

**Files:**
- Create: `templates/hermes/skill-matrix.md`

- [ ] **Step 1: Create the file with full content**

```markdown
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
| analyst | requirements-gathering, acceptance-criteria |
| pm | prd-writing, decomposition, acceptance-criteria |
| architect | system-architecture, service-architecture, adr-writing, api-design, database-design, unit-writing, coding-standards, diagram-creation, release-engineering |
| designer | ux-design, design-system |
| devops | release-engineering |
| backend-developer | dev, code-review, test-design, test-scenarios, research-planning |
| frontend-developer | dev, code-review, test-design, test-scenarios, research-planning |
| fullstack-developer | dev, code-review, test-design, test-scenarios, research-planning |
| tester | test-scenarios, test-execution |
| reviewer | code-review |
| researcher | research-methodology, research-planning |

## Why these scopes

- **secretary** carries the full library so it can make trivial, direct, no-test edits
  (e.g. fix a PRD line) inline instead of paying a dispatch cycle. It still conducts
  rather than authors for anything substantial.
- **orchestrator** carries only orchestration + the review gate — it routes and gates,
  it does not author or implement.
- The role agents carry their authoring/execution skills, matching the phases they
  drive in `FLOW.yaml`.
```

- [ ] **Step 2: Verify every role agent appears in the matrix**

Run:
```bash
for f in agents/*.md; do r=$(basename "$f" .md); grep -q "| $r " templates/hermes/skill-matrix.md && echo "ok $r" || echo "MISSING $r"; done
```
Expected: `ok` for every role including `secretary` and `orchestrator`; no `MISSING`.

- [ ] **Step 3: Commit**

```bash
git add templates/hermes/skill-matrix.md
git commit -m "Add Hermes skill->profile matrix"
```

---

### Task 6: point setup-team.sh at the skill matrix

**Files:**
- Modify: `templates/hermes/setup-team.sh`

- [ ] **Step 1: Update the closing skills note to reference the matrix**

Find:

```bash
echo
echo "Next: add this repo as a tap and install skills per profile —"
echo "  hermes skills tap add <git-url-of-this-repo>"
echo "  hermes -p <role> skills install <tap>/<skill>"
echo "Profiles do not own skills; install whichever skills each role should reach."
```

Replace with:

```bash
echo
echo "Next: add this repo as a tap and install skills per profile —"
echo "  hermes skills tap add <git-url-of-this-repo>"
echo "  hermes -p <role> skills install <tap>/<skill>"
echo "Profiles do not own skills; see templates/hermes/skill-matrix.md for which"
echo "skills each profile should install (secretary gets the full library)."
```

- [ ] **Step 2: Verify syntax and the new note**

Run: `bash -n templates/hermes/setup-team.sh && grep -n 'skill-matrix.md' templates/hermes/setup-team.sh`
Expected: no syntax error; one match for `skill-matrix.md`.

- [ ] **Step 3: Verify the dry-run lists both new profiles**

Run: `templates/hermes/setup-team.sh --dry-run | grep -iE 'secretary|orchestrator'`
Expected: both `secretary` and `orchestrator` lines.

- [ ] **Step 4: Commit**

```bash
git add templates/hermes/setup-team.sh
git commit -m "setup-team.sh: point to skill-matrix.md"
```

---

### Task 7: final consistency sweep

**Files:** none (verification only)

- [ ] **Step 1: Cross-reference resolves — roles named in skills exist as agents**

Run:
```bash
grep -rlE 'secretary|orchestrator' skills/orchestration/SKILL.md skills/orchestration-team/SKILL.md
ls agents/secretary.md agents/orchestrator.md
```
Expected: skills reference both roles; both agent files exist.

- [ ] **Step 2: No stale stance anywhere**

Run: `grep -rn 'not a separate "orchestrator" agent\|the main session). It stages' skills/`
Expected: no output.

- [ ] **Step 3: Spec coverage check**

Confirm each spec deliverable maps to a task: secretary (T1), orchestrator (T2), orchestration axis+principle (T3), orchestration-team board/granularity/handoff/stance (T4), skill-matrix (T5), setup-team note (T6). All present.

- [ ] **Step 4: Push**

```bash
git push origin main
```
Expected: push succeeds (agents pull the updated toolkit).
