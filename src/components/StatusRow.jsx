import React from "react";
import { CheckCircle2, Clock3, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function StatusRow({ title, status, to }) {
  const isCompleted = status === "completed";
  const isPending = status === "pending";
  const isNew = status === "pending_new";
  const Icon = isCompleted ? CheckCircle2 : Clock3;

  const content = (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0">
      <div className="flex items-center gap-3">
        <Icon className={isCompleted ? "h-5 w-5 text-emerald-600" : "h-5 w-5 text-amber-500"} />
        <div>
          <div className="font-semibold text-slate-900">{title}</div>
          <div className={isCompleted ? "text-emerald-700 text-sm" : "text-amber-700 text-sm"}>
            {isCompleted ? "Completed" : isNew ? "Pending (new)" : isPending ? "Pending" : "Pending"}
          </div>
        </div>
      </div>

      <ChevronRight className="h-5 w-5 text-slate-400" />
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block hover:bg-slate-50 rounded-md">
        {content}
      </Link>
    );
  }

  return content;
}
