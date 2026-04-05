# Commit Message Tools

This project provides several tools to help you create properly formatted commit messages that follow our [Conventional Commits](COMMIT_CONVENTIONS.md) standards.

## Quick Start

### Option 1: Auto-Commit (Easiest)
Stage your changes and use the auto-commit command:

```bash
git add .
pnpm run auto-commit-msg
```

### Option 2: Manual Update & Commit
Update the message and commit manually:

```bash
pnpm run update-commit-msg
git commit -F COMMIT_MESSAGE.txt
```

### Option 3: VS Code Tasks
Use the VS Code Command Palette (`Ctrl+Shift+P`) and run:
- **"Tasks: Run Task"** → **"Auto Commit"** - Updates message and commits automatically
- **"Tasks: Run Task"** → **"Update Commit Message"** - Just updates the message
- **"Tasks: Run Task"** → **"Generate Commit Message"** - Shows current message
- **"Tasks: Run Task"** → **"Copy Commit Message to Clipboard"** - Copies to clipboard

### Option 4: Git Aliases
Use the convenient git aliases:

```bash
git update-msg  # Update commit message
git cim          # Update message and commit
```

### Option 5: Watch Mode (Advanced)
Automatically update commit messages when files change:

```bash
pnpm run watch-commit-msg
```

### Option 6: Manual Creation
Follow the [commit conventions](COMMIT_CONVENTIONS.md) to write your own message:

```bash
git commit -m "feat(scope): description of changes"
```

## Automatic Updates

The commit message system automatically updates in these scenarios:

- **Before each commit**: Pre-commit hook updates the message for staged changes
- **After each commit**: Post-commit hook generates new messages for remaining changes
- **On demand**: Run `pnpm run update-commit-msg` or `git update-msg` anytime
- **Watch mode**: Run `pnpm run watch-commit-msg` for continuous updates
- **Validation**: Successful commits save their message for future reference
- **Smart analysis**: The system analyzes your actual changes to suggest appropriate commit types and scopes

## Git Integration

### Git Aliases
```bash
git update-msg    # Update commit message
git cim           # Update message and commit automatically
```

### Git Hooks
- **pre-commit**: Updates commit message before committing
- **post-commit**: Generates new message for remaining changes
- **commit-msg**: Validates message format and saves successful messages

## Available Tools

- **`COMMIT_MESSAGE.txt`** - Auto-generated commit message that updates automatically
- **`scripts/generate-commit-message.js`** - Script to analyze git status and generate messages
- **`.vscode/tasks.json`** - VS Code tasks for easy access
- **`generate-commit-message.sh`** - Shell script alternative
- **`.husky/post-commit`** - Automatically generates new messages after commits

## Smart Generation

The generator is intelligent about your workflow:

- ✅ **Checks for staged changes** before generating messages
- ✅ **Warns about unstaged changes** and suggests staging them
- ✅ **Analyzes file types** to suggest appropriate commit types
- ✅ **Updates automatically** after successful commits
- ✅ **Provides clear feedback** about next steps

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