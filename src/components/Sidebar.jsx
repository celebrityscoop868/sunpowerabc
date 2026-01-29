import React from "react";
import { NavLink } from "react-router-dom";
import { BarChart3, Clock, Bell, Users, HelpCircle, LogOut } from "lucide-react";

const Item = ({ to, icon: Icon, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium
      ${isActive ? "bg-slate-200 text-slate-900" : "text-slate-700 hover:bg-slate-100"}`
    }
  >
    <Icon size={16} />
    <span>{children}</span>
  </NavLink>
);

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* overlay mobile */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity md:hidden
        ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />

      <aside
        className={`fixed left-0 top-14 z-50 h-[calc(100vh-56px)] w-72 bg-white p-3 shadow-lg transition-transform md:static md:top-0 md:h-auto md:w-auto md:rounded-xl md:shadow-sm
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="space-y-2">
          <Item to="/progress" icon={BarChart3} onClick={onClose}>
            Progress
          </Item>

          <Item to="/shift" icon={Clock} onClick={onClose}>
            Shift Selection
          </Item>

          <Item to="/notifications" icon={Bell} onClick={onClose}>
            Notifications
          </Item>

          <Item to="/team" icon={Users} onClick={onClose}>
            Team
          </Item>

          <Item to="/help" icon={HelpCircle} onClick={onClose}>
            Help
          </Item>

          <button
            className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            type="button"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
