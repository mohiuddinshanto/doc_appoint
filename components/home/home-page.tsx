"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { LuArrowRight } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { AppNavbar } from "@/components/layout/navbar";
import { HomeHero } from "./home-hero";
import { DoctorGrid } from "./doctor-grid";
import { HowItWorks } from "./how-it-works";
import { HomeFooter } from "./home-footer";
import { getDoctors } from "@/lib/api/doctors";
import { useBookingStore } from "@/store/useBookingStore";
import type { Service } from "@/types";
import Testimonials from "./testimonials";
import WhyChooseUs from "./whychooseus";
import Band from "./band";

/** A focused landing page; the full searchable catalogue lives at /services. */
export function HomePage() {
  const router = useRouter();
  const selectService = useBookingStore((state) => state.selectService);
  const [search, setSearch] = useState("");
  const [doctors, setDoctors] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getDoctors()
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
  }, []);

  function handleSearch() {
    const query = search.trim();
    router.push(query ? `/services?search=${encodeURIComponent(query)}` : "/services");
  }

  function bookDoctor(doctor: Service) {
    selectService(doctor);
    router.push("/booking");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppNavbar />
      <HomeHero
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearch}
        onBrowseServices={() => router.push("/services")}
      />

      <main className="mx-auto max-w-6xl px-4 py-12">
        <section>
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Featured care</p>
              <h2 className="mt-1 text-3xl font-bold text-slate-900">Featured doctors</h2>
              <p className="mt-2 text-slate-600">Start with a trusted specialist, then choose a time that suits you.</p>
            </div>
            <Button variant="bordered" color="primary" endContent={<LuArrowRight />} onPress={() => router.push("/services")}>
              View all services
            </Button>
          </div>

          <DoctorGrid doctors={doctors.slice(0, 3)} loading={loading} onBook={bookDoctor} onReset={() => router.push("/services")} />
        </section>

        <HowItWorks />
        
        

        <Testimonials />

        <WhyChooseUs />

        <Band />
      </main>
      <HomeFooter />
    </div>
  );
}
