"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LuCalendarCheck2 } from "react-icons/lu";

import { AppNavbar } from "@/components/layout/navbar";
import { AppointmentCard } from "@/components/appointments/appointment-card";
import { CancelModal } from "@/components/appointments/cancel-modal";
import { EmptyState } from "@/components/ui/empty-state";
import { HomeFooter } from "@/components/home/home-footer";
import { useMounted } from "@/hooks/use-mounted";
import {
  selectAppointments,
  selectError,
  useBookingStore,
} from "@/store/useBookingStore";
import { useAuthStore } from "@/store/useAuthStore";
import type { Appointment } from "@/types";

export default function AppointmentsPage() {
  const mounted = useMounted();
  const appointments = useBookingStore(selectAppointments);
  const cancelAppointment = useBookingStore((s) => s.cancelAppointment);
  const loadAppointments = useBookingStore((s) => s.loadAppointments);
  const error = useBookingStore(selectError);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const userId = useAuthStore((s) => s.user?.id);

  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);
  const [loadedForUserId, setLoadedForUserId] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState<"upcoming" | "cancelled">("upcoming");

  useEffect(() => {
    if (!mounted || !isAuthenticated || !userId) return;

    void loadAppointments().finally(() => setLoadedForUserId(userId));
  }, [isAuthenticated, loadAppointments, mounted, userId]);

  const hasLoadedAppointments = loadedForUserId === userId;

  const upcoming = appointments
    .filter((a) => a.status === "upcoming")
    .sort(
      (a, b) =>
        new Date(`${a.date}T${a.startTime}`).getTime() -
        new Date(`${b.date}T${b.startTime}`).getTime()
    );

  const cancelled = appointments.filter(
    (a) => a.status === "cancelled" || a.status === "completed"
  );

  const handleConfirmCancel = useCallback(async () => {
    if (!cancelTarget) return;
    const ok = await cancelAppointment(cancelTarget.id);
    if (ok) {
      toast.success("Appointment cancelled — slot released.");
    } else {
      toast.error(
        useBookingStore.getState().error ?? "Could not cancel. Try again."
      );
    }
    setCancelTarget(null);
  }, [cancelTarget, cancelAppointment]);

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      <AppNavbar />

      <main className="mx-auto max-w-[780px] px-4 sm:px-6 pt-6 sm:pt-10 pb-16 w-full min-w-0 overflow-x-hidden">
        <div className="mb-6 sm:mb-7">
          <span className="mb-2 inline-block rounded-full bg-[#eef0ff] px-3.5 py-1 text-xs font-bold text-[#5b5bf0]">
            Patient Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0b1020]">
            My Appointments
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#687089]">
            Manage upcoming consultations and view appointment records.
          </p>
        </div>

        {!mounted ? null : !isAuthenticated ? (
          <EmptyState
            icon={<LuCalendarCheck2 />}
            title="Sign in to view your appointments"
            body="Your appointment history is only available to signed-in users."
          />
        ) : !hasLoadedAppointments ? (
          <EmptyState
            icon={<LuCalendarCheck2 />}
            title="Loading your appointments"
            body="Retrieving your booking history..."
          />
        ) : error ? (
          <EmptyState
            icon={<LuCalendarCheck2 />}
            title="Could not load appointments"
            body={error}
          />
        ) : (
          <div>
            {/* Pill Capsule Tabs matching index.html */}
            <div className="mb-6 inline-flex gap-1 rounded-full bg-[#f0f2f9] p-1">
              <button
                type="button"
                onClick={() => setActiveTab("upcoming")}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                  activeTab === "upcoming"
                    ? "bg-white text-[#0b1020] shadow-[0_1px_2px_rgba(11,16,32,0.04),0_8px_24px_-8px_rgba(40,40,120,0.10)]"
                    : "text-[#687089] hover:text-[#0b1020]"
                }`}
              >
                Upcoming ({upcoming.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("cancelled")}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                  activeTab === "cancelled"
                    ? "bg-white text-[#0b1020] shadow-[0_1px_2px_rgba(11,16,32,0.04),0_8px_24px_-8px_rgba(40,40,120,0.10)]"
                    : "text-[#687089] hover:text-[#0b1020]"
                }`}
              >
                Cancelled ({cancelled.length})
              </button>
            </div>

            {/* Tab content */}
            {activeTab === "upcoming" ? (
              upcoming.length === 0 ? (
                <EmptyState
                  icon={<LuCalendarCheck2 />}
                  title="No upcoming appointments"
                  body="Browse our specialists and book an appointment today."
                />
              ) : (
                <div className="space-y-4">
                  {upcoming.map((app) => (
                    <AppointmentCard
                      key={app.id}
                      appointment={app}
                      onCancel={() => setCancelTarget(app)}
                    />
                  ))}
                </div>
              )
            ) : cancelled.length === 0 ? (
              <EmptyState
                icon={<LuCalendarCheck2 />}
                title="No cancelled bookings"
                body="You don't have any cancelled or past appointments."
              />
            ) : (
              <div className="space-y-4">
                {cancelled.map((app) => (
                  <AppointmentCard
                    key={app.id}
                    appointment={app}
                    onCancel={() => {}}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <CancelModal
        isOpen={Boolean(cancelTarget)}
        appointment={cancelTarget}
        onConfirm={handleConfirmCancel}
        onClose={() => setCancelTarget(null)}
      />

      <HomeFooter />
    </div>
  );
}
