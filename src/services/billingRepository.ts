import type { Invoice, Subscription } from "@prisma/client";

import { getPrisma } from "@/lib/prisma";

export type CreateSubscriptionInput = {
  customerId: string;
  planId: string;
};

export async function createSubscription(
  input: CreateSubscriptionInput,
): Promise<Subscription> {
  const prisma = getPrisma();
  const existing = await prisma.subscription.findFirst({
    where: {
      customerId: input.customerId,
      status: { in: ["active", "trialing", "past_due"] },
    },
    orderBy: { createdAt: "desc" },
  });

  if (existing) return existing;

  const currentPeriodEnd = new Date();
  currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 30);

  return prisma.subscription.create({
    data: {
      customerId: input.customerId,
      planId: input.planId,
      status: "active",
      currentPeriodEnd,
    },
  });
}

export async function cancelSubscription(subscriptionId: string) {
  const prisma = getPrisma();
  return prisma.subscription.update({
    where: { id: subscriptionId },
    data: {
      status: "canceled",
      canceledAt: new Date(),
      cancelAtPeriodEnd: false,
    },
  });
}

export async function getLatestSubscriptionByCustomerId(
  customerId: string,
): Promise<Subscription | null> {
  const prisma = getPrisma();
  return prisma.subscription.findFirst({
    where: { customerId },
    orderBy: { createdAt: "desc" },
  });
}

export async function listInvoicesBySubscriptionId(
  subscriptionId: string,
): Promise<Invoice[]> {
  const prisma = getPrisma();
  return prisma.invoice.findMany({
    where: { subscriptionId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createInvoiceForSubscription(params: {
  subscriptionId: string;
  amountDueCents: number;
  currency: string;
}): Promise<Invoice> {
  const prisma = getPrisma();
  const createdAt = new Date();
  const number = `SCS-${createdAt.getFullYear()}-${String(
    createdAt.getMonth() + 1,
  ).padStart(2, "0")}${String(createdAt.getDate()).padStart(2, "0")}-${Math.floor(
    1000 + Math.random() * 9000,
  )}`;

  return prisma.invoice.create({
    data: {
      subscriptionId: params.subscriptionId,
      number,
      amountDueCents: params.amountDueCents,
      currency: params.currency,
      status: "paid",
    },
  });
}
