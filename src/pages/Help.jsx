import React, { useState } from "react";
import Card from "../components/Card.jsx";
import { faq } from "../data/mock.js";
import { ChevronRight } from "lucide-react";

export default function Help() {
  const [open, setOpen] = useState(0);

  return (
    <div className="space-y-3">
      <div className="text-xl font-bold text-slate-900">Help & FAQ</div>
      <div className="text-sm text-slate-600">How can we assist you today?</div>

      <Card>
        <div className="divide-y">
          {faq.map((item, idx) => {
            const isOpen = open === idx;
            return (
              <button
                key={item.q}
                onClick={() => setOpen(isOpen ? -1 : idx)}
                className="w-full py-3 text-left"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold text-slate-900">{item.q}</div>
                  <ChevronRight className={`h-5 w-5 text-slate-400 transition ${isOpen ? "rotate-90" : ""}`} />
                </div>
                {isOpen ? (
                  <div className="mt-2 text-sm text-slate-600">{item.a}</div>
                ) : null}
              </button>
            );
          })}
        </div>
      </Card>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="font-bold text-slate-900 text-lg">Contact Us</div>
        <div className="mt-2 text-sm text-slate-600">
          If you need further assistance, please contact HR:
        </div>

        <div className="mt-3 space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Phone:</span>
            <span className="text-slate-600">(555) 123-4567</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Email:</span>
            <span className="text-slate-600">hr@example.com</span>
          </div>

          <button className="mt-2 w-full rounded-md border bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100">
            Click to Send WhatsApp Message
          </button>
        </div>
      </div>
    </div>
  );
}
