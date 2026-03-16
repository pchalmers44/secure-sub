import type Stripe from "stripe";

import { getPrisma } from "@/lib/prisma";
import { writeAuditLog } from "@/services/auditLogService";
import { getStripe } from "@/services/stripeService";
import { upsertInvoiceFromStripe, upsertSubscriptionFromStripe } from "@/services/stripeSyncService";

export type CreateCheckoutSessionParams = {
  userId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
};

export async function createSubscriptionCheckoutSession(
  params: CreateCheckoutSessionParams,
) {
  const prisma = getPrisma();
  const stripe = getStripe();

  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    select: { id: true, email: true, name: true, stripeCustomerId: true },
  });
  if (!user) throw new Error("User not found.");

  const customerId =
    user.stripeCustomerId ??
    (
      await stripe.customers.create({
        email: user.email,
        name: user.name ?? undefined,
        metadata: { userId: user.id },
      })
    ).id;

  if (!user.stripeCustomerId) {
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: params.priceId, quantity: 1 }],
    allow_promotion_codes: true,
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: { userId: user.id },
    subscription_data: {
      metadata: { userId: user.id },
    },
  });

  await writeAuditLog({
    action: "billing.view_subscription",
    outcome: "success",
    userId: user.id,
    entityType: "StripeCheckoutSession",
    entityId: session.id,
    metadata: { priceId: params.priceId },
  });

  return { id: session.id, url: session.url };
}

export async function handleStripeWebhookEvent(event: Stripe.Event) {
  const stripe = getStripe();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const subscriptionId =
        typeof session.subscription === "string" ? session.subscription : null;
      if (subscriptionId) {
        const sub = await stripe.subscriptions.retrieve(subscriptionId, {
          expand: ["items.data.price"],
        });
        await upsertSubscriptionFromStripe(sub);
      }
      return;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await upsertSubscriptionFromStripe(subscription);
      return;
    }

    case "invoice.finalized":
    case "invoice.paid":
    case "invoice.payment_failed":
    case "invoice.voided":
    case "invoice.marked_uncollectible": {
      const invoice = event.data.object as Stripe.Invoice;
      await upsertInvoiceFromStripe(invoice);
      return;
    }

    default:
      return;
  }
}

