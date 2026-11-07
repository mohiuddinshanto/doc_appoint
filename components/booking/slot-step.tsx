"use client";

import Link from "next/link";
import { useEffect } from "react";
import { LuArrowLeft } from "react-icons/lu";
import { buildSlots, getNext7Days, TODAY } from "@/lib/data";
import {
  buildSlotKey,
  selectSelection,
  useBookingStore,
} from "@/store/useBookingStore";
import { useServiceStore } from "@/store/useServiceStore";
import type { TimeSlot } from "@/types";

/** Wizard step 2 — pick a date and an available time slot. */
export function SlotStep() {
  const selection = useBookingStore(selectSelection);
  const selectDate = useBookingStore((s) => s.selectDate);
  const selectSlot = useBookingStore((s) => s.selectSlot);
  const setStep = useBookingStore((s) => s.setStep);
  const bookedSlotKeys = useBookingStore((s) => s.bookedSlotKeys);
  const loadAvailability = useBookingStore((s) => s.loadAvailability);

  const setSlots = useServiceStore((s) => s.setSlots);
  const date = selection.date ?? TODAY;
  const next7Days = getNext7Days();
  const serviceId = selection.service?.id;
  const slotCacheKey = serviceId ? `${serviceId}::${date}` : null;

  const cachedSlots = useServiceStore((s) =>
    slotCacheKey ? s.slotsByKey[slotCacheKey] : undefined
  );

  useEffect(() => {
    if (!serviceId || cachedSlots !== undefined) return;
    setSlots(serviceId, date, buildSlots(serviceId, date));
  }, [cachedSlots, date, serviceId, setSlots]);

  useEffect(() => {
    if (!serviceId) return;

    const refreshAvailability = () => {
      void loadAvailability(serviceId, date);
    };

    refreshAvailability();
    const intervalId = window.setInterval(refreshAvailability, 10_000);

    return () => window.clearInterval(intervalId);
  }, [date, loadAvailability, serviceId]);

  const slots: TimeSlot[] = cachedSlots ?? [];

  return (
    <div>
      <div className="mb-5">
        <Link
          href="/services"
          className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#e4e7f2] bg-white px-3.5 py-1 text-xs font-semibold text-[#0b1020] hover:border-[#5b5bf0] hover:text-[#5b5bf0] transition-colors"
        >
          <LuArrowLeft size={13} />
          <span>Change Doctor</span>
        </Link>
        <h2 className="text-2xl font-extrabold text-[#0b1020] tracking-tight">
          Choose a Date &amp; Time
        </h2>
        <p className="mt-1 text-sm text-[#687089]">
          <span className="font-bold text-[#0b1020]">{selection.service?.name}</span>
          {" · "}
          {selection.service?.durationMinutes} min consultation{" · "}
          <span className="font-extrabold text-[#5b5bf0]">
            ${selection.service?.price}
          </span>
        </p>
      </div>

      {/* Date Selector (7 days) */}
      <div className="mb-6 w-full min-w-0">
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#99a0b8]">
          Select Date
        </label>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 sm:grid sm:grid-cols-7 sm:overflow-visible sm:pb-0">
          {next7Days.map((d) => {
            const dateObj = new Date(`${d}T12:00:00`);
            const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
            const dayNum = dateObj.toLocaleDateString("en-US", { day: "2-digit" });
            const isSelected = date === d;

            return (
              <button
                key={d}
                type="button"
                onClick={() => selectDate(d)}
                className={`flex flex-col items-center justify-center rounded-[18px] border py-2.5 sm:py-3 px-3 sm:px-1 min-w-[62px] sm:min-w-0 transition-all ${
                  isSelected
                    ? "border-[#0b1020] bg-[#0b1020] text-white shadow-[0_10px_22px_-8px_rgba(11,16,32,0.6)]"
                    : "border-[#e4e7f2] bg-white text-[#0b1020] hover:border-[#5b5bf0]"
                }`}
              >
                <span className={`text-xs font-semibold ${isSelected ? "opacity-75" : "text-[#99a0b8]"}`}>
                  {dayName}
                </span>
                <span className="text-lg font-extrabold">{dayNum}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Slot Grid */}
      <div className="mb-8">
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#99a0b8]">
          Available Slots
        </label>
        {slots.length === 0 ? (
          <p className="py-12 text-center text-sm text-[#99a0b8]">
            No slots available for this date.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {slots.map((slot) => {
              const key = selection.service
                ? buildSlotKey(selection.service.id, date, slot.id)
                : "";
              const booked = Boolean(bookedSlotKeys[key]);
              const isSelected =
                selection.slot?.id === slot.id && selection.date === date;

              return (
                <button
                  key={slot.id}
                  type="button"
                  disabled={booked}
                  onClick={() => selectSlot({ ...slot, date })}
                  className={`rounded-full border py-3 px-4 text-center text-[13px] font-semibold transition-all ${
                    booked
                      ? "cursor-not-allowed border-transparent bg-[#f7f8fc] text-[#cdd2e3] line-through"
                      : isSelected
                      ? "border-[#5b5bf0] bg-[#5b5bf0] text-white shadow-sm"
                      : "border-[#e4e7f2] bg-white text-[#0b1020] hover:border-[#5b5bf0] hover:text-[#5b5bf0]"
                  }`}
                >
                  {slot.startTime} – {slot.endTime}
                  {booked && <span className="ml-1 text-[11px] no-underline">(Booked)</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Step Actions */}
      <div className="flex items-center justify-between border-t border-[#f0f2f9] pt-5">
        <Link
          href="/services"
          className="rounded-full border border-[#e4e7f2] bg-white px-5 py-2.5 text-sm font-semibold text-[#0b1020] hover:border-[#5b5bf0] transition-colors"
        >
          Back
        </Link>
        <button
          type="button"
          disabled={!selection.slot}
          onClick={() => setStep("confirm")}
          className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all ${
            selection.slot
              ? "bg-[#0b1020] text-white shadow-md hover:bg-[#5b5bf0]"
              : "cursor-not-allowed bg-[#f0f2f9] text-[#99a0b8]"
          }`}
        >
          Next: Patient Info &rarr;
        </button>
      </div>
    </div>
  );
}
