"use client";

import type { Service } from "@/types";
import { DoctorCard } from "./doctor-card";

type DoctorGridProps = {
  doctors: Service[];
  loading: boolean;
  onBook: (doctor: Service) => void;
  onReset: () => void;
};

export function DoctorGrid({ doctors, loading, onBook, onReset }: DoctorGridProps) {
  if (loading) {
    return (
      <div className="grid gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-[340px] animate-pulse rounded-[28px] border border-[#e4e7f2] bg-white p-6 shadow-sm"
          />
        ))}
      </div>
    );
  }

  if (!doctors.length) {
    return (
      <div className="rounded-[28px] border border-[#e4e7f2] bg-white p-12 text-center shadow-sm">
        <p className="mb-4 text-[#687089] font-medium">No doctors match your criteria.</p>
        <button
          type="button"
          onClick={onReset}
          className="rounded-full bg-[#0b1020] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#5b5bf0]"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} onBook={onBook} />
      ))}
    </div>
  );
}
