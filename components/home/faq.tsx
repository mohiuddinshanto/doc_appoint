"use client";

import { useState } from "react";
import { LuPlus, LuMinus } from "react-icons/lu";

const FAQS = [
  {
    q: "How do I book an appointment?",
    a: "Choose a doctor, pick a date and time, then enter your contact details. Your booking is confirmed instantly.",
  },
  {
    q: "Can I cancel or change a booking?",
    a: "Yes. Open My Appointments and cancel any upcoming booking. The slot is released for other patients right away.",
  },
  {
    q: "Are the doctors verified?",
    a: "Every profile is reviewed before it is listed, so you can book with confidence.",
  },
  {
    q: "Will I get a confirmation?",
    a: "You receive an email confirmation with the doctor, date and time as soon as you finish booking.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mx-auto mt-28 max-w-[760px]">
      <h2 className="text-center text-3xl sm:text-4xl font-extrabold text-[#0b1020] tracking-tight mb-10">
        Common questions
      </h2>

      <div className="flex flex-col gap-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={faq.q}
              className="overflow-hidden rounded-[22px] border border-[#e4e7f2]/60 bg-white shadow-[0_1px_2px_rgba(11,16,32,0.04),0_8px_24px_-8px_rgba(40,40,120,0.10)] transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-left font-bold text-[#0b1020]"
              >
                <span className="text-base sm:text-lg">{faq.q}</span>
                <span
                  className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-sm font-bold transition-transform ${
                    isOpen
                      ? "bg-[#0b1020] text-white"
                      : "bg-[#f0f2f9] text-[#687089]"
                  }`}
                >
                  {isOpen ? <LuMinus size={14} /> : <LuPlus size={14} />}
                </span>
              </button>
              {isOpen && (
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm text-[#687089] leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
