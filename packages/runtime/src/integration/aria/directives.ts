import type { RuntimeActionRef } from "../../actions/types.js";

export interface UiDirectiveAction {
  readonly label: string;
  readonly actionRef: RuntimeActionRef;
}

export interface UiDirectives {
  readonly hints?: string[];
  readonly actions?: UiDirectiveAction[];
  readonly tone?: "calm" | "clear" | "protective";
}
