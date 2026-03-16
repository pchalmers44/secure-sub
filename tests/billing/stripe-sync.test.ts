import { vi } from "vitest";
import type { Mock } from "vitest";
import type Stripe from "stripe";

vi.mock("@/lib/prisma", () => ({
  getPrisma: () => ({
    subscription: {
      upsert: vi.fn(async () => ({})),
      findUnique: vi
        .fn()
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: "sub_db_1" })
        .mockResolvedValue({ id: "sub_db_1" }),
      create: vi.fn(async () => ({})),
    },
    invoice: {
      upsert: vi.fn(async () => ({})),
    },
  }),
}));

describe("stripeSyncService", () => {
  test("upsertSubscriptionFromStripe maps status and price", async () => {
    const { upsertSubscriptionFromStripe } = await import(
      "@/services/stripeSyncService"
    );
    const { getPrisma } = await import("@/lib/prisma");
    const prisma = getPrisma() as unknown as {
      subscription: { upsert: Mock };
    };

    await upsertSubscriptionFromStripe({
      id: "sub_stripe_1",
      customer: "cus_1",
      status: "trialing",
      cancel_at: null,
      canceled_at: null,
      cancel_at_period_end: false,
      metadata: { userId: "user_1" },
      items: { data: [{ price: { id: "price_1" }, current_period_end: Math.floor(Date.now() / 1000) + 3600 }] },
    } as unknown as Stripe.Subscription);

    expect(prisma.subscription.upsert).toHaveBeenCalled();
    const call = prisma.subscription.upsert.mock.calls[0]?.[0] as unknown as {
      where: { stripeSubscriptionId: string };
      update: { status: string; planId: string };
    };
    expect(call.where.stripeSubscriptionId).toBe("sub_stripe_1");
    expect(call.update.status).toBe("trialing");
    expect(call.update.planId).toBe("price_1");
  });

  test("upsertInvoiceFromStripe upserts invoice using parent subscription_details", async () => {
    const { upsertInvoiceFromStripe } = await import(
      "@/services/stripeSyncService"
    );
    const { getPrisma } = await import("@/lib/prisma");
    const prisma = getPrisma() as unknown as {
      invoice: { upsert: Mock };
    };

    await upsertInvoiceFromStripe({
      id: "in_1",
      customer: "cus_1",
      parent: { subscription_details: { subscription: "sub_stripe_1" } },
      number: "SCS-1000",
      amount_due: 4900,
      currency: "usd",
      status: "paid",
      hosted_invoice_url: "https://example.com/inv",
      created: Math.floor(Date.now() / 1000),
    } as unknown as Stripe.Invoice);

    expect(prisma.invoice.upsert).toHaveBeenCalled();
    const call = prisma.invoice.upsert.mock.calls[0]?.[0] as unknown as {
      where: { stripeInvoiceId: string };
      create: { status: string };
    };
    expect(call.where.stripeInvoiceId).toBe("in_1");
    expect(call.create.status).toBe("paid");
  });
});
