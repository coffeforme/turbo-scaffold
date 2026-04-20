export interface PersistStore {
  get: <T>(key: string) => T | null;
  set: <T>(key: string, value: T) => void;
  remove: (key: string) => void;
}

type BrowserStorageKind = 'localStorage' | 'sessionStorage';

const hasWindow = () => typeof window !== 'undefined';

const hasBrowserStorage = (kind: BrowserStorageKind) =>
  hasWindow() && typeof window[kind] !== 'undefined';

const safeParse = <T>(value: string | null): T | null => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

const createBrowserStorage = (kind: BrowserStorageKind): PersistStore => ({
  get: <T>(key: string): T | null => {
    if (!hasBrowserStorage(kind)) {
      return null;
    }

    return safeParse<T>(window[kind].getItem(key));
  },
  set: <T>(key: string, value: T): void => {
    if (!hasBrowserStorage(kind)) {
      return;
    }

    window[kind].setItem(key, JSON.stringify(value));
  },
  remove: (key: string): void => {
    if (!hasBrowserStorage(kind)) {
      return;
    }

    window[kind].removeItem(key);
  },
});

export interface CookieSerializeOptions {
  path?: string;
  domain?: string;
  maxAge?: number;
  expires?: Date;
  sameSite?: 'strict' | 'lax' | 'none';
  secure?: boolean;
}

const encodeCookieValue = (value: unknown) => encodeURIComponent(JSON.stringify(value));

const serializeCookie = (
  key: string,
  value: unknown,
  options: CookieSerializeOptions = {},
) => {
  const segments = [`${encodeURIComponent(key)}=${encodeCookieValue(value)}`];

  if (options.path) {
    segments.push(`Path=${options.path}`);
  }

  if (options.domain) {
    segments.push(`Domain=${options.domain}`);
  }

  if (typeof options.maxAge === 'number') {
    segments.push(`Max-Age=${options.maxAge}`);
  }

  if (options.expires) {
    segments.push(`Expires=${options.expires.toUTCString()}`);
  }

  if (options.sameSite) {
    segments.push(`SameSite=${options.sameSite}`);
  }

  if (options.secure) {
    segments.push('Secure');
  }

  return segments.join('; ');
};

const readCookieValue = (key: string) => {
  if (!hasWindow() || typeof document === 'undefined') {
    return null;
  }

  const cookieKey = `${encodeURIComponent(key)}=`;
  const entry = document.cookie.split('; ').find((item) => item.startsWith(cookieKey));
  return entry ? decodeURIComponent(entry.slice(cookieKey.length)) : null;
};

export const localStorageStore = createBrowserStorage('localStorage');

export const sessionStorageStore = createBrowserStorage('sessionStorage');

export const cookieStorage = {
  get: <T>(key: string): T | null => safeParse<T>(readCookieValue(key)),
  set: <T>(key: string, value: T, options: CookieSerializeOptions = {}): void => {
    if (!hasWindow() || typeof document === 'undefined') {
      return;
    }

    document.cookie = serializeCookie(key, value, options);
  },
  remove: (key: string, options: CookieSerializeOptions = {}): void => {
    if (!hasWindow() || typeof document === 'undefined') {
      return;
    }

    document.cookie = serializeCookie(key, '', {
      ...options,
      expires: new Date(0),
      maxAge: 0,
    });
  },
};

// Backward-compatible alias for callers that still expect a generic storage helper.
export const storage = localStorageStore;
