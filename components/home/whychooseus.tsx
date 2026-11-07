import { LuShieldCheck, LuZap, LuLock, LuClock } from "react-icons/lu";

export default function WhyChooseUs() {
  return (
    <section className="mt-20 sm:mt-28 w-full min-w-0">
      <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0b1020] tracking-tight mb-8 sm:mb-10">
        Why Choose DocAppoint
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 w-full min-w-0">
        {/* Box 1 */}
        <div className="w-full min-w-0 rounded-[22px] sm:rounded-[26px] bg-[#eef0ff] p-5 sm:p-[26px] flex flex-col justify-between">
          <div className="mb-8 sm:mb-12 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-[12px] sm:rounded-[14px] bg-white text-[#5b5bf0] shadow-sm shrink-0">
            <LuShieldCheck size={20} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#0b1020] mb-1">Verified Doctors</h3>
            <p className="text-xs sm:text-sm text-[#687089] leading-relaxed">
              Every medical profile is thoroughly reviewed and verified before listing.
            </p>
          </div>
        </div>

        {/* Box 2 */}
        <div className="w-full min-w-0 rounded-[22px] sm:rounded-[26px] bg-[#e8fbff] p-5 sm:p-[26px] flex flex-col justify-between">
          <div className="mb-8 sm:mb-12 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-[12px] sm:rounded-[14px] bg-white text-[#06b6d4] shadow-sm shrink-0">
            <LuZap size={20} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#0b1020] mb-1">Instant Confirmation</h3>
            <p className="text-xs sm:text-sm text-[#687089] leading-relaxed">
              No queue, no waiting — your slot is locked in real-time immediately.
            </p>
          </div>
        </div>

        {/* Box 3 */}
        <div className="w-full min-w-0 rounded-[22px] sm:rounded-[26px] bg-[#f3eeff] p-5 sm:p-[26px] flex flex-col justify-between">
          <div className="mb-8 sm:mb-12 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-[12px] sm:rounded-[14px] bg-white text-[#8b5cf6] shadow-sm shrink-0">
            <LuLock size={20} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#0b1020] mb-1">Secure &amp; Private</h3>
            <p className="text-xs sm:text-sm text-[#687089] leading-relaxed">
              Your health information and contact details are strictly confidential.
            </p>
          </div>
        </div>

        {/* Box 4 */}
        <div className="w-full min-w-0 rounded-[22px] sm:rounded-[26px] bg-[#fff3e6] p-5 sm:p-[26px] flex flex-col justify-between">
          <div className="mb-8 sm:mb-12 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-[12px] sm:rounded-[14px] bg-white text-[#f97316] shadow-sm shrink-0">
            <LuClock size={20} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#0b1020] mb-1">24/7 Booking</h3>
            <p className="text-xs sm:text-sm text-[#687089] leading-relaxed">
              Book anytime, from anywhere, on your smartphone or computer.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
