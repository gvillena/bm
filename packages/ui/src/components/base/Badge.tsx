import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn.js";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-accent/10 text-accent border-transparent",
        subtle: "bg-foreground/5 text-foreground border-transparent",
        danger: "bg-danger/10 text-danger border-transparent"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
