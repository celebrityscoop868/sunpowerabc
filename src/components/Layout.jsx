import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import TopBar from "./TopBar.jsx";
import Sidebar from "./Sidebar.jsx";

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ Cierra el menú cuando cambias a desktop (evita que quede “abierto” escondido)
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">
      <TopBar onMenu={() => setMenuOpen((v) => !v)} />

      <main className="mx-auto w-full max-w-[980px] px-4 py-4">
        <div className="grid gap-4 md:grid-cols-[260px_1fr]">
          <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

          <div className="min-w-0">
            <Outlet />

            {/* ✅ Footer “pro” (lo morado): full width, limpio, tipo app */}
            <footer className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* header del footer */}
              <div className="px-5 py-4">
                <div className="text-base font-semibold text-slate-900">Sun Power ABC</div>
                <div className="mt-1 text-sm text-slate-500">
                  Employee Portal · Policies & Notices
                </div>
              </div>

              <div className="h-px bg-slate-200" />

              {/* links / textos */}
              <div className="px-5 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2 text-sm">
                  <a className="font-medium text-slate-700 hover:text-slate-900 hover:underline" href="#privacy">
                    Privacy Policy
                  </a>
                  <a className="font-medium text-slate-700 hover:text-slate-900 hover:underline" href="#terms">
                    Terms of Use
                  </a>

                  <span className="text-slate-500">•</span>

                  <span className="text-slate-600">Equal Opportunity Employer</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-600">At-Will Employment Notice</span>
                </div>

                <div className="mt-4 text-xs leading-relaxed text-slate-500">
                  © {new Date().getFullYear()} Sun Power ABC. This portal is provided for onboarding and internal
                  employee workflow tracking.
                </div>
              </div>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}
