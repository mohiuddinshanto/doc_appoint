"use client";

import type { Appointment } from "@/types";
import { LuX } from "react-icons/lu";

interface CancelModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

/** Confirmation dialog for cancelling an upcoming appointment. */
export function CancelModal({
  appointment,
  isOpen,
  onOpenChange,
  onClose,
  onConfirm,
  isLoading = false,
}: CancelModalProps) {
  if (!isOpen) return null;

  const handleClose = () => {
    if (onClose) onClose();
    if (onOpenChange) onOpenChange(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1020]/45 backdrop-blur-md">
      <div className="relative w-full max-w-[420px] rounded-[32px] bg-white p-7 sm:p-8 shadow-[0_24px_60px_-12px_rgba(40,40,120,0.25)]">
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-[#f0f2f9] text-[#687089] hover:bg-[#0b1020] hover:text-white transition-colors"
        >
          <LuX size={16} />
        </button>

        <h3 className="text-xl font-bold text-[#0b1020] mb-2">Cancel appointment?</h3>

        {appointment && (
          <div className="my-4 rounded-[20px] bg-[#f7f8fc] p-4 text-sm">
            <p className="font-bold text-[#0b1020]">{appointment.serviceName}</p>
            <p className="text-xs text-[#5b5bf0] font-semibold">{appointment.providerName}</p>
            <p className="mt-1 text-xs text-[#687089]">
              {appointment.date} · {appointment.startTime}–{appointment.endTime}
            </p>
          </div>
        )}

        <p className="text-xs text-[#687089] leading-relaxed mb-6">
          The time slot will be released back to the schedule immediately for other patients.
        </p>

        <div className="flex gap-2.5">
          <button
            type="button"
            disabled={isLoading}
            onClick={handleClose}
            className="flex-1 rounded-full border border-[#e4e7f2] bg-white py-2.5 text-sm font-semibold text-[#0b1020] hover:border-[#5b5bf0] transition-colors"
          >
            Keep Appointment
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className="flex-1 rounded-full bg-rose-600 hover:bg-rose-700 py-2.5 text-sm font-semibold text-white shadow-sm transition-all"
          >
            {isLoading ? "Cancelling…" : "Yes, Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}
