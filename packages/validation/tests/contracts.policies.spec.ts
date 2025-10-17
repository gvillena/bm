import { describe, expect, it } from "vitest";
import {
  AuthorizeViewMomentRequest,
  AuthorizeViewMomentResponse,
  PolicySnapshotResponse
} from "../src/contracts/policies.contract";

import { DecisionEffect } from "../src/schemas/policies.schema";

const viewerContext = {
  role: "viewer",
  tier: "FREE",
  relation: "none",
  reciprocityScore: "low",
  careScore: 42,
  emotionalState: "unknown",
  consentState: "missing",
  verificationLevel: 0
};

describe("Policy contracts", () => {
  it("parsea AuthorizeViewMomentRequest", () => {
    const parsed = AuthorizeViewMomentRequest.parse({
      viewerContext,
      resourceId: "00000000-0000-0000-0000-000000000000"
    });

    expect(parsed.viewerContext.role).toBe("viewer");
  });

  it("acepta decision PERMIT con dto redactado", () => {
    const response = AuthorizeViewMomentResponse.parse({
      effect: DecisionEffect.Enum.PERMIT,
      reasons: [{ code: "policy.match" }],
      dto: {
        id: "00000000-0000-0000-0000-000000000000",
        teaser: "Teaser", 
        visibility: "PUBLIC"
      }
    });

    expect(response.effect).toBe("PERMIT");
    expect(response.dto?.visibility).toBe("PUBLIC");
  });

  it("produce snapshot con audit opcional", () => {
    const snapshot = PolicySnapshotResponse.parse({ policySnapshotId: "snap-1", auditId: "aud-999" });
    expect(snapshot.auditId).toBe("aud-999");
  });
});
