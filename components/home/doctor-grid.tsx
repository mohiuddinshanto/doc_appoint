import { Button } from "@heroui/react";
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
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-64 animate-pulse rounded-xl bg-slate-200" />
        ))}
      </div>
    );
  }

  if (!doctors.length) {
    return (
      <div className="rounded-xl bg-white p-10 text-center shadow">
        <p className="mb-4">No doctor found.</p>
        <Button onClick={onReset}>Reset</Button>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} onBook={onBook} />
      ))}
    </div>
  );
}
