import {
  cancelSubscriptionSchema,
  createSubscriptionSchema,
} from "@/lib/validation/subscription";

describe("validation/subscription", () => {
  test("createSubscriptionSchema requires ids", () => {
    const res = createSubscriptionSchema.safeParse({ customerId: "", planId: "" });
    expect(res.success).toBe(false);
  });

  test("cancelSubscriptionSchema requires subscriptionId", () => {
    const res = cancelSubscriptionSchema.safeParse({ subscriptionId: "  " });
    expect(res.success).toBe(false);
  });
});

