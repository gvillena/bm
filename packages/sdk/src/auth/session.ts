export type SessionEvent = "login" | "logout" | "refresh";

export interface WebStorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export type TokenRefresher = () => Promise<string | null>;

let namespace = "bm:sdk";
let storage: WebStorageAdapter | undefined;
let accessTokenMemory: string | null = null;
let tokenRefresher: TokenRefresher | undefined;

const listeners = new Set<(event: SessionEvent) => void>();

function emit(event: SessionEvent): void {
  listeners.forEach((listener) => {
    try {
      listener(event);
    } catch (error) {
      console.error("Session listener failure", error);
    }
  });
}

function storageKey(): string {
  return `${namespace}:accessToken`;
}

export function configureSessionStorage(adapter: WebStorageAdapter, ns = namespace): void {
  storage = adapter;
  namespace = ns;
}

export function onSessionEvent(listener: (event: SessionEvent) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export async function getAccessToken(): Promise<string | null> {
  if (accessTokenMemory) return accessTokenMemory;
  if (!storage) return null;
  const stored = storage.getItem(storageKey());
  accessTokenMemory = stored;
  return stored;
}

export function setAccessToken(token: string | null): void {
  accessTokenMemory = token;
  if (storage) {
    if (token) {
      storage.setItem(storageKey(), token);
    } else {
      storage.removeItem(storageKey());
    }
  }
  emit(token ? "login" : "logout");
}

export function clearSession(): void {
  accessTokenMemory = null;
  storage?.removeItem(storageKey());
  emit("logout");
}

export function setTokenRefresher(refresher: TokenRefresher): void {
  tokenRefresher = refresher;
}

export async function refreshToken(): Promise<string | null> {
  if (!tokenRefresher) {
    return null;
  }
  const newToken = await tokenRefresher();
  if (newToken) {
    accessTokenMemory = newToken;
    if (storage) {
      storage.setItem(storageKey(), newToken);
    }
  }
  emit("refresh");
  return newToken;
}
