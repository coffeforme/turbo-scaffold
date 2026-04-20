# `@repo/infrastructure`

Low-level provider implementations used by higher-level packages like `@repo/api`.

## What Belongs Here

Use this package for transport adapters and low-level provider details that higher-level packages should consume rather than reimplement.

Current focus areas:

- fetch HTTP provider
- axios HTTP provider
- shared `HttpProvider` contracts

The auth-related code here should be treated as lower-level or legacy support compared with the newer abstractions in `@repo/auth`.

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
