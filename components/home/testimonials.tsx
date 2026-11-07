import Image from "next/image";
import { LuStar } from "react-icons/lu";

export default function Testimonials() {
  return (
    <section className="mt-28">
      <h2 className="text-center text-3xl sm:text-4xl font-extrabold text-[#0b1020] tracking-tight mb-10">
        What Patients Say
      </h2>

      <div className="grid gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
        {/* Card 1 */}
        <div className="flex flex-col justify-between gap-4 rounded-[28px] border border-[#e4e7f2]/60 bg-white p-7 shadow-[0_1px_2px_rgba(11,16,32,0.04),0_8px_24px_-8px_rgba(40,40,120,0.10)]">
          <div className="flex gap-1 text-[#f59e0b]">
            <LuStar className="fill-current" size={15} />
            <LuStar className="fill-current" size={15} />
            <LuStar className="fill-current" size={15} />
            <LuStar className="fill-current" size={15} />
            <LuStar className="fill-current" size={15} />
          </div>
          <p className="text-[15px] text-[#363c52] leading-relaxed">
            &ldquo;Booking with Dr. Ayesha Rahman took less than two minutes. The slot availability and reminders were a nice touch!&rdquo;
          </p>
          <div className="mt-auto flex items-center gap-3 pt-2">
            <div className="relative h-10 w-10 overflow-hidden rounded-[14px]">
              <Image
                src="https://i.pravatar.cc/100?img=32"
                alt="Sadia Hossain"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div>
              <p className="text-sm font-bold text-[#0b1020]">Sadia Hossain</p>
              <p className="text-xs text-[#687089]">Patient</p>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="flex flex-col justify-between gap-4 rounded-[28px] border border-[#e4e7f2]/60 bg-white p-7 shadow-[0_1px_2px_rgba(11,16,32,0.04),0_8px_24px_-8px_rgba(40,40,120,0.10)]">
          <div className="flex gap-1 text-[#f59e0b]">
            <LuStar className="fill-current" size={15} />
            <LuStar className="fill-current" size={15} />
            <LuStar className="fill-current" size={15} />
            <LuStar className="fill-current" size={15} />
            <LuStar className="fill-current" size={15} />
          </div>
          <p className="text-[15px] text-[#363c52] leading-relaxed">
            &ldquo;Found a top pediatrician near Sher-e-Bangla Nagar immediately. Slot availability was 100% accurate without waiting in clinic.&rdquo;
          </p>
          <div className="mt-auto flex items-center gap-3 pt-2">
            <div className="relative h-10 w-10 overflow-hidden rounded-[14px]">
              <Image
                src="https://i.pravatar.cc/100?img=12"
                alt="Rakibul Islam"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div>
              <p className="text-sm font-bold text-[#0b1020]">Rakibul Islam</p>
              <p className="text-xs text-[#687089]">Patient</p>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="flex flex-col justify-between gap-4 rounded-[28px] border border-[#e4e7f2]/60 bg-white p-7 shadow-[0_1px_2px_rgba(11,16,32,0.04),0_8px_24px_-8px_rgba(40,40,120,0.10)]">
          <div className="flex gap-1 text-[#f59e0b]">
            <LuStar className="fill-current" size={15} />
            <LuStar className="fill-current" size={15} />
            <LuStar className="fill-current" size={15} />
            <LuStar className="fill-current" size={15} />
            <LuStar className="fill-current" size={15} />
          </div>
          <p className="text-[15px] text-[#363c52] leading-relaxed">
            &ldquo;Rescheduling was smooth and the whole process felt trustworthy from search to confirmation. Highly recommended platform!&rdquo;
          </p>
          <div className="mt-auto flex items-center gap-3 pt-2">
            <div className="relative h-10 w-10 overflow-hidden rounded-[14px]">
              <Image
                src="https://i.pravatar.cc/100?img=47"
                alt="Nusrat Jahan"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div>
              <p className="text-sm font-bold text-[#0b1020]">Nusrat Jahan</p>
              <p className="text-xs text-[#687089]">Patient</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
