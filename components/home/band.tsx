
import { FaUserMd, FaCalendarCheck, FaStar, FaHeadset } from "react-icons/fa";
 
export default function Band() {
  return (
    <section className="mt-10 py-10">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 md:grid-cols-4">
 
        {/* প্রথম বক্স - ডাক্তারের সংখ্যা */}
        <div className="flex flex-col items-center rounded-xl border border-gray-100 py-6 text-center shadow-sm">
          <FaUserMd className="text-2xl text-blue-600" />
          <p className="mt-2 text-2xl font-bold text-gray-900">500+</p>
          <p className="text-sm text-gray-500">Doctors</p>
        </div>
 
        {/* দ্বিতীয় বক্স - বুকিং সংখ্যা */}
        <div className="flex flex-col items-center rounded-xl border border-gray-100 py-6 text-center shadow-sm">
          <FaCalendarCheck className="text-2xl text-blue-600" />
          <p className="mt-2 text-2xl font-bold text-gray-900">50,000+</p>
          <p className="text-sm text-gray-500">Appointments Booked</p>
        </div>
 
        {/* তৃতীয় বক্স - গড় রেটিং */}
        <div className="flex flex-col items-center rounded-xl border border-gray-100 py-6 text-center shadow-sm">
          <FaStar className="text-2xl text-blue-600" />
          <p className="mt-2 text-2xl font-bold text-gray-900">4.8★</p>
          <p className="text-sm text-gray-500">Average Rating</p>
        </div>
 
        {/* চতুর্থ বক্স - সাপোর্ট */}
        <div className="flex flex-col items-center rounded-xl border border-gray-100 py-6 text-center shadow-sm">
          <FaHeadset className="text-2xl text-blue-600" />
          <p className="mt-2 text-2xl font-bold text-gray-900">24/7</p>
          <p className="text-sm text-gray-500">Support</p>
        </div>
 
      </div>
    </section>
  );
}