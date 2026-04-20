import { useRef, useState, type FormEvent } from "react";
import {
  AccessRight,
  AzureAuthProvider,
  CustomApiAuthProvider,
  FirebaseAuthProvider,
  MixedAuthProvider,
  type AuthProvider,
  type FirebaseProviderKind,
  useAuthSession,
} from "@repo/auth";
import { Button, Header, Label, LoginForm, Select } from "@repo/ui";
import styles from "./AuthDemo.module.scss";

type ProviderKind = "custom-api" | "azure" | "firebase" | "mixed";

const providerKindBySession: Record<string, ProviderKind> = {
  azure: "azure",
  "custom-api": "custom-api",
  firebase: "firebase",
  "mixed-auth": "mixed",
};

const splitScopes = (value: string) =>
  value
    .split(",")
    .map((scope) => scope.trim())
    .filter(Boolean);

const AuthDemo = () => {
  const { session, setSession: persistSession, clearSession, refreshSession } = useAuthSession();
  const providerRef = useRef<AuthProvider<any> | null>(null);
  const [providerKind, setProviderKind] = useState<ProviderKind>("custom-api");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [azureConfig, setAzureConfig] = useState({
    clientId: "",
    authority: "https://login.microsoftonline.com/common",
    redirectUri: window.location.origin,
    scopes: "User.Read",
  });

  const [firebaseConfig, setFirebaseConfig] = useState({
    apiKey: "",
    authDomain: "",
    projectId: "",
    appId: "",
    provider: "google" as FirebaseProviderKind,
    scopes: "email,profile",
  });

  const [customApiConfig, setCustomApiConfig] = useState({
    baseUrl: "http://localhost:4001",
    email: "",
    password: "",
    loginPath: "/auth/login",
    logoutPath: "/auth/logout",
    sessionPath: "/auth/session",
    refreshPath: "/auth/refresh",
  });

  const isAuthenticated = Boolean(session?.user);

  const createProvider = (kind: ProviderKind = providerKind): AuthProvider<any> => {
    switch (kind) {
      case "azure":
        return new AzureAuthProvider(
          {
            auth: {
              clientId: azureConfig.clientId,
              authority: azureConfig.authority,
              redirectUri: azureConfig.redirectUri,
            },
          },
          {
            scopes: splitScopes(azureConfig.scopes),
          },
        );
      case "firebase":
        return new FirebaseAuthProvider({
          firebaseConfig: {
            apiKey: firebaseConfig.apiKey,
            authDomain: firebaseConfig.authDomain,
            projectId: firebaseConfig.projectId,
            appId: firebaseConfig.appId,
          },
          provider: firebaseConfig.provider,
          scopes: splitScopes(firebaseConfig.scopes),
        });
      case "mixed":
        return new MixedAuthProvider({
          identityProvider: new AzureAuthProvider(
            {
              auth: {
                clientId: azureConfig.clientId,
                authority: azureConfig.authority,
                redirectUri: azureConfig.redirectUri,
              },
            },
            {
              scopes: splitScopes(azureConfig.scopes),
            },
          ),
          authorizationProvider: new CustomApiAuthProvider({
            baseUrl: customApiConfig.baseUrl,
            endpoints: {
              login: customApiConfig.loginPath,
              logout: customApiConfig.logoutPath,
              session: customApiConfig.sessionPath,
              refresh: customApiConfig.refreshPath,
            },
          }),
        });
      case "custom-api":
      default:
        return new CustomApiAuthProvider({
          baseUrl: customApiConfig.baseUrl,
          endpoints: {
            login: customApiConfig.loginPath,
            logout: customApiConfig.logoutPath,
            session: customApiConfig.sessionPath,
            refresh: customApiConfig.refreshPath,
          },
        });
    }
  };

  const prepareProvider = async () => {
    const provider = createProvider();
    providerRef.current = provider;

    if (provider.initialize) {
      await provider.initialize();
    }

    return provider;
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const provider = await prepareProvider();
      const nextSession =
        providerKind === "custom-api"
          ? await provider.signIn({
              email: customApiConfig.email,
              password: customApiConfig.password,
            })
          : providerKind === "mixed"
            ? await provider.signIn(undefined)
          : providerKind === "firebase"
            ? await provider.signIn({
                provider: firebaseConfig.provider,
                scopes: splitScopes(firebaseConfig.scopes),
              })
            : await provider.signIn(undefined);

      persistSession(nextSession);
      setSuccessMessage(`Authenticated with ${provider.name}.`);
    } catch (nextError) {
      clearSession();
      setError(nextError instanceof Error ? nextError.message : "Authentication failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckSession = async () => {
    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (session) {
        refreshSession();
        return;
      }

      const provider = providerRef.current ?? (await prepareProvider());
      const nextSession = await provider.getSession();

      if (!nextSession) {
        clearSession();
        setSuccessMessage("No active session was found.");
        return;
      }

      persistSession(nextSession);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Unable to load the session.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const activeProviderKind =
        session?.provider ? providerKindBySession[session.provider] ?? providerKind : providerKind;
      const provider = providerRef.current ?? createProvider(activeProviderKind);
      providerRef.current = provider;

      if (provider.initialize) {
        await provider.initialize();
      }

      await provider.signOut();
      setSuccessMessage(`Signed out from ${provider.name}.`);
    } catch (nextError) {
      // Even when the upstream logout call fails, the local app session should
      // not stay active and continue unlocking restricted UI.
      clearSession();
      setError(nextError instanceof Error ? nextError.message : "Unable to sign out.");
    } finally {
      providerRef.current = null;
      clearSession();
      setSubmitting(false);
    }
  };

  const commonDescription =
    "Use the same login surface with Azure MSAL, Firebase Auth, or your own backend through the fetch-based API client.";

  const formFields =
    providerKind === "mixed"
      ? [
          {
            id: "azure-client-id",
            label: "Azure Client ID",
            value: azureConfig.clientId,
            required: true,
            placeholder: "00000000-0000-0000-0000-000000000000",
            onChange: (value: string) => setAzureConfig((current) => ({ ...current, clientId: value })),
          },
          {
            id: "azure-authority",
            label: "Authority",
            value: azureConfig.authority,
            required: true,
            hint: "Example: https://login.microsoftonline.com/common",
            onChange: (value: string) => setAzureConfig((current) => ({ ...current, authority: value })),
          },
          {
            id: "azure-redirect-uri",
            label: "Redirect URI",
            value: azureConfig.redirectUri,
            required: true,
            onChange: (value: string) => setAzureConfig((current) => ({ ...current, redirectUri: value })),
          },
          {
            id: "azure-scopes",
            label: "Scopes",
            value: azureConfig.scopes,
            required: true,
            hint: "Comma-separated scopes passed to the SSO provider.",
            onChange: (value: string) => setAzureConfig((current) => ({ ...current, scopes: value })),
          },
          {
            id: "mixed-api-base-url",
            label: "Authorization API Base URL",
            value: customApiConfig.baseUrl,
            required: true,
            hint: "The API returns the app-specific claims, roles, and permissions.",
            onChange: (value: string) => setCustomApiConfig((current) => ({ ...current, baseUrl: value })),
          },
          {
            id: "mixed-api-login-path",
            label: "Authorization Login Endpoint",
            value: customApiConfig.loginPath,
            required: true,
            onChange: (value: string) => setCustomApiConfig((current) => ({ ...current, loginPath: value })),
          },
          {
            id: "mixed-api-session-path",
            label: "Authorization Session Endpoint",
            value: customApiConfig.sessionPath,
            required: true,
            onChange: (value: string) => setCustomApiConfig((current) => ({ ...current, sessionPath: value })),
          },
        ]
      : providerKind === "azure"
      ? [
          {
            id: "azure-client-id",
            label: "Azure Client ID",
            value: azureConfig.clientId,
            required: true,
            placeholder: "00000000-0000-0000-0000-000000000000",
            onChange: (value: string) => setAzureConfig((current) => ({ ...current, clientId: value })),
          },
          {
            id: "azure-authority",
            label: "Authority",
            value: azureConfig.authority,
            required: true,
            hint: "Example: https://login.microsoftonline.com/common",
            onChange: (value: string) => setAzureConfig((current) => ({ ...current, authority: value })),
          },
          {
            id: "azure-redirect-uri",
            label: "Redirect URI",
            value: azureConfig.redirectUri,
            required: true,
            hint: "Usually the current app origin during local development.",
            onChange: (value: string) => setAzureConfig((current) => ({ ...current, redirectUri: value })),
          },
          {
            id: "azure-scopes",
            label: "Scopes",
            value: azureConfig.scopes,
            required: true,
            hint: "Comma-separated scopes passed to MSAL.",
            onChange: (value: string) => setAzureConfig((current) => ({ ...current, scopes: value })),
          },
        ]
      : providerKind === "firebase"
        ? [
            {
              id: "firebase-api-key",
              label: "Firebase API Key",
              value: firebaseConfig.apiKey,
              required: true,
              onChange: (value: string) => setFirebaseConfig((current) => ({ ...current, apiKey: value })),
            },
            {
              id: "firebase-auth-domain",
              label: "Auth Domain",
              value: firebaseConfig.authDomain,
              required: true,
              onChange: (value: string) => setFirebaseConfig((current) => ({ ...current, authDomain: value })),
            },
            {
              id: "firebase-project-id",
              label: "Project ID",
              value: firebaseConfig.projectId,
              required: true,
              onChange: (value: string) => setFirebaseConfig((current) => ({ ...current, projectId: value })),
            },
            {
              id: "firebase-app-id",
              label: "App ID",
              value: firebaseConfig.appId,
              required: true,
              onChange: (value: string) => setFirebaseConfig((current) => ({ ...current, appId: value })),
            },
            {
              id: "firebase-scopes",
              label: "Scopes",
              value: firebaseConfig.scopes,
              hint: "Optional popup scopes like email,profile",
              onChange: (value: string) => setFirebaseConfig((current) => ({ ...current, scopes: value })),
            },
          ]
        : [
            {
              id: "custom-api-base-url",
              label: "API Base URL",
              value: customApiConfig.baseUrl,
              required: true,
              hint: "The custom provider uses createFetchApiClient from @repo/api.",
              onChange: (value: string) => setCustomApiConfig((current) => ({ ...current, baseUrl: value })),
            },
            {
              id: "custom-api-email",
              label: "Email",
              value: customApiConfig.email,
              type: "email",
              required: true,
              onChange: (value: string) => setCustomApiConfig((current) => ({ ...current, email: value })),
            },
            {
              id: "custom-api-password",
              label: "Password",
              value: customApiConfig.password,
              type: "password",
              required: true,
              onChange: (value: string) => setCustomApiConfig((current) => ({ ...current, password: value })),
            },
            {
              id: "custom-api-login-path",
              label: "Login Endpoint",
              value: customApiConfig.loginPath,
              required: true,
              onChange: (value: string) => setCustomApiConfig((current) => ({ ...current, loginPath: value })),
            },
            {
              id: "custom-api-session-path",
              label: "Session Endpoint",
              value: customApiConfig.sessionPath,
              required: true,
              onChange: (value: string) => setCustomApiConfig((current) => ({ ...current, sessionPath: value })),
            },
          ];

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <Header title="Authentication Providers" />
        <p className={styles.lead}>
          This page demonstrates the shared login flow backed by `@repo/auth`.
          The same UI can be pointed at Azure SSO, Firebase Auth, or a custom backend.
        </p>
      </div>

      <section className={styles.providerPanel}>
        <div className={styles.providerHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Provider Selector</h2>
            <p className={styles.muted}>
              Pick the implementation you want to exercise, fill the required config, and submit the shared form.
            </p>
          </div>

          <div className={styles.providerField}>
            <Label htmlFor="provider-kind">Provider</Label>
            <Select
              id="provider-kind"
              value={providerKind}
              onChange={(event) => {
                setProviderKind(event.target.value as ProviderKind);
                providerRef.current = null;
                setError(null);
                setSuccessMessage(null);
              }}
            >
              <option value="custom-api">Custom API</option>
              <option value="azure">Azure SSO</option>
              <option value="firebase">Firebase Auth</option>
              <option value="mixed">Mixed: Azure + API authorization</option>
            </Select>
          </div>
        </div>
      </section>

      <div className={styles.grid}>
        <LoginForm
          description={commonDescription}
          error={error}
          fields={formFields}
          onSubmit={handleLogin}
          providerLabel={providerKind}
          submitClassName={isAuthenticated ? styles.connectedButton : styles.disconnectedButton}
          submitLabel={
            providerKind === "custom-api"
              ? isAuthenticated
                ? "API Session Active"
                : "Sign In With API"
              : providerKind === "mixed"
                ? isAuthenticated
                  ? "SSO + API Session Active"
                  : "Sign In With SSO + Authorize"
                : isAuthenticated
                  ? "Provider Session Active"
                  : "Start Provider Login"
          }
          submitting={submitting}
          successMessage={successMessage}
          title="Login Component"
        >
          {providerKind === "firebase" ? (
            <div className={styles.inlineField}>
              <Label htmlFor="firebase-provider">Popup Provider</Label>
              <Select
                id="firebase-provider"
                value={firebaseConfig.provider}
                onChange={(event) =>
                  setFirebaseConfig((current) => ({
                    ...current,
                    provider: event.target.value as FirebaseProviderKind,
                  }))
                }
              >
                <option value="google">Google</option>
                <option value="github">GitHub</option>
                <option value="microsoft">Microsoft</option>
              </Select>
            </div>
          ) : null}
        </LoginForm>

        <section className={styles.sessionCard}>
          <h2 className={styles.sectionTitle}>Session Snapshot</h2>
          <p className={styles.muted}>
            This snapshot now depends on the shared session provider, so existing persisted sessions appear without a manual check.
          </p>

          <div className={styles.actions}>
            <Button className={styles.neutralButton} disabled={submitting} onClick={handleCheckSession}>
              {session ? "Refresh Provider Session" : "Check Session"}
            </Button>
            <Button
              className={isAuthenticated ? styles.dangerButton : styles.neutralButton}
              disabled={submitting || !isAuthenticated}
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          </div>

          <div className={styles.details}>
            <p className={styles.detailRow}>
              <strong>Active provider:</strong> {providerKind}
            </p>
            <p className={styles.detailRow}>
              <strong>Authenticated user:</strong> {session?.user?.email ?? session?.user?.name ?? "Not signed in"}
            </p>
            <p className={styles.detailRow}>
              <strong>Roles:</strong> {session?.user?.roles?.join(", ") || "None"}
            </p>
            <p className={styles.detailRow}>
              <strong>Permissions:</strong> {session?.user?.permissions?.join(", ") || "None"}
            </p>
            <p className={styles.detailRow}>
              <strong>Access token:</strong> {session?.accessToken ? "Available" : "Not loaded"}
            </p>
            <p className={styles.detailRow}>
              <strong>ID token:</strong> {session?.idToken ? "Available" : "Not loaded"}
            </p>
          </div>

          <pre className={styles.codeBlock}>
            {JSON.stringify(session ?? { message: "Sign in to inspect the normalized auth session." }, null, 2)}
          </pre>
        </section>
      </div>

      <section className={styles.accessCard}>
        <h2 className={styles.sectionTitle}>AccessRight Demo</h2>
        <p className={styles.muted}>
          These CTAs read the persisted session from `@repo/auth` and react to roles and permissions.
        </p>

        <div className={styles.accessGrid}>
          <AccessRight effect="disable" permissions={["view"]}>
            <Button className={styles.accessButton}>View Reports</Button>
          </AccessRight>

          <AccessRight effect="disable" permissions={["upload"]}>
            <Button className={styles.accessButton}>Upload Asset</Button>
          </AccessRight>

          <AccessRight effect="disable" permissions={["delete"]}>
            <Button className={styles.accessButton}>Delete Entry</Button>
          </AccessRight>

          <AccessRight effect="disable" roles={["admin"]}>
            <Button className={styles.accessButton}>Open Admin Console</Button>
          </AccessRight>
        </div>

        <span className={styles.redirectHint}>
          The actual redirect and error effects are demonstrated on Profile and Dashboard routes.
        </span>
      </section>
    </div>
  );
};

export default AuthDemo;
