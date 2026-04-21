import { useState, type FormEvent } from "react";
import {
  AccessRight,
  type AuthProviderKind,
  type AzureProviderConfig,
  type CustomApiProviderConfig,
  type FirebaseProviderConfig,
  useAuthProviderSystem,
  useAuthSession,
} from "@repo/auth";
import { Button, FlipContainer, Header, Label, LoginForm, Select, UploadInput, useUploadManager } from "@repo/ui";
import styles from "./AuthDemo.module.scss";

const providerSelectorCode = `const {
  providerKind,
  setProviderKind,
  resetProvider,
} = useAuthProviderSystem();

<Select
  id="provider-kind"
  value={providerKind}
  onChange={(event) => {
    setProviderKind(event.target.value as AuthProviderKind);
    resetProvider();
  }}
>
  <option value="custom-api">Custom API</option>
  <option value="azure">Azure SSO</option>
  <option value="firebase">Firebase Auth</option>
  <option value="mixed">Mixed: Azure + API authorization</option>
</Select>`;

const loginComponentCode = `const provider = await prepareProvider();
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
          })
        : await provider.signIn(undefined);

persistSession(nextSession);`;

const sessionSnapshotCode = `const { session, clearSession } = useAuthSession();
const { getActiveProvider, createProvider, resolveKindFromSessionProvider } = useAuthProviderSystem();

const activeProviderKind = resolveKindFromSessionProvider(session?.provider);
const provider = getActiveProvider() ?? createProvider(activeProviderKind);

await provider.signOut();
clearSession();`;

const accessDemoCode = `<AccessRight effect="disable" permissions={["view"]}>
  <Button>View Reports</Button>
</AccessRight>

<UploadInput label="Attach evidence" multiple />

<AccessRight effect="disable" roles={["admin"]}>
  <Button>Open Admin Console</Button>
</AccessRight>`;

const splitScopes = (value: string) =>
  value
    .split(",")
    .map((scope) => scope.trim())
    .filter(Boolean);

function CodePreview({ code }: { code: string }) {
  return <pre className={styles.codeBlock}>{code}</pre>;
}

const AuthDemo = () => {
  const { session, setSession: persistSession, clearSession, refreshSession } = useAuthSession();
  const {
    providerKind,
    setProviderKind,
    azureConfig,
    setAzureConfig,
    firebaseConfig,
    setFirebaseConfig,
    customApiConfig,
    setCustomApiConfig,
    createProvider,
    prepareProvider,
    getActiveProvider,
    resetProvider,
    resolveKindFromSessionProvider,
  } = useAuthProviderSystem();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { openUploadPicker, addUploads } = useUploadManager();

  const isAuthenticated = Boolean(session?.user);

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

      const provider = getActiveProvider() ?? (await prepareProvider());
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
      const activeProviderKind = resolveKindFromSessionProvider(session?.provider);
      const provider = getActiveProvider() ?? createProvider(activeProviderKind);

      if (provider.initialize) {
        await provider.initialize();
      }

      await provider.signOut();
      setSuccessMessage(`Signed out from ${provider.name}.`);
    } catch (nextError) {
      clearSession();
      setError(nextError instanceof Error ? nextError.message : "Unable to sign out.");
    } finally {
      resetProvider();
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
            onChange: (value: string) =>
              setAzureConfig((current: AzureProviderConfig) => ({ ...current, clientId: value })),
          },
          {
            id: "azure-authority",
            label: "Authority",
            value: azureConfig.authority,
            required: true,
            hint: "Example: https://login.microsoftonline.com/common",
            onChange: (value: string) =>
              setAzureConfig((current: AzureProviderConfig) => ({ ...current, authority: value })),
          },
          {
            id: "azure-redirect-uri",
            label: "Redirect URI",
            value: azureConfig.redirectUri,
            required: true,
            onChange: (value: string) =>
              setAzureConfig((current: AzureProviderConfig) => ({ ...current, redirectUri: value })),
          },
          {
            id: "azure-scopes",
            label: "Scopes",
            value: azureConfig.scopes,
            required: true,
            hint: "Comma-separated scopes passed to the SSO provider.",
            onChange: (value: string) =>
              setAzureConfig((current: AzureProviderConfig) => ({ ...current, scopes: value })),
          },
          {
            id: "mixed-api-base-url",
            label: "Authorization API Base URL",
            value: customApiConfig.baseUrl,
            required: true,
            hint: "The API returns the app-specific claims, roles, and permissions.",
            onChange: (value: string) =>
              setCustomApiConfig((current: CustomApiProviderConfig) => ({ ...current, baseUrl: value })),
          },
          {
            id: "mixed-api-login-path",
            label: "Authorization Login Endpoint",
            value: customApiConfig.loginPath,
            required: true,
            onChange: (value: string) =>
              setCustomApiConfig((current: CustomApiProviderConfig) => ({ ...current, loginPath: value })),
          },
          {
            id: "mixed-api-session-path",
            label: "Authorization Session Endpoint",
            value: customApiConfig.sessionPath,
            required: true,
            onChange: (value: string) =>
              setCustomApiConfig((current: CustomApiProviderConfig) => ({ ...current, sessionPath: value })),
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
              onChange: (value: string) =>
                setAzureConfig((current: AzureProviderConfig) => ({ ...current, clientId: value })),
            },
            {
              id: "azure-authority",
              label: "Authority",
              value: azureConfig.authority,
              required: true,
              hint: "Example: https://login.microsoftonline.com/common",
              onChange: (value: string) =>
                setAzureConfig((current: AzureProviderConfig) => ({ ...current, authority: value })),
            },
            {
              id: "azure-redirect-uri",
              label: "Redirect URI",
              value: azureConfig.redirectUri,
              required: true,
              hint: "Usually the current app origin during local development.",
              onChange: (value: string) =>
                setAzureConfig((current: AzureProviderConfig) => ({ ...current, redirectUri: value })),
            },
            {
              id: "azure-scopes",
              label: "Scopes",
              value: azureConfig.scopes,
              required: true,
              hint: "Comma-separated scopes passed to MSAL.",
              onChange: (value: string) =>
                setAzureConfig((current: AzureProviderConfig) => ({ ...current, scopes: value })),
            },
          ]
        : providerKind === "firebase"
          ? [
              {
                id: "firebase-api-key",
                label: "Firebase API Key",
                value: firebaseConfig.apiKey,
                required: true,
                onChange: (value: string) =>
                  setFirebaseConfig((current: FirebaseProviderConfig) => ({ ...current, apiKey: value })),
              },
              {
                id: "firebase-auth-domain",
                label: "Auth Domain",
                value: firebaseConfig.authDomain,
                required: true,
                onChange: (value: string) =>
                  setFirebaseConfig((current: FirebaseProviderConfig) => ({ ...current, authDomain: value })),
              },
              {
                id: "firebase-project-id",
                label: "Project ID",
                value: firebaseConfig.projectId,
                required: true,
                onChange: (value: string) =>
                  setFirebaseConfig((current: FirebaseProviderConfig) => ({ ...current, projectId: value })),
              },
              {
                id: "firebase-app-id",
                label: "App ID",
                value: firebaseConfig.appId,
                required: true,
                onChange: (value: string) =>
                  setFirebaseConfig((current: FirebaseProviderConfig) => ({ ...current, appId: value })),
              },
              {
                id: "firebase-scopes",
                label: "Scopes",
                value: firebaseConfig.scopes,
                hint: "Optional popup scopes like email,profile",
                onChange: (value: string) =>
                  setFirebaseConfig((current: FirebaseProviderConfig) => ({ ...current, scopes: value })),
              },
            ]
          : [
              {
                id: "custom-api-base-url",
                label: "API Base URL",
                value: customApiConfig.baseUrl,
                required: true,
                hint: "The custom provider uses createFetchApiClient from @repo/api.",
                onChange: (value: string) =>
                  setCustomApiConfig((current: CustomApiProviderConfig) => ({ ...current, baseUrl: value })),
              },
              {
                id: "custom-api-email",
                label: "Email",
                value: customApiConfig.email,
                type: "email",
                required: true,
                onChange: (value: string) =>
                  setCustomApiConfig((current: CustomApiProviderConfig) => ({ ...current, email: value })),
              },
              {
                id: "custom-api-password",
                label: "Password",
                value: customApiConfig.password,
                type: "password",
                required: true,
                onChange: (value: string) =>
                  setCustomApiConfig((current: CustomApiProviderConfig) => ({ ...current, password: value })),
              },
              {
                id: "custom-api-login-path",
                label: "Login Endpoint",
                value: customApiConfig.loginPath,
                required: true,
                onChange: (value: string) =>
                  setCustomApiConfig((current: CustomApiProviderConfig) => ({ ...current, loginPath: value })),
              },
              {
                id: "custom-api-session-path",
                label: "Session Endpoint",
                value: customApiConfig.sessionPath,
                required: true,
                onChange: (value: string) =>
                  setCustomApiConfig((current: CustomApiProviderConfig) => ({ ...current, sessionPath: value })),
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
        <FlipContainer
          back={<CodePreview code={providerSelectorCode} />}
          description="The active auth provider is now created by the shared auth system provider instead of this page."
          front={
            <div className={styles.providerHeader}>
              <p className={styles.muted}>
                Pick the implementation you want to exercise, fill the required config, and submit the shared form.
              </p>

              <div className={styles.providerField}>
                <Label htmlFor="provider-kind">Provider</Label>
                <Select
                  id="provider-kind"
                  value={providerKind}
                  onChange={(event) => {
                    setProviderKind(event.target.value as AuthProviderKind);
                    resetProvider();
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
          }
          title="Provider Selector"
        />
      </section>

      <div className={styles.grid}>
        <FlipContainer
          back={<CodePreview code={loginComponentCode} />}
          description="The shared LoginForm stays provider-agnostic while the auth system context decides which implementation to instantiate."
          front={
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
                      setFirebaseConfig((current: FirebaseProviderConfig) => ({
                        ...current,
                        provider: event.target.value as FirebaseProviderConfig["provider"],
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
          }
          title="Login Component"
        />

        <FlipContainer
          back={<CodePreview code={sessionSnapshotCode} />}
          description="The snapshot reflects the shared AuthSessionProvider state and the currently active auth provider instance."
          front={
            <section className={styles.sessionCard}>
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
          }
          title="Session Snapshot"
        />
      </div>

      <section className={styles.accessCard}>
        <FlipContainer
          back={<CodePreview code={accessDemoCode} />}
          description="The same persisted session drives both route-level restriction and CTA-level authorization effects."
          front={
            <>
              <p className={styles.muted}>
                These CTAs read the shared auth session from `@repo/auth` and react to roles and permissions.
              </p>

              <div className={styles.accessGrid}>
                <AccessRight effect="disable" permissions={["view"]}>
                  <Button className={styles.accessButton}>View Reports</Button>
                </AccessRight>

                <AccessRight effect="disable" permissions={["upload"]}>
                  <Button
                    className={styles.accessButton}
                    onClick={() =>
                      openUploadPicker({
                        source: {
                          page: "Authentication Providers",
                          section: "AccessRight Demo",
                        },
                      })
                    }
                  >
                    Upload Asset
                  </Button>
                </AccessRight>

                <AccessRight effect="disable" permissions={["delete"]}>
                  <Button className={styles.accessButton}>Delete Entry</Button>
                </AccessRight>

                <AccessRight effect="disable" roles={["admin"]}>
                  <Button className={styles.accessButton}>Open Admin Console</Button>
                </AccessRight>
              </div>

              <div className={styles.uploadField}>
                <UploadInput
                  helperText="This direct input feeds the same global upload manager."
                  label="Attach Evidence"
                  multiple
                  onChange={(event) => {
                    const files = Array.from(event.target.files ?? []);

                    if (files.length > 0) {
                      addUploads(files, {
                        page: "Authentication Providers",
                        section: "Direct Upload Input",
                      });
                    }

                    event.target.value = "";
                  }}
                />
              </div>

              <span className={styles.redirectHint}>
                The actual redirect and error effects are demonstrated on Profile and Dashboard routes.
              </span>
            </>
          }
          title="AccessRight Demo"
        />
      </section>
    </div>
  );
};

export default AuthDemo;
