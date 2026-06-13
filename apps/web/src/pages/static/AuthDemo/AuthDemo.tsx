import { AccessRight, type AuthProviderKind, type FirebaseProviderConfig } from "@repo/auth";
import { Button, FlipContainer, Header, Label, LoginForm, Select, UploadInput } from "@repo/ui";
import { useAuthDemoViewModel } from "./useAuthDemoViewModel";
import styles from "./AuthDemo.module.scss";

const providerSelectorCode = `const viewModel = useAuthDemoViewModel();

<Select
  id="provider-kind"
  value={viewModel.providerKind}
  onChange={(event) => {
    viewModel.setProviderKind(event.target.value as AuthProviderKind);
    viewModel.resetProvider();
  }}
>
  <option value="custom-api">Custom API</option>
  <option value="azure">Azure SSO</option>
  <option value="firebase">Firebase Auth</option>
  <option value="mixed">Mixed: Azure + API authorization</option>
</Select>`;

const loginComponentCode = `const viewModel = useAuthDemoViewModel();

<LoginForm
  fields={viewModel.formFields}
  onSubmit={viewModel.handleLogin}
  providerLabel={viewModel.providerKind}
/>`;

const sessionSnapshotCode = `const viewModel = useAuthDemoViewModel();

<Button onClick={viewModel.handleCheckSession}>Refresh Provider Session</Button>
<Button onClick={viewModel.handleLogout}>Sign Out</Button>`;

const accessDemoCode = `<AccessRight effect="disable" permissions={["view"]}>
  <Button>View Reports</Button>
</AccessRight>

<UploadInput label="Attach evidence" multiple />

<AccessRight effect="disable" roles={["admin"]}>
  <Button>Open Admin Console</Button>
</AccessRight>`;

function CodePreview({ code }: { code: string }) {
  return <pre className={styles.codeBlock}>{code}</pre>;
}

function formatRemainingTime(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

const AuthDemo = () => {
  const {
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
    resetProvider,
    error,
    successMessage,
    submitting,
    isAuthenticated,
    formFields,
    handleLogin,
    handleCheckSession,
    handleLogout,
    openUploadPicker,
    addUploads,
  } = useAuthDemoViewModel();

  const commonDescription =
    "Use the same login surface with Azure MSAL, Firebase Auth, or your own backend through the fetch-based API client.";

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <Header title="Authentication Providers" />
        <p className={styles.lead}>
          This page demonstrates the shared login flow backed by `@repo/auth`. The same UI can be pointed at Azure
          SSO, Firebase Auth, or a custom backend.
        </p>
      </div>

      <section className={styles.providerPanel}>
        <FlipContainer
          back={<CodePreview code={providerSelectorCode} />}
          description="The active auth provider is created by the shared auth system provider instead of this page."
          heightMode="active-face"
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
                  }}
                >
                  <option value="custom-api">Custom API</option>
                  <option value="azure">Azure SSO</option>
                  <option value="firebase">Firebase Auth</option>
                  <option value="mixed">Mixed: Azure + API authorization</option>
                </Select>
              </div>

              <div className={styles.providerField}>
                <Label htmlFor="idle-preset">Idle Sign-Out</Label>
                <Select
                  id="idle-preset"
                  value={idlePreset}
                  onChange={(event) => setIdlePreset(event.target.value as typeof idlePreset)}
                >
                  <option value="disabled">Disabled</option>
                  <option value="30s">30 seconds demo</option>
                  <option value="2m">2 minutes demo</option>
                  <option value="12h">12 hours default</option>
                </Select>
              </div>

              <div className={styles.providerField}>
                <Label htmlFor="warning-preset">Idle Warning</Label>
                <Select
                  disabled={idlePreset === "disabled"}
                  id="warning-preset"
                  value={warningPreset}
                  onChange={(event) => setWarningPreset(event.target.value as typeof warningPreset)}
                >
                  <option value="5s">5 seconds</option>
                  <option value="10s">10 seconds</option>
                  <option value="30s">30 seconds</option>
                  <option value="5m">5 minutes</option>
                </Select>
              </div>
            </div>
          }
          title="Provider Selection"
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
                This snapshot depends on the shared session provider, so existing persisted sessions appear without a
                manual check.
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
                <p className={styles.detailRow}>
                  <strong>Idle sign-out:</strong> {idleStatus.enabled ? "Enabled" : "Disabled"}
                </p>
                <p className={styles.detailRow}>
                  <strong>Idle timeout:</strong> {idleStatus.enabled ? formatRemainingTime(idleStatus.remainingMs) : "Not tracking"}
                </p>
                <p className={styles.detailRow}>
                  <strong>Warning window:</strong> {idleStatus.enabled ? `${formatRemainingTime(idleConfig.idleWarningTime)} before sign-out` : "Not applicable"}
                </p>
                <p className={styles.detailRow}>
                  <strong>Idle warning state:</strong> {idleWarning.isOpen ? "Prompt visible" : "Monitoring"}
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
