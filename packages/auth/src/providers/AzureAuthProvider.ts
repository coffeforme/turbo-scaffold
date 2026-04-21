import {
  PublicClientApplication,
  type AccountInfo,
  type AuthenticationResult,
  type Configuration,
  type PopupRequest,
} from '@azure/msal-browser';
import { clearPersistedSession, getPersistedSession, persistSession } from '../sessionStorage';
import type { AuthSession, AuthProvider, AzureSignInInput } from '../types';

export interface AzureAuthProviderOptions {
  scopes?: string[];
  loginRequest?: PopupRequest;
  tokenRequest?: Omit<PopupRequest, 'account'>;
}

export class AzureAuthProvider implements AuthProvider<AzureSignInInput | undefined> {
  readonly name = 'azure';

  private client: PublicClientApplication;
  private account: AccountInfo | null = null;
  private scopes: string[];
  private loginRequest?: PopupRequest;
  private tokenRequest?: Omit<PopupRequest, 'account'>;

  constructor(config: Configuration, options: AzureAuthProviderOptions = {}) {
    this.client = new PublicClientApplication(config);
    this.scopes = options.scopes ?? ['User.Read'];
    this.loginRequest = options.loginRequest;
    this.tokenRequest = options.tokenRequest;
  }

  async initialize(): Promise<void> {
    await this.client.initialize();
    this.account = this.client.getAllAccounts()[0] ?? null;
  }

  async signIn(input?: AzureSignInInput): Promise<AuthSession> {
    const response = await this.client.loginPopup({
      scopes: this.scopes,
      ...this.loginRequest,
      ...(input?.loginRequest ?? {}),
    });

    this.account = response.account ?? null;
    return persistSession(this.createSession(response));
  }

  async signOut(): Promise<void> {
    await this.client.logoutPopup({
      account: this.account ?? undefined,
    });
    this.account = null;
    clearPersistedSession();
  }

  async getSession(): Promise<AuthSession | null> {
    const persistedSession = getPersistedSession();

    if (!this.account) {
      return persistedSession?.provider === this.name ? persistedSession : null;
    }

    try {
      const response = await this.client.acquireTokenSilent({
        scopes: this.scopes,
        account: this.account,
        ...this.tokenRequest,
      });

      return persistSession(this.createSession(response));
    } catch {
      return persistSession({
        provider: this.name,
        user: this.createUser(this.account),
      });
    }
  }

  async getAccessToken(): Promise<string | null> {
    const session = await this.getSession();
    return session?.accessToken ?? null;
  }

  isAuthenticated(): boolean {
    return this.account !== null || getPersistedSession()?.provider === this.name;
  }

  private createSession(result: AuthenticationResult): AuthSession {
    return {
      accessToken: result.accessToken ?? null,
      idToken: result.idToken ?? null,
      provider: this.name,
      raw: result,
      user: this.createUser(result.account),
    };
  }

  private createUser(account: AccountInfo | null | undefined) {
    if (!account) {
      return null;
    }

    return {
      id: account.homeAccountId,
      email: account.username,
      name: account.name ?? account.username,
      provider: this.name,
      raw: account,
    };
  }
}
