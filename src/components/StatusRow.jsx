import React from "react";
import { CheckCircle2, Clock3, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function StatusRow({ title, status, to }) {
  const isCompleted = status === "completed";
  const isPending = status === "pending";
  const isNew = status === "pending_new";

  const Icon = isCompleted ? CheckCircle2 : Clock3;

  const statusText = isCompleted ? "Completed" : isNew ? "Pending (new)" : isPending ? "Pending" : "Pending";
  const statusClass = isCompleted ? "text-emerald-700" : "text-amber-700";
  const iconClass = isCompleted ? "text-emerald-600" : "text-amber-500";

  const content = (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-start gap-3">
        <Icon className={`mt-0.5 h-5 w-5 ${iconClass}`} />
        <div className="leading-tight">
          <div className="font-semibold text-slate-900">{title}</div>
          <div className={`text-sm ${statusClass}`}>{statusText}</div>
        </div>
      </div>

      <ChevronRight className="h-5 w-5 text-slate-300" />
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block rounded-lg px-2 -mx-2 hover:bg-slate-50">
        <div className="border-b border-slate-100 last:border-b-0">{content}</div>
      </Link>
    );
  }

  return <div className="border-b border-slate-100 last:border-b-0">{content}</div>;
}
