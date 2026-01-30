import React from "react";
import Card from "../components/Card.jsx";
import RequiredTaskRow from "../components/RequiredTaskRow.jsx";
import { requiredTasks, stepperState } from "../data/mock.js";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

function Stepper({ steps, currentIndex = 0 }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="grid grid-cols-7 gap-2">
        {steps.map((label, i) => {
          const done = i < currentIndex;     // ✅ COMPLETADO
          const current = i === currentIndex;
          const last = i === steps.length - 1;

          return (
            <div key={label} className="relative flex flex-col items-center">
              {!last && (
                <div className="absolute left-1/2 top-[14px] h-1 w-full -translate-y-1/2">
                  <div className="h-1 w-full rounded bg-slate-200" />
                  {done && (
                    <div className="absolute left-0 top-0 h-1 w-full rounded bg-emerald-500" />
                  )}
                </div>
              )}

              <div
                className={[
                  "relative z-10 grid place-items-center rounded-full border-[3px] shadow-sm",
                  "h-8 w-8 sm:h-9 sm:w-9",
                  done && "border-emerald-500 bg-emerald-500 text-white",
                  current && !done && "border-amber-400 bg-white text-amber-600",
                  !done && !current && "border-slate-300 bg-white text-slate-300",
                ].join(" ")}
              >
                {done ? (
                  <Check size={16} />
                ) : (
                  <div className="h-2.5 w-2.5 rounded-full bg-current opacity-30" />
                )}
              </div>

              <div
                className={`mt-2 text-center text-[11px] sm:text-sm font-semibold ${
                  current ? "text-slate-900" : "text-slate-500"
                }`}
              >
                {label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ContinueCta({ currentIndex }) {
  const ctas = [
    { label: "Continue to Apply", to: "/progress" },
    { label: "Continue to Employment Documents", to: "/documents" },
    { label: "Continue to I-9 Readiness", to: "/i9" },
    { label: "Continue to PPE", to: "/safety" },
    { label: "Continue to Shift Selection", to: "/shift/select" },
    { label: "Continue to Photo", to: "/photo" },
    { label: "Continue to Start Work", to: "/first-day" },
  ];

  const cta = ctas[Math.min(currentIndex, ctas.length - 1)];

  return (
    <Link
      to={cta.to}
      className="block w-full rounded-xl bg-slate-700 px-6 py-4 text-center text-lg font-extrabold text-white shadow-md hover:bg-slate-800"
    >
      {cta.label}
    </Link>
  );
}

export default function Progress() {
  const { steps, currentIndex } = stepperState;

  return (
    <div className="space-y-4">
      <div className="text-3xl font-extrabold text-slate-900">Progress</div>

      <Stepper steps={steps} currentIndex={currentIndex} />

      <ContinueCta currentIndex={currentIndex} />

      <Card title="Required Tasks" className="rounded-2xl">
        <div className="divide-y">
          {requiredTasks.map((t) => (
            <RequiredTaskRow
              key={t.id}
              title={t.title}
              desc={t.desc}
              status={t.status}
              to={t.to}
            />
          ))}
        </div>
      </Card>

      <div className="text-sm text-slate-500 px-1">
        * Check for updates before your first day.
      </div>
    </div>
  );
}
