import type { Service } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

// Gets doctors from Express backend and changes them into frontend Service data.
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
    // MongoDB owns document IDs. Do not invent a client-side fallback ID,
    // because it would not refer to a real doctor in the database.
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
      imageUrl: doctor.avatar || doctor.image || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
      availableDays: doctor.availableDays || [],
      tags: [category, "", doctor.location || "Clinic"],
    };
  });
}
