import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getDashboardOverview } from "@/services/dashboardService";
import { cn, formatCurrency, formatDate } from "@/utils";

export default function DashboardPage() {
  const overview = getDashboardOverview();

  const statusLabel: Record<
    typeof overview.subscription.status,
    { label: string; className: string }
  > = {
    active: {
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
    canceled: {
      label: "Canceled",
      className:
        "border-zinc-200 bg-zinc-50/80 text-zinc-700",
    },
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-black">
            Welcome back, {overview.greetingName}
          </h1>
          <p className="text-sm text-black/70">
            Here’s what’s happening with your account and subscription.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button href="/billing" variant="outline" size="sm">
            Billing
          </Button>
          <Button href="/dashboard" variant="secondary" size="sm">
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Account summary</CardTitle>
            <CardDescription>Workspace and access overview.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-black/70">
                Workspace
              </div>
              <div className="text-sm font-medium text-black">
                {overview.account.workspaceName}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-black/70">Owner</div>
              <div className="text-sm font-medium text-black">
                {overview.account.ownerEmail}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-black/70">
                Members
              </div>
              <div className="text-sm font-medium text-black">
                {overview.account.members}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" disabled>
              Manage team
            </Button>
            <Button variant="outline" size="sm" disabled>
              Workspace settings
            </Button>
          </CardFooter>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>Subscription</CardTitle>
                <CardDescription>Plan, status, and renewal.</CardDescription>
              </div>
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
                  statusLabel[overview.subscription.status].className,
                )}
              >
                {statusLabel[overview.subscription.status].label}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-black/70">Plan</div>
              <div className="text-sm font-medium text-black">
                {overview.subscription.planName}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-black/70">MRR</div>
              <div className="text-sm font-medium text-black">
                {formatCurrency(
                  overview.subscription.mrrCents,
                  overview.subscription.currency,
                )}
                <span className="text-black/60"> / mo</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-black/70">
                Renews
              </div>
              <div className="text-sm font-medium text-black">
                {formatDate(overview.subscription.renewalDateISO)}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button href="/billing" variant="secondary" size="sm">
              Manage subscription
            </Button>
            <Button href="/billing" variant="outline" size="sm">
              Update payment
            </Button>
          </CardFooter>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>Recent charges and balance.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-black/70">
                Last invoice
              </div>
              <div className="text-sm font-medium text-black">
                {formatCurrency(
                  overview.invoices.lastInvoiceAmountCents,
                  overview.invoices.currency,
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-black/70">
                Date
              </div>
              <div className="text-sm font-medium text-black">
                {formatDate(overview.invoices.lastInvoiceDateISO)}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-black/70">
                Outstanding
              </div>
              <div className="text-sm font-medium text-black">
                {formatCurrency(
                  overview.invoices.outstandingBalanceCents,
                  overview.invoices.currency,
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" disabled>
              Download invoice
            </Button>
            <Button href="/billing" variant="outline" size="sm">
              View billing
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-black">
            Quick actions
          </h2>
          <div className="text-xs text-black/60">
            Common tasks
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Invite teammates</CardTitle>
              <CardDescription>Get your team onboarded fast.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
              Add members, set roles, and keep access secure.
            </CardContent>
            <CardFooter>
              <Button variant="secondary" size="sm" disabled>
                Invite
              </Button>
              <Button variant="outline" size="sm" disabled>
                Roles
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Set up billing</CardTitle>
              <CardDescription>Plans, invoices, and payment methods.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
              Connect your billing provider and configure plan tiers.
            </CardContent>
            <CardFooter>
              <Button href="/billing" variant="secondary" size="sm">
                Open billing
              </Button>
              <Button href="/billing" variant="outline" size="sm">
                Invoices
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Support</CardTitle>
              <CardDescription>Get help or report an issue.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
              Fast responses and clear escalation paths for your customers.
            </CardContent>
            <CardFooter>
              <Button variant="secondary" size="sm" disabled>
                Contact support
              </Button>
              <Button variant="outline" size="sm" disabled>
                Status page
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
