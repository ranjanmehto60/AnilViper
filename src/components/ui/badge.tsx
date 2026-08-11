import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em] transition-colors focus:outline-none focus:ring-2 focus:ring-accent/30 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-ink text-white font-semibold",
        secondary: "border-border bg-surface-2 text-muted",
        destructive: "border-danger/25 bg-danger/10 text-danger font-medium",
        outline: "border-border-strong text-muted",
        wtApproved: "border-accent/25 bg-accent/10 text-accent font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
