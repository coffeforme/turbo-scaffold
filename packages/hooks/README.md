# `@repo/hooks`

Shared business and UI hooks consumed by the web app.

## What Lives Here

This package composes the lower-level workspace packages into feature-ready hooks.

- `src/data` contains app-facing hooks for forms and page data
- `src/api` contains hooks that talk to backend-oriented APIs

## Guidance

Keep hooks here when they combine state, API, and view concerns for consumers like `apps/web`. If a hook is just a generic React utility, it likely belongs somewhere else.

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
```
