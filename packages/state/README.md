# `@repo/state`

Shared state package that exposes one normalized surface while allowing Redux Toolkit, Zustand, and agnostic manager hooks to coexist.

## Purpose

Use this package when feature code should stay stable even if the underlying state implementation changes.

## Tech Highlights

- Redux Toolkit implementation
- Zustand implementation
- agnostic provider and hook layer
- runtime switching between Redux and Zustand

## Consumed By

- `@repo/hooks`
- `apps/web`

## Implementation References

- shared contracts and selectors: `src/shared`
- Redux implementation: `src/redux`
- Zustand implementation: `src/zustand`
- agnostic manager hooks: `src/managers`
- main demo page: `apps/web/src/pages/static/Home/Home.tsx`

## Current Features

- counter state
- contact form state
- feedback form state
- implementation-agnostic hooks for app consumption

## AI Context

```yaml
package: "@repo/state"
purpose: "Expose one normalized state surface while allowing Redux, Zustand, or an agnostic manager layer."
entrypoints:
  - "src/index.ts"
look_here_first:
  - "src/shared"
  - "src/redux"
  - "src/zustand"
  - "src/managers"
structure:
  - "src/shared: contracts, selectors, shared types"
  - "src/redux: Redux implementation"
  - "src/zustand: Zustand implementation"
  - "src/managers: implementation-agnostic hooks and provider"
runtime_dependencies:
  - "react"
  - "@reduxjs/toolkit"
  - "zustand"
used_by:
  - "@repo/hooks"
  - "apps/web"
capabilities:
  - "Counter state"
  - "Contact form state"
  - "Feedback form state"
  - "Runtime switching between Redux and Zustand"
  - "Agnostic hooks hiding the underlying implementation"
implementation_refs:
  - "apps/web/src/pages/static/Home/Home.tsx"
```
