import React from "react";
import Card from "../components/Card.jsx";
import { contacts } from "../data/mock.js";
import { ChevronRight } from "lucide-react";

export default function Team() {
  return (
    <div className="space-y-3">
      <div className="text-xl font-bold text-slate-900">Team & Contacts</div>
      <div className="text-sm text-slate-600">
        Here are your key contacts at the site. For urgent attendance or access issues, contact your site supervisor directly.
      </div>

      <Card>
        <div className="divide-y">
          {contacts.map((c) => (
            <div key={c.title} className="py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-bold text-slate-900">{c.title}</div>
                  <div className="text-sm text-slate-600">{c.desc}</div>
                  <div className="mt-2 text-sm text-slate-700">
                    <span className="font-semibold">Contact:</span> {c.phone}
                  </div>
                  <div className="text-sm text-slate-600">{c.email}</div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400 mt-1" />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="text-xs text-slate-500 px-1">
        * In case of an emergency, call the site at (XXX) XXX-XXXX.
      </div>
    </div>
  );
}
