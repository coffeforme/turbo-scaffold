# `@repo/persistence`

Shared persistence helpers for browser storage.

## What It Provides

This package exposes three browser-focused persistence utilities:

- `localStorageStore` for longer-lived client preferences
- `sessionStorageStore` for tab-scoped or session-scoped state
- `cookieStorage` for cookie-based persistence when path, expiry, or browser/server boundaries matter

There is also a backward-compatible `storage` export that maps to `localStorageStore`.

## Recommended Usage

- Use `localStorageStore` for UI preferences like theme, dismissals, or cached view settings.
- Use `sessionStorageStore` for auth session snapshots and state that should clear with the browser tab or session.
- Use `cookieStorage` when you need cookie semantics like expiry, `SameSite`, path scoping, or interoperability with backend expectations.

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
structure:
  - "src/index.ts"
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
```
