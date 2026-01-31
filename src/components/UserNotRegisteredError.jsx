import React from "react";
import { AlertTriangle } from "lucide-react";

export default function UserNotRegisteredError() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-slate-50 p-4">
      <div className="w-full max-w-md rounded-lg border border-slate-100 bg-white p-8 shadow-lg">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>

          <h1 className="mb-4 text-3xl font-bold text-slate-900">
            Access Restricted
          </h1>

          <p className="mb-8 text-slate-600">
            You are not registered to use this application. Please contact the
            application administrator to request access.
          </p>

          <div className="rounded-md bg-slate-50 p-4 text-left text-sm text-slate-600">
            <p className="font-medium">If you believe this is an error:</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Verify you are logged in with the correct account</li>
              <li>Contact the application administrator</li>
              <li>Log out and sign in again</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
