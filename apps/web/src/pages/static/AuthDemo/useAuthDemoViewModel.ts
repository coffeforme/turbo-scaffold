import { useEffect, useState, type FormEvent } from "react";
import {
  type AzureProviderConfig,
  type CustomApiProviderConfig,
  type FirebaseProviderConfig,
  useAuthProviderSystem,
  useAuthSession,
} from "@repo/auth";
import { useUploadManager } from "@repo/ui";
import { useAuthSessionRuntime } from "../../../components/AuthSessionRuntimeProvider";

const splitScopes = (value: string) =>
  value
    .split(",")
    .map((scope) => scope.trim())
    .filter(Boolean);

export function useAuthDemoViewModel() {
  const { session, setSession: persistSession, clearSession, refreshSession, idleStatus, idleWarning } = useAuthSession();
  const { idlePreset, setIdlePreset, warningPreset, setWarningPreset, idleConfig } = useAuthSessionRuntime();
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

  useEffect(() => {
    if (!isAuthenticated && successMessage?.startsWith("Authenticated with ")) {
      setSuccessMessage(null);
    }
  }, [isAuthenticated, successMessage]);

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

  return {
    session,
    idleStatus,
    idleWarning,
    idlePreset,
    setIdlePreset,
    warningPreset,
    setWarningPreset,
    idleConfig,
    providerKind,
    setProviderKind,
    firebaseConfig,
    setFirebaseConfig,
    error,
    successMessage,
    submitting,
    isAuthenticated,
    formFields,
    resetProvider,
    handleLogin,
    handleCheckSession,
    handleLogout,
    openUploadPicker,
    addUploads,
  };
}
