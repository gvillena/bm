import { celebrateProgress } from "./strategies/celebrateProgress.js";
import { coCreateMoment } from "./strategies/coCreateMoment.js";
import { explainStep } from "./strategies/explainStep.js";
import { reviewLimits } from "./strategies/reviewLimits.js";
import { safeIntervention } from "./strategies/safeIntervention.js";
import type { IntentRegistry, IntentStrategy, RelationalIntent } from "./types.js";

const STRATEGIES: IntentStrategy[] = [
  coCreateMoment,
  reviewLimits,
  explainStep,
  safeIntervention,
  celebrateProgress
];

const registryMap: Partial<IntentRegistry> = {};
for (const strategy of STRATEGIES) {
  registryMap[strategy.intent] = strategy;
}

export const intentRegistry: IntentRegistry = registryMap as IntentRegistry;

export function getIntentStrategy(intent: RelationalIntent): IntentStrategy {
  const strategy = intentRegistry[intent];
  if (!strategy) {
    throw new Error(`Intent strategy not registered: ${intent}`);
  }
  return strategy;
}
