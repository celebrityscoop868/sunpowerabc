import React from "react";
import { Menu } from "lucide-react";

export default function TopBar({ onMenu }) {
  return (
    <header className="sticky top-0 z-50 h-14 bg-slate-700 text-white shadow">
      <div className="mx-auto flex h-14 w-full max-w-[980px] items-center px-4">
        {/* left spacer (para centrar el titulo) */}
        <div className="w-10" />

        {/* centered title */}
        <div className="flex-1 text-center text-base font-semibold tracking-wide">
          Sun Power ABC
        </div>

        {/* right menu */}
        <button
          type="button"
          onClick={onMenu}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-white/10 active:bg-white/15"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </div>
    </header>
  );
}
