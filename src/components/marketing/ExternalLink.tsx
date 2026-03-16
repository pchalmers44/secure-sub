import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

type ExternalLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
};

export function ExternalLink({ href, className, children }: ExternalLinkProps) {
  return (
    <a
      href={href}
      className={cn(className)}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

