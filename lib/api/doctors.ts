import type { Service } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

//ডাক্তারদের তথ্য পাওয়ার জন্য একটি ফাংশন যা সার্চ এবং বিশেষত্বের ভিত্তিতে ডাক্তারদের তালিকা ফেরত দেয়।
// আর এটি যেহেতু একটি অ্যাসিঙ্ক্রোনাস ফাংশন, তাই এটি একটি প্রমিস রিটার্ন করে যা ডাক্তারদের সার্ভিসের অ্যারে প্রদান করে।
export async function getDoctors(search = "", specialty = ""): Promise<Service[]> {
  const params = new URLSearchParams();
  if (search) {
    params.append("search", search);
  }
  if (specialty && specialty !== "All Specialties") {
    params.append("specialty", specialty);
  }
  const queryString = params.toString();
  const url = queryString ? `${API_URL}/doctors?${queryString}` : `${API_URL}/doctors`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Could not load doctors");
  }

  const doctors = await response.json();

  return doctors.map((doctor: any) => {
    // ডক্টর অবজেক্টের _id প্রপার্টি চেক করা হচ্ছে। যদি এটি স্ট্রিং না হয় বা অনুপস্থিত থাকে, তাহলে একটি এরর থ্রো করা হচ্ছে।
    if (typeof doctor._id !== "string" || !doctor._id) {
      throw new Error("A doctor returned by the API is missing its MongoDB _id.");
    }

    const category = doctor.specialty || "General Medicine";

    return {
      id: doctor._id,
      name: doctor.name || "Doctor",
      providerId: doctor._id,
      providerName: doctor.title || "Specialist",
      category: category,
      description: doctor.bio || doctor.description || "Experienced medical specialist.",
      durationMinutes: 30,
      price: doctor.price || doctor.fee || 120,
      currency: doctor.currency || "USD",
      rating: doctor.rating || 4.9,
      reviewCount: doctor.reviewCount || doctor.reviewsCount || 0,
      imageUrl: doctor.avatar || doctor.image || "...",

      availableDays: doctor.availability || [],

      tags: [category, "", doctor.location || "Clinic"],
    };
  });
}
