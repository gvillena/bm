export const QK = {
  moments: (params?: string) => ["moments", "list", params ?? "default"] as const,
  moment: (id: string) => ["moments", id] as const,
  agreement: (id: string) => ["agreements", id] as const,
  policyAuth: (kind: string, id: string, vcHash: string) => ["policies", kind, id, vcHash] as const,
  consentLedger: (page: number) => ["consent", "ledger", page] as const,
  tiers: () => ["payments", "tiers"] as const,
  profile: (userId: string) => ["profiles", userId] as const,
  profileSettings: () => ["profiles", "settings"] as const,
  invitations: (momentId: string) => ["invitations", momentId] as const,
};
