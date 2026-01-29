import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import TopBar from "./TopBar.jsx";
import Sidebar from "./Sidebar.jsx";

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100">
      <TopBar onMenu={() => setMenuOpen((v) => !v)} />

      <main className="mx-auto w-full max-w-[980px] px-4 py-4">
        <div className="grid gap-4 md:grid-cols-[260px_1fr]">
          <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

          <div className="min-w-0">
            <Outlet />

            {/* Footer “pro” (lo morado) */}
            <footer className="mt-6 rounded-xl bg-white px-4 py-4 text-sm text-slate-600 shadow-sm">
              <div className="font-semibold text-slate-700">Sun Power ABC</div>

              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                <a className="hover:underline" href="#privacy">Privacy Policy</a>
                <a className="hover:underline" href="#terms">Terms of Use</a>
                <span>Equal Opportunity Employer</span>
                <span>At-Will Employment Notice</span>
              </div>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}