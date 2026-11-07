"use client";

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
    <section className="mb-9">
      <div className="mb-3.5 flex items-center justify-between">
        <h3 className="text-base font-bold text-[#0b1020]">Browse by Specialty</h3>
        <span className="text-xs sm:text-sm font-semibold text-[#687089]">
          {count} {count === 1 ? "doctor" : "doctors"} available
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {specialties.map((specialty) => {
          const isActive = selected === specialty;
          return (
            <button
              key={specialty}
              type="button"
              onClick={() => onChange(specialty)}
              className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-all ${
                isActive
                  ? "bg-[#0b1020] text-white border border-[#0b1020] shadow-sm"
                  : "border border-[#e4e7f2] bg-white text-[#4d546b] hover:border-[#5b5bf0] hover:text-[#5b5bf0]"
              }`}
            >
              {specialty}
            </button>
          );
        })}
      </div>
    </section>
  );
}
