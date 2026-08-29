"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { AppNavbar } from "@/components/layout/navbar";
import { HomeHero } from "./home-hero";
import { SpecialtyFilters } from "./specialty-filters";
import { DoctorGrid } from "./doctor-grid";
import { HowItWorks } from "./how-it-works";
import { HomeFooter } from "./home-footer";
import { getDoctors } from "@/lib/api/doctors";
import { useBookingStore } from "@/store/useBookingStore";
import { useServiceStore } from "@/store/useServiceStore";
import type { Service } from "@/types";

export function HomePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectService = useBookingStore((state) => state.selectService);
  const setServices = useServiceStore((state) => state.setServices);

  const [search, setSearch] = useState("");
  const [doctors, setDoctors] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Get active query params
  const specialty = searchParams.get("specialty") || "All Specialties";

  // Sync the local search state with the URL query parameter whenever the URL changes
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  // Load doctors whenever search or specialty query parameters change
  async function loadDoctors(searchText = "", specialtyText = "All Specialties") {
    setLoading(true);

    try {
      const data = await getDoctors(searchText, specialtyText);
      setDoctors(data);
      setServices(data);
    } catch (err) {
      console.error("Failed to load doctors from backend:", err);
      setDoctors([]);
      setServices([]);
    } finally {
      setLoading(false);
    }
  }

  // Fetch doctors whenever searchParams changes
  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    const currentSpecialty = searchParams.get("specialty") || "All Specialties";
    loadDoctors(currentSearch, currentSpecialty);
  }, [searchParams]);

  function handleSpecialtyChange(newSpecialty: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (newSpecialty && newSpecialty !== "All Specialties") {
      params.set("specialty", newSpecialty);
    } else {
      params.delete("specialty");
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleSearch() {
    const params = new URLSearchParams(searchParams.toString());
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function bookDoctor(doctor: Service) {
    selectService(doctor);
    router.push("/booking");
  }

  function resetFilters() {
    setSearch("");
    router.push(pathname);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppNavbar />

      <HomeHero
        search={search}
        setSearch={setSearch}
        onSearch={handleSearch}
      />

      <main className="mx-auto max-w-6xl px-4 py-12">
        <SpecialtyFilters
          selected={specialty}
          count={doctors.length}
          onChange={handleSpecialtyChange}
        />

        <DoctorGrid
          doctors={doctors}
          loading={loading}
          onBook={bookDoctor}
          onReset={resetFilters}
        />

        <HowItWorks />
      </main>

      <HomeFooter />
    </div>
  );
}
