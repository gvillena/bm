import type { CareRule } from '../../shared/value-objects/care-rule.vo.js';

export function calculateMomentCareScore(rules: readonly CareRule[]): number {
  let score = 50;
  for (const rule of rules) {
    if (rule.kind === 'text') {
      score += Math.min(10, (rule.payload.text?.length ?? 0) / 20);
    }
    if (rule.kind === 'checkinInterval') {
      const minutes = Number(rule.payload.minutes ?? 0);
      if (minutes > 0) {
        score += Math.min(20, 120 / minutes);
      }
    }
    if (rule.kind === 'noMaterialCommitmentFirst') {
      score += 5;
    }
  }
  return Math.max(0, Math.min(100, Math.round(score)));
}
