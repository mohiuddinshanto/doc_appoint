"use client";

import { LuCheck as Check } from "react-icons/lu";
import { cn } from "@/lib/utils";

const WIZARD_STEPS = ["service", "slot", "confirm", "done"] as const;
const STEP_LABELS: Record<(typeof WIZARD_STEPS)[number], string> = {
  service: "Service",
  slot: "Time",
  confirm: "Confirm",
  done: "Done",
};

/** Horizontal progress indicator for the booking wizard. */
export function StepIndicator({ current }: { current: string }) {
  const ci = WIZARD_STEPS.indexOf(
    current as (typeof WIZARD_STEPS)[number]
  );

  return (
    <nav aria-label="Booking steps" className="mb-8 flex items-center gap-1">
      {WIZARD_STEPS.map((s, i) => (
        <div key={s} className="flex items-center gap-1">
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all",
              i < ci
                ? "bg-emerald-500 text-white"
                : i === ci
                  ? "bg-indigo-600 text-white ring-4 ring-indigo-200"
                  : "bg-gray-100 text-gray-400"
            )}
          >
            {i < ci ? <Check size={14} /> : i + 1}
          </div>
          <span
            className={cn(
              "hidden text-xs sm:block",
              i === ci ? "font-semibold text-indigo-600" : "text-gray-400"
            )}
          >
            {STEP_LABELS[s]}
          </span>
          {i < WIZARD_STEPS.length - 1 && (
            <div
              className={cn(
                "mx-1 h-px w-6",
                i < ci ? "bg-emerald-400" : "bg-gray-200"
              )}
            />
          )}
        </div>
      ))}
    </nav>
  );
}
