import type { UserProfile } from '../entities/userProfile.entity.js';

export function calculateProfileCompletion(profile: UserProfile): number {
  const checks: boolean[] = [];
  checks.push(profile.alias.toString().length > 0);
  checks.push(profile.tone.toString().length > 0);
  checks.push(profile.aura.toString().length > 0);
  const discoverability = profile.discoverability;
  checks.push(discoverability.searchable);
  checks.push(discoverability.score !== undefined);
  checks.push(profile.globalBoundaries.length > 0);
  const completed = checks.filter(Boolean).length;
  return Math.round((completed / checks.length) * 100);
}
