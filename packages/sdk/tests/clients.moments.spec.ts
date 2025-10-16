import { describe, expect, it, vi } from "vitest";
import { HttpClient } from "../src/api/client.js";
import { createMomentsClient } from "../src/clients/momentsClient.js";

const baseURL = "https://api.test";

describe("MomentsClient", () => {
  it("lists and publishes moments", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ items: [], page: 1, pageSize: 20, total: 0 }), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ auditId: "aud-1" }), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      );
    vi.stubGlobal("fetch", fetchMock);
    const http = new HttpClient({ baseURL });
    const client = createMomentsClient(http);

    const page = await client.list({ page: 1 });
    expect(page.page).toBe(1);
    const publish = await client.publish("moment-1");
    expect(publish.auditId).toBe("aud-1");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
