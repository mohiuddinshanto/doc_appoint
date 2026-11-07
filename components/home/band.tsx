import { LuUserCheck, LuCalendarCheck, LuStar, LuHeadphones } from "react-icons/lu";

export default function Band() {
  return (
    <section
      className="band-dark relative mt-28 overflow-hidden rounded-[36px] bg-[#0b1020] px-8 py-12 md:px-14 md:py-16 text-white shadow-2xl"
      style={{
        background:
          "radial-gradient(60% 120% at 0% 0%, rgba(91, 91, 240, 0.55), transparent 60%), radial-gradient(50% 120% at 100% 100%, rgba(34, 211, 238, 0.35), transparent 60%), #0b1020",
      }}
    >
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
        {/* Stat 1 */}
        <div className="flex flex-col">
          <div className="mb-2 text-[#8184fa]">
            <LuUserCheck size={22} />
          </div>
          <p className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight leading-none text-white">
            500+
          </p>
          <p className="mt-2 text-xs sm:text-sm text-white/70 font-semibold tracking-wide">
            Doctors
          </p>
        </div>

        {/* Stat 2 */}
        <div className="flex flex-col">
          <div className="mb-2 text-[#22d3ee]">
            <LuCalendarCheck size={22} />
          </div>
          <p className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight leading-none text-white">
            50,000+
          </p>
          <p className="mt-2 text-xs sm:text-sm text-white/70 font-semibold tracking-wide">
            Appointments Booked
          </p>
        </div>

        {/* Stat 3 */}
        <div className="flex flex-col">
          <div className="mb-2 text-[#fbbf24]">
            <LuStar size={22} />
          </div>
          <p className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight leading-none text-white">
            4.8★
          </p>
          <p className="mt-2 text-xs sm:text-sm text-white/70 font-semibold tracking-wide">
            Average Rating
          </p>
        </div>

        {/* Stat 4 */}
        <div className="flex flex-col">
          <div className="mb-2 text-[#a5aafd]">
            <LuHeadphones size={22} />
          </div>
          <p className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight leading-none text-white">
            24/7
          </p>
          <p className="mt-2 text-xs sm:text-sm text-white/70 font-semibold tracking-wide">
            Patient Support
          </p>
        </div>
      </div>
    </section>
  );
}
