import { createStateKey } from "../utils/id.js";
import type { RuntimeState } from "./runtimeState.js";

export interface StorageAdapter {
  readonly load: (key: string) => Promise<RuntimeState | undefined>;
  readonly save: (key: string, snapshot: RuntimeState) => Promise<void>;
  readonly clear: (key: string) => Promise<void>;
}

export class MemoryStorage implements StorageAdapter {
  private readonly store = new Map<string, RuntimeState>();

  async load(key: string): Promise<RuntimeState | undefined> {
    return this.store.get(key);
  }

  async save(key: string, snapshot: RuntimeState): Promise<void> {
    this.store.set(key, snapshot);
  }

  async clear(key: string): Promise<void> {
    this.store.delete(key);
  }
}

export class WebStorage implements StorageAdapter {
  constructor(private readonly storage: Storage, private readonly namespace = "bm-runtime") {}

  private namespaced(key: string): string {
    return `${this.namespace}:${key}`;
  }

  async load(key: string): Promise<RuntimeState | undefined> {
    const raw = this.storage.getItem(this.namespaced(key));
    return raw ? (JSON.parse(raw) as RuntimeState) : undefined;
  }

  async save(key: string, snapshot: RuntimeState): Promise<void> {
    this.storage.setItem(this.namespaced(key), JSON.stringify(snapshot));
  }

  async clear(key: string): Promise<void> {
    this.storage.removeItem(this.namespaced(key));
  }
}

export const loadState = async (
  storage: StorageAdapter | undefined,
  graphId: string,
  viewerId: string | number
): Promise<RuntimeState | undefined> => {
  if (!storage) return undefined;
  const key = createStateKey(graphId, viewerId);
  return storage.load(key);
};

export const persistState = async (
  storage: StorageAdapter | undefined,
  state: RuntimeState,
  viewerId: string | number
): Promise<void> => {
  if (!storage) return;
  const key = createStateKey(state.graphId, viewerId);
  await storage.save(key, state);
};
