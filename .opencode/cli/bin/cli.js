#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import yaml from 'js-yaml';

/**
 * Find top-level keys that exist in newObj but not in oldObj
 */
function findNewKeys(newObj, oldObj, prefix = '') {
  const newKeys = [];
  for (const key of Object.keys(newObj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (!(key in oldObj)) {
      newKeys.push(fullKey);
    } else if (
      newObj[key] !== null && typeof newObj[key] === 'object' && !Array.isArray(newObj[key]) &&
      oldObj[key] !== null && typeof oldObj[key] === 'object' && !Array.isArray(oldObj[key])
    ) {
      newKeys.push(...findNewKeys(newObj[key], oldObj[key], fullKey));
    }
  }
  return newKeys;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_DIR = path.join(__dirname, '..');
const OPENCODE_SRC = path.join(PACKAGE_DIR, 'src', 'opencode');
const REPO_TEMPLATES_SRC = path.join(PACKAGE_DIR, 'src', 'repo-structure');
const VECTORIZER_SRC = path.join(PACKAGE_DIR, 'src', 'vectorizer');

// Read version from package.json
const packageJson = JSON.parse(fs.readFileSync(path.join(PACKAGE_DIR, 'package.json'), 'utf8'));
const VERSION = packageJson.version;

/**
 * Install vectorizer module with dependencies
 */
async function installVectorizer(opencodeDir) {
  console.log('');
  const spinner = ora('Installing vectorizer & caching...').start();
  
  try {
    const vectorizerDir = path.join(opencodeDir, 'vectorizer');
    
    // Copy vectorizer source files
    spinner.text = 'Copying vectorizer files...';
    await fs.ensureDir(vectorizerDir);
    await fs.copy(VECTORIZER_SRC, vectorizerDir);
    
    // Run npm install
    spinner.text = 'Installing dependencies (~100MB, may take a minute)...';
    execSync('npm install --no-audit --no-fund', { 
      cwd: vectorizerDir, 
      stdio: 'pipe',
      timeout: 300000 // 5 min timeout
    });
    
    // Add to .gitignore
    const gitignorePath = path.join(opencodeDir, '.gitignore');
    let gitignore = '';
    try { gitignore = await fs.readFile(gitignorePath, 'utf8'); } catch {}
    if (!gitignore.includes('vectors/')) {
      gitignore += '\n# Vectorizer cache\nvectors/\nvectorizer/node_modules/\n';
      await fs.writeFile(gitignorePath, gitignore);
    }
    
    spinner.succeed(chalk.green('Vectorizer installed!'));
    
    console.log(chalk.cyan('\n🔍 Vectorizer ready:'));
    console.log(`
  Index codebase:  ${chalk.cyan('npx opencode-workflow index')}
  Search code:     ${chalk.cyan('npx opencode-workflow search "your query"')}
    `);
    
    return true;
    
  } catch (error) {
    spinner.fail(chalk.yellow('Vectorizer installation failed (optional)'));
    console.log(chalk.gray(`  Error: ${error.message}`));
    console.log(chalk.gray('  You can install later with: npx opencode-workflow vectorizer install'));
    return false;
  }
}

const program = new Command();

program
  .name('create-opencode-workflow')
  .description('Initialize OpenCode Workflow system for AI-assisted development')
  .version(VERSION);

program
  .command('init')
  .description('Initialize .opencode/ in current project')
  .option('-y, --yes', 'Skip prompts, use defaults')
  .option('--jira', 'Enable Jira integration')
  .option('--tdd', 'Use TDD methodology')
  .option('--stub', 'Use STUB methodology')
  .option('--full', 'Create full repo structure')
  .option('--vectorizer', 'Install vectorizer for semantic code search')
  .action(async (options) => {
    console.log(chalk.blue.bold(`\n🚀 OpenCode Workflow v${VERSION}\n`));
    
    const targetDir = path.join(process.cwd(), '.opencode');
    const existingConfigPath = path.join(targetDir, 'config.yaml');
    
    // Default config
    let config = {
      user_name: 'Developer',
      communication_language: 'Ukrainian',
      methodology: 'tdd',
      jira_enabled: false,
      jira_url: 'https://your-domain.atlassian.net',
      jira_project: 'PROJ',
      create_repo_structure: false,
      install_vectorizer: true,   // Vectorizer ON by default
      vectorizer_enabled: true,
      vectorizer_auto_index: true,
      project_name: path.basename(process.cwd())
    };
    
    // Check if .opencode/ already exists
    let isUpdate = false;
    if (await fs.pathExists(targetDir)) {
      // Try to read existing config
      if (await fs.pathExists(existingConfigPath)) {
        try {
          const existingContent = await fs.readFile(existingConfigPath, 'utf8');
          
          // Parse existing values
          const nameMatch = existingContent.match(/user_name:\s*"([^"]+)"/);
          const langMatch = existingContent.match(/communication_language:\s*"([^"]+)"/);
          const methMatch = existingContent.match(/methodology:\s*(tdd|stub)/);
          const jiraMatch = existingContent.match(/jira:[\s\S]*?enabled:\s*(true|false)/);
          const jiraUrlMatch = existingContent.match(/base_url:\s*"([^"]+)"/);
          const jiraProjMatch = existingContent.match(/project_key:\s*"([^"]+)"/);
          
          // Parse vectorizer settings
          const vectorizerEnabledMatch = existingContent.match(/vectorizer:[\s\S]*?enabled:\s*(true|false)/);
          const vectorizerAutoIndexMatch = existingContent.match(/vectorizer:[\s\S]*?auto_index:\s*(true|false)/);
          
          if (nameMatch) config.user_name = nameMatch[1];
          if (langMatch) config.communication_language = langMatch[1];
          if (methMatch) config.methodology = methMatch[1];
          if (jiraMatch) config.jira_enabled = jiraMatch[1] === 'true';
          if (jiraUrlMatch) config.jira_url = jiraUrlMatch[1];
          if (jiraProjMatch) config.jira_project = jiraProjMatch[1];
          if (vectorizerEnabledMatch) config.vectorizer_enabled = vectorizerEnabledMatch[1] === 'true';
          if (vectorizerAutoIndexMatch) config.vectorizer_auto_index = vectorizerAutoIndexMatch[1] === 'true';
          
          isUpdate = true;
        } catch (e) {
          // Could not parse, use defaults
        }
      }
      
      console.log(chalk.yellow('.opencode/ already exists'));
      
      if (isUpdate) {
        console.log(chalk.gray(`  Found config: ${config.user_name}, ${config.communication_language}, ${config.methodology.toUpperCase()}\n`));
      }
      
      const { action } = await inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { name: 'Update files only (keep my settings)', value: 'update' },
          { name: 'Reconfigure (change settings)', value: 'reconfigure' },
          { name: 'Cancel', value: 'cancel' }
        ],
        default: 'update'
      }]);
      
      if (action === 'cancel') {
        console.log(chalk.yellow('\nAborted.\n'));
        process.exit(0);
      }
      
      if (action === 'update') {
        // Use existing config, skip prompts
        options.yes = true;
      }
      // If 'reconfigure', continue to prompts with existing values as defaults
    }

    if (!options.yes) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'user_name',
          message: 'Your name:',
          default: config.user_name
        },
        {
          type: 'list',
          name: 'communication_language',
          message: 'Communication language:',
          choices: ['Ukrainian', 'English'],
          default: config.communication_language
        },
        {
          type: 'list',
          name: 'methodology',
          message: 'Development methodology:',
          choices: [
            { name: 'TDD - Test-Driven Development (write tests first)', value: 'tdd' },
            { name: 'STUB - Stub-First Development (write stubs, then implement)', value: 'stub' }
          ],
          default: options.tdd ? 'tdd' : (options.stub ? 'stub' : config.methodology)
        },
        {
          type: 'confirm',
          name: 'jira_enabled',
          message: 'Enable Jira integration?',
          default: options.jira === true ? true : (config.jira_enabled || false)
        },
        {
          type: 'input',
          name: 'jira_url',
          message: 'Jira URL:',
          when: (answers) => answers.jira_enabled,
          default: config.jira_url
        },
        {
          type: 'input',
          name: 'jira_project',
          message: 'Jira project key:',
          when: (answers) => answers.jira_enabled,
          default: config.jira_project
        },
        {
          type: 'confirm',
          name: 'create_repo_structure',
          message: 'Create full repository structure (README, CONTRIBUTING, .gitignore, docs/)?',
          default: options.full || false
        },
        {
          type: 'confirm',
          name: 'install_vectorizer',
          message: 'Install vectorizer? (semantic code search, ~100MB)',
          default: true
        },
        {
          type: 'confirm',
          name: 'vectorizer_auto_index',
          message: 'Enable auto-indexing? (reindex files on save)',
          when: (answers) => answers.install_vectorizer,
          default: true
        },
        {
          type: 'checkbox',
          name: 'mcp_servers',
          message: 'Select MCP servers to enable (writes to opencode.json):',
          choices: [
            { name: 'context7 - Library docs for npm, Go, Python (recommended)', value: 'context7', checked: true },
            { name: 'grep - Search code examples from GitHub', value: 'grep', checked: false },
            { name: 'sequential-thinking - Enhanced reasoning for complex tasks', value: 'sequential-thinking', checked: false },
            { name: 'playwright - Browser automation and testing', value: 'playwright', checked: false },
            { name: 'github - GitHub repos, issues, PRs (needs GITHUB_TOKEN)', value: 'github', checked: false },
            { name: 'sentry - Query Sentry issues and errors (OAuth)', value: 'sentry', checked: false },
            { name: 'postgres - PostgreSQL database queries', value: 'postgres', checked: false }
          ]
        }
      ]);
      
      config = { ...config, ...answers };
      config.mcp_servers = answers.mcp_servers || [];
    } else {
      // Apply CLI flags for non-interactive mode
      if (options.tdd) config.methodology = 'tdd';
      if (options.stub) config.methodology = 'stub';
      if (options.jira) config.jira_enabled = true;
      if (options.full) config.create_repo_structure = true;
      if (options.vectorizer) config.install_vectorizer = true;
    }

    const spinner = ora('Initializing OpenCode Workflow...').start();

    try {
      // If updating, preserve vectorizer and indexes
      const vectorizerDir = path.join(targetDir, 'vectorizer');
      const vectorsDir = path.join(targetDir, 'vectors');
      const tempVectors = path.join(process.cwd(), '.vectors-temp');
      const tempNodeModules = path.join(process.cwd(), '.vectorizer-nm-temp');
      
      let hadVectors = false;
      let hadVectorizerModules = false;
      let oldPkgHash = null;
      let existingConfigContent = null;
      
      if (await fs.pathExists(targetDir)) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const backupDir = path.join(process.cwd(), `.opencode.backup-${timestamp}`);
        
        // Check what we need to preserve
        hadVectors = await fs.pathExists(vectorsDir);
        hadVectorizerModules = await fs.pathExists(path.join(vectorizerDir, 'node_modules'));
        
        // Get old package.json hash
        const oldPkgPath = path.join(vectorizerDir, 'package.json');
        if (await fs.pathExists(oldPkgPath)) {
          const oldPkg = await fs.readFile(oldPkgPath, 'utf8');
          oldPkgHash = crypto.createHash('md5').update(oldPkg).digest('hex');
        }
        
        // Read existing config.yaml for merge
        const existingConfigPath = path.join(targetDir, 'config.yaml');
        if (await fs.pathExists(existingConfigPath)) {
          existingConfigContent = await fs.readFile(existingConfigPath, 'utf8');
        }
        
        // Preserve vector indexes
        if (hadVectors) {
          spinner.text = 'Preserving vector indexes...';
          await fs.move(vectorsDir, tempVectors, { overwrite: true });
        }
        
        // Preserve vectorizer node_modules
        if (hadVectorizerModules) {
          spinner.text = 'Preserving vectorizer cache...';
          await fs.move(path.join(vectorizerDir, 'node_modules'), tempNodeModules, { overwrite: true });
        }
        
        // Create backup (without node_modules and vectors)
        spinner.text = 'Creating backup...';
        await fs.copy(targetDir, backupDir, {
          filter: (src) => !src.includes('node_modules') && !src.includes('vectors')
        });
        
        spinner.text = 'Removing old .opencode/...';
        await fs.remove(targetDir);
        
        console.log(chalk.yellow(`\n📦 Backup: ${chalk.cyan(`.opencode.backup-${timestamp}/`)}`));
      }
      
      spinner.start('Copying OpenCode Workflow files...');
      
      // Copy .opencode structure (fresh, no old files)
      await fs.copy(OPENCODE_SRC, targetDir);
      
      // Copy vectorizer source files
      if (await fs.pathExists(VECTORIZER_SRC)) {
        const newVectorizerDir = path.join(targetDir, 'vectorizer');
        await fs.ensureDir(newVectorizerDir);
        await fs.copy(path.join(VECTORIZER_SRC, 'index.js'), path.join(newVectorizerDir, 'index.js'));
        await fs.copy(path.join(VECTORIZER_SRC, 'package.json'), path.join(newVectorizerDir, 'package.json'));
        
        if (config.vectorizer_enabled) {
          // Check if package.json changed
          const newPkgPath = path.join(newVectorizerDir, 'package.json');
          const newPkg = await fs.readFile(newPkgPath, 'utf8');
          const newPkgHash = crypto.createHash('md5').update(newPkg).digest('hex');
          
          if (hadVectorizerModules && oldPkgHash === newPkgHash) {
            // Dependencies unchanged - restore cached node_modules
            spinner.text = 'Restoring vectorizer cache (deps unchanged)...';
            await fs.move(tempNodeModules, path.join(newVectorizerDir, 'node_modules'), { overwrite: true });
          } else {
            // Dependencies changed or new install
            spinner.text = 'Installing vectorizer dependencies...';
            if (await fs.pathExists(tempNodeModules)) {
              await fs.remove(tempNodeModules);
            }
            try {
              const steps = [
                'Installing vectorizer dependencies...',
                'Downloading @xenova/transformers (~50MB)...',
                'Installing vectordb...',
                'Installing glob...',
                'Finalizing vectorizer setup...'
              ];
              let stepIndex = 0;
              const progressInterval = setInterval(() => {
                stepIndex = (stepIndex + 1) % steps.length;
                spinner.text = steps[stepIndex];
              }, 3000);
              
              execSync('npm install', { 
                cwd: newVectorizerDir,
                stdio: 'pipe',
                timeout: 180000
              });
              
              clearInterval(progressInterval);
              spinner.text = 'Vectorizer installed!';
            } catch (e) {
              // Non-fatal
            }
          }
        } else {
          // Vectorizer disabled - clean up temp
          if (await fs.pathExists(tempNodeModules)) {
            await fs.remove(tempNodeModules);
          }
        }
      }
      
      // Restore vector indexes
      if (hadVectors) {
        spinner.text = 'Restoring vector indexes...';
        await fs.move(tempVectors, path.join(targetDir, 'vectors'), { overwrite: true });
      }
      
      // Update config.yaml with user values
      spinner.text = 'Configuring...';
      const configPath = path.join(targetDir, 'config.yaml');
      let configContent;
      
      // If we had existing config, use it as base (preserves comments and formatting)
      if (existingConfigContent) {
        configContent = existingConfigContent;
        // Update version to match new package
        configContent = configContent.replace(/^version:\s*["']?[\d.]+["']?/m, `version: "${VERSION}"`);
        console.log(chalk.green('  ✅ Restored your config (comments preserved)'));
      } else {
        configContent = await fs.readFile(configPath, 'utf8');
      }
      
      // Apply user's answers from prompts
      configContent = configContent
        .replace(/user_name:\s*["']?[^"\n]*["']?/, `user_name: "${config.user_name}"`)
        .replace(/communication_language:\s*["']?[^"\n]*["']?/, `communication_language: "${config.communication_language}"`)
        .replace(/project_name:\s*["']?[^"\n]*["']?/, `project_name: "${config.project_name}"`)
        .replace(/methodology:\s*(tdd|stub)/, `methodology: ${config.methodology}`);
      
      // Jira config
      if (config.jira_enabled) {
        configContent = configContent
          .replace(/enabled: false\s+# Jira/, `enabled: true  # Jira`)
          .replace(/base_url: .*/, `base_url: "${config.jira_url}"`)
          .replace(/project_key: .*/, `project_key: "${config.jira_project}"`);
      }
      
      // Vectorizer config
      configContent = configContent
        .replace(/(vectorizer:\s*\n\s+# Enable\/disable.*\n\s+enabled:)\s*(true|false)/, 
          `$1 ${config.vectorizer_enabled}`)
        .replace(/(# Auto-index files.*\n\s+auto_index:)\s*(true|false)/, 
          `$1 ${config.vectorizer_auto_index}`);
      
      await fs.writeFile(configPath, configContent);
      
      // Create docs structure (always)
      spinner.text = 'Creating docs structure...';
      await fs.ensureDir(path.join(process.cwd(), 'docs'));
      await fs.ensureDir(path.join(process.cwd(), 'docs/sprint-artifacts'));
      await fs.ensureDir(path.join(process.cwd(), 'docs/sprint-artifacts/backlog'));
      await fs.ensureDir(path.join(process.cwd(), 'docs/requirements'));
      await fs.ensureDir(path.join(process.cwd(), 'docs/architecture'));
      await fs.ensureDir(path.join(process.cwd(), 'docs/architecture/adr'));
      await fs.ensureDir(path.join(process.cwd(), 'docs/architecture/diagrams'));
      await fs.ensureDir(path.join(process.cwd(), 'docs/api'));
      await fs.ensureDir(path.join(process.cwd(), 'docs/confluence'));
      await fs.ensureDir(path.join(process.cwd(), 'docs/coding-standards'));
      
      // Create full repo structure if requested
      if (config.create_repo_structure) {
        spinner.text = 'Creating repository structure...';
        
        // Copy repo-structure templates (skip if files already exist)
        const repoFiles = [
          { src: 'README.md', dest: 'README.md' },
          { src: 'CONTRIBUTING.md', dest: 'CONTRIBUTING.md' },
          { src: '.gitignore', dest: '.gitignore' },
          { src: '.gitattributes', dest: '.gitattributes' },
          { src: 'docs/README.md', dest: 'docs/README.md' },
          { src: 'docs/requirements/README.md', dest: 'docs/requirements/README.md' },
          { src: 'docs/architecture/README.md', dest: 'docs/architecture/README.md' },
          { src: 'docs/architecture/adr/README.md', dest: 'docs/architecture/adr/README.md' },
          { src: 'docs/architecture/diagrams/README.md', dest: 'docs/architecture/diagrams/README.md' },
          { src: 'docs/api/README.md', dest: 'docs/api/README.md' },
          { src: 'docs/sprint-artifacts/README.md', dest: 'docs/sprint-artifacts/README.md' },
          { src: 'docs/sprint-artifacts/backlog/README.md', dest: 'docs/sprint-artifacts/backlog/README.md' },
          { src: 'docs/confluence/README.md', dest: 'docs/confluence/README.md' },
          { src: 'docs/coding-standards/README.md', dest: 'docs/coding-standards/README.md' }
        ];
        
        for (const file of repoFiles) {
          const destPath = path.join(process.cwd(), file.dest);
          if (!await fs.pathExists(destPath)) {
            const srcPath = path.join(REPO_TEMPLATES_SRC, file.src);
            if (await fs.pathExists(srcPath)) {
              await fs.copy(srcPath, destPath);
            }
          }
        }
      }
      
      // Create CHANGELOG.md if not exists
      const changelogPath = path.join(process.cwd(), 'CHANGELOG.md');
      if (!await fs.pathExists(changelogPath)) {
        const changelogTemplate = path.join(targetDir, 'skills/changelog/template.md');
        if (await fs.pathExists(changelogTemplate)) {
          await fs.copy(changelogTemplate, changelogPath);
        }
      }
      
      // Save MCP server selections to opencode.json
      if (config.mcp_servers && config.mcp_servers.length > 0) {
        spinner.text = 'Configuring MCP servers in opencode.json...';
        const opencodeJsonPath = path.join(process.cwd(), 'opencode.json');
        
        // MCP catalog with server configs
        const mcpCatalog = {
          'context7': { type: 'remote', url: 'https://mcp.context7.com/mcp' },
          'grep': { type: 'remote', url: 'https://mcp.grep.app' },
          'sentry': { type: 'remote', url: 'https://mcp.sentry.dev/mcp', oauth: {} },
          'sequential-thinking': { type: 'local', command: ['npx', '-y', '@anthropic/mcp-sequential-thinking'] },
          'playwright': { type: 'local', command: ['npx', '-y', '@anthropic/mcp-playwright'] },
          'github': { type: 'local', command: ['npx', '-y', '@anthropic/mcp-github'] },
          'postgres': { type: 'local', command: ['npx', '-y', '@anthropic/mcp-postgres'] }
        };
        
        // Read existing opencode.json or create new
        let opencodeConfig = { "$schema": "https://opencode.ai/config.json" };
        try {
          if (await fs.pathExists(opencodeJsonPath)) {
            opencodeConfig = JSON.parse(await fs.readFile(opencodeJsonPath, 'utf8'));
          }
        } catch {}
        
        // Add MCP servers
        if (!opencodeConfig.mcp) opencodeConfig.mcp = {};
        for (const serverId of config.mcp_servers) {
          if (mcpCatalog[serverId]) {
            opencodeConfig.mcp[serverId] = { ...mcpCatalog[serverId], enabled: true };
          }
        }
        
        await fs.writeFile(opencodeJsonPath, JSON.stringify(opencodeConfig, null, 2) + '\n');
        console.log(chalk.green(`✅ MCP servers added to opencode.json`));
      }

      // Install plugin dependencies
      spinner.text = 'Installing plugin dependencies...';
      try {
        execSync('bun install', { 
          cwd: targetDir, 
          stdio: 'pipe',
          timeout: 60000
        });
        spinner.succeed(chalk.green('OpenCode Workflow initialized!'));
        console.log(chalk.green('✅ Plugin dependencies installed'));
      } catch (e) {
        spinner.succeed(chalk.green('OpenCode Workflow initialized!'));
        console.log(chalk.yellow(`⚠️  Plugin dependencies failed: ${e.message}`));
        console.log(chalk.gray('   Run manually: cd .opencode && bun install'));
      }

      // Show what was done
      const vectorizerInstalled = await fs.pathExists(path.join(targetDir, 'vectorizer', 'node_modules'));
      if (vectorizerInstalled) {
        console.log(chalk.green('✅ Vectorizer installed (fresh dependencies)'));
      } else if (config.vectorizer_enabled) {
        console.log(chalk.yellow('⚠️  Vectorizer: run `npx @comfanion/workflow vectorizer install`'));
      } else {
        console.log(chalk.gray('ℹ️  Vectorizer disabled (enable in config.yaml to use semantic search)'));
      }
      if (hadVectors) {
        console.log(chalk.green('✅ Vector indexes preserved'));
      }

      // Install vectorizer if requested and failed above
      if (config.install_vectorizer && !vectorizerInstalled) {
        await installVectorizer(targetDir);
      }

      // Show summary
      console.log(chalk.yellow('\n📁 Created structure:'));
      console.log(`
  ${chalk.cyan('.opencode/')}
  ├── config.yaml          # Your configuration
  ├── FLOW.yaml            # Workflow definition
  ├── agents/              # Agent personas (analyst, pm, architect, sm, dev)
  ├── skills/              # Knowledge modules (with templates)
  ├── workflows/           # Workflow instructions
  └── checklists/          # Validation checklists
  
  ${chalk.cyan('docs/')}
  ├── sprint-artifacts/    # Epics, stories, sprints
  │   └── backlog/         # Backlog items
  ├── requirements/        # Requirements documents
  ├── architecture/        # Architecture docs
  │   ├── adr/             # Architecture Decision Records
  │   └── diagrams/        # System diagrams
  ├── api/                 # API documentation
  ├── coding-standards/    # Coding standards
  └── confluence/          # Translations (Ukrainian)
      `);

      if (config.create_repo_structure) {
        console.log(chalk.yellow('📄 Repository files created:'));
        console.log(`
  README.md              # Project readme
  CONTRIBUTING.md        # Git workflow, commit conventions
  CHANGELOG.md           # Change history
  .gitignore             # Git ignore patterns
  .gitattributes         # Git attributes
        `);
      }

      console.log(chalk.blue('\n⚙️  Configuration:'));
      console.log(`
  Methodology:  ${chalk.cyan(config.methodology.toUpperCase())}
  Language:     ${chalk.cyan(config.communication_language)}
  Jira:         ${config.jira_enabled ? chalk.green('Enabled') : chalk.gray('Disabled')}
      `);

      console.log(chalk.blue('🎯 Next steps:'));
      console.log(`
  1. Review ${chalk.cyan('.opencode/config.yaml')}
  2. Start with: ${chalk.cyan('/requirements')} or ${chalk.cyan('/prd')}
  3. Use agents: ${chalk.cyan('@analyst')}, ${chalk.cyan('@pm')}, ${chalk.cyan('@architect')}
      `);

      if (config.jira_enabled) {
        console.log(chalk.yellow('⚠️  Set Jira credentials:'));
        console.log(`
  export JIRA_EMAIL="your-email@company.com"
  export JIRA_API_TOKEN="your-api-token"
        `);
      }

    } catch (error) {
      spinner.fail(chalk.red('Failed to initialize'));
      console.error(error);
      process.exit(1);
    }
  });

program
  .command('update')
  .description('Update .opencode/ to latest version (preserves config.yaml and vectorizer)')
  .option('--no-backup', 'Skip creating backup')
  .option('--vectorizer', 'Update/install vectorizer too')
  .action(async (options) => {
    const spinner = ora('Updating OpenCode Workflow...').start();
    
    try {
      const targetDir = path.join(process.cwd(), '.opencode');
      
      if (!await fs.pathExists(targetDir)) {
        spinner.fail(chalk.red('.opencode/ not found. Run `init` first.'));
        process.exit(1);
      }
      
      const configPath = path.join(targetDir, 'config.yaml');
      const vectorizerDir = path.join(targetDir, 'vectorizer');
      const vectorsDir = path.join(targetDir, 'vectors');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const backupDir = path.join(process.cwd(), `.opencode.backup-${timestamp}`);
      
      // Backup config.yaml content
      spinner.text = 'Reading config.yaml...';
      const configBackup = await fs.readFile(configPath, 'utf8');
      
      // Check what exists
      const hasVectors = await fs.pathExists(vectorsDir);
      const hasVectorizerModules = await fs.pathExists(path.join(vectorizerDir, 'node_modules'));
      
      // Get old package.json hash (to check if deps changed)
      let oldPkgHash = null;
      const oldPkgPath = path.join(vectorizerDir, 'package.json');
      if (await fs.pathExists(oldPkgPath)) {
        const oldPkg = await fs.readFile(oldPkgPath, 'utf8');
        oldPkgHash = crypto.createHash('md5').update(oldPkg).digest('hex');
      }
      
      // Create full backup (unless --no-backup)
      if (options.backup !== false) {
        spinner.text = 'Creating backup...';
        await fs.copy(targetDir, backupDir, {
          filter: (src) => !src.includes('node_modules') && !src.includes('vectors')
        });
      }
      
      // Preserve vector indexes
      const tempVectors = path.join(process.cwd(), '.vectors-temp');
      if (hasVectors) {
        spinner.text = 'Preserving vector indexes...';
        await fs.move(vectorsDir, tempVectors, { overwrite: true });
      }
      
      // Preserve vectorizer node_modules (will restore if package.json unchanged)
      const tempNodeModules = path.join(process.cwd(), '.vectorizer-nm-temp');
      if (hasVectorizerModules) {
        spinner.text = 'Preserving vectorizer cache...';
        await fs.move(path.join(vectorizerDir, 'node_modules'), tempNodeModules, { overwrite: true });
      }
      
      // Remove old .opencode directory
      spinner.text = 'Removing old files...';
      await fs.remove(targetDir);
      
      // Copy new files
      spinner.text = 'Installing new version...';
      await fs.copy(OPENCODE_SRC, targetDir);
      
      // Copy vectorizer source files
      if (await fs.pathExists(VECTORIZER_SRC)) {
        const newVectorizerDir = path.join(targetDir, 'vectorizer');
        await fs.ensureDir(newVectorizerDir);
        await fs.copy(path.join(VECTORIZER_SRC, 'index.js'), path.join(newVectorizerDir, 'index.js'));
        await fs.copy(path.join(VECTORIZER_SRC, 'package.json'), path.join(newVectorizerDir, 'package.json'));
        
        // Check if vectorizer is enabled in user's config
        const vectorizerEnabled = /vectorizer:[\s\S]*?enabled:\s*true/i.test(configBackup);
        
        if (vectorizerEnabled) {
          // Check if package.json changed
          const newPkgPath = path.join(newVectorizerDir, 'package.json');
          const newPkg = await fs.readFile(newPkgPath, 'utf8');
          const newPkgHash = crypto.createHash('md5').update(newPkg).digest('hex');
          
          if (hasVectorizerModules && oldPkgHash === newPkgHash) {
            // Dependencies unchanged - restore cached node_modules
            spinner.text = 'Restoring vectorizer cache (deps unchanged)...';
            await fs.move(tempNodeModules, path.join(newVectorizerDir, 'node_modules'), { overwrite: true });
          } else {
            // Dependencies changed or new install - run npm install
            spinner.text = 'Installing vectorizer dependencies...';
            // Clean up temp if exists
            if (await fs.pathExists(tempNodeModules)) {
              await fs.remove(tempNodeModules);
            }
            try {
              const steps = [
                'Installing vectorizer dependencies...',
                'Downloading @xenova/transformers (~50MB)...',
                'Installing vectordb...',
                'Installing glob...',
                'Finalizing vectorizer setup...'
              ];
              let stepIndex = 0;
              const progressInterval = setInterval(() => {
                stepIndex = (stepIndex + 1) % steps.length;
                spinner.text = steps[stepIndex];
              }, 3000);
              
              execSync('npm install', { 
                cwd: newVectorizerDir,
                stdio: 'pipe',
                timeout: 180000
              });
              
              clearInterval(progressInterval);
              spinner.text = 'Vectorizer installed!';
            } catch (e) {
              // Non-fatal
            }
          }
        } else {
          // Vectorizer disabled - clean up temp
          if (await fs.pathExists(tempNodeModules)) {
            await fs.remove(tempNodeModules);
          }
        }
      }
      
      // Restore vector indexes
      if (hasVectors) {
        spinner.text = 'Restoring vector indexes...';
        await fs.move(tempVectors, path.join(targetDir, 'vectors'), { overwrite: true });
      }
      
      // Restore user's config.yaml (preserves comments and formatting)
      spinner.text = 'Restoring config.yaml...';
      try {
        // Update version in user's config to match new package
        let restoredConfig = configBackup.replace(
          /^version:\s*["']?[\d.]+["']?/m, 
          `version: "${VERSION}"`
        );
        await fs.writeFile(configPath, restoredConfig);
        console.log(chalk.green('  ✅ config.yaml restored (your settings + comments preserved)'));
        
        // Check if new template has options that user doesn't have
        const newConfigPath = path.join(OPENCODE_SRC, 'config.yaml');
        if (await fs.pathExists(newConfigPath)) {
          const newConfig = yaml.load(await fs.readFile(newConfigPath, 'utf8')) || {};
          const userConfig = yaml.load(configBackup) || {};
          const newKeys = findNewKeys(newConfig, userConfig);
          if (newKeys.length > 0) {
            console.log(chalk.yellow(`  💡 New config options available: ${newKeys.slice(0, 3).join(', ')}${newKeys.length > 3 ? '...' : ''}`));
            console.log(chalk.gray('     Check .opencode.backup-*/config.yaml.new for full template'));
            // Save new template for reference
            await fs.writeFile(
              path.join(process.cwd(), `.opencode.backup-${timestamp}`, 'config.yaml.new'),
              await fs.readFile(newConfigPath, 'utf8')
            );
          }
        }
      } catch (e) {
        // Fallback: just restore user's config
        await fs.writeFile(configPath, configBackup);
        console.log(chalk.yellow('  ⚠️ config.yaml restored'));
      }
      
      // Install plugin dependencies
      spinner.text = 'Installing plugin dependencies...';
      let pluginDepsInstalled = false;
      try {
        execSync('bun install', { 
          cwd: targetDir, 
          stdio: 'pipe',
          timeout: 60000
        });
        pluginDepsInstalled = true;
      } catch (e) {
        // Will show warning below
      }
      
      spinner.succeed(chalk.green('OpenCode Workflow updated!'));
      
      if (options.backup !== false) {
        console.log(chalk.yellow(`\n📦 Backup created: ${chalk.cyan(`.opencode.backup-${timestamp}/`)}`));
        console.log(chalk.gray('   You can delete it after verifying the update works.\n'));
      }
      
      console.log(chalk.green('✅ Your config.yaml was preserved.'));
      if (pluginDepsInstalled) {
        console.log(chalk.green('✅ Plugin dependencies installed.'));
      } else {
        console.log(chalk.yellow('⚠️  Plugin deps: run `cd .opencode && bun install`'));
      }
      const vectorizerInstalled = await fs.pathExists(path.join(targetDir, 'vectorizer', 'node_modules'));
      const vectorizerEnabled = /vectorizer:[\s\S]*?enabled:\s*true/i.test(configBackup);
      if (vectorizerInstalled) {
        console.log(chalk.green('✅ Vectorizer reinstalled (fresh dependencies).'));
      } else if (vectorizerEnabled) {
        console.log(chalk.yellow('⚠️  Vectorizer: run `npx @comfanion/workflow vectorizer install`'));
      } else {
        console.log(chalk.gray('ℹ️  Vectorizer disabled (enable in config.yaml to use semantic search)'));
      }
      if (hasVectors) {
        console.log(chalk.green('✅ Vector indexes were preserved.'));
      }
      
      console.log('');
      
    } catch (error) {
      spinner.fail(chalk.red('Failed to update'));
      console.error(error);
      process.exit(1);
    }
  });

program
  .command('doctor')
  .description('Check OpenCode Workflow installation')
  .action(async () => {
    console.log(chalk.blue.bold('\n🩺 OpenCode Workflow Health Check\n'));
    
    const checks = [
      { name: '.opencode/', path: '.opencode', required: true },
      { name: 'config.yaml', path: '.opencode/config.yaml', required: true },
      { name: 'FLOW.yaml', path: '.opencode/FLOW.yaml', required: true },
      { name: 'agents/', path: '.opencode/agents', required: true },
      { name: 'skills/', path: '.opencode/skills', required: true },
      { name: 'docs/', path: 'docs', required: true },
      { name: 'docs/sprint-artifacts/', path: 'docs/sprint-artifacts', required: true },
      { name: 'docs/requirements/', path: 'docs/requirements', required: true },
      { name: 'docs/architecture/', path: 'docs/architecture', required: true },
      { name: 'CHANGELOG.md', path: 'CHANGELOG.md', required: false },
      { name: 'README.md', path: 'README.md', required: false },
      { name: 'CONTRIBUTING.md', path: 'CONTRIBUTING.md', required: false },
    ];
    
    let hasErrors = false;
    
    console.log(chalk.cyan('Core files:'));
    for (const check of checks.filter(c => c.required)) {
      const exists = await fs.pathExists(path.join(process.cwd(), check.path));
      if (exists) {
        console.log(chalk.green(`  ✅ ${check.name}`));
      } else {
        console.log(chalk.red(`  ❌ ${check.name} - missing`));
        hasErrors = true;
      }
    }
    
    console.log(chalk.cyan('\nOptional files:'));
    for (const check of checks.filter(c => !c.required)) {
      const exists = await fs.pathExists(path.join(process.cwd(), check.path));
      if (exists) {
        console.log(chalk.green(`  ✅ ${check.name}`));
      } else {
        console.log(chalk.gray(`  ○  ${check.name} - not created`));
      }
    }
    
    // Check config values
    console.log(chalk.cyan('\nConfiguration:'));
    try {
      const configPath = path.join(process.cwd(), '.opencode/config.yaml');
      const configContent = await fs.readFile(configPath, 'utf8');
      
      const methodologyMatch = configContent.match(/methodology: (tdd|stub)/);
      if (methodologyMatch) {
        console.log(chalk.green(`  ✅ Methodology: ${methodologyMatch[1].toUpperCase()}`));
      }
      
      const jiraMatch = configContent.match(/enabled: (true|false)\s+# Jira/);
      if (jiraMatch) {
        const jiraEnabled = jiraMatch[1] === 'true';
        console.log(jiraEnabled 
          ? chalk.green('  ✅ Jira: Enabled')
          : chalk.gray('  ○  Jira: Disabled'));
      }
    } catch (e) {
      console.log(chalk.yellow('  ⚠️  Could not read config'));
    }
    
    // Check Jira env vars
    console.log(chalk.cyan('\nEnvironment:'));
    if (process.env.JIRA_EMAIL && process.env.JIRA_API_TOKEN) {
      console.log(chalk.green('  ✅ Jira credentials configured'));
    } else {
      console.log(chalk.gray('  ○  Jira credentials not set'));
    }
    
    // Check Vectorizer
    console.log(chalk.cyan('\nVectorizer (semantic search):'));
    const vectorizerInstalled = await fs.pathExists(path.join(process.cwd(), '.opencode', 'vectorizer', 'node_modules'));
    const vectorsExist = await fs.pathExists(path.join(process.cwd(), '.opencode', 'vectors', 'hashes.json'));
    
    // Check vectorizer config
    let vectorizerEnabled = true;
    let autoIndexEnabled = true;
    try {
      const vecConfigContent = await fs.readFile(path.join(process.cwd(), '.opencode/config.yaml'), 'utf8');
      const vecEnabledMatch = vecConfigContent.match(/vectorizer:[\s\S]*?enabled:\s*(true|false)/);
      const autoIndexMatch = vecConfigContent.match(/vectorizer:[\s\S]*?auto_index:\s*(true|false)/);
      if (vecEnabledMatch) vectorizerEnabled = vecEnabledMatch[1] === 'true';
      if (autoIndexMatch) autoIndexEnabled = autoIndexMatch[1] === 'true';
    } catch {}
    
    if (vectorizerInstalled) {
      console.log(chalk.green('  ✅ Installed'));
      console.log(vectorizerEnabled 
        ? chalk.green('  ✅ Enabled in config')
        : chalk.yellow('  ⚠️  Disabled in config'));
      console.log(autoIndexEnabled
        ? chalk.green('  ✅ Auto-index: ON')
        : chalk.gray('  ○  Auto-index: OFF'));
      if (vectorsExist) {
        try {
          const hashes = await fs.readJSON(path.join(process.cwd(), '.opencode', 'vectors', 'hashes.json'));
          console.log(chalk.green(`  ✅ Indexed (${Object.keys(hashes).length} files)`));
        } catch {
          console.log(chalk.gray('  ○  Not indexed yet'));
        }
      } else {
        console.log(chalk.gray('  ○  Not indexed (run: npx opencode-workflow index)'));
      }
    } else {
      console.log(chalk.gray('  ○  Not installed (run: npx opencode-workflow vectorizer install)'));
    }
    
    // Check LSP env
    if (process.env.OPENCODE_EXPERIMENTAL_LSP_TOOL === 'true' || process.env.OPENCODE_EXPERIMENTAL === 'true') {
      console.log(chalk.green('  ✅ LSP tool enabled'));
    } else {
      console.log(chalk.gray('  ○  LSP tool disabled (set OPENCODE_EXPERIMENTAL_LSP_TOOL=true)'));
    }
    
    console.log('');
    
    if (hasErrors) {
      console.log(chalk.yellow('💡 Run `npx opencode-workflow init` to fix missing files.\n'));
    } else {
      console.log(chalk.green.bold('✅ All checks passed!\n'));
    }
  });

program
  .command('config')
  .description('Show current configuration')
  .action(async () => {
    try {
      const configPath = path.join(process.cwd(), '.opencode/config.yaml');
      const content = await fs.readFile(configPath, 'utf8');
      console.log(chalk.blue.bold('\n📋 Current Configuration:\n'));
      console.log(content);
    } catch (error) {
      console.log(chalk.red('\n❌ .opencode/config.yaml not found. Run `init` first.\n'));
    }
  });

// =============================================================================
// VECTORIZER COMMANDS
// =============================================================================

program
  .command('vectorizer')
  .description('Manage vectorizer for semantic code search')
  .argument('<action>', 'install | status | uninstall')
  .action(async (action) => {
    const opencodeDir = path.join(process.cwd(), '.opencode');
    const vectorizerDir = path.join(opencodeDir, 'vectorizer');
    
    if (action === 'install') {
      if (!await fs.pathExists(opencodeDir)) {
        console.log(chalk.red('\n❌ .opencode/ not found. Run `init` first.\n'));
        process.exit(1);
      }
      await installVectorizer(opencodeDir);
      
    } else if (action === 'status') {
      const installed = await fs.pathExists(path.join(vectorizerDir, 'node_modules'));
      const indexed = await fs.pathExists(path.join(process.cwd(), '.opencode', 'vectors', 'lancedb'));
      
      console.log(chalk.blue.bold('\n🔍 Vectorizer Status\n'));
      console.log(installed 
        ? chalk.green('  ✅ Installed') 
        : chalk.gray('  ○  Not installed (run: npx opencode-workflow vectorizer install)'));
      console.log(indexed
        ? chalk.green('  ✅ Codebase indexed')
        : chalk.gray('  ○  Not indexed (run: npx opencode-workflow index)'));
      
      if (indexed) {
        try {
          const hashes = await fs.readJSON(path.join(process.cwd(), '.opencode', 'vectors', 'hashes.json'));
          console.log(chalk.cyan(`  📁 ${Object.keys(hashes).length} files indexed`));
        } catch {}
      }
      console.log('');
      
    } else if (action === 'uninstall') {
      const spinner = ora('Removing vectorizer...').start();
      await fs.remove(vectorizerDir);
      await fs.remove(path.join(process.cwd(), '.opencode', 'vectors'));
      spinner.succeed(chalk.green('Vectorizer removed'));
      
    } else {
      console.log(chalk.red(`Unknown action: ${action}`));
      console.log('Available: install, status, uninstall');
    }
  });

program
  .command('index')
  .description('Index codebase for semantic search')
  .option('-i, --index <name>', 'Index name: code, docs, config, all, or custom', 'code')
  .option('-d, --dir <path>', 'Directory to index (default: current directory)')
  .option('-p, --pattern <glob>', 'File pattern (overrides preset)')
  .option('--force', 'Re-index all files (ignore cache)')
  .option('--list', 'List all indexes and their stats')
  .action(async (options) => {
    const vectorizerDir = path.join(process.cwd(), '.opencode', 'vectorizer');
    
    if (!await fs.pathExists(path.join(vectorizerDir, 'node_modules'))) {
      console.log(chalk.red('\n❌ Vectorizer not installed.'));
      console.log(chalk.yellow('Run: npx opencode-workflow vectorizer install\n'));
      process.exit(1);
    }
    
    const spinner = ora('Initializing indexer...').start();
    
    try {
      // Dynamic import of the vectorizer (need file:// URL for ESM)
      const vectorizerPath = path.join(vectorizerDir, 'index.js');
      const { CodebaseIndexer, INDEX_PRESETS } = await import(`file://${vectorizerPath}`);
      
      // List all indexes
      if (options.list) {
        spinner.stop();
        const indexer = await new CodebaseIndexer(process.cwd(), 'code').init();
        const allStats = await indexer.getAllStats();
        
        console.log(chalk.blue.bold('\n📊 Index Statistics\n'));
        
        if (allStats.length === 0) {
          console.log(chalk.gray('  No indexes found. Create one with:'));
          console.log(chalk.cyan('    npx opencode-workflow index --index code'));
          console.log(chalk.cyan('    npx opencode-workflow index --index docs\n'));
        } else {
          for (const stat of allStats) {
            console.log(chalk.cyan(`  📁 ${stat.indexName}`));
            console.log(chalk.gray(`     ${stat.description}`));
            console.log(`     Files: ${stat.fileCount}, Chunks: ${stat.chunkCount}\n`);
          }
        }
        
        console.log(chalk.yellow('Available presets:'));
        for (const [name, preset] of Object.entries(INDEX_PRESETS)) {
          console.log(`  ${chalk.cyan(name)}: ${preset.description}`);
          console.log(chalk.gray(`    Pattern: ${preset.pattern}\n`));
        }
        return;
      }
      
      const indexName = options.index;
      const indexer = await new CodebaseIndexer(process.cwd(), indexName).init();
      
      // Get pattern from options or preset
      const preset = INDEX_PRESETS[indexName];
      const pattern = options.pattern || preset?.pattern || '**/*.{js,ts,jsx,tsx,py,go,rs,java,md,yaml,yml}';
      
      spinner.text = `Initializing index: ${indexName}...`;
      
      if (options.force) {
        spinner.text = `Clearing index: ${indexName}...`;
        await indexer.clear();
      }
      
      // Find files to index
      spinner.text = 'Finding files...';
      const { glob } = await import('glob');
      const { default: ignore } = await import('ignore');
      
      // Determine base directory
      const baseDir = options.dir 
        ? path.resolve(process.cwd(), options.dir)
        : process.cwd();
      
      // Load .gitignore
      let ig = ignore();
      try {
        const gitignore = await fs.readFile(path.join(process.cwd(), '.gitignore'), 'utf8');
        ig = ig.add(gitignore);
      } catch {}
      ig.add(['node_modules', '.git', 'dist', 'build', '.opencode/vectors', '.opencode/vectorizer']);
      
      const files = await glob(pattern, { cwd: baseDir, nodir: true });
      const filtered = files.filter(f => !ig.ignores(f));
      
      const dirLabel = options.dir ? ` in ${options.dir}` : '';
      spinner.succeed(`Found ${filtered.length} files for index "${indexName}"${dirLabel}`);
      
      let indexed = 0;
      let skipped = 0;
      
      for (const file of filtered) {
        const filePath = path.join(baseDir, file);
        spinner.start(`[${indexName}] Indexing: ${file}`);
        
        try {
          const wasIndexed = await indexer.indexFile(filePath);
          if (wasIndexed) {
            indexed++;
          } else {
            skipped++;
          }
        } catch (e) {
          spinner.warn(`Skipped ${file}: ${e.message}`);
        }
      }
      
      spinner.succeed(chalk.green(`Index "${indexName}": ${indexed} indexed, ${skipped} unchanged`));
      
    } catch (error) {
      spinner.fail(chalk.red('Indexing failed'));
      console.error(error);
    }
  });

program
  .command('search')
  .description('Semantic search in codebase')
  .argument('<query>', 'Search query')
  .option('-i, --index <name>', 'Index to search: code, docs, config, or custom', 'code')
  .option('-n, --limit <number>', 'Number of results', '5')
  .option('-a, --all', 'Search all indexes')
  .action(async (query, options) => {
    const vectorizerDir = path.join(process.cwd(), '.opencode', 'vectorizer');
    
    if (!await fs.pathExists(path.join(vectorizerDir, 'node_modules'))) {
      console.log(chalk.red('\n❌ Vectorizer not installed.'));
      console.log(chalk.yellow('Run: npx opencode-workflow vectorizer install\n'));
      process.exit(1);
    }
    
    const spinner = ora('Searching...').start();
    
    try {
      // Dynamic import of the vectorizer (need file:// URL for ESM)
      const vectorizerPath = path.join(vectorizerDir, 'index.js');
      const { CodebaseIndexer } = await import(`file://${vectorizerPath}`);
      
      let allResults = [];
      const limit = parseInt(options.limit);
      
      if (options.all) {
        // Search all indexes
        const tempIndexer = await new CodebaseIndexer(process.cwd(), 'code').init();
        const indexes = await tempIndexer.listIndexes();
        
        if (indexes.length === 0) {
          spinner.stop();
          console.log(chalk.yellow('\nNo indexes found. Run `npx opencode-workflow index` first.\n'));
          return;
        }
        
        for (const indexName of indexes) {
          spinner.text = `Searching index: ${indexName}...`;
          const indexer = await new CodebaseIndexer(process.cwd(), indexName).init();
          const results = await indexer.search(query, limit);
          allResults.push(...results.map(r => ({ ...r, _index: indexName })));
        }
        
        // Sort by distance and take top N
        allResults.sort((a, b) => (a._distance || 0) - (b._distance || 0));
        allResults = allResults.slice(0, limit);
        
      } else {
        // Search specific index
        const indexer = await new CodebaseIndexer(process.cwd(), options.index).init();
        const results = await indexer.search(query, limit);
        allResults = results.map(r => ({ ...r, _index: options.index }));
      }
      
      spinner.stop();
      
      if (allResults.length === 0) {
        const indexInfo = options.all ? 'any index' : `index "${options.index}"`;
        console.log(chalk.yellow(`\nNo results found in ${indexInfo}.`));
        console.log(chalk.gray('Try: npx opencode-workflow index --index code\n'));
        return;
      }
      
      const searchScope = options.all ? 'all indexes' : `index "${options.index}"`;
      console.log(chalk.blue.bold(`\n🔍 Results for: "${query}" (${searchScope})\n`));
      
      for (let i = 0; i < allResults.length; i++) {
        const r = allResults[i];
        const score = r._distance ? (1 - r._distance).toFixed(3) : 'N/A';
        const indexLabel = options.all ? chalk.magenta(`[${r._index}] `) : '';
        console.log(chalk.cyan(`${i + 1}. ${indexLabel}${r.file}`) + chalk.gray(` (score: ${score})`));
        console.log(chalk.gray('─'.repeat(60)));
        // Show first 5 lines of content
        const preview = r.content.split('\n').slice(0, 5).join('\n');
        console.log(preview);
        console.log('');
      }
      
    } catch (error) {
      spinner.fail(chalk.red('Search failed'));
      console.error(error);
    }
  });

// =============================================================================
// MCP COMMANDS
// =============================================================================

// MCP catalog with server configs
const MCP_CATALOG = {
  'context7': { 
    name: 'Context7',
    description: 'Library docs for npm, Go, Python',
    type: 'remote', 
    url: 'https://mcp.context7.com/mcp',
    recommended: true
  },
  'grep': { 
    name: 'Grep by Vercel',
    description: 'Search code examples from GitHub',
    type: 'remote', 
    url: 'https://mcp.grep.app',
    recommended: false
  },
  'sentry': { 
    name: 'Sentry',
    description: 'Query Sentry issues and errors',
    type: 'remote', 
    url: 'https://mcp.sentry.dev/mcp', 
    oauth: {},
    recommended: false
  },
  'sequential-thinking': { 
    name: 'Sequential Thinking',
    description: 'Enhanced reasoning for complex tasks',
    type: 'local', 
    command: ['npx', '-y', '@anthropic/mcp-sequential-thinking'],
    recommended: true
  },
  'playwright': { 
    name: 'Playwright',
    description: 'Browser automation and testing',
    type: 'local', 
    command: ['npx', '-y', '@anthropic/mcp-playwright'],
    recommended: false
  },
  'github': { 
    name: 'GitHub',
    description: 'GitHub repos, issues, PRs',
    type: 'local', 
    command: ['npx', '-y', '@anthropic/mcp-github'],
    requires_env: ['GITHUB_TOKEN'],
    recommended: false
  },
  'gitlab': { 
    name: 'GitLab',
    description: 'GitLab repos, issues, MRs',
    type: 'local', 
    command: ['npx', '-y', '@anthropic/mcp-gitlab'],
    requires_env: ['GITLAB_TOKEN'],
    recommended: false
  },
  'postgres': { 
    name: 'PostgreSQL',
    description: 'Query PostgreSQL databases',
    type: 'local', 
    command: ['npx', '-y', '@anthropic/mcp-postgres'],
    requires_env: ['POSTGRES_CONNECTION_STRING'],
    recommended: false
  },
  'slack': { 
    name: 'Slack',
    description: 'Slack messages and channels',
    type: 'local', 
    command: ['npx', '-y', '@anthropic/mcp-slack'],
    requires_env: ['SLACK_TOKEN'],
    recommended: false
  }
};

program
  .command('mcp')
  .description('Manage MCP servers in opencode.json')
  .argument('<action>', 'list | add <id> | remove <id> | install')
  .argument('[server]', 'Server ID for add/remove')
  .action(async (action, server) => {
    const opencodeJsonPath = path.join(process.cwd(), 'opencode.json');
    
    if (action === 'list') {
      console.log(chalk.blue.bold('\n🔌 Available MCP Servers\n'));
      
      // Show installed
      let installed = {};
      try {
        if (await fs.pathExists(opencodeJsonPath)) {
          const config = JSON.parse(await fs.readFile(opencodeJsonPath, 'utf8'));
          installed = config.mcp || {};
        }
      } catch {}
      
      for (const [id, info] of Object.entries(MCP_CATALOG)) {
        const isInstalled = installed[id];
        const status = isInstalled ? chalk.green('✓') : chalk.gray('○');
        const rec = info.recommended ? chalk.yellow(' ⭐') : '';
        const type = info.type === 'remote' ? chalk.cyan('[remote]') : chalk.gray('[local]');
        console.log(`  ${status} ${chalk.white(id)}${rec} ${type}`);
        console.log(chalk.gray(`     ${info.description}`));
        if (info.requires_env) {
          console.log(chalk.yellow(`     Requires: ${info.requires_env.join(', ')}`));
        }
      }
      
      console.log(chalk.gray('\nUsage:'));
      console.log(chalk.cyan('  npx @comfanion/workflow mcp add context7'));
      console.log(chalk.cyan('  npx @comfanion/workflow mcp remove github'));
      console.log('');
      
    } else if (action === 'add') {
      if (!server) {
        console.log(chalk.red('Usage: mcp add <server-id>'));
        console.log(chalk.gray('Run `mcp list` to see available servers'));
        process.exit(1);
      }
      
      if (!MCP_CATALOG[server]) {
        console.log(chalk.red(`Unknown server: ${server}`));
        console.log(chalk.gray('Run `mcp list` to see available servers'));
        process.exit(1);
      }
      
      const spinner = ora(`Adding ${server}...`).start();
      
      // Read or create opencode.json
      let config = { "$schema": "https://opencode.ai/config.json" };
      try {
        if (await fs.pathExists(opencodeJsonPath)) {
          config = JSON.parse(await fs.readFile(opencodeJsonPath, 'utf8'));
        }
      } catch {}
      
      if (!config.mcp) config.mcp = {};
      
      const serverConfig = MCP_CATALOG[server];
      config.mcp[server] = {
        type: serverConfig.type,
        ...(serverConfig.type === 'remote' 
          ? { url: serverConfig.url, ...(serverConfig.oauth ? { oauth: serverConfig.oauth } : {}) }
          : { command: serverConfig.command }),
        enabled: true
      };
      
      await fs.writeFile(opencodeJsonPath, JSON.stringify(config, null, 2) + '\n');
      spinner.succeed(chalk.green(`Added ${server} to opencode.json`));
      
      if (serverConfig.requires_env) {
        console.log(chalk.yellow(`\n⚠️  Set environment variables:`));
        for (const env of serverConfig.requires_env) {
          console.log(chalk.cyan(`   export ${env}="..."`));
        }
      }
      if (serverConfig.oauth) {
        console.log(chalk.yellow(`\n⚠️  OAuth required. Run:`));
        console.log(chalk.cyan(`   opencode mcp auth ${server}`));
      }
      
    } else if (action === 'remove') {
      if (!server) {
        console.log(chalk.red('Usage: mcp remove <server-id>'));
        process.exit(1);
      }
      
      if (!await fs.pathExists(opencodeJsonPath)) {
        console.log(chalk.yellow('No opencode.json found'));
        return;
      }
      
      const spinner = ora(`Removing ${server}...`).start();
      
      const config = JSON.parse(await fs.readFile(opencodeJsonPath, 'utf8'));
      if (config.mcp && config.mcp[server]) {
        delete config.mcp[server];
        await fs.writeFile(opencodeJsonPath, JSON.stringify(config, null, 2) + '\n');
        spinner.succeed(chalk.green(`Removed ${server} from opencode.json`));
      } else {
        spinner.info(chalk.yellow(`${server} not found in opencode.json`));
      }
      
    } else if (action === 'install') {
      // Interactive selection
      const installed = {};
      try {
        if (await fs.pathExists(opencodeJsonPath)) {
          const config = JSON.parse(await fs.readFile(opencodeJsonPath, 'utf8'));
          Object.assign(installed, config.mcp || {});
        }
      } catch {}
      
      const choices = Object.entries(MCP_CATALOG).map(([id, info]) => ({
        name: `${id} - ${info.description}${info.recommended ? ' (recommended)' : ''}`,
        value: id,
        checked: installed[id] || info.recommended
      }));
      
      const { servers } = await inquirer.prompt([{
        type: 'checkbox',
        name: 'servers',
        message: 'Select MCP servers:',
        choices
      }]);
      
      // Read or create opencode.json
      let config = { "$schema": "https://opencode.ai/config.json" };
      try {
        if (await fs.pathExists(opencodeJsonPath)) {
          config = JSON.parse(await fs.readFile(opencodeJsonPath, 'utf8'));
        }
      } catch {}
      
      config.mcp = {};
      for (const id of servers) {
        const serverConfig = MCP_CATALOG[id];
        config.mcp[id] = {
          type: serverConfig.type,
          ...(serverConfig.type === 'remote' 
            ? { url: serverConfig.url, ...(serverConfig.oauth ? { oauth: serverConfig.oauth } : {}) }
            : { command: serverConfig.command }),
          enabled: true
        };
      }
      
      await fs.writeFile(opencodeJsonPath, JSON.stringify(config, null, 2) + '\n');
      console.log(chalk.green(`\n✅ Updated opencode.json with ${servers.length} MCP servers`));
      
    } else {
      console.log(chalk.red(`Unknown action: ${action}`));
      console.log('Available: list, add <id>, remove <id>, install');
    }
  });

program.parse();
