export interface AuthUser {
  id: string;
  email?: string | null;
  name?: string | null;
  avatarUrl?: string | null;
  roles?: string[];
  permissions?: string[];
  claims?: Record<string, unknown>;
  provider: string;
  raw?: unknown;
}

export interface AuthSession {
  accessToken?: string | null;
  refreshToken?: string | null;
  idToken?: string | null;
  user?: AuthUser | null;
  provider: string;
  issuedAt?: number;
  expiresAt?: number | null;
  raw?: unknown;
}

export interface AuthIdleWarningState {
  isOpen: boolean;
  expiresAt: number | null;
  remainingMs: number;
}

export interface AuthIdleStatus {
  enabled: boolean;
  idleTime: number;
  idleWarningTime: number;
  expiresAt: number | null;
  lastActivityAt: number | null;
  remainingMs: number;
}

export interface AuthProvider<TLoginInput = void, TSession extends AuthSession = AuthSession> {
  readonly name: string;
  initialize?(): Promise<void>;
  signIn(input: TLoginInput): Promise<TSession>;
  signOut(): Promise<void>;
  getSession(): Promise<TSession | null>;
  refreshSession?(): Promise<TSession>;
  getAccessToken(): Promise<string | null>;
  isAuthenticated(): Promise<boolean> | boolean;
}

export interface AzureSignInInput {
  loginRequest?: Record<string, unknown>;
}

export type FirebaseProviderKind = 'google' | 'github' | 'microsoft';

export interface FirebaseSignInInput {
  provider?: FirebaseProviderKind;
  scopes?: string[];
}

export interface CustomAuthCredentials {
  email?: string;
  username?: string;
  password: string;
}

export interface CustomAuthEndpoints {
  login: string;
  logout: string;
  session: string;
  refresh: string;
}

export interface CustomAuthSessionResponse {
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
  expiresAt?: number | null;
  user?: {
    id?: string;
    email?: string | null;
    name?: string | null;
    avatarUrl?: string | null;
    roles?: string[];
    permissions?: string[];
    claims?: Record<string, unknown>;
    [key: string]: unknown;
  } | null;
  [key: string]: unknown;
}

export interface AccessRequirements {
  roles?: string[];
  permissions?: string[];
  claims?: Record<string, unknown>;
  requireAll?: boolean;
}
