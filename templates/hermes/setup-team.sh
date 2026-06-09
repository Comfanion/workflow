#!/usr/bin/env bash
# setup-team.sh — create Hermes profiles from this toolkit's agent roles.
#
# Hermes profiles are host-side CLI objects (`hermes profile create`); they are
# NOT installed by a skill tap. This script reads agents/*.md and creates one
# profile per role so the kanban dispatcher can route work to them.
#
# Skills reach the profiles separately: add this repo as a tap and install the
# skills you want per profile —
#   hermes skills tap add <git-url-of-this-repo>
#   hermes -p <role> skills install <tap>/<skill>     # e.g. dev -> dev, code-review
#
# Usage:
#   templates/hermes/setup-team.sh            # create all role profiles
#   templates/hermes/setup-team.sh --dry-run  # print the commands only
set -euo pipefail

REPO="$(cd "$(dirname "$0")/../.." && pwd)"
AGENTS_DIR="$REPO/agents"
DRY="${1:-}"

[ -d "$AGENTS_DIR" ] || { echo "no agents/ dir at $AGENTS_DIR" >&2; exit 1; }

run() { if [ "$DRY" = "--dry-run" ]; then echo "  $*"; else "$@"; fi; }

echo "Creating Hermes profiles from $AGENTS_DIR:"
for f in "$AGENTS_DIR"/*.md; do
  role="$(basename "$f" .md)"
  # Pull the one-line description from the frontmatter `description:` field.
  desc="$(grep -m1 '^description:' "$f" | sed 's/^description:[[:space:]]*//' | cut -c1-200)"
  [ -n "$desc" ] || desc="$role role"
  echo "- $role"
  run hermes profile create "$role" --description "$desc"
done

echo
echo "Next: add this repo as a tap and install skills per profile —"
echo "  hermes skills tap add <git-url-of-this-repo>"
echo "  hermes -p <role> skills install <tap>/<skill>"
echo "Profiles do not own skills; install whichever skills each role should reach."
