import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { handleApi, parseQuery } from "@/lib/api/handler";
import { getRequestContext } from "@/lib/requestContext";
import {
  getLatestSubscriptionByCustomerId,
  listInvoicesBySubscriptionId,
} from "@/services/billingRepository";
import { jsonError } from "@/utils/api";
import { invoicesQuerySchema } from "@/lib/validation/invoices";
import { writeAuditLog } from "@/services/auditLogService";

export async function GET(req: NextRequest) {
  return handleApi(
    req,
    async () => {
      const query = parseQuery(req.nextUrl.searchParams, invoicesQuerySchema);
      const subscriptionId = query.subscriptionId ?? null;
      const customerId = req.headers.get("x-customer-id") ?? query.customerId ?? null;

      if (!subscriptionId && !customerId) {
        return jsonError(
          "Provide `subscriptionId` or `customerId` (query or x-customer-id header).",
          { status: 400, code: "MISSING_FILTER" },
        );
      }

      const resolvedSubscriptionId =
        subscriptionId ??
        (await getLatestSubscriptionByCustomerId(customerId!))?.id ??
        null;

      if (!resolvedSubscriptionId) return NextResponse.json({ invoices: [] });

      const invoices = await listInvoicesBySubscriptionId(resolvedSubscriptionId);

      await writeAuditLog({
        action: "billing.view_invoices",
        outcome: "success",
        entityType: "Subscription",
        entityId: resolvedSubscriptionId,
        context: getRequestContext(req),
        metadata: { customerId, subscriptionId: resolvedSubscriptionId, count: invoices.length },
      });

      return NextResponse.json({ invoices });
    },
    { rateLimit: { limit: 120, windowMs: 60_000, keyPrefix: "api:invoices" } },
  );
}
