"use client";

import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { LuCalendarCheck2 } from "react-icons/lu";

import { AppNavbar } from "@/components/layout/navbar";
import { AppointmentCard } from "@/components/appointments/appointment-card";
import { CancelModal } from "@/components/appointments/cancel-modal";
import { EmptyState } from "@/components/ui/empty-state";
import { useMounted } from "@/hooks/use-mounted";
import {
  selectAppointments,
  useBookingStore,
} from "@/store/useBookingStore";
import type { Appointment } from "@/types";

export default function AppointmentsPage() {
  const mounted = useMounted();
  const appointments = useBookingStore(selectAppointments);
  const cancelAppointment = useBookingStore((s) => s.cancelAppointment);
  const isLoading = useBookingStore((s) => s.isLoading);

  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);

  const upcoming = appointments
    .filter((a) => a.status === "upcoming")
    .sort(
      (a, b) =>
        new Date(`${a.date}T${a.startTime}`).getTime() -
        new Date(`${b.date}T${b.startTime}`).getTime()
    );
  const past = appointments.filter(
    (a) => a.status === "cancelled" || a.status === "completed"
  );

  const handleConfirmCancel = useCallback(async () => {
    if (!cancelTarget) return;
    const ok = await cancelAppointment(cancelTarget.id);
    if (ok) {
      toast.success("Appointment cancelled — slot freed.");
    } else {
      toast.error(
        useBookingStore.getState().error ?? "Could not cancel. Try again."
      );
    }
    setCancelTarget(null);
  }, [cancelTarget, cancelAppointment]);

  return (
    <div className="min-h-screen">
      <AppNavbar />

      <main className="mx-auto max-w-5xl px-4 py-8">
        <h2 className="mb-6 text-xl font-bold text-gray-900">My Bookings</h2>

        {!mounted ? null : appointments.length === 0 ? (
          <EmptyState
            icon={<LuCalendarCheck2 />}
            title="No appointments yet"
            body="Book a service to see your upcoming appointments here."
          />
        ) : (
          <div className="space-y-6">
            {upcoming.length > 0 && (
              <section>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
                  Upcoming ({upcoming.length})
                </h3>
                <div className="space-y-3">
                  {upcoming.map((a) => (
                    <AppointmentCard
                      key={a.id}
                      appointment={a}
                      onCancel={(id) =>
                        setCancelTarget(
                          appointments.find((x) => x.id === id) ?? null
                        )
                      }
                    />
                  ))}
                </div>
              </section>
            )}

            {past.length > 0 && (
              <section>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
                  History ({past.length})
                </h3>
                <div className="space-y-3">
                  {past.map((a) => (
                    <AppointmentCard
                      key={a.id}
                      appointment={a}
                      onCancel={() => {}}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      <CancelModal
        appointment={cancelTarget}
        isOpen={cancelTarget !== null}
        onOpenChange={(open) => {
          if (!open) setCancelTarget(null);
        }}
        onConfirm={handleConfirmCancel}
        isLoading={isLoading}
      />
    </div>
  );
}
