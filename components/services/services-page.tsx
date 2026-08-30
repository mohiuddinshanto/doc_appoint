"use client";

import { useEffect, useState } from "react";
import { Input } from "@heroui/react";
import { LuSearch } from "react-icons/lu";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AppNavbar } from "@/components/layout/navbar";
import { HomeFooter } from "@/components/home/home-footer";
import { SpecialtyFilters } from "@/components/home/specialty-filters";
import { DoctorGrid } from "@/components/home/doctor-grid";
import { getDoctors } from "@/lib/api/doctors";
import { useBookingStore } from "@/store/useBookingStore";
import { useServiceStore } from "@/store/useServiceStore";
import type { Service } from "@/types";

/** Complete searchable catalogue, separate from the short home-page preview. */
export function ServicesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectService = useBookingStore((state) => state.selectService);
  const setServices = useServiceStore((state) => state.setServices);
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
        setServices(data);
      })
      .catch((error: unknown) => {
        console.error("Failed to load doctors from backend:", error);
        if (!active) return;
        setDoctors([]);
        setServices([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [query, setServices, specialty]);

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
    <div className="min-h-screen bg-slate-50">
      <AppNavbar />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Doctors & services</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">Find the right care for you</h1>
          <p className="mt-3 text-slate-600">Search the full catalogue, select a specialist, and book an available slot.</p>
        </div>

        <Input type="search" value={query} onValueChange={(value) => updateParams({ search: value })} placeholder="Search doctor or specialty" startContent={<LuSearch className="text-slate-400" />} className="mb-8 max-w-2xl" classNames={{ inputWrapper: "border border-slate-200 bg-white" }} />

        <SpecialtyFilters selected={specialty} count={doctors.length} onChange={(value) => updateParams({ specialty: value })} />
        <DoctorGrid
          doctors={doctors}
          loading={loading}
          onBook={(service) => {
            selectService(service);
            router.push("/booking");
          }}
          onReset={() => router.push("/services")}
        />
      </main>
      <HomeFooter />
    </div>
  );
}
