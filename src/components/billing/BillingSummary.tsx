import type { BillingStatus, Subscription } from "@/types/billing";
import { cn, formatCurrency, formatDate } from "@/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

type BillingSummaryProps = {
  subscription: Subscription;
};

const statusStyles: Record<
  BillingStatus,
  { label: string; className: string }
> = {
  paid: {
    label: "In good standing",
    className: "border-emerald-700 bg-emerald-700/90 text-white",
  },
  trialing: {
    label: "Trial",
    className:
      "border-sky-200 bg-sky-50/80 text-sky-700",
  },
  past_due: {
    label: "Past due",
    className:
      "border-amber-200 bg-amber-50/80 text-amber-700",
  },
  unpaid: {
    label: "Unpaid",
    className:
      "border-rose-200 bg-rose-50/80 text-rose-700",
  },
};

export function BillingSummary({ subscription }: BillingSummaryProps) {
  const status = statusStyles[subscription.status];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Billing summary</CardTitle>
            <CardDescription>Plan and billing status overview.</CardDescription>
          </div>
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
              status.className,
            )}
          >
            {status.label}
          </span>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="text-xs font-medium text-black/60">
            Current plan
          </div>
          <div className="mt-1 text-sm font-semibold text-black">
            {subscription.plan.name}
          </div>
          <div className="mt-1 text-sm text-black/70">
            {formatCurrency(subscription.plan.priceCents, subscription.plan.currency)}{" "}
            <span className="text-black/60">
              / {subscription.plan.interval}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="text-xs font-medium text-black/60">
            Next renewal
          </div>
          <div className="mt-1 text-sm font-semibold text-black">
            {formatDate(subscription.renewsAtISO)}
          </div>
          <div className="mt-1 text-sm text-black/70">
            Auto-renew enabled (mock)
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="text-xs font-medium text-black/60">
            Payment method
          </div>
          <div className="mt-1 text-sm font-semibold text-black">
            Visa •••• 4242
          </div>
          <div className="mt-1 text-sm text-black/70">
            Update in billing settings
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
