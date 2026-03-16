import type { DashboardOverview } from "@/types/dashboard";

export function getDashboardOverview(): DashboardOverview {
  const now = new Date();
  const renewalDate = new Date(now);
  renewalDate.setDate(now.getDate() + 18);

  const lastInvoiceDate = new Date(now);
  lastInvoiceDate.setDate(now.getDate() - 12);

  return {
    greetingName: "Pat",
    account: {
      workspaceName: "SecureSub",
      ownerEmail: "owner@securesub.dev",
      members: 3,
    },
    subscription: {
      status: "active",
      planName: "Pro",
      renewalDateISO: renewalDate.toISOString(),
      mrrCents: 4900,
      currency: "USD",
    },
    invoices: {
      lastInvoiceDateISO: lastInvoiceDate.toISOString(),
      lastInvoiceAmountCents: 4900,
      outstandingBalanceCents: 0,
      currency: "USD",
    },
  };
}

