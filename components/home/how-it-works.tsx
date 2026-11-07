import { LuCalendar, LuShieldCheck, LuStethoscope } from "react-icons/lu";

const steps = [
  {
    icon: LuStethoscope,
    title: "1. Choose a Doctor",
    text: "Search by specialty, location, or ratings to find the right healthcare specialist.",
  },
  {
    icon: LuCalendar,
    title: "2. Pick Date & Time",
    text: "View real-time slot availability for the next 7 days and choose what fits your calendar.",
  },
  {
    icon: LuShieldCheck,
    title: "3. Confirm Booking",
    text: "Fill in basic patient details and receive instant email confirmation & reminder.",
  },
];

export function HowItWorks() {
  return (
    <section className="mt-20 sm:mt-28 w-full min-w-0">
      <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0b1020] tracking-tight mb-8 sm:mb-10">
        How It Works
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-[22px] w-full min-w-0">
        {steps.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="w-full min-w-0 rounded-[24px] sm:rounded-[28px] border border-[#e4e7f2]/60 bg-white p-6 sm:p-[30px] shadow-[0_1px_2px_rgba(11,16,32,0.04),0_8px_24px_-8px_rgba(40,40,120,0.10)] transition-transform hover:-translate-y-1"
          >
            <div className="mb-4 sm:mb-[22px] flex h-[46px] w-[46px] sm:h-[50px] sm:w-[50px] items-center justify-center rounded-[14px] sm:rounded-[16px] bg-gradient-to-tr from-[#5b5bf0] via-[#8b5cf6] to-[#22d3ee] text-white shadow-[0_10px_22px_-8px_rgba(91,91,240,0.6)] shrink-0">
              <Icon size={20} />
            </div>
            <h3 className="text-base sm:text-[19px] font-bold text-[#0b1020] mb-1.5 sm:mb-2">{title}</h3>
            <p className="text-xs sm:text-sm text-[#687089] leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
