#!/usr/bin/env bash
# verify-plugin-structure.sh — integrity check for the cross-harness plugin layout.
# Run after any change to plugin manifests, hooks, or symlinks. Used by:
#   - .githooks/pre-commit (when plugin files are staged)
#   - .github/workflows/enforce.yml (on every PR)
#   - docs/plugin-architecture.md (the canonical reference)
#
# Exit non-zero on any failure so pre-commit blocks the commit and CI blocks the merge.
set -euo pipefail

cd "$(git rev-parse --show-toplevel 2>/dev/null || echo ".")"

errors=0
fail() { echo "✗ $*" >&2; errors=$((errors + 1)); }
ok()   { echo "✓ $*"; }

# --- Root manifests (every harness needs these) ---
[[ -f .claude-plugin/marketplace.json ]] && ok ".claude-plugin/marketplace.json" || fail "missing .claude-plugin/marketplace.json"
[[ -f .claude-plugin/plugin.json     ]] && ok ".claude-plugin/plugin.json"     || fail "missing .claude-plugin/plugin.json"
[[ -f .codex-plugin/plugin.json      ]] && ok ".codex-plugin/plugin.json"      || fail "missing .codex-plugin/plugin.json"
[[ -f gemini-extension.json          ]] && ok "gemini-extension.json"          || fail "missing gemini-extension.json"
[[ -f GEMINI.md                      ]] && ok "GEMINI.md"                      || fail "missing GEMINI.md"

# --- Codex plugin manifest MUST include a hooks field ---
if [[ -f .codex-plugin/plugin.json ]]; then
  if grep -q '"hooks"' .codex-plugin/plugin.json; then
    ok ".codex-plugin/plugin.json has hooks field"
  else
    fail ".codex-plugin/plugin.json missing hooks field — Codex will not load hooks"
  fi
fi

# --- Subdirectory plugin (Codex) — thin shell with symlinks, never copies ---
[[ -d plugins/comfanion/.claude-plugin ]] && ok "plugins/comfanion/.claude-plugin/" || fail "missing plugins/comfanion/.claude-plugin/"
[[ -d plugins/comfanion/.codex-plugin  ]] && ok "plugins/comfanion/.codex-plugin/"  || fail "missing plugins/comfanion/.codex-plugin/"

for link in agents hooks skills; do
  target="plugins/comfanion/$link"
  if [[ -L "$target" ]]; then
    actual="$(readlink "$target")"
    if [[ "$actual" == "../../$link" ]]; then
      ok "plugins/comfanion/$link -> $actual (symlink intact)"
    else
      fail "plugins/comfanion/$link symlink points to '$actual', expected '../../$link'"
    fi
  elif [[ -e "$target" ]]; then
    fail "plugins/comfanion/$link is a real directory/file, not a symlink — single-source violation (see docs/plugin-architecture.md §8)"
  else
    fail "missing plugins/comfanion/$link (expected symlink)"
  fi
done

# --- Shared content (single source — never duplicated) ---
[[ -d skills ]] && [[ $(ls skills/ | wc -l) -gt 50 ]] && ok "skills/ ($(ls skills/ | wc -l) skills)" || fail "skills/ missing or unexpectedly small"
[[ -d agents ]] && [[ $(ls agents/ | wc -l) -gt 10 ]] && ok "agents/ ($(ls agents/ | wc -l) roles)"  || fail "agents/ missing or unexpectedly small"
[[ -f hooks/hooks.json     ]] && ok "hooks/hooks.json"     || fail "missing hooks/hooks.json"
[[ -f hooks/session-start  ]] && ok "hooks/session-start"  || fail "missing hooks/session-start"
[[ -f hooks/run-hook.cmd   ]] && ok "hooks/run-hook.cmd"   || fail "missing hooks/run-hook.cmd"

# --- Workflow control files at root (not under docs/) ---
[[ -f FLOW.yaml           ]] && ok "FLOW.yaml"           || fail "missing FLOW.yaml"
[[ -f project-state.yaml  ]] && ok "project-state.yaml"  || fail "missing project-state.yaml (should be at root, not docs/)"
[[ -f protected.yaml      ]] && ok "protected.yaml"      || fail "missing protected.yaml (P4 policy)"

# --- Cross-harness variable detection in session-start ---
if [[ -f hooks/session-start ]]; then
  grep -q 'CLAUDE_PLUGIN_ROOT' hooks/session-start && ok "session-start detects CLAUDE_PLUGIN_ROOT" || fail "session-start missing CLAUDE_PLUGIN_ROOT detection"
  grep -q 'PLUGIN_ROOT'        hooks/session-start && ok "session-start detects PLUGIN_ROOT"        || fail "session-start missing PLUGIN_ROOT detection"
fi

# --- Workflow control files must NOT be under docs/ (pipeline output dir) ---
for f in docs/FLOW.yaml docs/project-state.yaml docs/protected.yaml; do
  [[ -e "$f" ]] && fail "$f must not live under docs/ — workflow control files belong at repo root" || :
done

echo ""
if (( errors > 0 )); then
  echo "FAIL: $errors problem(s) found. See docs/plugin-architecture.md."
  exit 1
fi
echo "PASS: plugin structure intact."
