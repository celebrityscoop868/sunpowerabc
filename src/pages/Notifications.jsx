import React from "react";
import Card from "../components/Card.jsx";
import { notifications } from "../data/mock.js";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";

export default function Notifications() {
  return (
    <div className="space-y-3">
      <div className="text-xl font-bold text-slate-900">Notifications</div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <Card key={n.id} title={null}>
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <Bell className="h-5 w-5 text-amber-500" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="font-semibold text-slate-900 leading-snug">{n.title}</div>
                <div className="mt-2 text-sm text-slate-600">{n.body}</div>

                <div className="mt-3">
                  {n.link ? (
                    <Link
                      to={n.link}
                      className="inline-flex items-center justify-center rounded-md border bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                      {n.cta}
                    </Link>
                  ) : (
                    <button className="inline-flex items-center justify-center rounded-md border bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                      {n.cta}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
