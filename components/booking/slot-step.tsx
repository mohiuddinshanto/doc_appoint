"use client";

import { Button } from "@heroui/react";
import Link from "next/link";
import { useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { buildSlots, formatIsoDate, getNext7Days, TODAY } from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  buildSlotKey,
  selectSelection,
  useBookingStore,
} from "@/store/useBookingStore";
import { useServiceStore } from "@/store/useServiceStore";
import type { TimeSlot } from "@/types";

/** Wizard step 2 â€” pick a date and an available time slot. */
export function SlotStep() {
  const selection = useBookingStore(selectSelection);
  const selectDate = useBookingStore((s) => s.selectDate);
  const selectSlot = useBookingStore((s) => s.selectSlot);
  const isSlotBooked = useBookingStore((s) => s.isSlotBooked);

  const setSlots = useServiceStore((s) => s.setSlots);
  const date = selection.date ?? TODAY;
  const next7Days = getNext7Days();
  const serviceId = selection.service?.id;
  const slotCacheKey = serviceId ? `${serviceId}::${date}` : null;

  // Subscribe to the cache entry itself so inserting slots re-renders this UI.
  const cachedSlots = useServiceStore((s) =>
    slotCacheKey ? s.slotsByKey[slotCacheKey] : undefined
  );

  // Populate the slot cache for the current service + date.
  useEffect(() => {
    if (!serviceId || cachedSlots !== undefined) return;
    setSlots(serviceId, date, buildSlots(serviceId, date));
  }, [cachedSlots, date, serviceId, setSlots]);

  const slots: TimeSlot[] = cachedSlots ?? [];

  return (
    <div>
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1 text-sm text-indigo-500 hover:underline"
      >
        <FaArrowLeft size={12} /> Back to services
      </Link>
      <h2 className="mb-1 text-xl font-bold text-gray-900">
        Choose a Date &amp; Time
      </h2>
      <p className="mb-5 text-sm text-gray-500">
        <span className="font-medium text-gray-700">{selection.service?.name}</span>
        {" - "}
        {selection.service?.durationMinutes} min {" - "}
        <span className="font-semibold text-indigo-600">
          ${selection.service?.price}
        </span>
      </p>

      {/* Date strip */}
      <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {next7Days.map((d) => (
          <Button
            key={d}
            size="sm"
            radius="lg"
            variant={date === d ? "solid" : "bordered"}
            color={date === d ? "primary" : "default"}
            className={cn(
              "w-full whitespace-nowrap px-2 py-2.5 text-xs font-semibold",
              date !== d && "border-gray-200 bg-gray-50 text-gray-600"
            )}
            onPress={() => selectDate(d)}
          >
            {formatIsoDate(d)}
          </Button>
        ))}
      </div>

      {/* Slot grid */}
      {slots.length === 0 ? (
        <p className="py-16 text-center text-sm text-gray-400">
          No slots available â€” try a different date.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {slots.map((slot) => {
            const key = selection.service
              ? buildSlotKey(selection.service.id, date, slot.id)
              : "";
            const booked = isSlotBooked(key);
            const isSelected =
              selection.slot?.id === slot.id && selection.date === date;

            return (
              <Button
                key={slot.id}
                radius="lg"
                variant={isSelected ? "solid" : "flat"}
                color={booked ? "default" : isSelected ? "primary" : "default"}
                isDisabled={booked}
                onPress={() => selectSlot({ ...slot, date })}
                className={cn(
                  "h-auto flex-col gap-0 border py-3 text-sm font-semibold",
                  booked &&
                    "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300 line-through",
                  !booked &&
                    !isSelected &&
                    "border-gray-200 bg-white text-gray-700 data-[hover=true]:border-indigo-400 data-[hover=true]:bg-indigo-50 data-[hover=true]:text-indigo-700"
                )}
              >
                {slot.startTime}
                {booked && (
                  <span className="mt-0.5 text-[10px] font-normal no-underline">
                    Taken
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
