"use client";

import { useEffect, useState } from "react";
import { LuArrowRight } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { AppNavbar } from "@/components/layout/navbar";
import { HomeHero } from "./home-hero";
import { DoctorGrid } from "./doctor-grid";
import { SpecialtiesSection } from "./specialties-sec";
import { HowItWorks } from "./how-it-works";
import { HomeFooter } from "./home-footer";
import { FaqSection } from "./faq";
import { CtaSection } from "./cta";
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
    <div className="min-h-screen bg-[#f7f8fc]">
      <AppNavbar />
      <HomeHero
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearch}
        onBrowseServices={() => router.push("/services")}
      />

      <main className="mx-auto max-w-[1120px] px-6 py-14">
        {/* Featured Doctors Section */}
        <section>
          <div className="mb-9 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="mb-2.5 inline-block rounded-full bg-[#eef0ff] px-3.5 py-1 text-xs font-bold text-[#5b5bf0]">
                Featured care
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b1020] tracking-tight">
                Featured doctors
              </h2>
              <p className="mt-2 text-[#687089]">
                Start with a trusted specialist, then choose a time that suits you.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/services")}
              className="inline-flex items-center gap-2 rounded-full border border-[#e4e7f2] bg-white px-5 py-2.5 text-sm font-semibold text-[#0b1020] transition-all hover:border-[#5b5bf0] hover:text-[#5b5bf0]"
            >
              <span>View all services</span>
              <LuArrowRight size={16} />
            </button>
          </div>

          <DoctorGrid
            doctors={doctors.slice(0, 3)}
            loading={loading}
            onBook={bookDoctor}
            onReset={() => router.push("/services")}
          />
        </section>

        {/* Specialties Grid */}
        <SpecialtiesSection />

        {/* How It Works */}
        <HowItWorks />

        {/* Patient Testimonials */}
        <Testimonials />

        {/* Why Choose Us */}
        <WhyChooseUs />

        {/* Stats Band */}
        <Band />

        {/* FAQ Section */}
        <FaqSection />

        {/* CTA Banner */}
        <CtaSection />
      </main>

      <HomeFooter />
    </div>
  );
}
