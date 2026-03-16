import type { BillingStatus, Plan, Subscription } from "@/types/billing";
import { cn, formatCurrency, formatDate } from "@/utils";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

type SubscriptionCardProps = {
  subscription: Subscription;
  availablePlans: Plan[];
};

const statusStyles: Record<
  BillingStatus,
  { label: string; className: string }
> = {
  paid: {
    label: "Active",
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

export function SubscriptionCard({
  subscription,
  availablePlans,
}: SubscriptionCardProps) {
  const status = statusStyles[subscription.status];
  const currentPlanIndex = Math.max(
    0,
    availablePlans.findIndex((p) => p.id === subscription.plan.id),
  );
  const lowerPlan = availablePlans[currentPlanIndex - 1];
  const higherPlan = availablePlans[currentPlanIndex + 1];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Current subscription</CardTitle>
            <CardDescription>Plan details and change options.</CardDescription>
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

      <CardContent className="space-y-4">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="text-sm font-semibold text-black">
              {subscription.plan.name}
            </div>
            <div className="mt-1 text-sm text-black/70">
              Renews on {formatDate(subscription.renewsAtISO)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold tracking-tight text-black">
              {formatCurrency(
                subscription.plan.priceCents,
                subscription.plan.currency,
              )}
            </div>
            <div className="text-sm text-black/60">
              per {subscription.plan.interval}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface-2 p-4 text-sm text-black/70">
          Mock billing controls. Wire these actions to your billing provider API
          later (e.g., Stripe).
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-black/60">
            Changes take effect immediately (mock).
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" size="sm" disabled>
              Cancel subscription
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!lowerPlan}
              title={!lowerPlan ? "No lower plan available" : undefined}
            >
              Downgrade
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={!higherPlan}
              title={!higherPlan ? "No higher plan available" : undefined}
            >
              Upgrade
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
