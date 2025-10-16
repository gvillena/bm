import type { SdkTelemetry } from "../types/telemetry.js";
import { now } from "../utils/time.js";

interface BreakerState {
  state: "closed" | "open" | "half-open";
  failures: number;
  openedAt?: number;
  lastFailureAt?: number;
}

interface CircuitBreakerOptions {
  failureThreshold: number;
  windowMs: number;
  openTimeMs: number;
  telemetry?: SdkTelemetry;
}

const DEFAULT_OPTIONS: CircuitBreakerOptions = {
  failureThreshold: 5,
  windowMs: 60_000,
  openTimeMs: 30_000,
};

const breakers = new Map<string, BreakerState>();

function getStateKey(host: string): string {
  return host;
}

function getState(host: string): BreakerState {
  const key = getStateKey(host);
  let state = breakers.get(key);
  if (!state) {
    state = { state: "closed", failures: 0 };
    breakers.set(key, state);
  }
  return state;
}

export class CircuitBreaker {
  private readonly options: CircuitBreakerOptions;

  constructor(options?: Partial<CircuitBreakerOptions>) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  allowRequest(host: string): boolean {
    const state = getState(host);
    if (state.state === "open") {
      const sinceOpen = now() - (state.openedAt ?? 0);
      if (sinceOpen > this.options.openTimeMs) {
        state.state = "half-open";
        this.options.telemetry?.onBreaker?.({ state: "half-open", host });
        return true;
      }
      this.options.telemetry?.onBreaker?.({ state: "open", host });
      return false;
    }
    return true;
  }

  recordSuccess(host: string): void {
    const state = getState(host);
    state.failures = 0;
    state.state = "closed";
    state.openedAt = undefined;
    this.options.telemetry?.onBreaker?.({ state: "closed", host });
  }

  recordFailure(host: string): void {
    const state = getState(host);
    const nowTs = now();
    state.lastFailureAt = nowTs;
    if (state.state === "half-open") {
      state.state = "open";
      state.openedAt = nowTs;
      this.options.telemetry?.onBreaker?.({ state: "open", host });
      return;
    }
    if (!state.openedAt || nowTs - state.openedAt > this.options.windowMs) {
      state.openedAt = nowTs;
      state.failures = 0;
    }
    state.failures += 1;
    if (state.failures >= this.options.failureThreshold) {
      state.state = "open";
      state.openedAt = nowTs;
      this.options.telemetry?.onBreaker?.({ state: "open", host });
    }
  }
}
