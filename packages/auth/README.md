# `@repo/auth`

`@repo/auth` provides a shared authentication abstraction for web apps in this workspace.

## Architecture

The package is split into three practical layers:

- provider implementations that know how to authenticate with Azure, Firebase, your own backend, or a mixed SSO-plus-authorization flow
- session utilities that normalize and persist the current auth session
- React helpers that expose the session and provider system to app code

That means app pages can focus on user flows while the package keeps provider-specific details in one place.

## Included Providers

- `AzureAuthProvider` for Azure AD / Microsoft Entra sign-in with MSAL
- `FirebaseAuthProvider` for Firebase Auth popup sign-in flows
- `CustomApiAuthProvider` for your own backend using the fetch-based client from `@repo/api`
- `MixedAuthProvider` for SSO sign-in followed by backend authorization claims

## System Provider Layer

`AuthProviderSystem` is the component responsible for creating auth provider instances for the current app session.

It holds:

- the active provider kind
- provider-specific configuration for Azure, Firebase, and custom API auth
- helpers to `createProvider()`, `prepareProvider()`, `getActiveProvider()`, and `resetProvider()`

This is the right place for provider creation because it keeps that concern in the app’s system boundary instead of scattering it through pages.

Typical app setup:

```tsx
import { AuthProviderSystem, AuthSessionProvider } from "@repo/auth";

export function SystemProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProviderSystem>
      <AuthSessionProvider>{children}</AuthSessionProvider>
    </AuthProviderSystem>
  );
}
```

Then page-level code can consume the provider system with:

```ts
import { useAuthProviderSystem } from "@repo/auth";

const { providerKind, prepareProvider } = useAuthProviderSystem();
```

## Session Layer

`AuthSessionProvider` owns the shared normalized session state for the app.

It is responsible for:

- hydrating the current session from persistence on startup
- exposing `session`, `setSession`, `clearSession`, and `refreshSession`
- making access checks available through the shared auth context
- synchronizing session changes with browser storage

Useful exports:

```ts
import {
  AuthSessionProvider,
  useAuthSession,
  AUTH_SESSION_STORAGE_KEY,
  clearPersistedSession,
  getPersistedSession,
  persistSession,
} from "@repo/auth";
```

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

## Provider Responsibilities

Each provider shares the same contract:

- `signIn()`
- `signOut()`
- `getSession()`
- `getAccessToken()`
- `isAuthenticated()`
- optional `initialize()`

What differs is the external system they talk to:

- `AzureAuthProvider` handles MSAL popup login and silent token acquisition
- `FirebaseAuthProvider` handles popup-based Firebase identity providers
- `CustomApiAuthProvider` delegates auth to your own backend through `@repo/api`
- `MixedAuthProvider` composes an identity provider and the custom API provider so SSO can be followed by app-specific authorization claims

## Access Control

The package also exports:

- `AuthSessionProvider`
- `AuthProviderSystem`
- `useAuthProviderSystem()`
- `useAuthSession()`
- `AccessRight`
- `hasAccess()`

`AccessRight` can hide content, disable controls, redirect unauthorized users, or render a custom error component based on the shared session and required roles or permissions.

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

## React Usage Example

```tsx
import { useAuthProviderSystem, useAuthSession } from "@repo/auth";

function LoginAction() {
  const { prepareProvider, providerKind } = useAuthProviderSystem();
  const { setSession } = useAuthSession();

  async function handleLogin() {
    const provider = await prepareProvider();
    const session =
      providerKind === "custom-api"
        ? await provider.signIn({ email: "user@example.com", password: "secret" })
        : await provider.signIn(undefined);

    setSession(session);
  }

  return <button onClick={handleLogin}>Sign In</button>;
}
```

## AI Context

```yaml
package: "@repo/auth"
purpose: "Normalize authentication, persisted sessions, and authorization checks across multiple providers."
entrypoints:
  - "src/index.ts"
look_here_first:
  - "src/react/AuthProviderSystem.tsx"
  - "src/react/AuthSessionProvider.tsx"
  - "src/providers"
  - "src/sessionStorage.ts"
  - "src/access.ts"
structure:
  - "src/providers: auth providers"
  - "src/react/AuthProviderSystem.tsx: app-level provider creation and auth configuration context"
  - "src/react/AuthSessionProvider.tsx: normalized session state and persistence bridge"
  - "src/react/AccessRight.tsx: component-level authorization effects"
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
  - "App-level auth provider system context"
  - "Persisted normalized sessions"
  - "Role, permission, and claim checks"
  - "AccessRight, AuthSessionProvider, useAuthSession, useAuthProviderSystem"
session_storage_key: "repo.auth.session"
session_storage_backend: "sessionStorageStore from @repo/persistence"
app_integration_pattern:
  - "Wrap the app with AuthProviderSystem before AuthSessionProvider"
  - "Use useAuthProviderSystem in pages that need to create or prepare provider instances"
  - "Use useAuthSession for the current normalized session"
```
