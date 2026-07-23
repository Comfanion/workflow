# Security Policy

## Scope

`comfanion/workflow` is a **markdown skills library** — it ships procedures that
AI agents read, not runtime software. The realistic attack surface is narrow:

| In scope | Out of scope |
|----------|--------------|
| Malicious skill content that turns a procedure into a prompt-injection or data-exfiltration vector (e.g. a `SKILL.md` instructing the agent to post secrets somewhere) | Vulnerabilities in AI harnesses themselves (Claude Code, Codex, opencode, Hermes, Gemini CLI) — report those to the harness vendor |
| Supply-chain risk in the plugin packaging: a symlinked manifest in `plugins/`, `.claude-plugin/`, `.codex-plugin/`, `.opencode/`, or `gemini-extension.json` pointing outside the repo or to an attacker-controlled path | "An agent following a skill did something I did not expect on my machine" — that is the harness's permission model, not this project |
| Compromised release artifacts (a tag moved, a commit force-pushed) | Theoretical harms from an agent executing *correctly written* skills |

If you are unsure whether something is in scope, report it anyway — every
report is triaged.

## Reporting a Vulnerability

**Please do NOT open a public GitHub issue for security reports.**

Use one of these private channels:

1. **Preferred — GitHub Private Security Advisory.** On the repo page
   (`https://github.com/Comfanion/workflow`), click the *Security* tab →
   *Report a vulnerability*. This opens a private thread visible only to
   maintainers. The maintainer must enable this under **Settings → Code
   security and analysis → Private vulnerability reporting** — if the button
   is absent, use the email fallback below.
2. **Fallback — email.** If the advisory flow is unavailable, email the
   maintainer directly. (Contact to be confirmed — see TODO below.)

<!-- TODO(maintainer): insert a real private contact email or confirm the
     GitHub Security Advisory flow is the sole channel. -->

Include, where applicable:

- Which file / skill / packaging path is affected
- A minimal description of the attack vector (what an agent or consumer would
  be tricked into doing)
- Suggested fix, if you have one

## Response Timeline

| Step | Target |
|------|--------|
| Acknowledge receipt | within 72 hours |
| Initial assessment + severity | within 7 days |
| Fix or mitigation | depends on severity — communicated in the assessment |
| Public disclosure | after a fix is released, coordinated with the reporter |

## Supported Versions

Only the **latest major version** receives security fixes. The project follows
Semantic Versioning; see `CHANGELOG.md` for the current version line.

## Disclosure Policy

**Coordinated disclosure** is preferred: the reporter and maintainer agree on a
publication date after a fix is available. Reporters are credited in the
release notes unless they prefer to remain anonymous.
