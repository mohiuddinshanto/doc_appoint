"use client";

import { useRouter } from "next/navigation";
import { LuArrowRight } from "react-icons/lu";

export function CtaSection() {
  const router = useRouter();

  return (
    <section className="relative mt-28 overflow-hidden rounded-[32px] sm:rounded-[40px] bg-gradient-to-tr from-[#5b5bf0] via-[#8b5cf6] to-[#22d3ee] px-6 py-14 sm:py-[72px] text-center text-white shadow-xl">
      {/* Blurred Floating Circles */}
      <div
        className="animate-float-slow pointer-events-none absolute -left-[90px] -top-[120px] h-[340px] w-[340px] rounded-full bg-white/15 blur-sm"
        aria-hidden="true"
      />
      <div
        className="animate-float-slow-delayed pointer-events-none absolute -bottom-[140px] -right-[80px] h-[340px] w-[340px] rounded-full bg-white/15 blur-sm"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-xl">
        <h2 className="text-3xl sm:text-4xl md:text-[46px] font-extrabold tracking-tight leading-tight">
          Your next appointment is a minute away
        </h2>
        <p className="mt-3.5 mb-8 text-base sm:text-lg text-white/90">
          Find a specialist and take the first step toward better health.
        </p>
        <button
          type="button"
          onClick={() => router.push("/services")}
          className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-[15px] font-bold text-[#0b1020] shadow-[0_14px_30px_-10px_rgba(0,0,0,0.35)] transition-all hover:scale-105 hover:shadow-2xl"
        >
          <span>Find a doctor</span>
          <LuArrowRight size={17} />
        </button>
      </div>
    </section>
  );
}
