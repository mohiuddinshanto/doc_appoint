"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { LuArrowLeft, LuCheck } from "react-icons/lu";
import {
  selectSelection,
  useBookingStore,
} from "@/store/useBookingStore";

type FormValues = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string;
};

type FormErrors = Partial<Record<"customerName" | "customerEmail" | "customerPhone", string>>;

const EMPTY_FORM: FormValues = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  notes: "",
};

export function ConfirmStep() {
  const router = useRouter();
  const { service, slot, date } = useBookingStore(selectSelection);
  const bookSlot = useBookingStore((s) => s.bookSlot);
  const clearSelection = useBookingStore((s) => s.clearSelection);
  const setStep = useBookingStore((s) => s.setStep);

  const [form, setForm] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const updateField =
    (field: keyof FormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  function validate(): boolean {
    const next: FormErrors = {};

    if (!form.customerName.trim()) {
      next.customerName = "Full name is required.";
    }

    if (!form.customerEmail.trim()) {
      next.customerEmail = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail)) {
      next.customerEmail = "Please enter a valid email address.";
    }

    if (!form.customerPhone.trim()) {
      next.customerPhone = "Phone is required.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate() || submitting) return;

    setSubmitting(true);
    const appointment = await bookSlot({ ...form });
    setSubmitting(false);

    if (appointment) {
      toast.success("Booking confirmed! See you soon.");
    } else {
      toast.error(
        useBookingStore.getState().error ?? "Something went wrong. Please try again."
      );
    }
  }

  function handleCancel() {
    clearSelection();
    router.push("/");
  }

  return (
    <div>
      <div className="mb-5">
        <button
          type="button"
          onClick={() => setStep("slot")}
          className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#e4e7f2] bg-white px-3.5 py-1 text-xs font-semibold text-[#0b1020] hover:border-[#5b5bf0] hover:text-[#5b5bf0] transition-colors"
        >
          <LuArrowLeft size={13} />
          <span>Change Slot</span>
        </button>
        <h2 className="text-2xl font-extrabold text-[#0b1020] tracking-tight">
          Confirm Your Booking
        </h2>
        <p className="mt-1 text-sm text-[#687089]">
          Provide patient contact information to finalize the appointment.
        </p>
      </div>

      {/* Summary Box */}
      <div className="mb-6 flex items-center justify-between rounded-[20px] border border-[#c7d2fe] bg-[#eef0ff] p-4 sm:p-5">
        <div>
          <p className="text-base font-bold text-[#0b1020]">{service?.name}</p>
          <p className="text-xs text-[#5b5bf0] font-semibold">{service?.category}</p>
          <p className="mt-1 text-xs sm:text-sm text-[#687089]">
            {date} · {slot?.startTime}–{slot?.endTime}
          </p>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-bold uppercase text-[#99a0b8]">Total</span>
          <p className="text-2xl font-extrabold text-[#5b5bf0]">
            ${service?.price}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#687089]">
            Full Name *
          </label>
          <input
            type="text"
            placeholder="Jane Smith"
            value={form.customerName}
            onChange={updateField("customerName")}
            className="w-full rounded-[16px] border border-[#e4e7f2] bg-[#f7f8fc] px-4 py-3 text-[15px] text-[#0b1020] outline-none transition-all focus:border-[#5b5bf0] focus:bg-white focus:ring-4 focus:ring-[#5b5bf0]/10"
          />
          {errors.customerName && (
            <p className="mt-1 text-xs font-semibold text-rose-500">{errors.customerName}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#687089]">
              Email Address *
            </label>
            <input
              type="email"
              placeholder="jane@example.com"
              value={form.customerEmail}
              onChange={updateField("customerEmail")}
              className="w-full rounded-[16px] border border-[#e4e7f2] bg-[#f7f8fc] px-4 py-3 text-[15px] text-[#0b1020] outline-none transition-all focus:border-[#5b5bf0] focus:bg-white focus:ring-4 focus:ring-[#5b5bf0]/10"
            />
            {errors.customerEmail && (
              <p className="mt-1 text-xs font-semibold text-rose-500">{errors.customerEmail}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#687089]">
              Phone Number *
            </label>
            <input
              type="tel"
              placeholder="+880 1700-000000"
              value={form.customerPhone}
              onChange={updateField("customerPhone")}
              className="w-full rounded-[16px] border border-[#e4e7f2] bg-[#f7f8fc] px-4 py-3 text-[15px] text-[#0b1020] outline-none transition-all focus:border-[#5b5bf0] focus:bg-white focus:ring-4 focus:ring-[#5b5bf0]/10"
            />
            {errors.customerPhone && (
              <p className="mt-1 text-xs font-semibold text-rose-500">{errors.customerPhone}</p>
            )}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#687089]">
            Notes or Symptoms (Optional)
          </label>
          <textarea
            rows={3}
            placeholder="Briefly describe your symptoms or reason for visit..."
            value={form.notes}
            onChange={updateField("notes")}
            className="w-full rounded-[16px] border border-[#e4e7f2] bg-[#f7f8fc] px-4 py-3 text-[15px] text-[#0b1020] outline-none transition-all focus:border-[#5b5bf0] focus:bg-white focus:ring-4 focus:ring-[#5b5bf0]/10"
          />
        </div>

        <div className="flex items-center justify-between border-t border-[#f0f2f9] pt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-full border border-[#e4e7f2] bg-white px-5 py-2.5 text-sm font-semibold text-[#0b1020] hover:border-[#5b5bf0] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-full bg-[#0b1020] px-7 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-gradient-to-r hover:from-[#5b5bf0] hover:to-[#8b5cf6] hover:shadow-lg disabled:opacity-50"
          >
            <LuCheck size={16} />
            <span>{submitting ? "Booking…" : "Confirm & Book Appointment"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
