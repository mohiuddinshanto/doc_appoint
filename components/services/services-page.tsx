"use client";

import { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AppNavbar } from "@/components/layout/navbar";
import { HomeFooter } from "@/components/home/home-footer";
import { SpecialtyFilters } from "@/components/home/specialty-filters";
import { DoctorGrid } from "@/components/home/doctor-grid";
import { getDoctors } from "@/lib/api/doctors";
import { useBookingStore } from "@/store/useBookingStore";
import type { Service } from "@/types";

/** Complete searchable catalogue, separate from the short home-page preview. */
export function ServicesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectService = useBookingStore((state) => state.selectService);
  const query = searchParams.get("search") ?? "";
  const specialty = searchParams.get("specialty") ?? "All Specialties";
  const [doctors, setDoctors] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getDoctors(query, specialty)
      .then((data) => {
        if (!active) return;
        setDoctors(data);
      })
      .catch((error: unknown) => {
        console.error("Failed to load doctors from backend:", error);
        if (!active) return;
        setDoctors([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [query, specialty]);

  function updateParams(patch: { search?: string; specialty?: string }) {
    const params = new URLSearchParams(searchParams.toString());
    const nextSearch = patch.search ?? query;
    const nextSpecialty = patch.specialty ?? specialty;
    if (nextSearch) params.set("search", nextSearch);
    else params.delete("search");
    if (nextSpecialty !== "All Specialties") params.set("specialty", nextSpecialty);
    else params.delete("specialty");
    const value = params.toString();
    router.push(value ? `${pathname}?${value}` : pathname);
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      <AppNavbar />
      <main className="mx-auto max-w-[1120px] px-6 pt-10 pb-16">
        <div className="mb-8 max-w-2xl">
          <span className="mb-2.5 inline-block rounded-full bg-[#eef0ff] px-3.5 py-1 text-xs font-bold text-[#5b5bf0]">
            Doctors &amp; services
          </span>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0b1020]">
            Find the right care for you
          </h1>
          <p className="mt-2.5 text-[#687089]">
            Search the full catalogue, filter by specialty, and book an available slot.
          </p>
        </div>

        {/* Search Input matching index.html */}
        <div className="mb-7 flex max-w-[600px] items-center gap-3 rounded-full border border-[#e4e7f2] bg-white px-5 py-3 shadow-[0_1px_2px_rgba(11,16,32,0.04)] focus-within:border-[#5b5bf0] focus-within:ring-4 focus-within:ring-[#5b5bf0]/10 transition-all">
          <LuSearch className="text-[#99a0b8]" size={18} />
          <input
            type="search"
            value={query}
            onChange={(e) => updateParams({ search: e.target.value })}
            placeholder="Search doctor or specialty..."
            className="w-full bg-transparent text-[15px] text-[#0b1020] placeholder-[#99a0b8] outline-none"
          />
        </div>

        <SpecialtyFilters
          selected={specialty}
          count={doctors.length}
          onChange={(value) => updateParams({ specialty: value })}
        />

        <DoctorGrid
          doctors={doctors}
          loading={loading}
          onBook={(service) => {
            selectService(service);
            router.push("/booking");
          }}
          onReset={() => updateParams({ search: "", specialty: "All Specialties" })}
        />
      </main>
      <HomeFooter />
    </div>
  );
}
