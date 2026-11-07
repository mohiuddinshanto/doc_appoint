import { LuStethoscope } from "react-icons/lu";

export function HomeFooter() {
  return (
    <footer className="mt-20 sm:mt-24 border-t border-[#e4e7f2] bg-white py-9 sm:py-11 text-center text-xs sm:text-sm text-[#687089]">
      <div className="mx-auto max-w-[1120px] px-4 sm:px-6">
        <div className="mb-2.5 inline-flex items-center gap-2 text-base font-extrabold text-[#0b1020]">
          <LuStethoscope className="text-[#5b5bf0]" size={18} />
          <span>DocAppoint Health &amp; Wellness</span>
        </div>
        <p className="mb-2 text-sm text-[#687089]">
          Find verified specialists, choose convenient times, and manage bookings effortlessly.
        </p>
        <p className="text-xs text-[#99a0b8]">
          DocAppoint &copy; {new Date().getFullYear()}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
