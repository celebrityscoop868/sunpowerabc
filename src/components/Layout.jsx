import React from "react";
import { Outlet } from "react-router-dom";
import TopBar from "./TopBar.jsx";
import Sidebar from "./Sidebar.jsx";

export default function Layout() {
  return (
    <div className="min-h-screen">
      <TopBar />

      <div className="mx-auto w-full max-w-[420px] px-3 pb-10">
        <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 shadow-sm">
          <div className="grid grid-cols-[140px_1fr] gap-3 p-3">
            <Sidebar />
            <div className="min-w-0">
              <Outlet />
              <div className="mt-6 text-center text-xs text-slate-400">
                Privacy Policy · Terms of Use · Equal Opportunity Employer · At Will Employment Notice
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
