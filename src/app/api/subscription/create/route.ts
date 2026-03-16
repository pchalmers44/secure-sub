import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { handleApi, parseJson } from "@/lib/api/handler";
import { getRequestContext } from "@/lib/requestContext";
import {
  createInvoiceForSubscription,
  createSubscription,
} from "@/services/billingRepository";
import { writeAuditLog } from "@/services/auditLogService";
import { createSubscriptionSchema } from "@/lib/validation/subscription";

export async function POST(req: NextRequest) {
  return handleApi(
    req,
    async () => {
      const input = await parseJson(req, createSubscriptionSchema);
      const subscription = await createSubscription(input);
      const invoice = await createInvoiceForSubscription({
        subscriptionId: subscription.id,
        amountDueCents: 4900,
        currency: "USD",
      });

      await writeAuditLog({
        action: "subscription.create",
        outcome: "success",
        entityType: "Subscription",
        entityId: subscription.id,
        context: getRequestContext(req),
        metadata: { customerId: input.customerId, planId: input.planId, invoiceId: invoice.id },
      });

      return NextResponse.json(
        { subscription, invoice },
        { status: 201 },
      );
    },
    {
      rateLimit: { limit: 10, windowMs: 60_000, keyPrefix: "api:sub:create" },
      csrf: true,
    },
  );
}
