//এটার মূল কাজ হলো সার্ভিসের data, filter এবং time slot-এর data manage করার Store।
//ই Store-এ store আছে [services, slotsByKey, filters, isLoading, error]।
// এবং action আছে [setServices, setSlots, updateFilters, resetFilters, getFilteredServices, getSlotsForServiceAndDate, getAllCategories, setLoading, setError]।

import { create } from "zustand";
import type {
  Service,
  ServiceFilters,
  ServiceStore,
  ServiceStoreState,
  TimeSlot,
} from "../types";


const DEFAULT_FILTERS: ServiceFilters = {
  query: "",
  category: null,
  maxPrice: null,
  minRating: null,
  sortBy: "rating",
  sortDirection: "desc",
};

const INITIAL_STATE: ServiceStoreState = {
  services: [],
  slotsByKey: {},
  filters: DEFAULT_FILTERS,
  isLoading: false,
  error: null,
};


export const useServiceStore = create<ServiceStore>()((set, get) => ({
  ...INITIAL_STATE,


//`setServices()` যোগ করেছি — **API থেকে পাওয়া ডাক্তার/সার্ভিসের তালিকা Zustand store-এ সংরক্ষণ করার জন্য, যাতে Home ও Services পেজে সেই data দেখানো এবং search/filter করা যায়।

  setServices: (services: Service[]) => set({ services }),

  // setSlots() যোগ করেছি — নির্দিষ্ট service/doctor ও date-এর time slots serviceId::date key অনুযায়ী slotsByKey-এ সংরক্ষণ করার জন্য, যাতে পরে সহজে সেই date-এর slots খুঁজে ব্যবহার করা যায়।
  setSlots: (serviceId: string, date: string, slots: TimeSlot[]) =>
    set((s) => ({
      slotsByKey: {
        ...s.slotsByKey,
        [`${serviceId}::${date}`]: slots,
      },
    })),

  //যখন কোনো filter পরিবর্তন করবে, সেই নতুন filter-এর value Zustand Store-এ update করে রাখা।
  updateFilters: (patch: Partial<ServiceFilters>) =>
    set((s) => ({ filters: { ...s.filters, ...patch } })),

  resetFilters: () => set({ filters: DEFAULT_FILTERS }),

  // Search এবং filter অনুযায়ী services থেকে শুধু matching services বের করা।
  getFilteredServices: (): Service[] => {
    const { services, filters } = get();
    const q = filters.query.trim().toLowerCase();

    
    const filtered = services.filter((svc) => {
      // নাম, description, category এবং tags-এর মধ্যে search করা।
      if (q) {
        const haystack = [
          svc.name,
          svc.description,
          svc.category,
          ...(svc.tags ?? []),
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

       // Category অনুযায়ী filter করা
      if (filters.category && svc.category !== filters.category) return false;

      // Price অনুযায়ী filter করা
      if (filters.maxPrice !== null && svc.price > filters.maxPrice) return false;

      // Rating অনুযায়ী filter করা
      if (filters.minRating !== null && svc.rating < filters.minRating) return false;

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let tulona = 0;

      if (filters.sortBy === "name") {
        tulona = a.name.localeCompare(b.name);

      } else if (filters.sortBy === "price") {
        tulona = a.price - b.price;

      } else if (filters.sortBy === "rating") {
        tulona = a.rating - b.rating;

      } else if (filters.sortBy === "duration") {
        tulona = a.durationMinutes - b.durationMinutes;
      }
      return filters.sortDirection === "asc" ? tulona : -tulona;
    });

    return filtered;
  },

  //একজন নির্দিষ্ট doctor-এর নির্দিষ্ট তারিখের সব slot বের করা।
  getSlotsForServiceAndDate: (serviceId: string, date: string): TimeSlot[] =>
    get().slotsByKey[`${serviceId}::${date}`] ?? [],

  //যত ডাক্তার আছে, তাদের category-গুলো বের করে দেওয়া। এখানে Set ব্যবহার করা হয়েছে যাতে duplicate category না আসে। তারপর sort করে দেওয়া হয়েছে যাতে alphabetical order-এ আসে।
  getAllCategories: (): string[] =>
    [...new Set(get().services.map((s) => s.category))].sort(),



  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
}));



export const selectServices = (s: ServiceStore): Service[] => s.services;
export const selectFilters = (s: ServiceStore): ServiceFilters => s.filters;
export const selectServiceIsLoading = (s: ServiceStore): boolean => s.isLoading;
export const selectServiceError = (s: ServiceStore): string | null => s.error;
