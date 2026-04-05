# Commit Message Tools

This project provides tools to help you create commit messages that follow our [Conventional Commits](COMMIT_CONVENTIONS.md) standards.

## Workflow

This repository uses a local draft file, `COMMIT_MESSAGE.txt`, which is ignored by git and kept local to each contributor.

### Recommended flow
1. Stage your changes:
   ```bash
git add .
```
2. Generate or refresh the commit message:
   ```bash
pnpm run update-commit-msg
```
3. Commit using the generated message:
   ```bash
git commit -F COMMIT_MESSAGE.txt
```

### Manual commit option
If you prefer to write your own message instead of using the draft file:
```bash
git commit -m "feat(scope): description of changes"
```

## VS Code Tasks
Use these tasks from the Command Palette or Tasks explorer:
- **Generate Commit Message**: Display the current `COMMIT_MESSAGE.txt` contents
- **Update Commit Message**: Regenerate the message based on staged changes
- **Copy Commit Message to Clipboard**: Copy the generated message for manual commit

## Hooks and validation
- **pre-commit**: Generates/updates the draft message for staged changes
- **post-commit**: Regenerates the draft for any remaining staged changes
- **commit-msg**: Validates the final commit message format

## What changed
- Removed automatic commit behavior. You now choose when to commit.
- `COMMIT_MESSAGE.txt` is intentionally ignored by git so each contributor keeps their own draft.
- There is no watch mode or automatic auto-commit command in the current workflow.

## Available tools
- `COMMIT_MESSAGE.txt` — local draft commit message
- `scripts/generate-commit-message.js` — message generator
- `.vscode/tasks.json` — VS Code tasks for generating and viewing messages
- `.husky/pre-commit` — updates the message before commit
- `.husky/post-commit` — refreshes the message after a commit
- `.husky/commit-msg` — validates commit format

## Example usage

### Generate and commit
```bash
git add .
pnpm run update-commit-msg
git commit -F COMMIT_MESSAGE.txt
```

### Write your own message
```bash
git commit -m "fix(packages/state): update counter reducer handling"
```

## Need help?
- Read the full [Commit Conventions Guide](COMMIT_CONVENTIONS.md)
- Open `COMMIT_MESSAGE.txt` to review the current suggested message
- Run `pnpm run update-commit-msg` whenever staged changes change
