import React from "react";
import { NavLink } from "react-router-dom";
import {
  BarChart3,
  ClipboardList,
  FileText,
  IdCard,
  Clock,
  Footprints,
  Flag,
  Users,
  Bell,
  HelpCircle,
  LogOut,
} from "lucide-react";

const Item = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-2 rounded-md px-2 py-2 text-sm ${
        isActive ? "bg-slate-200 text-slate-900 font-semibold" : "text-slate-700 hover:bg-slate-100"
      }`
    }
  >
    <Icon className="h-4 w-4 text-slate-600" />
    <span className="leading-tight">{label}</span>
  </NavLink>
);

export default function Sidebar() {
  return (
    <div className="space-y-1">
      <Item to="/progress" icon={BarChart3} label="Progress" />
      <Item to="/shift" icon={ClipboardList} label="Roles & Scheduling" />
      <Item to="/progress" icon={FileText} label="Documents" />
      <Item to="/progress" icon={IdCard} label="I-9" />
      <Item to="/shift" icon={Clock} label="Shift Selection" />
      <Item to="/progress" icon={Footprints} label="Safety Footwear" />
      <Item to="/progress" icon={Flag} label="First Day" />
      <Item to="/team" icon={Users} label="Team" />
      <Item to="/notifications" icon={Bell} label="Notifications" />
      <Item to="/help" icon={HelpCircle} label="Help" />

      <button className="mt-2 flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-red-600 hover:bg-red-50">
        <LogOut className="h-4 w-4" />
        Log out
      </button>
    </div>
  );
}
