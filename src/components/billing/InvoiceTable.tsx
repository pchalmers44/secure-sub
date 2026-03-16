import type { Invoice, InvoiceStatus } from "@/types/billing";
import { cn, formatCurrency, formatDate } from "@/utils";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

type InvoiceTableProps = {
  invoices: Invoice[];
};

const statusPills: Record<
  InvoiceStatus,
  { label: string; className: string }
> = {
  paid: {
    label: "Paid",
    className:
      "border-emerald-700 bg-emerald-700/90 text-white",
  },
  open: {
    label: "Open",
    className:
      "border-sky-200 bg-sky-50/80 text-sky-700",
  },
  void: {
    label: "Void",
    className:
      "border-zinc-200 bg-zinc-50/80 text-zinc-700",
  },
  uncollectible: {
    label: "Uncollectible",
    className:
      "border-amber-200 bg-amber-50/80 text-amber-700",
  },
};

export function InvoiceTable({ invoices }: InvoiceTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoices</CardTitle>
        <CardDescription>Recent invoices and receipts.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="grid grid-cols-12 bg-surface-2 px-4 py-3 text-xs font-medium text-black/70">
            <div className="col-span-5 sm:col-span-4">Invoice</div>
            <div className="col-span-3 hidden sm:block">Date</div>
            <div className="col-span-4 sm:col-span-3">Amount</div>
            <div className="col-span-3 sm:col-span-2 text-right">Actions</div>
          </div>

          <div className="divide-y divide-border bg-surface">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="grid grid-cols-12 items-center gap-2 px-4 py-3"
              >
                <div className="col-span-5 min-w-0 sm:col-span-4">
                  <div className="truncate text-sm font-medium text-black">
                    {invoice.number}
                  </div>
                  <div className="mt-0.5 text-xs text-black/60 sm:hidden">
                    {formatDate(invoice.createdAtISO)}
                  </div>
                </div>

                <div className="col-span-3 hidden text-sm text-black/70 sm:block">
                  {formatDate(invoice.createdAtISO)}
                </div>

                <div className="col-span-4 min-w-0 sm:col-span-3">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <div className="text-sm font-medium text-black">
                      {formatCurrency(invoice.amountDueCents, invoice.currency)}
                    </div>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium",
                        statusPills[invoice.status].className,
                      )}
                    >
                      {statusPills[invoice.status].label}
                    </span>
                  </div>
                </div>

                <div className="col-span-3 flex min-w-0 flex-col items-end justify-center gap-2 sm:col-span-2 sm:flex-row sm:justify-end">
                  <Button variant="ghost" size="sm" disabled>
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
