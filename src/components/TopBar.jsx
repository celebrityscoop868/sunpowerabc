import React from "react";
import { Menu } from "lucide-react";

export default function TopBar() {
  return (
    <div className="bg-gradient-to-b from-slate-700 to-slate-800 text-white">
      <div className="mx-auto flex h-14 w-full max-w-[420px] items-center justify-between px-4">
        <div className="text-xl font-bold tracking-wide">Employee Portal</div>
        <button className="rounded-md p-2 hover:bg-white/10">
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
