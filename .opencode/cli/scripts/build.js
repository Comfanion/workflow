#!/usr/bin/env node

/**
 * Build script for create-opencode-workflow
 * 
 * Copies .opencode/ files to cli/src/ for npm packaging.
 * Run before `npm publish`.
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLI_DIR = path.join(__dirname, '..');
const OPENCODE_SRC = path.join(CLI_DIR, '..'); // .opencode/
const DIST_DIR = path.join(CLI_DIR, 'src');

// Read version from package.json
const packageJson = await fs.readJson(path.join(CLI_DIR, 'package.json'));
const VERSION = packageJson.version;

// Files/folders to copy for .opencode/
const OPENCODE_ITEMS = [
  '.gitignore',
  'config.yaml',
  'FLOW.yaml',
  'ARCHITECTURE.md',
  'agents',
  'skills',
  'checklists',
  'commands',
  'mcp',
  'package.json',
  'opencode.json'
];

// Exclude from copying
const EXCLUDE = [
  'cli',
  'jira-cache.yaml',
  'jira-config.yaml',
  'USAGE-EXAMPLES.md',
  'CONSISTENCY-REPORT.md',
  'mcp/enabled.yaml'  // User config, not distributed
];

async function build() {
  console.log('🔨 Building create-opencode-workflow...\n');

  // Clean dist
  console.log('  Cleaning src/...');
  await fs.remove(DIST_DIR);
  await fs.ensureDir(DIST_DIR);

  // Create opencode subfolder
  const opencodeDir = path.join(DIST_DIR, 'opencode');
  await fs.ensureDir(opencodeDir);

  // Copy .opencode files
  console.log('  Copying .opencode/ files...');
  for (const item of OPENCODE_ITEMS) {
    const srcPath = path.join(OPENCODE_SRC, item);
    // npm ignores .gitignore in packages — rename to "gitignore" (no dot)
    // cli.js init will copy it back as ".gitignore"
    const destName = item === '.gitignore' ? 'gitignore' : item;
    const destPath = path.join(opencodeDir, destName);
    
    if (await fs.pathExists(srcPath)) {
      await fs.copy(srcPath, destPath);
      console.log(`    ✅ ${item}${destName !== item ? ` → ${destName}` : ''}`);
    } else {
      console.log(`    ⚠️  ${item} (not found, skipping)`);
    }
  }

  // Copy repo-structure templates
  console.log('\n  Copying repo-structure templates...');
  const repoStructureSrc = path.join(OPENCODE_SRC, 'skills', 'coding-standards', 'repo-structure');
  const repoStructureDest = path.join(DIST_DIR, 'repo-structure');
  
  if (await fs.pathExists(repoStructureSrc)) {
    await fs.copy(repoStructureSrc, repoStructureDest);
    console.log('    ✅ skills/coding-standards/repo-structure');
  } else {
    console.log('    ⚠️  skills/coding-standards/repo-structure (not found)');
  }

  // Remove internal repo-structure from opencode copy (it's in dist/repo-structure)
  const internalRepoStructure = path.join(opencodeDir, 'skills', 'coding-standards', 'repo-structure');
  if (await fs.pathExists(internalRepoStructure)) {
    await fs.remove(internalRepoStructure);
    console.log('    ✅ Removed duplicate repo-structure from skills/');
  }

  // Remove mcp/enabled.yaml (user config, not distributed)
  const mcpEnabledPath = path.join(opencodeDir, 'mcp', 'enabled.yaml');
  if (await fs.pathExists(mcpEnabledPath)) {
    await fs.remove(mcpEnabledPath);
    console.log('    ✅ Removed mcp/enabled.yaml (user config)');
  }

  // Create package info
  console.log('\n  Creating build info...');
  const buildInfo = {
    version: VERSION,
    buildDate: new Date().toISOString(),
    files: OPENCODE_ITEMS
  };
  await fs.writeJson(path.join(DIST_DIR, 'build-info.json'), buildInfo, { spaces: 2 });

  console.log('\n✅ Build complete!\n');
  console.log('📦 Ready for: npm publish\n');
  
  // Show structure
  console.log('📁 src/ structure:');
  console.log('  src/');
  console.log('  ├── opencode/         # .opencode files');
  console.log('  │   ├── config.yaml');
  console.log('  │   ├── FLOW.yaml');
  console.log('  │   ├── agents/');
  console.log('  │   ├── skills/');
  console.log('  │   ├── checklists/');
  console.log('  │   └── commands/');
  console.log('  ├── repo-structure/   # Repository templates');
  console.log('  └── build-info.json');
}

build().catch(err => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
