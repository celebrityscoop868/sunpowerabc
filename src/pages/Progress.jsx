import React from "react";
import Card from "../components/Card.jsx";
import RequiredTaskRow from "../components/RequiredTaskRow.jsx";
import { requiredTasks, stepperState } from "../data/mock.js";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

function Stepper({ steps, currentIndex = 1 }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      {/* Grid: cada columna amarra círculo + label */}
      <div className="grid grid-cols-7 gap-2">
        {steps.map((label, i) => {
          const done = i < currentIndex;
          const current = i === currentIndex;
          const last = i === steps.length - 1;

          return (
            <div key={label} className="relative flex flex-col items-center">
              {/* connector hacia la derecha (sin scroll/carrusel) */}
              {!last && (
                <div className="absolute left-1/2 top-[18px] h-1 w-full -translate-y-1/2">
                  <div className="h-1 w-full rounded bg-slate-200" />
                  <div
                    className={[
                      "absolute left-0 top-0 h-1 rounded",
                      done ? "w-full bg-emerald-500" : current ? "w-1/2 bg-amber-400" : "w-0",
                    ].join(" ")}
                  />
                </div>
              )}

              {/* circle (más chico para que quepan todos) */}
              <div
                className={[
                  "relative z-10 grid place-items-center rounded-full border-[3px] bg-white shadow-sm",
                  "h-9 w-9 sm:h-10 sm:w-10",
                  done && "border-emerald-500 bg-emerald-500 text-white",
                  current && "border-amber-400 text-amber-600",
                  !done && !current && "border-slate-300 text-slate-300",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {done ? <Check size={18} /> : <div className="h-3 w-3 rounded-full bg-current opacity-30" />}
              </div>

              {/* label (amarrado a su punto) */}
              <div
                className={[
                  "mt-2 w-full text-center font-semibold leading-tight",
                  "text-[11px] sm:text-sm",
                  current ? "text-slate-900" : "text-slate-500",
                ].join(" ")}
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
    { label: "Continue to Photo for Badge", to: "/photo" },
    { label: "Continue to Start Work", to: "/first-day" },
  ];

  const cta = ctas[Math.min(Math.max(currentIndex, 0), ctas.length - 1)];

  return (
    <Link
      to={cta.to}
      className="block w-full rounded-2xl bg-slate-600 px-6 py-5 text-center text-2xl font-extrabold text-white shadow-md hover:bg-slate-700 active:bg-slate-800"
    >
      {cta.label}
    </Link>
  );
}

export default function Progress() {
  const { steps, currentIndex } = stepperState;

  return (
    <div className="space-y-4">
      <div className="text-2xl font-bold text-slate-900">Progress</div>

      <Stepper steps={steps} currentIndex={currentIndex} />

      {/* Botón grande de continuar (captura) */}
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
