import React from "react";
import Card from "../components/Card.jsx";
import StatusRow from "../components/StatusRow.jsx";
import { progressSteps } from "../data/mock.js";

export default function Progress() {
  return (
    <div className="space-y-3">
      <div className="text-xl font-bold text-slate-900">Progress</div>

      {/* Bar simple (no complicado) */}
      <div className="rounded-xl border bg-white px-4 py-3 shadow-sm">
        <div className="text-xs text-slate-500 mb-2">Application · Shift Selection · Onboarding · Start Working</div>
        <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
          <div className="h-full w-[35%] bg-amber-400" />
        </div>
      </div>

      <Card title="Progress">
        <div>
          {progressSteps.map((s) => (
            <StatusRow key={s.title} title={s.title} status={s.status} to={s.link} />
          ))}
        </div>
      </Card>

      <div className="text-xs text-slate-500 px-1">
        * Check for updates before your first day.
      </div>
    </div>
  );
}
