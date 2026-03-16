import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth";

import { handleApi, parseJson } from "@/lib/api/handler";
import { authOptions } from "@/lib/auth";
import { createCheckoutSessionSchema } from "@/lib/validation/stripe";
import { createSubscriptionCheckoutSession } from "@/services/stripeBillingService";
import { jsonError } from "@/utils/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  return handleApi(
    req,
    async () => {
      const session = await getServerSession(authOptions);
      const userId = (session?.user as { id?: string } | undefined)?.id ?? null;
      if (!userId) {
        return jsonError("Unauthorized.", { status: 401, code: "UNAUTHORIZED" });
      }

      const body = await parseJson(req, createCheckoutSessionSchema);
      const checkout = await createSubscriptionCheckoutSession({
        userId,
        priceId: body.priceId,
        successUrl: body.successUrl,
        cancelUrl: body.cancelUrl,
      });

      return NextResponse.json({ sessionId: checkout.id, url: checkout.url });
    },
    {
      rateLimit: { limit: 10, windowMs: 60_000, keyPrefix: "api:stripe:checkout" },
      csrf: true,
    },
  );
}

