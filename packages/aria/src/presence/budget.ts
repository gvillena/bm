import { MINUTE, normalizeTimestamp, isWithinWindow } from "../utils/time.js";

export interface PresenceBudgetConfig {
  perMinute: number;
  perNode: number;
  backoffMs: number;
}

interface NodeBudgetState {
  history: number[];
  backoffUntil: number;
  lastShown: number;
}

/**
 * PresenceBudget prevents ARIA from over-intervening with the participant.
 * It enforces per-minute and per-node limits while respecting backoff windows
 * created when a user dismisses or ignores a suggestion.
 */
export class PresenceBudget {
  private readonly cfg: PresenceBudgetConfig;

  private readonly nodeStates = new Map<string, NodeBudgetState>();

  private globalHistory: number[] = [];

  private globalBackoffUntil = 0;

  private userActive = false;

  constructor(cfg: PresenceBudgetConfig) {
    if (cfg.perMinute <= 0) {
      throw new Error("perMinute must be greater than zero");
    }
    if (cfg.perNode <= 0) {
      throw new Error("perNode must be greater than zero");
    }
    this.cfg = cfg;
  }

  setUserActive(active: boolean): void {
    this.userActive = active;
  }

  canShow(now: number, nodeId: string): boolean {
    const timestamp = normalizeTimestamp(now);
    if (this.userActive) {
      return false;
    }
    if (timestamp < this.globalBackoffUntil) {
      return false;
    }
    this.trimGlobalHistory(timestamp);
    if (this.globalHistory.length >= this.cfg.perMinute) {
      return false;
    }

    const state = this.getNodeState(nodeId);
    this.trimNodeHistory(state, timestamp);
    if (timestamp < state.backoffUntil) {
      return false;
    }
    if (state.history.length >= this.cfg.perNode) {
      return false;
    }

    return true;
  }

  recordShown(now: number, nodeId: string): void {
    const timestamp = normalizeTimestamp(now);
    this.trimGlobalHistory(timestamp);
    this.globalHistory.push(timestamp);

    const state = this.getNodeState(nodeId);
    this.trimNodeHistory(state, timestamp);
    state.history.push(timestamp);
    state.lastShown = timestamp;
  }

  recordDismiss(now: number, nodeId: string): void {
    const timestamp = normalizeTimestamp(now);
    const state = this.getNodeState(nodeId);
    state.backoffUntil = Math.max(state.backoffUntil, timestamp + this.cfg.backoffMs);
    this.globalBackoffUntil = Math.max(this.globalBackoffUntil, timestamp + this.cfg.backoffMs);
  }

  private getNodeState(nodeId: string): NodeBudgetState {
    const existing = this.nodeStates.get(nodeId);
    if (existing) {
      return existing;
    }
    const initial: NodeBudgetState = { history: [], backoffUntil: 0, lastShown: 0 };
    this.nodeStates.set(nodeId, initial);
    return initial;
  }

  private trimGlobalHistory(now: number): void {
    this.globalHistory = this.globalHistory.filter((ts) => isWithinWindow(now, ts, MINUTE));
  }

  private trimNodeHistory(state: NodeBudgetState, now: number): void {
    state.history = state.history.filter((ts) => isWithinWindow(now, ts, MINUTE));
    if (!isWithinWindow(now, state.lastShown, MINUTE)) {
      state.lastShown = 0;
    }
  }
}
