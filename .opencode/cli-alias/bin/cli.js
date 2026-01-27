#!/usr/bin/env node

/**
 * create-opencode-workflow
 * Alias for @comfanion/workflow
 * 
 * Usage: npx create-opencode-workflow init
 */

import { spawn } from 'child_process';

// Run npx @comfanion/workflow with all arguments
const child = spawn('npx', ['@comfanion/workflow', ...process.argv.slice(2)], {
  stdio: 'inherit',
  cwd: process.cwd(),
  shell: true
});

child.on('exit', (code) => process.exit(code || 0));
