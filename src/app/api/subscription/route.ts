import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { handleApi, parseQuery } from "@/lib/api/handler";
import { getRequestContext } from "@/lib/requestContext";
import { getLatestSubscriptionByCustomerId } from "@/services/billingRepository";
import { jsonError } from "@/utils/api";
import { subscriptionQuerySchema } from "@/lib/validation/subscription";
import { writeAuditLog } from "@/services/auditLogService";

export async function GET(req: NextRequest) {
  return handleApi(
    req,
    async () => {
      const query = parseQuery(req.nextUrl.searchParams, subscriptionQuerySchema);
      const customerId = req.headers.get("x-customer-id") ?? query.customerId ?? null;

      if (!customerId) {
        return jsonError("Missing `customerId` (query or x-customer-id header).", {
          status: 400,
          code: "INVALID_CUSTOMER_ID",
        });
      }

      const subscription = await getLatestSubscriptionByCustomerId(customerId);

      await writeAuditLog({
        action: "billing.view_subscription",
        outcome: "success",
        entityType: "Subscription",
        entityId: subscription?.id ?? null,
        context: getRequestContext(req),
        metadata: { customerId },
      });

      return NextResponse.json({ subscription });
    },
    { rateLimit: { limit: 60, windowMs: 60_000, keyPrefix: "api:sub:get" } },
  );
}
