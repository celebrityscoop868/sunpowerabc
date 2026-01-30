// src/components/common/PageHeader.jsx
import React from "react";

export default function PageHeader({ title, subtitle, icon: Icon, action }) {
  return (
    <div className="mb-6 lg:mb-8">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {Icon ? (
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl flex items-center justify-center">
              <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600" />
            </div>
          ) : null}

          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-slate-900">{title}</h1>
            {subtitle ? <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p> : null}
          </div>
        </div>

        {action ? <div className="flex-shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}
