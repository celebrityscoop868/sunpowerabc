// src/components/common/LoadingSpinner.jsx
import React from "react";
import { cn } from "@/lib/utils";

export default function LoadingSpinner({ size = "md", className }) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-[3px]",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className={cn("border-orange-500 border-t-transparent rounded-full animate-spin", sizes[size])} />
    </div>
  );
}
