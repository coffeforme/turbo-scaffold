# Commit Message Tools

This project provides several tools to help you create properly formatted commit messages that follow our [Conventional Commits](COMMIT_CONVENTIONS.md) standards.

## Quick Start

### Option 1: Use the Auto-Generated Message (Easiest)
The `COMMIT_MESSAGE.txt` file is automatically updated when you commit or when you run the generator:

```bash
git commit -F COMMIT_MESSAGE.txt
```

### Option 2: Generate/Update Message Manually
Run the commit message generator anytime to update the suggestion:

```bash
pnpm run update-commit-msg
# or
pnpm run commit-msg
```

### Option 3: VS Code Tasks
Use the VS Code Command Palette (`Ctrl+Shift+P`) and run:
- **"Tasks: Run Task"** → **"Update Commit Message"** - Generates new message for current changes
- **"Tasks: Run Task"** → **"Generate Commit Message"** - Shows current suggested message
- **"Tasks: Run Task"** → **"Copy Commit Message to Clipboard"** - Copies message to clipboard

### Option 4: Manual Creation
Follow the [commit conventions](COMMIT_CONVENTIONS.md) to write your own message:

```bash
git commit -m "feat(scope): description of changes"
```

## Automatic Updates

The commit message system automatically updates in these scenarios:

- **After each commit**: If there are remaining changes, a new message is generated
- **On demand**: Run `pnpm run update-commit-msg` to refresh the suggestion
- **Validation**: Successful commits save their message for future reference

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