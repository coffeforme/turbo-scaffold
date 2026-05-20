# `@repo/state`

Shared state package with parallel Redux Toolkit and Zustand implementations behind one common contract.

## What It Solves

This package lets the app use one normalized state surface while choosing the underlying implementation.

- `src/redux` contains the Redux Toolkit version
- `src/zustand` contains the Zustand version
- `src/managers` contains the agnostic provider and hooks
- `src/shared` holds contracts, selectors, and shared state types

## Current Features

The package currently supports:

- counter state
- contact form state
- feedback form state
- Zustand-backed TODOs provider for page-level workflow state
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
  - "Zustand-backed TODOs provider for page-level workflow state"
  - "Runtime switching between Redux and Zustand"
  - "Agnostic hooks hiding the underlying implementation"
implementation_refs:
  - "apps/web/src/pages/static/Home/Home.tsx"
  - "apps/web/src/pages/static/Todos/Todos.tsx"
```
