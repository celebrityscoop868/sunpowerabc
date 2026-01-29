import React from "react";
import { Menu } from "lucide-react";

export default function TopBar() {
  return (
    <div className="bg-gradient-to-b from-slate-800 to-slate-700 text-white shadow">
      <div className="mx-auto flex w-full max-w-[420px] items-center justify-between px-4 py-4">
        <div className="text-xl font-semibold tracking-wide">SunPower ABC</div>
        <button className="rounded-md p-2 hover:bg-white/10" aria-label="Menu">
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
