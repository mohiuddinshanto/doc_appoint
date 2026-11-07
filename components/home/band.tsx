import { LuUserCheck, LuCalendarCheck, LuStar, LuHeadphones } from "react-icons/lu";

export default function Band() {
  return (
    <section
      className="band-dark relative mt-20 sm:mt-28 w-full min-w-0 overflow-hidden rounded-[28px] sm:rounded-[36px] bg-[#0b1020] px-6 py-10 sm:px-10 sm:py-14 md:px-14 md:py-16 text-white shadow-2xl"
      style={{
        background:
          "radial-gradient(60% 120% at 0% 0%, rgba(91, 91, 240, 0.55), transparent 60%), radial-gradient(50% 120% at 100% 100%, rgba(34, 211, 238, 0.35), transparent 60%), #0b1020",
      }}
    >
      <div className="grid grid-cols-2 gap-5 sm:gap-8 md:grid-cols-4 w-full min-w-0">
        {/* Stat 1 */}
        <div className="flex flex-col min-w-0">
          <div className="mb-2 text-[#8184fa]">
            <LuUserCheck size={20} />
          </div>
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-extrabold tracking-tight leading-none text-white truncate">
            500+
          </p>
          <p className="mt-1.5 text-xs sm:text-sm text-white/70 font-semibold tracking-wide truncate">
            Doctors
          </p>
        </div>

        {/* Stat 2 */}
        <div className="flex flex-col min-w-0">
          <div className="mb-2 text-[#22d3ee]">
            <LuCalendarCheck size={20} />
          </div>
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-extrabold tracking-tight leading-none text-white truncate">
            50,000+
          </p>
          <p className="mt-1.5 text-xs sm:text-sm text-white/70 font-semibold tracking-wide truncate">
            Appointments Booked
          </p>
        </div>

        {/* Stat 3 */}
        <div className="flex flex-col min-w-0">
          <div className="mb-2 text-[#fbbf24]">
            <LuStar size={20} />
          </div>
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-extrabold tracking-tight leading-none text-white truncate">
            4.8★
          </p>
          <p className="mt-1.5 text-xs sm:text-sm text-white/70 font-semibold tracking-wide truncate">
            Average Rating
          </p>
        </div>

        {/* Stat 4 */}
        <div className="flex flex-col min-w-0">
          <div className="mb-2 text-[#a5aafd]">
            <LuHeadphones size={20} />
          </div>
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-extrabold tracking-tight leading-none text-white truncate">
            24/7
          </p>
          <p className="mt-1.5 text-xs sm:text-sm text-white/70 font-semibold tracking-wide truncate">
            Patient Support
          </p>
        </div>
      </div>
    </section>
  );
}
