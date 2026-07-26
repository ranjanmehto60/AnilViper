import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[#00E676] text-black hover:bg-[#00c865] shadow-lg shadow-emerald-500/20 font-bold uppercase tracking-wider",
        secondary:
          "bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700",
        destructive:
          "bg-[#E53935] text-white hover:bg-red-700 shadow-lg shadow-red-600/20",
        outline:
          "border border-emerald-500/50 bg-transparent text-[#00E676] hover:bg-emerald-500/10 hover:border-emerald-400",
        ghost: "hover:bg-zinc-800 text-zinc-300 hover:text-white",
        link: "text-[#00E676] underline-offset-4 hover:underline p-0 h-auto",
        viperAccent:
          "bg-gradient-to-r from-[#00E676] to-[#00b359] text-black font-extrabold hover:opacity-95 shadow-xl shadow-emerald-500/30 uppercase tracking-widest",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-13 rounded-lg px-8 text-base",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
