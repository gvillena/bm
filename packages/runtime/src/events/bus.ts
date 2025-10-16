import type { RuntimeEvent, RuntimeEventType } from "./types.js";

type Handler<T extends RuntimeEvent> = (event: T) => void;

export interface EventBus {
  readonly emit: (event: RuntimeEvent) => void;
  readonly subscribe: <T extends RuntimeEventType>(
    type: T,
    handler: Handler<Extract<RuntimeEvent, { type: T }>>
  ) => () => void;
}

export const createEventBus = (): EventBus => {
  const handlers = new Map<RuntimeEventType, Set<Handler<RuntimeEvent>>>();

  const emit = (event: RuntimeEvent) => {
    const subscribers = handlers.get(event.type);
    if (!subscribers) return;
    for (const handler of subscribers) {
      handler(event);
    }
  };

  const subscribe = <T extends RuntimeEventType>(
    type: T,
    handler: Handler<Extract<RuntimeEvent, { type: T }>>
  ) => {
    const set = handlers.get(type) ?? new Set();
    set.add(handler as Handler<RuntimeEvent>);
    handlers.set(type, set);
    return () => {
      const current = handlers.get(type);
      current?.delete(handler as Handler<RuntimeEvent>);
      if (current?.size === 0) {
        handlers.delete(type);
      }
    };
  };

  return { emit, subscribe };
};
