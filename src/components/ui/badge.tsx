import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#00E676] text-black font-bold uppercase tracking-wider",
        secondary:
          "border-zinc-700 bg-zinc-800 text-zinc-300",
        destructive:
          "border-transparent bg-[#E53935] text-white font-bold",
        outline: "border-emerald-500/40 text-[#00E676] bg-emerald-500/10",
        wtApproved:
          "border-emerald-400/50 bg-emerald-950/80 text-[#00E676] font-bold shadow-sm shadow-emerald-500/20",
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
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
