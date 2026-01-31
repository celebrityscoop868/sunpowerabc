import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const viewportBase =
  "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 " +
  "sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]";

const ToastViewport = React.forwardRef(function ToastViewport({ className, ...props }, ref) {
  return <div ref={ref} className={cn(viewportBase, className)} {...props} />;
});
ToastViewport.displayName = "ToastViewport";

// Compat: algunos sitios importan ToastProvider.
const ToastProvider = ToastViewport;
ToastProvider.displayName = "ToastProvider";

const toastBase =
  "group pointer-events-auto relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all";

const toastVariantClass = {
  default: "border bg-background text-foreground",
  destructive: "destructive border-destructive bg-destructive text-destructive-foreground",
};

const Toast = React.forwardRef(function Toast({ className, variant = "default", ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(toastBase, toastVariantClass[variant] ?? toastVariantClass.default, className)}
      {...props}
    />
  );
});
Toast.displayName = "Toast";

const ToastAction = React.forwardRef(function ToastAction({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium",
        "ring-offset-background transition-colors hover:bg-secondary",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        "group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30",
        "group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground",
        "group-[.destructive]:focus:ring-destructive",
        className
      )}
      {...props}
    />
  );
});
ToastAction.displayName = "ToastAction";

const ToastClose = React.forwardRef(function ToastClose({ className, ...props }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      toast-close=""
      className={cn(
        "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity",
        "hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2",
        "group-hover:opacity-100",
        "group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50",
        "group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
        className
      )}
      {...props}
    >
      <X className="h-4 w-4" />
      <span className="sr-only">Close</span>
    </button>
  );
});
ToastClose.displayName = "ToastClose";

const ToastTitle = React.forwardRef(function ToastTitle({ className, ...props }, ref) {
  return <div ref={ref} className={cn("text-sm font-semibold", className)} {...props} />;
});
ToastTitle.displayName = "ToastTitle";

const ToastDescription = React.forwardRef(function ToastDescription({ className, ...props }, ref) {
  return <div ref={ref} className={cn("text-sm opacity-90", className)} {...props} />;
});
ToastDescription.displayName = "ToastDescription";

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
