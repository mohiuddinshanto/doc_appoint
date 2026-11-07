"use client";

import { useRouter } from "next/navigation";
import { LuCheck, LuCalendarPlus, LuListChecks, LuCalendar, LuClock } from "react-icons/lu";
import { selectAppointments, useBookingStore } from "@/store/useBookingStore";

/** Wizard step 4 — success screen after a confirmed booking. */
export function DoneStep() {
  const router = useRouter();
  const appointments = useBookingStore(selectAppointments);
  const clearSelection = useBookingStore((s) => s.clearSelection);

  const latest = [...appointments]
    .reverse()
    .find((a) => a.status === "upcoming");

  function handleBookAnother() {
    clearSelection();
    router.push("/");
  }

  return (
    <div className="py-6 text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-tr from-[#5b5bf0] via-[#8b5cf6] to-[#22d3ee] text-white shadow-[0_14px_28px_-8px_rgba(91,91,240,0.6)]">
        <LuCheck size={28} />
      </div>
      <h2 className="mb-2 text-2xl sm:text-3xl font-extrabold text-[#0b1020] tracking-tight">
        You are booked!
      </h2>
      <p className="mb-6 text-sm text-[#687089]">
        Confirmation sent to{" "}
        <span className="font-semibold text-[#0b1020]">
          {latest?.customerEmail}
        </span>
        .
      </p>

      {latest && (
        <div className="mx-auto mb-7 max-w-sm rounded-[24px] border border-[#e4e7f2] bg-[#f7f8fc] p-5 text-left text-sm shadow-sm">
          <p className="mb-1 text-base font-bold text-[#0b1020]">{latest.serviceName}</p>
          <p className="mb-3 text-xs font-semibold text-[#5b5bf0]">{latest.providerName}</p>
          <div className="space-y-1.5 text-xs text-[#687089]">
            <p className="flex items-center gap-2">
              <LuCalendar className="text-[#5b5bf0]" size={14} />
              <span>{latest.date}</span>
            </p>
            <p className="flex items-center gap-2">
              <LuClock className="text-[#5b5bf0]" size={14} />
              <span>{latest.startTime} – {latest.endTime}</span>
            </p>
          </div>
          <p className="mt-3.5 border-t border-[#e4e7f2] pt-2 text-base font-extrabold text-[#5b5bf0]">
            ${latest.totalPrice} {latest.currency}
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <button
          type="button"
          onClick={handleBookAnother}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[#e4e7f2] bg-white px-6 py-2.5 text-sm font-semibold text-[#0b1020] hover:border-[#5b5bf0] transition-colors"
        >
          <LuCalendarPlus size={16} />
          <span>Book Another</span>
        </button>
        <button
          type="button"
          onClick={() => router.push("/appointments")}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0b1020] px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#5b5bf0] transition-all"
        >
          <LuListChecks size={16} />
          <span>View My Bookings</span>
        </button>
      </div>
    </div>
  );
}
