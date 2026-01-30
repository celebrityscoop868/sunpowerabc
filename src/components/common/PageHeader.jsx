import React from "react";

export default function PageHeader({ title, subtitle, icon: Icon, action }) {
  return (
    <div className="mb-6 lg:mb-8">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 lg:h-12 lg:w-12">
              <Icon className="h-5 w-5 text-orange-600 lg:h-6 lg:w-6" />
            </div>
          )}

          <div>
            <h1 className="text-xl font-bold text-slate-900 lg:text-2xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
            )}
          </div>
        </div>

        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
}
