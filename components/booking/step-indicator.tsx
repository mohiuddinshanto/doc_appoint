"use client";

import { LuCheck as Check } from "react-icons/lu";

const WIZARD_STEPS = ["service", "slot", "confirm", "done"] as const;

const STEP_LABELS: Record<(typeof WIZARD_STEPS)[number], string> = {
  service: "Service",
  slot: "Time",
  confirm: "Confirm",
  done: "Done",
};

export function StepIndicator({ current }: { current: string }) {
  const ci = WIZARD_STEPS.indexOf(current as (typeof WIZARD_STEPS)[number]);

  return (
    <nav aria-label="Booking steps" className="mb-9 flex items-center justify-between">
      {WIZARD_STEPS.map((stepName, stepIndex) => {
        const isCompleted = stepIndex < ci;
        const isActive = stepIndex === ci;

        return (
          <div key={stepName} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-[13px] font-bold transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-tr from-[#5b5bf0] via-[#8b5cf6] to-[#22d3ee] text-white shadow-[0_8px_18px_-6px_rgba(91,91,240,0.7)] ring-4 ring-[#5b5bf0]/15"
                    : isCompleted
                    ? "bg-[#0b1020] text-white"
                    : "bg-[#f0f2f9] text-[#99a0b8]"
                }`}
              >
                {isCompleted ? <Check size={14} /> : stepIndex + 1}
              </div>

              <span
                className={`hidden sm:inline text-[13px] font-semibold transition-colors ${
                  isActive || isCompleted ? "text-[#0b1020] font-bold" : "text-[#99a0b8]"
                }`}
              >
                {STEP_LABELS[stepName]}
              </span>
            </div>

            {stepIndex < WIZARD_STEPS.length - 1 && (
              <div
                className={`mx-3 h-[2px] flex-1 rounded-full transition-colors ${
                  stepIndex < ci ? "bg-[#0b1020]" : "bg-[#f0f2f9]"
                }`}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
