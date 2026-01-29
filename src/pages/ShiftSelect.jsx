import React, { useState } from "react";
import { shiftChoices } from "../data/mock.js";

export default function ShiftSelect() {
  const [selected, setSelected] = useState("mid");

  return (
    <div className="space-y-3">
      <div className="text-xl font-bold text-slate-900">Select Your Preferred Work Schedule</div>
      <div className="text-sm text-slate-600">
        Please select your preferred work schedule below. Final assignments will be confirmed during onboarding.
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        {shiftChoices.map((s) => {
          const isOn = selected === s.id;
          return (
            <label key={s.id} className={`block border-b last:border-b-0 px-4 py-4 cursor-pointer ${isOn ? "bg-slate-50" : ""}`}>
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="shift"
                  className="mt-1"
                  checked={isOn}
                  onChange={() => setSelected(s.id)}
                />
                <div className="min-w-0">
                  <div className="font-bold text-slate-900">
                    {s.title}: <span className="font-semibold">{s.hours}</span>
                  </div>
                  <div className="text-sm text-slate-600">{s.meta}</div>
                  <ul className="mt-2 list-disc pl-5 text-sm text-slate-600 space-y-1">
                    {s.roles.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </label>
          );
        })}
      </div>

      <button className="w-full rounded-md bg-slate-700 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800">
        Confirm Selection
      </button>
    </div>
  );
}
