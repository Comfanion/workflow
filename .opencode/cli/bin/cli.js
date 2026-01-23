#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_DIR = path.join(__dirname, '..');
const OPENCODE_SRC = path.join(PACKAGE_DIR, 'src', 'opencode');
const REPO_TEMPLATES_SRC = path.join(PACKAGE_DIR, 'src', 'repo-structure');

const program = new Command();

program
  .name('create-opencode-workflow')
  .description('Initialize OpenCode Workflow system for AI-assisted development')
  .version('3.0.0');

program
  .command('init')
  .description('Initialize .opencode/ in current project')
  .option('-y, --yes', 'Skip prompts, use defaults')
  .option('--jira', 'Enable Jira integration')
  .option('--tdd', 'Use TDD methodology')
  .option('--stub', 'Use STUB methodology')
  .option('--full', 'Create full repo structure')
  .action(async (options) => {
    console.log(chalk.blue.bold('\n🚀 OpenCode Workflow v3.0\n'));
    
    let config = {
      user_name: 'Developer',
      communication_language: 'Ukrainian',
      methodology: 'tdd',
      jira_enabled: false,
      create_repo_structure: false,
      project_name: path.basename(process.cwd())
    };

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
          default: 'Ukrainian'
        },
        {
          type: 'list',
          name: 'methodology',
          message: 'Development methodology:',
          choices: [
            { name: 'TDD - Test-Driven Development (write tests first)', value: 'tdd' },
            { name: 'STUB - Stub-First Development (write stubs, then implement)', value: 'stub' }
          ],
          default: options.tdd ? 'tdd' : (options.stub ? 'stub' : 'tdd')
        },
        {
          type: 'confirm',
          name: 'jira_enabled',
          message: 'Enable Jira integration?',
          default: options.jira || false
        },
        {
          type: 'input',
          name: 'jira_url',
          message: 'Jira URL:',
          when: (answers) => answers.jira_enabled,
          default: 'https://your-domain.atlassian.net'
        },
        {
          type: 'input',
          name: 'jira_project',
          message: 'Jira project key:',
          when: (answers) => answers.jira_enabled,
          default: 'PROJ'
        },
        {
          type: 'confirm',
          name: 'create_repo_structure',
          message: 'Create full repository structure (README, CONTRIBUTING, .gitignore, docs/)?',
          default: options.full || false
        }
      ]);
      
      config = { ...config, ...answers };
    } else {
      // Apply CLI flags for non-interactive mode
      if (options.tdd) config.methodology = 'tdd';
      if (options.stub) config.methodology = 'stub';
      if (options.jira) config.jira_enabled = true;
      if (options.full) config.create_repo_structure = true;
    }

    const spinner = ora('Initializing OpenCode Workflow...').start();

    try {
      const targetDir = path.join(process.cwd(), '.opencode');
      
      // Check if already exists
      if (await fs.pathExists(targetDir)) {
        spinner.warn(chalk.yellow('.opencode/ already exists'));
        const { overwrite } = await inquirer.prompt([{
          type: 'confirm',
          name: 'overwrite',
          message: 'Overwrite existing .opencode/?',
          default: false
        }]);
        
        if (!overwrite) {
          console.log(chalk.yellow('\nAborted. Use `update` command to update existing installation.\n'));
          process.exit(0);
        }
      }
      
      spinner.start('Copying OpenCode Workflow files...');
      
      // Copy .opencode structure
      await fs.copy(OPENCODE_SRC, targetDir, { overwrite: true });
      
      // Update config.yaml with user values
      spinner.text = 'Configuring...';
      const configPath = path.join(targetDir, 'config.yaml');
      let configContent = await fs.readFile(configPath, 'utf8');
      
      configContent = configContent
        .replace(/user_name: ".*"/, `user_name: "${config.user_name}"`)
        .replace(/communication_language: ".*"/, `communication_language: "${config.communication_language}"`)
        .replace(/project_name: ".*"/, `project_name: "${config.project_name}"`)
        .replace(/methodology: (tdd|stub)/, `methodology: ${config.methodology}`);
      
      // Jira config
      if (config.jira_enabled) {
        configContent = configContent
          .replace(/enabled: false\s+# Jira/, `enabled: true  # Jira`)
          .replace(/base_url: ".*"/, `base_url: "${config.jira_url}"`)
          .replace(/project_key: ".*"/, `project_key: "${config.jira_project}"`);
      }
      
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
        const changelogTemplate = path.join(targetDir, 'templates/CHANGELOG.md');
        if (await fs.pathExists(changelogTemplate)) {
          await fs.copy(changelogTemplate, changelogPath);
        }
      }

      spinner.succeed(chalk.green('OpenCode Workflow initialized!'));

      // Show summary
      console.log(chalk.yellow('\n📁 Created structure:'));
      console.log(`
  ${chalk.cyan('.opencode/')}
  ├── config.yaml          # Your configuration
  ├── FLOW.yaml            # Workflow definition
  ├── agents/              # Agent personas (analyst, pm, architect, sm, dev)
  ├── skills/              # Knowledge modules
  ├── templates/           # Document templates
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
  .description('Update .opencode/ to latest version (preserves config.yaml)')
  .action(async () => {
    const spinner = ora('Updating OpenCode Workflow...').start();
    
    try {
      const targetDir = path.join(process.cwd(), '.opencode');
      
      if (!await fs.pathExists(targetDir)) {
        spinner.fail(chalk.red('.opencode/ not found. Run `init` first.'));
        process.exit(1);
      }
      
      const configPath = path.join(targetDir, 'config.yaml');
      
      // Backup config
      const configBackup = await fs.readFile(configPath, 'utf8');
      
      // Copy new files
      await fs.copy(OPENCODE_SRC, targetDir, { overwrite: true });
      
      // Restore config
      await fs.writeFile(configPath, configBackup);
      
      spinner.succeed(chalk.green('OpenCode Workflow updated!'));
      console.log(chalk.yellow('\n✅ Your config.yaml was preserved.\n'));
      
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
      { name: 'templates/', path: '.opencode/templates', required: true },
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
    
    console.log('');
    
    if (hasErrors) {
      console.log(chalk.yellow('💡 Run `npx create-opencode-workflow init` to fix missing files.\n'));
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

program.parse();
