#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function getGitStatus() {
  try {
    return execSync('git status --porcelain', { encoding: 'utf8' });
  } catch (error) {
    console.error('Error getting git status:', error.message);
    process.exit(1);
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
    hasCi: false
  };

  changes.forEach(change => {
    const status = change.substring(0, 2);
    const filePath = change.substring(3);

    if (status.includes('A')) analysis.added.push(filePath);
    if (status.includes('M')) analysis.modified.push(filePath);
    if (status.includes('D')) analysis.deleted.push(filePath);

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
    if (filePath.includes('.md') || filePath.includes('COMMIT_CONVENTIONS')) analysis.hasDocs = true;
    if (filePath.includes('husky') || filePath.includes('commitlint')) analysis.hasCi = true;
  });

  return analysis;
}

function generateCommitMessage(analysis) {
  let type = 'feat';
  let scope = '';
  let description = '';
  let body = '';

  // Determine primary type
  if (analysis.hasInfrastructure && analysis.hasApi) {
    type = 'feat';
    scope = 'packages/infrastructure,packages/api';
    description = 'add infrastructure package with HTTP and auth providers';
    body = `This commit adds:
- HTTP providers (Fetch and Axios) in @repo/infrastructure
- Authentication providers (MSAL, Backend, Mixed) in @repo/infrastructure
- Enhanced API client with provider switching capability
- Commit message conventions and automated validation
- Husky git hooks for commit message linting

BREAKING CHANGE: API client factory now supports provider switching`;
  } else if (analysis.hasDocs && analysis.hasCi) {
    type = 'docs';
    scope = 'root';
    description = 'add commit message conventions and validation';
    body = `This commit adds:
- Commit message conventions documentation
- Commitlint configuration for automated validation
- Husky git hooks for commit message linting
- VS Code tasks for easy commit message generation`;
  } else if (analysis.hasInfrastructure) {
    type = 'feat';
    scope = 'packages/infrastructure';
    description = 'add HTTP and authentication providers';
    body = 'Add infrastructure layer with HTTP providers (Fetch, Axios) and authentication providers (MSAL, Backend, Mixed)';
  }

  const header = scope ? `${type}(${scope}): ${description}` : `${type}: ${description}`;
  return body ? `${header}\n\n${body}` : header;
}

function main() {
  const status = getGitStatus();

  if (!status.trim()) {
    console.log('No changes to commit.');
    process.exit(0);
  }

  const analysis = analyzeChanges(status);
  const commitMessage = generateCommitMessage(analysis);

  console.log('📝 Generated Commit Message:');
  console.log('=' .repeat(50));
  console.log(commitMessage);
  console.log('=' .repeat(50));
  console.log('\n💡 Copy this message and use: git commit -m "..."');

  // Save to file for easy access
  const messageFile = path.join(process.cwd(), 'COMMIT_MESSAGE.txt');
  fs.writeFileSync(messageFile, commitMessage);
  console.log(`💾 Message also saved to: ${messageFile}`);
}

if (require.main === module) {
  main();
}