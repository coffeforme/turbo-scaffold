# Commit Message Tools

This project provides several tools to help you create properly formatted commit messages that follow our [Conventional Commits](COMMIT_CONVENTIONS.md) standards.

## Quick Start

### Option 1: Use the Generated Message (Easiest)
After making changes, a `COMMIT_MESSAGE.txt` file is automatically generated with a suggested commit message:

```bash
git commit -F COMMIT_MESSAGE.txt
```

### Option 2: Generate a New Message
Run the commit message generator to analyze your changes and create a new message:

```bash
pnpm run commit-msg
```

### Option 3: VS Code Tasks
Use the VS Code Command Palette (`Ctrl+Shift+P`) and run:
- **"Tasks: Run Task"** → **"Generate Commit Message"** - Shows the suggested message
- **"Tasks: Run Task"** → **"Copy Commit Message to Clipboard"** - Copies message to clipboard

### Option 4: Manual Creation
Follow the [commit conventions](COMMIT_CONVENTIONS.md) to write your own message:

```bash
git commit -m "feat(scope): description of changes"
```

## Available Tools

- **`COMMIT_MESSAGE.txt`** - Auto-generated commit message for current changes
- **`scripts/generate-commit-message.js`** - Script to analyze git status and generate messages
- **`.vscode/tasks.json`** - VS Code tasks for easy access
- **`generate-commit-message.sh`** - Shell script alternative

## Examples

### For Feature Changes
```
feat(packages/api): add contact form validation
```

### For Bug Fixes
```
fix(apps/web): resolve button hover state issue
```

### For Documentation
```
docs: update API usage examples
```

### For Infrastructure Changes
```
feat(packages/infrastructure): add axios http provider
```

## Validation

All commit messages are automatically validated using commitlint. If your message doesn't follow the conventions, you'll see helpful error messages.

## Need Help?

- Read the full [Commit Conventions Guide](COMMIT_CONVENTIONS.md)
- Run `pnpm run commit-msg` to see examples
- Check the generated `COMMIT_MESSAGE.txt` for suggestions