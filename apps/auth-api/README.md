# `auth-api`

Sample Express API used to exercise the custom and mixed authentication providers from the workspace.

## Purpose

This app exists as a local backend reference for onboarding, auth-provider testing, and maintenance of the custom auth flow without depending on an external service.

## Tech Highlights

- Express-based auth demo backend
- implements the default `CustomAuthEndpoints`
- supports local development for `CustomApiAuthProvider` and `MixedAuthProvider`

## Consumed By

- `packages/auth`
- `apps/web` auth demo page

## Implementation References

- server implementation: `src/index.ts`
- auth provider consumer: `packages/auth/src/providers/CustomApiAuthProvider.ts`
- mixed provider consumer: `packages/auth/src/providers/MixedAuthProvider.ts`
- web demo consumer: `apps/web/src/pages/static/AuthDemo/AuthDemo.tsx`

## Run

Use one of these commands from the repo root:

```sh
pnpm --filter auth-api dev
pnpm run dev:auth-api
```

The error from `pnpm --filter auth-api` happens because `--filter` only scopes the command. It does not execute a script by itself.

## Endpoints

- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/session`
- `POST /auth/refresh`

The default local URL used by the web auth demo is `http://localhost:4001`.

## AI Context

```yaml
app: "auth-api"
purpose: "Local Express sample backend for the custom and mixed auth flows."
entrypoints:
  - "src/index.ts"
look_here_first:
  - "src/index.ts"
used_by:
  - "packages/auth"
  - "apps/web"
capabilities:
  - "Implements POST /auth/login"
  - "Implements POST /auth/logout"
  - "Implements GET /auth/session"
  - "Implements POST /auth/refresh"
integration_refs:
  - "packages/auth/src/providers/CustomApiAuthProvider.ts"
  - "packages/auth/src/providers/MixedAuthProvider.ts"
  - "apps/web/src/pages/static/AuthDemo/AuthDemo.tsx"
```
