import React from "react";
import { NavLink } from "react-router-dom";
import {
  BarChart3,
  Bell,
  HelpCircle,
  Users,
  Clock,
  LogOut,
} from "lucide-react";

const Item = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      [
        "flex items-center gap-2 px-3 py-2.5 border-b text-sm",
        isActive ? "bg-slate-100 font-semibold text-slate-900" : "bg-white text-slate-700 hover:bg-slate-50",
      ].join(" ")
    }
  >
    <Icon className="h-4 w-4 text-slate-600" />
    <span className="truncate">{label}</span>
  </NavLink>
);

export default function Sidebar() {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <Item to="/progress" icon={BarChart3} label="Progress" />
      <Item to="/shift" icon={Clock} label="Shift Selection" />
      <Item to="/notifications" icon={Bell} label="Notifications" />
      <Item to="/team" icon={Users} label="Team" />
      <Item to="/help" icon={HelpCircle} label="Help" />

      <button className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50">
        <LogOut className="h-4 w-4" />
        Log out
      </button>
    </div>
  );
}
