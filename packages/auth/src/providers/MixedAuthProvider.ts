import type { AuthProvider, AuthSession } from '../types';
import { CustomApiAuthProvider } from './CustomApiAuthProvider';

export interface MixedAuthSignInInput<TIdentityInput = unknown> {
  identityInput?: TIdentityInput;
  authorizationPayload?: Record<string, unknown>;
}

export interface MixedAuthProviderOptions<TIdentityInput = unknown> {
  identityProvider: AuthProvider<TIdentityInput>;
  authorizationProvider: CustomApiAuthProvider;
}

export class MixedAuthProvider<TIdentityInput = unknown>
  implements AuthProvider<MixedAuthSignInInput<TIdentityInput> | undefined>
{
  readonly name = 'mixed-auth';

  private identityProvider: AuthProvider<TIdentityInput>;
  private authorizationProvider: CustomApiAuthProvider;

  constructor(options: MixedAuthProviderOptions<TIdentityInput>) {
    this.identityProvider = options.identityProvider;
    this.authorizationProvider = options.authorizationProvider;
  }

  async initialize(): Promise<void> {
    if (this.identityProvider.initialize) {
      await this.identityProvider.initialize();
    }
  }

  async signIn(input?: MixedAuthSignInInput<TIdentityInput>): Promise<AuthSession> {
    const identitySession = await this.identityProvider.signIn(input?.identityInput as TIdentityInput);
    return this.authorizationProvider.signInWithExternalSession(identitySession, input?.authorizationPayload);
  }

  async signOut(): Promise<void> {
    await Promise.allSettled([
      this.identityProvider.signOut(),
      this.authorizationProvider.signOut(),
    ]);
  }

  async getSession(): Promise<AuthSession | null> {
    return this.authorizationProvider.getSession();
  }

  async getAccessToken(): Promise<string | null> {
    return this.authorizationProvider.getAccessToken();
  }

  async refreshSession(): Promise<AuthSession> {
    return this.authorizationProvider.refreshSession();
  }

  async isAuthenticated(): Promise<boolean> {
    return this.authorizationProvider.isAuthenticated();
  }
}
