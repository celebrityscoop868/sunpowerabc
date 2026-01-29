import React from "react";
import { Menu } from "lucide-react";

export default function TopBar({ onMenu }) {
  return (
    <header className="sticky top-0 z-50 bg-slate-700 text-white shadow">
      <div className="mx-auto flex h-14 max-w-[980px] items-center px-4">
        {/* spacer para centrar título */}
        <div className="w-10" />

        <div className="flex-1 text-center text-lg font-semibold tracking-wide">
          Sun Power ABC
        </div>

        <button
          onClick={onMenu}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-white/10"
          aria-label="Toggle menu"
          type="button"
        >
          <Menu size={22} />
        </button>
      </div>
    </header>
  );
}
