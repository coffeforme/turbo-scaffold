# `@repo/auth`

`@repo/auth` provides a shared authentication abstraction for web apps in this workspace.

## Included Providers

- `AzureAuthProvider` for Azure AD / Microsoft Entra sign-in with MSAL
- `FirebaseAuthProvider` for Firebase Auth popup sign-in flows
- `CustomApiAuthProvider` for your own backend using the fetch-based client from `@repo/api`
- `MixedAuthProvider` for SSO sign-in followed by backend authorization claims

## Persistence

All providers persist the normalized `AuthSession` via `@repo/persistence`.

By default, the shared auth session is stored in `sessionStorage` through `sessionStorageStore`, which is a better default for browser auth state than `localStorage` because it is scoped to the current browsing session.

That includes:

- access token
- refresh token
- ID token
- normalized user profile
- roles
- permissions
- claims

Useful exports:

```ts
import {
  AUTH_SESSION_STORAGE_KEY,
  clearPersistedSession,
  getPersistedSession,
  persistSession,
} from "@repo/auth";
```

## Normalized Session Shape

All providers return the same `AuthSession` structure:

```ts
type AuthSession = {
  accessToken?: string | null;
  refreshToken?: string | null;
  idToken?: string | null;
  issuedAt?: number;
  expiresAt?: number | null;
  provider: string;
  user?: {
    id: string;
    email?: string | null;
    name?: string | null;
    avatarUrl?: string | null;
    roles?: string[];
    permissions?: string[];
    claims?: Record<string, unknown>;
  } | null;
};
```

## Access Control

The package also exports:

- `AuthSessionProvider`
- `useAuthSession()`
- `AccessRight`
- `hasAccess()`

`AccessRight` can hide content, disable controls, redirect unauthorized users, or render a custom error component based on the persisted session and required roles or permissions.

## Example

```ts
import { AzureAuthProvider } from "@repo/auth";

const auth = new AzureAuthProvider({
  auth: {
    clientId: "<client-id>",
    authority: "https://login.microsoftonline.com/common",
    redirectUri: window.location.origin,
  },
});

await auth.initialize?.();
const session = await auth.signIn();
```

## AI Context

```yaml
package: "@repo/auth"
purpose: "Normalize authentication, persisted sessions, and authorization checks across multiple providers."
entrypoints:
  - "src/index.ts"
look_here_first:
  - "src/providers"
  - "src/react"
  - "src/sessionStorage.ts"
  - "src/access.ts"
structure:
  - "src/providers: auth providers"
  - "src/react: provider, hooks, restricted component"
  - "src/sessionStorage.ts: persisted session helpers"
  - "src/access.ts: role/permission/claim evaluation"
runtime_dependencies:
  - "@repo/api"
  - "@repo/persistence"
  - "react"
  - "firebase"
  - "@azure/msal-browser"
used_by:
  - "apps/web"
capabilities:
  - "Azure SSO provider"
  - "Firebase auth provider"
  - "Custom API auth provider"
  - "Mixed SSO plus backend-authorization provider"
  - "Persisted normalized sessions"
  - "Role, permission, and claim checks"
  - "AccessRight, AuthSessionProvider, useAuthSession"
session_storage_key: "repo.auth.session"
session_storage_backend: "sessionStorageStore from @repo/persistence"
```
