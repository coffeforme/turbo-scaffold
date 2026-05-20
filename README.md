# Turbo Monorepo Scaffold

Professional scaffold for decoupled web applications with React, Vite, Turbo, shared packages, provider-based auth, flexible state management, and Storybook-backed UI development.

## Table of Contents

- [Purpose](#purpose)
- [Core Ideas](#core-ideas)
- [Tech Highlights](#tech-highlights)
- [Quick Start](#quick-start)
- [Workspace Layout](#workspace-layout)
- [Package Docs](#package-docs)
- [Storybook](#storybook)
- [Auth and API Demo Surfaces](#auth-and-api-demo-surfaces)
- [Scaffold Integration](#scaffold-integration)
- [Commit Conventions](#commit-conventions)
- [AI Context](#ai-context)

## Purpose

This repository is a monorepo-first starting point for teams that want to build web applications with strong package boundaries, shared UI artifacts, and swappable runtime concerns such as state and authentication.

## Core Ideas

- apps and packages should stay clearly separated
- transport, auth, persistence, and state should be abstracted behind reusable interfaces
- UI artifacts should be shareable and documented in isolation
- teams should be able to start with working defaults and evolve implementations without reshaping feature code

This scaffold is opinionated about structure, but flexible about implementation choices inside that structure.

## Tech Highlights

- React + Vite for the main web app
- Turbo for workspace orchestration
- TypeScript across apps and packages
- Sass and SCSS Modules for styling
- Storybook for UI artifact development
- Express sample auth API for custom backend flows
- provider-based API and auth abstractions

## Quick Start

Install dependencies:

```sh
pnpm install
```

Run the main app:

```sh
pnpm --filter web dev
```

Run the sample auth API:

```sh
pnpm --filter auth-api dev
```

Run Storybook:

```sh
pnpm --filter storybook dev
```

Build everything:

```sh
pnpm build
```

## Workspace Layout

### Apps

- `apps/web`: main React + Vite application and integration surface for the shared packages
- `apps/auth-api`: sample Express API for custom and mixed authentication flows
- `apps/storybook`: isolated component showcase for `@repo/ui`

### Packages

- `packages/ui`: shared design system, charts, overlays, upload manager, and Storybook-backed UI artifacts
- `packages/state`: shared state layer with Redux, Zustand, and agnostic manager hooks
- `packages/hooks`: app-facing feature hooks composed from API and state
- `packages/api`: provider-based API client abstraction
- `packages/auth`: auth providers, session system, and authorization helpers
- `packages/infrastructure`: low-level HTTP and adapter implementations
- `packages/persistence`: browser persistence helpers
- `packages/math`: framework-agnostic math helpers
- `packages/types`: shared TypeScript contracts
- `packages/utils`: general utilities
- `packages/eslint-config`: shared linting presets
- `packages/typescript-config`: shared TypeScript presets

## Package Docs

Each package README includes:

- a short onboarding-focused purpose section
- tech highlights for maintenance and implementation choices
- current consumers
- implementation pointers
- an ending `AI Context` block for fast machine-readable refresh

Useful places to start:

- `packages/ui/README.md`
- `packages/auth/README.md`
- `packages/state/README.md`
- `packages/api/README.md`
- `apps/storybook/README.md`
- `apps/auth-api/README.md`

## Storybook

Storybook runs as its own app in `apps/storybook` and loads stories colocated with components in `packages/ui`.

Common commands:

```sh
pnpm --filter storybook dev
pnpm --filter storybook build
```

Storybook authoring guidance lives in `apps/storybook/README.md`.

## Auth and API Demo Surfaces

The workspace includes a full provider-based auth path:

- Azure SSO
- Firebase auth
- custom backend auth
- mixed SSO plus backend-authorization flow

Demo and implementation references:

- `packages/auth/README.md`
- `packages/api/README.md`
- `apps/auth-api/README.md`
- `apps/web/src/pages/static/AuthDemo/AuthDemo.tsx`

## Scaffold Integration

This repository is also intended to be exposed as a scaffold option in the broader scaffold tooling.

The deeper scaffold-tool alignment notes live in [SCAFFOLD_INTEGRATION.md](S:\coffee\workspaces\code\research\turbo-repo\my-turborepo\SCAFFOLD_INTEGRATION.md).

## Commit Conventions

This project follows [Conventional Commits](https://conventionalcommits.org/). See [COMMIT_CONVENTIONS.md](COMMIT_CONVENTIONS.md) for details.

Generate or refresh the local draft commit message with:

```sh
pnpm run update-commit-msg
```

Recommended commit flow:

```sh
git add .
pnpm run update-commit-msg
git commit -F COMMIT_MESSAGE.txt
```

`COMMIT_MESSAGE.txt` is a local draft file used by the repository tooling and is intentionally ignored by git.

## AI Context

```yaml
repo: "turbo-monorepo-scaffold"
purpose: "Monorepo scaffold for package-based web applications."
apps:
  - "apps/web: main app"
  - "apps/auth-api: auth demo backend"
  - "apps/storybook: UI showcase"
packages:
  - "@repo/ui: design system"
  - "@repo/state: Redux, Zustand, agnostic hooks"
  - "@repo/hooks: feature hooks"
  - "@repo/api: provider-based API client"
  - "@repo/auth: auth, sessions, access checks"
  - "@repo/infrastructure: low-level adapters"
  - "@repo/persistence: browser storage helpers"
  - "@repo/math: small helpers"
  - "@repo/types: shared contracts"
  - "@repo/utils: generic utilities"
  - "@repo/eslint-config: lint presets"
  - "@repo/typescript-config: tsconfig presets"
look_here_first:
  - "README.md"
  - "packages/ui/README.md"
  - "packages/auth/README.md"
  - "packages/state/README.md"
  - "packages/api/README.md"
tech_highlights:
  - "React + Vite"
  - "Turbo"
  - "TypeScript"
  - "Sass"
  - "Storybook"
  - "Provider-based auth and API"
```
