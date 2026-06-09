# opencode

This toolkit grew out of opencode, so the skills and agents use opencode-friendly
conventions. The `skills/` and `agents/` here are symlinks to the repo root (the
single source), so opencode discovery under `.opencode/` resolves to the same files
every other harness uses.

Status: best-effort. The toolkit's active targets are Claude Code and Hermes; opencode
loading via these symlinks has not been re-verified after the flatten. If opencode does
not pick the skills up through the symlinks, point its skills/agents paths directly at
the repo's root `skills/` and `agents/`, or copy them into your project's `.opencode/`.

Note: the old `.opencode/config.yaml`, `FLOW.yaml` plumbing and the `@comfanion/workflow`
CLI were removed in the revival — this repo is now a flat, harness-neutral skills+agents
library, not an opencode-only package.
