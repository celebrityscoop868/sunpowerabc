import React from "react";
import Card from "../components/Card.jsx";
import { NavLink } from "react-router-dom";
import { Check, CheckCircle2, Circle, Lock, ChevronRight } from "lucide-react";
import { requiredTasks, stepperState } from "../data/mock.js";

function Stepper({ steps, currentIndex = 1 }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      {/* Scroll friendly on mobile */}
      <div className="overflow-x-auto">
        <div className="min-w-[520px]">
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
                    {done ? <Check size={20} /> : <div className="h-4 w-4 rounded-full bg-current opacity-25" />}
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
      </div>
    </div>
  );
}

function TaskIcon({ status }) {
  if (status === "completed") return <CheckCircle2 size={20} className="text-emerald-600" />;
  if (status === "locked") return <Lock size={18} className="text-slate-400" />;
  return <Circle size={18} className="text-slate-300" />;
}

function RequiredTasks() {
  return (
    <Card title="Required Tasks">
      <div className="divide-y">
        {requiredTasks.map((t) => {
          const locked = t.status === "locked";
          const Wrapper = locked ? "div" : NavLink;

          return (
            <Wrapper
              key={t.id}
              to={locked ? undefined : t.link}
              className={[
                "flex items-start gap-3 py-4",
                locked ? "opacity-60" : "rounded-lg px-2 -mx-2 hover:bg-slate-50",
              ].join(" ")}
            >
              <div className="mt-1">
                <TaskIcon status={t.status} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-semibold text-slate-900">{t.title}</div>
                <div className="text-sm text-slate-500">{t.subtitle}</div>

                {t.status === "completed" && (
                  <div className="mt-2 text-sm font-medium text-emerald-600">✓ Completed</div>
                )}
                {t.status === "pending" && (
                  <div className="mt-2 text-sm text-slate-400">⏳ Pending</div>
                )}
                {t.status === "locked" && (
                  <div className="mt-2 text-sm text-slate-400">🔒 Locked</div>
                )}
              </div>

              <div className="mt-2">
                {!locked && <ChevronRight size={18} className="text-slate-300" />}
              </div>
            </Wrapper>
          );
        })}
      </div>
    </Card>
  );
}

export default function Progress() {
  return (
    <div className="space-y-4">
      <div className="text-2xl font-bold text-slate-900">Progress</div>

      {/* Stepper (captura 1) */}
      <Stepper steps={stepperState.steps} currentIndex={stepperState.currentIndex} />

      {/* Required Tasks (captura 2) */}
      <RequiredTasks />

      <div className="text-sm text-slate-500 px-1">
        * Check for updates before your first day.
      </div>
    </div>
  );
}
