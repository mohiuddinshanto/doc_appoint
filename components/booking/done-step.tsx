"use client";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { LuCheck, LuCalendarPlus, LuListChecks } from "react-icons/lu";
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
    <div className="py-8 text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
        <LuCheck className="text-3xl text-emerald-600" />
      </div>
      <h2 className="mb-2 text-2xl font-bold text-gray-900">You are booked!</h2>
      <p className="mb-6 text-sm text-gray-500">
        Confirmation sent to{" "}
        <span className="font-semibold text-gray-700">
          {latest?.customerEmail}
        </span>
        .
      </p>

      {latest && (
        <div className="mx-auto mb-6 max-w-sm rounded-2xl border border-gray-100 bg-gray-50 p-5 text-left text-sm">
          <p className="mb-2 font-bold text-gray-900">{latest.serviceName}</p>
          <p className="text-gray-600">{latest.providerName}</p>
          <p className="text-gray-600">
            {latest.date} · {latest.startTime}–{latest.endTime}
          </p>
          <p className="mt-1 font-semibold text-indigo-600">
            ${latest.totalPrice} {latest.currency}
          </p>
        </div>
      )}

      <div className="flex justify-center gap-3">
        <Button
          variant="bordered"
          radius="lg"
          startContent={<LuCalendarPlus />}
          className="font-semibold"
          onPress={handleBookAnother}
        >
          Book Another
        </Button>
        <Button
          color="primary"
          radius="lg"
          startContent={<LuListChecks />}
          className="font-semibold"
          onPress={() => router.push("/appointments")}
        >
          View My Bookings
        </Button>
      </div>
    </div>
  );
}
