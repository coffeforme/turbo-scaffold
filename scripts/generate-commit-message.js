#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function getGitStatus() {
  try {
    // Get only staged changes for commit message generation
    return execSync('git diff --cached --name-status', { encoding: 'utf8' });
  } catch (error) {
    console.error('Error getting git status:', error.message);
    process.exit(1);
  }
}

function hasStagedChanges() {
  try {
    const staged = execSync('git diff --cached --name-only', { encoding: 'utf8' });
    return staged.trim().length > 0;
  } catch (error) {
    return false;
  }
}

function hasUnstagedChanges() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    return status.trim().length > 0;
  } catch (error) {
    return false;
  }
}

function analyzeChanges(status) {
  const changes = status.trim().split('\n').filter(line => line.trim());
  const analysis = {
    added: [],
    modified: [],
    deleted: [],
    packages: new Set(),
    hasInfrastructure: false,
    hasApi: false,
    hasBuild: false,
    hasDocs: false,
    hasCi: false,
    hasState: false,
    hasScripts: false,
    hasHusky: false,
    hasVsCode: false,
    hasTests: false
  };

  changes.forEach(change => {
    // git diff --name-status format: "A\tfilename" or "M\tfilename" or "D\tfilename"
    const parts = change.split('\t');
    if (parts.length !== 2) return;

    const status = parts[0];
    const filePath = parts[1];

    // Skip COMMIT_MESSAGE.txt as it's generated and shouldn't trigger new messages
    if (filePath === 'COMMIT_MESSAGE.txt') return;

    if (status === 'A') analysis.added.push(filePath);
    if (status === 'M') analysis.modified.push(filePath);
    if (status === 'D') analysis.deleted.push(filePath);

    // Check for package-specific changes
    if (filePath.includes('packages/')) {
      const packageMatch = filePath.match(/packages\/([^\/]+)/);
      if (packageMatch) {
        analysis.packages.add(packageMatch[1]);
      }
    }

    // Check for specific types of changes
    if (filePath.includes('infrastructure')) analysis.hasInfrastructure = true;
    if (filePath.includes('api')) analysis.hasApi = true;
    if (filePath.includes('package.json') || filePath.includes('tsconfig')) analysis.hasBuild = true;
    if (filePath.includes('.md') || filePath.includes('COMMIT_')) analysis.hasDocs = true;
    if (filePath.includes('husky') || filePath.includes('commitlint')) analysis.hasCi = true;
    if (filePath.includes('state') || filePath.includes('redux')) analysis.hasState = true;
    if (filePath.includes('scripts/')) analysis.hasScripts = true;
    if (filePath.includes('.husky/')) analysis.hasHusky = true;
    if (filePath.includes('.vscode/')) analysis.hasVsCode = true;
    if (filePath.includes('test') || filePath.includes('spec')) analysis.hasTests = true;
  });

  return analysis;
}

function generateCommitMessage(analysis) {
  let type = 'feat';
  let scope = '';
  let description = '';
  let body = '';

  // Determine primary type and scope based on changes
  // Prioritize added files over modified ones for more accurate detection

  // Filter out commit-related files to focus on actual code changes
  const nonCommitFiles = analysis.added.filter(file =>
    !file.includes('COMMIT_MESSAGE') &&
    !file.includes('commitlint') &&
    !file.includes('.husky') &&
    !file.includes('generate-commit-message') &&
    !file.includes('auto-update-commit-msg')
  );

  if (nonCommitFiles.length > 0) {
    // New non-commit files take priority
    const newFile = nonCommitFiles[0];
    if (newFile.includes('.md') && (newFile.includes('test') || newFile.includes('example'))) {
      type = 'docs';
      scope = 'root';
      description = 'add documentation example';
      body = `Add example documentation file: ${newFile}`;
    } else if (newFile.includes('.test.') || newFile.includes('.spec.')) {
      type = 'test';
      scope = 'root';
      description = 'add test file';
      body = `Add test file: ${newFile}`;
    } else {
      type = 'feat';
      scope = 'root';
      description = 'add new file';
      body = `Add new file: ${newFile}`;
    }
  } else if (analysis.added.length > 0) {
    // If only commit-related files were added
    type = 'ci';
    scope = 'root';
    description = 'add commit message tooling';
    body = 'Add commit message generation and validation tools';
  } else if (analysis.hasHusky || analysis.hasCi) {
    type = 'ci';
    scope = 'root';
    description = 'update commit message tooling and hooks';
    body = `This commit updates:
- Husky git hooks configuration
- Commit message validation setup
- VS Code tasks for commit message generation
- Commit message generation scripts`;
  } else if (analysis.hasDocs) {
    type = 'docs';
    scope = 'root';
    description = 'update commit message documentation';
    body = 'Update commit message tools documentation and guides';
  } else if (analysis.hasScripts) {
    type = 'refactor';
    scope = 'root';
    description = 'improve commit message generation script';
    body = 'Enhance the commit message generation script with better analysis and feedback';
  } else if (analysis.hasVsCode) {
    type = 'feat';
    scope = 'root';
    description = 'add vs code tasks for commit message workflow';
    body = 'Add VS Code tasks to streamline the commit message creation process';
  } else if (analysis.hasState) {
    type = 'fix';
    scope = 'packages/state';
    description = 'update state management slice';
    body = 'Update Redux state slice with latest changes';
  } else if (analysis.packages.size > 0) {
    type = 'feat';
    scope = `packages/${Array.from(analysis.packages)[0]}`;
    description = 'update package functionality';
    body = `Update ${Array.from(analysis.packages)[0]} package with new features`;
  } else if (analysis.added.length > 0) {
    type = 'feat';
    scope = 'root';
    description = 'add new files and functionality';
    body = `Add ${analysis.added.length} new file(s) to the project`;
  } else {
    type = 'refactor';
    scope = 'root';
    description = 'update project files';
    body = 'General project file updates and improvements';
  }

  const header = scope ? `${type}(${scope}): ${description}` : `${type}: ${description}`;
  return body ? `${header}\n\n${body}` : header;
}

function main() {
  const status = getGitStatus();
  const hasStaged = hasStagedChanges();
  const hasUnstaged = hasUnstagedChanges();

  if (!status.trim()) {
    console.log('✨ No changes to commit. Working directory is clean.');
    process.exit(0);
  }

  if (!hasStaged && hasUnstaged) {
    console.log('⚠️  You have unstaged changes. Stage them first with: git add .');
    console.log('   Or add specific files: git add <filename>');
    process.exit(1);
  }

  const analysis = analyzeChanges(status);

  // Check if there are any meaningful changes after filtering
  const totalChanges = analysis.added.length + analysis.modified.length + analysis.deleted.length;
  if (totalChanges === 0) {
    console.log('✨ No meaningful changes to commit (only generated files modified).');
    process.exit(0);
  }

  const commitMessage = generateCommitMessage(analysis);

  console.log('📝 Generated Commit Message:');
  console.log('=' .repeat(50));
  console.log(commitMessage);
  console.log('=' .repeat(50));
  console.log('\n💡 Quick commit: git commit -F COMMIT_MESSAGE.txt');
  console.log('   Manual commit: git commit -m "..."');

  // Save to file for easy access
  const messageFile = path.join(process.cwd(), 'COMMIT_MESSAGE.txt');
  fs.writeFileSync(messageFile, commitMessage);
  console.log(`💾 Message saved to: ${messageFile}`);

  if (hasStaged) {
    console.log('\n🚀 Ready to commit! Run: git commit -F COMMIT_MESSAGE.txt');
  }
}

if (require.main === module) {
  main();
}