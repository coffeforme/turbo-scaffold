# `@repo/auth`

Shared authentication and authorization package for the workspace, designed to normalize sessions and access checks across multiple identity providers.

## Purpose

Use this package when apps need one consistent auth surface even though sign-in may come from Azure, Firebase, a custom backend, or a mixed SSO-plus-authorization flow.

## Tech Highlights

- Azure provider built on `@azure/msal-browser`
- Firebase provider built on `firebase/auth`
- custom API provider built on `@repo/api`
- mixed provider for SSO identity plus backend authorization claims
- persisted normalized sessions via `@repo/persistence`
- React system providers for provider creation and session state
- `AccessRight` for hide, disable, redirect, and error effects

## Consumed By

- `apps/web`

## Implementation References

- provider system: `src/react/AuthProviderSystem.tsx`
- session system: `src/react/AuthSessionProvider.tsx`
- access checks: `src/react/AccessRight.tsx`, `src/access.ts`
- provider implementations: `src/providers`
- persisted session helpers: `src/sessionStorage.ts`
- web demo page: `apps/web/src/pages/static/AuthDemo/AuthDemo.tsx`
- custom backend sample: `apps/auth-api/src/index.ts`

## Architecture

The package is split into three practical layers:

- provider implementations that know how to authenticate with Azure, Firebase, your own backend, or a mixed flow
- session utilities that normalize and persist the current auth session
- React helpers that expose the session and provider system to app code

## Included Providers

- `AzureAuthProvider`
- `FirebaseAuthProvider`
- `CustomApiAuthProvider`
- `MixedAuthProvider`

## System Provider Layer

`AuthProviderSystem` owns app-level provider creation for the current runtime session.

It keeps:

- the active provider kind
- provider configuration
- helpers to `createProvider()`, `prepareProvider()`, `getActiveProvider()`, and `resetProvider()`

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

## Session Layer

`AuthSessionProvider` owns the normalized session for the app and is responsible for:

- hydrating persisted session data on startup
- exposing `session`, `setSession`, `clearSession`, and `refreshSession`
- synchronizing session changes with browser storage
- making authorization-aware UI checks possible through the shared context

## Persistence

All providers persist the normalized `AuthSession` through `@repo/persistence`.

Default behavior:

- storage key: `repo.auth.session`
- storage backend: `sessionStorageStore`

Stored session data includes:

- access token
- refresh token
- ID token
- normalized user profile
- roles
- permissions
- claims

## Access Control

The package exports:

- `AuthSessionProvider`
- `AuthProviderSystem`
- `useAuthProviderSystem()`
- `useAuthSession()`
- `AccessRight`
- `hasAccess()`

`AccessRight` can:

- hide content
- disable controls
- redirect unauthorized users
- render a custom error component

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
  - "src/react/AccessRight.tsx"
  - "src/providers"
  - "src/sessionStorage.ts"
  - "src/access.ts"
structure:
  - "src/providers: auth providers"
  - "src/react/AuthProviderSystem.tsx: app-level provider creation and auth configuration context"
  - "src/react/AuthSessionProvider.tsx: normalized session state and persistence bridge"
  - "src/react/AccessRight.tsx: component-level authorization effects"
  - "src/sessionStorage.ts: persisted session helpers"
  - "src/access.ts: role, permission, and claim evaluation"
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
implementation_refs:
  - "apps/web/src/pages/static/AuthDemo/AuthDemo.tsx"
  - "apps/auth-api/src/index.ts"
session_storage_key: "repo.auth.session"
session_storage_backend: "sessionStorageStore from @repo/persistence"
app_integration_pattern:
  - "Wrap the app with AuthProviderSystem before AuthSessionProvider"
  - "Use useAuthProviderSystem where provider instances must be created or prepared"
  - "Use useAuthSession for the current normalized session"
```
