import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/utils/cn";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface text-black shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

type CardSectionProps = HTMLAttributes<HTMLDivElement>;

export function CardHeader({ className, ...props }: CardSectionProps) {
  return <div className={cn("p-6", className)} {...props} />;
}

export function CardContent({ className, ...props }: CardSectionProps) {
  return <div className={cn("px-6 pb-6", className)} {...props} />;
}

export function CardFooter({ className, ...props }: CardSectionProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border-t border-border p-6",
        className,
      )}
      {...props}
    />
  );
}

type CardTitleProps = {
  children: ReactNode;
  className?: string;
};

export function CardTitle({ className, children }: CardTitleProps) {
  return (
    <h2
      className={cn(
        "text-lg font-semibold leading-7 text-foreground",
        className,
      )}
    >
      {children}
    </h2>
  );
}

type CardDescriptionProps = {
  children: ReactNode;
  className?: string;
};

export function CardDescription({ className, children }: CardDescriptionProps) {
  return (
    <p className={cn("mt-1 text-sm text-black/70", className)}>
      {children}
    </p>
  );
}
