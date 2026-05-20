# `@repo/persistence`

Shared browser persistence helpers for app and package state that should survive page changes, sessions, or cookie boundaries.

## Purpose

Use this package instead of calling `localStorage`, `sessionStorage`, or `document.cookie` directly inside feature code.

## Tech Highlights

- typed `localStorageStore`
- typed `sessionStorageStore`
- `cookieStorage` with expiry and path options
- graceful no-op behavior when browser APIs are unavailable

## Consumed By

- `@repo/auth`
- browser-facing packages that need persisted client state

## Implementation References

- `src/index.ts`
- auth session usage: `packages/auth/src/sessionStorage.ts`

## Recommended Usage

- `localStorageStore` for longer-lived client preferences
- `sessionStorageStore` for auth sessions and tab-scoped state
- `cookieStorage` when cookie semantics or backend interoperability matter

## Example

```ts
import { cookieStorage, localStorageStore, sessionStorageStore } from "@repo/persistence";

localStorageStore.set("repo.ui.theme", { mode: "light" });
sessionStorageStore.set("repo.auth.session", { provider: "custom-api" });

cookieStorage.set("repo.banner.dismissed", true, {
  path: "/",
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 30,
});
```

## AI Context

```yaml
package: "@repo/persistence"
purpose: "Reusable browser persistence helpers with explicit localStorage, sessionStorage, and cookie APIs."
entrypoints:
  - "src/index.ts"
look_here_first:
  - "src/index.ts"
structure:
  - "src/index.ts: browser persistence helpers"
runtime_dependencies: []
used_by:
  - "@repo/auth"
  - "Any browser-facing package needing persisted state"
capabilities:
  - "Typed localStorage helper"
  - "Typed sessionStorage helper"
  - "Cookie helper with path, expiry, SameSite, and secure options"
  - "Graceful no-op when browser APIs are unavailable"
defaults:
  - "`storage` aliases `localStorageStore` for backward compatibility"
recommended_usage:
  localStorageStore: "Longer-lived client preferences"
  sessionStorageStore: "Session-scoped auth and tab-bound state"
  cookieStorage: "Cookie-bound data with expiry or backend/browser interoperability"
implementation_refs:
  - "packages/auth/src/sessionStorage.ts"
```
