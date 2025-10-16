import type { UiAction, UiDirectives } from "../presence/types.js";

export interface SdkActionHook {
  perform(action: UiAction, directives: UiDirectives): Promise<void> | void;
}

export class NoopSdkActionHook implements SdkActionHook {
  async perform(): Promise<void> {
    // intentionally empty to avoid side effects in the core package.
  }
}
