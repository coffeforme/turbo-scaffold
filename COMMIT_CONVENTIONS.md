# Commit Message Conventions

This project follows the [Conventional Commits](https://conventionalcommits.org/) specification to ensure consistent and meaningful commit messages.

## Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to our CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit
- **enhance**: Enhance a funtionality

## Scopes

For this monorepo, use the full package path as scope when the change is specific to a package:

- `apps/web`: Changes to the web application
- `packages/auth`: Changes to the auth package
- `packages/hooks`: Changes to the hooks package
- `packages/math`: Changes to the math utilities package
- `packages/state`: Changes to the state management package
- `packages/types`: Changes to the TypeScript definitions package
- `packages/ui`: Changes to the UI components package
- `packages/eslint-config`: Changes to the ESLint configuration package
- `packages/typescript-config`: Changes to the TypeScript configuration package
- `root`: Changes that affect the entire monorepo (root configuration, CI/CD, etc.)

## Examples

```
feat: Add user authentication
fix: Resolve memory leak in data fetching
docs: Update API documentation
feat(packages/auth): Add new OAuth provider
fix(apps/web): Correct button styling in mobile view
refactor(packages/state): Simplify Redux slice structure
test: Add unit tests for contact validation
build: Update TypeScript configuration
ci: Update Husky git hooks
chore: Update dependencies
```

## Breaking Changes

To indicate a breaking change, add an exclamation mark after the type/scope:

```
feat!: remove deprecated API endpoints
fix(api)!: change response format for user data
```

Or include `BREAKING CHANGE:` in the footer:

```
feat: update authentication flow

BREAKING CHANGE: The login method now requires an additional parameter
```

## Why Conventional Commits?

- **Automated Versioning**: Tools like semantic-release can automatically determine version bumps
- **Clear History**: Makes it easier to understand what changed and why
- **Automated Changelogs**: Generate changelogs automatically from commit messages
- **Better Collaboration**: Consistent format across all contributors

## Tools

This project uses:
- **commitlint**: To validate commit messages
- **husky**: To run git hooks automatically
- **Local commit draft**: `COMMIT_MESSAGE.txt` is ignored by git and kept local to each contributor

## Validation

Commit messages are automatically validated using commitlint. If your commit message doesn't follow the convention, it will be rejected with helpful error messages.
