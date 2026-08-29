//এটার মূল কাজ হলো ডাক্তার/সার্ভিসের data manage করা।

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
  selectedServiceId: null,
  filters: DEFAULT_FILTERS,
  isLoading: false,
  error: null,
};


export const useServiceStore = create<ServiceStore>()((set, get) => ({
  ...INITIAL_STATE,



  setServices: (services: Service[]) => set({ services }),

  // কোন ডাক্তার/সার্ভিস + কোন তারিখের slots পাওয়া গেছে, সেগুলো store-এ cache করে রাখা।
  setSlots: (serviceId: string, date: string, slots: TimeSlot[]) =>
    set((s) => ({
      slotsByKey: {
        ...s.slotsByKey,
        [`${serviceId}::${date}`]: slots,
      },
    })),

  setSelectedServiceId: (id: string | null) => set({ selectedServiceId: id }),

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
export const selectSelectedServiceId = (s: ServiceStore): string | null => s.selectedServiceId;
export const selectServiceIsLoading = (s: ServiceStore): boolean => s.isLoading;
export const selectServiceError = (s: ServiceStore): string | null => s.error;
