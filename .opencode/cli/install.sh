#!/bin/bash

# OpenCode Workflow Installer
# Usage: curl -fsSL https://gitlab.com/comfanion/workflow/-/raw/main/cli/install.sh | bash

set -e

REPO_URL="https://gitlab.com/comfanion/workflow"
BRANCH="main"
TARGET_DIR=".opencode"

echo "🚀 OpenCode Workflow v3.0 Installer"
echo ""

# Check if .opencode already exists
if [ -d "$TARGET_DIR" ]; then
    echo "⚠️  .opencode/ already exists"
    read -p "Overwrite? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Cancelled."
        exit 1
    fi
    rm -rf "$TARGET_DIR"
fi

echo "📦 Downloading..."

# Download and extract from GitLab
ARCHIVE_URL="$REPO_URL/-/archive/$BRANCH/workflow-$BRANCH.tar.gz"

if command -v curl &> /dev/null; then
    curl -fsSL "$ARCHIVE_URL" | tar -xz --strip-components=1 -C . "workflow-$BRANCH/.opencode"
elif command -v wget &> /dev/null; then
    wget -qO- "$ARCHIVE_URL" | tar -xz --strip-components=1 -C . "workflow-$BRANCH/.opencode"
else
    echo "❌ curl or wget required"
    exit 1
fi

# Create docs structure
mkdir -p docs/sprint-artifacts/backlog
mkdir -p docs/requirements
mkdir -p docs/architecture/adr
mkdir -p docs/architecture/diagrams
mkdir -p docs/api
mkdir -p docs/coding-standards
mkdir -p docs/confluence

# Create CHANGELOG.md if not exists
if [ ! -f "CHANGELOG.md" ]; then
    cp "$TARGET_DIR/templates/CHANGELOG.md" ./CHANGELOG.md 2>/dev/null || true
fi

echo ""
echo "✅ OpenCode Workflow installed!"
echo ""
echo "📁 Created:"
echo "   .opencode/          - Workflow system"
echo "   docs/               - Documentation (English)"
echo "   docs/confluence/    - Translated docs (Ukrainian)"
echo ""
echo "🎯 Next steps:"
echo "   1. Edit .opencode/config.yaml"
echo "   2. Start with /requirements or /prd"
echo ""
echo "💡 Or use NPX for interactive setup:"
echo "   npx create-opencode-workflow init"
echo ""
