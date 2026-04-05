# `Turborepo` Vite starter

This is a community-maintained example. If you experience a problem, please submit a pull request with a fix. GitHub Issues will be closed.

## Commit Conventions

This project follows [Conventional Commits](https://conventionalcommits.org/) for consistent and meaningful commit messages. See [COMMIT_CONVENTIONS.md](COMMIT_CONVENTIONS.md) for details.

### Quick Commit
After making changes, use the auto-generated commit message:

```sh
git commit -F COMMIT_MESSAGE.txt
```

Or generate a new one:
```sh
pnpm run commit-msg
```

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
- `@repo/state`: shared Redux state package
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
