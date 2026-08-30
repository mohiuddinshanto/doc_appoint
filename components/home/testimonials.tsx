// এই কম্পোনেন্টটি রোগীদের রিভিউ/ফিডব্যাক দেখানোর জন্য

import { FaStar } from "react-icons/fa";

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      <h2 className="mb-8 text-center text-3xl font-bold">What Patients Say</h2>

      <div className="grid gap-6 md:grid-cols-3">

        {/* রিভিউ কার্ড ১ */}
        <div className="rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex gap-1 text-amber-400">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
          </div>
          <p className="mt-4 text-gray-600">
            "Booking with Dr. Ayesha Rahman took less than two minutes. Reminder
            notifications were a nice touch."
          </p>
          <div className="mt-4 flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/100?img=32"
              alt="Sadia Hossain"
              className="h-10 w-10 rounded-full"
            />
            <div>
              <p className="text-sm font-semibold">Sadia Hossain</p>
              <p className="text-xs text-gray-400">Patient</p>
            </div>
          </div>
        </div>

        {/* রিভিউ কার্ড ২ */}
        <div className="rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex gap-1 text-amber-400">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
          </div>
          <p className="mt-4 text-gray-600">
            "Found a good pediatrician near Sher-e-Bangla Nagar within minutes.
            Slot availability was accurate."
          </p>
          <div className="mt-4 flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/100?img=12"
              alt="Rakibul Islam"
              className="h-10 w-10 rounded-full"
            />
            <div>
              <p className="text-sm font-semibold">Rakibul Islam</p>
              <p className="text-xs text-gray-400">Patient</p>
            </div>
          </div>
        </div>

        {/* রিভিউ কার্ড ৩ */}
        <div className="rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex gap-1 text-amber-400">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
          </div>
          <p className="mt-4 text-gray-600">
            "Rescheduling was simple and the whole process felt trustworthy from
            search to confirmation."
          </p>
          <div className="mt-4 flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/100?img=47"
              alt="Nusrat Jahan"
              className="h-10 w-10 rounded-full"
            />
            <div>
              <p className="text-sm font-semibold">Nusrat Jahan</p>
              <p className="text-xs text-gray-400">Patient</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}