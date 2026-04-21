# `@repo/api`

`@repo/api` provides a small API client abstraction over pluggable HTTP providers.

## What It Solves

Use this package when you want application code to depend on a single API client shape while still choosing how requests are executed underneath.

Current options:

- `createFetchApiClient(baseUrl)` for the native `fetch` provider
- `createAxiosApiClient(baseUrl)` for the Axios provider
- `createApiClientWithProvider(provider)` when you want to inject your own `HttpProvider`

## Quick Start

```ts
import { createFetchApiClient } from "@repo/api";

const api = createFetchApiClient("https://api.example.com");

const profile = await api.get<{ id: string; email: string }>("/me");
```

## Available Factories

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

## Passing Request Options

The `ApiClient` forwards request options to the underlying provider. That makes it easy to attach headers for authenticated requests:

```ts
const api = createFetchApiClient("https://api.example.com");

await api.get("/auth/session", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

## Custom Auth Backend Example

The new `@repo/auth` custom provider uses the fetch-based client from this package:

```ts
import { CustomApiAuthProvider } from "@repo/auth";

const auth = new CustomApiAuthProvider({
  baseUrl: "https://api.example.com",
  endpoints: {
    login: "/auth/login",
    logout: "/auth/logout",
    session: "/auth/session",
    refresh: "/auth/refresh",
  },
});

await auth.signIn({
  email: "user@example.com",
  password: "secret",
});
```

That keeps backend authentication flows aligned with the same provider abstraction used elsewhere in the workspace.

For local testing, the repo includes a sample Express implementation in `apps/auth-api` that exposes the default `CustomAuthEndpoints`.

## AI Context

```yaml
package: "@repo/api"
purpose: "Single API client surface with swappable HTTP transport providers."
entrypoints:
  - "src/index.ts"
structure:
  - "src/index.ts"
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
integration_notes:
  - "CustomApiAuthProvider relies on this package."
  - "apps/auth-api implements the default custom auth endpoints for local testing."
```
