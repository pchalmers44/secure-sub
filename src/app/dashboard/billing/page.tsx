import { BillingSummary } from "@/components/billing/BillingSummary";
import { InvoiceTable } from "@/components/billing/InvoiceTable";
import { SubscriptionCard } from "@/components/billing/SubscriptionCard";
import { getBillingOverview } from "@/services/billingService";

export default function DashboardBillingPage() {
  const overview = getBillingOverview();

  return (
      <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-black">
          Billing
        </h1>
        <p className="text-sm text-black/70">
          Manage your subscription, invoices, and payment details.
        </p>
      </div>

      <BillingSummary subscription={overview.subscription} />

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <SubscriptionCard
          subscription={overview.subscription}
          availablePlans={overview.availablePlans}
        />
        <InvoiceTable invoices={overview.invoices} />
      </div>
    </div>
  );
}
