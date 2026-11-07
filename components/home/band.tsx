export default function Band() {
  return (
    <section className="mt-28 rounded-[36px] bg-[radial-gradient(60%_120%_at_0%_0%,rgba(91,91,240,0.5),transparent_60%),radial-gradient(50%_120%_at_100%_100%,rgba(34,211,238,0.3),transparent_60%),#0b1020] px-8 py-12 md:px-12 md:py-14 text-white shadow-xl">
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {/* Stat 1 */}
        <div className="flex flex-col">
          <p className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight leading-none">
            500+
          </p>
          <p className="mt-2 text-xs sm:text-sm text-white/60 font-medium">
            Doctors
          </p>
        </div>

        {/* Stat 2 */}
        <div className="flex flex-col">
          <p className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight leading-none">
            50,000+
          </p>
          <p className="mt-2 text-xs sm:text-sm text-white/60 font-medium">
            Appointments Booked
          </p>
        </div>

        {/* Stat 3 */}
        <div className="flex flex-col">
          <p className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight leading-none">
            4.8★
          </p>
          <p className="mt-2 text-xs sm:text-sm text-white/60 font-medium">
            Average Rating
          </p>
        </div>

        {/* Stat 4 */}
        <div className="flex flex-col">
          <p className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight leading-none">
            24/7
          </p>
          <p className="mt-2 text-xs sm:text-sm text-white/60 font-medium">
            Patient Support
          </p>
        </div>
      </div>
    </section>
  );
}
