import React from "react";

export default function Card({ title, children, footer }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      {title ? (
        <div className="border-b bg-slate-50 px-4 py-3">
          <div className="font-semibold text-slate-800">{title}</div>
        </div>
      ) : null}

      <div className="px-4 py-3">{children}</div>

      {footer ? (
        <div className="border-t bg-slate-50 px-4 py-3 text-sm text-slate-600">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
