import React from "react";
import { ShieldOff } from "lucide-react";
import { cn } from "../../lib/utils";

export default function AccessRevoked({ reason }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center border border-slate-200 shadow-sm">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShieldOff className="w-8 h-8 text-red-600" />
        </div>

        <h1 className="text-lg font-semibold text-slate-900 mb-2">Access Revoked</h1>
        <p className="text-sm text-slate-600 mb-4">
          Your access to this application has been revoked.
        </p>

        {reason ? (
          <p className={cn("text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200")}>
            <span className="font-medium">Reason:</span> {reason}
          </p>
        ) : null}

        <p className="text-xs text-slate-400 mt-4">Contact your supervisor for assistance.</p>
      </div>
    </div>
  );
}
