export type Tone = "neutral" | "warm" | "direct" | "caring" | "protective";

export interface UiAction {
  label: string;
  actionRef: {
    name: string;
    params?: Record<string, unknown>;
  };
  kind?: "primary" | "secondary" | "danger" | "ghost";
  requiresConsent?: boolean;
}

export interface UiDirectives {
  hints?: string[];
  actions?: UiAction[];
  tone?: Tone;
  explain?: string;
  ephemeral?: boolean;
}
