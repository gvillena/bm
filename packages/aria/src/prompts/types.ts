export interface PromptTemplate {
  id: string;
  text: string;
  slots?: readonly string[];
  toneHint?: string;
}

export type PromptSlots = Record<string, string | number | boolean>;

export interface PromptSpec {
  template: PromptTemplate;
  values?: PromptSlots;
}

export interface FormattedPrompt {
  id: string;
  text: string;
}
