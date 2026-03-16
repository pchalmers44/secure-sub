import type { BillingOverview, Invoice, Plan } from "@/types/billing";

function mockPlans(): Plan[] {
  return [
    { id: "starter", name: "Starter", priceCents: 1900, currency: "USD", interval: "month" },
    { id: "pro", name: "Pro", priceCents: 4900, currency: "USD", interval: "month" },
    { id: "business", name: "Business", priceCents: 12900, currency: "USD", interval: "month" },
  ];
}

function mockInvoices(): Invoice[] {
  const now = new Date();
  const invoices: Invoice[] = [];
  for (let index = 0; index < 6; index++) {
    const date = new Date(now);
    date.setMonth(now.getMonth() - index);
    invoices.push({
      id: `inv_${index + 1}`,
      number: `SCS-${String(1042 - index)}`,
      createdAtISO: date.toISOString(),
      amountDueCents: 4900,
      currency: "USD",
      status: index === 0 ? "paid" : "paid",
    });
  }
  return invoices;
}

export function getBillingOverview(): BillingOverview {
  const plans = mockPlans();
  const currentPlan = plans.find((p) => p.id === "pro") ?? plans[0];
  const renewsAt = new Date();
  renewsAt.setDate(renewsAt.getDate() + 18);

  return {
    subscription: {
      plan: currentPlan,
      status: "paid",
      renewsAtISO: renewsAt.toISOString(),
    },
    availablePlans: plans,
    invoices: mockInvoices(),
  };
}

