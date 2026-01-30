import React from "react";

export default function Card({ title, children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
      {title ? (
        <div className="border-b border-slate-200 px-4 py-3 text-lg font-bold text-slate-900">
          {title}
        </div>
      ) : null}
      <div className="px-4 py-3">{children}</div>
    </div>
  );
}
