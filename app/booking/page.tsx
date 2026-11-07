"use client";

import Link from "next/link";
import { LuCalendarClock } from "react-icons/lu";

import { AppNavbar } from "@/components/layout/navbar";
import { ConfirmStep } from "@/components/booking/confirm-step";
import { DoneStep } from "@/components/booking/done-step";
import { SlotStep } from "@/components/booking/slot-step";
import { StepIndicator } from "@/components/booking/step-indicator";
import { HomeFooter } from "@/components/home/home-footer";
import {
  selectError,
  selectStep,
  useBookingStore,
} from "@/store/useBookingStore";

export default function BookingPage() {
  const step = useBookingStore(selectStep);
  const error = useBookingStore(selectError);

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      <AppNavbar />

      <main className="mx-auto max-w-[1120px] px-6 py-12">
        {/* Wizard not started — nothing selected yet */}
        {step === "service" && (
          <div className="mx-auto max-w-[680px] rounded-[32px] border border-[#e4e7f2] bg-white p-8 sm:p-10 shadow-[0_24px_60px_-12px_rgba(40,40,120,0.20)] text-center">
            <h1 className="mb-3 text-2xl font-extrabold text-[#0b1020] tracking-tight">
              Start a booking
            </h1>
            <p className="mb-6 text-sm text-[#687089]">
              Pick a specialist doctor first — then choose your date and time here.
            </p>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full bg-[#0b1020] px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-gradient-to-r hover:from-[#5b5bf0] hover:to-[#8b5cf6] transition-all"
            >
              Browse Doctors &amp; Services
            </Link>
          </div>
        )}

        {step !== "service" && (
          <div className="mx-auto max-w-[680px] rounded-[32px] border border-[#e4e7f2] bg-white p-6 sm:p-10 shadow-[0_24px_60px_-12px_rgba(40,40,120,0.20)]">
            <StepIndicator current={step} />

            {error && step !== "confirm" && (
              <div className="mb-6 rounded-[18px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                {error}
              </div>
            )}

            {step === "slot" && <SlotStep />}
            {step === "confirm" && <ConfirmStep />}
            {step === "done" && <DoneStep />}

            {step === "slot" && !error && (
              <p className="mt-7 flex items-center justify-center gap-2 text-xs font-medium text-[#99a0b8]">
                <LuCalendarClock size={15} />
                Slots update in real time across tabs.
              </p>
            )}
          </div>
        )}
      </main>

      <HomeFooter />
    </div>
  );
}
