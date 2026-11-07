"use client";

import { FormEvent } from "react";
import { LuArrowRight, LuHeart, LuSearch, LuCalendarCheck, LuStar } from "react-icons/lu";

type HomeHeroProps = {
  search: string;
  setSearch: (value: string) => void;
  handleSearch: () => void;
  onBrowseServices: () => void;
};

export function HomeHero({
  search,
  setSearch,
  handleSearch,
  onBrowseServices,
}: HomeHeroProps) {
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    handleSearch();
  }

  return (
    <section className="hero-mesh relative -mt-[74px] overflow-hidden pt-[170px] pb-[110px] text-center bg-white">
      {/* Subtle Dot Grid Mask Pattern */}
      <div
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(11,16,32,0.07)_1px,transparent_1px)] [background-size:26px_26px] [mask-image:linear-gradient(#000_30%,transparent_90%)]"
        aria-hidden="true"
      />

      {/* Floating Info Cards (Hidden on small screens) */}
      <div className="hidden xl:flex animate-float absolute left-[5%] top-[44%] z-10 items-center gap-3 rounded-[20px] border border-white bg-white/85 p-3 pr-4.5 text-left text-[13px] leading-snug shadow-[0_24px_60px_-12px_rgba(40,40,120,0.25)] backdrop-blur-md">
        <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[13px] bg-gradient-to-tr from-[#5b5bf0] via-[#8b5cf6] to-[#22d3ee] text-white">
          <LuCalendarCheck size={18} />
        </div>
        <div>
          <b className="block text-sm font-extrabold text-[#0b1020]">Slot confirmed</b>
          <span className="text-[#687089]">Mon, 9:00 AM</span>
        </div>
      </div>

      <div className="hidden xl:flex animate-float-delayed absolute right-[5%] top-[36%] z-10 items-center gap-3 rounded-[20px] border border-white bg-white/85 p-3 pr-4.5 text-left text-[13px] leading-snug shadow-[0_24px_60px_-12px_rgba(40,40,120,0.25)] backdrop-blur-md">
        <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[13px] bg-gradient-to-tr from-[#10b981] to-[#22d3ee] text-white">
          <LuStar size={18} />
        </div>
        <div>
          <b className="block text-sm font-extrabold text-[#0b1020]">4.9 rating</b>
          <span className="text-[#687089]">From 2,000+ patients</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="relative mx-auto max-w-[1120px] px-6">
        {/* Trust Tag */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#e4e7f2] bg-white/75 px-4 py-1.5 text-[13px] font-semibold text-[#2b2b9e] shadow-sm backdrop-blur-md mb-6">
          <LuHeart className="text-[#e11d48]" size={15} />
          <span>Trusted Healthcare Booking Platform</span>
        </div>

        {/* Hero Title */}
        <h1 className="mx-auto max-w-[12em] text-[40px] sm:text-[56px] md:text-[68px] font-extrabold tracking-[-0.045em] leading-[1.02] bg-gradient-to-b from-[#0b1020] via-[#0b1020] to-[#3b3f8f] bg-clip-text text-transparent">
          Find &amp; Book Top-Rated Doctors
        </h1>

        {/* Hero Subtitle */}
        <p className="mx-auto mt-5 max-w-[32em] text-lg sm:text-[19px] text-[#687089] leading-relaxed">
          Choose a doctor, pick a time, and confirm your appointment instantly.
        </p>

        {/* Search Box */}
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-9 flex max-w-[660px] flex-col sm:flex-row gap-2 rounded-[28px] sm:rounded-full border border-[#e4e7f2] bg-white p-2 shadow-[0_24px_60px_-12px_rgba(40,40,120,0.25)]"
        >
          <div className="flex flex-1 items-center gap-3 px-4 py-2 sm:py-0">
            <LuSearch className="text-[#99a0b8]" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search doctor or specialty (e.g., Cardiology, Pediatrician)"
              className="w-full bg-transparent text-[15px] text-[#0b1020] placeholder-[#99a0b8] outline-none"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0b1020] px-7 py-3 text-[15px] font-semibold text-white shadow-md transition-all hover:bg-gradient-to-r hover:from-[#5b5bf0] hover:to-[#8b5cf6] hover:shadow-lg"
          >
            <LuSearch size={16} />
            <span>Search</span>
          </button>
        </form>

        {/* Quick Link */}
        <button
          type="button"
          onClick={onBrowseServices}
          className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#5b5bf0] transition-colors hover:text-[#4747d6]"
        >
          <span>Browse all doctors &amp; services</span>
          <LuArrowRight className="transition-transform group-hover:translate-x-1" size={16} />
        </button>
      </div>
    </section>
  );
}
