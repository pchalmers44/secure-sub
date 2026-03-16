import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Stripe from "stripe";

import { enforceRateLimit } from "@/lib/security/rateLimit";
import { jsonError } from "@/utils/api";
import { getStripe } from "@/services/stripeService";
import { handleStripeWebhookEvent } from "@/services/stripeBillingService";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    enforceRateLimit(req, {
      limit: 300,
      windowMs: 60_000,
      keyPrefix: "api:stripe:webhook",
    });

    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return jsonError("Missing Stripe signature.", {
        status: 400,
        code: "MISSING_SIGNATURE",
      });
    }

    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) {
      return jsonError("Server misconfigured: STRIPE_WEBHOOK_SECRET is missing.", {
        status: 500,
        code: "MISSING_WEBHOOK_SECRET",
      });
    }

    const stripe = getStripe();
    const payload = await req.text();

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(payload, signature, secret);
    } catch (err) {
      return jsonError("Invalid webhook signature.", {
        status: 400,
        code: "INVALID_SIGNATURE",
        details: err instanceof Error ? err.message : undefined,
      });
    }

    await handleStripeWebhookEvent(event);
    return NextResponse.json({ received: true });
  } catch (error) {
    return jsonError("Webhook handler error.", {
      status: 500,
      code: "WEBHOOK_ERROR",
      details: error instanceof Error ? error.message : undefined,
    });
  }
}

