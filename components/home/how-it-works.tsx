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
    <section className="mt-28">
      <h2 className="text-center text-3xl sm:text-4xl font-extrabold text-[#0b1020] tracking-tight mb-10">
        How It Works
      </h2>
      <div className="grid gap-[22px] sm:grid-cols-3">
        {steps.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="rounded-[28px] border border-[#e4e7f2]/60 bg-white p-[30px] shadow-[0_1px_2px_rgba(11,16,32,0.04),0_8px_24px_-8px_rgba(40,40,120,0.10)] transition-transform hover:-translate-y-1"
          >
            <div className="mb-[22px] flex h-[50px] w-[50px] items-center justify-center rounded-[16px] bg-gradient-to-tr from-[#5b5bf0] via-[#8b5cf6] to-[#22d3ee] text-white shadow-[0_10px_22px_-8px_rgba(91,91,240,0.6)]">
              <Icon size={22} />
            </div>
            <h3 className="text-[19px] font-bold text-[#0b1020] mb-2">{title}</h3>
            <p className="text-sm text-[#687089] leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
