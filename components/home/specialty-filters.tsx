import { Chip } from "@heroui/react";

export const specialties = [
  "All Specialties",
  "Cardiologist",
  "Dermatologist",
  "Neurologist",
  "Pediatrician",
  "Orthopedic Surgeon",
  "Gynecologist",
  "ENT Specialist",
  "Psychiatrist",
  "Urologist",
  "Gastroenterologist",
  "Oncologist",
  "General Physician",
];

type SpecialtyFiltersProps = {
  selected: string;
  count: number;
  onChange: (specialty: string) => void;
};

export function SpecialtyFilters({
  selected,
  count,
  onChange,
}: SpecialtyFiltersProps) {
  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Browse by Specialty</h2>
        <span className="text-sm text-slate-500">{count} doctors</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {specialties.map((specialty) => (
          <Chip
            key={specialty}
            onClick={() => onChange(specialty)}
            color={selected === specialty ? "primary" : "default"}
            variant={selected === specialty ? "solid" : "bordered"}
            className="cursor-pointer"
          >
            {specialty}
          </Chip>
        ))}
      </div>
    </section>
  );
}
