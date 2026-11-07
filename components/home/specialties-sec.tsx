"use client";

import { useRouter } from "next/navigation";
import {
  LuActivity,
  LuSparkles,
  LuBrain,
  LuBaby,
  LuStethoscope,
  LuUserCheck,
  LuHeart,
  LuEar,
} from "react-icons/lu";

const SPECIALTIES = [
  {
    name: "Cardiologist",
    title: "Cardiology",
    desc: "Heart & blood pressure",
    icon: LuActivity,
  },
  {
    name: "Dermatologist",
    title: "Dermatology",
    desc: "Skin, hair & nails",
    icon: LuSparkles,
  },
  {
    name: "Neurologist",
    title: "Neurology",
    desc: "Brain & nerves",
    icon: LuBrain,
  },
  {
    name: "Pediatrician",
    title: "Pediatrics",
    desc: "Child health",
    icon: LuBaby,
  },
  {
    name: "Orthopedic Surgeon",
    title: "Orthopedics",
    desc: "Bones & joints",
    icon: LuHeart,
  },
  {
    name: "General Physician",
    title: "General care",
    desc: "Everyday health",
    icon: LuUserCheck,
  },
  {
    name: "Gynecologist",
    title: "Gynecology",
    desc: "Women's health",
    icon: LuStethoscope,
  },
  {
    name: "ENT Specialist",
    title: "ENT",
    desc: "Ear, nose & throat",
    icon: LuEar,
  },
];

export function SpecialtiesSection() {
  const router = useRouter();

  const handleSelect = (specialty: string) => {
    router.push(`/services?specialty=${encodeURIComponent(specialty)}`);
  };

  return (
    <section className="mt-24">
      <div className="mb-9 flex flex-col items-start">
        <span className="mb-2.5 inline-block rounded-full bg-[#eef0ff] px-3.5 py-1 text-xs font-bold text-[#5b5bf0]">
          Specialties
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b1020] tracking-tight">
          Browse by specialty
        </h2>
        <p className="mt-2 text-[#687089]">
          Pick an area of care and see available doctors.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SPECIALTIES.map(({ name, title, desc, icon: Icon }) => (
          <button
            key={name}
            onClick={() => handleSelect(name)}
            className="group relative flex flex-col gap-4 overflow-hidden rounded-[26px] bg-white p-6 text-left shadow-[0_1px_2px_rgba(11,16,32,0.04),0_8px_24px_-8px_rgba(40,40,120,0.10)] border border-[#e4e7f2]/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
          >
            {/* Gradient sweep background on hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#5b5bf0] via-[#8b5cf6] to-[#22d3ee] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#eef0ff] text-[#5b5bf0] transition-colors duration-300 group-hover:bg-white/20 group-hover:text-white">
              <Icon size={22} />
            </div>

            <div className="relative z-10 flex flex-col">
              <b className="text-base font-bold text-[#0b1020] transition-colors duration-300 group-hover:text-white">
                {title}
              </b>
              <small className="text-xs text-[#687089] mt-0.5 transition-colors duration-300 group-hover:text-white/80">
                {desc}
              </small>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
