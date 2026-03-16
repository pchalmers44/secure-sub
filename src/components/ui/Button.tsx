import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import { cn } from "@/utils/cn";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type CommonProps = {
  className?: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

type ButtonAsButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type ButtonAsLinkProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
    external?: boolean;
  };

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950/20 dark:focus-visible:ring-white/20 disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[linear-gradient(214deg,var(--brand-2)_12.78%,var(--brand)_93.12%)] text-white hover:brightness-95",
  secondary:
    "bg-surface-2 text-foreground hover:brightness-95",
  outline:
    "border border-border bg-transparent text-foreground hover:bg-surface-2",
  ghost:
    "bg-transparent text-foreground hover:bg-surface-2",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

function getButtonClassName({
  variant,
  size,
  className,
}: Pick<CommonProps, "variant" | "size" | "className">) {
  return cn(base, variants[variant ?? "primary"], sizes[size ?? "md"], className);
}

function isLinkProps(props: ButtonProps): props is ButtonAsLinkProps {
  return typeof (props as ButtonAsLinkProps).href === "string";
}

export function Button(props: ButtonProps) {
  if (isLinkProps(props)) {
    const {
      href,
      external,
      className,
      variant,
      size,
      children,
      ...rest
    } = props;
    const computedClassName = getButtonClassName({ variant, size, className });

    if (external) {
      return (
        <a
          href={href}
          className={computedClassName}
          target="_blank"
          rel="noopener noreferrer"
          {...rest}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={computedClassName} {...rest}>
        {children}
      </Link>
    );
  }

  const { className, variant, size, children, type, ...rest } = props;
  return (
    <button
      type={type ?? "button"}
      className={getButtonClassName({ variant, size, className })}
      {...rest}
    >
      {children}
    </button>
  );
}
