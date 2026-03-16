import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

export function HomePage() {
  return (
    <div className="rounded-3xl bg-surface-2 p-8 sm:p-12">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="space-y-5">
          <div className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-black/70">
            Production-ready SaaS starter
          </div>

          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-black sm:text-5xl">
            Secure subscriptions. Clear billing. Fewer support tickets.
          </h1>

          <p className="text-lg leading-8 text-black/70">
            SecureSub gives you a modern foundation for subscription-based
            products: dashboard flows, billing entry points, and reusable UI
            primitives.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/dashboard" size="lg">
              Go to Dashboard
            </Button>
            <Button href="/dashboard/billing" variant="outline" size="lg">
              View Billing
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Separation of concerns</CardTitle>
              <CardDescription>
                UI components live in `src/components`, while configuration and
                future services live in `src/lib` and `src/services`.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-black/70">
              Add business logic in service modules without leaking it into route
              components.
            </CardContent>
            <CardFooter>
              <Button
                href="https://nextjs.org/docs/app"
                external
                variant="ghost"
                size="sm"
              >
                App Router docs
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reusable primitives</CardTitle>
              <CardDescription>
                Build screens quickly with consistent layout and interactions.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-black/70">
              `Container`, `Button`, and `Card` are designed to scale across a
              multi-tenant SaaS app.
            </CardContent>
            <CardFooter>
              <Button href="/dashboard" variant="secondary" size="sm">
                Explore
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
