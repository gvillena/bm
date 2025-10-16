export interface PresenceShownEvent {
  graphId?: string;
  nodeId?: string;
  policySnapshotId?: string;
  directivesId: string;
  level: string;
  aura: string;
}

export interface PresenceDismissEvent {
  graphId?: string;
  nodeId?: string;
  policySnapshotId?: string;
  reason: string;
}

export interface IntentHandledEvent {
  intent: string;
  graphId?: string;
  nodeId?: string;
}

export interface GuardrailEvent {
  code: string;
  detail?: string;
  graphId?: string;
  nodeId?: string;
}

export interface AriaTelemetry {
  onPresenceShown?(event: PresenceShownEvent): void;
  onDismissed?(event: PresenceDismissEvent): void;
  onIntentHandled?(event: IntentHandledEvent): void;
  onGuardrail?(event: GuardrailEvent): void;
}

export const consoleTelemetry: AriaTelemetry = {
  onPresenceShown(event) {
    console.debug("aria.presence.shown", event);
  },
  onDismissed(event) {
    console.debug("aria.presence.dismissed", event);
  },
  onIntentHandled(event) {
    console.debug("aria.intent.handled", event);
  },
  onGuardrail(event) {
    console.debug("aria.guardrail", event);
  }
};
