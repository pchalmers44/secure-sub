import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { cn } from "@/utils/cn";

const navLinkClassName = cn(
  "text-sm font-medium text-black/70 transition-colors hover:text-black",
);

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface-2/90 backdrop-blur">
      <div className="h-1 w-full bg-[linear-gradient(214deg,var(--brand-2)_12.78%,var(--brand)_93.12%)]" />
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight text-black"
          >
            SecureSub
          </Link>

          <nav className="hidden items-center gap-6 sm:flex">
            <Link href="/dashboard" className={navLinkClassName}>
              Dashboard
            </Link>
            <Link href="/dashboard/billing" className={navLinkClassName}>
              Billing
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2" />
      </Container>
    </header>
  );
}
