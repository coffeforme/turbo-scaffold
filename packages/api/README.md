# `@repo/api`

Provider-based API client surface for browser-facing packages that should not care whether requests are executed through `fetch`, Axios, or a custom transport.

## Purpose

Use this package when feature code should depend on one stable API contract while transport concerns stay replaceable and centralized.

## Tech Highlights

- fetch-backed client factory
- axios-backed client factory
- custom `HttpProvider` injection
- request option forwarding for headers and auth metadata
- clean fit with `@repo/auth` custom backend providers

## Consumed By

- `@repo/auth`
- `@repo/hooks`
- browser apps or packages that want a provider-based API abstraction

## Implementation References

- entrypoint: `src/index.ts`
- transport contracts and implementations: `@repo/infrastructure`
- custom auth backend example: `apps/auth-api`
- auth integration example: `packages/auth/src/providers/CustomApiAuthProvider.ts`

## Quick Start

```ts
import { createFetchApiClient } from "@repo/api";

const api = createFetchApiClient("https://api.example.com");
const profile = await api.get<{ id: string; email: string }>("/me");
```

## Factories

### Fetch

```ts
import { createFetchApiClient } from "@repo/api";

const api = createFetchApiClient("https://api.example.com");
await api.post("/contact", { name: "Ada" });
```

### Axios

```ts
import { createAxiosApiClient } from "@repo/api";

const api = createAxiosApiClient("https://api.example.com");
await api.get("/health");
```

### Custom Provider

```ts
import { createApiClientWithProvider } from "@repo/api";
import { FetchHttpProvider } from "@repo/infrastructure";

const provider = new FetchHttpProvider("https://api.example.com");
const api = createApiClientWithProvider(provider);
```

## Request Options

```ts
const api = createFetchApiClient("https://api.example.com");

await api.get("/auth/session", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

## AI Context

```yaml
package: "@repo/api"
purpose: "Single API client surface with swappable HTTP transport providers."
entrypoints:
  - "src/index.ts"
look_here_first:
  - "src/index.ts"
  - "../infrastructure/src/http"
structure:
  - "src/index.ts: API client factories and shared surface"
runtime_dependencies:
  - "@repo/infrastructure"
used_by:
  - "@repo/auth"
  - "@repo/hooks"
  - "Browser apps needing provider-based API access"
capabilities:
  - "Fetch-backed API client factory"
  - "Axios-backed API client factory"
  - "Custom provider injection"
  - "Request option forwarding for auth headers"
implementation_refs:
  - "packages/auth/src/providers/CustomApiAuthProvider.ts"
  - "apps/auth-api/src/index.ts"
```
