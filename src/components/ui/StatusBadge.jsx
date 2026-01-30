// src/components/ui/StatusBadge.jsx
import React from "react";
import { cn } from "../../lib/utils.js";

const styles = {
  pending: "bg-slate-100 text-slate-700",
  completed: "bg-emerald-50 text-emerald-700",
  needs_fix: "bg-red-50 text-red-700",
  active: "bg-blue-50 text-blue-700",
  scheduled: "bg-blue-50 text-blue-700",
  cancelled: "bg-slate-100 text-slate-600",
  locked: "bg-slate-100 text-slate-500",
};

const labels = {
  pending: "Pending",
  completed: "Completed",
  needs_fix: "Needs fix",
  active: "Active",
  scheduled: "Scheduled",
  cancelled: "Cancelled",
  locked: "Locked",
};

export default function StatusBadge({ status = "pending", className }) {
  const key = String(status || "pending");
  const style = styles[key] || styles.pending;
  const label = labels[key] || key;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        style,
        className
      )}
    >
      {label}
    </span>
  );
}
