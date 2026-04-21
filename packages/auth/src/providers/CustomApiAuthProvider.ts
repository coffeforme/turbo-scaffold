import { createFetchApiClient, type ApiClient } from '@repo/api';
import { clearPersistedSession, getPersistedSession, persistSession } from '../sessionStorage';
import type {
  AuthProvider,
  AuthSession,
  CustomAuthCredentials,
  CustomAuthEndpoints,
  CustomAuthSessionResponse,
} from '../types';

const defaultEndpoints: CustomAuthEndpoints = {
  login: '/auth/login',
  logout: '/auth/logout',
  session: '/auth/session',
  refresh: '/auth/refresh',
};

export interface CustomApiAuthProviderOptions {
  baseUrl: string;
  endpoints?: Partial<CustomAuthEndpoints>;
  mapSession?: (response: CustomAuthSessionResponse) => AuthSession;
}

export class CustomApiAuthProvider implements AuthProvider<CustomAuthCredentials> {
  readonly name = 'custom-api';

  private client: ApiClient;
  private endpoints: CustomAuthEndpoints;
  private session: AuthSession | null = null;
  private mapSession?: (response: CustomAuthSessionResponse) => AuthSession;

  constructor(options: CustomApiAuthProviderOptions) {
    this.client = createFetchApiClient(options.baseUrl);
    this.endpoints = {
      ...defaultEndpoints,
      ...options.endpoints,
    };
    this.mapSession = options.mapSession;
  }

  async signIn(credentials: CustomAuthCredentials): Promise<AuthSession> {
    const response = await this.client.post<CustomAuthSessionResponse>(
      this.endpoints.login,
      credentials,
    );

    this.session = persistSession(this.normalizeSession(response));
    return this.session;
  }

  async signInWithExternalSession(
    externalSession: AuthSession,
    authorizationPayload?: Record<string, unknown>,
  ): Promise<AuthSession> {
    const response = await this.client.post<CustomAuthSessionResponse>(
      this.endpoints.login,
      {
        provider: externalSession.provider,
        externalAccessToken: externalSession.accessToken,
        externalIdToken: externalSession.idToken,
        externalUser: externalSession.user,
        ...authorizationPayload,
      },
    );

    this.session = persistSession(this.mergeIdentitySession(externalSession, this.normalizeSession(response)));
    return this.session;
  }

  async signOut(): Promise<void> {
    const activeSession =
      this.session ??
      ((): AuthSession | null => {
        const persistedSession = getPersistedSession();
        return persistedSession?.provider === this.name || persistedSession?.provider === 'mixed-auth'
          ? persistedSession
          : null;
      })();

    if (activeSession?.accessToken) {
      await this.client.post(
        this.endpoints.logout,
        undefined,
        {
          headers: {
            Authorization: `Bearer ${activeSession.accessToken}`,
          },
        },
      );
    }

    this.session = null;
    clearPersistedSession();
  }

  async getSession(): Promise<AuthSession | null> {
    if (this.session) {
      return this.session;
    }

    const persistedSession = getPersistedSession();

    if (persistedSession?.provider === this.name || persistedSession?.provider === 'mixed-auth') {
      this.session = persistedSession;
    }

    try {
      const response = await this.client.get<CustomAuthSessionResponse>(this.endpoints.session, {
        headers: this.session?.accessToken
          ? {
              Authorization: `Bearer ${this.session.accessToken}`,
            }
          : undefined,
      });
      this.session = persistSession(this.normalizeSession(response));
      return this.session;
    } catch {
      return this.session;
    }
  }

  async getAccessToken(): Promise<string | null> {
    const session = await this.getSession();
    return session?.accessToken ?? null;
  }

  async refreshSession(): Promise<AuthSession> {
    const refreshToken = this.session?.refreshToken;

    if (!refreshToken) {
      throw new Error('No refresh token available. Sign in before refreshing the session.');
    }

    const response = await this.client.post<CustomAuthSessionResponse>(
      this.endpoints.refresh,
      { refreshToken },
    );

    this.session = persistSession(this.normalizeSession(response));
    return this.session;
  }

  async isAuthenticated(): Promise<boolean> {
    return (await this.getSession()) !== null;
  }

  private normalizeSession(response: CustomAuthSessionResponse): AuthSession {
    if (this.mapSession) {
      return this.mapSession(response);
    }

    return {
      accessToken: response.accessToken ?? null,
      refreshToken: response.refreshToken ?? null,
      idToken: response.idToken ?? null,
      provider: this.name,
      issuedAt: Date.now(),
      expiresAt: response.expiresAt ?? null,
      raw: response,
      user: response.user
        ? {
            id: response.user.id ?? response.user.email ?? 'custom-user',
            email: response.user.email,
            name: response.user.name,
            avatarUrl: response.user.avatarUrl,
            roles: response.user.roles ?? [],
            permissions: response.user.permissions ?? [],
            claims: response.user.claims,
            provider: this.name,
            raw: response.user,
          }
        : null,
    };
  }

  private mergeIdentitySession(identitySession: AuthSession, authorizationSession: AuthSession): AuthSession {
    return {
      ...authorizationSession,
      provider: 'mixed-auth',
      raw: {
        identity: identitySession.raw,
        authorization: authorizationSession.raw,
      },
      user: {
        ...identitySession.user,
        ...authorizationSession.user,
        id: authorizationSession.user?.id ?? identitySession.user?.id ?? 'mixed-user',
        email: authorizationSession.user?.email ?? identitySession.user?.email,
        name: authorizationSession.user?.name ?? identitySession.user?.name,
        avatarUrl: authorizationSession.user?.avatarUrl ?? identitySession.user?.avatarUrl,
        roles: authorizationSession.user?.roles ?? identitySession.user?.roles ?? [],
        permissions:
          authorizationSession.user?.permissions ?? identitySession.user?.permissions ?? [],
        claims: {
          ...(identitySession.user?.claims ?? {}),
          ...(authorizationSession.user?.claims ?? {}),
        },
        provider: 'mixed-auth',
      },
    };
  }
}
