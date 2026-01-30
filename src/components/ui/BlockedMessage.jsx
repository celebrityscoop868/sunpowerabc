import React from "react";
import { Lock } from "lucide-react";

export default function BlockedMessage({
  message = "Available once you complete your process.",
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
      <Lock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}
