"use client";

import Link from "next/link";
import { LuCalendarClock } from "react-icons/lu";

import { AppNavbar } from "@/components/layout/navbar";
import { ConfirmStep } from "@/components/booking/confirm-step";
import { DoneStep } from "@/components/booking/done-step";
import { SlotStep } from "@/components/booking/slot-step";
import { StepIndicator } from "@/components/booking/step-indicator";
import {
  selectError,
  selectStep,
  useBookingStore,
} from "@/store/useBookingStore";

export default function BookingPage() {
  const step = useBookingStore(selectStep);
  const error = useBookingStore(selectError);

  return (
    <div className="min-h-screen">
      <AppNavbar />

      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Wizard not started — nothing selected yet */}
        {step === "service" && (
          <>
            <h1 className="mb-6 text-xl font-bold text-gray-900">
              Start a booking
            </h1>
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              <p className="mb-4 text-sm text-gray-500">
                Pick a service first — then choose your date and time here.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Browse Services
              </Link>
            </div>
          </>
        )}

        {step !== "service" && (
          <div className="mx-auto max-w-2xl">
            <StepIndicator current={step} />

            {error && step !== "confirm" && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {step === "slot" && <SlotStep />}
            {step === "confirm" && <ConfirmStep />}
            {step === "done" && <DoneStep />}

            {step === "slot" && !error && (
              <p className="mt-6 flex items-center gap-2 text-xs text-gray-400">
                <LuCalendarClock size={14} />
                Slots update in real time across tabs.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
