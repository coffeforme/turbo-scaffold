import { getApp, getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
  type Auth,
  type User,
} from 'firebase/auth';
import { clearPersistedSession, getPersistedSession, persistSession } from '../sessionStorage';
import type {
  AuthProvider,
  AuthSession,
  FirebaseProviderKind,
  FirebaseSignInInput,
} from '../types';

export interface FirebaseAuthProviderOptions {
  app?: FirebaseApp;
  auth?: Auth;
  firebaseConfig?: FirebaseOptions;
  provider?: FirebaseProviderKind;
  scopes?: string[];
}

export class FirebaseAuthProvider implements AuthProvider<FirebaseSignInInput | undefined> {
  readonly name = 'firebase';

  private auth: Auth;
  private defaultProvider: FirebaseProviderKind;
  private defaultScopes: string[];

  constructor(options: FirebaseAuthProviderOptions) {
    const app = options.app ?? this.resolveApp(options.firebaseConfig);
    this.auth = options.auth ?? getAuth(app);
    this.defaultProvider = options.provider ?? 'google';
    this.defaultScopes = options.scopes ?? [];
  }

  async signIn(input?: FirebaseSignInInput): Promise<AuthSession> {
    const popupProvider = this.createPopupProvider(
      input?.provider ?? this.defaultProvider,
      input?.scopes ?? this.defaultScopes,
    );

    const result = await signInWithPopup(this.auth, popupProvider);
    const accessToken =
      GoogleAuthProvider.credentialFromResult(result)?.accessToken ??
      GithubAuthProvider.credentialFromResult(result)?.accessToken ??
      OAuthProvider.credentialFromResult(result)?.accessToken ??
      null;

    return persistSession(await this.createSession(result.user, accessToken));
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);
    clearPersistedSession();
  }

  async getSession(): Promise<AuthSession | null> {
    if (!this.auth.currentUser) {
      const persistedSession = getPersistedSession();
      return persistedSession?.provider === this.name ? persistedSession : null;
    }

    return persistSession(await this.createSession(this.auth.currentUser));
  }

  async getAccessToken(): Promise<string | null> {
    if (!this.auth.currentUser) {
      return null;
    }

    return this.auth.currentUser.getIdToken();
  }

  isAuthenticated(): boolean {
    return this.auth.currentUser !== null || getPersistedSession()?.provider === this.name;
  }

  private resolveApp(firebaseConfig?: FirebaseOptions): FirebaseApp {
    if (firebaseConfig) {
      return initializeApp(firebaseConfig, `auth-${Date.now()}`);
    }

    if (getApps().length === 0) {
      throw new Error('Firebase config is required when no app has been initialized.');
    }

    return getApp();
  }

  private createPopupProvider(
    providerKind: FirebaseProviderKind,
    scopes: string[],
  ): GoogleAuthProvider | GithubAuthProvider | OAuthProvider {
    let provider: GoogleAuthProvider | GithubAuthProvider | OAuthProvider;

    switch (providerKind) {
      case 'github':
        provider = new GithubAuthProvider();
        break;
      case 'microsoft':
        provider = new OAuthProvider('microsoft.com');
        break;
      case 'google':
      default:
        provider = new GoogleAuthProvider();
        break;
    }

    scopes.forEach((scope) => provider.addScope(scope));
    return provider;
  }

  private async createSession(user: User, accessToken?: string | null): Promise<AuthSession> {
    return {
      accessToken: accessToken ?? null,
      idToken: await user.getIdToken(),
      provider: this.name,
      raw: user,
      user: {
        id: user.uid,
        email: user.email,
        name: user.displayName,
        avatarUrl: user.photoURL,
        provider: this.name,
        raw: user.providerData,
      },
    };
  }
}
