import React from "react";
import { Outlet } from "react-router-dom";
import TopBar from "./TopBar.jsx";
import Sidebar from "./Sidebar.jsx";

export default function Layout() {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-slate-100">
      <TopBar onMenu={() => setMenuOpen((v) => !v)} />

      <div className="mx-auto w-full max-w-[980px] px-4 pb-10">
        <div className="mt-4 grid gap-4 md:grid-cols-[220px_1fr]">
          <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

          <main className="min-w-0">
            <Outlet />

            {/* 3) Footer “Sun Power” full width */}
            <footer className="mt-8 rounded-xl bg-white px-5 py-5 text-sm text-slate-500 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="font-medium text-slate-600">Sun Power ABC</div>

                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  <a className="hover:text-slate-700" href="#privacy">Privacy Policy</a>
                  <a className="hover:text-slate-700" href="#terms">Terms of Use</a>
                  <a className="hover:text-slate-700" href="#eeo">Equal Opportunity Employer</a>
                  <a className="hover:text-slate-700" href="#atwill">At-Will Employment Notice</a>
                </div>
              </div>

              <div className="mt-3 border-t pt-3 text-xs text-slate-400">
                © {new Date().getFullYear()} Sun Power ABC. All rights reserved.
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}
