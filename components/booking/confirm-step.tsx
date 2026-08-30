"use client";

import { Button, Input, Textarea } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa6";
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

// এইখানে আমরা ফরম ফিল্ড আপডেট করতে পারি এবং সেই ফিল্ডের শো করা error মুছে ফেলতে পারি।
export function ConfirmStep() {
  const router = useRouter();
  const { service, slot, date } = useBookingStore(selectSelection);
  const bookSlot = useBookingStore((s) => s.bookSlot);
  const clearSelection = useBookingStore((s) => s.clearSelection);
  const setStep = useBookingStore((s) => s.setStep);

  const [form, setForm] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  // এইটার মাধ্যমে আমরা ফরম ফিল্ড আপডেট করতে পারি এবং সেই ফিল্ডের শো করা error মুছে ফেলতে পারি।
  const updateField =
    (field: keyof FormValues) =>
      (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => {
        setForm((f) => ({ ...f, [field]: e.target.value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      };

  function validate(): boolean {
    const next: FormErrors = {};

    if (!form.customerName.trim())
      next.customerName = "Full name is required.";

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
        useBookingStore.getState().error ??
        "Something went wrong. Please try again."
      );
    }
  }

  function handleCancel() {
    clearSelection();
    router.push("/");
  }

  return (
    <div>
      <button
        type="button"
        className="mb-4 inline-flex items-center gap-1 text-sm text-indigo-500 hover:underline"
        onClick={() => setStep("slot")}
      >
        <FaArrowLeft size={12} /> Change time
      </button>
      <h2 className="mb-1 text-xl font-bold text-gray-900">
        Confirm Your Booking
      </h2>

      {/* Summary card */}
      <div className="mb-6 mt-4 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50 p-4">
        <p className="mb-2 font-bold text-indigo-800">{service?.name}</p>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-indigo-700">
          <dt>Provider</dt>
          <dd className="font-medium">{service?.providerName}</dd>
          <dt>Date</dt>
          <dd className="font-medium">{date}</dd>
          <dt>Time</dt>
          <dd className="font-medium">
            {slot?.startTime} – {slot?.endTime}
          </dd>
          <dt>Duration</dt>
          <dd className="font-medium">{service?.durationMinutes} min</dd>
          <dt>Total</dt>
          <dd className="font-bold text-indigo-900">
            ${service?.price} {service?.currency}
          </dd>
        </dl>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Full Name"
            labelPlacement="outside"
            placeholder="Jane Smith"
            value={form.customerName}
            onChange={updateField("customerName")}
            isInvalid={Boolean(errors.customerName)}
            errorMessage={errors.customerName}
            radius="lg"
            classNames={{ inputWrapper: "bg-gray-50",mainWrapper: "mb-2",label: "pb-1.5" }}
          />
          <Input
            type="email"
            label="Email"
            labelPlacement="outside"
            placeholder="jane@example.com"
            value={form.customerEmail}
            onChange={updateField("customerEmail")}
            isInvalid={Boolean(errors.customerEmail)}
            errorMessage={errors.customerEmail}
            radius="lg"
           classNames={{ inputWrapper: "bg-gray-50",mainWrapper: "m-2",label: "pb-1.5" }}
          />
        </div>

        <Input
          type="tel"
          label="Phone"
          labelPlacement="outside"
          placeholder="+1 555 000 0000"
          value={form.customerPhone}
          isInvalid={Boolean(errors.customerPhone)}
          errorMessage={errors.customerPhone}
          onChange={updateField("customerPhone")}
          radius="lg"
          classNames={{ inputWrapper: "bg-gray-50", mainWrapper: "mt-4", label: "pb-1.5" }}
        />

        <Textarea
          label="Notes (optional)"
          labelPlacement="outside"
          placeholder="Any special requests or information for your provider…"
          value={form.notes}
          onChange={updateField("notes")}
          minRows={2}
          maxRows={4}
          radius="lg"
          classNames={{ inputWrapper: "bg-gray-50" }}
        />

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="bordered"
            radius="lg"
            className="flex-1 font-semibold"
            onPress={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            radius="lg"
            className="flex-1 font-semibold"
            isLoading={submitting}
          >
            {submitting ? "Booking…" : "Confirm Booking"}
          </Button>
        </div>
      </form>
    </div>
  );
}
