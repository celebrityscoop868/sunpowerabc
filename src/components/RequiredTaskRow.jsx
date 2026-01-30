import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Circle, Lock, ChevronRight, Hourglass } from "lucide-react";

export default function RequiredTaskRow({ title, desc, status, to }) {
  const completed = status === "completed";
  const locked = status === "locked";
  const pending = !completed && !locked;

  const LeftIcon = completed ? CheckCircle2 : locked ? Lock : Circle;

  const statusLabel = completed ? "Completed" : locked ? "Locked" : "Pending";

  const statusColor = completed
    ? "text-emerald-600"
    : locked
    ? "text-slate-400"
    : "text-slate-500";

  const row = (
    <div className="flex items-start justify-between gap-3 py-4">
      <div className="flex items-start gap-3">
        <LeftIcon
          className={[
            "mt-0.5 h-6 w-6",
            completed && "text-emerald-600",
            pending && "text-slate-300",
            locked && "text-slate-300",
          ]
            .filter(Boolean)
            .join(" ")}
        />

        <div className="min-w-0">
          <div className={["font-semibold", locked ? "text-slate-300" : "text-slate-900"].join(" ")}>
            {title}
          </div>

          <div className={["mt-0.5 text-sm", locked ? "text-slate-300" : "text-slate-500"].join(" ")}>
            {desc}
          </div>

          <div className={["mt-2 flex items-center gap-2 text-sm", statusColor].join(" ")}>
            {completed ? (
              <span className="font-semibold">✓</span>
            ) : pending ? (
              <Hourglass className="h-4 w-4" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
            <span className={completed ? "font-semibold" : ""}>{statusLabel}</span>
          </div>
        </div>
      </div>

      <ChevronRight className={["mt-1 h-5 w-5", locked ? "text-slate-200" : "text-slate-300"].join(" ")} />
    </div>
  );

  if (to && !locked) {
    return (
      <Link to={to} className="block rounded-xl hover:bg-slate-50">
        {row}
      </Link>
    );
  }

  return <div className="rounded-xl">{row}</div>;
}
