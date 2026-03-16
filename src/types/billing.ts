export type BillingStatus = "paid" | "past_due" | "unpaid" | "trialing";

export type PlanInterval = "month" | "year";

export type Plan = {
  id: string;
  name: string;
  priceCents: number;
  currency: "USD";
  interval: PlanInterval;
};

export type Subscription = {
  plan: Plan;
  status: BillingStatus;
  renewsAtISO: string;
};

export type InvoiceStatus = "paid" | "open" | "void" | "uncollectible";

export type Invoice = {
  id: string;
  number: string;
  createdAtISO: string;
  amountDueCents: number;
  currency: "USD";
  status: InvoiceStatus;
};

export type BillingOverview = {
  subscription: Subscription;
  availablePlans: Plan[];
  invoices: Invoice[];
};

