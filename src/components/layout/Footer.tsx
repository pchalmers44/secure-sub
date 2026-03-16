import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-2">
      <div className="h-1 w-full bg-[linear-gradient(214deg,var(--brand-2)_12.78%,var(--brand)_93.12%)]" />
      <Container className="flex flex-col gap-2 py-8 text-sm text-black sm:flex-row sm:items-center sm:justify-between">
        <div>© {new Date().getFullYear()} SecureSub</div>
        <div className="flex items-center gap-4">
          <a className="text-black/70 hover:text-black" href="#">
            Privacy
          </a>
          <a className="text-black/70 hover:text-black" href="#">
            Terms
          </a>
        </div>
      </Container>
    </footer>
  );
}
