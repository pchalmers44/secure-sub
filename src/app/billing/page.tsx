import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

export default function BillingPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing</CardTitle>
        <CardDescription>
          Entry point for plans, invoices, and payment methods.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm text-zinc-600 dark:text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
        <div>Connect this to your billing provider (Stripe, etc.).</div>
        <Button variant="secondary" size="sm" disabled>
          Manage plan
        </Button>
      </CardContent>
    </Card>
  );
}
