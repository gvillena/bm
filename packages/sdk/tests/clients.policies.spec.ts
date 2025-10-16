import { describe, expect, it, vi } from "vitest";
import { HttpClient } from "../src/api/client.js";
import { createPoliciesClient } from "../src/clients/policiesClient.js";
import type { ViewerContext } from "../src/types/index.js";
import { SdkPolicyError } from "../src/types/errors.js";

const baseURL = "https://api.test";

const viewer: ViewerContext = {
  role: "viewer",
  tier: "FREE",
};

describe("PoliciesClient", () => {
  it("authorizes view moment", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ effect: "PERMIT", reasons: [] }), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      ),
    );

    const http = new HttpClient({ baseURL });
    const client = createPoliciesClient(http);
    const decision = await client.authorizeViewMoment(viewer, "moment-1");
    expect(decision.effect).toBe("PERMIT");
  });

  it("surfaces policy denies", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ error: { code: "POLICY_DENY", message: "denied" } }), {
          status: 403,
          headers: { "content-type": "application/json" },
        }),
      ),
    );
    const http = new HttpClient({ baseURL });
    const client = createPoliciesClient(http);
    await expect(client.authorizeEditAgreement(viewer, "agr-1")).rejects.toBeInstanceOf(SdkPolicyError);
  });
});
