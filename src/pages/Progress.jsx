import React from "react";
import Card from "../components/Card.jsx";
import RequiredTaskRow from "../components/RequiredTaskRow.jsx";
import { requiredTasks, stepperState } from "../data/mock.js";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

/**
 * Stepper REAL
 * El check se basa en requiredTasks, NO en números mágicos
 */
function Stepper({ steps, currentIndex, completedSteps }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="grid grid-cols-7 gap-2">
        {steps.map((label, i) => {
          const done = completedSteps.includes(label);
          const current = i === currentIndex;
          const last = i === steps.length - 1;

          return (
            <div key={label} className="relative flex flex-col items-center">
              {/* Connector */}
              {!last && (
                <div className="absolute left-1/2 top-[14px] h-1 w-full -translate-y-1/2">
                  <div className="h-1 w-full rounded bg-slate-200" />
                  <div
                    className={`absolute left-0 top-0 h-1 rounded ${
                      done
                        ? "w-full bg-emerald-500"
                        : current
                        ? "w-1/2 bg-amber-400"
                        : "w-0"
                    }`}
                  />
                </div>
              )}

              {/* Circle */}
              <div
                className={[
                  "relative z-10 grid place-items-center rounded-full border-[3px] shadow-sm",
                  "h-8 w-8 sm:h-9 sm:w-9",
                  done && "border-emerald-500 bg-emerald-500 text-white",
                  current && !done && "border-amber-400 text-amber-600",
                  !done && !current && "border-slate-300 text-slate-300 bg-white",
                ].join(" ")}
              >
                {done ? <Check size={16} /> : <div className="h-2.5 w-2.5 rounded-full bg-current opacity-30" />}
              </div>

              {/* Label */}
              <div
                className={`mt-2 w-full text-center font-semibold text-[11px] sm:text-sm ${
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
      className="inline-flex rounded-xl bg-slate-700 px-4 py-3 text-base font-extrabold text-white shadow hover:bg-slate-800"
    >
      {cta.label}
    </Link>
  );
}

export default function Progress() {
  const { steps, currentIndex } = stepperState;

  /**
   * 🔥 AQUÍ ESTÁ LA CLAVE
   * Sacamos los pasos COMPLETADOS desde Required Tasks
   */
  const completedSteps = requiredTasks
    .filter((t) => t.status === "completed")
    .map((t) => {
      if (t.title === "Apply") return "Apply";
      if (t.title === "Employment Documents") return "Docs";
      if (t.title === "I-9 Readiness") return "I-9";
      if (t.title === "Safety Footwear") return "PPE";
      if (t.title === "Shift Selection") return "Shift";
      if (t.title === "Photo for Badge") return "Photo";
      if (t.title === "Start Work") return "Start";
      return null;
    })
    .filter(Boolean);

  return (
    <div className="space-y-4">
      <div className="text-3xl font-extrabold text-slate-900">Progress</div>

      <Stepper
        steps={steps}
        currentIndex={currentIndex}
        completedSteps={completedSteps}
      />

      <ContinueCta currentIndex={currentIndex} />

      <Card title="Required Tasks" className="rounded-2xl">
        <div className="divide-y">
          {requiredTasks.map((t) => (
            <RequiredTaskRow key={t.id} {...t} />
          ))}
        </div>
      </Card>

      <div className="text-sm text-slate-500">
        * Check for updates before your first day.
      </div>
    </div>
  );
}
