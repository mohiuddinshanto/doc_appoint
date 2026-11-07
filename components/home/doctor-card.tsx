"use client";

import Image from "next/image";
import { LuClock, LuMapPin, LuStar } from "react-icons/lu";
import type { Service } from "@/types";

type DoctorCardProps = {
  doctor: Service;
  onBook: (doctor: Service) => void;
};

export function DoctorCard({ doctor, onBook }: DoctorCardProps) {
  const fallbackImg =
    doctor.imageUrl && doctor.imageUrl.startsWith("http")
      ? doctor.imageUrl
      : "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80";

  return (
    <div className="group flex w-full min-w-0 max-w-full flex-col gap-4 overflow-hidden rounded-[24px] sm:rounded-[28px] border border-[#e4e7f2]/70 bg-white p-5 sm:p-[26px] shadow-[0_1px_2px_rgba(11,16,32,0.04),0_8px_24px_-8px_rgba(40,40,120,0.10)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_-12px_rgba(40,40,120,0.20)]">
      {/* Top Header */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <div className="relative h-[60px] w-[60px] sm:h-[68px] sm:w-[68px] shrink-0 overflow-hidden rounded-[18px] sm:rounded-[22px] bg-[#f0f2f9] border border-[#e4e7f2]">
          <Image
            src={fallbackImg}
            alt={doctor.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 60px, 68px"
            unoptimized
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-1 rounded-full bg-[#fff7e6] px-2 py-0.5 text-[11px] sm:text-xs font-bold text-[#b45309]">
            <LuStar className="text-[#f59e0b] fill-[#f59e0b]" size={11} />
            <span>{doctor.rating}</span>
            <span className="font-medium text-[#99a0b8]">({doctor.reviewCount})</span>
          </div>

          <h3 className="mt-1 truncate text-base sm:text-[18px] font-bold text-[#0b1020]">
            {doctor.name}
          </h3>
          <p className="truncate text-xs sm:text-[13px] font-bold text-[#5b5bf0]">
            {doctor.category}
          </p>
        </div>
      </div>

      {/* Doctor Bio */}
      <p className="line-clamp-2 text-xs sm:text-sm text-[#687089] leading-relaxed">
        {doctor.description}
      </p>

      {/* Details Box */}
      <div className="flex flex-col gap-2 rounded-[18px] bg-[#f7f8fc] p-3 sm:p-3.5 text-xs sm:text-[13px] text-[#4d546b] min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <LuMapPin className="text-[#5b5bf0] shrink-0" size={14} />
          <span className="truncate min-w-0 flex-1">
            {doctor.tags?.[2] || "Hospital / Medical Center"}
          </span>
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <LuClock className="text-[#5b5bf0] shrink-0" size={14} />
          <span className="truncate min-w-0 flex-1">
            {doctor.availableDays && doctor.availableDays.length > 0
              ? doctor.availableDays.join(", ")
              : "Mon, Wed, Fri (09:00 AM - 05:00 PM)"}
          </span>
        </div>
      </div>

      {/* Footer / Price & Action */}
      <div className="mt-auto flex items-center justify-between pt-2 gap-2 min-w-0">
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] sm:text-xs font-semibold text-[#99a0b8]">Fee</span>
          <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0b1020] truncate">
            ${doctor.price}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onBook(doctor)}
          className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-[#0b1020] px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all hover:bg-gradient-to-r hover:from-[#5b5bf0] hover:to-[#8b5cf6] hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap shrink-0"
        >
          <LuClock size={14} />
          <span>Book Slot</span>
        </button>
      </div>
    </div>
  );
}
