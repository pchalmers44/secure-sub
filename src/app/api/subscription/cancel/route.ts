import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { handleApi, parseJson } from "@/lib/api/handler";
import { getRequestContext } from "@/lib/requestContext";
import { cancelSubscription } from "@/services/billingRepository";
import { writeAuditLog } from "@/services/auditLogService";
import { cancelSubscriptionSchema } from "@/lib/validation/subscription";

export async function POST(req: NextRequest) {
  return handleApi(
    req,
    async () => {
      const input = await parseJson(req, cancelSubscriptionSchema);
      const subscription = await cancelSubscription(input.subscriptionId);

      await writeAuditLog({
        action: "subscription.cancel",
        outcome: "success",
        entityType: "Subscription",
        entityId: subscription.id,
        context: getRequestContext(req),
      });

      return NextResponse.json({ subscription });
    },
    {
      rateLimit: { limit: 10, windowMs: 60_000, keyPrefix: "api:sub:cancel" },
      csrf: true,
    },
  );
}
