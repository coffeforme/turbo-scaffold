import { sessionStorageStore } from '@repo/persistence';
import type { AuthSession } from './types';

export const AUTH_SESSION_STORAGE_KEY = 'repo.auth.session';

export const getPersistedSession = () => sessionStorageStore.get<AuthSession>(AUTH_SESSION_STORAGE_KEY);

export const persistSession = (session: AuthSession) => {
  sessionStorageStore.set(AUTH_SESSION_STORAGE_KEY, session);
  return session;
};

export const clearPersistedSession = () => {
  sessionStorageStore.remove(AUTH_SESSION_STORAGE_KEY);
};
