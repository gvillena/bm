import type { UiDirectives } from "../presence/types.js";

export interface VoiceSynthesisPayload {
  text: string;
  locale?: string;
  tone?: string;
}

export interface VoiceAdapter {
  speak(directives: UiDirectives): VoiceSynthesisPayload | null;
}

export class NoopVoiceAdapter implements VoiceAdapter {
  speak(): VoiceSynthesisPayload | null {
    return null;
  }
}
