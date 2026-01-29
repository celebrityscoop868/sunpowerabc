import React from "react";
import { Menu } from "lucide-react";

export default function TopBar({ onMenu }) {
  return (
    <header className="sticky top-0 z-50 h-14 bg-slate-700 text-white shadow">
      <div className="mx-auto flex h-14 w-full max-w-[980px] items-center justify-between px-4">
        <div className="text-base font-semibold tracking-wide">
          Sun Power ABC
        </div>

        <button
          type="button"
          onClick={onMenu}
          className="inline-flex items-center justify-center rounded-md p-2 hover:bg-white/10 active:bg-white/15"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </div>
    </header>
  );
}