# `@repo/infrastructure`

Low-level adapter package for transport providers and other implementation details that higher-level packages should consume instead of duplicating.

## Purpose

Use this package when code is too close to transport, provider wiring, or environment-specific adapter logic to belong in feature packages.

## Tech Highlights

- fetch HTTP provider
- axios HTTP provider
- shared `HttpProvider` contracts
- legacy auth-related provider pieces kept below the newer `@repo/auth` layer

## Consumed By

- `@repo/api`

## Implementation References

- HTTP providers: `src/http`
- shared types: `src/types.ts`
- legacy auth helpers: `src/auth`

## AI Context

```yaml
package: "@repo/infrastructure"
purpose: "Own transport and adapter details that higher-level packages should not reimplement."
entrypoints:
  - "src/index.ts"
look_here_first:
  - "src/http"
  - "src/types.ts"
  - "src/auth"
structure:
  - "src/http: fetch and axios providers"
  - "src/auth: legacy auth providers"
  - "src/types.ts: shared provider interfaces"
runtime_dependencies:
  - "axios"
  - "@azure/msal-browser"
used_by:
  - "@repo/api"
capabilities:
  - "Fetch HTTP provider"
  - "Axios HTTP provider"
  - "Shared HttpProvider interface"
  - "Legacy auth provider implementations"
```
