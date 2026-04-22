import {
  createContext,
  useContext,
  useRef,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from 'react';
import { AzureAuthProvider } from '../providers/AzureAuthProvider';
import { CustomApiAuthProvider } from '../providers/CustomApiAuthProvider';
import { FirebaseAuthProvider } from '../providers/FirebaseAuthProvider';
import { MixedAuthProvider } from '../providers/MixedAuthProvider';
import type { AuthProvider, FirebaseProviderKind } from '../types';

export type AuthProviderKind = 'custom-api' | 'azure' | 'firebase' | 'mixed';

export interface AzureProviderConfig {
  clientId: string;
  authority: string;
  redirectUri: string;
  scopes: string;
}

export interface FirebaseProviderConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
  provider: FirebaseProviderKind;
  scopes: string;
}

export interface CustomApiProviderConfig {
  baseUrl: string;
  email: string;
  password: string;
  loginPath: string;
  logoutPath: string;
  sessionPath: string;
  refreshPath: string;
}

interface AuthProviderSystemContextValue {
  providerKind: AuthProviderKind;
  setProviderKind: Dispatch<SetStateAction<AuthProviderKind>>;
  azureConfig: AzureProviderConfig;
  setAzureConfig: Dispatch<SetStateAction<AzureProviderConfig>>;
  firebaseConfig: FirebaseProviderConfig;
  setFirebaseConfig: Dispatch<SetStateAction<FirebaseProviderConfig>>;
  customApiConfig: CustomApiProviderConfig;
  setCustomApiConfig: Dispatch<SetStateAction<CustomApiProviderConfig>>;
  createProvider: (kind?: AuthProviderKind) => AuthProvider<any>;
  prepareProvider: (kind?: AuthProviderKind) => Promise<AuthProvider<any>>;
  getActiveProvider: () => AuthProvider<any> | null;
  resetProvider: () => void;
  resolveKindFromSessionProvider: (providerName?: string | null) => AuthProviderKind;
}

const defaultOrigin = typeof window !== 'undefined' ? window.location.origin : '';

const defaultAzureConfig: AzureProviderConfig = {
  clientId: '',
  authority: 'https://login.microsoftonline.com/common',
  redirectUri: defaultOrigin,
  scopes: 'User.Read',
};

const defaultFirebaseConfig: FirebaseProviderConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  appId: '',
  provider: 'google',
  scopes: 'email,profile',
};

const defaultCustomApiConfig: CustomApiProviderConfig = {
  baseUrl: 'http://localhost:4001',
  email: '',
  password: '',
  loginPath: '/auth/login',
  logoutPath: '/auth/logout',
  sessionPath: '/auth/session',
  refreshPath: '/auth/refresh',
};

const providerKindBySession: Record<string, AuthProviderKind> = {
  azure: 'azure',
  'custom-api': 'custom-api',
  firebase: 'firebase',
  'mixed-auth': 'mixed',
};

const splitScopes = (value: string) =>
  value
    .split(',')
    .map((scope) => scope.trim())
    .filter(Boolean);

const AuthProviderSystemContext = createContext<AuthProviderSystemContextValue | undefined>(undefined);

export function AuthProviderSystem({ children }: PropsWithChildren) {
  const [providerKind, setProviderKind] = useState<AuthProviderKind>('custom-api');
  const [azureConfig, setAzureConfig] = useState<AzureProviderConfig>(defaultAzureConfig);
  const [firebaseConfig, setFirebaseConfig] = useState<FirebaseProviderConfig>(defaultFirebaseConfig);
  const [customApiConfig, setCustomApiConfig] = useState<CustomApiProviderConfig>(defaultCustomApiConfig);
  const activeProviderRef = useRef<AuthProvider<any> | null>(null);

  const createProvider = (kind: AuthProviderKind = providerKind): AuthProvider<any> => {
    switch (kind) {
      case 'azure':
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
      case 'firebase':
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
      case 'mixed':
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
      case 'custom-api':
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

  const prepareProvider = async (kind: AuthProviderKind = providerKind) => {
    const provider = createProvider(kind);
    activeProviderRef.current = provider;

    if (provider.initialize) {
      await provider.initialize();
    }

    return provider;
  };

  const getActiveProvider = () => activeProviderRef.current;

  const resetProvider = () => {
    activeProviderRef.current = null;
  };

  const resolveKindFromSessionProvider = (providerName?: string | null) => {
    if (!providerName) {
      return providerKind;
    }

    return providerKindBySession[providerName] ?? providerKind;
  };

  return (
    <AuthProviderSystemContext.Provider
      value={{
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
      }}
    >
      {children}
    </AuthProviderSystemContext.Provider>
  );
}

export const useAuthProviderSystem = () => {
  const context = useContext(AuthProviderSystemContext);

  if (!context) {
    throw new Error('useAuthProviderSystem must be used within an AuthProviderSystem');
  }

  return context;
};
