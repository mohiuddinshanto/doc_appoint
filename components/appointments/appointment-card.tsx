"use client";

import { LuCalendar, LuClock, LuBan } from "react-icons/lu";
import type { Appointment } from "@/types";

interface AppointmentCardProps {
  appointment: Appointment;
  onCancel: (id: string) => void;
}

export function AppointmentCard({ appointment, onCancel }: AppointmentCardProps) {
  const isUpcoming = appointment.status === "upcoming";
  const isCancelled = appointment.status === "cancelled";

  return (
    <div className="rounded-[28px] border border-[#e4e7f2]/60 bg-white p-6 sm:p-7 shadow-[0_1px_2px_rgba(11,16,32,0.04),0_8px_24px_-8px_rgba(40,40,120,0.10)] mb-4">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg font-bold text-[#0b1020]">
            {appointment.serviceName}
          </h3>
          <p className="text-xs sm:text-sm text-[#687089] mt-0.5 font-medium">
            {appointment.providerName}
          </p>
        </div>
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-bold capitalize ${
            isUpcoming
              ? "bg-[#e7f9ef] text-[#15803d]"
              : isCancelled
              ? "bg-[#f0f2f9] text-[#687089]"
              : "bg-[#eef0ff] text-[#5b5bf0]"
          }`}
        >
          {appointment.status}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-y-2 gap-x-5 rounded-[18px] bg-[#f7f8fc] px-4 py-3.5 text-[13px] text-[#4d546b] mb-4">
        <span className="flex items-center gap-1.5">
          <LuCalendar className="text-[#5b5bf0]" size={15} />
          <span>{appointment.date}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <LuClock className="text-[#5b5bf0]" size={15} />
          <span>{appointment.startTime} – {appointment.endTime}</span>
        </span>
        <span className="font-extrabold text-[#5b5bf0]">
          ${appointment.totalPrice} {appointment.currency}
        </span>
      </div>

      {isUpcoming && (
        <button
          type="button"
          onClick={() => onCancel(appointment.id)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs sm:text-sm font-semibold text-rose-600 transition-all hover:bg-rose-600 hover:text-white"
        >
          <LuBan size={15} />
          <span>Cancel Appointment</span>
        </button>
      )}

      {isCancelled && appointment.cancelledAt && (
        <p className="text-xs text-[#99a0b8]">
          Cancelled on {new Date(appointment.cancelledAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}
