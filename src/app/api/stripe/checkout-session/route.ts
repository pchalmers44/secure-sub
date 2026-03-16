import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { handleApi, parseJson } from "@/lib/api/handler";
import { createCheckoutSessionSchema } from "@/lib/validation/stripe";
import { createSubscriptionCheckoutSession } from "@/services/stripeBillingService";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  return handleApi(
    req,
    async () => {
      const body = await parseJson(req, createCheckoutSessionSchema);
      const demoUserId = process.env.STRIPE_DEMO_USER_ID;
      if (!demoUserId) {
        return NextResponse.json(
          {
            error: {
              message:
                "Stripe checkout is disabled in this build. Set STRIPE_DEMO_USER_ID to enable demo checkout.",
              code: "STRIPE_CHECKOUT_DISABLED",
            },
          },
          { status: 501 },
        );
      }

      const checkout = await createSubscriptionCheckoutSession({
        userId: demoUserId,
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
