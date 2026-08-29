"use client";

import { LuCheck as Check } from "react-icons/lu";
import { cn } from "@/lib/utils";

// as const দেওয়া হয়েছে যাতে TypeScript এগুলোকে সাধারণ string হিসেবে না দেখে
// নির্দিষ্ট value হিসেবে ধরে।
const WIZARD_STEPS = ["service", "slot", "confirm", "done"] as const;

// typeof WIZARD_STEPS ব্যবহার করে WIZARD_STEPS-এর value থেকে type তৈরি করা হয়েছে।
// [number] ব্যবহার করে array-এর যেকোনো একটি value নেওয়া হচ্ছে।
// Record ব্যবহার করে বলা হয়েছে: প্রতিটি key WIZARD_STEPS-এর একটি value হবে
// এবং প্রতিটি value অবশ্যই string হবে।
const STEP_LABELS: Record<(typeof WIZARD_STEPS)[number], string> = {
  service: "Service",
  slot: "Time",
  confirm: "Confirm",
  done: "Done",
};

// current কোন step-এ আছে, WIZARD_STEPS array থেকে সেই step-এর index
// বের করে ci-এর মধ্যে রাখা হচ্ছে।
// as ব্যবহার করে TypeScript-কে বলা হচ্ছে current-কে WIZARD_STEPS-এর
// একটি valid value হিসেবে ধরতে।
export function StepIndicator({ current }: { current: string }) {
  const ci = WIZARD_STEPS.indexOf(
    current as (typeof WIZARD_STEPS)[number]
  );

  return (
    <nav aria-label="Booking steps" className="mb-8 flex items-center gap-1">
      {WIZARD_STEPS.map((stepName, stepIndex) => (
        <div key={stepName} className="flex items-center gap-1">

          {/* stepIndex এবং ci তুলনা করে প্রতিটি step-এর background
              এবং text color নির্ধারণ করা হচ্ছে। */}
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all",
              stepIndex < ci
                ? "bg-emerald-500 text-white"
                : stepIndex === ci
                  ? "bg-indigo-600 text-white ring-4 ring-indigo-200"
                  : "bg-gray-100 text-gray-400"
            )}
          >
            {/* আগের step হলে Check icon দেখানো হবে,
                আর current/future step হলে তার serial number দেখানো হবে। */}
            {stepIndex < ci ? <Check size={14} /> : stepIndex + 1}
          </div>

          {/* stepIndex এবং ci তুলনা করে current step-এর নামকে
              আলাদা color ও font-এ দেখানো হচ্ছে। */}
          <span
            className={cn(
              "hidden text-xs sm:block",

              // বর্তমান step হলে নামটি bold ও indigo color-এ দেখানো হবে,
              // আর বর্তমান step না হলে gray color-এ দেখানো হবে।
              stepIndex === ci
                ? "font-semibold text-indigo-600"
                : "text-gray-400"
            )}
          >
            {/* stepName অনুযায়ী সেই step-এর সুন্দর নাম দেখানো হচ্ছে। */}
            {STEP_LABELS[stepName]}
          </span>

          {stepIndex < WIZARD_STEPS.length - 1 && (
            // শেষ step-এর পরে আর connecting line দেখানো হবে না।
            <div
              className={cn(
                "mx-1 h-px w-6",

                // বর্তমান step-এর আগের step হলে line সবুজ হবে,
                // অর্থাৎ ওই step complete হয়েছে বোঝাবে।
                // আর complete না হলে line gray থাকবে।
                stepIndex < ci ? "bg-emerald-400" : "bg-gray-200"
              )}
            />
          )}
        </div>
      ))}
    </nav>
  );
}