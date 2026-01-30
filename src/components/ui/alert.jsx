import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const alertVariants = cva(
  "relative w-full rounded-xl border px-4 py-3 text-sm",
  {
    variants: {
      variant: {
        default: "bg-white border-slate-200 text-slate-800",
        destructive: "bg-red-50 border-red-200 text-red-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef(function Alert(
  { className, variant, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
});
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef(function AlertTitle(
  { className, ...props },
  ref
) {
  return (
    <h5
      ref={ref}
      className={cn("mb-1 font-bold leading-none tracking-tight", className)}
      {...props}
    />
  );
});
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef(function AlertDescription(
  { className, ...props },
  ref
) {
  return (
    <div ref={ref} className={cn("text-sm text-slate-600 [&_p]:leading-relaxed", className)} {...props} />
  );
});
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
