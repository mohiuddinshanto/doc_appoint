

import { FaShieldAlt, FaBolt, FaLock, FaClock } from "react-icons/fa";

export default function WhyChooseUs() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      <h2 className="mb-8 text-center text-3xl font-bold">Why Choose DocAppoint</h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

        {/* বক্স ১ */}
        <div className="flex flex-col items-center rounded-xl border border-gray-100 p-6 text-center shadow-sm">
          <FaShieldAlt className="text-3xl text-indigo-600" />
          <p className="mt-3 font-semibold">Verified Doctors</p>
          <p className="mt-1 text-sm text-gray-500">
            Every profile is checked before it goes live.
          </p>
        </div>

        {/* বক্স ২ */}
        <div className="flex flex-col items-center rounded-xl border border-gray-100 p-6 text-center shadow-sm">
          <FaBolt className="text-3xl text-indigo-600" />
          <p className="mt-3 font-semibold">Instant Confirmation</p>
          <p className="mt-1 text-sm text-gray-500">
            No waiting — your slot is locked in immediately.
          </p>
        </div>

        {/* বক্স ৩ */}
        <div className="flex flex-col items-center rounded-xl border border-gray-100 p-6 text-center shadow-sm">
          <FaLock className="text-3xl text-indigo-600" />
          <p className="mt-3 font-semibold">Secure & Private</p>
          <p className="mt-1 text-sm text-gray-500">
            Your health information stays protected.
          </p>
        </div>

        {/* বক্স ৪ */}
        <div className="flex flex-col items-center rounded-xl border border-gray-100 p-6 text-center shadow-sm">
          <FaClock className="text-3xl text-indigo-600" />
          <p className="mt-3 font-semibold">24/7 Booking</p>
          <p className="mt-1 text-sm text-gray-500">
            Book anytime, from anywhere, on any device.
          </p>
        </div>

      </div>
    </section>
  );
}