# `Turborepo` Vite starter

This is a community-maintained example. If you experience a problem, please submit a pull request with a fix. GitHub Issues will be closed.

## Commit Conventions

This project follows [Conventional Commits](https://conventionalcommits.org/) for consistent and meaningful commit messages. See [COMMIT_CONVENTIONS.md](COMMIT_CONVENTIONS.md) for details.

### Quick Commit
After making changes, use the auto-commit feature:

```sh
git add .
pnpm run auto-commit-msg
```

Or generate a new one anytime:
```sh
pnpm run update-commit-msg
```

### VS Code Integration
Use the built-in VS Code tasks for commit message management:
- **Update Commit Message**: Generate a new commit message
- **Generate Commit Message**: View current message
- **Copy Commit Message to Clipboard**: Copy message for manual commit

The commit message automatically updates before and after each commit.

## Using this example

Run the following command:

```sh
npx create-turbo@latest -e with-vite-react
```

## What's inside?

This Turborepo includes the following packages and apps:

### Apps and Packages

- `web`: React [Vite](https://vitejs.dev) TypeScript app
- `@repo/ui`: shared UI component library used by `web`
- `@repo/eslint-config`: shared ESLint configuration package
- `@repo/typescript-config`: shared TypeScript config package
- `@repo/hooks`: shared React hook utilities package
- `@repo/math`: shared math utility package
- `@repo/state`: shared state management package
- `@repo/types`: shared type definitions package
- `@repo/api`: shared API utilities package
- `@repo/persistence`: shared persistence utilities package
- `@repo/utils`: shared utility functions package
- `@repo/infrastructure`: shared infrastructure utilities package

Each package and app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### UI Components

The `@repo/ui` package provides a component library organized using Atomic Design principles:

#### Atoms (Basic UI Elements)
- **Button**: Basic button component
- **Rating**: Interactive star rating component (1-5 stars)

#### Molecules (Simple Components)
- **Counter**: Number display with increment functionality

#### Organisms (Complex Components)
- **Header**: Page header with title
- **FeedbackForm**: Complete feedback form with rating, category selection, and comments

#### Usage Example
```tsx
import { Button, Rating, FeedbackForm } from '@repo/ui';

// Basic components
<Button>Click me</Button>
<Rating value={3} onChange={setRating} />

// Complex organism
<FeedbackForm
  formData={feedbackData}
  updateField={updateField}
  onSubmit={handleSubmit}
  // ... other props
/>
```
