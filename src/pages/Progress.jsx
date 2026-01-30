import React from "react";
import Card from "../components/Card.jsx";
import StatusRow from "../components/StatusRow.jsx";
import { progressSteps } from "../data/mock.js";
import { Check } from "lucide-react";

function Stepper({ steps, currentIndex = 1 }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      {/* Grid fijo: 7 círculos + 6 líneas (sin scroll) */}
      <div className="grid items-center gap-x-2 [grid-template-columns:auto_1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr_auto]">
        {steps.map((label, i) => {
          const done = i < currentIndex;
          const current = i === currentIndex;

          const circle = (
            <div className="flex flex-col items-center">
              <div
                className={[
                  "grid h-10 w-10 place-items-center rounded-full border-[3px] shadow-sm",
                  done && "border-green-500 bg-green-500 text-white",
                  current && "border-amber-400 bg-white text-amber-600",
                  !done && !current && "border-slate-300 bg-white text-slate-300",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {done ? (
                  <Check size={18} />
                ) : (
                  <div className="h-3 w-3 rounded-full bg-current opacity-25" />
                )}
              </div>

              <div
                className={[
                  "mt-2 max-w-[40px] text-center text-[11px] font-semibold leading-tight",
                  i === currentIndex ? "text-slate-900" : "text-slate-500",
                ].join(" ")}
              >
                {label}
              </div>
            </div>
          );

          // conector después del círculo (menos el último)
          const connector =
            i !== steps.length - 1 ? (
              <div className="h-1 w-full rounded bg-slate-200">
                <div
                  className={[
                    "h-1 rounded",
                    done ? "w-full bg-green-500" : current ? "w-1/2 bg-amber-400" : "w-0",
                  ].join(" ")}
                />
              </div>
            ) : null;

          return (
            <React.Fragment key={label}>
              {circle}
              {connector}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default function Progress() {
  return (
    <div className="space-y-4">
      <div className="text-2xl font-bold text-slate-900">Progress</div>

      <Stepper
        steps={["Apply", "Docs", "I-9", "PPE", "Shift", "Photo", "Start"]}
        currentIndex={1}
      />

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
