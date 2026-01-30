import React from "react";
import { Check, Lock, AlertCircle, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils.js";

/**
 * Normaliza status del repo actual (completed | pending | locked)
 * a status interno del card (completed | available | locked | needs_fix)
 */
function normalizeStatus(status) {
  if (status === "completed") return "completed";
  if (status === "locked") return "locked";
  if (status === "needs_fix") return "needs_fix";
  // pending => available (porque en tu UI pending es el "siguiente" clickeable si lo habilitas)
  if (status === "pending") return "available";
  return "locked";
}

const statusConfig = {
  locked: {
    icon: Lock,
    bg: "bg-slate-100",
    iconColor: "text-slate-400",
    border: "border-slate-200",
    text: "Locked",
  },
  available: {
    icon: ChevronRight,
    bg: "bg-orange-50",
    iconColor: "text-orange-500",
    border: "border-orange-200",
    text: "Pending",
  },
  completed: {
    icon: Check,
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    border: "border-emerald-200",
    text: "Completed",
  },
  needs_fix: {
    icon: AlertCircle,
    bg: "bg-red-50",
    iconColor: "text-red-600",
    border: "border-red-200",
    text: "Needs Attention",
  },
};

export default function TaskCard({ task, onClick, index = 0, clickable = true }) {
  const normalized = normalizeStatus(task?.status);
  const cfg = statusConfig?.[normalized] || statusConfig.locked;
  const Icon = cfg.icon;

  // Si quieres que NUNCA sean clickeables (como pediste en Required Tasks),
  // pasa clickable={false} desde el listado.
  const isClickable =
    clickable && (normalized === "available" || normalized === "needs_fix");

  const handleClick = () => {
    if (!isClickable) return;
    onClick?.(task);
  };

  const handleKeyDown = (e) => {
    if (!isClickable) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.(task);
    }
  };

  const title = task?.title ?? "";
  const description = task?.desc ?? task?.description ?? "";

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : -1}
      aria-disabled={!isClickable}
      className={cn(
        "flex items-center gap-4 p-4 rounded-xl border transition-all",
        cfg.border,
        isClickable
          ? "cursor-pointer hover:shadow-md active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-200"
          : "cursor-default opacity-75",
        "animate-in fade-in slide-in-from-left-2"
      )}
      style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
          cfg.bg
        )}
      >
        <Icon size={20} className={cfg.iconColor} />
      </div>

      <div className="flex-1 min-w-0">
        <h4
          className={cn(
            "font-medium text-slate-800",
            normalized === "completed" && "line-through text-slate-500"
          )}
        >
          {title}
        </h4>

        {description ? (
          <p className="text-sm text-slate-500 truncate">{description}</p>
        ) : null}

        {task?.note && normalized === "needs_fix" ? (
          <p className="text-xs text-red-700 mt-1 bg-red-50 px-2 py-1 rounded inline-block">
            {task.note}
          </p>
        ) : null}
      </div>

      <div className={cn("px-2.5 py-1 rounded-full text-xs font-medium", cfg.bg, cfg.iconColor)}>
        {cfg.text}
      </div>
    </div>
  );
}
