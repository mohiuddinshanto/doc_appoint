import { create } from "zustand";
import type { ServiceStore, ServiceStoreState, TimeSlot } from "../types";

const INITIAL_STATE: ServiceStoreState = {
  slotsByKey: {},
};

/** Caches time slots by service and date for the booking flow. */
export const useServiceStore = create<ServiceStore>()((set) => ({
  ...INITIAL_STATE,

  
//এর মূল কাজ হলো একটা নির্দিষ্ট service এবং date-এর available time slots-গুলো Zustand store-এ save/cache করে রাখা।
  setSlots: (serviceId: string, date: string, slots: TimeSlot[]) =>
    set((state) => ({
      slotsByKey: {
        ...state.slotsByKey,
        [`${serviceId}::${date}`]: slots,
      },
    })),
}));
