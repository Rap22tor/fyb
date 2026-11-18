import type { ReactNode } from "react";
import { Link } from "react-router";

interface ButtonLinkProps {
  to: string;
  children: ReactNode;
}

// A link that looks like the full-width primary Button.
export function ButtonLink({ to, children }: ButtonLinkProps) {
  return (
    <Link
      to={to}
      className="flex h-10 w-full items-center justify-center rounded-md bg-fg font-medium text-page active:scale-[0.99]"
    >
      {children}
    </Link>
  );
}
