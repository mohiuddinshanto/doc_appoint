import { create } from "zustand";
import type { ServiceStore, ServiceStoreState, TimeSlot } from "../types";

const INITIAL_STATE: ServiceStoreState = {
  slotsByKey: {},
};

/** Caches time slots by service and date for the booking flow. */
export const useServiceStore = create<ServiceStore>()((set) => ({
  ...INITIAL_STATE,

  setSlots: (serviceId: string, date: string, slots: TimeSlot[]) =>
    set((state) => ({
      slotsByKey: {
        ...state.slotsByKey,
        [`${serviceId}::${date}`]: slots,
      },
    })),
}));
