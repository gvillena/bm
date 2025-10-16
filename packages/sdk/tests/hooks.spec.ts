import React from "react";
import { describe, expect, it, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useMoment,
  useCreateMoment,
  useAuthorizeViewMoment,
  usePaymentTiers,
} from "../src/hooks/index.js";
import { configureClients } from "../src/clients/registry.js";
import type { SdkClients } from "../src/clients/registry.js";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("React Query hooks", () => {
  beforeEach(() => {
    const clients: SdkClients = {
      moments: {
        list: async () => ({ items: [], page: 1, pageSize: 10, total: 0 }),
        get: async () => ({ id: "m1", teaser: "hello" }),
        create: async () => ({ id: "m1", auditId: "aud" }),
        update: async () => ({ auditId: "aud" }),
        publish: async () => ({ auditId: "aud" }),
        unpublish: async () => ({ auditId: "aud" }),
        simulateERD: async () => ({ effect: "PERMIT" }),
      },
      agreements: {
        get: async () => ({ id: "a1", ownerId: "u1", state: "draft" }),
        createDraft: async () => ({ agreementId: "a1", auditId: "aud" }),
        updateDraft: async () => ({ auditId: "aud" }),
        diff: async () => ({ fields: [] }),
        submitForReview: async () => ({ auditId: "aud" }),
        approve: async () => ({ auditId: "aud" }),
        sign: async () => ({ auditId: "aud" }),
      },
      profiles: {
        getProfile: async () => ({ id: "u1", displayName: "Test" }),
        updateProfile: async () => ({ auditId: "aud" }),
        getSettings: async () => ({ emailNotifications: true, smsNotifications: false, visibilityPreset: "friends" }),
        updateSettings: async () => ({ auditId: "aud" }),
        listVisibilityPresets: async () => ["friends"],
      },
      invitations: {
        list: async () => [],
        create: async () => ({ invitationId: "i1", auditId: "aud" }),
        send: async () => ({ auditId: "aud" }),
        accept: async () => ({ auditId: "aud" }),
        reject: async () => ({ auditId: "aud" }),
      },
      policies: {
        authorizeViewMoment: async () => ({ effect: "PERMIT", reasons: [] }),
        authorizeEditAgreement: async () => ({ effect: "PERMIT", reasons: [] }),
        getPolicySnapshot: async () => ({ policySnapshotId: "ps-1" }),
      },
      consent: {
        confirmConsent: async () => ({ consentId: "c1", auditId: "aud" }),
        listLedger: async () => ({ items: [], page: 1, pageSize: 20, total: 0 }),
      },
      payments: {
        getTiers: async () => [{ tier: "FREE", price: 0, currency: "USD", benefits: [] }],
        subscribe: async () => ({ subscriptionId: "s1", auditId: "aud" }),
        verifyPaymentIntent: async () => ({ status: "succeeded" }),
      },
      notifications: {
        preview: async () => ({ text: "hi" }),
        send: async () => ({ auditId: "aud" }),
      },
    };
    configureClients(clients);
  });

  it("fetches a moment", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useMoment("m1"), { wrapper });
    await result.current.refetch();
    expect(result.current.data?.id).toBe("m1");
  });

  it("performs create mutation", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useCreateMoment(), { wrapper });
    await act(async () => {
      const res = await result.current.mutateAsync({ title: "t", teaser: "x" });
      expect(res.id).toBe("m1");
    });
  });

  it("authorizes view moment without retries", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useAuthorizeViewMoment({ role: "viewer", tier: "FREE" }, "m1"), {
      wrapper,
    });
    await result.current.refetch();
    expect(result.current.data?.effect).toBe("PERMIT");
  });

  it("fetches payment tiers", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => usePaymentTiers(), { wrapper });
    await result.current.refetch();
    expect(result.current.data?.[0].tier).toBe("FREE");
  });
});
