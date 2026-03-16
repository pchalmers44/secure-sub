export type SubscriptionStatus = "active" | "trialing" | "past_due" | "canceled";

export type AccountSummary = {
  workspaceName: string;
  ownerEmail: string;
  members: number;
};

export type SubscriptionSummary = {
  status: SubscriptionStatus;
  planName: string;
  renewalDateISO: string;
  mrrCents: number;
  currency: "USD";
};

export type InvoiceSummary = {
  lastInvoiceDateISO: string;
  lastInvoiceAmountCents: number;
  outstandingBalanceCents: number;
  currency: "USD";
};

export type DashboardOverview = {
  greetingName: string;
  account: AccountSummary;
  subscription: SubscriptionSummary;
  invoices: InvoiceSummary;
};

