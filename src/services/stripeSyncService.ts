import type Stripe from "stripe";

import { getPrisma } from "@/lib/prisma";

function mapSubscriptionStatus(status: Stripe.Subscription.Status) {
  switch (status) {
    case "active":
      return "active" as const;
    case "trialing":
      return "trialing" as const;
    case "past_due":
    case "unpaid":
      return "past_due" as const;
    case "canceled":
    case "incomplete_expired":
      return "canceled" as const;
    default:
      return "active" as const;
  }
}

function mapInvoiceStatus(status: Stripe.Invoice.Status | null | undefined) {
  switch (status) {
    case "paid":
      return "paid" as const;
    case "void":
      return "void" as const;
    case "uncollectible":
      return "uncollectible" as const;
    case "open":
    case "draft":
    default:
      return "open" as const;
  }
}

export async function upsertSubscriptionFromStripe(subscription: Stripe.Subscription) {
  const prisma = getPrisma();

  const stripeSubscriptionId = subscription.id;
  const stripeCustomerId =
    typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
  const userId = subscription.metadata?.userId || null;

  const firstItem = subscription.items.data[0];
  const stripePriceId = firstItem?.price?.id ?? null;

  const itemPeriodEnds = subscription.items.data
    .map((item) => item.current_period_end)
    .filter((n): n is number => typeof n === "number" && Number.isFinite(n));

  const unixEnd =
    subscription.cancel_at ??
    (itemPeriodEnds.length ? Math.min(...itemPeriodEnds) : null) ??
    Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;

  const currentPeriodEnd = new Date(unixEnd * 1000);

  await prisma.subscription.upsert({
    where: { stripeSubscriptionId },
    update: {
      userId,
      customerId: stripeCustomerId,
      planId: stripePriceId ?? "unknown",
      status: mapSubscriptionStatus(subscription.status),
      currentPeriodEnd,
      canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      stripeCustomerId,
      stripeSubscriptionId,
      stripePriceId,
      stripeStatus: subscription.status,
    },
    create: {
      userId,
      customerId: stripeCustomerId,
      planId: stripePriceId ?? "unknown",
      status: mapSubscriptionStatus(subscription.status),
      currentPeriodEnd,
      canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      stripeCustomerId,
      stripeSubscriptionId,
      stripePriceId,
      stripeStatus: subscription.status,
    },
  });
}

export async function upsertInvoiceFromStripe(invoice: Stripe.Invoice) {
  const prisma = getPrisma();

  const stripeInvoiceId = invoice.id;
  const subscriptionFromDetails = invoice.parent?.subscription_details?.subscription ?? null;
  const stripeSubscriptionId =
    typeof subscriptionFromDetails === "string"
      ? subscriptionFromDetails
      : subscriptionFromDetails?.id ?? null;
  const stripeCustomerId =
    typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id ?? null;

  if (!stripeSubscriptionId) return;

  const subscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId },
    select: { id: true },
  });

  if (!subscription) {
    await prisma.subscription.create({
      data: {
        customerId: stripeCustomerId ?? "unknown",
        planId: "unknown",
        status: "active",
        currentPeriodEnd: new Date(),
        cancelAtPeriodEnd: false,
        stripeCustomerId: stripeCustomerId ?? null,
        stripeSubscriptionId,
        stripeStatus: "active",
      },
    });
  }

  const sub = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId },
    select: { id: true },
  });
  if (!sub) return;

  await prisma.invoice.upsert({
    where: { stripeInvoiceId },
    update: {
      subscriptionId: sub.id,
      number: invoice.number ?? `INV-${stripeInvoiceId.slice(-8)}`,
      amountDueCents: invoice.amount_due ?? 0,
      currency: (invoice.currency ?? "usd").toUpperCase(),
      status: mapInvoiceStatus(invoice.status),
      hostedInvoiceUrl: invoice.hosted_invoice_url ?? null,
      createdAt: new Date((invoice.created ?? Math.floor(Date.now() / 1000)) * 1000),
    },
    create: {
      stripeInvoiceId,
      subscriptionId: sub.id,
      number: invoice.number ?? `INV-${stripeInvoiceId.slice(-8)}`,
      amountDueCents: invoice.amount_due ?? 0,
      currency: (invoice.currency ?? "usd").toUpperCase(),
      status: mapInvoiceStatus(invoice.status),
      hostedInvoiceUrl: invoice.hosted_invoice_url ?? null,
      createdAt: new Date((invoice.created ?? Math.floor(Date.now() / 1000)) * 1000),
    },
  });
}
