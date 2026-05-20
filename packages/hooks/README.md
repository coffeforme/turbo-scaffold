# `@repo/hooks`

Shared feature hooks that compose state, API, and UI concerns into app-facing behavior.

## Purpose

Use this package when a hook belongs to product behavior rather than to a low-level utility or a single package implementation detail.

## Tech Highlights

- form hooks built on shared state
- API-facing hooks built on `@repo/api`
- app-ready feature composition for `apps/web`

## Consumed By

- `apps/web`

## Implementation References

- feature/data hooks: `src/data`
- API hooks: `src/api`
- primary consumer: `apps/web`

## What Lives Here

- `src/data` contains app-facing hooks for forms and page data
- `src/api` contains hooks that talk to backend-oriented APIs

## AI Context

```yaml
package: "@repo/hooks"
purpose: "Compose feature hooks from API, state, and UI concerns for app consumption."
entrypoints:
  - "src/index.ts"
look_here_first:
  - "src/data"
  - "src/api"
structure:
  - "src/data: feature and form hooks"
  - "src/api: hooks that call backend-facing APIs"
runtime_dependencies:
  - "@repo/api"
  - "@repo/state"
  - "react"
used_by:
  - "apps/web"
capabilities:
  - "Home page feature hooks"
  - "Contact form hooks"
  - "Feedback form hooks"
  - "API-facing request hooks"
implementation_refs:
  - "apps/web/src/pages/static/Home/Home.tsx"
  - "apps/web/src/pages/static/AuthDemo/AuthDemo.tsx"
```
