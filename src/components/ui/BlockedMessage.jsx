// src/components/ui/BlockedMessage.jsx
import React from "react";
import { Lock } from "lucide-react";

export default function BlockedMessage({
  message = "Available once you complete your process.",
}) {
  return (
    <div className="bg-slate-50 rounded-xl p-4 flex items-start gap-3 border border-slate-100">
      <Lock className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
      <p className="text-sm text-slate-600">{message}</p>
    </div>
  );
}
