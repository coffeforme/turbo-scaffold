import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { hasAccess } from '../access';
import {
  AUTH_SESSION_STORAGE_KEY,
  clearPersistedSession,
  getPersistedSession,
  persistSession,
} from '../sessionStorage';
import type { AccessRequirements, AuthSession } from '../types';

interface AuthSessionContextValue {
  session: AuthSession | null;
  setSession: (session: AuthSession | null) => void;
  clearSession: () => void;
  refreshSession: () => void;
  hasAccess: (requirements: AccessRequirements) => boolean;
}

const AuthSessionContext = createContext<AuthSessionContextValue | undefined>(undefined);

export function AuthSessionProvider({ children }: PropsWithChildren) {
  const [session, setSessionState] = useState<AuthSession | null>(() => getPersistedSession());

  useEffect(() => {
    setSessionState(getPersistedSession());

    const handleStorage = (event: StorageEvent) => {
      if (event.key && event.key !== AUTH_SESSION_STORAGE_KEY) {
        return;
      }

      setSessionState(getPersistedSession());
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const setSession = (nextSession: AuthSession | null) => {
    setSessionState(nextSession);

    if (nextSession) {
      persistSession(nextSession);
      return;
    }

    clearPersistedSession();
  };

  const clearSession = () => {
    setSessionState(null);
    clearPersistedSession();
  };

  const refreshSession = () => {
    setSessionState(getPersistedSession());
  };

  const value = useMemo(
    () => ({
      session,
      setSession,
      clearSession,
      refreshSession,
      hasAccess: (requirements: AccessRequirements) => hasAccess(session, requirements),
    }),
    [session],
  );

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}

export const useAuthSession = () => {
  const context = useContext(AuthSessionContext);

  if (!context) {
    throw new Error('useAuthSession must be used within an AuthSessionProvider');
  }

  return context;
};
