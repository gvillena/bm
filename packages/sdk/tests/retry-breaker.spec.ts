import { describe, expect, it } from "vitest";
import { CircuitBreaker } from "../src/api/circuit-breaker.js";
import { withRetryForResponse, retryableShouldRetry } from "../src/api/retry.js";

describe("Resilience utilities", () => {
  it("opens breaker after failures", () => {
    const breaker = new CircuitBreaker({ failureThreshold: 2, openTimeMs: 10, windowMs: 50 });
    const host = "api.test";
    expect(breaker.allowRequest(host)).toBe(true);
    breaker.recordFailure(host);
    breaker.recordFailure(host);
    expect(breaker.allowRequest(host)).toBe(false);
  });

  it("retries failed responses", async () => {
    const sequence = [
      new Response("", { status: 502 }),
      new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "content-type": "application/json" } }),
    ];
    let calls = 0;
    const response = await withRetryForResponse(
      async () => {
        calls += 1;
        return sequence[calls - 1];
      },
      retryableShouldRetry,
    );
    expect(response.status).toBe(200);
    expect(calls).toBe(2);
  });
});
