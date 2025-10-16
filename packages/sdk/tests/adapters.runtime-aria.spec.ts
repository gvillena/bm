import { describe, expect, it } from "vitest";
import { createRuntimeAdapter } from "../src/adapters/runtime.adapter.js";
import { createAriaAdapter } from "../src/adapters/aria.adapter.js";

class MockHttpClient {
  calls: Array<{ url: string; body: unknown }> = [];
  async post<T>(url: string, body?: unknown): Promise<T> {
    this.calls.push({ url, body });
    return {} as T;
  }
}

describe("Adapters", () => {
  it("wires runtime effects", async () => {
    const moments = {
      create: async () => ({ id: "m1", auditId: "aud" }),
      publish: async () => ({ auditId: "aud" }),
    } as any;
    const policies = {
      authorizeViewMoment: async () => ({ effect: "PERMIT", reasons: [] }),
    } as any;
    const consent = {
      confirmConsent: async () => ({ consentId: "c1", auditId: "aud" }),
    } as any;

    const runtime = createRuntimeAdapter({ moments, policies, consent });
    const draft = await runtime.saveMomentDraft({ title: "t", teaser: "x" });
    expect(draft.id).toBe("m1");
    const auth = await runtime.serverAuthorizeViewMoment({ role: "viewer", tier: "FREE" }, "m1");
    expect(auth.effect).toBe("PERMIT");
  });

  it("sends aria feedback", async () => {
    const http = new MockHttpClient();
    const aria = createAriaAdapter({ client: http as any });
    await aria.sendFeedback({ thumbs: "up", context: { graphId: "g", nodeId: "n" } });
    await aria.confirmObligation({ code: "CONSENT" });
    expect(http.calls.map((c) => c.url)).toEqual(["aria/feedback", "aria/obligations/confirm"]);
  });
});
