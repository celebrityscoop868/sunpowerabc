import React from "react";
import Card from "../components/Card.jsx";
import RequiredTaskRow from "../components/RequiredTaskRow.jsx";
import { requiredTasks, stepperState } from "../data/mock.js";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

function Stepper({ steps, currentIndex = 0, completedIndex }) {
  // ✅ Si no te llega completedIndex, lo calculo automáticamente
  // (todo lo antes del currentIndex se considera completado)
  const safeCurrent = Number.isFinite(currentIndex) ? currentIndex : 0;
  const safeCompleted = Number.isFinite(completedIndex)
    ? completedIndex
    : Math.max(safeCurrent - 1, -1);

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      {/* Grid fijo: cada columna amarra círculo + label */}
      <div className="grid grid-cols-7 gap-2">
        {steps.map((label, i) => {
          const done = i <= safeCompleted; // ✅ hasta completedIndex inclusive
          const current = i === safeCurrent;
          const last = i === steps.length - 1;

          return (
            <div key={label} className="relative flex flex-col items-center">
              {/* connector hacia la derecha (sin scroll/carrusel) */}
              {!last && (
                <div className="absolute left-1/2 top-[14px] h-1 w-full -translate-y-1/2">
                  <div className="h-1 w-full rounded bg-slate-200" />
                  <div
                    className={[
                      "absolute left-0 top-0 h-1 rounded",
                      done ? "w-full bg-emerald-500" : current ? "w-1/2 bg-amber-400" : "w-0",
                    ].join(" ")}
                  />
                </div>
              )}

              {/* circle */}
              <div
                className={[
                  "relative z-10 grid place-items-center rounded-full border-[3px] bg-white shadow-sm",
                  "h-8 w-8 sm:h-9 sm:w-9", // ✅ pequeño para que quepan todos
                  done && "border-emerald-500 bg-emerald-500 text-white",
                  current && !done && "border-amber-400 text-amber-600",
                  !done && !current && "border-slate-300 text-slate-300",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {done ? <Check size={16} /> : <div className="h-2.5 w-2.5 rounded-full bg-current opacity-30" />}
              </div>

              {/* label (amarrado al punto) */}
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
    { label: "Continue to Photo", to: "/photo" },
    { label: "Continue to Start Work", to: "/first-day" },
  ];

  const safeIndex = Math.min(Math.max(currentIndex ?? 0, 0), ctas.length - 1);
  const cta = ctas[safeIndex];

  return (
    <Link
      to={cta.to}
      className={[
        // ✅ FULL width en móvil (rompe el padding del Layout)
        "-mx-4 block w-[calc(100%+2rem)] sm:mx-0 sm:w-full",
        // ✅ tamaño razonable (NO gigante)
        "rounded-xl bg-slate-600 px-4 py-3 text-center text-base font-extrabold text-white",
        "shadow-md hover:bg-slate-700 active:bg-slate-800",
      ].join(" ")}
    >
      {cta.label}
    </Link>
  );
}

export default function Progress() {
  // ✅ Importante: saca completedIndex del state y pásalo explícito
  const { steps, currentIndex, completedIndex } = stepperState;

  return (
    <div className="space-y-4">
      <div className="text-3xl font-extrabold text-slate-900">Progress</div>

      <Stepper steps={steps} currentIndex={currentIndex} completedIndex={completedIndex} />

      <ContinueCta currentIndex={currentIndex} />

      <Card title="Required Tasks" className="rounded-2xl">
        {/* ❌ NO clickeable */}
        <div className="divide-y pointer-events-none">
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
