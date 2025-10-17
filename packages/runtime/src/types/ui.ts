export type Tone =
  | "neutral"
  | "warm"
  | "direct"
  | "protective"
  | "caring"
  | "calm"
  | "clear";

export interface UiAction {
  name: string;
  params?: Record<string, unknown>;
}

export interface UiDirectives {
  tone?: Tone;
  actions?: UiAction[];
}
