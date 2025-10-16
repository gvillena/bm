import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { HttpClient } from "../src/api/client.js";
import { setAccessToken, clearSession } from "../src/auth/session.js";

const baseURL = "https://api.test";

describe("HttpClient", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    setAccessToken(null);
  });

  afterEach(() => {
    clearSession();
  });

  it("attaches auth and trace headers", async () => {
    setAccessToken("abc123");
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json", "x-request-id": "req-1" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const client = new HttpClient({ baseURL });
    await client.get("/moments");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`${baseURL}/moments`);
    const headers = new Headers(init?.headers as HeadersInit);
    expect(headers.get("authorization")).toBe("Bearer abc123");
    expect(headers.get("x-trace-id")).toBeTruthy();
  });

  it("retries on 429 respecting retry-after", async () => {
    const responses = [
      new Response(JSON.stringify({ error: { code: "RATE_LIMITED" } }), {
        status: 429,
        headers: { "content-type": "application/json", "retry-after": "0" },
      }),
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    ];
    const fetchMock = vi.fn().mockImplementation(() => Promise.resolve(responses.shift()!));
    vi.stubGlobal("fetch", fetchMock);

    const client = new HttpClient({ baseURL });
    const result = await client.get<{ ok: boolean }>("/moments", { retry: true });

    expect(result.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("normalises non-json responses", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(undefined, {
        status: 204,
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const client = new HttpClient({ baseURL });
    const result = await client.get("/ping");
    expect(result).toBeUndefined();
  });
});
