import { LuShieldCheck, LuZap, LuLock, LuClock } from "react-icons/lu";

export default function WhyChooseUs() {
  return (
    <section className="mt-28">
      <h2 className="text-center text-3xl sm:text-4xl font-extrabold text-[#0b1020] tracking-tight mb-10">
        Why Choose DocAppoint
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Box 1 */}
        <div className="rounded-[26px] bg-[#eef0ff] p-[26px] flex flex-col justify-between">
          <div className="mb-12 flex h-11 w-11 items-center justify-center rounded-[14px] bg-white text-[#5b5bf0] shadow-sm">
            <LuShieldCheck size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0b1020] mb-1.5">Verified Doctors</h3>
            <p className="text-sm text-[#687089]">
              Every medical profile is thoroughly reviewed and verified before listing.
            </p>
          </div>
        </div>

        {/* Box 2 */}
        <div className="rounded-[26px] bg-[#e8fbff] p-[26px] flex flex-col justify-between">
          <div className="mb-12 flex h-11 w-11 items-center justify-center rounded-[14px] bg-white text-[#06b6d4] shadow-sm">
            <LuZap size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0b1020] mb-1.5">Instant Confirmation</h3>
            <p className="text-sm text-[#687089]">
              No queue, no waiting — your slot is locked in real-time immediately.
            </p>
          </div>
        </div>

        {/* Box 3 */}
        <div className="rounded-[26px] bg-[#f3eeff] p-[26px] flex flex-col justify-between">
          <div className="mb-12 flex h-11 w-11 items-center justify-center rounded-[14px] bg-white text-[#8b5cf6] shadow-sm">
            <LuLock size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0b1020] mb-1.5">Secure &amp; Private</h3>
            <p className="text-sm text-[#687089]">
              Your health information and contact details are strictly confidential.
            </p>
          </div>
        </div>

        {/* Box 4 */}
        <div className="rounded-[26px] bg-[#fff3e6] p-[26px] flex flex-col justify-between">
          <div className="mb-12 flex h-11 w-11 items-center justify-center rounded-[14px] bg-white text-[#f97316] shadow-sm">
            <LuClock size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0b1020] mb-1.5">24/7 Booking</h3>
            <p className="text-sm text-[#687089]">
              Book anytime, from anywhere, on your smartphone or computer.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
