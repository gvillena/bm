export type {
  PresenceLevel,
  AuraPreset,
  UiAction,
  Tone,
  RuntimeCtx,
  RuntimeSignal,
} from "./presence/types.js";
export {
  PresenceController,
  type PresenceControllerArgs,
} from "./presence/controller.js";
export {
  PresenceBudget,
  type PresenceBudgetConfig,
} from "./presence/budget.js";
export {
  getAuraPreset,
  AURA_PRESETS,
  type AuraPresetDefinition,
} from "./presence/aura-presets.js";

export type {
  RelationalIntent,
  IntentContext,
  IntentRegistry,
  IntentStrategy,
  SceneNodeSummary,
} from "./intent/types.js";
export { intentRegistry, getIntentStrategy } from "./intent/registry.js";

export { COPY } from "./prompts/system-copy.js";
export { formatPrompt, formatCopy, mergePrompts } from "./prompts/formatter.js";

export type {
  Guardrails,
  GuardrailContext,
  GuardrailResult,
  GuardrailTrigger,
} from "./policies/guardrails.js";
export { defaultGuardrails } from "./policies/guardrails.js";
export { filterDirectives } from "./policies/filters.js";

export {
  mapRuntimeEvent,
  createRuntimeAdapter,
  type RawRuntimeEvent,
  type RuntimeEventHandler,
} from "./adapters/runtime.adapter.js";
export {
  decisionToDirectives,
  buildObligationActions,
  type PolicyAdapterOptions,
} from "./adapters/policies.adapter.js";
export {
  NoopSdkActionHook,
  type SdkActionHook,
} from "./adapters/sdk.adapter.js";
export {
  NoopVoiceAdapter,
  type VoiceAdapter,
  type VoiceSynthesisPayload,
} from "./adapters/voice.adapter.js";

export {
  AriaPresenceProvider,
  AriaPresenceContext,
  type AriaPresenceContextValue,
} from "./composition/context.js";
export { useAriaPresence } from "./composition/useAriaPresence.js";
export { useAriaDirectives } from "./composition/useAriaDirectives.js";
export {
  useAriaIntent,
  type UseAriaIntentOptions,
  type TriggerIntentOverrides,
} from "./composition/useAriaIntent.js";

export type {
  AriaTelemetry,
  PresenceShownEvent,
  PresenceDismissEvent,
  IntentHandledEvent,
  GuardrailEvent,
} from "./telemetry/index.js";
export { consoleTelemetry } from "./telemetry/index.js";

export { assert, exhaustiveCheck } from "./utils/assert.js";
export { createId } from "./utils/id.js";
export {
  normalizeTimestamp,
  MINUTE,
  SECOND,
  isWithinWindow,
} from "./utils/time.js";

export type { UiDirectives } from "./presence/types.js";
