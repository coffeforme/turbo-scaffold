import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { hasAccess } from "../access";
import {
  AUTH_SESSION_STORAGE_KEY,
  clearPersistedSession,
  getPersistedSession,
  persistSession,
} from "../sessionStorage";
import type { AccessRequirements, AuthIdleWarningState, AuthProvider, AuthSession } from "../types";
import { useAuthProviderSystem } from "./AuthProviderSystem";

const DEFAULT_IDLE_TIME = 12 * 60 * 60 * 1000;
const DEFAULT_IDLE_WARNING_TIME = 5 * 60 * 1000;

export interface AuthSessionProviderProps extends PropsWithChildren {
  closeOnIdleTime?: boolean;
  idleTime?: number;
  idleWarningTime?: number;
}

interface AuthSessionContextValue {
  session: AuthSession | null;
  setSession: (session: AuthSession | null) => void;
  clearSession: () => void;
  refreshSession: () => void;
  continueSession: () => Promise<boolean>;
  signOutNow: () => Promise<void>;
  hasAccess: (requirements: AccessRequirements) => boolean;
  idleWarning: AuthIdleWarningState;
}

const defaultIdleWarning: AuthIdleWarningState = {
  isOpen: false,
  expiresAt: null,
  remainingMs: 0,
};

const AuthSessionContext = createContext<AuthSessionContextValue | undefined>(undefined);

export function AuthSessionProvider({
  children,
  closeOnIdleTime = false,
  idleTime = DEFAULT_IDLE_TIME,
  idleWarningTime = DEFAULT_IDLE_WARNING_TIME,
}: AuthSessionProviderProps) {
  const { createProvider, getActiveProvider, resolveKindFromSessionProvider } = useAuthProviderSystem();
  const [session, setSessionState] = useState<AuthSession | null>(() => getPersistedSession());
  const [idleWarning, setIdleWarning] = useState<AuthIdleWarningState>(defaultIdleWarning);
  const lastActivityAtRef = useRef<number>(Date.now());
  const signOutInFlightRef = useRef(false);
  const warningRaisedRef = useRef(false);

  useEffect(() => {
    setSessionState(getPersistedSession());

    const handleStorage = (event: StorageEvent) => {
      if (event.key && event.key !== AUTH_SESSION_STORAGE_KEY) {
        return;
      }

      setSessionState(getPersistedSession());
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const setSession = (nextSession: AuthSession | null) => {
    setSessionState(nextSession);
    lastActivityAtRef.current = Date.now();
    warningRaisedRef.current = false;
    setIdleWarning(defaultIdleWarning);

    if (nextSession) {
      persistSession(nextSession);
      return;
    }

    clearPersistedSession();
  };

  const clearSession = () => {
    setSessionState(null);
    warningRaisedRef.current = false;
    setIdleWarning(defaultIdleWarning);
    clearPersistedSession();
  };

  const refreshSession = () => {
    setSessionState(getPersistedSession());
  };

  const resolveActiveProvider = async (): Promise<AuthProvider<any> | null> => {
    if (!session) {
      return null;
    }

    const provider = getActiveProvider() ?? createProvider(resolveKindFromSessionProvider(session.provider));

    if (provider.initialize) {
      await provider.initialize();
    }

    return provider;
  };

  const continueSession = async () => {
    if (!session) {
      return false;
    }

    try {
      const provider = await resolveActiveProvider();

      if (!provider) {
        return false;
      }

      const nextSession = provider.refreshSession
        ? await provider.refreshSession()
        : await provider.getSession();

      if (!nextSession) {
        clearSession();
        return false;
      }

      setSession(nextSession);
      return true;
    } catch {
      clearSession();
      return false;
    }
  };

  const signOutNow = async () => {
    if (signOutInFlightRef.current) {
      return;
    }

    signOutInFlightRef.current = true;

    try {
      const provider = await resolveActiveProvider();
      await provider?.signOut();
    } catch {
      // If provider sign-out fails we still clear the local session.
    } finally {
      clearSession();
      signOutInFlightRef.current = false;
    }
  };

  useEffect(() => {
    if (!closeOnIdleTime || !session) {
      setIdleWarning(defaultIdleWarning);
      warningRaisedRef.current = false;
      return;
    }

    lastActivityAtRef.current = Date.now();
    warningRaisedRef.current = false;
    setIdleWarning(defaultIdleWarning);

    const handleActivity = () => {
      if (warningRaisedRef.current) {
        return;
      }

      lastActivityAtRef.current = Date.now();
    };

    const events: Array<keyof WindowEventMap> = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];
    events.forEach((eventName) => window.addEventListener(eventName, handleActivity, true));

    const interval = window.setInterval(() => {
      const remainingMs = idleTime - (Date.now() - lastActivityAtRef.current);

      if (remainingMs <= 0) {
        void signOutNow();
        return;
      }

      if (remainingMs <= idleWarningTime) {
        warningRaisedRef.current = true;
        setIdleWarning({
          isOpen: true,
          expiresAt: Date.now() + remainingMs,
          remainingMs,
        });
        return;
      }

      setIdleWarning(defaultIdleWarning);
    }, 1000);

    return () => {
      window.clearInterval(interval);
      events.forEach((eventName) => window.removeEventListener(eventName, handleActivity, true));
    };
  }, [closeOnIdleTime, idleTime, idleWarningTime, session]);

  const value = useMemo(
    () => ({
      session,
      setSession,
      clearSession,
      refreshSession,
      continueSession,
      signOutNow,
      hasAccess: (requirements: AccessRequirements) => hasAccess(session, requirements),
      idleWarning,
    }),
    [session, idleWarning],
  );

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}

export const useAuthSession = () => {
  const context = useContext(AuthSessionContext);

  if (!context) {
    throw new Error("useAuthSession must be used within an AuthSessionProvider");
  }

  return context;
};
