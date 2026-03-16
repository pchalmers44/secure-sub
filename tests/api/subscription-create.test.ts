import { vi } from "vitest";
import type { NextRequest } from "next/server";

import { mockNextRequest } from "../helpers/mockNextRequest";

vi.mock("@/services/billingRepository", () => ({
  createSubscription: vi.fn(async () => ({
    id: "sub_db_1",
    customerId: "cus_123",
    planId: "price_123",
  })),
  createInvoiceForSubscription: vi.fn(async () => ({
    id: "inv_db_1",
  })),
}));

vi.mock("@/services/auditLogService", () => ({
  writeAuditLog: vi.fn(async () => undefined),
}));

describe("/api/subscription/create", () => {
  test("rejects CSRF origin mismatch", async () => {
    const { POST } = await import("@/app/api/subscription/create/route");
    const req = mockNextRequest({
      url: "http://localhost:3000/api/subscription/create",
      method: "POST",
      headers: {
        origin: "https://evil.example",
        host: "localhost:3000",
        "content-type": "application/json",
      },
      jsonBody: { customerId: "cus_123", planId: "price_123" },
    });

    const res = await POST(req as unknown as NextRequest);
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error.code).toBe("CSRF_ORIGIN_MISMATCH");
  });

  test("creates subscription when valid", async () => {
    const { POST } = await import("@/app/api/subscription/create/route");
    const req = mockNextRequest({
      url: "http://localhost:3000/api/subscription/create",
      method: "POST",
      headers: {
        origin: "http://localhost:3000",
        host: "localhost:3000",
        "content-type": "application/json",
        "x-forwarded-for": "127.0.0.1",
      },
      jsonBody: { customerId: "cus_123", planId: "price_123" },
    });

    const res = await POST(req as unknown as NextRequest);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.subscription.id).toBe("sub_db_1");
    expect(body.invoice.id).toBe("inv_db_1");
  });
});
