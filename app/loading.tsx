"use client";

import { BsHeartPulseFill } from "react-icons/bs";



interface DocAppointLoaderProps {
  /** Primary status message shown while an appointment action is processing */
  message?: string;
  /** Secondary helper text under the main message */
  subMessage?: string;
  /** Show the "DocAppoint · Health & Wellness" brand mark above the card */
  showBrand?: boolean;
  /** Render as a full-screen overlay instead of an inline card */
  fullScreen?: boolean;
}

export default function DocAppointLoader({
  message = "Confirming your appointment...",
  subMessage = "Please wait a moment",
  showBrand = true,
  fullScreen = true,
}: DocAppointLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={
        fullScreen
          ? "min-h-screen w-full flex items-center justify-center bg-slate-50 p-4"
          : "w-full flex items-center justify-center p-4"
      }
    >
      <div className="w-full max-w-xs flex flex-col items-center">
        {showBrand && (
          <div className="mb-5 flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-600">
              <BsHeartPulseFill className="w-4 h-4 text-white" strokeWidth={2.25} />
            </span>
            <div className="text-left leading-tight">
              <p className="text-sm font-semibold text-slate-800">DocAppoint</p>
              <p className="text-[11px] text-slate-400 -mt-0.5">
                Health &amp; Wellness
              </p>
            </div>
          </div>
        )}

        <div className="w-full rounded-2xl bg-white border border-slate-100 shadow-lg shadow-slate-200/60 px-8 py-9 flex flex-col items-center text-center">
          {/* Spinner + icon */}
          <div className="relative w-16 h-16 mb-5 flex items-center justify-center">
            <span className="absolute inset-0 rounded-full border-4 border-teal-100" />
            <span className="absolute inset-0 rounded-full border-4 border-transparent border-t-teal-600 animate-spin [animation-duration:0.7s]" />
            <span className="relative flex items-center justify-center w-9 h-9 rounded-full bg-teal-50">
              <BsHeartPulseFill className="w-4.5 h-4.5 text-teal-600" strokeWidth={2.25} />
            </span>
          </div>

          {/* Text */}
          <p className="text-sm font-semibold text-slate-800 tracking-tight">
            {message}
          </p>
          <p className="mt-1 text-xs text-slate-400">{subMessage}</p>

          {/* Dots */}
          <div className="mt-4 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce [animation-delay:-0.3s] [animation-duration:1s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce [animation-delay:-0.15s] [animation-duration:1s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce [animation-duration:1s]" />
          </div>
        </div>
      </div>

      <span className="sr-only">Loading</span>
    </div>
  );
}