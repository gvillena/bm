import type { Decision, Obligation } from "@bm/policies";
import { COPY } from "../prompts/system-copy.js";
import type { UiAction, UiDirectives } from "../presence/types.js";

const OBLIGATION_LABELS: Record<string, string> = {
  CONFIRM_CONSENT_SERVER: COPY.consent.needConfirm,
  CONTACT_HUMAN_SUPPORT: COPY.safe.contactHuman
};

const OBLIGATION_ACTIONS: Record<string, { label: string; name: string }> = {
  CONFIRM_CONSENT_SERVER: { label: COPY.consent.confirmAction, name: "openConsentReview" },
  CONTACT_HUMAN_SUPPORT: { label: COPY.safe.contactHuman, name: "contactHumanSupport" }
};

export interface PolicyAdapterOptions {
  nodeId: string;
}

export function buildObligationActions(obligations: Obligation[] | undefined, options: PolicyAdapterOptions): UiAction[] {
  if (!obligations || obligations.length === 0) {
    return [];
  }
  const actions: UiAction[] = [];
  for (const obligation of obligations) {
    const metadata = OBLIGATION_ACTIONS[obligation.code];
    if (metadata) {
      actions.push({
        label: metadata.label,
        actionRef: { name: metadata.name, params: { nodeId: options.nodeId, obligation: obligation.code } },
        kind: "primary",
        requiresConsent: obligation.code === "CONFIRM_CONSENT_SERVER"
      });
    }
  }
  return actions;
}

export function decisionToDirectives(decision: Decision | null | undefined, options: PolicyAdapterOptions): UiDirectives | null {
  if (!decision) {
    return null;
  }
  if (decision.effect === "PERMIT") {
    return null;
  }
  const hints: string[] = [];
  const actions: UiAction[] = [];

  if (decision.effect === "REDACT") {
    hints.push("El contenido está redactado según la política actual. Puedes solicitar acceso.");
    actions.push({
      label: COPY.actions.requestAccess,
      actionRef: { name: "requestAccess", params: { nodeId: options.nodeId } },
      kind: "primary"
    });
    actions.push({
      label: COPY.actions.invite,
      actionRef: { name: "openInviteDialog", params: { nodeId: options.nodeId } },
      kind: "secondary"
    });
  }

  for (const obligation of decision.obligations ?? []) {
    const label = OBLIGATION_LABELS[obligation.code];
    if (label) {
      hints.push(label);
    }
    actions.push(...buildObligationActions([obligation], options));
  }

  if (hints.length === 0 && actions.length === 0) {
    return null;
  }

  return {
    hints,
    actions,
    tone: decision.effect === "DENY" ? "protective" : "direct",
    explain:
      decision.effect === "DENY"
        ? "Hay una obligación pendiente antes de continuar."
        : "Necesitas completar un paso antes de acceder a este contenido.",
    ephemeral: false
  };
}
