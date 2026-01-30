import React from "react";

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {Icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
          <Icon className="h-8 w-8 text-slate-400" />
        </div>
      )}

      <h3 className="mb-1 text-lg font-semibold text-slate-800">{title}</h3>

      {description && (
        <p className="max-w-sm text-sm text-slate-500">{description}</p>
      )}

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
