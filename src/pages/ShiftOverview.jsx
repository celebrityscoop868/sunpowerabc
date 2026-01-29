import React from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card.jsx";
import { AlertTriangle } from "lucide-react";

export default function ShiftOverview() {
  return (
    <div className="space-y-3">
      <div className="text-xl font-bold text-slate-900">Work Shifts & Scheduling Overview</div>

      <Card>
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
          <div className="min-w-0">
            <div className="font-bold text-slate-900">Next Step: Shift Selection</div>
            <div className="mt-1 text-sm text-slate-600">
              Select your preferred work schedule to proceed.
            </div>

            <Link
              to="/shift/select"
              className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-slate-700 px-3 py-2.5 text-sm font-bold text-white hover:bg-slate-800"
            >
              Begin Shift Selection
            </Link>
          </div>
        </div>
      </Card>

      <Card title="To Do Checklist">
        <div className="space-y-2 text-sm text-slate-700">
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full bg-amber-400 flex-shrink-0" />
            Review available work shifts
          </div>
          <div className="flex items-center gap-2 opacity-70">
            <span className="h-4 w-4 rounded-full border border-slate-300 flex-shrink-0" />
            Select your preferred schedule
          </div>
          <div className="flex items-center gap-2 opacity-70">
            <span className="h-4 w-4 rounded-full border border-slate-300 flex-shrink-0" />
            Confirm final shift assignment
          </div>

          <div className="pt-2 text-xs text-slate-500">
            * Shift assignment is confirmed during onboarding.
          </div>
        </div>
      </Card>
    </div>
  );
}
