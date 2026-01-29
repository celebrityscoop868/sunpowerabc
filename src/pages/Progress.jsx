import React from "react";
import Card from "../components/Card.jsx";
import StatusRow from "../components/StatusRow.jsx";
import { progressSteps } from "../data/mock.js";
import { Check } from "lucide-react";

function Stepper({ steps, currentIndex = 1 }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      {/* Circles + lines */}
      <div className="flex items-center">
        {steps.map((label, i) => {
          const done = i < currentIndex;
          const current = i === currentIndex;

          return (
            <div key={label} className="flex flex-1 items-center">
              <div
                className={[
                  "grid h-12 w-12 place-items-center rounded-full border-4 shadow-sm",
                  done && "border-green-500 bg-green-500 text-white",
                  current && "border-amber-400 bg-white text-amber-600",
                  !done && !current && "border-slate-300 bg-white text-slate-400",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {done ? (
                  <Check size={20} />
                ) : (
                  <div className="h-4 w-4 rounded-full bg-current opacity-25" />
                )}
              </div>

              {i !== steps.length - 1 && (
                <div className="mx-3 h-1 flex-1 rounded bg-slate-200">
                  <div
                    className={[
                      "h-1 rounded",
                      done ? "w-full bg-green-500" : current ? "w-1/2 bg-amber-400" : "w-0",
                    ].join(" ")}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Labels */}
      <div className="mt-3 flex justify-between text-sm font-semibold">
        {steps.map((label, i) => (
          <div
            key={label}
            className={[
              "flex-1 text-center",
              i === currentIndex ? "text-slate-900" : "text-slate-500",
            ].join(" ")}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Progress() {
  return (
    <div className="space-y-4">
      <div className="text-2xl font-bold text-slate-900">Progress</div>

      {/* Stepper estilo captura 1 */}
      <Stepper
        steps={["Application", "Docs", "I-9", "PPE", "Shift", "Photo", "Start"]}
        currentIndex={1} // 0=Application, 1=Docs (ajústalo si quieres)
      />

      {/* Tu card actual */}
      <Card title="Progress">
        <div>
          {progressSteps.map((s) => (
            <StatusRow key={s.title} title={s.title} status={s.status} to={s.link} />
          ))}
        </div>
      </Card>

      <div className="text-sm text-slate-500 px-1">
        * Check for updates before your first day.
      </div>
    </div>
  );
}